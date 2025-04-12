import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/layout/LandingHeader"; // Changed import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper";
import { UtensilsCrossed, PlusCircle, Trash2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Ingredient {
  id: string;
  name: string;
  quantity: string; // Keep as string for input flexibility
  unit: string;
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleIngredientChange = (id: string, field: keyof Ingredient, value: string) => {
    setIngredients(prev =>
      prev.map(ing => (ing.id === id ? { ...ing, [field]: value } : ing))
    );
    setTotalNutrition(null); // Reset results when ingredients change
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
                {ingredients.map((ingredient, index) => (
                  <div key={ingredient.id} className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`ingredient-name-${index}`} className="text-xs">Name</Label>
                      <Input
                        id={`ingredient-name-${index}`}
                        placeholder="e.g., Chicken Breast"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(ingredient.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="w-24 space-y-1">
                      <Label htmlFor={`ingredient-qty-${index}`} className="text-xs">Quantity</Label>
                      <Input
                        id={`ingredient-qty-${index}`}
                        type="number"
                        placeholder="e.g., 100"
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(ingredient.id, 'quantity', e.target.value)}
                      />
                    </div>
                    <div className="w-20 space-y-1">
                       <Label htmlFor={`ingredient-unit-${index}`} className="text-xs">Unit</Label>
                       <Input
                        id={`ingredient-unit-${index}`}
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

              {totalNutrition && (
                <Card className="mt-6 bg-muted/50">
                  <CardHeader>
                    <CardTitle>Estimated Total Nutrition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nutrient</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Calories</TableCell>
                          <TableCell className="text-right">{totalNutrition.calories.toLocaleString()} kcal</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Protein</TableCell>
                          <TableCell className="text-right">{totalNutrition.protein} g</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Carbohydrates</TableCell>
                          <TableCell className="text-right">{totalNutrition.carbs} g</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Fat</TableCell>
                          <TableCell className="text-right">{totalNutrition.fat} g</TableCell>
                        </TableRow>
                        {/* Add more rows for other nutrients */}
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