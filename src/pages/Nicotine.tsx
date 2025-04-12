import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NicotineIntakeForm } from "@/components/nicotine/NicotineIntakeForm";
import { NicotineHistory } from "@/components/nicotine/NicotineHistory";
import { NicotineChart } from "@/components/nicotine/NicotineChart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Info, 
  ArrowUpRight, 
  Cigarette, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  Brain,
  Plus,
  UserRound,
  Users 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";

interface NicotineLog {
  id: string;
  user_id: string;
  nicotine_type: string;
  product_name?: string;
  amount: number;
  unit: string;
  energy_impact: number;
  mood_impact: number;
  cravings_before: number;
  urge_triggers?: string[];
  location?: string;
  notes?: string;
  created_at: string;
}

interface NicotineStats {
  daily_average: number;
  weekly_trend: number;
  most_common_trigger: string;
  most_common_location: string;
  days_tracked: number;
  total_logged: number;
}

const Nicotine = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("intake");
  const navigate = useNavigate();

  // Fetch nicotine logs
  const { data: nicotineLogs, isLoading: isLogsLoading } = useQuery({
    queryKey: ["nicotineLogs", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from("nicotine_logs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as NicotineLog[];
    },
    enabled: !!session?.user?.id,
  });

  // Calculate nicotine stats
  const { data: nicotineStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["nicotineStats", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id || !nicotineLogs || nicotineLogs.length === 0) {
        return {
          daily_average: 0,
          weekly_trend: 0,
          most_common_trigger: "None",
          most_common_location: "None",
          days_tracked: 0,
          total_logged: 0
        };
      }

      // Group logs by date
      const logsByDate = nicotineLogs.reduce((acc, log) => {
        const date = new Date(log.created_at).toISOString().split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(log);
        return acc;
      }, {} as Record<string, NicotineLog[]>);
      
      // Calculate daily averages
      const dailyTotals = Object.values(logsByDate).map(logs => 
        logs.reduce((sum, log) => sum + log.amount, 0)
      );
      
      const dailyAverage = dailyTotals.length > 0 
        ? dailyTotals.reduce((sum, total) => sum + total, 0) / dailyTotals.length
        : 0;
      
      // Calculate weekly trend (positive means reduction)
      const today = new Date();
      const lastWeek = subDays(today, 7);
      
      const recentLogs = nicotineLogs.filter(log => 
        new Date(log.created_at) >= lastWeek
      );
      
      const olderLogs = nicotineLogs.filter(log => 
        new Date(log.created_at) < lastWeek && 
        new Date(log.created_at) >= subDays(lastWeek, 7)
      );
      
      const recentAvg = recentLogs.length > 0 
        ? recentLogs.reduce((sum, log) => sum + log.amount, 0) / recentLogs.length
        : 0;
        
      const olderAvg = olderLogs.length > 0 
        ? olderLogs.reduce((sum, log) => sum + log.amount, 0) / olderLogs.length
        : 0;
      
      const weeklyTrend = olderAvg > 0 
        ? ((olderAvg - recentAvg) / olderAvg) * 100
        : 0;
      
      // Find most common trigger
      const triggerCounts = nicotineLogs
        .filter(log => log.urge_triggers && log.urge_triggers.length > 0)
        .flatMap(log => log.urge_triggers)
        .reduce((acc, trigger) => {
          acc[trigger as string] = (acc[trigger as string] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      
      const mostCommonTrigger = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
      
      // Find most common location
      const locationCounts = nicotineLogs
        .filter(log => log.location)
        .reduce((acc, log) => {
          acc[log.location as string] = (acc[log.location as string] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      
      const mostCommonLocation = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
      
      return {
        daily_average: Math.round(dailyAverage * 10) / 10,
        weekly_trend: Math.round(weeklyTrend * 10) / 10,
        most_common_trigger: mostCommonTrigger,
        most_common_location: mostCommonLocation,
        days_tracked: Object.keys(logsByDate).length,
        total_logged: nicotineLogs.length
      };
    },
    enabled: !!session?.user?.id && !!nicotineLogs,
  });

  // Get chart data formatted for recharts
  const { data: chartData, isLoading: isChartLoading } = useQuery({
    queryKey: ["nicotineChartData", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id || !nicotineLogs) return [];

      // Group logs by date
      const logsByDate = nicotineLogs.reduce((acc, log) => {
        const date = new Date(log.created_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = {
            date,
            amount: 0,
            energy: 0,
            mood: 0,
            count: 0
          };
        }
        acc[date].amount += log.amount;
        acc[date].energy += log.energy_impact;
        acc[date].mood += log.mood_impact;
        acc[date].count += 1;
        return acc;
      }, {} as Record<string, { date: string; amount: number; energy: number; mood: number; count: number }>);

      // Calculate averages and format for chart
      return Object.values(logsByDate)
        .map(day => ({
          date: format(parseISO(day.date), 'MMM dd'),
          amount: Math.round(day.amount * 10) / 10,
          energy: Math.round((day.energy / day.count) * 10) / 10,
          mood: Math.round((day.mood / day.count) * 10) / 10
        }))
        .sort((a, b) => {
          const dateA = parseISO(a.date);
          const dateB = parseISO(b.date);
          return dateA.getTime() - dateB.getTime();
        });
    },
    enabled: !!session?.user?.id && !!nicotineLogs,
  });

  // Log nicotine use
  const logNicotineMutation = useMutation({
    mutationFn: async (values: {
      nicotineType: string;
      productName?: string;
      amount: string;
      unit: string;
      energyImpact: number;
      moodImpact: number;
      cravingsBefore: number;
      urgeTriggers?: string;
      location?: string;
      notes?: string;
    }) => {
      if (!session?.user?.id) throw new Error("Not authenticated");

      const { error } = await supabase.from("nicotine_logs").insert({
        user_id: session.user.id,
        nicotine_type: values.nicotineType,
        product_name: values.productName || null,
        amount: parseFloat(values.amount),
        unit: values.unit,
        energy_impact: values.energyImpact,
        mood_impact: values.moodImpact,
        cravings_before: values.cravingsBefore,
        urge_triggers: values.urgeTriggers ? values.urgeTriggers.split(',').map(t => t.trim()) : null,
        location: values.location || null,
        notes: values.notes || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nicotineLogs"] });
      queryClient.invalidateQueries({ queryKey: ["nicotineStats"] });
      queryClient.invalidateQueries({ queryKey: ["nicotineChartData"] });
      
      toast({
        title: "Success",
        description: "Nicotine intake logged successfully",
      });
      
      setActiveTab("trends");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log nicotine intake",
        variant: "destructive",
      });
      console.error("Error logging nicotine:", error);
    },
  });

  // Delete log entry
  const deleteLogMutation = useMutation({
    mutationFn: async (logId: string) => {
      const { error } = await supabase
        .from("nicotine_logs")
        .delete()
        .eq("id", logId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nicotineLogs"] });
      queryClient.invalidateQueries({ queryKey: ["nicotineStats"] });
      queryClient.invalidateQueries({ queryKey: ["nicotineChartData"] });
      
      toast({
        title: "Log deleted",
        description: "Nicotine log entry has been deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete log entry",
        variant: "destructive",
      });
      console.error("Error deleting log:", error);
    },
  });

  const handleSubmit = (values: {
    nicotineType: string;
    productName?: string;
    amount: string;
    unit: string;
    energyImpact: number;
    moodImpact: number;
    cravingsBefore: number;
    urgeTriggers?: string;
    location?: string;
    notes?: string;
  }) => {
    if (!values.amount || parseFloat(values.amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    logNicotineMutation.mutate(values);
  };

  const handleDeleteLog = (logId: string) => {
    if (window.confirm("Are you sure you want to delete this log entry?")) {
      deleteLogMutation.mutate(logId);
    }
  };

  const getTrendDirection = () => {
    if (!nicotineStats || nicotineStats.weekly_trend === 0) return "neutral";
    return nicotineStats.weekly_trend > 0 ? "positive" : "negative";
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Nicotine Tracker</h1>
          <p className="text-muted-foreground">
            Track your nicotine consumption patterns to make informed decisions
          </p>
        </div>
        <Button onClick={() => setActiveTab("intake")}>
          <Plus className="mr-2 h-4 w-4" />
          Log Intake
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Health Advisory</AlertTitle>
        <AlertDescription>
          While we understand nicotine use is a personal choice, we recommend considering safer alternatives or gradual reduction. 
          Oral nicotine products are generally safer than smoking. Consider speaking with a healthcare provider about nicotine replacement therapy.
        </AlertDescription>
      </Alert>

      {!isStatsLoading && nicotineStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">Daily Average</CardTitle>
                <Cigarette className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {nicotineStats.daily_average} {nicotineLogs?.[0]?.unit || 'units'}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {nicotineStats.days_tracked} days tracked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">Weekly Trend</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                getTrendDirection() === 'positive' 
                  ? 'text-green-500' 
                  : getTrendDirection() === 'negative'
                    ? 'text-red-500'
                    : ''
              }`}>
                {nicotineStats.weekly_trend > 0 ? '↓ ' : nicotineStats.weekly_trend < 0 ? '↑ ' : ''}
                {Math.abs(nicotineStats.weekly_trend)}%
              </div>
              <p className="text-sm text-muted-foreground">
                {nicotineStats.weekly_trend > 0 
                  ? 'Decreasing usage - Great job!' 
                  : nicotineStats.weekly_trend < 0
                    ? 'Increasing usage - Need support?'
                    : 'No change in usage pattern'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">Top Trigger</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">
                {nicotineStats.most_common_trigger}
              </div>
              <p className="text-sm text-muted-foreground">
                Most common reason for cravings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">Total Tracked</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {nicotineStats.total_logged} entries
              </div>
              <p className="text-sm text-muted-foreground">
                Across {nicotineStats.days_tracked} days
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="intake">Log Intake</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="intake" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Log Nicotine Intake</CardTitle>
              <CardDescription>
                Record your nicotine use to track patterns and identify triggers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NicotineIntakeForm onSubmit={handleSubmit} isSubmitting={logNicotineMutation.isPending} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent History</CardTitle>
              <CardDescription>
                Your nicotine intake over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NicotineHistory 
                history={nicotineLogs || []} 
                isLoading={isLogsLoading}
                onDelete={handleDeleteLog}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nicotine Intake Trends</CardTitle>
              <CardDescription>
                Visualize your nicotine usage patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <NicotineChart 
                data={chartData || []} 
                isLoading={isChartLoading} 
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Impact on Energy</CardTitle>
                <CardDescription>
                  How nicotine affects your energy levels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isLogsLoading && nicotineLogs && nicotineLogs.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Average Energy Impact:</span>
                      <Badge variant={
                        nicotineLogs.reduce((sum, log) => sum + log.energy_impact, 0) / nicotineLogs.length > 5
                          ? "default"
                          : "destructive"
                      }>
                        {(nicotineLogs.reduce((sum, log) => sum + log.energy_impact, 0) / nicotineLogs.length).toFixed(1)}/10
                      </Badge>
                    </div>
                    <Progress value={
                      (nicotineLogs.reduce((sum, log) => sum + log.energy_impact, 0) / nicotineLogs.length) * 10
                    } />
                    <p className="text-sm text-muted-foreground">
                      {nicotineLogs.reduce((sum, log) => sum + log.energy_impact, 0) / nicotineLogs.length > 5
                        ? "Nicotine appears to positively impact your energy levels overall."
                        : "Nicotine seems to have a limited or negative effect on your energy."}
                    </p>
                  </>
                ) : (
                  <p className="text-center text-muted-foreground">Log your nicotine use to see energy impact data</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact on Mood</CardTitle>
                <CardDescription>
                  How nicotine affects your mood
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isLogsLoading && nicotineLogs && nicotineLogs.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Average Mood Impact:</span>
                      <Badge variant={
                        nicotineLogs.reduce((sum, log) => sum + log.mood_impact, 0) / nicotineLogs.length > 5
                          ? "default"
                          : "destructive"
                      }>
                        {(nicotineLogs.reduce((sum, log) => sum + log.mood_impact, 0) / nicotineLogs.length).toFixed(1)}/10
                      </Badge>
                    </div>
                    <Progress value={
                      (nicotineLogs.reduce((sum, log) => sum + log.mood_impact, 0) / nicotineLogs.length) * 10
                    } />
                    <p className="text-sm text-muted-foreground">
                      {nicotineLogs.reduce((sum, log) => sum + log.mood_impact, 0) / nicotineLogs.length > 5
                        ? "Nicotine appears to positively impact your mood overall."
                        : "Nicotine seems to have a limited or negative effect on your mood."}
                    </p>
                  </>
                ) : (
                  <p className="text-center text-muted-foreground">Log your nicotine use to see mood impact data</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Support Resources</CardTitle>
              <CardDescription>
                Tools and resources to help you manage your nicotine use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Exercise
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Physical activity can reduce nicotine cravings and withdrawal symptoms.
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-2" asChild>
                    <a href="/exercise" className="flex items-center">
                      View Exercises
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    Mindfulness
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Meditation and breathing exercises can help manage cravings.
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-2" asChild>
                    <a href="/meditation" className="flex items-center">
                      Try Meditation
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Support
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with others who are managing or quitting nicotine use.
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-2" asChild>
                    <a href="/sobriety/support" className="flex items-center">
                      Get Support
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/sobriety')}
              >
                View Comprehensive Sobriety Tools
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Nicotine;
