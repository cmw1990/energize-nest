import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"; // Added Select imports
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"; // Added Command imports
import { 
  PlusCircle, 
  Trash2, 
  Copy, 
  Save, 
  Info, 
  FileSpreadsheet,
  Calculator,
  ChevronDown,
  ChevronUp,
  Loader2 // Added Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query'; // Added useQuery
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Added Popover components

// Use the same SelectedFoodData interface from FoodLogForm
interface EdamamMeasure {
  uri: string;
  label: string;
  weight: number;
  qualified?: { qualifiers: { label: string; uri: string }[] }[];
}

interface SelectedFoodData {
  name: string;
  foodId: string;
  calories: number; // Per 100g
  protein: number; // Per 100g
  carbs: number; // Per 100g
  fat: number; // Per 100g
  fiber?: number; // Per 100g
  brand?: string;
  category?: string;
  categoryLabel?: string;
  image?: string;
  measures: EdamamMeasure[];
}

// Interface for ingredients stored in the DB (assuming schema update)
interface RecipeIngredient {
  id: string;
  recipe_id: string;
  name: string; // Display name
  quantity: number;
  unit: string; // User-selected unit label (e.g., "cup", "tbsp", "g")
  food_api_id?: string | null; // ID from Edamam/OFF
  selected_measure_uri?: string | null; // URI of the selected measure
  // Base nutrients per 100g (fetched if food_api_id exists) - Optional, could be fetched on demand
  base_calories_per_100g?: number | null;
  base_protein_per_100g?: number | null;
  base_carbs_per_100g?: number | null;
  base_fat_per_100g?: number | null;
  base_fiber_per_100g?: number | null;
  // We will calculate calories, protein, carbs, fat dynamically
}

interface Recipe {
  id: string;
  user_id: string;
  name: string;
  servings: number;
  prep_time: number;
  cook_time: number;
  instructions: string;
  is_favorite: boolean;
  created_at: string;
}

export const RecipeCalculator = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]); // Use new interface
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  
  const [newRecipe, setNewRecipe] = useState<Omit<Recipe, 'id' | 'user_id' | 'created_at' | 'is_favorite'>>({
    name: '',
    servings: 4,
    prep_time: 15,
    cook_time: 30,
    instructions: '',
  });
  
  // State for the ingredient being added/edited
  const [currentIngredient, setCurrentIngredient] = useState<{
    name: string;
    quantity: number;
    unit: string; // This will be the selected measure label
    selectedMeasureUri?: string | null; // URI for calculation
    foodApiId?: string | null; // ID for fetching/recalculation
    // Store base nutrients if fetched, or allow manual override
    calories?: number | null; 
    protein?: number | null;
    carbs?: number | null;
    fat?: number | null;
    fiber?: number | null;
    // Store the fetched detailed data temporarily
    fetchedFoodData?: SelectedFoodData | null; 
  }>({
    name: '',
    quantity: 1,
    unit: 'unit', // Default unit
    selectedMeasureUri: null,
    foodApiId: null,
    calories: null, protein: null, carbs: null, fat: null, fiber: null,
    fetchedFoodData: null,
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  // Use useQuery for ingredient search, similar to FoodLogForm
  const { data: searchResults, isLoading: isSearching } = useQuery<{ foods: SelectedFoodData[] }>({
      queryKey: ['ingredient-search', searchTerm],
      queryFn: async () => {
          if (!searchTerm || searchTerm.length < 3) return { foods: [] };
          console.log(`Searching ingredients for: ${searchTerm}`);
          try {
              const { data, error } = await supabase.functions.invoke('food-database-search', {
                  body: JSON.stringify({ query: searchTerm })
              });
              if (error) throw new Error(`Function error: ${error.message}`);
              if (!data || !Array.isArray(data.foods)) return { foods: [] };
              return data;
          } catch (e) {
              console.error('Error searching ingredients:', e);
              toast({ title: "Search Error", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
              return { foods: [] };
          }
      },
      enabled: searchTerm.length > 2,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
  });
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const [ingredientSearchPopoverOpen, setIngredientSearchPopoverOpen] = useState(false);
  
  useEffect(() => {
    if (session?.user?.id) {
      fetchRecipes();
    }
  }, [session]);
  
  useEffect(() => {
    if (selectedRecipe) {
      fetchIngredients(selectedRecipe.id);
    } else {
      setIngredients([]); // Clear ingredients if no recipe selected
    }
  }, [selectedRecipe]);
  
  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };
  
  const fetchIngredients = async (recipeId: string) => {
    try {
      const { data, error } = await supabase
        .from('recipe_ingredients')
        .select('*')
        .eq('recipe_id', recipeId);
      
      if (error) throw error;
      
      setIngredients(data || []);
      // Reset cache when ingredients are fetched for a new recipe
      setIngredientDetailsCache({}); 
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      setIngredients([]); // Clear ingredients on error
    }
  };
  
  // searchIngredient function is now handled by useQuery
  
  // Function to handle selecting a food item from search results
  const selectSearchResult = (food: SelectedFoodData) => {
      console.log("Selected ingredient search result:", food);
      // Set the temporary state with fetched data
      const defaultMeasure = food.measures.find(m => m.label.toLowerCase().includes('serving')) || food.measures[0];
      setCurrentIngredient({
          name: food.name,
          quantity: 1, // Default quantity
          unit: defaultMeasure?.label || 'unit', // Default to first measure label
          selectedMeasureUri: defaultMeasure?.uri || null, // Default to first measure URI
          foodApiId: food.foodId,
          // Store base nutrients per 100g from the fetched data
          calories: food.calories, 
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          fiber: food.fiber,
          fetchedFoodData: food, // Keep the full data temporarily
      });
      
      setIngredientSearchPopoverOpen(false); // Close popover
      setSearchTerm(food.name); // Update search input display
      setShowIngredientForm(true); // Ensure form fields are visible
  };
  
  // Updated addIngredient to use the new structure and state
  const addIngredient = async () => {
      if (!selectedRecipe || !currentIngredient.name || !currentIngredient.selectedMeasureUri) {
          toast({ title: "Missing Information", description: "Please select an ingredient and serving size.", variant: "destructive" });
          return;
      };

      // Construct the payload based on the conceptual schema update
      const ingredientPayload = {
          recipe_id: selectedRecipe.id,
          name: currentIngredient.name, // Display name
          quantity: currentIngredient.quantity,
          unit: currentIngredient.unit, // The selected measure label
          food_api_id: currentIngredient.foodApiId,
          selected_measure_uri: currentIngredient.selectedMeasureUri,
          // Store base nutrients if available (optional, could be fetched on demand)
          base_calories_per_100g: currentIngredient.fetchedFoodData?.calories,
          base_protein_per_100g: currentIngredient.fetchedFoodData?.protein,
          base_carbs_per_100g: currentIngredient.fetchedFoodData?.carbs,
          base_fat_per_100g: currentIngredient.fetchedFoodData?.fat,
          base_fiber_per_100g: currentIngredient.fetchedFoodData?.fiber,
      };

      console.log("Adding ingredient with payload:", ingredientPayload);

      try {
          const { data, error } = await supabase
              .from('recipe_ingredients')
              .insert(ingredientPayload)
              .select()
              .single();

          if (error) throw error;

          // Important: The returned 'data' might not match RecipeIngredient exactly
          // if the DB schema isn't updated yet. We cast it for now.
          setIngredients([...ingredients, data as RecipeIngredient]); 
          resetIngredientForm();

          toast({
              title: "Ingredient added",
              description: `${currentIngredient.name} has been added to your recipe`,
          });
      } catch (error) {
          console.error('Error adding ingredient:', error);
          toast({
              title: "Error adding ingredient",
              description: "There was a problem saving this ingredient. Check console for details.",
              variant: "destructive",
          });
      }
  };
  
  const removeIngredient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setIngredients(ingredients.filter(ing => ing.id !== id));
      
      toast({
        title: "Ingredient removed",
        description: "The ingredient has been removed from your recipe",
      });
    } catch (error) {
      console.error('Error removing ingredient:', error);
    }
  };
  
  const createRecipe = async () => {
    if (!newRecipe.name || !session?.user?.id) {
      toast({
        title: "Recipe name required",
        description: "Please provide a name for your recipe",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          user_id: session.user.id,
          name: newRecipe.name,
          servings: newRecipe.servings,
          prep_time: newRecipe.prep_time,
          cook_time: newRecipe.cook_time,
          instructions: newRecipe.instructions,
          is_favorite: false,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setRecipes([data, ...recipes]);
      setSelectedRecipe(data);
      setIsCreatingRecipe(false);
      resetRecipeForm();
      
      toast({
        title: "Recipe created",
        description: "Your new recipe has been created successfully",
      });
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast({
        title: "Error creating recipe",
        description: "There was a problem saving your recipe",
        variant: "destructive",
      });
    }
  };
  
  const updateRecipe = async (updates: Partial<Recipe>) => {
    if (!selectedRecipe) return;
    
    try {
      const { data, error } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', selectedRecipe.id)
        .eq('user_id', session?.user?.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setSelectedRecipe(data);
      setRecipes(recipes.map(recipe => 
        recipe.id === data.id ? data : recipe
      ));
      
      // No toast here for inline edits, maybe add a save button later
      // toast({
      //   title: "Recipe updated",
      //   description: "Your recipe has been updated successfully",
      // });
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };
  
  const deleteRecipe = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    
    try {
      // First delete all ingredients
      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', id);
      
      if (ingredientsError) throw ingredientsError;
      
      // Then delete the recipe
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)
        .eq('user_id', session?.user?.id);
      
      if (error) throw error;
      
      setRecipes(recipes.filter(recipe => recipe.id !== id));
      
      if (selectedRecipe && selectedRecipe.id === id) {
        setSelectedRecipe(null);
        setIngredients([]);
      }
      
      toast({
        title: "Recipe deleted",
        description: "Your recipe has been deleted",
      });
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        title: "Error deleting recipe",
        description: "There was a problem deleting your recipe",
        variant: "destructive",
      });
    }
  };
  
  const duplicateRecipe = async (recipeId: string) => {
    try {
      // Get the recipe
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe || !session?.user?.id) return;
      
      // Create a new recipe
      const { data: newRecipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          user_id: session.user.id,
          name: `${recipe.name} (Copy)`,
          servings: recipe.servings,
          prep_time: recipe.prep_time,
          cook_time: recipe.cook_time,
          instructions: recipe.instructions,
          is_favorite: false,
        })
        .select()
        .single();
      
      if (recipeError) throw recipeError;
      
      // Get all ingredients
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .select('*')
        .eq('recipe_id', recipeId);
      
      if (ingredientsError) throw ingredientsError;
      
      if (ingredientsData && ingredientsData.length > 0) {
        // Create new ingredients for the new recipe, preserving necessary fields
        const newIngredients = ingredientsData.map(ing => ({
          recipe_id: newRecipeData.id,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          food_api_id: ing.food_api_id, // Copy identifier
          selected_measure_uri: ing.selected_measure_uri, // Copy selected measure
          // Copy base nutrients if they were stored (optional)
          base_calories_per_100g: ing.base_calories_per_100g,
          base_protein_per_100g: ing.base_protein_per_100g,
          base_carbs_per_100g: ing.base_carbs_per_100g,
          base_fat_per_100g: ing.base_fat_per_100g,
          base_fiber_per_100g: ing.base_fiber_per_100g,
        }));
        
        const { error: newIngredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(newIngredients);
        
        if (newIngredientsError) throw newIngredientsError;
      }
      
      // Update state
      setRecipes([newRecipeData, ...recipes]);
      
      toast({
        title: "Recipe duplicated",
        description: "Your recipe has been duplicated successfully",
      });
    } catch (error) {
      console.error('Error duplicating recipe:', error);
      toast({
        title: "Error duplicating recipe",
        description: "There was a problem duplicating your recipe",
        variant: "destructive",
      });
    }
  };
  
  const toggleFavorite = async (recipe: Recipe) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .update({ is_favorite: !recipe.is_favorite })
        .eq('id', recipe.id)
        .eq('user_id', session?.user?.id);
      
      if (error) throw error;
      
      // Update recipes list
      setRecipes(recipes.map(r => 
        r.id === recipe.id ? { ...r, is_favorite: !r.is_favorite } : r
      ));
      
      // Update selected recipe if needed
      if (selectedRecipe?.id === recipe.id) {
        setSelectedRecipe({ ...selectedRecipe, is_favorite: !selectedRecipe.is_favorite });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
  // Updated resetIngredientForm
  const resetIngredientForm = () => {
      setCurrentIngredient({
          name: '',
          quantity: 1,
          unit: 'unit',
          selectedMeasureUri: null,
          foodApiId: null,
          calories: null, protein: null, carbs: null, fat: null, fiber: null,
          fetchedFoodData: null,
      });
      setSearchTerm(''); // Clear search term as well
      setShowIngredientForm(false);
  };
  
  const resetRecipeForm = () => {
    setNewRecipe({
      name: '',
      servings: 4,
      prep_time: 15,
      cook_time: 30,
      instructions: '',
    });
  };
  
  // State to hold fetched food details for calculation
  const [ingredientDetailsCache, setIngredientDetailsCache] = useState<Record<string, SelectedFoodData>>({});

  // Fetch missing ingredient details when ingredients change
  useEffect(() => {
    const fetchMissingDetails = async () => {
      const missingIds = ingredients
        .filter(ing => ing.food_api_id && !ingredientDetailsCache[ing.food_api_id])
        .map(ing => ing.food_api_id as string);

      if (missingIds.length === 0) return;

      console.log("Fetching details for missing ingredient IDs:", missingIds);
      // In a real app, you might batch these requests
      const detailsPromises = missingIds.map(async (foodId) => {
        try {
          const { data, error } = await supabase.functions.invoke('food-database-search', {
            body: JSON.stringify({ foodId })
          });
          if (error) throw error;
          if (data?.foods && data.foods.length > 0) {
            return { [foodId]: data.foods[0] };
          }
        } catch (e) {
          console.error(`Error fetching details for foodId ${foodId}:`, e);
        }
        return { [foodId]: null }; // Indicate fetch failed or no data
      });

      const results = await Promise.all(detailsPromises);
      const newDetails = results.reduce((acc, res) => ({ ...acc, ...res }), {});
      
      setIngredientDetailsCache(prev => ({ ...prev, ...newDetails }));
    };

    fetchMissingDetails();
  }, [ingredients]); // Re-run when ingredients list changes


  // Recalculate nutrition based on fetched details and selected measures
  const calculateTotalNutrition = () => {
    if (!ingredients.length) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    }

    const totals = ingredients.reduce((acc, ing) => {
      const quantity = ing.quantity || 1;
      let calories = 0, protein = 0, carbs = 0, fat = 0, fiber = 0;

      // Try to use cached/fetched details if available
      const foodDetails = ing.food_api_id ? ingredientDetailsCache[ing.food_api_id] : null;

      if (foodDetails && ing.selected_measure_uri) {
        const measure = foodDetails.measures.find(m => m.uri === ing.selected_measure_uri);
        if (measure) {
          const weightMultiplier = measure.weight > 0 ? (measure.weight / 100) : 1; // Assume 1 if weight is 0 (e.g., 'piece')
          
          calories = (foodDetails.calories || 0) * weightMultiplier * quantity;
          protein = (foodDetails.protein || 0) * weightMultiplier * quantity;
          carbs = (foodDetails.carbs || 0) * weightMultiplier * quantity;
          fat = (foodDetails.fat || 0) * weightMultiplier * quantity;
          fiber = (foodDetails.fiber || 0) * weightMultiplier * quantity;
        } else {
          console.warn(`Measure ${ing.selected_measure_uri} not found for ${ing.name}. Using base 100g values if available.`);
           // Fallback: Use base 100g values directly * quantity (less accurate)
           calories = (ing.base_calories_per_100g || 0) * quantity;
           protein = (ing.base_protein_per_100g || 0) * quantity;
           carbs = (ing.base_carbs_per_100g || 0) * quantity;
           fat = (ing.base_fat_per_100g || 0) * quantity;
           fiber = (ing.base_fiber_per_100g || 0) * quantity;
        }
      } else {
         // Manual entry or missing data - Use potentially stored base values (less accurate)
         console.warn(`Using potentially inaccurate fallback calculation for ${ing.name}`);
         calories = (ing.base_calories_per_100g || 0) * quantity; // This assumes quantity refers to 100g units if no measure selected
         protein = (ing.base_protein_per_100g || 0) * quantity;
         carbs = (ing.base_carbs_per_100g || 0) * quantity;
         fat = (ing.base_fat_per_100g || 0) * quantity;
         fiber = (ing.base_fiber_per_100g || 0) * quantity;
      }

      acc.calories += calories;
      acc.protein += protein;
      acc.carbs += carbs;
      acc.fat += fat;
      acc.fiber += fiber;

      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    return totals;
  };
  
  const calculatePerServing = () => {
      if (!selectedRecipe || !ingredients.length) {
          return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
      }

      const totals = calculateTotalNutrition();
      const servings = selectedRecipe.servings || 1;

      return {
          calories: Math.round(totals.calories / servings),
          protein: parseFloat((totals.protein / servings).toFixed(1)),
          carbs: parseFloat((totals.carbs / servings).toFixed(1)),
          fat: parseFloat((totals.fat / servings).toFixed(1)),
          fiber: parseFloat((totals.fiber / servings).toFixed(1)), // Add fiber
      };
  };
  
  return (
    <div className="space-y-6">
      {isCreatingRecipe ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Recipe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipe-name">Recipe Name</Label>
              <Input 
                id="recipe-name" 
                placeholder="e.g., Chicken Stir Fry"
                value={newRecipe.name}
                onChange={(e) => setNewRecipe({...newRecipe, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="servings">Servings</Label>
                <Input 
                  id="servings"
                  type="number"
                  min="1"
                  value={newRecipe.servings}
                  onChange={(e) => setNewRecipe({...newRecipe, servings: parseInt(e.target.value) || 1})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prep-time">Prep Time (min)</Label>
                <Input 
                  id="prep-time"
                  type="number"
                  min="0"
                  value={newRecipe.prep_time}
                  onChange={(e) => setNewRecipe({...newRecipe, prep_time: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cook-time">Cook Time (min)</Label>
                <Input 
                  id="cook-time"
                  type="number"
                  min="0"
                  value={newRecipe.cook_time}
                  onChange={(e) => setNewRecipe({...newRecipe, cook_time: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <textarea 
                id="instructions"
                className="w-full min-h-[150px] border rounded-md p-2"
                placeholder="Enter recipe instructions..."
                value={newRecipe.instructions}
                onChange={(e) => setNewRecipe({...newRecipe, instructions: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsCreatingRecipe(false)}
              >
                Cancel
              </Button>
              <Button onClick={createRecipe}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Recipe
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="w-full md:w-80">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Recipes</span>
                <Button onClick={() => setIsCreatingRecipe(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Recipe
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recipes.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                  <FileSpreadsheet className="h-12 w-12 mx-auto mb-2 text-muted-foreground/60" />
                  <p>No recipes yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setIsCreatingRecipe(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Your First Recipe
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {recipes.map((recipe) => (
                      <div 
                        key={recipe.id}
                        className={`p-3 border rounded-lg hover:bg-muted transition-colors cursor-pointer ${
                          selectedRecipe?.id === recipe.id ? 'bg-muted border-primary' : ''
                        }`}
                        onClick={() => setSelectedRecipe(recipe)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{recipe.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {recipe.servings} servings • {recipe.prep_time + recipe.cook_time} min
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(recipe);
                              }}
                            >
                              <svg 
                                viewBox="0 0 24 24" 
                                fill={recipe.is_favorite ? "currentColor" : "none"} 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className={`h-4 w-4 ${recipe.is_favorite ? 'text-yellow-500' : ''}`}
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                              </svg>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateRecipe(recipe.id);
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRecipe(recipe.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
          
          {selectedRecipe ? (
            <div className="flex-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <Input 
                      value={selectedRecipe.name}
                      onChange={(e) => updateRecipe({ name: e.target.value })}
                      className="text-xl font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleFavorite(selectedRecipe)}
                      >
                        <svg 
                          viewBox="0 0 24 24" 
                          fill={selectedRecipe.is_favorite ? "currentColor" : "none"} 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className={`h-4 w-4 mr-2 ${selectedRecipe.is_favorite ? 'text-yellow-500' : ''}`}
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        {selectedRecipe.is_favorite ? 'Favorited' : 'Favorite'}
                      </Button>
                      {/* Removed Save button, using inline edits */}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      <span className="font-medium mr-1">Servings:</span>
                      <input 
                        type="number" 
                        min="1" 
                        value={selectedRecipe.servings}
                        onChange={(e) => updateRecipe({ servings: parseInt(e.target.value) || 1 })}
                        className="w-10 bg-transparent text-center focus:outline-none"
                      />
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <span className="font-medium mr-1">Prep Time:</span>
                      <input 
                        type="number" 
                        min="0" 
                        value={selectedRecipe.prep_time}
                        onChange={(e) => updateRecipe({ prep_time: parseInt(e.target.value) || 0 })}
                        className="w-10 bg-transparent text-center focus:outline-none"
                      />
                      <span className="ml-1">min</span>
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <span className="font-medium mr-1">Cook Time:</span>
                      <input 
                        type="number" 
                        min="0" 
                        value={selectedRecipe.cook_time}
                        onChange={(e) => updateRecipe({ cook_time: parseInt(e.target.value) || 0 })}
                        className="w-10 bg-transparent text-center focus:outline-none"
                      />
                      <span className="ml-1">min</span>
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <span className="font-medium mr-1">Total Time:</span>
                      <span>{selectedRecipe.prep_time + selectedRecipe.cook_time} min</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Ingredients</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {ingredients.length === 0 ? (
                          <div className="text-center text-muted-foreground p-4">
                            <p>No ingredients added yet.</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {ingredients.map((ingredient) => (
                              <div 
                                key={ingredient.id}
                                className="p-3 border rounded-lg flex justify-between items-center"
                              >
                                <div>
                                  <div className="font-medium">{ingredient.name}</div>
                                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <span>{ingredient.quantity} {ingredient.unit}</span>
                                    {/* Display calculated calories per ingredient later if needed */}
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removeIngredient(ingredient.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <Collapsible 
                          open={showIngredientForm} 
                          onOpenChange={setShowIngredientForm}
                        >
                          <CollapsibleTrigger asChild>
                            <Button 
                              variant={showIngredientForm ? "secondary" : "default"}
                              className="w-full"
                            >
                              {showIngredientForm ? (
                                <>
                                  <ChevronUp className="h-4 w-4 mr-2" />
                                  Cancel
                                </>
                              ) : (
                                <>
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Add Ingredient
                                </>
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-4 pt-4">
                            {/* Ingredient Search Popover */}
                            <Popover open={ingredientSearchPopoverOpen} onOpenChange={setIngredientSearchPopoverOpen}>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">
                                  {currentIngredient.name || "Search & Select Ingredient..."}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                  <CommandInput
                                    placeholder="Search food database..."
                                    value={searchTerm}
                                    onValueChange={setSearchTerm}
                                  />
                                  <CommandEmpty>No food found.</CommandEmpty>
                                  <CommandGroup>
                                    {isSearching && <CommandItem disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Searching...</CommandItem>}
                                    {searchResults?.foods?.map((food) => (
                                      <CommandItem
                                        key={food.foodId}
                                        value={food.name}
                                        onSelect={() => selectSearchResult(food)}
                                        className="cursor-pointer"
                                      >
                                        {food.name} ({food.brand || 'Generic'}) - {food.calories} kcal/100g
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>

                            {/* Quantity and Measure Selection (only if ingredient selected) */}
                            {currentIngredient.fetchedFoodData && (
                              <div className="grid grid-cols-2 gap-4 items-end">
                                <div className="space-y-2">
                                  <Label htmlFor="ingredient-quantity">Quantity</Label>
                                  <Input
                                    id="ingredient-quantity"
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    value={currentIngredient.quantity}
                                    onChange={(e) => setCurrentIngredient({...currentIngredient, quantity: parseFloat(e.target.value) || 0})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="ingredient-measure">Unit</Label>
                                  <Select
                                    value={currentIngredient.selectedMeasureUri || undefined}
                                    onValueChange={(value) => {
                                      const measure = currentIngredient.fetchedFoodData?.measures.find(m => m.uri === value);
                                      setCurrentIngredient({
                                        ...currentIngredient, 
                                        selectedMeasureUri: value,
                                        unit: measure?.label || 'unit' 
                                      });
                                    }}
                                  >
                                    <SelectTrigger id="ingredient-measure">
                                      <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {currentIngredient.fetchedFoodData.measures.map((measure) => (
                                        <SelectItem key={measure.uri} value={measure.uri}>
                                          {measure.label} ({measure.weight > 0 ? `${measure.weight}g` : 'unit'})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                            
                            {/* Manual Entry Fields (Optional - could be hidden if search result selected) */}
                            {!currentIngredient.fetchedFoodData && (
                              <div className="space-y-4 border-t pt-4">
                                <p className="text-sm text-muted-foreground">Or enter manually:</p>
                                <div className="space-y-2">
                                  <Label htmlFor="manual-ingredient-name">Ingredient Name</Label>
                                  <Input
                                    id="manual-ingredient-name"
                                    placeholder="e.g., Olive Oil"
                                    value={currentIngredient.name}
                                    onChange={(e) => setCurrentIngredient({...currentIngredient, name: e.target.value, foodApiId: null, fetchedFoodData: null})}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  {/* Manual Quantity/Unit */}
                                   <div className="space-y-2">
                                     <Label htmlFor="manual-quantity">Quantity</Label>
                                     <Input
                                       id="manual-quantity"
                                       type="number"
                                       step="0.01"
                                       min="0"
                                       value={currentIngredient.quantity}
                                       onChange={(e) => setCurrentIngredient({...currentIngredient, quantity: parseFloat(e.target.value) || 0})}
                                     />
                                   </div>
                                   <div className="space-y-2">
                                     <Label htmlFor="manual-unit">Unit</Label>
                                     <select
                                       id="manual-unit"
                                       className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                                       value={currentIngredient.unit}
                                       onChange={(e) => setCurrentIngredient({...currentIngredient, unit: e.target.value, selectedMeasureUri: null})}
                                     >
                                       <option value="cup">cup</option>
                                       <option value="tbsp">tbsp</option>
                                       <option value="tsp">tsp</option>
                                       <option value="oz">oz</option>
                                       <option value="g">g</option>
                                       <option value="ml">ml</option>
                                       <option value="serving">serving</option>
                                       <option value="piece">piece</option>
                                     </select>
                                   </div>
                                </div>
                                {/* Manual Nutrient Inputs */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                   {/* Calories, Protein, Carbs, Fat inputs similar to above */}
                                   {/* Example for Calories */}
                                   <div className="space-y-2">
                                     <Label htmlFor="manual-calories">Calories</Label>
                                     <Input
                                       id="manual-calories" type="number" min="0"
                                       value={currentIngredient.calories ?? ''}
                                       onChange={(e) => setCurrentIngredient({...currentIngredient, calories: parseFloat(e.target.value) || null})}
                                     />
                                   </div>
                                   {/* Add similar inputs for protein, carbs, fat, fiber */}
                                </div>
                              </div>
                            )}
                            
                            <Button 
                              onClick={addIngredient}
                              className="w-full"
                              disabled={!currentIngredient.name || (!!currentIngredient.fetchedFoodData && !currentIngredient.selectedMeasureUri)} // Disable if fetched but no measure selected
                            >
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Add to Recipe
                            </Button>
                          </CollapsibleContent>
                        </Collapsible>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Nutrition Facts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg p-4 space-y-4">
                          <div className="text-center">
                            <h3 className="font-bold text-lg">Nutrition Facts</h3>
                            <p className="text-sm text-muted-foreground">
                              Per serving ({selectedRecipe.servings} servings per recipe)
                            </p>
                          </div>
                          
                          <div className="border-b-2 border-t-8 py-2">
                            <div className="flex justify-between font-bold">
                              <span>Calories</span>
                              <span>{calculatePerServing().calories}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-bold">Total Fat</span>
                              <span>{calculatePerServing().fat}g</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="font-bold">Total Carbohydrates</span>
                              <span>{calculatePerServing().carbs}g</span>
                            </div>
                             <div className="flex justify-between pl-4 text-sm">
                               <span>Dietary Fiber</span>
                               <span>{calculatePerServing().fiber}g</span>
                             </div>
                            
                            <div className="flex justify-between">
                              <span className="font-bold">Protein</span>
                              <span>{calculatePerServing().protein}g</span>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Info className="h-4 w-4" />
                              <span>Nutrition values are estimates based on ingredients</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <h3 className="font-medium text-sm mb-2">Totals for Entire Recipe</h3>
                          <div className="grid grid-cols-5 gap-2 text-center"> {/* Changed to 5 cols for fiber */}
                            <div className="p-2 bg-muted rounded-lg">
                              <div className="font-bold">{Math.round(calculateTotalNutrition().calories)}</div>
                              <div className="text-xs text-muted-foreground">Calories</div>
                            </div>
                            <div className="p-2 bg-muted rounded-lg">
                              <div className="font-bold">{Math.round(calculateTotalNutrition().protein)}g</div>
                              <div className="text-xs text-muted-foreground">Protein</div>
                            </div>
                            <div className="p-2 bg-muted rounded-lg">
                              <div className="font-bold">{Math.round(calculateTotalNutrition().carbs)}g</div>
                              <div className="text-xs text-muted-foreground">Carbs</div>
                            </div>
                            <div className="p-2 bg-muted rounded-lg">
                              <div className="font-bold">{Math.round(calculateTotalNutrition().fat)}g</div>
                              <div className="text-xs text-muted-foreground">Fat</div>
                            </div>
                             <div className="p-2 bg-muted rounded-lg">
                               <div className="font-bold">{Math.round(calculateTotalNutrition().fiber)}g</div>
                               <div className="text-xs text-muted-foreground">Fiber</div>
                             </div>
                          </div>
                        </div>
                      </CardContent>
                      {/* Removed Recalculate button, calculation should be dynamic */}
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        className="w-full min-h-[150px] border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter step-by-step instructions for preparing this recipe..."
                        value={selectedRecipe.instructions || ''}
                        onChange={(e) => updateRecipe({ instructions: e.target.value })}
                      />
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="flex-1">
              <CardContent className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                  <FileSpreadsheet className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
                  <h3 className="text-lg font-medium mb-2">Select a Recipe</h3>
                  <p className="text-muted-foreground">
                    Choose a recipe from the list or create a new one to get started
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => setIsCreatingRecipe(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New Recipe
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
