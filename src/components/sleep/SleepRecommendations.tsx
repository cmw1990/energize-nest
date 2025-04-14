import React, { useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, AlertTriangle, CheckCircle, Moon, Sun, Activity, Coffee, Wine, TrendingUp, Clock, Brain, Briefcase, BedDouble, Repeat } from "lucide-react"; // Added BedDouble, Repeat
import { useAuth } from '@/components/AuthProvider';
import { format, subDays, parseISO, isValid } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { formatValue, formatPercentage, formatMinutesToHoursMinutes, calculateStandardDeviation } from '@/lib/utils'; // Added calculateStandardDeviation
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


// Interface matching our enhanced sleep_logs table
interface SleepLog {
  id?: string;
  user_id?: string;
  date: string;
  bed_time?: string | null;
  wake_time?: string | null;
  sleep_duration_minutes?: number | null;
  sleep_quality?: number | null;
  deep_sleep_percentage?: number | null;
  rem_sleep_percentage?: number | null;
  light_sleep_percentage?: number | null;
  awake_sleep_percentage?: number | null;
  total_sleep_cycles?: number | null;
  time_to_fall_asleep?: number | null;
  night_wakings?: number | null;
  sleep_efficiency?: number | null;
  sleep_disruptions?: string[] | null;
  caffeine_mg?: number | null;
  alcohol_drinks?: number | null;
  exercise_minutes?: number | null;
  stress_level?: number | null;
  mood_rating?: number | null;
  screen_time_minutes?: number | null;
  sleep_factors?: string[] | null;
  room_temperature?: number | null;
  room_brightness?: number | null;
  room_noise_level?: number | null;
  recovery_score?: number | null;
  is_night_shift_sleep?: boolean | null; // Added night shift flag
  created_at?: string;
}

interface SleepAverages {
  avgDurationMinutes: number;
  avgQuality: number;
  avgTimeToFallAsleep: number;
  avgEfficiency: number;
  avgDeepPercent: number;
  avgRemPercent: number;
  avgNightWakings: number;
  avgSleepCycles: number;
  avgCaffeine: number;
  avgAlcohol: number;
  avgExercise: number;
  avgStress: number;
  avgMood: number;
  avgScreenTime: number;
  avgRoomTemp: number;
  avgBrightness: number;
  avgNoiseLevel: number;
  avgRecovery: number;
  commonDisruptions: string[];
  commonFactors: string[];
  isRecentNightShiftWorker: boolean; // Flag for night shift pattern
  count: number;
}

const genericRecommendations = [
  "Maintain a consistent sleep schedule, even on weekends.",
  "Create a relaxing bedtime routine (e.g., reading, warm bath).",
  "Ensure your bedroom is dark, quiet, and cool (15-19°C / 60-67°F).",
  "Avoid large meals, caffeine, and alcohol close to bedtime.",
  "Get regular exercise, but avoid intense workouts late in the evening.",
  "Limit exposure to bright screens (phones, tablets, computers) an hour before bed.",
  "Get natural sunlight exposure, especially in the morning.",
  "Practice relaxation techniques like deep breathing or meditation before bed.",
  "Consider using white noise or nature sounds if sensitive to noise.",
];

const nightShiftRecommendations = [
    { id: 'ns-dark', text: "Maximize darkness during daytime sleep. Use blackout curtains and eye masks.", icon: Moon, priority: 12 },
    { id: 'ns-schedule', text: "Try to maintain a consistent sleep schedule even on days off, or adjust gradually.", icon: Clock, priority: 11 },
    { id: 'ns-light', text: "Use bright light exposure upon waking (even if it's evening) to help reset your body clock.", icon: Sun, priority: 10 },
    { id: 'ns-caffeine', text: "Use caffeine strategically at the start of your shift, but avoid it within 6-8 hours of your intended sleep time.", icon: Coffee, priority: 9 },
    { id: 'ns-naps', text: "Consider short naps (20-30 min) before your shift or during breaks if possible and allowed.", icon: BedDouble, priority: 8 },
    { id: 'ns-environment', text: "Minimize noise during daytime sleep using earplugs or white noise.", icon: Activity, priority: 7 }, // Reusing Activity icon for noise/environment
];


