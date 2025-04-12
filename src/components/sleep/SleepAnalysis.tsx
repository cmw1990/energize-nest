
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format, parseISO, subDays } from "date-fns";
import { Brain, Battery, Zap, Coffee, Wine, Smartphone } from "lucide-react";

export function SleepAnalysis() {
  const { session } = useAuth();
  
  const { data: sleepLogs } = useQuery({
    queryKey: ['sleep-analysis'],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const startDate = format(subDays(new Date(), 30), "yyyy-MM-dd");
      
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

  const calculateFactorImpact = (factorId: string) => {
    if (!sleepLogs || sleepLogs.length === 0) return { impact: 0, count: 0 };
    
    const logsWithFactor = sleepLogs.filter(log => 
      log.factors && Array.isArray(log.factors) && log.factors.includes(factorId)
    );
    
    if (logsWithFactor.length === 0) return { impact: 0, count: 0 };
    
    const logsWithoutFactor = sleepLogs.filter(log => 
      !log.factors || !Array.isArray(log.factors) || !log.factors.includes(factorId)
    );
    
    if (logsWithoutFactor.length === 0) return { impact: 0, count: logsWithFactor.length };
    
    const avgQualityWithFactor = logsWithFactor.reduce((sum, log) => sum + log.sleep_quality, 0) / logsWithFactor.length;
    const avgQualityWithoutFactor = logsWithoutFactor.reduce((sum, log) => sum + log.sleep_quality, 0) / logsWithoutFactor.length;
    
    // Calculate the impact (negative or positive)
    // Negative value means the factor reduces sleep quality
    const impact = avgQualityWithFactor - avgQualityWithoutFactor;
    
    return { 
      impact: parseFloat(impact.toFixed(1)), 
      count: logsWithFactor.length 
    };
  };

  const getIdealBedtime = () => {
    if (!sleepLogs || sleepLogs.length < 5) return "Not enough data";
    
    // Get only logs with good sleep quality (4 or 5)
    const goodSleepLogs = sleepLogs.filter(log => log.sleep_quality >= 4);
    
    if (goodSleepLogs.length < 3) return "Need more good sleep data";
    
    // Convert bedtimes to minutes since midnight
    const bedtimes = goodSleepLogs.map(log => {
      const [hours, minutes] = log.bedtime.split(':').map(Number);
      // Adjust for bedtimes after midnight
      return hours >= 12 ? (hours * 60 + minutes) : ((hours + 24) * 60 + minutes);
    });
    
    // Find the average
    const avgBedtimeMinutes = bedtimes.reduce((sum, time) => sum + time, 0) / bedtimes.length;
    
    // Convert back to hours:minutes format
    const adjustedHours = Math.floor(avgBedtimeMinutes / 60) % 24;
    const adjustedMinutes = Math.round(avgBedtimeMinutes % 60);
    
    return `${String(adjustedHours).padStart(2, '0')}:${String(adjustedMinutes).padStart(2, '0')}`;
  };

  const getIdealSleepDuration = () => {
    if (!sleepLogs || sleepLogs.length < 5) return "Not enough data";
    
    // Get only logs with good sleep quality (4 or 5)
    const goodSleepLogs = sleepLogs.filter(log => log.sleep_quality >= 4);
    
    if (goodSleepLogs.length < 3) return "Need more good sleep data";
    
    // Calculate average duration for good sleep
    const avgDuration = goodSleepLogs.reduce((sum, log) => sum + log.duration_minutes, 0) / goodSleepLogs.length;
    
    const hours = Math.floor(avgDuration / 60);
    const minutes = Math.round(avgDuration % 60);
    
    return `${hours}h ${minutes}m`;
  };

  const caffeine = calculateFactorImpact('caffeine');
  const alcohol = calculateFactorImpact('alcohol');
  const screen = calculateFactorImpact('screen');
  const stress = calculateFactorImpact('stress');
  const idealBedtime = getIdealBedtime();
  const idealDuration = getIdealSleepDuration();

  const impactToVisualValue = (impact: number) => {
    // Convert impact scale from -5 to 5 to 0 to 100 for progress bar
    // Negative impact means worse sleep quality
    return 50 - (impact * 10);
  };

  if (!sleepLogs || sleepLogs.length === 0) {
    return (
      <div className="text-center py-8">
        <Brain className="h-12 w-12 text-primary/40 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No sleep analysis yet</h3>
        <p className="text-muted-foreground">
          Track your sleep for at least a week to see analysis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-medium flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-purple-500" />
            Your Sleep Insights
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm font-medium mb-1">Ideal Bedtime</div>
                  <div className="text-xl font-bold">{idealBedtime}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Based on your best sleep quality
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm font-medium mb-1">Ideal Duration</div>
                  <div className="text-xl font-bold">{idealDuration}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    For optimal rest quality
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Sleep Quality Impact Factors</h4>
              
              <div className="space-y-4">
                {caffeine.count > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Coffee className="h-4 w-4 text-amber-600" />
                        <span className="text-sm">Caffeine</span>
                      </div>
                      <span className={`text-sm font-medium ${caffeine.impact < 0 ? 'text-red-500' : caffeine.impact > 0 ? 'text-green-500' : ''}`}>
                        {caffeine.impact > 0 ? '+' : ''}{caffeine.impact}
                      </span>
                    </div>
                    <Progress value={impactToVisualValue(caffeine.impact)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Negative</span>
                      <span>Neutral</span>
                      <span>Positive</span>
                    </div>
                  </div>
                )}
                
                {alcohol.count > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Wine className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Alcohol</span>
                      </div>
                      <span className={`text-sm font-medium ${alcohol.impact < 0 ? 'text-red-500' : alcohol.impact > 0 ? 'text-green-500' : ''}`}>
                        {alcohol.impact > 0 ? '+' : ''}{alcohol.impact}
                      </span>
                    </div>
                    <Progress value={impactToVisualValue(alcohol.impact)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Negative</span>
                      <span>Neutral</span>
                      <span>Positive</span>
                    </div>
                  </div>
                )}
                
                {screen.count > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Screen Time</span>
                      </div>
                      <span className={`text-sm font-medium ${screen.impact < 0 ? 'text-red-500' : screen.impact > 0 ? 'text-green-500' : ''}`}>
                        {screen.impact > 0 ? '+' : ''}{screen.impact}
                      </span>
                    </div>
                    <Progress value={impactToVisualValue(screen.impact)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Negative</span>
                      <span>Neutral</span>
                      <span>Positive</span>
                    </div>
                  </div>
                )}
                
                {stress.count > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Stress</span>
                      </div>
                      <span className={`text-sm font-medium ${stress.impact < 0 ? 'text-red-500' : stress.impact > 0 ? 'text-green-500' : ''}`}>
                        {stress.impact > 0 ? '+' : ''}{stress.impact}
                      </span>
                    </div>
                    <Progress value={impactToVisualValue(stress.impact)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Negative</span>
                      <span>Neutral</span>
                      <span>Positive</span>
                    </div>
                  </div>
                )}
              </div>
              
              {(caffeine.count === 0 && alcohol.count === 0 && screen.count === 0 && stress.count === 0) && (
                <div className="text-center py-2 text-sm text-muted-foreground">
                  Log more sleep factors to see their impact
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
