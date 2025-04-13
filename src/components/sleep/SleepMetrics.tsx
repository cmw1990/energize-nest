import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Zap, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { format, startOfWeek, endOfWeek, subDays } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatValue } from "@/utils/formatUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SleepEntry {
  id: string;
  date: string;
  sleep_quality: number;
  bedtime: string;
  wake_time: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface SleepMetricsProps {
  userId: string | undefined;
}

export const SleepMetrics: React.FC<SleepMetricsProps> = ({ userId }) => {
  const { session } = useAuth();

  const getWeekRange = () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Assuming Monday is the start of the week
    const end = endOfWeek(today, { weekStartsOn: 1 });
    return { start, end };
  };

  const { start, end } = getWeekRange();
  const startDate = format(start, 'yyyy-MM-dd');
  const endDate = format(end, 'yyyy-MM-dd');

  const { data: weeklySleepData, isLoading: isWeeklySleepDataLoading } = useQuery({
    queryKey: ['weekly-sleep-data', userId, startDate, endDate],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('sleep_tracking')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) {
        console.error("Error fetching weekly sleep data:", error);
        return null;
      }

      return data as SleepEntry[];
    },
    enabled: !!userId,
  });

  const { data: sleepQualityData, isLoading: isSleepQualityDataLoading } = useQuery({
    queryKey: ['sleep-quality-data', userId],
    queryFn: async () => {
      if (!userId) return null;

      const today = new Date();
      const last30Days = subDays(today, 30);
      const startDate = format(last30Days, 'yyyy-MM-dd');
      const endDate = format(today, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('sleep_tracking')
        .select('sleep_quality')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) {
        console.error("Error fetching sleep quality data:", error);
        return null;
      }

      const sleepQualities = data?.map(item => item.sleep_quality) || [];
      const totalQuality = sleepQualities.reduce((sum, quality) => sum + quality, 0);
      const averageQuality = sleepQualities.length > 0 ? totalQuality / sleepQualities.length : 0;

      return {
        averageQuality: averageQuality,
      };
    },
    enabled: !!userId,
  });

  const weeklySleepChartData = {
    labels: weeklySleepData?.map(entry => format(new Date(entry.date), 'EEE')) || [],
    datasets: [
      {
        label: 'Sleep Quality',
        data: weeklySleepData?.map(entry => entry.sleep_quality) || [],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: 'Weekly Sleep Quality',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/10 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Weekly Sleep Quality</span>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{startDate} - {endDate}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isWeeklySleepDataLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Loading sleep data...</p>
            </div>
          ) : weeklySleepData?.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">No sleep data recorded this week.</p>
            </div>
          ) : (
            <Line options={chartOptions} data={weeklySleepChartData} />
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/10 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Average Sleep Quality (Last 30 Days)</span>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Past 30 Days</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSleepQualityDataLoading ? (
            <div className="flex items-center justify-center h-24">
              <p className="text-muted-foreground">Loading average sleep quality...</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-24">
              <Zap className="h-6 w-6 mr-2 text-yellow-500" />
              <span className="text-3xl">
                {formatValue(sleepQualityData?.averageQuality, 1)}
              </span>
              <span className="text-xl text-muted-foreground ml-1">/ 5</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/10 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-500" />
            Insights and Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Consistency is Key:</strong> Try to go to bed and wake up at the same time every day, even on weekends.
            </li>
            <li>
              <strong>Create a Relaxing Bedtime Routine:</strong> This could include reading a book, taking a warm bath, or practicing relaxation techniques.
            </li>
            <li>
              <strong>Optimize Your Sleep Environment:</strong> Make sure your bedroom is dark, quiet, and cool.
            </li>
            <li>
              <strong>Limit Screen Time Before Bed:</strong> The blue light emitted from screens can interfere with your body's natural sleep-wake cycle.
            </li>
            <li>
              <strong>Watch Your Diet and Exercise:</strong> Avoid heavy meals, caffeine, and alcohol close to bedtime. Regular physical activity can improve sleep, but avoid intense workouts close to bedtime.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
