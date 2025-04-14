import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import { format, subMonths, isAfter, differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface WeightLog {
  log_date: string;
  weight_kg: number;
  height_m: number | null;
  bmi?: number;
  measurement_type: 'morning' | 'evening' | 'other';
  notes?: string;
}

interface ChartData {
  date: string;
  weight: number;
  morningWeight?: number;
  eveningWeight?: number;
  otherWeight?: number;
  bmi: number | null;
  goal?: number;
  trend?: number;
  movingAverage?: number;
}

const timeRanges = [
  { value: '1', label: 'Last Month' },
  { value: '3', label: 'Last 3 Months' },
  { value: '6', label: 'Last 6 Months' },
  { value: '12', label: 'Last Year' },
  { value: 'all', label: 'All Time' }
];

const bmiRanges = [
  { min: 0, max: 18.5, color: '#FFA500', label: 'Underweight' },
  { min: 18.5, max: 25, color: '#4CAF50', label: 'Normal' },
  { min: 25, max: 30, color: '#FF9800', label: 'Overweight' },
  { min: 30, max: 100, color: '#F44336', label: 'Obese' }
];

const calculateTrend = (data: WeightLog[], days: number = 7) => {
  if (data.length < 2) return null;

  const recentLogs = data
    .sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime())
    .slice(0, days);

  if (recentLogs.length < 2) return null;

  const firstWeight = recentLogs[recentLogs.length - 1].weight_kg;
  const lastWeight = recentLogs[0].weight_kg;
  const daysDiff = differenceInDays(
    new Date(recentLogs[0].log_date),
    new Date(recentLogs[recentLogs.length - 1].log_date)
  );

  return daysDiff > 0 ? ((lastWeight - firstWeight) / daysDiff) * 7 : 0;
};