const SleepRecommendations = () => {
  const { session } = useAuth();

  const { data: recentSleepData, isLoading, isError } = useQuery<SleepLog[]>({
    queryKey: ['sleep-recommendations-data', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('sleep_logs')
        .select('*') // Select all columns including is_night_shift_sleep
        .eq('user_id', session.user.id)
        .gte('date', startDate)
        .order('date', { ascending: false });

      if (error) {
        console.error("Error fetching recent sleep data:", error);
        throw error;
      }
      return (data || []) as SleepLog[];
    },
    enabled: !!session?.user?.id,
  });

  const personalizedRecommendations = useMemo(() => {
    const validData = (recentSleepData || []).filter(log =>
        log.sleep_duration_minutes !== null && log.sleep_quality !== null
    );

    // Check for night shift pattern (e.g., if at least one log in the period is marked)
    const isRecentNightShiftWorker = validData.some(log => log.is_night_shift_sleep === true);

    if (validData.length < 3) {
      let baseRecs = genericRecommendations.slice(0, 5).map((text, index) => ({
        id: `gen-${index}`, text, icon: Lightbulb, priority: 1
      }));
       // Add night shift tips even with limited data if applicable
       if (isRecentNightShiftWorker) {
           baseRecs = [...nightShiftRecommendations.slice(0, 2), ...baseRecs].slice(0, 5); // Add top 2 NS tips
       }
      return baseRecs;
    }

    // Calculate averages
    const averages: SleepAverages = {
      avgDurationMinutes: 0, avgQuality: 0, avgTimeToFallAsleep: 0, avgEfficiency: 0,
      avgDeepPercent: 0, avgRemPercent: 0, avgNightWakings: 0, avgSleepCycles: 0,
      avgCaffeine: 0, avgAlcohol: 0, avgExercise: 0, avgStress: 0, avgMood: 0,
      avgScreenTime: 0, avgRoomTemp: 20, avgBrightness: 0, avgNoiseLevel: 0, avgRecovery: 0,
      commonDisruptions: [], commonFactors: [], isRecentNightShiftWorker: isRecentNightShiftWorker, count: 0
    };
    const counts: { [K in keyof Omit<SleepAverages, 'commonDisruptions' | 'commonFactors' | 'isRecentNightShiftWorker' | 'count'>]?: number } = {};

    const disruptionCount: { [key: string]: number } = {};
    const factorCount: { [key: string]: number } = {};

    validData.forEach(log => {
      averages.count += 1;
      Object.keys(averages).forEach(key => {
          let logKey = key.replace('avg', '');
          logKey = logKey.charAt(0).toLowerCase() + logKey.slice(1);
          logKey = logKey.replace(/([A-Z])/g, '_$1').toLowerCase();
          logKey = logKey.replace('percent', 'percentage');
          if (logKey === 'duration_minutes') logKey = 'sleep_duration_minutes';
          if (logKey === 'quality') logKey = 'sleep_quality';
          if (logKey === 'time_to_fall_asleep') logKey = 'time_to_fall_asleep';
          if (logKey === 'efficiency') logKey = 'sleep_efficiency';
          if (logKey === 'night_wakings') logKey = 'night_wakings';
          if (logKey === 'sleep_cycles') logKey = 'total_sleep_cycles';
          if (logKey === 'caffeine') logKey = 'caffeine_mg';
          if (logKey === 'alcohol') logKey = 'alcohol_drinks';
          if (logKey === 'exercise') logKey = 'exercise_minutes';
          if (logKey === 'stress') logKey = 'stress_level';
          if (logKey === 'mood') logKey = 'mood_rating';
          if (logKey === 'screen_time') logKey = 'screen_time_minutes';
          if (logKey === 'room_temp') logKey = 'room_temperature';
          if (logKey === 'brightness') logKey = 'room_brightness';
          if (logKey === 'noise_level') logKey = 'room_noise_level';
          if (logKey === 'recovery') logKey = 'recovery_score';

          const value = (log as any)[logKey];
          if (typeof value === 'number' && !isNaN(value)) {
              (averages as any)[key] += value;
              counts[key as keyof typeof counts] = (counts[key as keyof typeof counts] || 0) + 1;
          }
      });

      log.sleep_disruptions?.forEach(d => { disruptionCount[d] = (disruptionCount[d] || 0) + 1; });
      log.sleep_factors?.forEach(f => { factorCount[f] = (factorCount[f] || 0) + 1; });
    });

    Object.keys(averages).forEach(key => {
      const k = key as keyof SleepAverages;
      if (k !== 'count' && k !== 'commonDisruptions' && k !== 'commonFactors' && k !== 'isRecentNightShiftWorker' && (counts[k as keyof typeof counts] ?? 0) > 0) {
        (averages as any)[k] /= counts[k as keyof typeof counts]!;
      }
    });

    averages.commonDisruptions = Object.entries(disruptionCount).sort(([,a], [,b]) => b - a).map(([key]) => key).slice(0, 3);
    averages.commonFactors = Object.entries(factorCount).sort(([,a], [,b]) => b - a).map(([key]) => key).slice(0, 3);

    let recommendations: { id: string; text: string; icon: React.ElementType; priority: number }[] = [];

    // Add night shift recommendations first if applicable
    if (averages.isRecentNightShiftWorker) {
        recommendations = [...nightShiftRecommendations];
    }

    // --- Generate Standard Recommendations Based on Averages ---
    if (averages.avgDurationMinutes < 420) {
      recommendations.push({ id: 'duration', text: `Your average sleep duration is ${formatMinutesToHoursMinutes(averages.avgDurationMinutes)}. Aim for 7-9 hours. Try adjusting your schedule.`, icon: Moon, priority: 10 });
    } else if (averages.avgDurationMinutes > 600) {
       recommendations.push({ id: 'duration_long', text: `Your average sleep duration is ${formatMinutesToHoursMinutes(averages.avgDurationMinutes)}. Ensure you're getting quality sleep, not just quantity.`, icon: Moon, priority: 5 });
    }

    if (averages.avgEfficiency < 85) {
      recommendations.push({ id: 'efficiency', text: `Your sleep efficiency is ${formatPercentage(averages.avgEfficiency, 0)}. Aim for 85%+. Try getting out of bed if you can't sleep after 20 minutes.`, icon: Activity, priority: 9 });
    }

    if (averages.avgQuality < 6) {
      recommendations.push({ id: 'quality_low', text: `Your average sleep quality rating is ${formatValue(averages.avgQuality, 1)}/10. Focus on improving sleep hygiene factors.`, icon: AlertTriangle, priority: 8 });
    }

    if (counts.avgRecovery && averages.avgRecovery < 65) {
       recommendations.push({ id: 'recovery_low', text: `Your average morning recovery score is ${formatValue(averages.avgRecovery, 0)}. Prioritizing sleep quality and duration may help.`, icon: TrendingUp, priority: 7 });
    }

    if (counts.avgTimeToFallAsleep && averages.avgTimeToFallAsleep > 30) {
        recommendations.push({ id: 'fall_asleep', text: `It takes you an average of ${formatValue(averages.avgTimeToFallAsleep, 0)} min to fall asleep. Try a relaxing wind-down routine.`, icon: Clock, priority: 6 });
    }

    if (counts.avgNightWakings && averages.avgNightWakings > 1) {
        recommendations.push({ id: 'wakings', text: `You wake up an average of ${formatValue(averages.avgNightWakings, 1)} times per night. Avoid fluids before bed and ensure room comfort.`, icon: AlertTriangle, priority: 6 });
    }

    if (counts.avgDeepPercent && averages.avgDeepPercent < 15) {
        recommendations.push({ id: 'deep_sleep', text: `Your average deep sleep is ${formatPercentage(averages.avgDeepPercent, 0)}. Consider reducing stress and avoiding alcohol.`, icon: Brain, priority: 5 });
    }
     if (counts.avgRemPercent && averages.avgRemPercent < 20) {
        recommendations.push({ id: 'rem_sleep', text: `Your average REM sleep is ${formatPercentage(averages.avgRemPercent, 0)}. Ensure sufficient total sleep time and manage stress.`, icon: Brain, priority: 4 });
    }

    if (counts.avgRoomTemp && (averages.avgRoomTemp < 15 || averages.avgRoomTemp > 20)) {
      recommendations.push({ id: 'temperature', text: `Your average room temperature is ${formatValue(averages.avgRoomTemp, 1)}°C. Ideal range is 15-19°C (60-67°F).`, icon: Sun, priority: 5 });
    }
    if (counts.avgBrightness && averages.avgBrightness > 2) {
      recommendations.push({ id: 'brightness', text: `Your room brightness level (avg ${formatValue(averages.avgBrightness, 0)}/5) seems high. Try blackout curtains/eye mask.`, icon: Sun, priority: 4 });
    }
     if (counts.avgNoiseLevel && averages.avgNoiseLevel > 2) {
      recommendations.push({ id: 'noise', text: `Your room noise level (avg ${formatValue(averages.avgNoiseLevel, 0)}/5) seems high. Consider earplugs/white noise.`, icon: Activity, priority: 4 });
    }

    if (counts.avgCaffeine && averages.avgCaffeine > 100) {
      recommendations.push({ id: 'caffeine', text: `Your average caffeine intake is ${formatValue(averages.avgCaffeine, 0)}mg. Avoid caffeine 6-8 hours before bed.`, icon: Coffee, priority: 5 });
    }
    if (counts.avgAlcohol && averages.avgAlcohol > 0.5) {
      recommendations.push({ id: 'alcohol', text: `Your average alcohol intake is ${formatValue(averages.avgAlcohol, 1)} drinks. Alcohol disrupts sleep quality. Reduce intake, especially near bedtime.`, icon: Wine, priority: 5 });
    }
    if (counts.avgScreenTime && averages.avgScreenTime > 60) {
      recommendations.push({ id: 'screen-time', text: `You average ${formatMinutesToHoursMinutes(averages.avgScreenTime)} of screen time before bed. Try a 'digital sunset' 1-2 hours before bed.`, icon: AlertTriangle, priority: 4 });
    }
     if (counts.avgStress && averages.avgStress > 6) {
      recommendations.push({ id: 'stress', text: `Your average stress level is ${formatValue(averages.avgStress, 1)}/10. High stress impacts sleep. Explore relaxation techniques.`, icon: Brain, priority: 7 });
    }

    // Add positive reinforcement if few issues and not night shift
    if (recommendations.filter(r => !r.id.startsWith('ns-')).length === 0 && !averages.isRecentNightShiftWorker && averages.avgDurationMinutes >= 420 && averages.avgEfficiency >= 85 && averages.avgQuality >= 7) {
         recommendations.push({ id: 'positive', text: `Your sleep habits seem consistent and healthy! Keep up the great work.`, icon: CheckCircle, priority: 10 });
    }

    // Add generic ones if needed, avoiding duplicates
    const existingRecTexts = new Set(recommendations.map(r => r.text.substring(0, 30))); // Check beginning of text for similarity
    if (recommendations.length < 5) {
      const genericToAdd = genericRecommendations
        .filter(genRec => !existingRecTexts.has(genRec.substring(0, 30)))
        .slice(0, 5 - recommendations.length)
        .map((text, index) => ({
          id: `gen-${recommendations.length + index}`,
          text,
          icon: Lightbulb,
          priority: 1 - index
        }));
      recommendations = recommendations.concat(genericToAdd);
    }

    // Ensure night shift tips are prioritized if applicable, then sort others
    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5); // Show top 5 overall

  }, [recentSleepData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Sleep Insights & Recommendations
        </CardTitle>
        <CardDescription>
          Personalized tips based on your sleep data from the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : isError ? (
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>Could not load recommendations.</span>
          </div>
        ) : personalizedRecommendations.length > 0 ? (
          <ul className="space-y-3">
            {personalizedRecommendations.map((rec) => (
              <li key={rec.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted/80 transition-colors">
                <div className="mt-1 flex-shrink-0">
                  <rec.icon className={`h-5 w-5 ${rec.id.startsWith('ns-') ? 'text-blue-500' : 'text-primary'}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{rec.text}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Track your sleep for a few more days to receive personalized recommendations!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SleepRecommendations;
