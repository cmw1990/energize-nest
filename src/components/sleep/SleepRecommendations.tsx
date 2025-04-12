
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, Coffee, Leaf, Wind, Bed, Clock } from "lucide-react";
import { subDays, format } from "date-fns";

export function SleepRecommendations() {
  const { session } = useAuth();
  
  const { data: sleepData } = useQuery({
    queryKey: ['sleep-recommendations'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const startDate = format(subDays(new Date(), 14), "yyyy-MM-dd");
      
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
  
  const generateRecommendations = () => {
    if (!sleepData || sleepData.length === 0) {
      return getDefaultRecommendations();
    }
    
    const recommendations = [];
    
    // Calculate average sleep duration
    const avgDuration = sleepData.reduce((sum, log) => sum + (log.duration_minutes || 0), 0) / sleepData.length;
    
    // Calculate average sleep quality
    const avgQuality = sleepData.reduce((sum, log) => sum + (log.sleep_quality || 0), 0) / sleepData.length;
    
    // Check if user has consistency issues
    const bedtimes = sleepData.map(log => {
      const [hours, minutes] = log.bedtime.split(':').map(Number);
      return hours * 60 + minutes;
    });
    
    const waketimes = sleepData.map(log => {
      const [hours, minutes] = log.wake_time.split(':').map(Number);
      return hours * 60 + minutes;
    });
    
    const bedtimeStdDev = calculateStandardDeviation(bedtimes);
    const waketimeStdDev = calculateStandardDeviation(waketimes);
    
    // Check for common factors
    const factors: Record<string, number> = {};
    sleepData.forEach(log => {
      if (log.factors && Array.isArray(log.factors)) {
        log.factors.forEach(factor => {
          factors[factor] = (factors[factor] || 0) + 1;
        });
      }
    });
    
    // Sleep duration recommendations
    if (avgDuration < 420) { // Less than 7 hours
      recommendations.push({
        icon: Clock,
        title: "Increase Sleep Duration",
        description: "You're averaging less than 7 hours of sleep. Try to extend your sleep by 30 minutes.",
        color: "text-blue-500",
      });
    }
    
    // Sleep consistency recommendations
    if (bedtimeStdDev > 60 || waketimeStdDev > 60) { // More than 1 hour variation
      recommendations.push({
        icon: Clock,
        title: "Improve Sleep Consistency",
        description: "Your sleep and wake times vary significantly. Try to maintain a consistent schedule.",
        color: "text-indigo-500",
      });
    }
    
    // Factor-based recommendations
    if (factors['caffeine'] && factors['caffeine'] > sleepData.length * 0.3) {
      recommendations.push({
        icon: Coffee,
        title: "Reduce Caffeine Intake",
        description: "Caffeine appears to affect your sleep. Try avoiding it at least 8 hours before bedtime.",
        color: "text-amber-600",
      });
    }
    
    if (factors['screen'] && factors['screen'] > sleepData.length * 0.3) {
      recommendations.push({
        icon: Sun,
        title: "Limit Evening Screen Time",
        description: "Screen usage before bed may be impacting your sleep. Try a digital sunset 1-2 hours before bed.",
        color: "text-blue-500",
      });
    }
    
    if (factors['stress'] && factors['stress'] > sleepData.length * 0.3) {
      recommendations.push({
        icon: Wind,
        title: "Pre-Sleep Relaxation",
        description: "Stress is affecting your sleep. Try meditation or deep breathing before bed.",
        color: "text-purple-500",
      });
    }
    
    if (factors['noise'] && factors['noise'] > sleepData.length * 0.3) {
      recommendations.push({
        icon: Leaf,
        title: "Optimize Your Sleep Environment",
        description: "Noise disrupts your sleep. Try using earplugs or a white noise machine.",
        color: "text-green-500",
      });
    }
    
    // If we still don't have enough recommendations, add some general ones
    if (recommendations.length < 3) {
      const defaultRecs = getDefaultRecommendations();
      for (let i = 0; i < defaultRecs.length && recommendations.length < 4; i++) {
        // Make sure we don't add duplicates
        if (!recommendations.some(rec => rec.title === defaultRecs[i].title)) {
          recommendations.push(defaultRecs[i]);
        }
      }
    }
    
    return recommendations.slice(0, 4); // Return at most 4 recommendations
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
  
  const getDefaultRecommendations = () => {
    return [
      {
        icon: Moon,
        title: "Create a Sleep Sanctuary",
        description: "Make your bedroom cool, dark, and quiet for optimal sleep conditions.",
        color: "text-indigo-500",
      },
      {
        icon: Clock,
        title: "Consistent Schedule",
        description: "Go to bed and wake up at the same time every day, even on weekends.",
        color: "text-blue-500",
      },
      {
        icon: Sun,
        title: "Morning Light Exposure",
        description: "Get 10-30 minutes of sunlight soon after waking to regulate your body clock.",
        color: "text-amber-600",
      },
      {
        icon: Coffee,
        title: "Caffeine Curfew",
        description: "Avoid caffeine at least 8 hours before bedtime to prevent sleep disruption.",
        color: "text-amber-800",
      },
      {
        icon: Leaf,
        title: "Evening Wind-Down",
        description: "Create a relaxing pre-bed routine to signal your body it's time for sleep.",
        color: "text-green-500",
      },
      {
        icon: Wind,
        title: "Breathwork for Sleep",
        description: "Try 4-7-8 breathing before bed: inhale for 4, hold for 7, exhale for 8 counts.",
        color: "text-purple-500",
      },
    ];
  };
  
  const recommendations = generateRecommendations();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bed className="h-5 w-5 text-primary" />
          Sleep Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="rounded-full p-2 bg-muted flex items-center justify-center">
                <recommendation.icon className={`h-4 w-4 ${recommendation.color}`} />
              </div>
              <div>
                <h3 className="font-medium">{recommendation.title}</h3>
                <p className="text-sm text-muted-foreground">{recommendation.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
