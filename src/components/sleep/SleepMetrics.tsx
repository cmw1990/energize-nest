
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Clock, Calendar, TrendingUp, Activity } from "lucide-react";
import { SleepChart } from "./SleepChart";
import { format, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";

export function SleepMetrics() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = React.useState<"week" | "month">("week");

  const startDate = React.useMemo(() => {
    return format(
      subDays(new Date(), timeRange === "week" ? 7 : 30),
      "yyyy-MM-dd"
    );
  }, [timeRange]);

  const { data: sleepLogs, isLoading } = useQuery({
    queryKey: ['sleep-stats', timeRange],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('sleep_tracking')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('date', startDate)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const calculateAverageSleepDuration = () => {
    if (!sleepLogs || sleepLogs.length === 0) return 0;
    const totalMinutes = sleepLogs.reduce((sum, log) => sum + (log.duration_minutes || 0), 0);
    return Math.round(totalMinutes / sleepLogs.length);
  };

  const calculateAverageSleepQuality = () => {
    if (!sleepLogs || sleepLogs.length === 0) return 0;
    const totalQuality = sleepLogs.reduce((sum, log) => sum + (log.sleep_quality || 0), 0);
    return (totalQuality / sleepLogs.length).toFixed(1);
  };

  const calculateConsistencyScore = () => {
    if (!sleepLogs || sleepLogs.length < 3) return 0;
    
    // Calculate standard deviation of bedtimes and wake times
    const bedtimes = sleepLogs.map(log => {
      const [hours, minutes] = log.bedtime.split(':').map(Number);
      return hours * 60 + minutes;
    });
    
    const waketimes = sleepLogs.map(log => {
      const [hours, minutes] = log.wake_time.split(':').map(Number);
      return hours * 60 + minutes;
    });
    
    const bedtimeStdDev = calculateStandardDeviation(bedtimes);
    const waketimeStdDev = calculateStandardDeviation(waketimes);
    
    // Lower standard deviation means more consistency
    // Max inconsistency we'll consider is 120 minutes (2 hours)
    const bedtimeConsistency = Math.max(0, 100 - (bedtimeStdDev / 120) * 100);
    const waketimeConsistency = Math.max(0, 100 - (waketimeStdDev / 120) * 100);
    
    return Math.round((bedtimeConsistency + waketimeConsistency) / 2);
  };

  const calculateStandardDeviation = (values: number[]): number => {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map(value => {
      const diff = value - avg;
      return diff * diff;
    });
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getMostCommonFactor = () => {
    if (!sleepLogs || sleepLogs.length === 0) return 'No data';
    
    const factors: Record<string, number> = {};
    sleepLogs.forEach(log => {
      if (log.factors && Array.isArray(log.factors)) {
        log.factors.forEach(factor => {
          factors[factor] = (factors[factor] || 0) + 1;
        });
      }
    });
    
    // Find the factor with the highest count
    let maxCount = 0;
    let mostCommonFactor = 'None';
    
    Object.entries(factors).forEach(([factor, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonFactor = factor;
      }
    });
    
    return mostCommonFactor === 'None' ? 'None reported' : mostCommonFactor;
  };

  const getReadableFactor = (factorId: string) => {
    const factorMap: Record<string, string> = {
      'exercise': 'Exercise',
      'caffeine': 'Caffeine',
      'screen': 'Screen Time',
      'stress': 'Stress',
      'alcohol': 'Alcohol',
      'food': 'Late Meal',
      'noise': 'Noise',
      'temperature': 'Temperature'
    };
    
    return factorMap[factorId] || factorId;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Moon className="h-10 w-10 text-primary/40 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading sleep data...</p>
        </div>
      </div>
    );
  }

  if (!sleepLogs || sleepLogs.length === 0) {
    return (
      <div className="text-center py-8">
        <Moon className="h-12 w-12 text-primary/40 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No sleep data yet</h3>
        <p className="text-muted-foreground mb-4">
          Start tracking your sleep to see metrics and insights
        </p>
        <Button onClick={() => navigate("/app/sleep-tracking")}>
          Track Your Sleep
        </Button>
      </div>
    );
  }

  const avgDuration = calculateAverageSleepDuration();
  const avgQuality = calculateAverageSleepQuality();
  const consistencyScore = calculateConsistencyScore();
  const mostCommonFactor = getMostCommonFactor();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="chart">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Average Duration</div>
                    <div className="text-2xl font-bold">
                      {formatDuration(avgDuration)}
                    </div>
                  </div>
                </div>
                <Progress 
                  value={Math.min((avgDuration / 480) * 100, 100)} 
                  className="h-2" 
                />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>6h</span>
                  <span>8h</span>
                  <span>10h</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Moon className="h-5 w-5 text-indigo-500" />
                  <div>
                    <div className="font-medium">Average Quality</div>
                    <div className="text-2xl font-bold">
                      {avgQuality}/5
                    </div>
                  </div>
                </div>
                <Progress 
                  value={(Number(avgQuality) / 5) * 100} 
                  className="h-2" 
                />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Poor</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">Sleep Consistency</div>
                    <div className="text-2xl font-bold">
                      {consistencyScore}%
                    </div>
                  </div>
                </div>
                <Progress 
                  value={consistencyScore} 
                  className="h-2" 
                />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Irregular</span>
                  <span>Moderate</span>
                  <span>Consistent</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="font-medium">Most Common Factor</div>
                    <div className="text-lg font-semibold mt-1">
                      {getReadableFactor(mostCommonFactor)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      That affected your sleep quality
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="chart">
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Sleep Patterns</h3>
              <div className="flex gap-2">
                <Button
                  variant={timeRange === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("week")}
                >
                  Week
                </Button>
                <Button
                  variant={timeRange === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("month")}
                >
                  Month
                </Button>
              </div>
            </div>
            <div className="h-64">
              <SleepChart data={sleepLogs} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate("/app/sleep-tracking")}
        >
          <TrendingUp className="h-4 w-4" />
          Track Your Sleep
        </Button>
      </div>
    </div>
  );
}
