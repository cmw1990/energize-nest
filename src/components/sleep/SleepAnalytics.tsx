
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Moon, Brain, Clock } from "lucide-react";

type SleepMetric = {
  date: string;
  sleep_duration: number;
  sleep_quality: number;
  bedtime: string;
  wake_time: string;
  sleep_efficiency: number;
  rem_percentage: number;
  deep_percentage: number;
  light_percentage: number;
  interruptions: number;
};

const SleepAnalytics = () => {
  const { data: sleepMetrics, isLoading } = useQuery({
    queryKey: ["sleep_analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sleep_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(14);

      if (error) {
        console.error("Error fetching sleep analytics data:", error);
        return [];
      }

      // Transform data for charts if needed
      return data?.map((log) => ({
        date: new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sleep_duration: log.sleep_duration || 0,
        sleep_quality: log.sleep_quality || 0,
        bedtime: log.bedtime || "",
        wake_time: log.wake_time || "",
        sleep_efficiency: log.sleep_efficiency || 0,
        rem_percentage: log.rem_percentage || 0,
        deep_percentage: log.deep_percentage || 0,
        light_percentage: log.light_percentage || 0,
        interruptions: log.interruptions || 0,
      })) || [];
    },
  });

  if (isLoading) {
    return <div className="p-6 text-center text-muted-foreground">Loading sleep analytics...</div>;
  }

  if (!sleepMetrics || sleepMetrics.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No sleep data available yet. Start tracking your sleep to see analytics.</p>
      </div>
    );
  }

  // Calculate averages for the metrics cards
  const avgDuration = sleepMetrics.reduce((acc, item) => acc + item.sleep_duration, 0) / sleepMetrics.length;
  const avgQuality = sleepMetrics.reduce((acc, item) => acc + item.sleep_quality, 0) / sleepMetrics.length;
  const avgEfficiency = sleepMetrics.reduce((acc, item) => acc + item.sleep_efficiency, 0) / sleepMetrics.length;
  const avgDeep = sleepMetrics.reduce((acc, item) => acc + item.deep_percentage, 0) / sleepMetrics.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Sleep Duration
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDuration.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              Last {sleepMetrics.length} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sleep Quality
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(avgQuality * 10).toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Average quality rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sleep Efficiency
            </CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEfficiency.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Time in bed spent sleeping
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Deep Sleep
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDeep.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Average deep sleep percentage
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sleep Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sleepMetrics.reverse()}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Quality %', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sleep_duration"
                  name="Sleep Duration (hours)"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="sleep_quality"
                  name="Sleep Quality (1-10)"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sleep Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sleepMetrics}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="deep_percentage"
                  name="Deep Sleep %"
                  stroke="#4C51BF"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="rem_percentage"
                  name="REM Sleep %"
                  stroke="#ED64A6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="light_percentage"
                  name="Light Sleep %"
                  stroke="#48BB78"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepAnalytics;
