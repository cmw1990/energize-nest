import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/layout/LandingHeader"; // Changed import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper";
import { UtensilsCrossed, PlusCircle, Trash2, Info, Search, Loader2, ChevronsUpDown } from "lucide-react"; // Added Search, Loader2, ChevronsUpDown
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Added Popover
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"; // Added Command
import { useQuery } from "@tanstack/react-query"; // Added useQuery
import { supabase } from "@/integrations/supabase/client"; // Added supabase client
import { SelectedFoodData } from "@/components/food/FoodLogForm"; // Reuse type if applicable, or redefine
interface Ingredient {
  id: string; // Unique ID for the row in the list
  name: string; // User-entered or selected name
  quantity: string; // Keep as string for input flexibility
  unit: string; // User-entered unit or selected measure label
  foodId?: string; // API ID if selected from search
  measureUri?: string; // API measure URI if selected
  // Store fetched base nutrition per 100g if needed for recalculation, or rely on backend for final calc
  baseNutrition?: Omit<NutritionInfo, 'calories'> & { caloriesPer100g: number };
}

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  // Add more nutrients as needed (e.g., fiber, sugar, sodium)
}

// Placeholder for fetching data - replace with actual API call via backend/edge function
const fetchNutritionData = async (ingredient: Ingredient): Promise<NutritionInfo | null> => {
  console.warn(`API Call Placeholder: Fetching data for ${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`);
  // In a real implementation, call your backend/edge function here
  // which would then call a nutrition API (e.g., USDA FoodData Central, Edamam, Open Food Facts)
  // For now, return mock data based on name length for demonstration
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
  if (!ingredient.name || !ingredient.quantity || !ingredient.unit) return null;

  const qty = parseFloat(ingredient.quantity);
  if (isNaN(qty) || qty <= 0) return null;

  // Very basic mock data - REPLACE THIS
  const baseCalories = ingredient.name.length * 10 * (qty / 100); // Rough estimate based on name length and 100g
  return {
    calories: Math.round(baseCalories),
    protein: Math.round(baseCalories * 0.05), // ~20% protein calories
    carbs: Math.round(baseCalories * 0.1),   // ~40% carb calories
    fat: Math.round(baseCalories * 0.044), // ~40% fat calories
  };
};

