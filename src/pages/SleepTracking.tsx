import React, { useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SleepMetrics from "@/components/sleep/SleepMetrics";
import SleepLogEntry from "@/components/sleep/SleepLogEntry";
import SleepRecommendations from "@/components/sleep/SleepRecommendations";
import SleepAnalytics from "@/components/sleep/SleepAnalytics";
import SleepGoals from "@/components/sleep/SleepGoals";
import SleepHabits from "@/components/sleep/SleepHabits";
import { Button } from "@/components/ui/button";
import { Activity, Moon, ClipboardCheck, Bed, BarChart, Target, Calendar, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";

const SleepTracking = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [selectedTab, setSelectedTab] = useState('track');

  const { data: sleepStats } = useQuery({
    queryKey: ['sleepStats', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sleep_logs')
        .select('sleep_duration, sleep_quality')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })
        .limit(7);
      
      if (error) throw error;
      
      if (!data?.length) return null;
      
      const avgDuration = data.reduce((sum, log) => sum + (log.sleep_duration || 0), 0) / data.length;
      const avgQuality = data.reduce((sum, log) => sum + (log.sleep_quality || 0), 0) / data.length;
      
      return {
        averageDuration: avgDuration.toFixed(1),
        averageQuality: (avgQuality / 10 * 100).toFixed(0),
        logsCount: data.length
      };
    },
    enabled: !!session?.user?.id
  });

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Moon className="h-7 w-7 text-primary" />
              Sleep Tracking
            </h1>
            <p className="text-muted-foreground mt-1">
              Track, analyze and optimize your sleep patterns for better health
            </p>
          </motion.div>

          {sleepStats && (
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4"
            >
              <div className="bg-primary/10 rounded-full px-4 py-2 flex items-center gap-2">
                <Bed className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{sleepStats.averageDuration}h avg</span>
              </div>
              <div className="bg-primary/10 rounded-full px-4 py-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{sleepStats.averageQuality}% quality</span>
              </div>
            </motion.div>
          )}
        </div>
        
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-3 mb-3">
                  <ClipboardCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-medium mb-1">Log Sleep</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Track your sleep duration and quality
                </p>
                <Button
                  size="sm"
                  onClick={() => setSelectedTab('track')}
                  className="mt-auto"
                  variant={selectedTab === 'track' ? 'default' : 'outline'}
                >
                  Log Sleep
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mb-3">
                  <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium mb-1">Sleep Analytics</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  View detailed sleep metrics and patterns
                </p>
                <Button
                  size="sm"
                  variant={selectedTab === 'metrics' ? 'default' : 'outline'}
                  onClick={() => setSelectedTab('metrics')}
                  className="mt-auto"
                >
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-teal-100 dark:bg-teal-900/30 p-3 mb-3">
                  <Target className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="font-medium mb-1">Sleep Goals</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Set and track your sleep improvement goals
                </p>
                <Button
                  size="sm"
                  variant={selectedTab === 'goals' ? 'default' : 'outline'}
                  onClick={() => setSelectedTab('goals')}
                  className="mt-auto"
                >
                  Manage Goals
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
              <TabsTrigger value="track" className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Log</span>
              </TabsTrigger>
              <TabsTrigger value="metrics" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span className="hidden sm:inline">Metrics</span>
              </TabsTrigger>
              <TabsTrigger value="habits" className="flex items-center gap-2">
                <Coffee className="h-4 w-4" />
                <span className="hidden sm:inline">Habits</span>
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Goals</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="track">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                    Sleep Log
                  </CardTitle>
                  <CardDescription>
                    Record your sleep duration, quality, and factors that affected your sleep
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SleepLogEntry />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-primary" />
                    Sleep Metrics
                  </CardTitle>
                  <CardDescription>
                    Detailed analysis of your sleep patterns and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SleepMetrics />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="habits">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-primary" />
                    Sleep Habits
                  </CardTitle>
                  <CardDescription>
                    Track and improve your sleep habits and routines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SleepHabits />
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
          </Tabs>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-primary" />
                Personalized Sleep Recommendations
              </CardTitle>
              <CardDescription>
                Tailored suggestions to improve your sleep based on your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SleepRecommendations />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Sleep Analytics
              </CardTitle>
              <CardDescription>
                In-depth analysis of your sleep patterns and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SleepAnalytics />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SleepTracking;
