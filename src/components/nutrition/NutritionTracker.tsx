import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { MetricCard } from "@/components/ui/metric-card";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Target, Plus, TrendingUp, TrendingDown, Scale, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CalorieGoal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodLog {
  id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
  meal_type?: string;
  serving_size?: string;
  serving_unit?: string;
}

const getProgressStatus = (consumed: number, goal: number) => {
  const percentage = (consumed / goal) * 100;
  if (percentage < 80) return 'under';
  if (percentage > 120) return 'over';
  return 'good';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'under': return 'text-red-500';
    case 'over': return 'text-yellow-500';
    default: return 'text-green-500';
  }
};

const getProgressColors = (status: string) => {
  switch (status) {
    case 'under': return '[&>div]:bg-red-500';
    case 'over': return '[&>div]:bg-yellow-500';
    default: return '[&>div]:bg-green-500';
  }
};

export const NutritionTracker = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [dailyGoal, setDailyGoal] = useState<CalorieGoal>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 66,
  });
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [consumedProtein, setConsumedProtein] = useState(0);
  const [consumedCarbs, setConsumedCarbs] = useState(0);
  const [consumedFat, setConsumedFat] = useState(0);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      loadDailyGoal();
      loadFoodLogs();
    }
  }, [session?.user]);

  const loadDailyGoal = async () => {
    try {
      const { data, error } = await supabase
        .from("calorie_goals")
        .select("*")
        .eq("user_id", session?.user.id)
        .single();

      if (error) throw error;

      if (data) {
        setDailyGoal({
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fat: data.fat,
        });
      }
    } catch (error) {
      console.error("Error loading daily goal:", error);
      toast({
        title: "Error loading daily goal",
        description: "Could not load your daily calorie goal",
        variant: "destructive",
      });
    }
  };

  const loadFoodLogs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("food_logs")
        .select("*")
        .eq("user_id", session?.user.id)
        .gte("timestamp", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
        .order("timestamp", { ascending: false });

      if (error) throw error;

      setFoodLogs(data || []);
      updateConsumedNutrients(data || []);
    } catch (error) {
      console.error("Error loading food logs:", error);
      toast({
        title: "Error loading food logs",
        description: "Could not load your food logs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsumedNutrients = (logs: FoodLog[]) => {
    const totals = logs.reduce((acc, log) => ({
      calories: acc.calories + (log.calories || 0),
      protein: acc.protein + (log.protein || 0),
      carbs: acc.carbs + (log.carbs || 0),
      fat: acc.fat + (log.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    setConsumedCalories(totals.calories);
    setConsumedProtein(totals.protein);
    setConsumedCarbs(totals.carbs);
    setConsumedFat(totals.fat);
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const calorieStatus = getProgressStatus(consumedCalories, dailyGoal.calories);
  const proteinStatus = getProgressStatus(consumedProtein, dailyGoal.protein);
  const carbsStatus = getProgressStatus(consumedCarbs, dailyGoal.carbs);
  const fatStatus = getProgressStatus(consumedFat, dailyGoal.fat);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Calories</CardTitle>
              <Badge variant="outline" className={cn(getStatusColor(calorieStatus))}>
                {calorieStatus === 'under' ? 'Below Target' :
                 calorieStatus === 'over' ? 'Above Target' :
                 'On Track'}
              </Badge>
            </div>
            <CardDescription>Daily calorie intake</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{consumedCalories}</div>
            <Progress 
              value={(consumedCalories / dailyGoal.calories) * 100} 
              className={cn("h-2", getProgressColors(calorieStatus))}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>{dailyGoal.calories}</span>
            </div>
          </CardContent>
        </MetricCard>

        <MetricCard>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Protein</CardTitle>
              <Badge variant="outline" className={cn(getStatusColor(proteinStatus))}>
                {proteinStatus === 'under' ? 'Below Target' :
                 proteinStatus === 'over' ? 'Above Target' :
                 'On Track'}
              </Badge>
            </div>
            <CardDescription>Daily protein intake</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{consumedProtein}g</div>
            <Progress 
              value={(consumedProtein / dailyGoal.protein) * 100} 
              className={cn("h-2", getProgressColors(proteinStatus))}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0g</span>
              <span>{dailyGoal.protein}g</span>
            </div>
          </CardContent>
        </MetricCard>

        <MetricCard>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Carbs</CardTitle>
              <Badge variant="outline" className={cn(getStatusColor(carbsStatus))}>
                {carbsStatus === 'under' ? 'Below Target' :
                 carbsStatus === 'over' ? 'Above Target' :
                 'On Track'}
              </Badge>
            </div>
            <CardDescription>Daily carbohydrate intake</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{consumedCarbs}g</div>
            <Progress 
              value={(consumedCarbs / dailyGoal.carbs) * 100} 
              className={cn("h-2", getProgressColors(carbsStatus))}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0g</span>
              <span>{dailyGoal.carbs}g</span>
            </div>
          </CardContent>
        </MetricCard>

        <MetricCard>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Fat</CardTitle>
              <Badge variant="outline" className={cn(getStatusColor(fatStatus))}>
                {fatStatus === 'under' ? 'Below Target' :
                 fatStatus === 'over' ? 'Above Target' :
                 'On Track'}
              </Badge>
            </div>
            <CardDescription>Daily fat intake</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{consumedFat}g</div>
            <Progress 
              value={(consumedFat / dailyGoal.fat) * 100} 
              className={cn("h-2", getProgressColors(fatStatus))}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0g</span>
              <span>{dailyGoal.fat}g</span>
            </div>
          </CardContent>
        </MetricCard>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Food Logs</CardTitle>
            <CardDescription>Your latest food entries for today</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="ml-2">
            <Plus className="h-4 w-4 mr-1" />
            Add Food
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {foodLogs.length > 0 ? (
                foodLogs.map((log) => (
                  <Card key={log.id} className="p-4 bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium tracking-tight">{log.food_name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(log.timestamp)}</span>
                          {log.meal_type && (
                            <Badge variant="secondary" className="ml-2">
                              {log.meal_type}
                            </Badge>
                          )}
                        </div>
                        {log.serving_size && (
                          <p className="text-sm text-muted-foreground">
                            {log.serving_size} {log.serving_unit}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{log.calories} calories</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{log.protein}g protein</Badge>
                          <Badge variant="outline">{log.carbs}g carbs</Badge>
                          <Badge variant="outline">{log.fat}g fat</Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Scale className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No food logs found for today.</p>
                  <p className="text-sm">Start tracking your meals to see them here.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
