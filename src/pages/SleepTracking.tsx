import React, { useState } from 'react';
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import SleepMetrics from "@/components/sleep/SleepMetrics";
import SleepLogEntry from "@/components/sleep/SleepLogEntry";
import SleepRecommendations from "@/components/sleep/SleepRecommendations";
import SleepAnalytics from "@/components/sleep/SleepAnalytics";
import SleepGoals from "@/components/sleep/SleepGoals";
import SleepHabits from "@/components/sleep/SleepHabits";
import { Moon, BarChart2, Calendar, Clock, Brain, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const SleepTracking = () => {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("log");
  const [sleepData, setSleepData] = useState({
    date: new Date().toISOString().split('T')[0],
    bedTime: '22:30',
    wakeTime: '06:30',
    duration: 480,
    quality: 4,
    notes: 'Slept well, minimal interruptions.'
  });

  const { data: sleepLogs, isLoading } = useQuery({
    queryKey: ['sleep-logs', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false })
        .limit(7);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id
  });

  const { data: sleepStats } = useQuery({
    queryKey: ['sleep-stats', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('sleep_statistics')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const handleEditLog = () => {
    // Implement edit functionality
    console.log("Edit log clicked");
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Sleep Tracking</h1>
          </div>
          <Button>
            <Clock className="mr-2 h-4 w-4" />
            Log Sleep
          </Button>
        </div>

        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sleep Dashboard</CardTitle>
            <CardDescription>
              Track, analyze, and improve your sleep patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="log" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Sleep Log
                </TabsTrigger>
                <TabsTrigger value="metrics" className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  Metrics
                </TabsTrigger>
                <TabsTrigger value="habits" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Habits
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Goals
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="log" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SleepLogEntry sleepData={sleepData} onEdit={handleEditLog} />
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Recent Sleep</CardTitle>
                      <CardDescription>
                        Your sleep patterns over the past week
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="flex justify-center p-6">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : sleepLogs && sleepLogs.length > 0 ? (
                        <div className="space-y-4">
                          {sleepLogs.slice(0, 3).map((log: any) => (
                            <div key={log.id} className="flex justify-between items-center border-b pb-2">
                              <div>
                                <div className="font-medium">{new Date(log.date).toLocaleDateString()}</div>
                                <div className="text-sm text-muted-foreground">
                                  {log.duration ? `${Math.floor(log.duration / 60)}h ${log.duration % 60}m` : 'N/A'}
                                </div>
                              </div>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Moon 
                                    key={i}
                                    className={`h-4 w-4 ${i < (log.quality || 0) ? 'text-primary' : 'text-muted-foreground opacity-30'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-6 text-muted-foreground">
                          No sleep logs found. Start tracking your sleep!
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <SleepAnalytics />
              </TabsContent>
              
              <TabsContent value="metrics" className="space-y-4 mt-6">
                <SleepMetrics />
              </TabsContent>
              
              <TabsContent value="habits" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SleepHabits />
                  <SleepRecommendations />
                </div>
              </TabsContent>
              
              <TabsContent value="goals" className="space-y-4 mt-6">
                <SleepGoals />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Clock className="h-10 w-10 mx-auto text-blue-500" />
                <h2 className="text-xl font-medium">Sleep Schedule</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Maintain a consistent sleep schedule, even on weekends.
                </p>
                <Button variant="outline">Set Schedule</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Brain className="h-10 w-10 mx-auto text-purple-500" />
                <h2 className="text-xl font-medium">Sleep Quality</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Improve your sleep quality with personalized recommendations.
                </p>
                <Button variant="outline">View Tips</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Activity className="h-10 w-10 mx-auto text-green-500" />
                <h2 className="text-xl font-medium">Sleep Analytics</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Analyze your sleep patterns to identify areas for improvement.
                </p>
                <Button variant="outline">View Analytics</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SleepTracking;
