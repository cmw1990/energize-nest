import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { NutritionTracker } from "./NutritionTracker";
import { NutritionGoalRecord, NutritionSummary, WeightTrend } from '@/types/nutrition';
import { TrendingUp, TrendingDown, Minus, AlertCircle, Pizza, Apple, Carrot, Coffee, Egg } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NutritionDashboardProps {
  goal: NutritionGoalRecord | null;
  summary: NutritionSummary | null;
  weightTrends: WeightTrend[];
  isLoading: boolean;
}

const getNutrientStatus = (current: number, goal: number) => {
  const percentage = (current / goal) * 100;
  if (percentage < 80) return 'under';
  if (percentage > 120) return 'over';
  return 'good';
};

const getNutrientTip = (nutrient: string, status: string) => {
  if (status === 'under') {
    switch (nutrient) {
      case 'calories':
        return 'Consider adding healthy snacks to reach your calorie goal';
      case 'protein':
        return 'Try incorporating more lean meats, fish, or legumes';
      case 'carbs':
        return 'Add whole grains and fruits to increase carb intake';
      case 'fat':
        return 'Include healthy fats like avocados, nuts, or olive oil';
      default:
        return 'Try to increase your intake to reach your goal';
    }
  }
  if (status === 'over') {
    switch (nutrient) {
      case 'calories':
        return 'Consider reducing portion sizes or choosing lower-calorie options';
      case 'protein':
        return 'Monitor protein portions, but no need to worry if active';
      case 'carbs':
        return 'Try to focus more on protein and vegetables';
      case 'fat':
        return 'Consider leaner protein sources and reduce added oils';
      default:
        return 'Try to moderate your intake to stay within goals';
    }
  }
  return 'Great job staying within your target range!';
};

