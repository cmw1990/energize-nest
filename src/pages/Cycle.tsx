
import React from 'react';
import { CyclePhasePrediction } from "@/components/cycle/CyclePhasePrediction";
import { CycleTracking } from "@/components/cycle/CycleTracking";
import { CycleLifestyleRecommendations } from "@/components/cycle/CycleLifestyleRecommendations";
import { CycleRecommendations } from "@/components/cycle/CycleRecommendations";
import { CycleWeatherImpact } from "@/components/cycle/CycleWeatherImpact";
import { CycleSleepCorrelation } from "@/components/cycle/CycleSleepCorrelation";
import { WearableDeviceIntegration } from "@/components/cycle/WearableDeviceIntegration";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { assertType } from "@/utils/typeSafeUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNav } from "@/components/layout/TopNav";
import { Calendar, Moon, Heart, Cloud, SunMoon, Watch, Zap } from "lucide-react";
import { CycleMoodAnalysis } from "@/components/cycle/CycleMoodAnalysis";
import { CycleNotifications } from "@/components/cycle/CycleNotifications";
import { CycleSettings } from "@/components/cycle/CycleSettings";
import { motion } from "framer-motion";

const CyclePage = () => {
  // Get current phase from predictions
  const { data: currentPhase, isLoading } = useQuery({
    queryKey: ['current_phase'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cycle_phase_predictions')
        .select('*')
        .gte('predicted_end_date', new Date().toISOString().split('T')[0])
        .order('predicted_start_date', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data?.phase_type;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <motion.div 
        className="container mx-auto p-4 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Moon className="h-7 w-7 text-primary" />
              Cycle Tracking
            </h1>
            <p className="text-muted-foreground mt-1">
              Track, analyze and optimize your health with comprehensive cycle insights
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Overview</span>
              <span className="md:hidden">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden md:inline">Tracking</span>
              <span className="md:hidden">Track</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden md:inline">Insights</span>
              <span className="md:hidden">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Watch className="h-4 w-4" />
              <span className="hidden md:inline">Integrations</span>
              <span className="md:hidden">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Cycle Phase Prediction
                </CardTitle>
                <CardDescription>
                  View your current cycle phase and upcoming predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CyclePhasePrediction />
              </CardContent>
            </Card>

            {currentPhase && (
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary/10 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Lifestyle Recommendations
                    </CardTitle>
                    <CardDescription>
                      Optimize your daily activities based on your cycle phase
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CycleLifestyleRecommendations phaseType={currentPhase} />
                  </CardContent>
                </Card>

                <Card className="border-primary/10 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      Nutrition & Supplements
                    </CardTitle>
                    <CardDescription>
                      Tailored nutrition and supplement recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CycleRecommendations phaseType={currentPhase} />
                  </CardContent>
                </Card>
              </div>
            )}

            <CycleNotifications />
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Cycle Tracking
                </CardTitle>
                <CardDescription>
                  Log your cycle data and symptoms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CycleTracking />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-primary" />
                    Weather Impact
                  </CardTitle>
                  <CardDescription>
                    How weather affects your symptoms and energy levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CycleWeatherImpact />
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SunMoon className="h-5 w-5 text-primary" />
                    Sleep Correlation
                  </CardTitle>
                  <CardDescription>
                    How your cycle affects your sleep quality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CycleSleepCorrelation />
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Mood Analysis
                </CardTitle>
                <CardDescription>
                  Analyze how your cycle impacts your mood and emotional well-being
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CycleMoodAnalysis />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Watch className="h-5 w-5 text-primary" />
                  Wearable Device Integration
                </CardTitle>
                <CardDescription>
                  Connect your wearable devices to enhance your cycle tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WearableDeviceIntegration />
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Cycle Settings
                </CardTitle>
                <CardDescription>
                  Customize your cycle tracking preferences and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CycleSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default CyclePage;
