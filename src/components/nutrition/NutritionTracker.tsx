import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ListChecks,
  Flame,
  Droplet,
  Pizza,
  Salad,
  Coffee
} from "lucide-react";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { FoodItem, NutritionGoals } from "@/types/energyPlans";

export function NutritionTracker() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [mealTime, setMealTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Fetch food logs
  const { data: foodLogs, isLoading } = useQuery({
    queryKey: ["food-logs", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("food_logs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as FoodItem[];
    },
    enabled: !!session?.user?.id,
  });

  // Fetch nutrition goals
  const { data: nutritionGoals } = useQuery({
    queryKey: ["nutrition-goals", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("nutrition_goals")
        .select("*")
        .eq("user_id", session.user.id)
        .single();
      
      if (error) throw error;
      return data as NutritionGoals;
    },
    enabled: !!session?.user?.id,
  });

  // Add food entry mutation
  const addFoodEntryMutation = useMutation({
    mutationFn: async (foodData: Omit<FoodItem, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("food_logs")
        .insert([foodData]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["food-logs"] });
      clearForm();
      toast({
        title: "Food entry added",
        description: "Your food entry has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding food entry",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update nutrition goals mutation
  const updateNutritionGoalsMutation = useMutation({
    mutationFn: async (goals: Omit<NutritionGoals, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("nutrition_goals")
        .upsert([
          {
            ...goals,
            user_id: session?.user?.id,
          },
        ]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition-goals"] });
      toast({
        title: "Nutrition goals updated",
        description: "Your nutrition goals have been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating nutrition goals",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodName || !calories || !protein || !carbs || !fat) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const foodData: Omit<FoodItem, "id" | "created_at" | "updated_at"> = {
      user_id: session?.user?.id,
      food_name: foodName,
      calories: parseInt(calories),
      protein_grams: parseInt(protein),
      carbs_grams: parseInt(carbs),
      fat_grams: parseInt(fat),
      serving_size: servingSize,
      meal_type: mealType,
      meal_time: mealTime,
      image_url: imageUrl,
      notes: notes,
      ai_analysis: aiAnalysis,
    };

    addFoodEntryMutation.mutate(foodData);
  };

  const clearForm = () => {
    setFoodName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setServingSize("");
    setMealType("breakfast");
    setMealTime("");
    setImageUrl("");
    setNotes("");
    setAiAnalysis("");
  };

  const addFoodEntry = async (foodData: any) => {
    try {
      const { error } = await supabase
        .from('food_logs')
        .insert({
          user_id: session.user.id,
          created_at: new Date().toISOString(),
          food_name: foodData.food_name || "Unnamed Food", // Ensure food_name is always provided
          calories: foodData.calories,
          protein_grams: foodData.protein_grams,
          carbs_grams: foodData.carbs_grams,
          fat_grams: foodData.fat_grams,
          serving_size: foodData.serving_size,
          meal_type: foodData.meal_type,
          meal_time: foodData.meal_time,
          image_url: foodData.image_url,
          notes: foodData.notes,
          updated_at: new Date().toISOString(),
          ai_analysis: foodData.ai_analysis
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["food-logs"] });
      clearForm();
      toast({
        title: "Food entry added",
        description: "Your food entry has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding food entry:", error);
      toast({
        title: "Error adding food entry",
        description: "Failed to add food entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateGoals = async (e: React.FormEvent) => {
    e.preventDefault();

    const goals = {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fat: 70,
      fiber: 30,
      water: 2000,
    };

    updateNutritionGoalsMutation.mutate(goals);
  };

  if (isLoading) {
    return <div>Loading food logs...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Flame className="h-5 w-5 mr-2 text-red-500" />
            Nutrition Tracker
          </CardTitle>
          <CardDescription>Track your daily food intake and nutrition goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="food-name">Food Name</Label>
                <Input
                  id="food-name"
                  placeholder="Enter food name"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="Enter calories"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  placeholder="Enter protein"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  placeholder="Enter carbs"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  placeholder="Enter fat"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serving-size">Serving Size</Label>
                <Input
                  id="serving-size"
                  placeholder="Enter serving size"
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meal-type">Meal Type</Label>
                <select
                  id="meal-type"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meal-time">Meal Time</Label>
                <Input
                  id="meal-time"
                  type="time"
                  value={mealTime}
                  onChange={(e) => setMealTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                type="url"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this meal"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-analysis">AI Analysis</Label>
              <Textarea
                id="ai-analysis"
                placeholder="Enter AI analysis"
                value={aiAnalysis}
                onChange={(e) => setAiAnalysis(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={addFoodEntryMutation.isPending} className="w-full">
              {addFoodEntryMutation.isPending ? "Adding..." : "Add Food Entry"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListChecks className="h-5 w-5 mr-2 text-green-500" />
            Daily Nutrition Goals
          </CardTitle>
          <CardDescription>Track your progress towards your daily goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center">
                <span>Calories</span>
                <span>{nutritionGoals?.calories || 0} / 2000 kcal</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Protein</span>
                <span>{nutritionGoals?.protein || 0} / 150g</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <span>Carbs</span>
                <span>{nutritionGoals?.carbs || 0} / 200g</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Fat</span>
                <span>{nutritionGoals?.fat || 0} / 70g</span>
              </div>
            </div>
          </div>
          <Button onClick={handleUpdateGoals} className="w-full">Update Goals</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Pizza className="h-5 w-5 mr-2 text-yellow-500" />
            Recent Food Entries
          </CardTitle>
          <CardDescription>Your recent food entries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {foodLogs && foodLogs.length > 0 ? (
            foodLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-md bg-muted">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{log.food_name}</h3>
                  <span className="text-sm text-muted-foreground">{log.calories} kcal</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {log.protein_grams}g Protein, {log.carbs_grams}g Carbs, {log.fat_grams}g Fat
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground">No food entries yet.</div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-0">
        <CardContent className="p-4">
          <h3 className="font-medium flex items-center">
            <Droplet className="h-4 w-4 mr-2" />
            Nutrition Tips
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>• Stay hydrated by drinking plenty of water throughout the day</li>
            <li>• Choose whole, unprocessed foods whenever possible</li>
            <li>• Pay attention to portion sizes to manage calorie intake</li>
            <li>• Include a variety of fruits and vegetables in your diet</li>
            <li>• Limit sugary drinks and processed snacks</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