export const NutritionDashboard: React.FC<NutritionDashboardProps> = ({
  goal,
  summary,
  weightTrends,
  isLoading
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Use the provided goal values or defaults
  const calorieGoal = goal?.calories_goal || 2000;
  const proteinGoal = goal?.protein_goal_g || 150;
  const carbsGoal = goal?.carbs_goal_g || 200;
  const fatGoal = goal?.fat_goal_g || 65;
  const fiberGoal = goal?.fiber_goal_g || 25;

  // Calculate current values
  const currentCalories = summary?.total_calories || 0;
  const currentProtein = summary?.total_protein || 0;
  const currentCarbs = summary?.total_carbs || 0;
  const currentFat = summary?.total_fat || 0;
  const currentFiber = summary?.total_fiber || 0;

  // Calculate remaining values
  const caloriesRemaining = calorieGoal - currentCalories;
  const proteinRemaining = proteinGoal - currentProtein;
  const carbsRemaining = carbsGoal - currentCarbs;
  const fatRemaining = fatGoal - currentFat;
  const fiberRemaining = fiberGoal - currentFiber;

  // Calculate percentages
  const caloriePercentage = Math.min(100, (currentCalories / calorieGoal) * 100);
  const proteinPercentage = Math.min(100, (currentProtein / proteinGoal) * 100);
  const carbsPercentage = Math.min(100, (currentCarbs / carbsGoal) * 100);
  const fatPercentage = Math.min(100, (currentFat / fatGoal) * 100);
  const fiberPercentage = Math.min(100, (currentFiber / fiberGoal) * 100);

  // Get status indicators
  const calorieStatus = getNutrientStatus(currentCalories, calorieGoal);
  const proteinStatus = getNutrientStatus(currentProtein, proteinGoal);
  const carbsStatus = getNutrientStatus(currentCarbs, carbsGoal);
  const fatStatus = getNutrientStatus(currentFat, fatGoal);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'under':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'over':
        return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      default:
        return <Minus className="h-4 w-4 text-green-500" />;
    }
  };

  const getProgressClasses = (status: string) => {
    const baseClasses = "h-2";
    switch (status) {
      case 'under':
        return cn(baseClasses, "[&>div]:bg-red-500");
      case 'over':
        return cn(baseClasses, "[&>div]:bg-yellow-500");
      default:
        return cn(baseClasses, "[&>div]:bg-green-500");
    }
  };

  const getNutrientIcon = (nutrient: string) => {
    switch (nutrient) {
      case 'protein':
        return <Egg className="h-4 w-4" />;
      case 'carbs':
        return <Pizza className="h-4 w-4" />;
      case 'fat':
        return <Apple className="h-4 w-4" />;
      case 'fiber':
        return <Carrot className="h-4 w-4" />;
      default:
        return <Coffee className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Nutrition Overview</CardTitle>
          <CardDescription>Track your daily nutrient intake and goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <TooltipProvider>
              <motion.div variants={itemVariants}>
                <Card className="relative overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Coffee className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm font-medium text-muted-foreground">Calories</div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          {getStatusIcon(calorieStatus)}
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-semibold">
                              {calorieStatus === 'under' ? 'Below target range' :
                               calorieStatus === 'over' ? 'Above target range' :
                               'Within target range'}
                            </p>
                            <p className="text-sm max-w-[200px]">
                              {getNutrientTip('calories', calorieStatus)}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      {currentCalories} / {calorieGoal}
                    </div>
                    <Progress 
                      value={caloriePercentage} 
                      className={getProgressClasses(calorieStatus)} 
                    />
                    <div className="mt-2 text-xs text-right text-muted-foreground">
                      {caloriesRemaining > 0 ? `${caloriesRemaining} kcal remaining` : 'Goal reached'}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="relative overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getNutrientIcon('protein')}
                        <div className="text-sm font-medium text-muted-foreground">Protein</div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          {getStatusIcon(proteinStatus)}
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-semibold">
                              {proteinStatus === 'under' ? 'Below target range' :
                               proteinStatus === 'over' ? 'Above target range' :
                               'Within target range'}
                            </p>
                            <p className="text-sm max-w-[200px]">
                              {getNutrientTip('protein', proteinStatus)}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      {currentProtein}g / {proteinGoal}g
                    </div>
                    <Progress 
                      value={proteinPercentage} 
                      className={getProgressClasses(proteinStatus)}
                    />
                    <div className="mt-2 text-xs text-right text-muted-foreground">
                      {proteinRemaining > 0 ? `${proteinRemaining}g remaining` : 'Goal reached'}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="relative overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getNutrientIcon('carbs')}
                        <div className="text-sm font-medium text-muted-foreground">Carbs</div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          {getStatusIcon(carbsStatus)}
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-semibold">
                              {carbsStatus === 'under' ? 'Below target range' :
                               carbsStatus === 'over' ? 'Above target range' :
                               'Within target range'}
                            </p>
                            <p className="text-sm max-w-[200px]">
                              {getNutrientTip('carbs', carbsStatus)}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      {currentCarbs}g / {carbsGoal}g
                    </div>
                    <Progress 
                      value={carbsPercentage} 
                      className={getProgressClasses(carbsStatus)}
                    />
                    <div className="mt-2 text-xs text-right text-muted-foreground">
                      {carbsRemaining > 0 ? `${carbsRemaining}g remaining` : 'Goal reached'}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="relative overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getNutrientIcon('fat')}
                        <div className="text-sm font-medium text-muted-foreground">Fat</div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          {getStatusIcon(fatStatus)}
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-semibold">
                              {fatStatus === 'under' ? 'Below target range' :
                               fatStatus === 'over' ? 'Above target range' :
                               'Within target range'}
                            </p>
                            <p className="text-sm max-w-[200px]">
                              {getNutrientTip('fat', fatStatus)}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      {currentFat}g / {fatGoal}g
                    </div>
                    <Progress 
                      value={fatPercentage} 
                      className={getProgressClasses(fatStatus)}
                    />
                    <div className="mt-2 text-xs text-right text-muted-foreground">
                      {fatRemaining > 0 ? `${fatRemaining}g remaining` : 'Goal reached'}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TooltipProvider>
          </div>

          {/* Additional Stats */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getNutrientIcon('fiber')}
                    <div className="text-sm font-medium text-muted-foreground">Fiber</div>
                  </div>
                  <div className="text-xl font-semibold">{currentFiber}g / {fiberGoal}g</div>
                  <Progress value={fiberPercentage} className="h-1 mt-2" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden">
                <CardContent className="pt-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Meals Today</div>
                  <div className="text-xl font-semibold">
                    {Object.values(summary?.meals || {}).flat().length || 0}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden">
                <CardContent className="pt-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Meals Logged</div>
                  <div className="text-xl font-semibold flex items-center gap-2">
                    <Badge variant="secondary">{summary?.meals?.breakfast?.length || 0} B</Badge>
                    <Badge variant="secondary">{summary?.meals?.lunch?.length || 0} L</Badge>
                    <Badge variant="secondary">{summary?.meals?.dinner?.length || 0} D</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden">
                <CardContent className="pt-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Snacks</div>
                  <div className="text-xl font-semibold">{summary?.meals?.snack?.length || 0}</div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>

      <motion.div variants={itemVariants}>
        <NutritionTracker />
      </motion.div>
    </motion.div>
  );
};
