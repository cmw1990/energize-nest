
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { NutritionTracker } from "./NutritionTracker";
import { BarChart, LineChart, Pie } from 'recharts';
import { CalendarDays, Utensils, LineChart as LineChartIcon, BarChart as BarChartIcon, PieChart, Search, Plus, ArrowUpDown, Activity, Beef, Egg, Fish, Milk, Apple, Carrot, Calculator } from 'lucide-react';

export const NutritionDashboard: React.FC = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("tracker");
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [proteinGoal, setProteinGoal] = useState(150);
  const [carbsGoal, setCarbsGoal] = useState(200);
  const [fatGoal, setFatGoal] = useState(65);
  
  const { data: nutritionLogs, isLoading } = useQuery({
    queryKey: ["nutrition-logs", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("nutrition_logs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("date", { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id
  });
  
  const today = new Date().toISOString().split('T')[0];
  const todaysLog = nutritionLogs?.find(log => log.date === today) || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0
  };
  
  const caloriePercentage = Math.min(100, (todaysLog.calories / calorieGoal) * 100);
  const proteinPercentage = Math.min(100, (todaysLog.protein / proteinGoal) * 100);
  const carbsPercentage = Math.min(100, (todaysLog.carbs / carbsGoal) * 100);
  const fatPercentage = Math.min(100, (todaysLog.fat / fatGoal) * 100);

  // Simplified weekly data for charts
  const weeklyData = nutritionLogs?.slice(0, 7).map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }),
    calories: log.calories,
    protein: log.protein,
    carbs: log.carbs,
    fat: log.fat
  })) || [];
  
  // Macronutrient breakdown for today
  const macroData = [
    { name: 'Protein', value: todaysLog.protein * 4, // 4 calories per gram
      percentage: todaysLog.protein * 4 / todaysLog.calories * 100 || 0 },
    { name: 'Carbs', value: todaysLog.carbs * 4, // 4 calories per gram
      percentage: todaysLog.carbs * 4 / todaysLog.calories * 100 || 0 },
    { name: 'Fat', value: todaysLog.fat * 9, // 9 calories per gram
      percentage: todaysLog.fat * 9 / todaysLog.calories * 100 || 0 }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" />
            Nutrition Dashboard
          </CardTitle>
          <CardDescription>
            Track your daily nutrition intake and monitor macronutrient balance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="tracker">
                <Utensils className="h-4 w-4 mr-2" />
                Food Tracker
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <LineChartIcon className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="calculator">
                <Calculator className="h-4 w-4 mr-2" />
                Calculators
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tracker" className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-2">
                      <div className="text-sm font-medium text-muted-foreground">Calories</div>
                      <div className="text-2xl font-bold">{todaysLog.calories} / {calorieGoal}</div>
                    </div>
                    <Progress value={caloriePercentage} className="h-2" />
                    <div className="mt-2 text-xs text-right text-muted-foreground">
                      {calorieGoal - todaysLog.calories} kcal remaining
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-2">
                      <div className="text-sm font-medium text-muted-foreground">Protein</div>
                      <div className="text-2xl font-bold">{todaysLog.protein}g / {proteinGoal}g</div>
                    </div>
                    <Progress value={proteinPercentage} className="h-2 bg-muted [&>div]:bg-red-500" />
                    <div className="mt-2 text-xs text-right text-muted-foreground">
                      {proteinGoal - todaysLog.protein}g remaining
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-2">
                      <div className="text-sm font-medium text-muted-foreground">Carbs</div>
                      <div className="text-2xl font-bold">{todaysLog.carbs}g / {carbsGoal}g</div>
                    </div>
                    <Progress value={carbsPercentage} className="h-2 bg-muted [&>div]:bg-amber-500" />
                    <div className="mt-2 text-xs text-right text-muted-foreground">
                      {carbsGoal - todaysLog.carbs}g remaining
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-2">
                      <div className="text-sm font-medium text-muted-foreground">Fat</div>
                      <div className="text-2xl font-bold">{todaysLog.fat}g / {fatGoal}g</div>
                    </div>
                    <Progress value={fatPercentage} className="h-2 bg-muted [&>div]:bg-blue-500" />
                    <div className="mt-2 text-xs text-right text-muted-foreground">
                      {fatGoal - todaysLog.fat}g remaining
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <NutritionTracker />
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Macronutrient Balance</CardTitle>
                  <CardDescription>
                    Current distribution of macronutrients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <PieChart className="h-48 w-48 text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {macroData.map((item, index) => (
                      <div key={index} className="text-center space-y-1">
                        <div className="text-lg font-bold">{Math.round(item.percentage)}%</div>
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.value} kcal</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <BarChartIcon className="h-4 w-4 text-primary" />
                      Weekly Calorie Intake
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <BarChartIcon className="h-40 w-40 text-muted-foreground/50" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <LineChartIcon className="h-4 w-4 text-primary" />
                      Macronutrient Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <LineChartIcon className="h-40 w-40 text-muted-foreground/50" />
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      Nutrition Calendar View
                    </CardTitle>
                    <CardDescription>
                      Track your nutrition consistency over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 28 }).map((_, i) => {
                        // Randomize sample data
                        const quality = Math.random();
                        let bgColor = 'bg-red-100';
                        if (quality > 0.8) bgColor = 'bg-green-100';
                        else if (quality > 0.5) bgColor = 'bg-amber-100';
                        
                        return (
                          <div 
                            key={i}
                            className={`aspect-square rounded ${bgColor} flex items-center justify-center text-xs font-medium`}
                          >
                            {i + 1}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-100"></div>
                        <span className="text-xs">Below Goal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-amber-100"></div>
                        <span className="text-xs">Near Goal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-100"></div>
                        <span className="text-xs">Met Goal</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="calculator" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">BMR Calculator</CardTitle>
                    <CardDescription>
                      Calculate your Basal Metabolic Rate
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Gender</label>
                          <Select defaultValue="male">
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Age</label>
                          <Input type="number" placeholder="Years" defaultValue="30" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Weight</label>
                          <Input type="number" placeholder="kg" defaultValue="70" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Height</label>
                          <Input type="number" placeholder="cm" defaultValue="175" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Activity Level</label>
                        <Select defaultValue="moderate">
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary</SelectItem>
                            <SelectItem value="light">Light Activity</SelectItem>
                            <SelectItem value="moderate">Moderate Activity</SelectItem>
                            <SelectItem value="active">Very Active</SelectItem>
                            <SelectItem value="extreme">Extremely Active</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button className="w-full">Calculate</Button>
                      
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <div className="text-sm font-medium mb-1">Your BMR</div>
                        <div className="text-2xl font-bold">1,745 calories/day</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Total Daily Energy Expenditure: 2,618 calories
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Macro Calculator</CardTitle>
                    <CardDescription>
                      Find your optimal macronutrient distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Daily Calorie Goal</label>
                        <Input type="number" placeholder="Calories" defaultValue="2000" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Diet Type</label>
                        <Select defaultValue="balanced">
                          <SelectTrigger>
                            <SelectValue placeholder="Select diet type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="balanced">Balanced (40/30/30)</SelectItem>
                            <SelectItem value="lowcarb">Low Carb (25/40/35)</SelectItem>
                            <SelectItem value="highprotein">High Protein (25/50/25)</SelectItem>
                            <SelectItem value="keto">Ketogenic (5/30/65)</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Carbs %</label>
                          <Input type="number" placeholder="%" defaultValue="40" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Protein %</label>
                          <Input type="number" placeholder="%" defaultValue="30" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Fat %</label>
                          <Input type="number" placeholder="%" defaultValue="30" />
                        </div>
                      </div>
                      
                      <Button className="w-full">Calculate Macros</Button>
                      
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="p-2 bg-amber-50 rounded-lg text-center">
                          <div className="text-sm font-medium text-amber-700">Carbs</div>
                          <div className="text-xl font-bold">200g</div>
                          <div className="text-xs text-muted-foreground">800 kcal</div>
                        </div>
                        <div className="p-2 bg-red-50 rounded-lg text-center">
                          <div className="text-sm font-medium text-red-700">Protein</div>
                          <div className="text-xl font-bold">150g</div>
                          <div className="text-xs text-muted-foreground">600 kcal</div>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-center">
                          <div className="text-sm font-medium text-blue-700">Fat</div>
                          <div className="text-xl font-bold">67g</div>
                          <div className="text-xs text-muted-foreground">600 kcal</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Food Guide</CardTitle>
                  <CardDescription>
                    Recommended foods based on your goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <div className="p-1 rounded-full bg-red-50">
                          <Beef className="h-4 w-4 text-red-500" />
                        </div>
                        Protein Sources
                      </h3>
                      <ul className="space-y-1">
                        <li className="flex items-center gap-2 text-sm">
                          <span className="w-1 h-1 rounded-full bg-primary"></span>
                          Chicken breast (31g per 100g)
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <span className="w-1 h-1 rounded-full bg-primary"></span>
                          Lean beef (26g per 100g)
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <span className="w-1 h-1 rounded-full bg-primary"></span>
                          Greek yogurt (10g per 100g)
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <span className="w-1 h-1 rounded-full bg-primary"></span>
                          Eggs (13g per 100g)
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <span className="w-1 h-1 rounded-full bg-primary"></span>
                          Tofu (8g per 100g)
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <div className="p-1 rounded-full bg-amber-50">
                          <Apple className="h-4 w-4 text-amber-500" />
                        </div>
                        Carbohydrate Sources
                      </h3>
                      <ul className="space-y-1">
                        <li className="flex items-center gap-2 text-sm">
                          <span className="w-1 h-1 rounded-full bg-primary"></span>
                          Brown rice (23g per 100g)
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <span className="w-1 h-1 rounded-full bg-primary"></span>
                          Sweet potatoes (20g per 100g)
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <span className="w-1 h-1 rounded-full bg-primary"></span>
                          Oats (66g per 100g)
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <span className="w-1 h-1 rounded-full bg-primary"></span>
                          Quinoa (21g per 100g)
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <span className="w-1 h-1 rounded-full bg-primary"></span>
                          Fruits (variable)
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <div className="p-1 rounded-full bg-blue-50">
                          <Fish className="h-4 w-4 text-blue-500" />
                        </div>
                        Healthy Fat Sources
                      </h3>
                      <ul className="space-y-1">
                        <li className="flex items-center gap-2 text-sm">
                          <span className="w-1 h-1 rounded-full bg-primary"></span>
                          Avocados (15g per 100g)
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <span className="w-1 h-1 rounded-full bg-primary"></span>
                          Olive oil (100g per 100g)
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <span className="w-1 h-1 rounded-full bg-primary"></span>
                          Nuts and seeds (variable)
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <span className="w-1 h-1 rounded-full bg-primary"></span>
                          Fatty fish (salmon, 13g per 100g)
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <span className="w-1 h-1 rounded-full bg-primary"></span>
                          Dark chocolate (31g per 100g)
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
