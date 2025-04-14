import React, { useState, useEffect, useCallback } from 'react';
import { WeightTracker } from '@/components/weight/WeightTracker';
import { WeightProgressChart } from '@/components/weight/WeightProgressChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { NutritionGoalRecord } from '@/types/nutrition';
import { AlertCircle, Target, TrendingUp, Scale, Activity } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
interface ProgressStats {
  currentWeight: number | null;
  totalProgress: number;
  progressPercentage: number;
  remainingKg: number;
  bmi: number | null;
  bmiCategory: string;
  bmiColor: string;
  measurementType: string;
  averageMorningWeight: number | null;
  averageEveningWeight: number | null;
  weightVariability: number | null;
  weeklyTrend: number | null;
}

interface WeightData {
  weight_kg: number;
  height_m: number | null;
  measurement_type: string;
  log_date: string;
}
}

const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

const getBMIColor = (bmi: number): string => {
  if (bmi < 18.5) return 'text-blue-500';
  if (bmi < 25) return 'text-green-500';
  if (bmi < 30) return 'text-yellow-500';
  return 'text-red-500';
};

const calculateBMI = (weightKg: number, heightM: number): number | null => {
  if (!heightM || heightM <= 0 || !weightKg || weightKg <= 0) return null;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
};

// Enhanced goal summary component
const GoalSummary: React.FC<{ 
  goal: NutritionGoalRecord | null, 
  stats: ProgressStats | null 
}> = ({ goal, stats }) => {
  if (!goal || !goal.is_active) {
    return (
      <Alert variant="default" className="bg-muted/50">
        <Target className="h-4 w-4" />
        <AlertTitle>No Active Weight Goal</AlertTitle>
        <AlertDescription>
          Set a weight goal in the <Link to="/app/nutrition" className="font-medium text-primary underline">Nutrition Hub</Link> to track your progress visually.
        </AlertDescription>
      </Alert>
    );
  }

  if (!stats) return null;

  const { start_weight_kg, target_weight_kg, weekly_weight_goal_kg } = goal;
  const {
    progressPercentage,
    remainingKg,
    bmi,
    bmiCategory,
    bmiColor,
    averageMorningWeight,
    averageEveningWeight,
    weeklyTrend,
    weightVariability
  } = stats;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Current Progress Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {progressPercentage.toFixed(1)}% Complete
              </p>
              <p className="text-2xl font-bold">
                {remainingKg.toFixed(1)} kg to go
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Weight Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Current Weight
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentWeight?.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">
              Goal: {goal.target_weight_kg} kg
            </p>
            {averageMorningWeight && averageEveningWeight && (
              <div className="mt-2 text-xs text-muted-foreground">
                AM: {averageMorningWeight.toFixed(1)} kg • PM: {averageEveningWeight.toFixed(1)} kg
              </div>
            )}
          </CardContent>
        </Card>

        {/* BMI Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                BMI Status
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bmi?.toFixed(1) || 'N/A'}
            </div>
            <p className={`text-sm ${bmiColor}`}>
              {bmiCategory}
            </p>
            {weightVariability && (
              <p className="mt-2 text-xs text-muted-foreground">
                Variability: ±{weightVariability.toFixed(1)} kg
              </p>
            )}
          </CardContent>
        </Card>

        {/* Weekly Trend Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Weight Trend
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weeklyTrend
                ? `${weeklyTrend > 0 ? '+' : ''}${weeklyTrend.toFixed(1)} kg`
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              per week
            </p>
            <p className="mt-2 text-xs">
              Goal: {weekly_weight_goal_kg > 0 ? '+' : ''}{weekly_weight_goal_kg} kg/week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weight Range Info */}
      {averageMorningWeight && averageEveningWeight && Math.abs(averageEveningWeight - averageMorningWeight) > 0.5 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Daily Weight Fluctuation</AlertTitle>
          <AlertDescription>
            Your weight typically varies by {Math.abs(averageEveningWeight - averageMorningWeight).toFixed(1)} kg between morning and evening.
            This is normal and mainly due to food, water, and daily activities. Morning weights are generally more consistent for tracking progress.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

const WeightPage = () => {
  const { session } = useAuth();
  const [activeGoal, setActiveGoal] = useState<NutritionGoalRecord | null>(null);
  const [isLoadingGoal, setIsLoadingGoal] = useState(true);
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);

  const calculateProgress = async (goal: NutritionGoalRecord) => {
    if (!session?.user?.id) return null;

    try {
      // Get last 30 days of weight logs
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: weightLogs } = await supabase
        .from('weight_logs')
        .select('weight_kg, height_m, measurement_type, log_date')
        .eq('user_id', session.user.id)
        .gte('log_date', thirtyDaysAgo.toISOString())
        .order('log_date', { ascending: false });

      if (!weightLogs?.length) return null;

      const latestLog = weightLogs[0];
      const currentWeight = latestLog.weight_kg;
      
      // Calculate morning and evening averages
      const morningLogs = weightLogs.filter(log => log.measurement_type === 'morning');
      const eveningLogs = weightLogs.filter(log => log.measurement_type === 'evening');
      
      const averageMorningWeight = morningLogs.length
        ? morningLogs.reduce((sum, log) => sum + log.weight_kg, 0) / morningLogs.length
        : null;
      
      const averageEveningWeight = eveningLogs.length
        ? eveningLogs.reduce((sum, log) => sum + log.weight_kg, 0) / eveningLogs.length
        : null;

      // Calculate weekly trend
      const weeklyTrend = calculateWeeklyTrend(weightLogs);

      // Calculate weight variability (standard deviation)
      const weightVariability = calculateWeightVariability(weightLogs);

      const { start_weight_kg, target_weight_kg } = goal;
      const totalDiff = Math.abs(target_weight_kg - start_weight_kg);
      const currentDiff = Math.abs(currentWeight - start_weight_kg);
      const progressPercentage = (currentDiff / totalDiff) * 100;
      const remainingKg = Math.abs(target_weight_kg - currentWeight);
      const bmi = calculateBMI(currentWeight, latestLog.height_m);

      return {
        currentWeight,
        totalProgress: currentDiff,
        progressPercentage: Math.min(Math.max(progressPercentage, 0), 100),
        remainingKg,
        bmi,
        bmiCategory: bmi ? getBMICategory(bmi) : '',
        bmiColor: bmi ? getBMIColor(bmi) : '',
        measurementType: latestLog.measurement_type,
        averageMorningWeight,
        averageEveningWeight,
        weightVariability,
        weeklyTrend
      };
    } catch (err) {
      console.error('Error calculating progress:', err);
      return null;
    }
  };

  // Helper function to calculate weekly trend
  const calculateWeeklyTrend = (logs: WeightData[]): number | null => {
    if (logs.length < 2) return null;

    const dates = logs.map(log => new Date(log.log_date).getTime());
    const weights = logs.map(log => log.weight_kg);
    
    // Simple linear regression
    const n = dates.length;
    const sumX = dates.reduce((a, b) => a + b, 0);
    const sumY = weights.reduce((a, b) => a + b, 0);
    const sumXY = dates.map((x, i) => x * weights[i]).reduce((a, b) => a + b, 0);
    const sumXX = dates.map(x => x * x).reduce((a, b) => a + b, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    // Convert slope from kg/millisecond to kg/week
    return slope * (7 * 24 * 60 * 60 * 1000);
  };

  // Helper function to calculate weight variability
  const calculateWeightVariability = (logs: WeightData[]): number | null => {
    if (logs.length < 2) return null;

    const weights = logs.map(log => log.weight_kg);
    const mean = weights.reduce((a, b) => a + b, 0) / weights.length;
    const squaredDiffs = weights.map(w => Math.pow(w - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / weights.length;
    
    return Math.sqrt(variance);
  };

  const fetchActiveGoal = useCallback(async () => {
    if (!session?.user?.id) {
      setIsLoadingGoal(false);
      return;
    }
    
    setIsLoadingGoal(true);
    try {
      const { data, error } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      setActiveGoal(data);

      if (data) {
        const stats = await calculateProgress(data);
        setProgressStats(stats);
      }
    } catch (err) {
      console.error('Error fetching active nutrition goal:', err);
    } finally {
      setIsLoadingGoal(false);
    }
  }, [session]);

  useEffect(() => {
    fetchActiveGoal();
  }, [fetchActiveGoal]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Weight Management</h1>
        <Link to="/app/nutrition">
          <Button variant="outline">Manage Goals</Button>
        </Link>
      </div>
      
      {/* Goal Summary and Stats */}
      {isLoadingGoal ? (
        <p className="text-muted-foreground">Loading goal...</p>
      ) : (
        <GoalSummary goal={activeGoal} stats={progressStats} />
      )}

      {/* Progress Chart */}
      {!isLoadingGoal && <WeightProgressChart />}

      {/* Weight Log Component */}
      <WeightTracker />
    </div>
  );
};

export default WeightPage;