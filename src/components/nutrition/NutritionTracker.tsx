
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { FoodItem, NutritionGoals } from "@/types/database";
import { safeArrayCast, assertType } from "@/utils/typeSafeUtils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, TooltipProps
} from "recharts";
import { AreaChart, Area } from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Utensils, 
  Flame, 
  Sparkles, 
  Wheat, 
  Cookie, 
  Clock, 
  Plus, 
  Trash2, 
  Edit, 
  Calendar, 
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Filter
} from "lucide-react";
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isToday, addDays, isSameDay } from "date-fns";

interface FormValues {
  food_name: string;
  calories: string;
  protein_grams: string;
  carbs_grams: string;
  fat_grams: string;
  serving_size: string;
  meal_type: string;
  meal_time: string;
  notes: string;
}

interface NutritionSummary {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" }
];

const INITIAL_FORM_VALUES = {
  food_name: "",
  calories: "",
  protein_grams: "",
  carbs_grams: "",
  fat_grams: "",
  serving_size: "",
  meal_type: "breakfast",
  meal_time: format(new Date(), "HH:mm"),
  notes: ""
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const NutritionTracker = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("today");
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM_VALUES);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGoalsDialogOpen, setIsGoalsDialogOpen] = useState(false);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [dateFilter, setDateFilter] = useState("today");
  
  const { data: foodItems, isLoading: itemsLoading } = useQuery({
    queryKey: ["food_items", session?.user?.id, dateFilter],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      let query = supabase
        .from("food_items")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      
      // Apply date filtering
      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfToday = new Date(today.setHours(23, 59, 59, 999)).toISOString();
      
      switch (dateFilter) {
        case "today":
          query = query.gte("created_at", startOfToday).lte("created_at", endOfToday);
          break;
        case "week":
          const startDate = startOfWeek(today, { weekStartsOn: 1 }).toISOString();
          const endDate = endOfWeek(today, { weekStartsOn: 1 }).toISOString();
          query = query.gte("created_at", startDate).lte("created_at", endDate);
          break;
        case "month":
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();
          query = query.gte("created_at", startOfMonth).lte("created_at", endOfMonth);
          break;
        // All is the default, no filter needed
      }
        
      const { data, error } = await query;
        
      if (error) throw error;
      
      return safeArrayCast<FoodItem>(data || []);
    },
    enabled: !!session?.user?.id,
  });
  
  const { data: nutritionGoals, isLoading: goalsLoading } = useQuery({
    queryKey: ["nutrition_goals", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("nutrition_goals")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();
        
      if (error) throw error;
      
      // If no goals are set, return default goals
      if (!data) {
        return {
          id: "",
          user_id: session.user.id,
          daily_calories: 2000,
          daily_protein: 50,
          daily_carbs: 275,
          daily_fat: 55,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      return assertType<NutritionGoals>(data);
    },
    enabled: !!session?.user?.id,
  });
  
  const { data: historicalData } = useQuery({
    queryKey: ["food_history", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      // Get the past 7 days
      const today = new Date();
      const sevenDaysAgo = addDays(today, -6);
      const dateRange = eachDayOfInterval({ start: sevenDaysAgo, end: today });
      
      const { data, error } = await supabase
        .from("food_items")
        .select("*")
        .eq("user_id", session.user.id)
        .gte("created_at", sevenDaysAgo.toISOString())
        .lte("created_at", today.toISOString());
      
      if (error) throw error;
      
      const items = safeArrayCast<FoodItem>(data || []);
      
      // Aggregate data by day
      const summaryByDay: Record<string, NutritionSummary> = {};
      
      // Initialize with zero values for all dates
      dateRange.forEach(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        summaryByDay[dateStr] = {
          date: format(date, 'MMM dd'),
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        };
      });
      
      // Sum up values for each day
      items.forEach(item => {
        const date = format(parseISO(item.created_at), 'yyyy-MM-dd');
        if (summaryByDay[date]) {
          summaryByDay[date].calories += item.calories;
          summaryByDay[date].protein += item.protein_grams;
          summaryByDay[date].carbs += item.carbs_grams;
          summaryByDay[date].fat += item.fat_grams;
        }
      });
      
      return Object.values(summaryByDay);
    },
    enabled: !!session?.user?.id,
  });
  
  const addFoodItemMutation = useMutation({
    mutationFn: async (newItem: {
      food_name: string;
      calories: number;
      protein_grams: number;
      carbs_grams: number;
      fat_grams: number;
      serving_size?: string;
      meal_type?: string;
      meal_time?: string;
      notes?: string;
    }) => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }
      
      const itemWithUserId = {
        ...newItem,
        user_id: session.user.id
      };
      
      const { data, error } = await supabase
        .from("food_items")
        .insert(itemWithUserId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["food_items", session?.user?.id] });
      queryClient.invalidateQueries({ queryKey: ["food_history", session?.user?.id] });
      toast({
        title: "Food item added",
        description: "Your food item has been successfully logged.",
      });
      setFormValues(INITIAL_FORM_VALUES);
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add food item: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const updateFoodItemMutation = useMutation({
    mutationFn: async (updatedItem: {
      id: string;
      food_name: string;
      calories: number;
      protein_grams: number;
      carbs_grams: number;
      fat_grams: number;
      serving_size?: string;
      meal_type?: string;
      meal_time?: string;
      notes?: string;
    }) => {
      const { id, ...item } = updatedItem;
      
      const { data, error } = await supabase
        .from("food_items")
        .update(item)
        .eq("id", id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["food_items", session?.user?.id] });
      queryClient.invalidateQueries({ queryKey: ["food_history", session?.user?.id] });
      toast({
        title: "Food item updated",
        description: "Your food item has been successfully updated.",
      });
      setFormValues(INITIAL_FORM_VALUES);
      setEditingItemId(null);
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update food item: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const deleteFoodItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("food_items")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["food_items", session?.user?.id] });
      queryClient.invalidateQueries({ queryKey: ["food_history", session?.user?.id] });
      toast({
        title: "Food item deleted",
        description: "Your food item has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete food item: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const updateNutritionGoalsMutation = useMutation({
    mutationFn: async (goals: {
      daily_calories: number;
      daily_protein: number;
      daily_carbs: number;
      daily_fat: number;
    }) => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }
      
      const { data: existingGoals } = await supabase
        .from("nutrition_goals")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();
        
      let result;
      
      if (existingGoals) {
        const { data, error } = await supabase
          .from("nutrition_goals")
          .update({
            ...goals,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingGoals.id)
          .select();
          
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from("nutrition_goals")
          .insert({
            ...goals,
            user_id: session.user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();
          
        if (error) throw error;
        result = data;
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition_goals", session?.user?.id] });
      toast({
        title: "Nutrition goals updated",
        description: "Your nutrition goals have been successfully updated.",
      });
      setIsGoalsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update nutrition goals: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem = {
      food_name: formValues.food_name,
      calories: Number(formValues.calories),
      protein_grams: Number(formValues.protein_grams),
      carbs_grams: Number(formValues.carbs_grams),
      fat_grams: Number(formValues.fat_grams),
      serving_size: formValues.serving_size,
      meal_type: formValues.meal_type,
      meal_time: formValues.meal_time,
      notes: formValues.notes
    };
    
    if (editingItemId) {
      updateFoodItemMutation.mutate({
        id: editingItemId,
        ...newItem
      });
    } else {
      addFoodItemMutation.mutate(newItem);
    }
  };
  
  const handleEditItem = (item: FoodItem) => {
    setFormValues({
      food_name: item.food_name,
      calories: item.calories.toString(),
      protein_grams: item.protein_grams.toString(),
      carbs_grams: item.carbs_grams.toString(),
      fat_grams: item.fat_grams.toString(),
      serving_size: item.serving_size || "",
      meal_type: item.meal_type || "breakfast",
      meal_time: item.meal_time || format(new Date(), "HH:mm"),
      notes: item.notes || ""
    });
    setEditingItemId(item.id);
    setIsAddDialogOpen(true);
  };
  
  const handleDeleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      deleteFoodItemMutation.mutate(id);
    }
  };
  
  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    updateNutritionGoalsMutation.mutate({
      daily_calories: Number(formData.get("daily_calories")),
      daily_protein: Number(formData.get("daily_protein")),
      daily_carbs: Number(formData.get("daily_carbs")),
      daily_fat: Number(formData.get("daily_fat"))
    });
  };
  
  // Calculate nutrition totals for today
  const calculateTotals = () => {
    if (!foodItems) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    return foodItems.reduce((acc, item) => {
      return {
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein_grams,
        carbs: acc.carbs + item.carbs_grams,
        fat: acc.fat + item.fat_grams
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };
  
  const totals = calculateTotals();
  
  // Prepare data for pie chart
  const macroDistribution = [
    { name: 'Protein', value: totals.protein * 4 }, // 4 calories per gram
    { name: 'Carbs', value: totals.carbs * 4 }, // 4 calories per gram
    { name: 'Fat', value: totals.fat * 9 }, // 9 calories per gram
  ];
  
  // Prepare data for meal type distribution
  const mealTypeDistribution = React.useMemo(() => {
    if (!foodItems) return [];
    
    const mealTypes: Record<string, number> = {};
    
    foodItems.forEach(item => {
      const type = item.meal_type || 'Other';
      mealTypes[type] = (mealTypes[type] || 0) + item.calories;
    });
    
    return Object.entries(mealTypes).map(([name, value]) => ({ name, value }));
  }, [foodItems]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold">Nutrition Tracker</h2>
          <p className="text-muted-foreground">Track your daily nutrition intake and monitor your progress.</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isGoalsDialogOpen} onOpenChange={setIsGoalsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Sparkles size={16} />
                Set Goals
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nutrition Goals</DialogTitle>
                <DialogDescription>
                  Set your daily nutrition goals to track your progress.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSaveGoals} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="daily_calories">Daily Calories (kcal)</Label>
                  <Input
                    id="daily_calories"
                    name="daily_calories"
                    type="number"
                    defaultValue={nutritionGoals?.daily_calories || 2000}
                    min={0}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="daily_protein">Daily Protein (g)</Label>
                  <Input
                    id="daily_protein"
                    name="daily_protein"
                    type="number"
                    defaultValue={nutritionGoals?.daily_protein || 50}
                    min={0}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="daily_carbs">Daily Carbohydrates (g)</Label>
                  <Input
                    id="daily_carbs"
                    name="daily_carbs"
                    type="number"
                    defaultValue={nutritionGoals?.daily_carbs || 275}
                    min={0}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="daily_fat">Daily Fat (g)</Label>
                  <Input
                    id="daily_fat"
                    name="daily_fat"
                    type="number"
                    defaultValue={nutritionGoals?.daily_fat || 55}
                    min={0}
                    required
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit">Save Goals</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Add Food
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingItemId ? "Edit Food Item" : "Add Food Item"}</DialogTitle>
                <DialogDescription>
                  {editingItemId 
                    ? "Make changes to your food entry below."
                    : "Enter the details of the food you've consumed."}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="food_name">Food Name</Label>
                  <Input
                    id="food_name"
                    name="food_name"
                    value={formValues.food_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Grilled Chicken Breast"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      id="calories"
                      name="calories"
                      type="number"
                      value={formValues.calories}
                      onChange={handleInputChange}
                      placeholder="kcal"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="serving_size">Serving Size</Label>
                    <Input
                      id="serving_size"
                      name="serving_size"
                      value={formValues.serving_size}
                      onChange={handleInputChange}
                      placeholder="e.g., 100g or 1 cup"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="protein_grams">Protein (g)</Label>
                    <Input
                      id="protein_grams"
                      name="protein_grams"
                      type="number"
                      value={formValues.protein_grams}
                      onChange={handleInputChange}
                      placeholder="g"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="carbs_grams">Carbs (g)</Label>
                    <Input
                      id="carbs_grams"
                      name="carbs_grams"
                      type="number"
                      value={formValues.carbs_grams}
                      onChange={handleInputChange}
                      placeholder="g"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fat_grams">Fat (g)</Label>
                    <Input
                      id="fat_grams"
                      name="fat_grams"
                      type="number"
                      value={formValues.fat_grams}
                      onChange={handleInputChange}
                      placeholder="g"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meal_type">Meal Type</Label>
                    <Select
                      name="meal_type"
                      value={formValues.meal_type}
                      onValueChange={(value) => 
                        setFormValues(prev => ({ ...prev, meal_type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        {MEAL_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meal_time">Time</Label>
                    <Input
                      id="meal_time"
                      name="meal_time"
                      type="time"
                      value={formValues.meal_time}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    name="notes"
                    value={formValues.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional notes"
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={addFoodItemMutation.isPending || updateFoodItemMutation.isPending}
                  >
                    {addFoodItemMutation.isPending || updateFoodItemMutation.isPending ? 
                      "Saving..." : (editingItemId ? "Update" : "Add")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="h-5 w-5 text-red-500" />
              Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totals.calories} <span className="text-sm font-normal text-muted-foreground">kcal</span>
            </div>
            <Progress 
              value={(totals.calories / (nutritionGoals?.daily_calories || 2000)) * 100} 
              className="h-2 mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.max(0, (nutritionGoals?.daily_calories || 2000) - totals.calories)} kcal remaining
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Utensils className="h-5 w-5 text-blue-500" />
              Protein
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totals.protein} <span className="text-sm font-normal text-muted-foreground">g</span>
            </div>
            <Progress 
              value={(totals.protein / (nutritionGoals?.daily_protein || 50)) * 100} 
              className="h-2 mt-2 bg-blue-100 dark:bg-blue-950"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.max(0, (nutritionGoals?.daily_protein || 50) - totals.protein)} g remaining
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wheat className="h-5 w-5 text-yellow-500" />
              Carbs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totals.carbs} <span className="text-sm font-normal text-muted-foreground">g</span>
            </div>
            <Progress 
              value={(totals.carbs / (nutritionGoals?.daily_carbs || 275)) * 100} 
              className="h-2 mt-2 bg-yellow-100 dark:bg-yellow-950"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.max(0, (nutritionGoals?.daily_carbs || 275) - totals.carbs)} g remaining
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Cookie className="h-5 w-5 text-orange-500" />
              Fat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totals.fat} <span className="text-sm font-normal text-muted-foreground">g</span>
            </div>
            <Progress 
              value={(totals.fat / (nutritionGoals?.daily_fat || 55)) * 100} 
              className="h-2 mt-2 bg-orange-100 dark:bg-orange-950"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.max(0, (nutritionGoals?.daily_fat || 55) - totals.fat)} g remaining
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Food Log</CardTitle>
              <div className="flex gap-2">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {itemsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                    </div>
                    <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : foodItems && foodItems.length > 0 ? (
              <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
                {foodItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between border-b border-border/60 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-10 rounded-full ${
                        item.meal_type === 'breakfast' ? 'bg-yellow-400' :
                        item.meal_type === 'lunch' ? 'bg-green-400' :
                        item.meal_type === 'dinner' ? 'bg-blue-400' :
                        'bg-purple-400'
                      }`}></div>
                      <div>
                        <h4 className="font-medium">{item.food_name}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>{item.serving_size}</span>
                          {item.meal_type && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{item.meal_type}</span>
                            </>
                          )}
                          {item.meal_time && (
                            <>
                              <span>•</span>
                              <span>{item.meal_time}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-medium">{item.calories} kcal</div>
                        <div className="text-xs text-muted-foreground">
                          P: {item.protein_grams}g • C: {item.carbs_grams}g • F: {item.fat_grams}g
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No food items logged</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your nutrition by adding food items.
                </p>
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="mx-auto"
                >
                  <Plus size={16} className="mr-2" />
                  Add Food Item
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Nutrition Overview</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setChartType("bar")}
                >
                  <BarChart3 size={16} />
                </Button>
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setChartType("line")}
                >
                  <LineChartIcon size={16} />
                </Button>
                <Button
                  variant={chartType === "pie" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setChartType("pie")}
                >
                  <PieChartIcon size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {chartType === "pie" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Macronutrient Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={macroDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {macroDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-none shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Calories by Meal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={mealTypeDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {mealTypeDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-[350px]">
                {historicalData && historicalData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "bar" ? (
                      <BarChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="calories" name="Calories" fill="#FF8042" />
                        <Bar dataKey="protein" name="Protein (g)" fill="#0088FE" />
                        <Bar dataKey="carbs" name="Carbs (g)" fill="#FFBB28" />
                        <Bar dataKey="fat" name="Fat (g)" fill="#00C49F" />
                      </BarChart>
                    ) : (
                      <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="calories" 
                          name="Calories" 
                          stroke="#FF8042" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line yAxisId="right" type="monotone" dataKey="protein" name="Protein (g)" stroke="#0088FE" />
                        <Line yAxisId="right" type="monotone" dataKey="carbs" name="Carbs (g)" stroke="#FFBB28" />
                        <Line yAxisId="right" type="monotone" dataKey="fat" name="Fat (g)" stroke="#00C49F" />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No data to visualize</h3>
                    <p className="text-muted-foreground text-center">
                      Add some food items to see your nutrition data visualized.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