export const WeightProgressChart = () => {
  const { session } = useAuth();
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [activeGoal, setActiveGoal] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('3');
  const [isLoading, setIsLoading] = useState(true);
  const [showBMI, setShowBMI] = useState(false);
  const [showTrend, setShowTrend] = useState(true);
  const [showMovingAverage, setShowMovingAverage] = useState(true);
  const [measurementFilter, setMeasurementFilter] = useState<'all' | 'morning' | 'evening' | 'other'>('all');

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;

      setIsLoading(true);
      try {
        // Get weight logs
        const { data: logs, error: logsError } = await supabase
          .from('weight_logs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('log_date', { ascending: true });

        if (logsError) throw logsError;
        setWeightLogs(logs || []);

        // Get active goal
        const { data: goal, error: goalError } = await supabase
          .from('nutrition_goals')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .maybeSingle();

        if (goalError) throw goalError;
        setActiveGoal(goal);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const chartData = useMemo(() => {
    if (!weightLogs.length) return [];

    const cutoffDate = timeRange !== 'all'
      ? subMonths(new Date(), parseInt(timeRange))
      : new Date(0);

    const filteredLogs = weightLogs
      .filter(log => isAfter(new Date(log.log_date), cutoffDate))
      .sort((a, b) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime());

    const weeklyTrend = calculateTrend(filteredLogs);

    // Calculate 7-day moving average
    const calculateMovingAverage = (data: WeightLog[], index: number) => {
      const window = data.slice(Math.max(0, index - 6), index + 1);
      if (window.length < 3) return undefined;
      const sum = window.reduce((acc, curr) => acc + curr.weight_kg, 0);
      return Number((sum / window.length).toFixed(1));
    };

    // Group logs by measurement type
    const groupedLogs = new Map<string, WeightLog[]>();
    filteredLogs.forEach(log => {
      const date = format(new Date(log.log_date), 'MMM d');
      if (!groupedLogs.has(date)) {
        groupedLogs.set(date, []);
      }
      groupedLogs.get(date)!.push(log);
    });

    // Create chart data points
    return Array.from(groupedLogs.entries()).map(([date, logs], index) => {
      const morningLog = logs.find(l => l.measurement_type === 'morning');
      const eveningLog = logs.find(l => l.measurement_type === 'evening');
      const otherLog = logs.find(l => l.measurement_type === 'other');

      const primaryLog = logs[0]; // Use first log for common fields
      const bmi = primaryLog.height_m
        ? Number((primaryLog.weight_kg / (primaryLog.height_m * primaryLog.height_m)).toFixed(1))
        : null;

      // Calculate trend line
      const trend = showTrend && index > 0
        ? filteredLogs[0].weight_kg + (weeklyTrend || 0) * (index / 7)
        : undefined;

      // Calculate moving average
      const movingAverage = showMovingAverage
        ? calculateMovingAverage(filteredLogs, index)
        : undefined;

      return {
        date,
        weight: primaryLog.weight_kg,
        morningWeight: morningLog?.weight_kg,
        eveningWeight: eveningLog?.weight_kg,
        otherWeight: otherLog?.weight_kg,
        bmi,
        goal: activeGoal?.target_weight_kg,
        trend,
        movingAverage
      };
    });
  }, [weightLogs, timeRange, activeGoal, showTrend, showMovingAverage]);

  const getMinMaxWeight = () => {
    if (!chartData.length) return { min: 0, max: 100 };

    const values = chartData.flatMap(d => [
      d.weight,
      d.trend,
      d.goal
    ].filter(Boolean) as number[]);

    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;

    return {
      min: Math.max(0, Math.floor(min - padding)),
      max: Math.ceil(max + padding)
    };
  };

  const { min: yMin, max: yMax } = getMinMaxWeight();

  const getBMIColor = (bmi: number) => {
    const range = bmiRanges.find(r => bmi >= r.min && bmi < r.max);
    return range?.color || '#666666';
  };

  const recentTrend = calculateTrend(weightLogs);
  const trendText = recentTrend
    ? `${Math.abs(recentTrend).toFixed(1)} kg/week ${recentTrend > 0 ? 'gain' : 'loss'}`
    : 'Not enough data';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm">
          Weight: <span className="font-medium">{data.weight.toFixed(1)} kg</span>
        </p>
        {data.bmi && (
          <p className="text-sm">
            BMI: <span className="font-medium" style={{ color: getBMIColor(data.bmi) }}>
              {data.bmi} ({bmiRanges.find(r => data.bmi >= r.min && data.bmi < r.max)?.label})
            </span>
          </p>
        )}
        {data.trend && (
          <p className="text-sm">
            Trend: <span className="font-medium">{data.trend.toFixed(1)} kg</span>
          </p>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Weight Progress</CardTitle>
            <CardDescription>
              7-day Trend: {trendText}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Select value={measurementFilter} onValueChange={(value: any) => setMeasurementFilter(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter measurements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Measurements</SelectItem>
                <SelectItem value="morning">Morning Only</SelectItem>
                <SelectItem value="evening">Evening Only</SelectItem>
                <SelectItem value="other">Other Times</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="bmi">BMI</Label>
                <Switch
                  id="bmi"
                  checked={showBMI}
                  onCheckedChange={setShowBMI}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="trend">Trend</Label>
                <Switch
                  id="trend"
                  checked={showTrend}
                  onCheckedChange={setShowTrend}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="average">7-day Avg</Label>
                <Switch
                  id="average"
                  checked={showMovingAverage}
                  onCheckedChange={setShowMovingAverage}
                />
              </div>
            </div>
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex justify-center items-center h-[300px] text-muted-foreground">
            No weight logs found for the selected time range
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                dy={10}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                yAxisId="weight"
                domain={[yMin, yMax]}
                tickLine={false}
                axisLine={false}
                dx={-10}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{
                  value: 'Weight (kg)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: 'hsl(var(--muted-foreground))' }
                }}
              />
              {showBMI && (
                <YAxis
                  yAxisId="bmi"
                  orientation="right"
                  domain={[15, 40]}
                  tickLine={false}
                  axisLine={false}
                  dx={10}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  label={{
                    value: 'BMI',
                    angle: 90,
                    position: 'insideRight',
                    style: { fill: 'hsl(var(--muted-foreground))' }
                  }}
                />
              )}
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* BMI Range Areas */}
              {showBMI && bmiRanges.map((range, index) => (
                <Area
                  key={index}
                  yAxisId="bmi"
                  dataKey="bmi"
                  baseValue={range.min}
                  fill={range.color}
                  stroke="none"
                  fillOpacity={0.1}
                />
              ))}

              {/* Main Weight Line */}
              {(measurementFilter === 'all' || measurementFilter === 'morning') && (
                <Line
                  yAxisId="weight"
                  type="monotone"
                  dataKey="morningWeight"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  name="Morning Weight"
                />
              )}
              
              {(measurementFilter === 'all' || measurementFilter === 'evening') && (
                <Line
                  yAxisId="weight"
                  type="monotone"
                  dataKey="eveningWeight"
                  stroke="hsl(var(--warning))"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  name="Evening Weight"
                />
              )}
              
              {(measurementFilter === 'all' || measurementFilter === 'other') && (
                <Line
                  yAxisId="weight"
                  type="monotone"
                  dataKey="otherWeight"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  name="Other Times"
                />
              )}

              {/* BMI Line */}
              {showBMI && (
                <Line
                  yAxisId="bmi"
                  type="monotone"
                  dataKey="bmi"
                  stroke="#666666"
                  strokeWidth={2}
                  dot={false}
                  name="BMI"
                />
              )}

              {/* Moving Average Line */}
              {showMovingAverage && (
                <Line
                  yAxisId="weight"
                  type="monotone"
                  dataKey="movingAverage"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={false}
                  name="7-day Average"
                />
              )}

              {/* Trend Line */}
              {showTrend && (
                <Line
                  yAxisId="weight"
                  type="monotone"
                  dataKey="trend"
                  stroke="hsl(var(--primary))"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                  name="Overall Trend"
                />
              )}

              {/* Goal Line */}
              {activeGoal && (
                <ReferenceLine
                  yAxisId="weight"
                  y={activeGoal.target_weight_kg}
                  stroke="hsl(var(--primary))"
                  strokeDasharray="3 3"
                  label={{
                    value: `Goal: ${activeGoal.target_weight_kg} kg`,
                    position: 'right',
                    fill: 'hsl(var(--primary))'
                  }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};