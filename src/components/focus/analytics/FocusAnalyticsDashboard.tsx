import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Clock, Target, Zap, Calendar, BarChart2, TrendingUp, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { focusDb } from "@/lib/focus-db";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface FocusMetrics {
  date: string;
  total_focus_time: number;
  total_break_time: number;
  completed_tasks: number;
  interruptions: number;
  average_focus_score: number;
  energy_correlation: number;
  productivity_score: number;
}

export const FocusAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState<"7" | "14" | "30" | "90">("7");

  const { data: analytics } = useQuery({
    queryKey: ['focus-analytics', timeRange],
    queryFn: () => focusDb.getAnalytics(parseInt(timeRange)),
  });

  const { data: sessions } = useQuery({
    queryKey: ['focus-sessions'],
    queryFn: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));
      return focusDb.getTimerSessions(startDate, endDate);
    },
  });

  const { data: tasks } = useQuery({
    queryKey: ['task-breakdowns', true],
    queryFn: () => focusDb.getTaskBreakdowns(true),
  });

  // Calculate summary metrics
  const totalFocusTime = analytics?.reduce((sum, day) => sum + day.total_focus_time, 0) || 0;
  const totalTasks = analytics?.reduce((sum, day) => sum + day.completed_tasks, 0) || 0;
  const averageProductivity = analytics?.reduce((sum, day) => sum + day.productivity_score, 0) / (analytics?.length || 1);
  const totalInterruptions = analytics?.reduce((sum, day) => sum + day.interruptions, 0) || 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Focus Analytics
          </CardTitle>
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
            <TabsList>
              <TabsTrigger value="7">7d</TabsTrigger>
              <TabsTrigger value="14">14d</TabsTrigger>
              <TabsTrigger value="30">30d</TabsTrigger>
              <TabsTrigger value="90">90d</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Focus Time</h3>
            </div>
            <div className="text-2xl font-bold">{Math.round(totalFocusTime / 60)}h</div>
            <p className="text-sm text-muted-foreground">Total focused hours</p>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Tasks</h3>
            </div>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-sm text-muted-foreground">Completed tasks</p>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Productivity</h3>
            </div>
            <div className="text-2xl font-bold">{Math.round(averageProductivity)}%</div>
            <p className="text-sm text-muted-foreground">Average score</p>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Interruptions</h3>
            </div>
            <div className="text-2xl font-bold">{totalInterruptions}</div>
            <p className="text-sm text-muted-foreground">Total distractions</p>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Focus Time Trend */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Focus Time Trend</h3>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), "MMM d")}
                  />
                  <YAxis
                    tickFormatter={(value) => `${Math.round(value / 60)}h`}
                  />
                  <Tooltip
                    labelFormatter={(date) => format(new Date(date), "MMM d, yyyy")}
                    formatter={(value: number) => [`${Math.round(value / 60)}h`, "Focus Time"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="total_focus_time"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Productivity Score vs Energy Level */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Productivity vs Energy Correlation</h3>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), "MMM d")}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    labelFormatter={(date) => format(new Date(date), "MMM d, yyyy")}
                  />
                  <Line
                    type="monotone"
                    name="Productivity"
                    dataKey="productivity_score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    name="Energy Impact"
                    dataKey="energy_correlation"
                    stroke="hsl(var(--primary) / 0.5)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Focus Insights */}
          <Card className="p-6 bg-primary/5">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Focus Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Peak Performance Times</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Morning: 9 AM - 11 AM</li>
                    <li>• Afternoon: 2 PM - 4 PM</li>
                    <li>• Evening: 7 PM - 9 PM</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Common Interruptions</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Social media notifications</li>
                    <li>• Email checking</li>
                    <li>• Unscheduled meetings</li>
                  </ul>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Schedule deep work during peak hours</li>
                  <li>• Take regular breaks to maintain energy</li>
                  <li>• Use focus zones to minimize distractions</li>
                  <li>• Track energy levels to optimize scheduling</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
