import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Goal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionAnalyticsProps {
  nutritionData?: NutritionData;
  dailyGoal?: Goal;
}

const NutritionAnalytics: React.FC<NutritionAnalyticsProps> = ({ nutritionData, dailyGoal }) => {
  if (!nutritionData || !dailyGoal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Analytics</CardTitle>
        </CardHeader>
        <CardContent>No data available.</CardContent>
      </Card>
    );
  }

  const calculatePercentage = (value: number, goal: number) => {
    return goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  };

  const macroNutrients = [
    { name: 'Protein', value: nutritionData.protein, goal: dailyGoal.protein, color: '#E91E63' },
    { name: 'Carbs', value: nutritionData.carbs, goal: dailyGoal.carbs, color: '#9C27B0' },
    { name: 'Fat', value: nutritionData.fat, goal: dailyGoal.fat, color: '#3F51B5' },
  ];

  const chartData = macroNutrients.map(nutrient => ({
    name: nutrient.name,
    value: nutrient.value,
    goal: nutrient.goal,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {macroNutrients.map((nutrient) => (
            <Card key={nutrient.name} className="p-4">
              <div className="text-sm font-medium">{typeof nutrient.name === 'string' ? nutrient.name.charAt(0).toUpperCase() + nutrient.name.slice(1) : nutrient.name}</div>
              <div className="text-xs text-muted-foreground">
                {nutrient.value} / {nutrient.goal}g
              </div>
              <Progress
                value={calculatePercentage(nutrient.value, nutrient.goal)}
                className="h-3"
              />
            </Card>
          ))}
        </div>

        <Card className="p-4">
          <div className="text-sm font-medium">Daily Calorie Intake</div>
          <div className="text-xs text-muted-foreground">
            {nutritionData.calories} / {dailyGoal.calories} kcal
          </div>
          <Progress
            value={calculatePercentage(nutritionData.calories, dailyGoal.calories)}
            className="h-3"
          />
        </Card>

        <Card className="p-4">
          <div className="text-sm font-medium">Macronutrient Breakdown</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Consumed" />
              <Bar dataKey="goal" fill="#82ca9d" name="Goal" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </CardContent>
    </Card>
  );
};

export { NutritionAnalytics };
