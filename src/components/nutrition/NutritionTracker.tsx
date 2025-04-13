
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  Clock, 
  ChevronRight, 
  X, 
  Camera, 
  BarChart, 
  Utensils,
  Check
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: string;
  food_group: string;
}

interface MealEntry {
  id: string;
  user_id: string;
  food_id: string;
  food_name: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: string;
  servings: number;
  date: string;
  time: string;
}

export const NutritionTracker = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servings, setServings] = useState(1);
  const [mealType, setMealType] = useState("breakfast");
  const [todaysMeals, setTodaysMeals] = useState<MealEntry[]>([]);
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddSheet, setShowAddSheet] = useState(false);

  // Load today's meals
  useEffect(() => {
    if (session?.user?.id) {
      fetchTodaysMeals();
    }
  }, [session, date]);

  // Calculate daily totals
  useEffect(() => {
    calculateDailyTotals();
  }, [todaysMeals]);

  const fetchTodaysMeals = async () => {
    try {
      const { data, error } = await supabase
        .from('meal_entries')
        .select('*')
        .eq('user_id', session?.user?.id)
        .eq('date', date)
        .order('time', { ascending: true });
      
      if (error) throw error;
      
      setTodaysMeals(data || []);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const calculateDailyTotals = () => {
    const totals = todaysMeals.reduce((acc, meal) => {
      return {
        calories: acc.calories + (meal.calories * meal.servings),
        protein: acc.protein + (meal.protein * meal.servings),
        carbs: acc.carbs + (meal.carbs * meal.servings),
        fat: acc.fat + (meal.fat * meal.servings),
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    setDailyTotals(totals);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('food_database')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .limit(20);
      
      if (error) throw error;
      
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching foods:', error);
      toast({
        title: "Search error",
        description: "There was a problem searching for food items",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setServings(1);
    setShowAddSheet(true);
  };

  const handleAddFood = async () => {
    if (!selectedFood || !session?.user?.id) return;
    
    try {
      const now = new Date();
      const time = now.toTimeString().split(' ')[0].substring(0, 5);
      
      const newEntry = {
        user_id: session.user.id,
        food_id: selectedFood.id,
        food_name: selectedFood.name,
        meal_type: mealType,
        calories: selectedFood.calories,
        protein: selectedFood.protein,
        carbs: selectedFood.carbs,
        fat: selectedFood.fat,
        serving_size: selectedFood.serving_size,
        servings: servings,
        date: date,
        time: time,
      };
      
      const { data, error } = await supabase
        .from('meal_entries')
        .insert(newEntry)
        .select()
        .single();
      
      if (error) throw error;
      
      setTodaysMeals([...todaysMeals, data]);
      setSelectedFood(null);
      setServings(1);
      setShowAddSheet(false);
      
      toast({
        title: "Food added",
        description: "Your meal has been logged successfully",
      });
    } catch (error) {
      console.error('Error adding food:', error);
      toast({
        title: "Error adding food",
        description: "There was a problem saving your meal",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMeal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', session?.user?.id);
      
      if (error) throw error;
      
      setTodaysMeals(todaysMeals.filter(meal => meal.id !== id));
      
      toast({
        title: "Meal removed",
        description: "The food item has been removed",
      });
    } catch (error) {
      console.error('Error removing meal:', error);
    }
  };

  const handleDateChange = (direction: 'prev' | 'next') => {
    const currentDate = new Date(date);
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    
    setDate(newDate.toISOString().split('T')[0]);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getNutrientPercentage = (nutrient: 'protein' | 'carbs' | 'fat') => {
    const total = dailyTotals.protein + dailyTotals.carbs + dailyTotals.fat;
    return total > 0 ? Math.round((dailyTotals[nutrient] / total) * 100) : 0;
  };

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'lunch':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'dinner':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'snack':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daily Nutrition Summary</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => handleDateChange('prev')}
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
              </Button>
              <span className="font-medium">{formatDate(date)}</span>
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => handleDateChange('next')}
                disabled={date === new Date().toISOString().split('T')[0]}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <h3 className="text-xl font-bold">{Math.round(dailyTotals.calories)}</h3>
              <p className="text-sm text-muted-foreground">Calories</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <h3 className="text-xl font-bold">{Math.round(dailyTotals.protein)}g</h3>
              <p className="text-sm text-muted-foreground">Protein</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <h3 className="text-xl font-bold">{Math.round(dailyTotals.carbs)}g</h3>
              <p className="text-sm text-muted-foreground">Carbs</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <h3 className="text-xl font-bold">{Math.round(dailyTotals.fat)}g</h3>
              <p className="text-sm text-muted-foreground">Fat</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Macronutrient Balance</h3>
            <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
              <div 
                className="h-full bg-blue-400" 
                style={{ width: `${getNutrientPercentage('protein')}%` }}
              ></div>
              <div 
                className="h-full bg-green-400" 
                style={{ width: `${getNutrientPercentage('carbs')}%` }}
              ></div>
              <div 
                className="h-full bg-red-400" 
                style={{ width: `${getNutrientPercentage('fat')}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span>Protein {getNutrientPercentage('protein')}%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>Carbs {getNutrientPercentage('carbs')}%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <span>Fat {getNutrientPercentage('fat')}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Today's Meals</span>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Food
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full md:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Log Food</SheetTitle>
                    <SheetDescription>
                      Search for a food item or add a custom one.
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label htmlFor="food-search">Search Food</Label>
                        <Input
                          id="food-search"
                          placeholder="e.g., chicken breast"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                      </div>
                      <Button onClick={handleSearch} disabled={isSearching}>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Scan Food
                      </Button>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Custom
                      </Button>
                    </div>
                    
                    <div className="border-t pt-4 pb-2">
                      <h3 className="text-sm font-medium mb-2">Search Results</h3>
                      {isSearching ? (
                        <div className="text-center p-4">
                          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                          <p className="text-sm text-muted-foreground mt-2">Searching...</p>
                        </div>
                      ) : searchResults.length === 0 ? (
                        <div className="text-center p-4 text-muted-foreground">
                          {searchTerm ? "No results found" : "Search for food items"}
                        </div>
                      ) : (
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-2">
                            {searchResults.map((food) => (
                              <div 
                                key={food.id}
                                className="p-3 border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                onClick={() => handleSelectFood(food)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{food.name}</h4>
                                    <p className="text-xs text-muted-foreground">
                                      {food.serving_size}
                                    </p>
                                  </div>
                                  <Badge variant="outline">{food.calories} cal</Badge>
                                </div>
                                <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                                  <span>P: {food.protein}g</span>
                                  <span>C: {food.carbs}g</span>
                                  <span>F: {food.fat}g</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-2">Recent Items</h3>
                      <div className="space-y-2">
                        {todaysMeals.slice(0, 3).map((meal) => (
                          <div 
                            key={meal.id}
                            className="p-3 border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                            onClick={() => {
                              handleSelectFood({
                                id: meal.food_id,
                                name: meal.food_name,
                                calories: meal.calories,
                                protein: meal.protein,
                                carbs: meal.carbs,
                                fat: meal.fat,
                                serving_size: meal.serving_size,
                                food_group: "",
                              });
                              setMealType(meal.meal_type);
                            }}
                          >
                            <div className="flex justify-between">
                              <h4 className="font-medium">{meal.food_name}</h4>
                              <Badge variant="outline">{meal.calories * meal.servings} cal</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
                <TabsTrigger value="lunch">Lunch</TabsTrigger>
                <TabsTrigger value="dinner">Dinner</TabsTrigger>
                <TabsTrigger value="snack">Snacks</TabsTrigger>
              </TabsList>
              
              {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(mealTab => (
                <TabsContent key={mealTab} value={mealTab} className="space-y-2">
                  {todaysMeals.length === 0 ? (
                    <div className="text-center p-6 text-muted-foreground">
                      <Utensils className="h-12 w-12 mx-auto mb-2 text-muted-foreground/60" />
                      <p>No meals logged for today</p>
                      <Button variant="outline" className="mt-2" onClick={() => setShowAddSheet(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Meal
                      </Button>
                    </div>
                  ) : todaysMeals
                      .filter(meal => mealTab === 'all' || meal.meal_type === mealTab)
                      .length === 0 ? (
                    <div className="text-center p-6 text-muted-foreground">
                      <p>No {mealTab} items logged</p>
                    </div>
                  ) : (
                    todaysMeals
                      .filter(meal => mealTab === 'all' || meal.meal_type === mealTab)
                      .map((meal) => (
                        <div key={meal.id} className="p-3 border rounded-lg flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={getMealTypeColor(meal.meal_type)}>
                              {meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1)}
                            </Badge>
                            <div>
                              <h4 className="font-medium">{meal.food_name}</h4>
                              <div className="flex gap-4 text-xs text-muted-foreground">
                                <span>{meal.serving_size} × {meal.servings}</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {meal.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="font-medium">{Math.round(meal.calories * meal.servings)} cal</span>
                              <div className="text-xs text-muted-foreground">
                                P: {Math.round(meal.protein * meal.servings)}g • 
                                C: {Math.round(meal.carbs * meal.servings)}g • 
                                F: {Math.round(meal.fat * meal.servings)}g
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveMeal(meal.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="w-full md:w-72 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Nutrient Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Calories</span>
                  <span className="font-medium">{Math.round(dailyTotals.calories)} / 2000</span>
                </div>
                <Progress value={(dailyTotals.calories / 2000) * 100} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Protein</span>
                  <span className="font-medium">{Math.round(dailyTotals.protein)} / 120g</span>
                </div>
                <Progress value={(dailyTotals.protein / 120) * 100} className="bg-muted/70" indicatorClassName="bg-blue-400" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Carbs</span>
                  <span className="font-medium">{Math.round(dailyTotals.carbs)} / 200g</span>
                </div>
                <Progress value={(dailyTotals.carbs / 200) * 100} className="bg-muted/70" indicatorClassName="bg-green-400" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fat</span>
                  <span className="font-medium">{Math.round(dailyTotals.fat)} / 65g</span>
                </div>
                <Progress value={(dailyTotals.fat / 65) * 100} className="bg-muted/70" indicatorClassName="bg-red-400" />
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              <Target className="h-4 w-4 mr-2" />
              Adjust Goals
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {showAddSheet && selectedFood && (
        <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
          <SheetContent className="w-full md:max-w-md">
            <SheetHeader>
              <SheetTitle>Add Food to Log</SheetTitle>
              <SheetDescription>
                Customize your food entry
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium">{selectedFood.name}</h3>
                <div className="text-sm text-muted-foreground">
                  {selectedFood.serving_size}
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <div className="text-center">
                    <div className="font-medium">{selectedFood.calories}</div>
                    <div className="text-xs text-muted-foreground">cal</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{selectedFood.protein}g</div>
                    <div className="text-xs text-muted-foreground">protein</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{selectedFood.carbs}g</div>
                    <div className="text-xs text-muted-foreground">carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{selectedFood.fat}g</div>
                    <div className="text-xs text-muted-foreground">fat</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Number of Servings</Label>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => servings > 0.25 && setServings(prev => prev - 0.25)}
                  >
                    -
                  </Button>
                  <Input 
                    type="number" 
                    min="0.25" 
                    step="0.25"
                    value={servings}
                    onChange={(e) => setServings(parseFloat(e.target.value) || 1)}
                    className="mx-2 text-center"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setServings(prev => prev + 0.25)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Meal Type</Label>
                <select 
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              
              <div className="pt-4">
                <div className="mb-2 font-medium">Nutrition with {servings} serving(s):</div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-2 bg-secondary/50 rounded-lg">
                    <div className="font-medium">{Math.round(selectedFood.calories * servings)}</div>
                    <div className="text-xs text-muted-foreground">calories</div>
                  </div>
                  <div className="text-center p-2 bg-secondary/50 rounded-lg">
                    <div className="font-medium">{Math.round(selectedFood.protein * servings)}g</div>
                    <div className="text-xs text-muted-foreground">protein</div>
                  </div>
                  <div className="text-center p-2 bg-secondary/50 rounded-lg">
                    <div className="font-medium">{Math.round(selectedFood.carbs * servings)}g</div>
                    <div className="text-xs text-muted-foreground">carbs</div>
                  </div>
                  <div className="text-center p-2 bg-secondary/50 rounded-lg">
                    <div className="font-medium">{Math.round(selectedFood.fat * servings)}g</div>
                    <div className="text-xs text-muted-foreground">fat</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddSheet(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddFood}>
                  <Check className="h-4 w-4 mr-2" />
                  Add to Log
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};
