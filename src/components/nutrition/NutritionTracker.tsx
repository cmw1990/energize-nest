
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Utensils, Droplet, Search, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  serving_size: string;
  serving_unit: string;
}

export function NutritionTracker() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [foodAmount, setFoodAmount] = useState(1);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [mealType, setMealType] = useState("breakfast");
  const [waterAmount, setWaterAmount] = useState(250);

  const { data: foodItems, isLoading: foodsLoading } = useQuery({
    queryKey: ["food_database", searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      
      const { data, error } = await supabase
        .from('food_database')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: searchTerm.length >= 2,
  });

  const { data: dailyNutrition, isLoading: nutritionLoading } = useQuery({
    queryKey: ["daily_nutrition"],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', session?.user?.id)
        .eq('date', today)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Calculate totals
      let totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        water: 0
      };
      
      if (data && data.length > 0) {
        data.forEach(item => {
          totals.calories += item.calorie_intake || 0;
          totals.protein += item.macros?.protein || 0;
          totals.carbs += item.macros?.carbs || 0;
          totals.fat += item.macros?.fat || 0;
          totals.fiber += item.macros?.fiber || 0;
          totals.water += item.water_intake || 0;
        });
      }
      
      return {
        logs: data || [],
        totals
      };
    },
    enabled: !!session?.user?.id,
  });

  const { data: userGoals } = useQuery({
    queryKey: ["nutrition_goals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_nutrition_goals')
        .select('*')
        .eq('user_id', session?.user?.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No goals found, return default values
          return {
            calories: 2000,
            protein: 150,
            carbs: 200,
            fat: 70,
            fiber: 30,
            water: 2000
          };
        }
        throw error;
      }
      
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const addFoodMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFood || !session?.user?.id) return;
      
      const today = new Date().toISOString().split('T')[0];
      const scaledNutrition = {
        calories: Math.round(selectedFood.calories * foodAmount),
        protein: Math.round(selectedFood.protein * foodAmount * 10) / 10,
        carbs: Math.round(selectedFood.carbs * foodAmount * 10) / 10,
        fat: Math.round(selectedFood.fat * foodAmount * 10) / 10,
        fiber: Math.round(selectedFood.fiber * foodAmount * 10) / 10
      };
      
      const { error } = await supabase
        .from('food_logs')
        .insert({
          user_id: session.user.id,
          date: today,
          food_name: selectedFood.name,
          serving_size: `${foodAmount} ${selectedFood.serving_unit}`,
          meal_type: mealType,
          calorie_intake: scaledNutrition.calories,
          macros: {
            protein: scaledNutrition.protein,
            carbs: scaledNutrition.carbs,
            fat: scaledNutrition.fat,
            fiber: scaledNutrition.fiber
          }
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_nutrition"] });
      toast({
        title: "Food added",
        description: `Added ${foodAmount} ${selectedFood?.serving_unit} of ${selectedFood?.name} to your ${mealType}.`,
      });
      setSelectedFood(null);
      setFoodAmount(1);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add food. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  const addWaterMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) return;
      
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('food_logs')
        .insert({
          user_id: session.user.id,
          date: today,
          food_name: "Water",
          serving_size: `${waterAmount} ml`,
          meal_type: "hydration",
          water_intake: waterAmount
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_nutrition"] });
      toast({
        title: "Water added",
        description: `Added ${waterAmount}ml of water to your daily intake.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add water. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-primary" />
          Nutrition Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="add-food">Add Food</TabsTrigger>
            <TabsTrigger value="add-water">Add Water</TabsTrigger>
            <TabsTrigger value="log">Meal Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Daily Nutrition</h3>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Calories</span>
                      <span>{dailyNutrition?.totals.calories || 0} / {userGoals?.calories || 2000} kcal</span>
                    </div>
                    <Progress value={((dailyNutrition?.totals.calories || 0) / (userGoals?.calories || 2000)) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Protein</span>
                      <span>{dailyNutrition?.totals.protein || 0} / {userGoals?.protein || 150} g</span>
                    </div>
                    <Progress value={((dailyNutrition?.totals.protein || 0) / (userGoals?.protein || 150)) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Carbs</span>
                      <span>{dailyNutrition?.totals.carbs || 0} / {userGoals?.carbs || 200} g</span>
                    </div>
                    <Progress value={((dailyNutrition?.totals.carbs || 0) / (userGoals?.carbs || 200)) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Fat</span>
                      <span>{dailyNutrition?.totals.fat || 0} / {userGoals?.fat || 70} g</span>
                    </div>
                    <Progress value={((dailyNutrition?.totals.fat || 0) / (userGoals?.fat || 70)) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Fiber</span>
                      <span>{dailyNutrition?.totals.fiber || 0} / {userGoals?.fiber || 30} g</span>
                    </div>
                    <Progress value={((dailyNutrition?.totals.fiber || 0) / (userGoals?.fiber || 30)) * 100} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Hydration</h3>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Water</span>
                      <span>{dailyNutrition?.totals.water || 0} / {userGoals?.water || 2000} ml</span>
                    </div>
                    <Progress value={((dailyNutrition?.totals.water || 0) / (userGoals?.water || 2000)) * 100} className="h-2" />
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Droplet className="h-5 w-5 text-blue-500" />
                      <h4 className="font-medium">Hydration Tip</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try to drink water consistently throughout the day rather than all at once. Set reminders every hour to take a few sips.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => document.getElementById('add-water-tab')?.click()}>
                    <Droplet className="mr-2 h-4 w-4" /> Add Water
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                className="w-full" 
                onClick={() => document.getElementById('add-food-tab')?.click()}>
                <Plus className="mr-2 h-4 w-4" /> Add Food
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="add-food" className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="food-search">Search Food</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="food-search"
                      placeholder="Enter food name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
              
              {foodsLoading ? (
                <div className="text-center py-4">Searching foods...</div>
              ) : foodItems && foodItems.length > 0 ? (
                <div className="border rounded-md divide-y">
                  {foodItems.map((food: FoodItem) => (
                    <div 
                      key={food.id}
                      className={`p-3 flex justify-between items-center hover:bg-accent cursor-pointer ${
                        selectedFood?.id === food.id ? 'bg-accent' : ''
                      }`}
                      onClick={() => setSelectedFood(food)}
                    >
                      <div>
                        <p className="font-medium">{food.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {food.calories} kcal | {food.protein}g protein | {food.serving_size} {food.serving_unit}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : searchTerm.length >= 2 ? (
                <div className="text-center py-4">No foods found. Try a different search term.</div>
              ) : null}
              
              {selectedFood && (
                <div className="p-4 border rounded-md space-y-4 mt-4">
                  <h3 className="font-medium">{selectedFood.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serving-size">Number of Servings</Label>
                      <Input
                        id="serving-size"
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={foodAmount}
                        onChange={(e) => setFoodAmount(parseFloat(e.target.value) || 1)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        1 serving = {selectedFood.serving_size} {selectedFood.serving_unit}
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="meal-type">Meal Type</Label>
                      <Select value={mealType} onValueChange={setMealType}>
                        <SelectTrigger id="meal-type">
                          <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm">Calories</p>
                      <p className="font-medium">{Math.round(selectedFood.calories * foodAmount)} kcal</p>
                    </div>
                    <div>
                      <p className="text-sm">Protein</p>
                      <p className="font-medium">{(selectedFood.protein * foodAmount).toFixed(1)}g</p>
                    </div>
                    <div>
                      <p className="text-sm">Carbs</p>
                      <p className="font-medium">{(selectedFood.carbs * foodAmount).toFixed(1)}g</p>
                    </div>
                    <div>
                      <p className="text-sm">Fat</p>
                      <p className="font-medium">{(selectedFood.fat * foodAmount).toFixed(1)}g</p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => addFoodMutation.mutate()}
                    disabled={addFoodMutation.isPending}
                  >
                    {addFoodMutation.isPending ? 'Adding...' : 'Add to Log'}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="add-water" id="add-water-tab" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="water-amount">Water Amount (ml)</Label>
                <Input
                  id="water-amount"
                  type="number"
                  min="50"
                  step="50"
                  value={waterAmount}
                  onChange={(e) => setWaterAmount(parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" onClick={() => setWaterAmount(100)}>100ml</Button>
                <Button variant="outline" onClick={() => setWaterAmount(250)}>250ml</Button>
                <Button variant="outline" onClick={() => setWaterAmount(500)}>500ml</Button>
                <Button variant="outline" onClick={() => setWaterAmount(1000)}>1000ml</Button>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-4">
                <h3 className="font-medium mb-2">Current Hydration</h3>
                <Progress 
                  value={((dailyNutrition?.totals.water || 0) / (userGoals?.water || 2000)) * 100} 
                  className="h-2" 
                />
                <p className="text-sm text-right mt-1">
                  {dailyNutrition?.totals.water || 0} / {userGoals?.water || 2000} ml
                </p>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={() => addWaterMutation.mutate()}
                disabled={addWaterMutation.isPending}
              >
                <Droplet className="mr-2 h-4 w-4" />
                {addWaterMutation.isPending ? 'Adding...' : 'Add Water'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="log" className="space-y-6">
            {nutritionLoading ? (
              <div className="text-center py-4">Loading your meal log...</div>
            ) : dailyNutrition?.logs && dailyNutrition.logs.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Today's Food Log</h3>
                
                <div className="border rounded-md divide-y">
                  {dailyNutrition.logs.map((log) => (
                    <div key={log.id} className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{log.food_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {log.serving_size} • {log.meal_type.charAt(0).toUpperCase() + log.meal_type.slice(1)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{log.calorie_intake} kcal</p>
                          {log.macros && (
                            <p className="text-xs text-muted-foreground">
                              P: {log.macros.protein}g • C: {log.macros.carbs}g • F: {log.macros.fat}g
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No meals logged today.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => document.getElementById('add-food-tab')?.click()}>
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Meal
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
