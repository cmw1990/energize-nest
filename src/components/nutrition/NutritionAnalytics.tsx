
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  BarChart2, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Scale, 
  TrendingUp, 
  Utensils, 
  AlertCircle,
  CheckCircle2,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DailyNutrition {
  id: string;
  user_id: string;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  meals_count: number;
  goal_calories: number;
  goal_protein: number;
  goal_carbs: number;
  goal_fat: number;
  consistency_score: number;
}

export const NutritionAnalytics = () => {
  const { session } = useAuth();
  const [nutritionData, setNutritionData] = useState<DailyNutrition[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState('7');
  const [dateOffset, setDateOffset] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    calculateDateRange();
  }, [selectedDateRange, dateOffset]);
  
  useEffect(() => {
    if (session?.user?.id && startDate && endDate) {
      fetchNutritionData();
    }
  }, [session, startDate, endDate]);
  
  const calculateDateRange = () => {
    const today = new Date();
    const end = new Date(today);
    end.setDate(today.getDate() - dateOffset);
    
    const start = new Date(end);
    start.setDate(end.getDate() - parseInt(selectedDateRange) + 1);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };
  
  const fetchNutritionData = async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('daily_nutrition_summaries')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      // Fill in missing dates
      const filledData = fillMissingDates(data || [], startDate, endDate);
      setNutritionData(filledData);
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fillMissingDates = (data: DailyNutrition[], start: string, end: string) => {
    const dateMap: {[key: string]: DailyNutrition} = {};
    data.forEach(item => {
      dateMap[item.date] = item;
    });
    
    const filled: DailyNutrition[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      
      if (dateMap[dateStr]) {
        filled.push(dateMap[dateStr]);
      } else {
        // Create a placeholder entry
        filled.push({
          id: `placeholder-${dateStr}`,
          user_id: session?.user?.id || '',
          date: dateStr,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          water: 0,
          meals_count: 0,
          goal_calories: 2000, // default
          goal_protein: 120, // default
          goal_carbs: 200, // default
          goal_fat: 65, // default
          consistency_score: 0
        });
      }
    }
    
    return filled;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const navigateDates = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setDateOffset(dateOffset + parseInt(selectedDateRange));
    } else {
      setDateOffset(Math.max(0, dateOffset - parseInt(selectedDateRange)));
    }
  };
  
  const calculateAverages = () => {
    if (!nutritionData.length) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0, consistency: 0 };
    }
    
    const activeData = nutritionData.filter(d => d.calories > 0);
    
    if (!activeData.length) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0, consistency: 0 };
    }
    
    const sum = activeData.reduce((acc, day) => {
      return {
        calories: acc.calories + day.calories,
        protein: acc.protein + day.protein,
        carbs: acc.carbs + day.carbs,
        fat: acc.fat + day.fat,
        water: acc.water + day.water,
        consistency: acc.consistency + day.consistency_score
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0, consistency: 0 });
    
    return {
      calories: Math.round(sum.calories / activeData.length),
      protein: Math.round(sum.protein / activeData.length),
      carbs: Math.round(sum.carbs / activeData.length),
      fat: Math.round(sum.fat / activeData.length),
      water: Math.round(sum.water / activeData.length),
      consistency: Math.round(sum.consistency / activeData.length)
    };
  };
  
  const calculateAverageGoals = () => {
    if (!nutritionData.length) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    
    const activeData = nutritionData.filter(d => d.calories > 0);
    
    if (!activeData.length) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    
    const sum = activeData.reduce((acc, day) => {
      return {
        calories: acc.calories + day.goal_calories,
        protein: acc.protein + day.goal_protein,
        carbs: acc.carbs + day.goal_carbs,
        fat: acc.fat + day.goal_fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    return {
      calories: Math.round(sum.calories / activeData.length),
      protein: Math.round(sum.protein / activeData.length),
      carbs: Math.round(sum.carbs / activeData.length),
      fat: Math.round(sum.fat / activeData.length)
    };
  };
  
  const calculateGoalPercentages = () => {
    const averages = calculateAverages();
    const goals = calculateAverageGoals();
    
    if (!goals.calories) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    return {
      calories: Math.round((averages.calories / goals.calories) * 100),
      protein: Math.round((averages.protein / goals.protein) * 100),
      carbs: Math.round((averages.carbs / goals.carbs) * 100),
      fat: Math.round((averages.fat / goals.fat) * 100)
    };
  };
  
  const getTrendIndication = (current: number, previous: number) => {
    if (current > previous * 1.05) return 'up';
    if (current < previous * 0.95) return 'down';
    return 'stable';
  };
  
  const getMacroTrends = () => {
    if (nutritionData.length < 4) return { protein: 'stable', carbs: 'stable', fat: 'stable' };
    
    const recentDays = nutritionData.slice(-3).filter(d => d.calories > 0);
    const previousDays = nutritionData.slice(-6, -3).filter(d => d.calories > 0);
    
    if (recentDays.length === 0 || previousDays.length === 0) {
      return { protein: 'stable', carbs: 'stable', fat: 'stable' };
    }
    
    const recentAvg = {
      protein: recentDays.reduce((sum, day) => sum + day.protein, 0) / recentDays.length,
      carbs: recentDays.reduce((sum, day) => sum + day.carbs, 0) / recentDays.length,
      fat: recentDays.reduce((sum, day) => sum + day.fat, 0) / recentDays.length
    };
    
    const previousAvg = {
      protein: previousDays.reduce((sum, day) => sum + day.protein, 0) / previousDays.length,
      carbs: previousDays.reduce((sum, day) => sum + day.carbs, 0) / previousDays.length,
      fat: previousDays.reduce((sum, day) => sum + day.fat, 0) / previousDays.length
    };
    
    return {
      protein: getTrendIndication(recentAvg.protein, previousAvg.protein),
      carbs: getTrendIndication(recentAvg.carbs, previousAvg.carbs),
      fat: getTrendIndication(recentAvg.fat, previousAvg.fat)
    };
  };
  
  const getRenderChartTitle = () => {
    switch (chartType) {
      case 'bar':
        return 'Daily Macro Breakdown';
      case 'pie':
        return 'Average Macro Distribution';
      case 'line':
      default:
        return 'Daily Nutrient Trends';
    }
  };
  
  const getAverageMacroDistribution = () => {
    const averages = calculateAverages();
    
    const totalMacroCalories = 
      averages.protein * 4 + 
      averages.carbs * 4 + 
      averages.fat * 9;
    
    if (totalMacroCalories === 0) return [];
    
    return [
      {
        name: 'Protein',
        value: Math.round((averages.protein * 4 / totalMacroCalories) * 100),
        color: '#3b82f6' // blue-500
      },
      {
        name: 'Carbs',
        value: Math.round((averages.carbs * 4 / totalMacroCalories) * 100),
        color: '#22c55e' // green-500
      },
      {
        name: 'Fat',
        value: Math.round((averages.fat * 9 / totalMacroCalories) * 100),
        color: '#ef4444' // red-500
      }
    ];
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between">
            <CardTitle>Nutrition Analytics</CardTitle>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigateDates('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigateDates('next')}
                disabled={dateOffset === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Select
                value={selectedDateRange}
                onValueChange={setSelectedDateRange}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Week</SelectItem>
                  <SelectItem value="14">2 Weeks</SelectItem>
                  <SelectItem value="30">Month</SelectItem>
                  <SelectItem value="90">3 Months</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md overflow-hidden">
                <Button 
                  variant={chartType === 'line' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setChartType('line')}
                  className="rounded-none h-8 w-8"
                >
                  <LineChartIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant={chartType === 'bar' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setChartType('bar')}
                  className="rounded-none h-8 w-8"
                >
                  <BarChart2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={chartType === 'pie' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setChartType('pie')}
                  className="rounded-none h-8 w-8"
                >
                  <PieChartIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground text-center mb-4">
            {startDate && endDate && (
              <div className="flex items-center justify-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>
                  {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          
          <div className="h-[300px] w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : nutritionData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <BarChart2 className="h-10 w-10 mb-2" />
                <p>No nutrition data available for this period</p>
              </div>
            ) : chartType === 'line' ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={nutritionData}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    minTickGap={30}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
                    formatter={(value, name) => {
                      if (name === 'calories') return [`${value} kcal`, 'Calories'];
                      return [`${value}g`, name.charAt(0).toUpperCase() + name.slice(1)];
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Calories"
                    unit=" kcal"
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="protein" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Protein"
                    unit="g"
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="carbs" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    name="Carbs"
                    unit="g"
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fat" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Fat"
                    unit="g"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : chartType === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutritionData}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    minTickGap={30}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
                    formatter={(value, name) => [`${value}g`, name.charAt(0).toUpperCase() + name.slice(1)]}
                  />
                  <Legend />
                  <Bar dataKey="protein" name="Protein" fill="#3b82f6" unit="g" />
                  <Bar dataKey="carbs" name="Carbs" fill="#22c55e" unit="g" />
                  <Bar dataKey="fat" name="Fat" fill="#ef4444" unit="g" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getAverageMacroDistribution()}
                    nameKey="name"
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {getAverageMacroDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div className="text-center mt-2 text-sm font-medium">
            {getRenderChartTitle()}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Average Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Calories</span>
                  <span className="font-medium">{calculateAverages().calories} kcal</span>
                </div>
                <Progress value={calculateGoalPercentages().calories} max={150} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>Goal: {calculateAverageGoals().calories} kcal</span>
                  <span>150%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Protein</span>
                  <div className="flex items-center">
                    {getMacroTrends().protein === 'up' && <TrendingUp className="h-3 w-3 text-green-500 mr-1" />}
                    {getMacroTrends().protein === 'down' && <TrendingUp className="h-3 w-3 text-red-500 mr-1 transform rotate-180" />}
                    <span className="font-medium">{calculateAverages().protein}g</span>
                  </div>
                </div>
                <Progress value={calculateGoalPercentages().protein} max={150} className="h-2 bg-muted/70" indicatorClassName="bg-blue-400" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Carbs</span>
                  <div className="flex items-center">
                    {getMacroTrends().carbs === 'up' && <TrendingUp className="h-3 w-3 text-green-500 mr-1" />}
                    {getMacroTrends().carbs === 'down' && <TrendingUp className="h-3 w-3 text-red-500 mr-1 transform rotate-180" />}
                    <span className="font-medium">{calculateAverages().carbs}g</span>
                  </div>
                </div>
                <Progress value={calculateGoalPercentages().carbs} max={150} className="h-2 bg-muted/70" indicatorClassName="bg-green-400" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fat</span>
                  <div className="flex items-center">
                    {getMacroTrends().fat === 'up' && <TrendingUp className="h-3 w-3 text-green-500 mr-1" />}
                    {getMacroTrends().fat === 'down' && <TrendingUp className="h-3 w-3 text-red-500 mr-1 transform rotate-180" />}
                    <span className="font-medium">{calculateAverages().fat}g</span>
                  </div>
                </div>
                <Progress value={calculateGoalPercentages().fat} max={150} className="h-2 bg-muted/70" indicatorClassName="bg-red-400" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Water</span>
                  <span className="font-medium">{calculateAverages().water} ml</span>
                </div>
                <Progress value={calculateAverages().water / 30} max={100} className="h-2 bg-muted/70" indicatorClassName="bg-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Health Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {calculateGoalPercentages().calories > 110 && (
                <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Calorie Excess</h4>
                      <p className="text-sm text-muted-foreground">
                        You're exceeding your calorie goal by {calculateGoalPercentages().calories - 100}%.
                        Consider increasing activity or adjusting portions.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {calculateGoalPercentages().calories < 80 && nutritionData.some(d => d.calories > 0) && (
                <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Calorie Deficit</h4>
                      <p className="text-sm text-muted-foreground">
                        You're {100 - calculateGoalPercentages().calories}% below your calorie goal.
                        Ensure you're getting adequate nutrition for energy.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {calculateGoalPercentages().protein < 80 && nutritionData.some(d => d.calories > 0) && (
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Low Protein Intake</h4>
                      <p className="text-sm text-muted-foreground">
                        You're only getting {calculateGoalPercentages().protein}% of your protein goal.
                        Consider adding more protein-rich foods.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {calculateAverages().water < 2000 && nutritionData.some(d => d.calories > 0) && (
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Hydration Alert</h4>
                      <p className="text-sm text-muted-foreground">
                        Average water intake is {calculateAverages().water}ml, below recommended 2000ml.
                        Aim to drink more water throughout the day.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {calculateGoalPercentages().protein >= 90 && 
                calculateGoalPercentages().protein <= 110 && 
                calculateGoalPercentages().calories >= 90 && 
                calculateGoalPercentages().calories <= 110 && (
                <div className="p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Balanced Intake</h4>
                      <p className="text-sm text-muted-foreground">
                        Great job maintaining balanced calories and protein!
                        This helps support your nutrition goals.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {nutritionData.every(d => d.calories === 0) && (
                <div className="p-3 border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-900/20 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">No Data Available</h4>
                      <p className="text-sm text-muted-foreground">
                        No nutrition data has been logged for this period.
                        Start logging your meals to see insights.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Consistency Score</h3>
                <div className="relative pt-2">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                    <div 
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        calculateAverages().consistency >= 80 ? 'bg-green-500' :
                        calculateAverages().consistency >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${calculateAverages().consistency}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span>{calculateAverages().consistency}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Recent Logging
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nutritionData
                .filter(day => day.calories > 0)
                .slice(-5)
                .reverse()
                .map(day => (
                  <div key={day.date} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">{formatDate(day.date)}</div>
                      <Badge variant="outline" className={
                        day.calories > day.goal_calories * 1.1 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        day.calories < day.goal_calories * 0.9 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }>
                        {Math.round((day.calories / day.goal_calories) * 100)}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs text-center">
                      <div>
                        <div className="font-medium">{day.calories}</div>
                        <div className="text-muted-foreground">cals</div>
                      </div>
                      <div>
                        <div className="font-medium">{day.protein}g</div>
                        <div className="text-muted-foreground">protein</div>
                      </div>
                      <div>
                        <div className="font-medium">{day.carbs}g</div>
                        <div className="text-muted-foreground">carbs</div>
                      </div>
                      <div>
                        <div className="font-medium">{day.fat}g</div>
                        <div className="text-muted-foreground">fat</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <span>{day.meals_count} meals logged</span>
                      {day.water > 0 && <span> • {day.water}ml water</span>}
                    </div>
                  </div>
                ))}
              
              {nutritionData.filter(day => day.calories > 0).length === 0 && (
                <div className="text-center py-8">
                  <Utensils className="h-12 w-12 mx-auto mb-2 text-muted-foreground/40" />
                  <p className="text-muted-foreground">No nutrition data logged yet</p>
                  <Button variant="outline" className="mt-4">Start Logging</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
