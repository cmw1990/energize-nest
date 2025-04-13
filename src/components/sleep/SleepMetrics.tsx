
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon, Sun, Clock, Calendar, Zap, Battery, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { formatValue, ValueType } from '@/utils/formatUtils';
import { assertType } from '@/utils/typeSafeUtils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

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
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type SleepData = {
  id: string;
  date: string;
  bedtime: string;
  wake_time: string;
  total_hours: number;
  quality_rating: number;
  deep_sleep_percentage: number;
  rem_sleep_percentage: number;
  light_sleep_percentage: number;
  awake_percentage: number;
  notes: string | null;
};

export const SleepMetrics = () => {
  const { session } = useAuth();
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [sleepMetric, setSleepMetric] = useState<'duration' | 'quality' | 'deep' | 'rem'>('duration');
  
  const { data: sleepData, isLoading } = useQuery({
    queryKey: ['sleep_data', session?.user?.id, view],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const pastDate = new Date();
      switch (view) {
        case 'day':
          pastDate.setDate(pastDate.getDate() - 1);
          break;
        case 'week':
          pastDate.setDate(pastDate.getDate() - 7);
          break;
        case 'month':
          pastDate.setDate(pastDate.getDate() - 30);
          break;
      }
      
      const { data, error } = await supabase
        .from('sleep_tracking')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('date', pastDate.toISOString().split('T')[0])
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching sleep data:', error);
        return [];
      }
      
      return assertType<SleepData[]>(data || []);
    },
    enabled: !!session?.user?.id,
  });

  const chartData = {
    labels: sleepData?.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) || [],
    datasets: [
      {
        label: sleepMetric === 'duration'
          ? 'Sleep Duration (hrs)'
          : sleepMetric === 'quality'
          ? 'Sleep Quality (1-10)'
          : sleepMetric === 'deep'
          ? 'Deep Sleep %'
          : 'REM Sleep %',
        data: sleepData?.map(item => 
          sleepMetric === 'duration'
            ? item.total_hours
            : sleepMetric === 'quality'
            ? item.quality_rating
            : sleepMetric === 'deep'
            ? item.deep_sleep_percentage
            : item.rem_sleep_percentage
        ) || [],
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: sleepMetric === 'duration' ? 0 : sleepMetric === 'quality' ? 0 : 0,
        max: sleepMetric === 'duration' ? 12 : sleepMetric === 'quality' ? 10 : 100,
        ticks: {
          stepSize: sleepMetric === 'duration' ? 2 : sleepMetric === 'quality' ? 1 : 20,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += sleepMetric === 'duration'
                ? context.parsed.y + ' hrs'
                : sleepMetric === 'quality'
                ? context.parsed.y + '/10'
                : context.parsed.y + '%';
            }
            return label;
          }
        }
      }
    },
  };

  const getAverageSleepDuration = () => {
    if (!sleepData || sleepData.length === 0) return 0;
    const total = sleepData.reduce((sum, item) => sum + item.total_hours, 0);
    return total / sleepData.length;
  };

  const getAverageSleepQuality = () => {
    if (!sleepData || sleepData.length === 0) return 0;
    const total = sleepData.reduce((sum, item) => sum + item.quality_rating, 0);
    return total / sleepData.length;
  };

  const getAverageDeepSleep = () => {
    if (!sleepData || sleepData.length === 0) return 0;
    const total = sleepData.reduce((sum, item) => sum + item.deep_sleep_percentage, 0);
    return total / sleepData.length;
  };

  const getAverageRemSleep = () => {
    if (!sleepData || sleepData.length === 0) return 0;
    const total = sleepData.reduce((sum, item) => sum + item.rem_sleep_percentage, 0);
    return total / sleepData.length;
  };

  const getLatestBedtime = () => {
    if (!sleepData || sleepData.length === 0) return 'N/A';
    const latestData = [...sleepData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    return latestData.bedtime.substring(0, 5);
  };

  const getLatestWakeTime = () => {
    if (!sleepData || sleepData.length === 0) return 'N/A';
    const latestData = [...sleepData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    return latestData.wake_time.substring(0, 5);
  };

  const sleepTrend = () => {
    if (!sleepData || sleepData.length < 3) return 'stable';
    
    const last = sleepData[sleepData.length - 1];
    const secondLast = sleepData[sleepData.length - 2];
    const thirdLast = sleepData[sleepData.length - 3];
    
    const metricValue = (data: SleepData) => 
      sleepMetric === 'duration'
        ? data.total_hours
        : sleepMetric === 'quality'
        ? data.quality_rating
        : sleepMetric === 'deep'
        ? data.deep_sleep_percentage
        : data.rem_sleep_percentage;
    
    if (metricValue(last) > metricValue(secondLast) && metricValue(secondLast) > metricValue(thirdLast)) {
      return 'improving';
    } else if (metricValue(last) < metricValue(secondLast) && metricValue(secondLast) < metricValue(thirdLast)) {
      return 'declining';
    } else {
      return 'stable';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Sleep Metrics</h2>
          <p className="text-sm text-muted-foreground">
            Track and analyze your sleep patterns over time
          </p>
        </div>
        
        <div className="flex items-center">
          <Tabs value={view} onValueChange={(v) => setView(v as 'day' | 'week' | 'month')}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Sleep Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">
                {formatValue(getAverageSleepDuration(), 1)} hrs
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Sleep Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Moon className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">
                {formatValue(getAverageSleepQuality(), 1)}/10
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sleep Cycle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">
                {formatValue(getAverageDeepSleep(), 1)}% deep
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Sleep Trends</CardTitle>
            <Tabs value={sleepMetric} onValueChange={(v) => setSleepMetric(v as any)}>
              <TabsList>
                <TabsTrigger value="duration">Duration</TabsTrigger>
                <TabsTrigger value="quality">Quality</TabsTrigger>
                <TabsTrigger value="deep">Deep Sleep</TabsTrigger>
                <TabsTrigger value="rem">REM Sleep</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <p>Loading data...</p>
            </div>
          ) : sleepData && sleepData.length > 0 ? (
            <div className="h-[300px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p>No sleep data available for the selected period</p>
                <Button className="mt-4" variant="outline">Log Sleep</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Sleep Schedule</CardTitle>
            <CardDescription>Your recent sleep and wake times</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Moon className="h-5 w-5 text-muted-foreground mr-2" />
                  <span>Bedtime</span>
                </div>
                <span className="font-medium">{getLatestBedtime()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Sun className="h-5 w-5 text-muted-foreground mr-2" />
                  <span>Wake Time</span>
                </div>
                <span className="font-medium">{getLatestWakeTime()}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center">
                  <Battery className="h-5 w-5 text-muted-foreground mr-2" />
                  <span>Sleep Trend</span>
                </div>
                <span className={`font-medium ${
                  sleepTrend() === 'improving' 
                    ? 'text-green-600' 
                    : sleepTrend() === 'declining' 
                    ? 'text-red-600' 
                    : ''
                }`}>
                  {sleepTrend() === 'improving' 
                    ? 'Improving' 
                    : sleepTrend() === 'declining' 
                    ? 'Declining' 
                    : 'Stable'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sleep Composition</CardTitle>
            <CardDescription>Breakdown of your sleep cycles</CardDescription>
          </CardHeader>
          <CardContent>
            {sleepData && sleepData.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Deep Sleep</span>
                    <span className="font-medium">{formatValue(getAverageDeepSleep(), 1)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full" 
                      style={{ width: `${getAverageDeepSleep()}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>REM Sleep</span>
                    <span className="font-medium">{formatValue(getAverageRemSleep(), 1)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 rounded-full" 
                      style={{ width: `${getAverageRemSleep()}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Light Sleep</span>
                    <span className="font-medium">
                      {formatValue(
                        100 - getAverageDeepSleep() - getAverageRemSleep(), 
                        1
                      )}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-400 rounded-full" 
                      style={{ 
                        width: `${100 - getAverageDeepSleep() - getAverageRemSleep()}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[120px]">
                <p className="text-muted-foreground mb-2">No sleep data available</p>
                <Button variant="outline" size="sm">Log Sleep</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
