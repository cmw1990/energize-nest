import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FoodLogForm } from '@/components/food/FoodLogForm';
import { NutritionDashboard } from '@/components/nutrition/NutritionDashboard';
import { NutritionAnalytics } from '@/components/nutrition/NutritionAnalytics';
import { NutritionGoals } from '@/components/nutrition/NutritionGoals';
import { WeightTracker } from '@/components/weight/WeightTracker';
import { TodayFoodLogs } from '@/components/food/TodayFoodLogs';
import { BarcodeScanner } from '@/components/food/BarcodeScanner';
import { RecipeCalculator } from '@/components/nutrition/RecipeCalculator';
import {
  NutritionGoalRecord,
  FoodLogEntry,
  NutritionSummary,
  WeightTrend
} from '@/types/nutrition';
import { cn } from "@/lib/utils";
import {
  ChartPie,
  ShoppingBasket,
  Scale,
  Target,
  BarChart3,
  Calendar,
  Clock,
  Calculator,
  Camera
} from 'lucide-react';

const NutritionPage = () => {
  const { session } = useAuth();
  const [activeGoal, setActiveGoal] = useState<NutritionGoalRecord | null>(null);
  const [todaysFoodLogs, setTodaysFoodLogs] = useState<FoodLogEntry[]>([]);
  const [nutritionSummary, setNutritionSummary] = useState<NutritionSummary | null>(null);
  const [weightTrends, setWeightTrends] = useState<WeightTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      loadNutritionData();
    }
  }, [session]);

  const loadNutritionData = async () => {
    if (!session?.user?.id) return;
    setIsLoading(true);

    try {
      // Load active nutrition goal
      const { data: goalData, error: goalError } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (goalError) throw goalError;
      setActiveGoal(goalData);

      // Load today's food logs
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: logsData, error: logsError } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('log_date', today)
        .order('timestamp', { ascending: false });

      if (logsError) throw logsError;
      setTodaysFoodLogs(logsData || []);

      // Calculate nutrition summary
      if (logsData) {
        const summary: NutritionSummary = {
          total_calories: 0,
          total_protein: 0,
          total_carbs: 0,
          total_fat: 0,
          total_fiber: 0,
          meals: {
            breakfast: [],
            lunch: [],
            dinner: [],
            snack: []
          },
          goal_progress: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0
          }
        };

        logsData.forEach(log => {
          summary.total_calories += log.calories;
          summary.total_protein += log.protein_grams;
          summary.total_carbs += log.carbs_grams;
          summary.total_fat += log.fat_grams;
          summary.total_fiber += log.fiber_grams || 0;
          if (log.meal_type) {
            summary.meals[log.meal_type].push(log);
          }
        });

        if (goalData) {
          summary.goal_progress = {
            calories: (summary.total_calories / (goalData.calories_goal || 1)) * 100,
            protein: (summary.total_protein / (goalData.protein_goal_g || 1)) * 100,
            carbs: (summary.total_carbs / (goalData.carbs_goal_g || 1)) * 100,
            fat: (summary.total_fat / (goalData.fat_goal_g || 1)) * 100,
            fiber: (summary.total_fiber / (goalData.fiber_goal_g || 1)) * 100
          };
        }

        setNutritionSummary(summary);
      }

      // Load weight trends
      const { data: weightData, error: weightError } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('log_date', { ascending: true })
        .limit(30);

      if (weightError) throw weightError;
      
      const trends: WeightTrend[] = weightData?.map(log => ({
        date: format(new Date(log.log_date), 'MMM d'),
        weight: log.weight_kg,
        bmi: log.height_m ? log.weight_kg / (log.height_m * log.height_m) : undefined,
        goal_weight: goalData?.target_weight_kg,
        notes: log.notes
      })) || [];

      setWeightTrends(trends);
    } catch (err) {
      console.error('Error loading nutrition data:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load nutrition data"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFoodLog = async (id: string) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('food_logs')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Food log deleted successfully"
      });

      loadNutritionData();
    } catch (err) {
      console.error('Error deleting food log:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete food log"
      });
    }
  };

  const onFoodLogged = () => {
    loadNutritionData();
    toast({
      title: "Success",
      description: "Food logged successfully",
    });
  };

  const onBarcodeScanned = (barcodeData: string) => {
    setShowScanner(false);
    // Handle barcode data
    toast({
      title: "Barcode Scanned",
      description: `Processing barcode: ${barcodeData}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Nutrition Hub</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowScanner(true)}
          >
            <Camera className="h-4 w-4 mr-2" />
            Scan Food
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto gap-4 p-1">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <ChartPie className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="food-log" className="flex items-center gap-2">
            <ShoppingBasket className="h-4 w-4" />
            <span className="hidden sm:inline">Food Log</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Goals</span>
          </TabsTrigger>
          <TabsTrigger value="recipes" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Recipes</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <NutritionDashboard
            goal={activeGoal}
            summary={nutritionSummary}
            weightTrends={weightTrends}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="food-log" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add Food Entry</CardTitle>
                <CardDescription>Log your meals and snacks</CardDescription>
              </CardHeader>
              <CardContent>
                <FoodLogForm onSuccess={onFoodLogged} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Logs</CardTitle>
                <CardDescription>
                  {format(new Date(), 'EEEE, MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {todaysFoodLogs.length > 0 ? (
                    <TodayFoodLogs
                      logs={todaysFoodLogs}
                      onDelete={handleDeleteFoodLog}
                    />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingBasket className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No food logs yet today</p>
                      <p className="text-sm">Start tracking your meals above</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals">
          <NutritionGoals
            currentGoal={activeGoal}
            onGoalUpdated={loadNutritionData}
          />
        </TabsContent>

        <TabsContent value="recipes">
          <RecipeCalculator />
        </TabsContent>

        <TabsContent value="analytics">
          <NutritionAnalytics
            goal={activeGoal}
            summary={nutritionSummary}
            weightTrends={weightTrends}
          />
        </TabsContent>
      </Tabs>

      {showScanner && (
        <Card className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <CardContent className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Scan Barcode</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowScanner(false)}
                  >
                    ×
                  </Button>
                </div>
                <CardDescription>
                  Point your camera at a food barcode
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarcodeScanner onScanned={onBarcodeScanned} />
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NutritionPage;
