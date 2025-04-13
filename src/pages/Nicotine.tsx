import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { TopNav } from "@/components/layout/TopNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NicotineTracker } from "@/components/nicotine/NicotineTracker";
import { NicotineChart } from "@/components/nicotine/NicotineChart";
import { CravingTracker } from "@/components/sobriety/CravingTracker";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Cigarette, TrendingDown, Activity, Zap, BarChart, Clock,
  Calendar, ExternalLink, CheckCircle, Battery, Brain, Wind
} from "lucide-react";
import { format, parseISO, isValid, subDays } from "date-fns";

const Nicotine = () => {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("tracker");
  const [logData, setLogData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAllEntries, setShowAllEntries] = useState(false);

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  // Fetch nicotine logs for the selected date
  const { data: dailyLogs, isLoading: isLoadingDailyLogs } = useQuery({
    queryKey: ['nicotine-logs', formattedDate, session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('nicotine_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('created_at::date', formattedDate)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id && isValid(selectedDate)
  });

  // Fetch all nicotine logs for chart
  const { data: allLogs, isLoading: isLoadingAllLogs } = useQuery({
    queryKey: ['all-nicotine-logs', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('nicotine_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id
  });

  useEffect(() => {
    if (allLogs) {
      const transformedData = transformLogData(allLogs);
      setLogData(transformedData);
    }
  }, [allLogs]);

  // Calculate total nicotine amount for the day
  const totalNicotine = dailyLogs?.reduce((sum, log) => sum + log.amount, 0) || 0;

  // Calculate average energy impact for the day
  const avgEnergyImpact = dailyLogs?.length
    ? dailyLogs.reduce((sum, log) => sum + (log.energy_impact || 0), 0) / dailyLogs.length
    : 0;

  // Calculate average mood impact for the day
  const avgMoodImpact = dailyLogs?.length
    ? dailyLogs.reduce((sum, log) => sum + (log.mood_impact || 0), 0) / dailyLogs.length
    : 0;

  // Function to handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = parseISO(e.target.value);
    if (isValid(newDate)) {
      setSelectedDate(newDate);
    }
  };

  // Function to toggle between showing all entries and daily entries
  const toggleShowAllEntries = () => {
    setShowAllEntries(!showAllEntries);
  };

  // Function to transform log data for the chart
  const transformLogData = (logs: any[]) => {
    return logs.map(log => ({
      date: format(new Date(log.created_at), 'MMM dd'),
      amount: log.amount,
      energy: log.energy_impact || 0,
      mood: log.mood_impact || 0,
      craving: log.craving_level,
      withdrawalScore: log.withdrawal_score
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cigarette className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Nicotine Tracker</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              Last Log: Today
            </Button>
          </div>
        </div>

        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Manage Your Nicotine Consumption</CardTitle>
            <CardDescription>
              Track your daily intake, monitor cravings, and analyze trends to
              support your journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="tracker">Tracker</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tracker" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-primary/10 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Today's Summary</span>
                        <Button variant="secondary" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View All
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Quick overview of your daily nicotine consumption
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Total Nicotine Intake</span>
                          <span className="font-bold">{totalNicotine} mg</span>
                        </div>
                        <Progress value={totalNicotine} max={100} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Activity className="h-4 w-4 flex-shrink-0" />
                            <span>Energy Impact: {avgEnergyImpact.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 flex-shrink-0" />
                            <span>Mood Impact: {avgMoodImpact.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="date">Select Date:</label>
                          <input
                            type="date"
                            id="date"
                            value={format(selectedDate, 'yyyy-MM-dd')}
                            onChange={handleDateChange}
                            className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-primary/10 shadow-md">
                    <CardHeader>
                      <CardTitle>Track Your Nicotine Usage</CardTitle>
                      <CardDescription>
                        Log your nicotine consumption to monitor your habits
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <NicotineTracker />
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="border-primary/10 shadow-md">
                  <CardHeader>
                    <CardTitle>Monitor Your Cravings</CardTitle>
                    <CardDescription>
                      Keep track of your cravings to identify triggers and patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CravingTracker />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-6">
                <Card className="border-primary/10 shadow-md">
                  <CardHeader>
                    <CardTitle>Nicotine Usage Chart</CardTitle>
                    <CardDescription>
                      Visualize your nicotine consumption trends over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {logData.length > 1 ? (
                      <NicotineChart data={logData} isLoading={isLoadingAllLogs} />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48">
                        <BarChart className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
                        <h3 className="font-medium mb-1">Not enough data to display chart</h3>
                        <p className="text-sm text-muted-foreground">
                          Log your nicotine intake regularly to see usage trends and patterns.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-medium">Ready to quit?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our comprehensive guide to quitting nicotine, featuring
                expert advice, proven strategies, and community support.
              </p>
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                Start Your Quitting Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Nicotine;
