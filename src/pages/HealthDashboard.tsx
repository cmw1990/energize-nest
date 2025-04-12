import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopNav } from "@/components/layout/TopNav";
import { Heart, Activity, Battery, Brain, Utensils, Moon, Wind } from "lucide-react";
import { SleepMetrics } from "@/components/sleep/SleepMetrics";
import { MoodAnalysis } from "@/components/sleep/MoodAnalysis";
import { FocusExercises } from "@/components/health/FocusExercises";
import { SleepAnalysis } from "@/components/sleep/SleepAnalysis";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transformFoodLog } from "@/utils/supabaseHelpers";

const HealthDashboard = () => {
  const { data: sleepData, isLoading: sleepLoading } = useQuery({
    queryKey: ['sleep_data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sleep_tracking')
        .select('*')
        .order('date', { ascending: false })
        .limit(7);
      
      if (error) throw error;
      return (data || []).map(item => {
        if (item.bedtime && item.wake_time) {
          const start = new Date(item.bedtime);
          const end = new Date(item.wake_time);
          const durationMs = end.getTime() - start.getTime();
          const durationMinutes = Math.floor(durationMs / (1000 * 60));
          return {
            ...item,
            duration_minutes: durationMinutes
          };
        }
        return {
          ...item,
          duration_minutes: 0
        };
      });
    }
  });

  const { data: stressData, isLoading: stressLoading } = useQuery({
    queryKey: ['stress_data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(7);
      
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        mood_score: item.overall_mood || 0,
        stress_level: item.stress || 0
      }));
    }
  });

  const { data: foodData, isLoading: foodLoading } = useQuery({
    queryKey: ['food_logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(7);
      
      if (error) throw error;
      
      return (data || []).map(item => transformFoodLog(item));
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 pt-6">
        <h1 className="text-3xl font-bold mb-6">Health Dashboard</h1>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-6 h-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-2">
              <Activity className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="sleep" className="flex items-center gap-2 py-2">
              <Moon className="h-4 w-4" /> Sleep
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center gap-2 py-2">
              <Heart className="h-4 w-4" /> Mood
            </TabsTrigger>
            <TabsTrigger value="focus" className="flex items-center gap-2 py-2">
              <Brain className="h-4 w-4" /> Focus
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-2 py-2">
              <Utensils className="h-4 w-4" /> Nutrition
            </TabsTrigger>
            <TabsTrigger value="energy" className="flex items-center gap-2 py-2">
              <Battery className="h-4 w-4" /> Energy
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-indigo-500" />
                    Sleep Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sleepLoading ? "Loading..." : sleepData?.[0]?.sleep_quality ? `${sleepData[0].sleep_quality}/10` : "No data yet"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {sleepData?.[0]?.duration_minutes ? `${Math.floor(sleepData[0].duration_minutes / 60)}h ${sleepData[0].duration_minutes % 60}m` : "Track your sleep"}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-500" />
                    Mood Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stressLoading ? "Loading..." : stressData?.[0]?.mood_score ? `${stressData[0].mood_score}/10` : "No data yet"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stressData?.[0]?.stress_level ? `Stress level: ${stressData[0].stress_level}/10` : "Track your mood"}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-emerald-500" />
                    Nutrition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {foodLoading ? "Loading..." : foodData?.[0]?.calorie_intake ? `${foodData[0].calorie_intake} kcal` : "No data yet"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {foodData?.[0]?.macros?.protein ? `Protein: ${foodData[0].macros.protein}g` : "Track your meals"}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your health progress over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Activity chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>AI Health Insights</CardTitle>
                  <CardDescription>Personalized recommendations based on your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-medium">Sleep Optimization</h3>
                      <p className="text-sm text-muted-foreground">
                        Based on your recent sleep patterns, going to bed 30 minutes earlier could improve your sleep quality by up to 20%.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-medium">Stress Management</h3>
                      <p className="text-sm text-muted-foreground">
                        Your stress levels tend to peak on Wednesdays. Consider scheduling short breaks or meditation sessions mid-week.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-medium">Energy Optimization</h3>
                      <p className="text-sm text-muted-foreground">
                        Your energy seems to dip around 3pm. Try a short walk or light snack to maintain energy levels throughout the day.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sleep" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <SleepAnalysis sleepData={{
                movements: [3, 5, 2, 6, 7, 4, 2, 3, 1],
                startTime: new Date().toISOString(),
                duration: 480,
                sensitivity: 0.8
              }} />
              <SleepMetrics sleepData={sleepData} />
            </div>
          </TabsContent>
          
          <TabsContent value="mood" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <MoodAnalysis sleepData={sleepData} stressData={stressData} />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-primary" />
                    Stress Reduction Techniques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-medium">Deep Breathing</h3>
                      <p className="text-sm text-muted-foreground">
                        Practice 4-7-8 breathing: Inhale for 4 seconds, hold for 7, exhale for 8. Repeat 5 times.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-medium">Progressive Muscle Relaxation</h3>
                      <p className="text-sm text-muted-foreground">
                        Tense and then release each muscle group, starting from your feet and working up to your head.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-medium">Mindfulness Meditation</h3>
                      <p className="text-sm text-muted-foreground">
                        Focus on the present moment, observing thoughts without judgment. Start with 5 minutes daily.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="focus" className="space-y-6">
            <FocusExercises />
          </TabsContent>
          
          <TabsContent value="nutrition" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Tracker</CardTitle>
                  <CardDescription>Monitor your daily food intake</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Calories</span>
                      <span>{foodData?.[0]?.calorie_intake || 0} / 2000 kcal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Protein</span>
                      <span>{foodData?.[0]?.macros?.protein || 0} / 150g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Carbs</span>
                      <span>{foodData?.[0]?.macros?.carbs || 0} / 200g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Fat</span>
                      <span>{foodData?.[0]?.macros?.fat || 0} / 70g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Water</span>
                      <span>{foodData?.[0]?.water_intake || 0} / 2000ml</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Meal Recommendations</CardTitle>
                  <CardDescription>Personalized meal suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-medium">Breakfast</h3>
                      <p className="text-sm text-muted-foreground">
                        Greek yogurt with berries and a tablespoon of honey. Add a handful of nuts for extra protein.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-medium">Lunch</h3>
                      <p className="text-sm text-muted-foreground">
                        Quinoa bowl with grilled chicken, avocado, and mixed vegetables.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-medium">Dinner</h3>
                      <p className="text-sm text-muted-foreground">
                        Baked salmon with sweet potato and steamed broccoli.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="energy" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Battery className="h-5 w-5 text-yellow-500" />
                    Energy Levels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Morning</span>
                      <span>7/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Afternoon</span>
                      <span>5/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Evening</span>
                      <span>6/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Overall Today</span>
                      <span>6/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Energy Optimization</CardTitle>
                  <CardDescription>Tips to maintain optimal energy levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-medium">Morning Routine</h3>
                      <p className="text-sm text-muted-foreground">
                        Start your day with a glass of water and a 10-minute morning stretch to boost circulation.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-medium">Afternoon Slump</h3>
                      <p className="text-sm text-muted-foreground">
                        Combat the 3pm energy dip with a short walk outdoors and a protein-rich snack.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-medium">Evening Wind-Down</h3>
                      <p className="text-sm text-muted-foreground">
                        Reduce blue light exposure 2 hours before bed and practice a relaxing evening ritual.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthDashboard;
