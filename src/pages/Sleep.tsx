import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SleepAnalysis } from "@/components/sleep/SleepAnalysis";
import { SleepMetrics } from "@/components/sleep/SleepMetrics";
import { SleepRecommendations } from "@/components/sleep/SleepRecommendations";
import { SleepGoals } from "@/components/sleep/SleepGoals";
import { SleepRoutine } from "@/components/sleep/SleepRoutine";
import { TopNav } from "@/components/layout/TopNav";
import { Clock, Moon, Zap, BedDouble, Activity, Calendar,
  Alarm, Coffee, Pill, Lightbulb, LineChart, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const Sleep = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: sleepMetrics, isLoading: isLoadingSleepMetrics } = useQuery({
    queryKey: ['sleep-summary', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('sleep_logs')
        .select('sleep_duration, sleep_quality, bedtime, wake_time')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(7);
      
      if (error) throw error;
      
      if (!data || data.length === 0) return null;
      
      const avgDuration = data.reduce((sum, log) => sum + (log.sleep_duration || 0), 0) / data.length;
      const avgQuality = data.reduce((sum, log) => sum + (log.sleep_quality || 0), 0) / data.length;
      
      let consistencyScore = 0;
      if (data.length > 1) {
        const bedtimes = data.map(log => new Date(log.bedtime).getHours() * 60 + new Date(log.bedtime).getMinutes());
        const wakeTimes = data.map(log => new Date(log.wake_time).getHours() * 60 + new Date(log.wake_time).getMinutes());
        
        const bedtimeStdDev = calculateStdDev(bedtimes);
        const wakeTimeStdDev = calculateStdDev(wakeTimes);
        
        const bedtimeConsistency = Math.max(0, 100 - (bedtimeStdDev / 60) * 100);
        const wakeTimeConsistency = Math.max(0, 100 - (wakeTimeStdDev / 60) * 100);
        
        consistencyScore = (bedtimeConsistency + wakeTimeConsistency) / 2;
      }
      
      return {
        avgDuration,
        avgQuality,
        consistency: consistencyScore,
        recentSleepLog: data[0]
      };
    },
    enabled: !!session?.user?.id
  });
  
  const { data: sleepGoals, isLoading: isLoadingSleepGoals } = useQuery({
    queryKey: ['sleep-goals', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('sleep_goals')
        .select('*')
        .eq('user_id', session.user.id)
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return data || { target_sleep_duration: 8 };
    },
    enabled: !!session?.user?.id
  });

  function calculateStdDev(values: number[]) {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(avgSquareDiff);
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    
    try {
      return new Date(timeString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return "";
    }
  };

  const calculateGoalProgress = () => {
    if (!sleepMetrics || !sleepGoals) return 0;
    
    const targetDuration = sleepGoals.target_sleep_duration;
    const actualDuration = sleepMetrics.avgDuration;
    
    if (actualDuration >= targetDuration) return 100;
    
    return (actualDuration / targetDuration) * 100;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <motion.div 
        className="container mx-auto p-4 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={itemVariants}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Moon className="h-7 w-7 text-primary" />
              Sleep Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track, analyze, and optimize your sleep for better health and energy
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 hover:shadow-md transition-shadow border-primary/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-3 mb-3">
                  <BedDouble className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-medium mb-1">Log Sleep</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Track your sleep patterns and quality
                </p>
                <Button
                  size="sm"
                  onClick={() => navigate("/app/sleep-tracking")}
                  className="mt-auto"
                >
                  Record Sleep
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-md transition-shadow border-primary/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mb-3">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium mb-1">Sleep Calculator</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Find your ideal bedtime and wake time
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/app/web-tools/sleep-calculator")}
                  className="mt-auto"
                >
                  Calculate
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 hover:shadow-md transition-shadow border-primary/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-teal-100 dark:bg-teal-900/30 p-3 mb-3">
                  <Activity className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="font-medium mb-1">Sleep Trends</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  View your sleep analytics and patterns
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/app/sleep-tracking?tab=metrics")}
                  className="mt-auto"
                >
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-primary" />
                Sleep Overview
              </CardTitle>
              <CardDescription>
                At-a-glance summary of your recent sleep metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium">Average Duration</h4>
                  </div>
                  {isLoadingSleepMetrics ? (
                    <Skeleton className="h-8 w-20" />
                  ) : sleepMetrics ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{sleepMetrics.avgDuration.toFixed(1)}</span>
                      <span className="text-muted-foreground">hours</span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">No data yet</div>
                  )}
                  {sleepGoals && sleepMetrics && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span>Goal: {sleepGoals.target_sleep_duration} hours</span>
                        <span>{calculateGoalProgress().toFixed(0)}%</span>
                      </div>
                      <Progress value={calculateGoalProgress()} />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium">Sleep Quality</h4>
                  </div>
                  {isLoadingSleepMetrics ? (
                    <Skeleton className="h-8 w-20" />
                  ) : sleepMetrics ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{(sleepMetrics.avgQuality / 10 * 100).toFixed(0)}</span>
                      <span className="text-muted-foreground">/ 100</span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">No data yet</div>
                  )}
                  {sleepMetrics && (
                    <div>
                      <Badge 
                        variant="outline" 
                        className={
                          sleepMetrics.avgQuality > 7 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : sleepMetrics.avgQuality > 5 
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
                              : "bg-red-100 text-red-800 border-red-200"
                        }
                      >
                        {sleepMetrics.avgQuality > 7 
                          ? "Good" 
                          : sleepMetrics.avgQuality > 5 
                            ? "Fair" 
                            : "Poor"}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Alarm className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium">Sleep Consistency</h4>
                  </div>
                  {isLoadingSleepMetrics ? (
                    <Skeleton className="h-8 w-20" />
                  ) : sleepMetrics ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{sleepMetrics.consistency.toFixed(0)}</span>
                      <span className="text-muted-foreground">/ 100</span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">No data yet</div>
                  )}
                  {sleepMetrics && (
                    <div>
                      <Badge 
                        variant="outline" 
                        className={
                          sleepMetrics.consistency > 70 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : sleepMetrics.consistency > 40 
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
                              : "bg-red-100 text-red-800 border-red-200"
                        }
                      >
                        {sleepMetrics.consistency > 70 
                          ? "Consistent" 
                          : sleepMetrics.consistency > 40 
                            ? "Somewhat Regular" 
                            : "Irregular"}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium">Recent Sleep</h4>
                  </div>
                  {isLoadingSleepMetrics ? (
                    <Skeleton className="h-8 w-full" />
                  ) : sleepMetrics?.recentSleepLog ? (
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bedtime:</span>
                        <span className="font-medium">{formatTime(sleepMetrics.recentSleepLog.bedtime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Wake time:</span>
                        <span className="font-medium">{formatTime(sleepMetrics.recentSleepLog.wake_time)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{sleepMetrics.recentSleepLog.sleep_duration} hours</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">No recent sleep data</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span className="hidden md:inline">Overview</span>
                <span className="md:hidden">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="metrics" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span className="hidden md:inline">Metrics</span>
                <span className="md:hidden">Metrics</span>
              </TabsTrigger>
              <TabsTrigger value="routine" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="hidden md:inline">Routine</span>
                <span className="md:hidden">Routine</span>
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden md:inline">Goals</span>
                <span className="md:hidden">Goals</span>
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span className="hidden md:inline">Tips</span>
                <span className="md:hidden">Tips</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Sleep Analysis
                  </CardTitle>
                  <CardDescription>
                    Understand your sleep patterns and how they affect your energy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SleepAnalysis />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="metrics">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    Sleep Metrics
                  </CardTitle>
                  <CardDescription>
                    Track your sleep quality and duration over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SleepMetrics />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="routine">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Sleep Routine
                  </CardTitle>
                  <CardDescription>
                    Optimize your bedtime and wake-up routines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SleepRoutine />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="goals">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Sleep Goals
                  </CardTitle>
                  <CardDescription>
                    Set and track your sleep improvement goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SleepGoals />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tips">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Sleep Recommendations
                  </CardTitle>
                  <CardDescription>
                    Personalized tips to improve your sleep quality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SleepRecommendations />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="grid gap-6 md:grid-cols-2"
        >
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-primary" />
                Sleep Disruptors
              </CardTitle>
              <CardDescription>
                Common factors that can negatively impact your sleep
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-amber-100 p-2 rounded-full">
                  <Coffee className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Caffeine</h3>
                  <p className="text-sm text-muted-foreground">
                    Caffeine can stay in your system for 6+ hours. Avoid consumption after 2 PM for optimal sleep.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-blue-100 p-2 rounded-full">
                  <Smartphone className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Screen Time</h3>
                  <p className="text-sm text-muted-foreground">
                    Blue light from screens suppresses melatonin. Avoid screens 1-2 hours before bedtime.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-purple-100 p-2 rounded-full">
                  <Brain className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Stress and Anxiety</h3>
                  <p className="text-sm text-muted-foreground">
                    Mental tension can make it difficult to fall and stay asleep. Try relaxation techniques before bed.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-red-100 p-2 rounded-full">
                  <Wine className="h-5 w-5 text-red-700" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Alcohol</h3>
                  <p className="text-sm text-muted-foreground">
                    While alcohol may help you fall asleep, it reduces sleep quality and disrupts REM sleep.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate("/app/sleep-tracking")}>
                Track Sleep Disruptors
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                Sleep Enhancers
              </CardTitle>
              <CardDescription>
                Tools and supplements that can help improve your sleep quality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-indigo-100 p-2 rounded-full">
                  <Moon className="h-5 w-5 text-indigo-700" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Melatonin</h3>
                  <p className="text-sm text-muted-foreground">
                    Natural hormone that regulates sleep-wake cycles. Can be useful for jet lag or shifting sleep schedules.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-green-100 p-2 rounded-full">
                  <Flower className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Relaxing Herbs</h3>
                  <p className="text-sm text-muted-foreground">
                    Valerian root, chamomile, and lavender can promote relaxation and better sleep quality.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-blue-100 p-2 rounded-full">
                  <Cloud className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">White Noise</h3>
                  <p className="text-sm text-muted-foreground">
                    Consistent background noise can mask disruptive sounds and help you fall asleep faster.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-amber-100 p-2 rounded-full">
                  <Sun className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Light Exposure</h3>
                  <p className="text-sm text-muted-foreground">
                    Morning sunlight helps regulate your circadian rhythm. Aim for 10-30 minutes of morning light.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/app/supplements")}
              >
                Explore Sleep Supplements
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Sleep;
