
import React from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { NutritionDashboard } from '@/components/nutrition/NutritionDashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Utensils, Apple, Calendar, Leaf, Award } from 'lucide-react';

const Nutrition = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 pt-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Utensils className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Nutrition & Diet</h1>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            Track your nutrition, analyze macronutrients, and get personalized recommendations for optimal health and energy.
          </p>
        </div>
        
        <NutritionDashboard />
        
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Apple className="h-5 w-5 text-green-600" />
                Meal Planning
              </CardTitle>
              <CardDescription>
                Create balanced meal plans based on your goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-3">
                  <div className="font-medium">Breakfast</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Greek yogurt with berries and granola
                  </div>
                  <div className="text-xs mt-1">
                    <span className="text-blue-600">450 kcal</span> • 
                    <span className="text-red-600 ml-1">25g protein</span> • 
                    <span className="text-amber-600 ml-1">55g carbs</span> • 
                    <span className="text-green-600 ml-1">15g fat</span>
                  </div>
                </div>
                
                <div className="rounded-lg border p-3">
                  <div className="font-medium">Lunch</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Grilled chicken salad with avocado
                  </div>
                  <div className="text-xs mt-1">
                    <span className="text-blue-600">520 kcal</span> • 
                    <span className="text-red-600 ml-1">40g protein</span> • 
                    <span className="text-amber-600 ml-1">20g carbs</span> • 
                    <span className="text-green-600 ml-1">30g fat</span>
                  </div>
                </div>
                
                <div className="rounded-lg border p-3">
                  <div className="font-medium">Dinner</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Salmon with quinoa and roasted vegetables
                  </div>
                  <div className="text-xs mt-1">
                    <span className="text-blue-600">580 kcal</span> • 
                    <span className="text-red-600 ml-1">35g protein</span> • 
                    <span className="text-amber-600 ml-1">50g carbs</span> • 
                    <span className="text-green-600 ml-1">25g fat</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Nutrition Goals
              </CardTitle>
              <CardDescription>
                Your personalized nutrition targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex justify-between">
                    <div className="font-medium">Increase protein intake</div>
                    <div className="text-xs bg-primary/20 rounded-full px-2 py-0.5">
                      In progress
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Target: 150g daily (currently avg 120g)
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-muted border">
                  <div className="flex justify-between">
                    <div className="font-medium">Reduce refined sugar</div>
                    <div className="text-xs bg-muted-foreground/20 rounded-full px-2 py-0.5">
                      Upcoming
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Target: Under 25g daily (currently avg 40g)
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-muted border">
                  <div className="flex justify-between">
                    <div className="font-medium">Increase fiber intake</div>
                    <div className="text-xs bg-muted-foreground/20 rounded-full px-2 py-0.5">
                      Upcoming
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Target: 30g daily (currently avg 18g)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Award className="h-5 w-5 text-amber-500" />
                Nutrition Achievements
              </CardTitle>
              <CardDescription>
                Your health milestones and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-amber-100">
                      <Award className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="font-medium">Protein Champion</div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Met your protein goal for 7 days straight
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-blue-100">
                      <Leaf className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="font-medium">Veggie Variety</div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Logged 15 different vegetables in one week
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-green-100">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="font-medium">Consistency King</div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Logged your nutrition for 30 consecutive days
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 bg-muted/30 p-6 rounded-lg border">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Leaf className="h-5 w-5 text-primary" />
            Nutritional Science
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Protein Timing</h3>
              <p className="text-sm text-muted-foreground">
                Distributing protein intake throughout the day (20-30g per meal) optimizes muscle protein synthesis and metabolic health, particularly important for energy regulation.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Carb Cycling</h3>
              <p className="text-sm text-muted-foreground">
                Strategically varying carbohydrate intake based on activity levels can improve metabolic flexibility, helping your body efficiently switch between using carbs and fats for energy.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Chrono-Nutrition</h3>
              <p className="text-sm text-muted-foreground">
                Aligning meal timing with your circadian rhythm can enhance nutrient metabolism and energy levels. Earlier eating windows may benefit metabolic health and weight management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
