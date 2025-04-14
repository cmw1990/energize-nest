import React from 'react';
import { BeverageAnalytics as BeverageAnalyticsType } from '@/types/beverages';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  analytics: BeverageAnalyticsType;
}

export const BeverageAnalytics: React.FC<Props> = ({ analytics }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(num);
  };

  const getProgressColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  // Daily targets
  const DAILY_WATER_TARGET = 2000; // 2L
  const DAILY_CAFFEINE_TARGET = 400; // 400mg
  const DAILY_ALCOHOL_TARGET = 20; // 20g (about 2 standard drinks)
  const DAILY_CALORIES_TARGET = 300; // 300 calories from beverages

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {formatNumber(analytics.totalWater)}ml
              </div>
              <Progress 
                value={(analytics.totalWater / DAILY_WATER_TARGET) * 100}
                className={getProgressColor(analytics.totalWater, DAILY_WATER_TARGET)}
              />
              <p className="text-xs text-muted-foreground">
                Target: {DAILY_WATER_TARGET}ml
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Caffeine Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {formatNumber(analytics.totalCaffeine)}mg
              </div>
              <Progress 
                value={(analytics.totalCaffeine / DAILY_CAFFEINE_TARGET) * 100}
                className={getProgressColor(analytics.totalCaffeine, DAILY_CAFFEINE_TARGET)}
              />
              <p className="text-xs text-muted-foreground">
                Target: {DAILY_CAFFEINE_TARGET}mg
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alcohol Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {formatNumber(analytics.totalAlcohol)}g
              </div>
              <Progress 
                value={(analytics.totalAlcohol / DAILY_ALCOHOL_TARGET) * 100}
                className={getProgressColor(analytics.totalAlcohol, DAILY_ALCOHOL_TARGET)}
              />
              <p className="text-xs text-muted-foreground">
                Target: {DAILY_ALCOHOL_TARGET}g
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calories from Beverages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {formatNumber(analytics.totalCalories)}
              </div>
              <Progress 
                value={(analytics.totalCalories / DAILY_CALORIES_TARGET) * 100}
                className={getProgressColor(analytics.totalCalories, DAILY_CALORIES_TARGET)}
              />
              <p className="text-xs text-muted-foreground">
                Target: {DAILY_CALORIES_TARGET}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="water" 
                  stroke="#3b82f6" 
                  name="Water (ml)"
                />
                <Line 
                  type="monotone" 
                  dataKey="caffeine" 
                  stroke="#eab308" 
                  name="Caffeine (mg)"
                />
                <Line 
                  type="monotone" 
                  dataKey="alcohol" 
                  stroke="#ef4444" 
                  name="Alcohol (g)"
                />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#22c55e" 
                  name="Calories"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">
                    {log.beverage_type?.name || log.custom_name || 'Custom Beverage'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {log.amount_ml}ml
                    {log.notes && ` - ${log.notes}`}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};