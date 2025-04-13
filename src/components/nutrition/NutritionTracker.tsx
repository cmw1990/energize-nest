import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { MetricCard } from "@/components/ui/metric-card";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Target, Plus } from "lucide-react";

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
}

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
    }
  };

  const updateConsumedNutrients = (logs: FoodLog[]) => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    logs.forEach((log) => {
      calories += log.calories;
      protein += log.protein;
      carbs += log.carbs;
      fat += log.fat;
    });

    setConsumedCalories(calories);
    setConsumedProtein(protein);
    setConsumedCarbs(carbs);
    setConsumedFat(fat);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard>
        <CardHeader className="space-y-1">
          <CardTitle className="text-sm font-medium">Calories</CardTitle>
          <CardDescription>Daily calorie intake</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold">{consumedCalories}</div>
          <Progress 
            value={(consumedCalories / dailyGoal.calories) * 100} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>{dailyGoal.calories}</span>
          </div>
        </CardContent>
      </MetricCard>

      <MetricCard>
        <CardHeader className="space-y-1">
          <CardTitle className="text-sm font-medium">Protein</CardTitle>
          <CardDescription>Daily protein intake</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold">{consumedProtein}g</div>
          <Progress 
            value={(consumedProtein / dailyGoal.protein) * 100} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0g</span>
            <span>{dailyGoal.protein}g</span>
          </div>
        </CardContent>
      </MetricCard>

      <MetricCard>
        <CardHeader className="space-y-1">
          <CardTitle className="text-sm font-medium">Carbs</CardTitle>
          <CardDescription>Daily carbohydrate intake</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold">{consumedCarbs}g</div>
          <Progress 
            value={(consumedCarbs / dailyGoal.carbs) * 100} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0g</span>
            <span>{dailyGoal.carbs}g</span>
          </div>
        </CardContent>
      </MetricCard>

      <MetricCard>
        <CardHeader className="space-y-1">
          <CardTitle className="text-sm font-medium">Fat</CardTitle>
          <CardDescription>Daily fat intake</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold">{consumedFat}g</div>
          <Progress 
            value={(consumedFat / dailyGoal.fat) * 100} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0g</span>
            <span>{dailyGoal.fat}g</span>
          </div>
        </CardContent>
      </MetricCard>

      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Food Logs</CardTitle>
            <CardDescription>Your latest food entries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {foodLogs.length > 0 ? (
              foodLogs.map((log) => (
                <Card key={log.id} className="p-3 bg-white/50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{log.food_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{log.calories} calories</p>
                      <p className="text-sm text-muted-foreground">
                        {log.protein}g protein, {log.carbs}g carbs, {log.fat}g fat
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p>No food logs found for today.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
