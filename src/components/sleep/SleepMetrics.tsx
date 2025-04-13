
import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { formatValue, formatPercentage } from '@/utils/formatUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Activity, Zap, Clock, ArrowUp, ArrowDown, Calendar } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SleepData {
  id?: string;
  user_id?: string;
  date: string;
  sleepDuration: number;
  deepSleepPercentage: number;
  remSleepPercentage: number;
  lightSleepPercentage: number;
  sleepScore: number;
  sleepOnset: number;
  wakeups: number;
  efficiency: number;
  created_at?: string;
}

export const SleepMetrics: React.FC = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Get current date range based on selection
  const getDateRange = () => {
    const today = new Date();
    
    if (timeRange === 'week') {
      return {
        start: startOfWeek(today),
        end: today
      };
    } else if (timeRange === 'month') {
      return {
        start: subDays(today, 30),
        end: today
      };
    } else {
      return {
        start: subDays(today, 365),
        end: today
      };
    }
  };

  const { start, end } = getDateRange();

  // Fetch sleep data from Supabase
  const { data: sleepData, isLoading, isError } = useQuery({
    queryKey: ['sleep-metrics', session?.user?.id, timeRange],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('date', format(start, 'yyyy-MM-dd'))
        .lte('date', format(end, 'yyyy-MM-dd'))
        .order('date', { ascending: true });

      if (error) {
        throw error;
      }

      // If there's no data or very few records, return sample data for demonstration
      if (!data || data.length < 3) {
        return generateSampleData();
      }

      // Transform data to match our SleepData interface
      return data.map(item => ({
        date: format(parseISO(item.date), 'EEE'),
        sleepDuration: item.sleep_duration || 0,
        deepSleepPercentage: item.deep_sleep_percentage || 0,
        remSleepPercentage: item.rem_sleep_percentage || 0,
        lightSleepPercentage: item.light_sleep_percentage || 0,
        sleepScore: item.sleep_score || 0,
        sleepOnset: item.sleep_onset_minutes || 0,
        wakeups: item.wakeups || 0,
        efficiency: item.efficiency_percentage || 0,
        id: item.id,
        user_id: item.user_id,
        created_at: item.created_at
      }));
    },
    enabled: !!session?.user?.id
  });

  // Generate sample data for demonstration or when real data is not available
  const generateSampleData = (): SleepData[] => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      date: day,
      sleepDuration: 6 + Math.random() * 3, // 6-9 hours
      deepSleepPercentage: 15 + Math.random() * 15, // 15-30%
      remSleepPercentage: 15 + Math.random() * 10, // 15-25%
      lightSleepPercentage: 50 + Math.random() * 20, // 50-70%
      sleepScore: 70 + Math.random() * 30, // 70-100
      sleepOnset: 5 + Math.random() * 25, // 5-30 minutes
      wakeups: Math.floor(Math.random() * 4), // 0-3 wakeups
      efficiency: 85 + Math.random() * 15 // 85-100%
    }));
  };

  const weekData: SleepData[] = sleepData || [];

  // Calculate averages from real data
  const calculateAverages = () => {
    if (!weekData || weekData.length === 0) {
      return {
        avgSleepDuration: 0,
        avgDeepSleep: 0,
        avgRemSleep: 0,
        avgLightSleep: 0,
        avgSleepScore: 0,
        avgSleepOnset: 0,
        avgWakeups: 0,
        avgEfficiency: 0
      };
    }

    return {
      avgSleepDuration: weekData.reduce((sum, day) => sum + day.sleepDuration, 0) / weekData.length,
      avgDeepSleep: weekData.reduce((sum, day) => sum + day.deepSleepPercentage, 0) / weekData.length,
      avgRemSleep: weekData.reduce((sum, day) => sum + day.remSleepPercentage, 0) / weekData.length,
      avgLightSleep: weekData.reduce((sum, day) => sum + day.lightSleepPercentage, 0) / weekData.length,
      avgSleepScore: weekData.reduce((sum, day) => sum + day.sleepScore, 0) / weekData.length,
      avgSleepOnset: weekData.reduce((sum, day) => sum + day.sleepOnset, 0) / weekData.length,
      avgWakeups: weekData.reduce((sum, day) => sum + day.wakeups, 0) / weekData.length,
      avgEfficiency: weekData.reduce((sum, day) => sum + day.efficiency, 0) / weekData.length
    };
  };

  const {
    avgSleepDuration,
    avgDeepSleep,
    avgRemSleep,
    avgLightSleep,
    avgSleepScore,
    avgSleepOnset,
    avgWakeups,
    avgEfficiency
  } = calculateAverages();

  // Find trends (comparing latest to first)
  const calculateTrends = () => {
    if (!weekData || weekData.length < 2) {
      return {
        sleepDurationTrend: 0,
        sleepScoreTrend: 0
      };
    }

    return {
      sleepDurationTrend: weekData[weekData.length - 1].sleepDuration - weekData[0].sleepDuration,
      sleepScoreTrend: weekData[weekData.length - 1].sleepScore - weekData[0].sleepScore
    };
  };

  const { sleepDurationTrend, sleepScoreTrend } = calculateTrends();

  // Find the best day
  const findBestDay = () => {
    if (!weekData || weekData.length === 0) return null;
    return [...weekData].sort((a, b) => b.sleepScore - a.sleepScore)[0];
  };

  const bestDaySleep = findBestDay();

  // Chart data preparation
  const sleepDurationData = {
    labels: weekData.map(d => d.date),
    datasets: [
      {
        label: 'Sleep Duration (hours)',
        data: weekData.map(d => d.sleepDuration),
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 2,
        borderRadius: 5,
      }
    ]
  };

  // Sleep stages chart data
  const sleepStagesData = {
    labels: weekData.map(d => d.date),
    datasets: [
      {
        label: 'Deep Sleep',
        data: weekData.map(d => d.deepSleepPercentage),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'REM Sleep',
        data: weekData.map(d => d.remSleepPercentage),
        backgroundColor: 'rgba(147, 51, 234, 0.7)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
      {
        label: 'Light Sleep',
        data: weekData.map(d => d.lightSleepPercentage),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Sleep score chart data
  const sleepScoreData = {
    labels: weekData.map(d => d.date),
    datasets: [
      {
        label: 'Sleep Score',
        data: weekData.map(d => d.sleepScore),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        stacked: true,
        beginAtZero: true,
        max: 100,
        grid: {
          display: true,
          drawBorder: false,
        },
      },
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: 50,
        max: 100,
        grid: {
          display: true,
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Function to save/log manual sleep data
  const logManualSleepData = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to log sleep data",
        variant: "destructive"
      });
      return;
    }

    // This would be a form in a real implementation
    // For now, we'll just simulate adding a new record with today's date
    const today = new Date();
    const newEntry = {
      user_id: session.user.id,
      date: format(today, 'yyyy-MM-dd'),
      sleep_duration: 7.5, // Hours
      deep_sleep_percentage: 22,
      rem_sleep_percentage: 18,
      light_sleep_percentage: 60,
      sleep_score: 83,
      sleep_onset_minutes: 12,
      wakeups: 2,
      efficiency_percentage: 93
    };

    try {
      const { data, error } = await supabase
        .from('sleep_logs')
        .insert(newEntry)
        .select();

      if (error) throw error;

      toast({
        title: "Sleep data logged",
        description: "Your sleep data has been saved successfully.",
      });

      // Refetch the data to update the charts
      // This would be handled by React Query's invalidation in a complete implementation
    } catch (error) {
      console.error('Error logging sleep data:', error);
      toast({
        title: "Error logging sleep data",
        description: "There was a problem saving your sleep data.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value: 'week' | 'month' | 'year') => setTimeRange(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={logManualSleepData} size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          Log Sleep Data
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Key metrics cards */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Sleep Duration</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{formatValue(avgSleepDuration, 1)}h</p>
                )}
              </div>
              <Clock className="h-9 w-9 text-primary/60" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              {sleepDurationTrend >= 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={sleepDurationTrend >= 0 ? "text-green-500" : "text-red-500"}>
                {formatValue(Math.abs(sleepDurationTrend), 1)}h
              </span>
              <span className="text-muted-foreground ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Sleep Score</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{formatValue(avgSleepScore, 0)}</p>
                )}
              </div>
              <Activity className="h-9 w-9 text-primary/60" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              {sleepScoreTrend >= 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={sleepScoreTrend >= 0 ? "text-green-500" : "text-red-500"}>
                {formatValue(Math.abs(sleepScoreTrend), 0)} pts
              </span>
              <span className="text-muted-foreground ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Deep Sleep</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{formatPercentage(avgDeepSleep, 0)}</p>
                )}
              </div>
              <Moon className="h-9 w-9 text-primary/60" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-muted-foreground">Target: 20-25%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sleep Efficiency</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{formatPercentage(avgEfficiency, 0)}</p>
                )}
              </div>
              <Zap className="h-9 w-9 text-primary/60" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-muted-foreground">Target: &gt;90%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sleep Duration Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Sleep Duration</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[220px] flex items-center justify-center">
                <Skeleton className="h-[200px] w-full" />
              </div>
            ) : isError ? (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground">
                Error loading sleep data
              </div>
            ) : (
              <div className="h-[220px]">
                <Bar data={sleepDurationData} options={barOptions} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sleep Score Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Sleep Score</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[220px] flex items-center justify-center">
                <Skeleton className="h-[200px] w-full" />
              </div>
            ) : isError ? (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground">
                Error loading sleep data
              </div>
            ) : (
              <div className="h-[220px]">
                <Line data={sleepScoreData} options={lineOptions} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sleep Stages Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Sleep Stage Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[260px] flex items-center justify-center">
              <Skeleton className="h-[240px] w-full" />
            </div>
          ) : isError ? (
            <div className="h-[260px] flex items-center justify-center text-muted-foreground">
              Error loading sleep data
            </div>
          ) : (
            <div className="h-[260px]">
              <Bar data={sleepStagesData} options={stackedBarOptions} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sleep Insights */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Sleep Insights</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </>
          ) : (
            <>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Moon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Your best night</h4>
                  <p className="text-sm text-muted-foreground">
                    {bestDaySleep ? `${bestDaySleep.date} - ${formatValue(bestDaySleep.sleepDuration, 1)} hours with a sleep score of ${bestDaySleep.sleepScore}` : 'No data available'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Fall Asleep Time</h4>
                  <p className="text-sm text-muted-foreground">
                    It takes you an average of {formatValue(avgSleepOnset, 0)} minutes to fall asleep
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Sleep Continuity</h4>
                  <p className="text-sm text-muted-foreground">
                    You wake up {formatValue(avgWakeups, 1)} times per night on average
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button className="w-full sm:w-auto">View Detailed Sleep Analysis</Button>
      </div>
    </div>
  );
};