export default function RecipeNutritionCalculator() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: crypto.randomUUID(), name: '', quantity: '', unit: 'g' },
  ]);
  const [totalNutrition, setTotalNutrition] = useState<NutritionInfo | null>(null);
  const [servings, setServings] = useState<string>("1"); // Add state for servings
  const [isLoading, setIsLoading] = useState(false);
  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>({}); // State for individual ingredient searches
  const [popoverOpen, setPopoverOpen] = useState<{ [key: string]: boolean }>({}); // State for individual popovers
  const { toast } = useToast();

 const handleIngredientChange = (id: string, field: keyof Omit<Ingredient, 'id' | 'baseNutrition'>, value: string) => {
    setIngredients(prev =>
      prev.map(ing => {
        if (ing.id === id) {
          const updatedIng = { ...ing, [field]: value };
          // If name is changed manually, clear foodId and measureUri
          if (field === 'name') {
            updatedIng.foodId = undefined;
            updatedIng.measureUri = undefined;
            updatedIng.unit = 'g'; // Reset unit to default when name changes manually
          }
          return updatedIng;
        }
        return ing;
      })
    );
    setTotalNutrition(null); // Reset results when ingredients change
  };

  // Handler for search input change for a specific ingredient row
  const handleSearchQueryChange = (id: string, query: string) => {
    setSearchQueries(prev => ({ ...prev, [id]: query }));
     if (!popoverOpen[id] && query.length > 0) {
       handlePopoverOpenChange(id, true); // Open popover on search
     }
  };

  // Handler for popover open state change
  const handlePopoverOpenChange = (id: string, open: boolean) => {
    setPopoverOpen(prev => ({ ...prev, [id]: open }));
     if (!open) {
       // Optionally clear search query when popover closes without selection
       // setSearchQueries(prev => ({ ...prev, [id]: '' }));
     }
  };

  // Handler for selecting a food item from search results for an ingredient
  const handleIngredientSelect = (ingredientId: string, food: SelectedFoodData) => {
    setIngredients(prev =>
      prev.map(ing => {
        if (ing.id === ingredientId) {
          const defaultMeasure = food.measures?.find(m => m.label.toLowerCase().includes('gram') || m.label.toLowerCase() === 'g') || food.measures?.[0];
          return {
            ...ing,
            name: food.name,
            foodId: food.foodId,
            quantity: '100', // Default to 100g or 1 unit? Let's use 100g for now
            unit: defaultMeasure?.label || 'g', // Use default measure label or 'g'
            measureUri: defaultMeasure?.uri,
            // Optionally store base nutrition if needed client-side
            // baseNutrition: { caloriesPer100g: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat }
          };
        }
        return ing;
      })
    );
    setSearchQueries(prev => ({ ...prev, [ingredientId]: '' })); // Clear search for this row
    handlePopoverOpenChange(ingredientId, false); // Close popover
    setTotalNutrition(null); // Reset results
  };

  const addIngredient = () => {
    setIngredients(prev => [
      ...prev,
      { id: crypto.randomUUID(), name: '', quantity: '', unit: 'g' },
    ]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id));
    setTotalNutrition(null); // Reset results when ingredients change
  };

  const calculateTotalNutrition = async () => {
    setIsLoading(true);
    setTotalNutrition(null);
    let total: NutritionInfo = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    let hasError = false;

    for (const ingredient of ingredients) {
      if (!ingredient.name || !ingredient.quantity || !ingredient.unit) {
        toast({ title: "Missing Information", description: `Please fill in all fields for ingredient: ${ingredient.name || 'Unnamed'}`, variant: "destructive" });
        hasError = true;
        break;
      }
      try {
        const nutrition = await fetchNutritionData(ingredient);
        if (nutrition) {
          total.calories += nutrition.calories;
          total.protein += nutrition.protein;
          total.carbs += nutrition.carbs;
          total.fat += nutrition.fat;
        } else {
          toast({ title: "Data Not Found", description: `Could not find nutrition data for: ${ingredient.name}`, variant: "destructive" });
          // Optionally continue calculation or stop on error
          // hasError = true;
          // break;
        }
      } catch (error) {
        console.error("Error fetching nutrition data:", error);
        toast({ title: "API Error", description: `Failed to fetch data for: ${ingredient.name}`, variant: "destructive" });
        hasError = true;
        break;
      }
    }

    if (!hasError) {
      setTotalNutrition(total);
    }
    setIsLoading(false);
  };

  return (
    <ToolAnalyticsWrapper toolName="recipe-nutrition-calculator" toolType="nutrition">
      <div className="min-h-screen bg-background">
        <LandingHeader /> {/* Changed component */}
        <div className="container mx-auto p-4 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-6 w-6 text-green-600" />
                <CardTitle>Recipe Nutrition Calculator</CardTitle>
              </div>
              <CardDescription>
                Enter your recipe ingredients to estimate the total nutritional content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-lg font-medium">Ingredients</Label>
                {ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-end gap-2">
                    {/* Ingredient Name with Search Popover */}
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`ingredient-name-${ingredient.id}`} className="text-xs">Name</Label>
                      <Popover open={popoverOpen[ingredient.id] ?? false} onOpenChange={(open) => handlePopoverOpenChange(ingredient.id, open)}>
                        <PopoverTrigger asChild>
                           <Button
                             variant="outline"
                             role="combobox"
                             aria-expanded={popoverOpen[ingredient.id] ?? false}
                             className="w-full justify-between font-normal text-left h-10" // Match input height
                           >
                             {ingredient.name || "Search ingredient..."}
                             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                           </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                           <IngredientSearchCommand
                             ingredientId={ingredient.id}
                             searchQuery={searchQueries[ingredient.id] || ''}
                             onSearchQueryChange={handleSearchQueryChange}
                             onSelect={handleIngredientSelect}
                           />
                        </PopoverContent>
                      </Popover>
                       {/* Hidden input to allow manual override if needed, or remove if search is mandatory */}
                       {/* <Input
                         id={`ingredient-name-${ingredient.id}`}
                         value={ingredient.name}
                         onChange={(e) => handleIngredientChange(ingredient.id, 'name', e.target.value)}
                         className="hidden" // Hide if using Button trigger primarily
                       /> */}
                    </div>
                     {/* Quantity Input */}
                    <div className="w-24 space-y-1">
                      <Label htmlFor={`ingredient-qty-${ingredient.id}`} className="text-xs">Quantity</Label>
                      <Input
                        id={`ingredient-qty-${ingredient.id}`}
                        type="number"
                        placeholder="e.g., 100"
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(ingredient.id, 'quantity', e.target.value)}
                        min="0"
                        step="any" // Allow decimals
                      />
                    </div>
                     {/* Unit Input/Select */}
                    <div className="w-28 space-y-1"> {/* Increased width for longer units */}
                       <Label htmlFor={`ingredient-unit-${ingredient.id}`} className="text-xs">Unit</Label>
                       {/* Conditionally render Select if measures are available, otherwise Input */}
                       {/* TODO: Add Select logic when fetching detailed ingredient data */}
                       <Input
                        id={`ingredient-unit-${ingredient.id}`}
                        placeholder="e.g., g, oz, cup"
                        value={ingredient.unit}
                        onChange={(e) => handleIngredientChange(ingredient.id, 'unit', e.target.value)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(ingredient.id)}
                      disabled={ingredients.length <= 1}
                      aria-label="Remove ingredient"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addIngredient} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Ingredient
                </Button>
              </div>

              <Button onClick={calculateTotalNutrition} disabled={isLoading} className="w-full">
                {isLoading ? "Calculating..." : "Calculate Total Nutrition"}
              </Button>

              {/* Results Section */}
              {totalNutrition && (
                <Card className="mt-6 bg-muted/50">
                  <CardHeader>
                    <CardTitle>Estimated Nutrition (Total Recipe)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {/* Servings Input */}
                     <div className="flex items-center gap-2">
                       <Label htmlFor="servings" className="whitespace-nowrap">Number of Servings:</Label>
                       <Input
                         id="servings"
                         type="number"
                         min="1"
                         step="1"
                         value={servings}
                         onChange={(e) => setServings(e.target.value)}
                         className="w-20"
                       />
                     </div>
                     {/* Nutrition Table */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nutrient</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">Per Serving</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(Object.keys(totalNutrition) as Array<keyof NutritionInfo>).map((key) => {
                           const totalValue = totalNutrition[key];
                           const numServings = parseFloat(servings) || 1;
                           const perServingValue = totalValue / numServings;
                           const unit = key === 'calories' ? 'kcal' : 'g';
                           return (
                             <TableRow key={key}>
                               <TableCell className="font-medium capitalize">{key}</TableCell>
                               <TableCell className="text-right">{totalValue.toFixed(1)} {unit}</TableCell>
                               <TableCell className="text-right">{perServingValue.toFixed(1)} {unit}</TableCell>
                             </TableRow>
                           );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
               <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 space-y-2">
                  <h3 className="font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Info className="h-5 w-5" />
                    Disclaimer
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Nutritional information is estimated based on standard databases and may vary. This tool uses placeholder data and requires integration with a real nutrition API for accurate results. Always consult with a healthcare professional or registered dietitian for personalized dietary advice.
                  </p>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  );
}


// Separate component for the ingredient search command popover content
interface IngredientSearchCommandProps {
  ingredientId: string;
  searchQuery: string;
  onSearchQueryChange: (id: string, query: string) => void;
  onSelect: (ingredientId: string, food: SelectedFoodData) => void;
}

const IngredientSearchCommand: React.FC<IngredientSearchCommandProps> = ({
  ingredientId,
  searchQuery,
  onSearchQueryChange,
  onSelect
}) => {
  const { toast } = useToast();

  // Fetch search results for this specific ingredient input
  const { data: searchResults, isLoading: isSearching } = useQuery<{ foods: SelectedFoodData[] }>({
    queryKey: ['ingredient-search', searchQuery], // Use searchQuery in key
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 3) return { foods: [] };
      try {
        const { data, error } = await supabase.functions.invoke('food-database-search', {
          body: JSON.stringify({ query: searchQuery })
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
    enabled: searchQuery.length > 2,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return (
    <Command shouldFilter={false}> {/* Disable default filtering, rely on query */}
      <CommandInput
        placeholder="Search ingredient..."
        value={searchQuery}
        onValueChange={(query) => onSearchQueryChange(ingredientId, query)}
      />
      <CommandEmpty>
        {isSearching ? 'Searching...' : 'No results found.'}
      </CommandEmpty>
      <CommandGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {isSearching && !searchResults && (
          <CommandItem disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
          </CommandItem>
        )}
        {searchResults?.foods?.map((food) => (
          <CommandItem
            key={food.foodId || food.name}
            value={food.name} // Value for accessibility/filtering if enabled
            onSelect={() => onSelect(ingredientId, food)}
            className="cursor-pointer"
          >
             <div className="flex flex-col w-full">
               <span className="font-medium">{food.name}</span>
               <span className="text-xs text-muted-foreground">
                 {food.brand && `(${food.brand}) `}
                 {food.calories} kcal / 100g
               </span>
             </div>
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
};