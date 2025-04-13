import React from 'react';
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart as BarChartIcon,
  Calendar,
  DollarSign,
  Activity,
  Heart,
  Pill,
  Brain,
  Star,
  Loader2
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Button } from "@/components/ui/button";
import { format, subDays } from "date-fns";
import { motion } from "framer-motion";
import { formatValue } from '@/components/sleep/SleepMetrics';

export const SupplementStats = () => {
  const { session } = useAuth();
  const [timeRange, setTimeRange] = useState("30"); // days
  const [chartType, setChartType] = useState("frequency");

  const { data: supplementStats, isLoading } = useQuery({
    queryKey: ['supplementStats', session?.user?.id, timeRange],
    queryFn: async () => {
      const startDate = subDays(new Date(), parseInt(timeRange)).toISOString();
      
      const { data: logs, error } = await supabase
        .from('supplement_logs')
        .select('*')
        .eq('user_id', session?.user?.id)
        .gte('created_at', startDate);
      
      if (error) throw error;

      // Calculate statistics
      const stats = logs?.reduce((acc: any, log) => {
        const supplementName = log.supplement_name;
        
        // Track frequency
        if (!acc.frequency[supplementName]) {
          acc.frequency[supplementName] = 0;
        }
        acc.frequency[supplementName] += 1;
        
        // Track effectiveness
        if (log.effectiveness_rating) {
          if (!acc.effectiveness[supplementName]) {
            acc.effectiveness[supplementName] = {
              total: 0,
              count: 0
            };
          }
          acc.effectiveness[supplementName].total += log.effectiveness_rating;
          acc.effectiveness[supplementName].count += 1;
        }

        // Track cost
        if (log.cost) {
          if (!acc.costByType[supplementName]) {
            acc.costByType[supplementName] = 0;
          }
          acc.costByType[supplementName] += log.cost;
          acc.totalCost += log.cost;
        }

        // Track other impacts
        if (log.energy_impact !== undefined) {
          if (!acc.impacts[supplementName]) {
            acc.impacts[supplementName] = {
              energy: { total: 0, count: 0 },
              focus: { total: 0, count: 0 },
              mood: { total: 0, count: 0 },
              sleep: { total: 0, count: 0 }
            };
          }
          acc.impacts[supplementName].energy.total += log.energy_impact;
          acc.impacts[supplementName].energy.count += 1;
        }

        if (log.focus_impact !== undefined) {
          if (!acc.impacts[supplementName]) {
            acc.impacts[supplementName] = {
              energy: { total: 0, count: 0 },
              focus: { total: 0, count: 0 },
              mood: { total: 0, count: 0 },
              sleep: { total: 0, count: 0 }
            };
          }
          acc.impacts[supplementName].focus.total += log.focus_impact;
          acc.impacts[supplementName].focus.count += 1;
        }

        if (log.mood_impact !== undefined) {
          if (!acc.impacts[supplementName]) {
            acc.impacts[supplementName] = {
              energy: { total: 0, count: 0 },
              focus: { total: 0, count: 0 },
              mood: { total: 0, count: 0 },
              sleep: { total: 0, count: 0 }
            };
          }
          acc.impacts[supplementName].mood.total += log.mood_impact;
          acc.impacts[supplementName].mood.count += 1;
        }

        if (log.sleep_impact !== undefined) {
          if (!acc.impacts[supplementName]) {
            acc.impacts[supplementName] = {
              energy: { total: 0, count: 0 },
              focus: { total: 0, count: 0 },
              mood: { total: 0, count: 0 },
              sleep: { total: 0, count: 0 }
            };
          }
          acc.impacts[supplementName].sleep.total += log.sleep_impact;
          acc.impacts[supplementName].sleep.count += 1;
        }

        // Track by time
        const dateKey = format(new Date(log.created_at), 'yyyy-MM-dd');
        if (!acc.dailyIntake[dateKey]) {
          acc.dailyIntake[dateKey] = {};
        }
        
        if (!acc.dailyIntake[dateKey][supplementName]) {
          acc.dailyIntake[dateKey][supplementName] = 0;
        }
        
        acc.dailyIntake[dateKey][supplementName] += 1;

        return acc;
      }, { 
        frequency: {}, 
        effectiveness: {}, 
        costByType: {},
        totalCost: 0, 
        impacts: {},
        dailyIntake: {}
      });

      // Format data for charts
      const frequencyData = Object.entries(stats?.frequency || {}).map(([name, count]) => ({
        name,
        count
      }));

      const effectivenessData = Object.entries(stats?.effectiveness || {}).map(([name, data]: [string, any]) => ({
        name,
        rating: data.total / data.count
      }));

      const costData = Object.entries(stats?.costByType || {}).map(([name, cost]) => ({
        name,
        cost
      }));

      // Prepare data for the impact radar chart
      const impactData = Object.entries(stats?.impacts || {}).map(([name, impacts]: [string, any]) => {
        const data: any = { name };
        
        if (impacts.energy.count > 0) {
          data.energy = impacts.energy.total / impacts.energy.count;
        }
        
        if (impacts.focus.count > 0) {
          data.focus = impacts.focus.total / impacts.focus.count;
        }
        
        if (impacts.mood.count > 0) {
          data.mood = impacts.mood.total / impacts.mood.count;
        }
        
        if (impacts.sleep.count > 0) {
          data.sleep = impacts.sleep.total / impacts.sleep.count;
        }
        
        return data;
      });

      // Prepare time series data
      const timeSeriesData: any[] = [];
      const sortedDates = Object.keys(stats?.dailyIntake || {}).sort();
      
      sortedDates.forEach(date => {
        const entry: any = { date };
        
        // Add supplement counts for this date
        Object.entries(stats?.dailyIntake[date] || {}).forEach(([supplement, count]) => {
          entry[supplement] = count;
        });
        
        timeSeriesData.push(entry);
      });

      return {
        frequency: frequencyData,
        effectiveness: effectivenessData,
        impacts: impactData,
        costs: costData,
        timeSeries: timeSeriesData,
        totalCost: stats?.totalCost || 0,
        supplementNames: Object.keys(stats?.frequency || {})
      };
    },
    enabled: !!session?.user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!supplementStats || (
    !supplementStats.frequency.length && 
    !supplementStats.effectiveness.length && 
    !supplementStats.impacts.length
  )) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
        <Pill className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
        <h3 className="font-medium mb-1">No supplement data available yet</h3>
        <p className="text-sm max-w-md">
          Start logging your supplements to see usage statistics and trends.
        </p>
      </div>
    );
  }

  // Custom colors for charts
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];

  // Custom tooltip formatter
  const tooltipFormatter = (value: any, name: string) => {
    if (name === 'rating') return [value.toFixed(1) + '/10', 'Effectiveness'];
    if (name === 'cost') return ['$' + value.toFixed(2), 'Cost'];
    return [value, name];
  };

  const formatValue = (value) => {
    if (typeof value === 'number') {
      return value.toFixed(1);
    }
    return value;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={timeRange === "7" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7")}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === "30" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30")}
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === "90" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("90")}
          >
            90 Days
          </Button>
          <Button
            variant={timeRange === "365" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("365")}
          >
            Year
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={chartType === "frequency" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("frequency")}
            className="flex items-center gap-1"
          >
            <BarChartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Usage</span>
          </Button>
          <Button
            variant={chartType === "effectiveness" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("effectiveness")}
            className="flex items-center gap-1"
          >
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Effectiveness</span>
          </Button>
          <Button
            variant={chartType === "impact" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("impact")}
            className="flex items-center gap-1"
          >
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Impact</span>
          </Button>
          <Button
            variant={chartType === "cost" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("cost")}
            className="flex items-center gap-1"
          >
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Cost</span>
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {chartType === "frequency" && (
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                Supplement Usage Frequency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={supplementStats.frequency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={tooltipFormatter} />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Usage Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {chartType === "effectiveness" && (
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Average Effectiveness Ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={supplementStats.effectiveness}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip formatter={tooltipFormatter} />
                    <Legend />
                    <Bar dataKey="rating" fill="#82ca9d" name="Effectiveness Rating" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {chartType === "impact" && (
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Supplement Impact Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={supplementStats.impacts}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                    <Radar name="Energy" dataKey="energy" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Focus" dataKey="focus" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Radar name="Mood" dataKey="mood" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                    <Radar name="Sleep" dataKey="sleep" stroke="#ff8042" fill="#ff8042" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {chartType === "cost" && (
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Supplement Cost Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={supplementStats.costs}
                        dataKey="cost"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => entry.name}
                      >
                        {supplementStats.costs.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Cost']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-muted/10 rounded-lg border border-muted">
                  <DollarSign className="h-12 w-12 text-primary mb-2" />
                  <h3 className="text-xl font-bold mb-1">${supplementStats.totalCost.toFixed(2)}</h3>
                  <p className="text-muted-foreground text-center">
                    Total spent on supplements in the last {timeRange} days
                  </p>
                  <div className="grid grid-cols-2 gap-4 w-full mt-6">
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Avg. Daily</p>
                      <p className="font-semibold">${(supplementStats.totalCost / parseInt(timeRange)).toFixed(2)}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Avg. Monthly</p>
                      <p className="font-semibold">${(supplementStats.totalCost / parseInt(timeRange) * 30).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      <Card className="border-primary/10 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Usage Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={supplementStats.timeSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {supplementStats.supplementNames.map((name, index) => (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={colors[index % colors.length]}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mr-4">
              <Pill className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium">Most Used</h3>
              <p className="text-2xl font-bold">
                {supplementStats.frequency.length > 0 ? 
                  supplementStats.frequency.sort((a: any, b: any) => b.count - a.count)[0].name : 
                  'N/A'}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Most frequently taken supplement in the past {timeRange} days
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 mr-4">
              <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium">Most Effective</h3>
              <p className="text-2xl font-bold">
                {supplementStats.effectiveness.length > 0 ? 
                  supplementStats.effectiveness.sort((a: any, b: any) => b.rating - a.rating)[0].name : 
                  'N/A'}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Highest rated supplement based on your effectiveness ratings
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3 mr-4">
              <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium">Top for Focus</h3>
              <p className="text-2xl font-bold">
                {supplementStats.impacts.length > 0 && 
                 supplementStats.impacts.some((d: any) => d.focus !== undefined) ? 
                  supplementStats.impacts
                    .filter((d: any) => d.focus !== undefined)
                    .sort((a: any, b: any) => b.focus - a.focus)[0].name : 
                  'N/A'}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Most effective supplement for improving focus
          </p>
        </Card>
      </div>
    </div>
  );
};
