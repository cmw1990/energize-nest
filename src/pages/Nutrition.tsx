
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NutritionTracker } from "@/components/nutrition/NutritionTracker";
import { MealPlanner } from "@/components/nutrition/MealPlanner";
import { NutritionGoals } from "@/components/nutrition/NutritionGoals";
import { NutritionAnalytics } from "@/components/nutrition/NutritionAnalytics";
import { RecipeCalculator } from "@/components/nutrition/RecipeCalculator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Apple, 
  Utensils, 
  BarChart, 
  Target, 
  FileSpreadsheet, 
  ListChecks,
  Coffee,
  Water 
} from "lucide-react";

const Nutrition = () => {
  const [activeTab, setActiveTab] = useState('tracker');
  
  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nutrition & Diet</h1>
        <div className="flex items-center gap-2">
          <Apple className="h-5 w-5 text-primary" />
          <span className="font-medium text-primary">Healthy Eating</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-white/80 dark:bg-white/10 rounded-full p-3">
                <Utensils className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-medium">Food Logging</h3>
              <p className="text-sm text-muted-foreground">
                Track your daily food intake and nutrients
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveTab('tracker')}
              >
                Log Meals
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-white/80 dark:bg-white/10 rounded-full p-3">
                <ListChecks className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-medium">Meal Planning</h3>
              <p className="text-sm text-muted-foreground">
                Create meal plans and shopping lists
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveTab('planner')}
              >
                Plan Meals
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-white/80 dark:bg-white/10 rounded-full p-3">
                <FileSpreadsheet className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="font-medium">Recipe Calculator</h3>
              <p className="text-sm text-muted-foreground">
                Calculate nutrition for your recipes
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveTab('recipes')}
              >
                Calculate Recipes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="tracker" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            <span>Food Tracker</span>
          </TabsTrigger>
          <TabsTrigger value="planner" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            <span>Meal Planner</span>
          </TabsTrigger>
          <TabsTrigger value="recipes" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Recipe Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Nutrition Goals</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tracker" className="space-y-4">
          <NutritionTracker />
        </TabsContent>
        
        <TabsContent value="planner" className="space-y-4">
          <MealPlanner />
        </TabsContent>
        
        <TabsContent value="recipes" className="space-y-4">
          <RecipeCalculator />
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-4">
          <NutritionGoals />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <NutritionAnalytics />
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Water className="h-5 w-5 text-blue-500" />
              Water Intake
            </CardTitle>
            <CardDescription>
              Track your daily hydration levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900/30"></div>
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-blue-500/80 rounded-b-full transition-all duration-1000"
                  style={{ height: '70%' }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold">70%</span>
                  <span className="text-sm text-muted-foreground">1.4L / 2L</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  + 200ml
                </Button>
                <Button variant="outline" size="sm">
                  + 500ml
                </Button>
                <Button variant="outline" size="sm">
                  Custom
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-amber-700" />
              Other Beverages
            </CardTitle>
            <CardDescription>
              Track caffeine, alcohol, and other beverages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                <div className="p-3 border rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                      <Coffee className="h-4 w-4 text-amber-700" />
                    </div>
                    <div>
                      <h4 className="font-medium">Coffee</h4>
                      <p className="text-xs text-muted-foreground">95mg caffeine</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Add</Button>
                </div>
                
                <div className="p-3 border rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                      <svg className="h-4 w-4 text-green-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16C15.866 16 19 12.866 19 9C19 5.134 15.866 2 12 2C8.13401 2 5 5.134 5 9C5 12.866 8.13401 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Green Tea</h4>
                      <p className="text-xs text-muted-foreground">28mg caffeine</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Add</Button>
                </div>
                
                <div className="p-3 border rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                      <svg className="h-4 w-4 text-red-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 8L21 12M21 12L17 16M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Energy Drink</h4>
                      <p className="text-xs text-muted-foreground">80mg caffeine</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Add</Button>
                </div>
                
                <div className="p-3 border rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                      <svg className="h-4 w-4 text-amber-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 10H17L16 22H8L7 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 15V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 15L14.5 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 15L9.5 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 6C8.68629 6 6 3.31371 6 0H18C18 3.31371 15.3137 6 12 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17 6L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 6L7 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Beer</h4>
                      <p className="text-xs text-muted-foreground">5% alcohol, 150 calories</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Add</Button>
                </div>
              </div>
            </ScrollArea>
            
            <Button className="w-full mt-4">
              Add Custom Beverage
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Nutrition;
