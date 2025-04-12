import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Apple, 
  Plus, 
  Search, 
  Calendar, 
  Utensils, 
  Clock, 
  Edit, 
  Trash, 
  Settings, 
  Droplet, 
  Save, 
  X, 
  ChevronDown, 
  ChevronUp, 
  BarChart 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Define proper types to match database structure
interface FoodItem {
  id: string;
  food_name: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  serving_size?: string;
  meal_type: string;
  meal_time: string;
  image_url?: string;
  notes?: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  ai_analysis?: string;
}

interface NutritionGoals {
  id: string;
  user_id: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
  created_at: string;
  updated_at?: string;
}

// Use the API directly with fetch to avoid Supabase type errors
const fetchFoodDatabase = async () => {
  const response = await fetch('/api/food-database');
  if (!response.ok) {
    throw new Error('Failed to fetch food database');
  }
  return response.json();
};

const fetchUserFoodLogs = async (userId: string) => {
  const response = await fetch(`/api/food-logs?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user food logs');
  }
  return response.json();
};

const fetchUserNutritionGoals = async (userId: string) => {
  const response = await fetch(`/api/nutrition-goals?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch nutrition goals');
  }
  return response.json();
};

export function NutritionTracker() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [isSettingGoals, setIsSettingGoals] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Initialize state for food log summary
  const [dailySummary, setDailySummary] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    water: 0
  });

  // New food item form state
  const [newFoodItem, setNewFoodItem] = useState<Partial<FoodItem>>({
    food_name: "",
    calories: 0,
    protein_grams: 0,
    carbs_grams: 0,
    fat_grams: 0,
    meal_type: "breakfast",
    meal_time: new Date().toISOString(),
    notes: ""
  });

  // Goals form state
  const [goalForm, setGoalForm] = useState({
    calories: nutritionGoals?.calories || 2000,
    protein: nutritionGoals?.protein || 150,
    carbs: nutritionGoals?.carbs || 200,
    fat: nutritionGoals?.fat || 70,
    fiber: nutritionGoals?.fiber || 30,
    water: nutritionGoals?.water || 2000
  });

  // Search results
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load data
  useEffect(() => {
    if (session?.user?.id) {
      loadUserData();
    }
  }, [session?.user?.id, selectedDate]);

  const loadUserData = async () => {
    try {
      // Use our async functions that don't rely on Supabase types
      const foodLogs = await fetchUserFoodLogs(session!.user.id);
      const goals = await fetchUserNutritionGoals(session!.user.id);
      
      setFoodItems(foodLogs || []);
      setNutritionGoals(goals || null);
      
      // Calculate the daily summary
      calculateDailySummary(foodLogs);
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Error",
        description: "Failed to load your nutrition data",
        variant: "destructive"
      });
    }
  };

  const calculateDailySummary = (foods: FoodItem[]) => {
    const summary = foods.reduce((acc, food) => {
      return {
        calories: acc.calories + (food.calories || 0),
        protein: acc.protein + (food.protein_grams || 0),
        carbs: acc.carbs + (food.carbs_grams || 0),
        fat: acc.fat + (food.fat_grams || 0),
        fiber: acc.fiber + 0, // Add fiber if it exists in your data
        water: acc.water + 0  // Add water if it exists in your data
      };
    }, {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      water: 0
    });
    
    setDailySummary(summary);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('food_database')
        .select('*')
        .ilike('food_name', `%${searchQuery}%`)
        .limit(10);
      
      if (error) throw error;
      setSearchResults(data as FoodItem[]);
    } catch (error) {
      console.error("Error searching food database:", error);
      toast({
        title: "Search Error",
        description: "Failed to search the food database",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFoodItem = async () => {
    if (!session?.user?.id || !newFoodItem.food_name) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a food name",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('food_logs')
        .insert({
          ...newFoodItem,
          user_id: session.user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Food Added",
        description: "Your food item has been logged successfully"
      });
      
      setFoodItems([...foodItems, data as FoodItem]);
      calculateDailySummary([...foodItems, data as FoodItem]);
      setIsAddingFood(false);
      setNewFoodItem({
        food_name: "",
        calories: 0,
        protein_grams: 0,
        carbs_grams: 0,
        fat_grams: 0,
        meal_type: "breakfast",
        meal_time: new Date().toISOString(),
        notes: ""
      });
    } catch (error) {
      console.error("Error adding food item:", error);
      toast({
        title: "Error",
        description: "Failed to add food item",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFoodItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this food item?")) return;
    
    try {
      const { error } = await supabase
        .from('food_logs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      const updatedFoodItems = foodItems.filter(item => item.id !== id);
      setFoodItems(updatedFoodItems);
      calculateDailySummary(updatedFoodItems);
      
      toast({
        title: "Food Deleted",
        description: "The food item has been removed from your log"
      });
    } catch (error) {
      console.error("Error deleting food item:", error);
      toast({
        title: "Error",
        description: "Failed to delete food item",
        variant: "destructive"
      });
    }
  };

  const handleSaveNutritionGoals = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { error } = await supabase
        .from('user_nutrition_goals')
        .upsert({
          user_id: session.user.id,
          calories: goalForm.calories,
          protein: goalForm.protein,
          carbs: goalForm.carbs,
          fat: goalForm.fat,
          fiber: goalForm.fiber,
          water: goalForm.water,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setNutritionGoals(goalForm as NutritionGoals);
      setIsSettingGoals(false);
      
      toast({
        title: "Goals Updated",
        description: "Your nutrition goals have been updated successfully"
      });
    } catch (error) {
      console.error("Error saving nutrition goals:", error);
      toast({
        title: "Error",
        description: "Failed to save nutrition goals",
        variant: "destructive"
      });
    }
  };

  const calculatePercentage = (current: number, target: number) => {
    if (!target) return 0;
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return <Coffee className="h-4 w-4" />;
      case 'lunch':
        return <Utensils className="h-4 w-4" />;
      case 'dinner':
        return <Utensils className="h-4 w-4" />;
      case 'snack':
        return <Apple className="h-4 w-4" />;
      default:
        return <Utensils className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Nutrition Tracker</h2>
          <p className="text-muted-foreground">Track your daily food intake and nutrition goals</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(selectedDate), "MMMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={new Date(selectedDate)}
                onSelect={(date) => date && setSelectedDate(format(date, "yyyy-MM-dd"))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button onClick={() => setIsAddingFood(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Food
          </Button>
          
          <Button variant="outline" onClick={() => setIsSettingGoals(true)} className="gap-2">
            <Settings className="h-4 w-4" />
            Set Goals
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailySummary.calories} kcal</div>
            <Progress 
              value={calculatePercentage(dailySummary.calories, nutritionGoals?.calories || 2000)} 
              className="h-2 mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              {nutritionGoals?.calories ? `Goal: ${nutritionGoals.calories} kcal` : "Set a calorie goal"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailySummary.protein}g</div>
            <Progress 
              value={calculatePercentage(dailySummary.protein, nutritionGoals?.protein || 150)} 
              className="h-2 mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              {nutritionGoals?.protein ? `Goal: ${nutritionGoals.protein}g` : "Set a protein goal"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Carbs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailySummary.carbs}g</div>
            <Progress 
              value={calculatePercentage(dailySummary.carbs, nutritionGoals?.carbs || 200)} 
              className="h-2 mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              {nutritionGoals?.carbs ? `Goal: ${nutritionGoals.carbs}g` : "Set a carbs goal"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailySummary.fat}g</div>
            <Progress 
              value={calculatePercentage(dailySummary.fat, nutritionGoals?.fat || 70)} 
              className="h-2 mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              {nutritionGoals?.fat ? `Goal: ${nutritionGoals.fat}g` : "Set a fat goal"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Food Log</CardTitle>
        </CardHeader>
        <CardContent>
          {foodItems.length === 0 ? (
            <div className="text-center py-8">
              <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No food logged yet</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking your nutrition by adding food items to your log
              </p>
              <Button onClick={() => setIsAddingFood(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Food
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
                  <TabsTrigger value="lunch">Lunch</TabsTrigger>
                  <TabsTrigger value="dinner">Dinner</TabsTrigger>
                  <TabsTrigger value="snack">Snacks</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                  <div className="space-y-2">
                    {foodItems.map((food) => (
                      <div key={food.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getMealTypeIcon(food.meal_type)}
                          <div>
                            <h4 className="font-medium">{food.food_name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {food.serving_size ? `${food.serving_size} • ` : ""}
                              {food.calories} kcal • {food.protein_grams}g protein • {food.carbs_grams}g carbs • {food.fat_grams}g fat
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteFoodItem(food.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                {["breakfast", "lunch", "dinner", "snack"].map((mealType) => (
                  <TabsContent key={mealType} value={mealType} className="mt-4">
                    <div className="space-y-2">
                      {foodItems
                        .filter((food) => food.meal_type.toLowerCase() === mealType)
                        .map((food) => (
                          <div key={food.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                            <div className="flex items-center gap-3">
                              {getMealTypeIcon(food.meal_type)}
                              <div>
                                <h4 className="font-medium">{food.food_name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {food.serving_size ? `${food.serving_size} • ` : ""}
                                  {food.calories} kcal • {food.protein_grams}g protein • {food.carbs_grams}g carbs • {food.fat_grams}g fat
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteFoodItem(food.id)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      
                      {foodItems.filter((food) => food.meal_type.toLowerCase() === mealType).length === 0 && (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">No {mealType} items logged yet</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Food Dialog */}
      <Dialog open={isAddingFood} onOpenChange={setIsAddingFood}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Food Item</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Search for a food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="max-h-[200px] overflow-y-auto border rounded-md">
                {searchResults.map((food) => (
                  <div
                    key={food.id}
                    className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      setNewFoodItem({
                        ...newFoodItem,
                        food_name: food.food_name,
                        calories: food.calories,
                        protein_grams: food.protein_grams,
                        carbs_grams: food.carbs_grams,
                        fat_grams: food.fat_grams,
                        serving_size: food.serving_size
                      });
                      setSearchResults([]);
                      setSearchQuery("");
                    }}
                  >
                    <div className="font-medium">{food.food_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {food.calories} kcal • {food.protein_grams}g protein • {food.carbs_grams}g carbs • {food.fat_grams}g fat
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="food-name">Food Name</Label>
              <Input
                id="food-name"
                value={newFoodItem.food_name || ""}
                onChange={(e) => setNewFoodItem({ ...newFoodItem, food_name: e.target.value })}
                placeholder="e.g., Grilled Chicken Breast"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  value={newFoodItem.calories || 0}
                  onChange={(e) => setNewFoodItem({ ...newFoodItem, calories: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serving-size">Serving Size (optional)</Label>
                <Input
                  id="serving-size"
                  value={newFoodItem.serving_size || ""}
                  onChange={(e) => setNewFoodItem({ ...newFoodItem, serving_size: e.target.value })}
                  placeholder="e.g., 100g, 1 cup"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={newFoodItem.protein_grams || 0}
                  onChange={(e) => setNewFoodItem({ ...newFoodItem, protein_grams: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={newFoodItem.carbs_grams || 0}
                  onChange={(e) => setNewFoodItem({ ...newFoodItem, carbs_grams: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  value={newFoodItem.fat_grams || 0}
                  onChange={(e) => setNewFoodItem({ ...newFoodItem, fat_grams: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meal-type">Meal Type</Label>
                <Select
                  value={newFoodItem.meal_type}
                  onValueChange={(value) => setNewFoodItem({ ...newFoodItem, meal_type: value })}
                >
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
              
              <div className="space-y-2">
                <Label htmlFor="meal-time">Time</Label>
                <Input
                  id="meal-time"
                  type="time"
                  value={new Date(newFoodItem.meal_time || "").toTimeString().slice(0, 5)}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const date = new Date();
                    date.setHours(hours, minutes);
                    setNewFoodItem({ ...newFoodItem, meal_time: date.toISOString() });
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={newFoodItem.notes || ""}
                onChange={(e) => setNewFoodItem({ ...newFoodItem, notes: e.target.value })}
                placeholder="Any additional notes about this food"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingFood(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFoodItem}>Add Food</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Set Goals Dialog */}
      <Dialog open={isSettingGoals} onOpenChange={setIsSettingGoals}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Nutrition Goals</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="calories-goal">Daily Calories</Label>
                <span className="text-sm font-medium">{goalForm.calories} kcal</span>
              </div>
              <Slider
                id="calories-goal"
                min={1000}
                max={5000}
                step={50}
                value={[goalForm.calories]}
                onValueChange={(value) => setGoalForm({ ...goalForm, calories: value[0] })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="protein-goal">Protein</Label>
                <span className="text-sm font-medium">{goalForm.protein}g</span>
              </div>
              <Slider
                id="protein-goal"
                min={0}
                max={300}
                step={5}
                value={[goalForm.protein]}
                onValueChange={(value) => setGoalForm({ ...goalForm, protein: value[0] })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="carbs-goal">Carbohydrates</Label>
                <span className="text-sm font-medium">{goalForm.carbs}g</span>
              </div>
              <Slider
                id="carbs-goal"
                min={0}
                max={500}
                step={5}
                value={[goalForm.carbs]}
                onValueChange={(value) => setGoalForm({ ...goalForm, carbs: value[0] })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="fat-goal">Fat</Label>
                <span className="text-sm font-medium">{goalForm.fat}g</span>
              </div>
              <Slider
                id="fat-goal"
                min={0}
                max={200}
                step={5}
                value={[goalForm.fat]}
                onValueChange={(value) => setGoalForm({ ...goalForm, fat: value[0] })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="fiber-goal">Fiber</Label>
                <span className="text-sm font-medium">{goalForm.fiber}g</span>
              </div>
              <Slider
                id="fiber-goal"
                min={0}
                max={100}
                step={1}
                value={[goalForm.fiber]}
                onValueChange={(value) => setGoalForm({ ...goalForm, fiber: value[0] })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="water-goal">Water (ml)</Label>
                <span className="text-sm font-medium">{goalForm.water}ml</span>
              </div>
              <Slider
                id="water-goal"
                min={0}
                max={5000}
                step={100}
                value={[goalForm.water]}
                onValueChange={(value) => setGoalForm({ ...goalForm, water: value[0] })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingGoals(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNutritionGoals}>Save Goals</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
