
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopNav } from "@/components/layout/TopNav";
import { NutritionTracker } from "@/components/nutrition/NutritionTracker";
import { Button } from "@/components/ui/button";
import { Apple, BookOpen, Calculator, Calendar, ChefHat, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Nutrition = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 pt-6">
        <h1 className="text-3xl font-bold mb-6">Nutrition Hub</h1>
        
        <Tabs defaultValue="tracker" className="space-y-6">
          <TabsList className="grid grid-cols-5 h-auto">
            <TabsTrigger value="tracker" className="flex items-center gap-2 py-2">
              <Utensils className="h-4 w-4" /> Food Tracker
            </TabsTrigger>
            <TabsTrigger value="meal-planner" className="flex items-center gap-2 py-2">
              <Calendar className="h-4 w-4" /> Meal Planner
            </TabsTrigger>
            <TabsTrigger value="recipes" className="flex items-center gap-2 py-2">
              <ChefHat className="h-4 w-4" /> Recipes
            </TabsTrigger>
            <TabsTrigger value="calculators" className="flex items-center gap-2 py-2">
              <Calculator className="h-4 w-4" /> Calculators
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2 py-2">
              <BookOpen className="h-4 w-4" /> Learn
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracker" className="space-y-6">
            <NutritionTracker />
          </TabsContent>
          
          <TabsContent value="meal-planner" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Meal Planner</CardTitle>
                <CardDescription>Plan your meals ahead of time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium mb-4">This Week's Plan</h3>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium">Monday</h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Breakfast:</span>
                            <span>Oatmeal with Berries</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Lunch:</span>
                            <span>Chickpea Salad</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Dinner:</span>
                            <span>Grilled Salmon</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium">Tuesday</h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Breakfast:</span>
                            <span>Greek Yogurt Parfait</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Lunch:</span>
                            <span>Turkey Wrap</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Dinner:</span>
                            <span>Vegetable Stir Fry</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full mt-4">View Full Week</Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Generate Meal Plan</h3>
                    <div className="p-4 bg-primary/5 rounded-lg space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Let our AI create a personalized meal plan based on your nutritional goals, preferences, and dietary restrictions.
                      </p>
                      <Button className="w-full">Create Custom Plan</Button>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Popular Plans</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="justify-start">
                          <Apple className="mr-2 h-4 w-4" />
                          Weight Loss
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Apple className="mr-2 h-4 w-4" />
                          Muscle Gain
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Apple className="mr-2 h-4 w-4" />
                          Plant-Based
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Apple className="mr-2 h-4 w-4" />
                          Balanced
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recipes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Healthy Recipes</CardTitle>
                <CardDescription>Discover delicious and nutritious meal ideas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-muted"></div>
                    <div className="p-4">
                      <h3 className="font-medium">Mediterranean Quinoa Bowl</h3>
                      <p className="text-sm text-muted-foreground mt-1">High protein, vegetarian</p>
                      <div className="flex justify-between mt-2 text-sm">
                        <span>20 min</span>
                        <span>450 kcal</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-muted"></div>
                    <div className="p-4">
                      <h3 className="font-medium">Baked Salmon with Asparagus</h3>
                      <p className="text-sm text-muted-foreground mt-1">Low carb, high protein</p>
                      <div className="flex justify-between mt-2 text-sm">
                        <span>25 min</span>
                        <span>380 kcal</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-muted"></div>
                    <div className="p-4">
                      <h3 className="font-medium">Green Smoothie Bowl</h3>
                      <p className="text-sm text-muted-foreground mt-1">Vegan, high fiber</p>
                      <div className="flex justify-between mt-2 text-sm">
                        <span>10 min</span>
                        <span>320 kcal</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-6">Browse All Recipes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calculators" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    BMI Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Calculate your Body Mass Index (BMI) to determine if you're at a healthy weight.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/tools/bmi-calculator')}>
                    Open Calculator
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Calorie Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Calculate your daily calorie needs based on your age, weight, height, and activity level.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/tools/calorie-calculator')}>
                    Open Calculator
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Macro Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Calculate your ideal macronutrient distribution based on your goals and body type.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/tools/macro-calculator')}>
                    Open Calculator
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Water Intake Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Calculate your recommended daily water intake based on your weight and activity level.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/tools/water-intake-calculator')}>
                    Open Calculator
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Body Fat Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Estimate your body fat percentage using various measurement methods.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/tools/body-fat-calculator')}>
                    Open Calculator
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Recipe Analyzer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Calculate the nutritional information of your own recipes by entering ingredients.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/tools/recipe-analyzer')}>
                    Open Analyzer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Education</CardTitle>
                <CardDescription>Learn about nutrition fundamentals and healthy eating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Featured Articles</h3>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium">Understanding Macronutrients</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Learn the basics of proteins, carbohydrates, and fats, and how they affect your body.
                        </p>
                        <Button variant="link" className="p-0 mt-2">Read Article</Button>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium">The Science of Metabolism</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Understand how your body processes food and what factors influence your metabolic rate.
                        </p>
                        <Button variant="link" className="p-0 mt-2">Read Article</Button>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h4 className="font-medium">Nutrition Myths Debunked</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Separate fact from fiction with science-based explanations of common nutrition myths.
                        </p>
                        <Button variant="link" className="p-0 mt-2">Read Article</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Learning Paths</h3>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-medium">Nutrition Fundamentals</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        A 4-week course covering the basics of nutrition, meal planning, and healthy eating habits.
                      </p>
                      <div className="mt-3 flex justify-between items-center">
                        <div className="text-sm">Progress: 0/12 lessons</div>
                        <Button size="sm">Start Course</Button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Popular Topics</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="justify-start">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Weight Management
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Sports Nutrition
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Healthy Aging
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Dietary Patterns
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Nutrition;
