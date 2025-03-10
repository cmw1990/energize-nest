import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  BarChart2, 
  Utensils, 
  ShoppingCart, 
  Droplet,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { supabase } from '../../../integrations/supabase/client';

interface DashboardProps {
  session: Session | null;
}

interface NutritionSummary {
  caloriesConsumed: number;
  caloriesGoal: number;
  proteinConsumed: number;
  proteinGoal: number;
  carbsConsumed: number;
  carbsGoal: number;
  fatConsumed: number;
  fatGoal: number;
  waterConsumed: number;
  waterGoal: number;
}

interface MealPlan {
  id: string;
  name: string;
  date: string;
  meals: Array<{
    type: string;
    name: string;
    calories: number;
  }>;
}

export const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  const navigate = useNavigate();
  const [nutritionSummary, setNutritionSummary] = useState<NutritionSummary>({
    caloriesConsumed: 1450,
    caloriesGoal: 2000,
    proteinConsumed: 75,
    proteinGoal: 120,
    carbsConsumed: 140,
    carbsGoal: 200,
    fatConsumed: 35,
    fatGoal: 60,
    waterConsumed: 1.5,
    waterGoal: 2.5
  });
  
  const [todaysMeals, setTodaysMeals] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching data from Supabase
    const fetchDashboardData = async () => {
      if (!session) {
        navigate('/auth?redirect=/easier-manage/app');
        return;
      }
      
      try {
        setIsLoading(true);
        
        // In a real app, we would fetch from Supabase like this:
        // const { data: nutritionData, error: nutritionError } = await supabase
        //   .from('nutrition_summary')
        //   .select('*')
        //   .eq('user_id', session.user.id)
        //   .eq('date', new Date().toISOString().split('T')[0])
        //   .single();
        
        // For demo purposes, using mock data
        setTimeout(() => {
          setNutritionSummary({
            caloriesConsumed: 1450,
            caloriesGoal: 2000,
            proteinConsumed: 75,
            proteinGoal: 120,
            carbsConsumed: 140,
            carbsGoal: 200,
            fatConsumed: 35,
            fatGoal: 60,
            waterConsumed: 1.5,
            waterGoal: 2.5
          });
          
          setTodaysMeals({
            id: '1',
            name: 'Monday Plan',
            date: new Date().toISOString().split('T')[0],
            meals: [
              { type: 'Breakfast', name: 'Greek Yogurt with Berries', calories: 320 },
              { type: 'Lunch', name: 'Chicken Salad with Avocado', calories: 480 },
              { type: 'Dinner', name: 'Salmon with Roasted Vegetables', calories: 550 },
              { type: 'Snack', name: 'Apple with Almond Butter', calories: 200 }
            ]
          });
          
          setIsLoading(false);
        }, 600);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [session, navigate]);
  
  const calculatePercentage = (consumed: number, goal: number) => {
    return Math.min(Math.round((consumed / goal) * 100), 100);
  };
  
  // Quick action cards
  const quickActions = [
    {
      icon: <Calendar className="h-8 w-8 text-indigo-500" />,
      title: 'Meal Planner',
      description: 'Plan meals for the week',
      path: '/easier-manage/app/meal-planner'
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-green-500" />,
      title: 'Nutrition Tracker',
      description: 'Log today\'s food intake',
      path: '/easier-manage/app/nutrition-tracker'
    },
    {
      icon: <Utensils className="h-8 w-8 text-amber-500" />,
      title: 'Recipes',
      description: 'Discover healthy recipes',
      path: '/easier-manage/app/recipes'
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-red-500" />,
      title: 'Grocery List',
      description: 'View your shopping list',
      path: '/easier-manage/app/grocery-list'
    }
  ];
  
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Nutrition Dashboard</h1>
        {!isLoading && (
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-lg text-muted-foreground">Loading your nutrition data...</p>
        </div>
      ) : (
        <>
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    {action.icon}
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between"
                    onClick={() => navigate(action.path)}
                  >
                    Go to {action.title}
                    <ChevronRight size={16} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Nutrition Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Macros */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5" />
                  Daily Nutrition
                </CardTitle>
                <CardDescription>
                  Your macro and calorie consumption for today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Calories */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">
                      Calories
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {nutritionSummary.caloriesConsumed} / {nutritionSummary.caloriesGoal} kcal
                    </div>
                  </div>
                  <Progress value={calculatePercentage(nutritionSummary.caloriesConsumed, nutritionSummary.caloriesGoal)} />
                </div>
                
                {/* Protein */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">
                      Protein
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {nutritionSummary.proteinConsumed} / {nutritionSummary.proteinGoal} g
                    </div>
                  </div>
                  <Progress 
                    value={calculatePercentage(nutritionSummary.proteinConsumed, nutritionSummary.proteinGoal)} 
                    className="bg-gray-200" 
                  />
                </div>
                
                {/* Carbs */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">
                      Carbohydrates
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {nutritionSummary.carbsConsumed} / {nutritionSummary.carbsGoal} g
                    </div>
                  </div>
                  <Progress 
                    value={calculatePercentage(nutritionSummary.carbsConsumed, nutritionSummary.carbsGoal)} 
                    className="bg-gray-200" 
                  />
                </div>
                
                {/* Fat */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">
                      Fat
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {nutritionSummary.fatConsumed} / {nutritionSummary.fatGoal} g
                    </div>
                  </div>
                  <Progress 
                    value={calculatePercentage(nutritionSummary.fatConsumed, nutritionSummary.fatGoal)} 
                    className="bg-gray-200" 
                  />
                </div>
                
                {/* Water */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">
                      Water
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {nutritionSummary.waterConsumed} / {nutritionSummary.waterGoal} L
                    </div>
                  </div>
                  <Progress 
                    value={calculatePercentage(nutritionSummary.waterConsumed, nutritionSummary.waterGoal)} 
                    className="bg-blue-100" 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/easier-manage/app/nutrition-tracker')}
                >
                  Log Food & Water Intake
                </Button>
              </CardFooter>
            </Card>
            
            {/* Today's Meal Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Meals
                </CardTitle>
                <CardDescription>
                  Your planned meals for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                {todaysMeals ? (
                  <div className="space-y-4">
                    {todaysMeals.meals.map((meal, index) => (
                      <div 
                        key={index} 
                        className="flex justify-between items-center p-3 rounded-md bg-gray-50"
                      >
                        <div>
                          <div className="font-medium">{meal.type}</div>
                          <div className="text-sm text-muted-foreground">{meal.name}</div>
                        </div>
                        <div className="text-sm">{meal.calories} kcal</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 space-y-3">
                    <AlertCircle className="h-10 w-10 text-muted-foreground" />
                    <p className="text-muted-foreground text-center">No meals planned for today</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/easier-manage/app/meal-planner')}
                >
                  Plan Meals
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Tips & Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tips & Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md bg-blue-50 border-blue-200">
                  <h3 className="font-medium">Protein Intake</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You're currently at {calculatePercentage(nutritionSummary.proteinConsumed, nutritionSummary.proteinGoal)}% of your protein goal. 
                    Consider adding a protein-rich snack to meet your daily needs.
                  </p>
                </div>
                <div className="p-4 border rounded-md bg-amber-50 border-amber-200">
                  <h3 className="font-medium">Hydration Reminder</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You still need to drink {(nutritionSummary.waterGoal - nutritionSummary.waterConsumed).toFixed(1)}L 
                    of water to reach your daily goal. Staying hydrated improves energy levels and digestion.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}; 