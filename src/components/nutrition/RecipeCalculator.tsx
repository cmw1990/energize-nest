
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  PlusCircle, 
  Trash2, 
  Copy, 
  Save, 
  Info, 
  FileSpreadsheet,
  Calculator,
  ChevronDown,
  ChevronUp
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

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
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
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  
  const [newRecipe, setNewRecipe] = useState<Omit<Recipe, 'id' | 'user_id' | 'created_at' | 'is_favorite'>>({
    name: '',
    servings: 4,
    prep_time: 15,
    cook_time: 30,
    instructions: '',
  });
  
  const [newIngredient, setNewIngredient] = useState<Omit<Ingredient, 'id'>>({
    name: '',
    quantity: 1,
    unit: 'cup',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  
  useEffect(() => {
    if (session?.user?.id) {
      fetchRecipes();
    }
  }, [session]);
  
  useEffect(() => {
    if (selectedRecipe) {
      fetchIngredients(selectedRecipe.id);
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
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };
  
  const searchIngredient = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('food_database')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .limit(10);
      
      if (error) throw error;
      
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching food database:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const selectSearchResult = (result: any) => {
    setNewIngredient({
      name: result.name,
      quantity: 1,
      unit: 'serving',
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
    });
    
    setSearchResults([]);
    setSearchTerm('');
    setShowIngredientForm(true);
  };
  
  const addIngredient = async () => {
    if (!selectedRecipe || !newIngredient.name) return;
    
    try {
      const { data, error } = await supabase
        .from('recipe_ingredients')
        .insert({
          recipe_id: selectedRecipe.id,
          name: newIngredient.name,
          quantity: newIngredient.quantity,
          unit: newIngredient.unit,
          calories: newIngredient.calories,
          protein: newIngredient.protein,
          carbs: newIngredient.carbs,
          fat: newIngredient.fat,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setIngredients([...ingredients, data]);
      resetIngredientForm();
      
      toast({
        title: "Ingredient added",
        description: `${newIngredient.name} has been added to your recipe`,
      });
    } catch (error) {
      console.error('Error adding ingredient:', error);
      toast({
        title: "Error adding ingredient",
        description: "There was a problem saving this ingredient",
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
      
      toast({
        title: "Recipe updated",
        description: "Your recipe has been updated successfully",
      });
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
        // Create new ingredients for the new recipe
        const newIngredients = ingredientsData.map(ing => ({
          recipe_id: newRecipeData.id,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          calories: ing.calories,
          protein: ing.protein,
          carbs: ing.carbs,
          fat: ing.fat,
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
  
  const resetIngredientForm = () => {
    setNewIngredient({
      name: '',
      quantity: 1,
      unit: 'cup',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    });
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
  
  const calculateTotalNutrition = () => {
    if (!ingredients.length) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    
    const totals = ingredients.reduce((acc, ing) => {
      return {
        calories: acc.calories + ing.calories * ing.quantity,
        protein: acc.protein + ing.protein * ing.quantity,
        carbs: acc.carbs + ing.carbs * ing.quantity,
        fat: acc.fat + ing.fat * ing.quantity,
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    return totals;
  };
  
  const calculatePerServing = () => {
    if (!selectedRecipe || !ingredients.length) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    
    const totals = calculateTotalNutrition();
    const servings = selectedRecipe.servings || 1;
    
    return {
      calories: Math.round(totals.calories / servings),
      protein: Math.round(totals.protein / servings * 10) / 10,
      carbs: Math.round(totals.carbs / servings * 10) / 10,
      fat: Math.round(totals.fat / servings * 10) / 10,
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
                      <Button variant="outline" size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
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
                                    <span>•</span>
                                    <span>{ingredient.calories} cal</span>
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
                            <div className="flex items-end gap-2">
                              <div className="flex-1">
                                <Label htmlFor="ingredient-search">Search Ingredient</Label>
                                <Input
                                  id="ingredient-search"
                                  placeholder="e.g., chicken breast"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && searchIngredient()}
                                />
                              </div>
                              <Button onClick={searchIngredient} disabled={isSearching}>
                                {isSearching ? "Searching..." : "Search"}
                              </Button>
                            </div>
                            
                            {searchResults.length > 0 && (
                              <div className="border rounded-lg p-2">
                                <h4 className="text-sm font-medium mb-2">Search Results</h4>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                                  {searchResults.map((result) => (
                                    <div 
                                      key={result.id}
                                      className="p-2 border rounded hover:bg-muted cursor-pointer"
                                      onClick={() => selectSearchResult(result)}
                                    >
                                      <div className="font-medium">{result.name}</div>
                                      <div className="text-xs text-muted-foreground flex flex-wrap gap-2">
                                        <span>{result.calories} cal</span>
                                        <span>P: {result.protein}g</span>
                                        <span>C: {result.carbs}g</span>
                                        <span>F: {result.fat}g</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="space-y-4 border-t pt-4">
                              <div className="space-y-2">
                                <Label htmlFor="ingredient-name">Ingredient Name</Label>
                                <Input
                                  id="ingredient-name"
                                  placeholder="e.g., Olive Oil"
                                  value={newIngredient.name}
                                  onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="quantity">Quantity</Label>
                                  <Input
                                    id="quantity"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={newIngredient.quantity}
                                    onChange={(e) => setNewIngredient({...newIngredient, quantity: parseFloat(e.target.value) || 0})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="unit">Unit</Label>
                                  <select
                                    id="unit"
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                                    value={newIngredient.unit}
                                    onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})}
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
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="calories">Calories</Label>
                                  <Input
                                    id="calories"
                                    type="number"
                                    min="0"
                                    value={newIngredient.calories}
                                    onChange={(e) => setNewIngredient({...newIngredient, calories: parseFloat(e.target.value) || 0})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="protein">Protein (g)</Label>
                                  <Input
                                    id="protein"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={newIngredient.protein}
                                    onChange={(e) => setNewIngredient({...newIngredient, protein: parseFloat(e.target.value) || 0})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="carbs">Carbs (g)</Label>
                                  <Input
                                    id="carbs"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={newIngredient.carbs}
                                    onChange={(e) => setNewIngredient({...newIngredient, carbs: parseFloat(e.target.value) || 0})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="fat">Fat (g)</Label>
                                  <Input
                                    id="fat"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={newIngredient.fat}
                                    onChange={(e) => setNewIngredient({...newIngredient, fat: parseFloat(e.target.value) || 0})}
                                  />
                                </div>
                              </div>
                              
                              <Button 
                                onClick={addIngredient}
                                className="w-full"
                              >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add to Recipe
                              </Button>
                            </div>
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
                            
                            <div className="flex justify-between">
                              <span className="font-bold">Protein</span>
                              <span>{calculatePerServing().protein}g</span>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Info className="h-4 w-4" />
                              <span>Nutrition values are automatically calculated based on ingredients</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <h3 className="font-medium text-sm mb-2">Totals for Entire Recipe</h3>
                          <div className="grid grid-cols-4 gap-2 text-center">
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
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">
                          <Calculator className="h-4 w-4 mr-2" />
                          Recalculate Nutrition
                        </Button>
                      </CardFooter>
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
