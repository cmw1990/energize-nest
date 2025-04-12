
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Zap, Calendar, Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import { format, subDays, addDays, startOfWeek, endOfWeek } from "date-fns";

export function MotivationStats() {
  const { session } = useAuth();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [weekEnd, setWeekEnd] = useState(() => endOfWeek(new Date()));
  const [progressData, setProgressData] = useState<any>({
    weeklyProgress: 68,
    streakDays: 5,
    completedGoals: 12,
  });

  const { data: moodData } = useQuery({
    queryKey: ['mood-data', session?.user?.id, weekStart.toISOString(), weekEnd.toISOString()],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process data for chart display
      const chartData = Array.from({ length: 7 }).map((_, index) => {
        const date = addDays(weekStart, index);
        const dateStr = format(date, 'yyyy-MM-dd');
        const entry = data?.find(entry => entry.created_at.startsWith(dateStr));
        
        return {
          name: format(date, 'EEE'),
          value: entry?.rating || 0,
          fullDate: dateStr,
        };
      });

      return chartData;
    },
    enabled: !!session?.user?.id,
  });

  const { data: progressStats } = useQuery({
    queryKey: ['progress-stats', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      // In a real app, we'd fetch this from the database
      // This is a placeholder for the actual data
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('completed', true)
        .gte('created_at', subDays(new Date(), 30).toISOString());

      if (tasksError) throw tasksError;

      const completedGoals = tasksData?.length || 0;

      // Calculate streak - in a real app, this would be more sophisticated
      const streakDays = Math.min(completedGoals, 7);
      
      // Weekly progress is based on completed vs total tasks
      const { data: totalTasks, error: totalError } = await supabase
        .from('tasks')
        .select('count')
        .eq('user_id', session.user.id)
        .gte('created_at', subDays(new Date(), 7).toISOString());

      if (totalError) throw totalError;
      
      const totalTaskCount = totalTasks[0]?.count || 20;
      const weeklyTasksCompleted = tasksData?.filter(task => 
        new Date(task.created_at) >= subDays(new Date(), 7)
      ).length || 0;
      
      const weeklyProgress = totalTaskCount > 0 
        ? Math.round((weeklyTasksCompleted / totalTaskCount) * 100)
        : 0;

      return {
        weeklyProgress,
        streakDays,
        completedGoals
      };
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (progressStats) {
      setProgressData(progressStats);
    }
  }, [progressStats]);

  const navigatePreviousWeek = () => {
    setWeekStart(prev => subDays(prev, 7));
    setWeekEnd(prev => subDays(prev, 7));
  };

  const navigateNextWeek = () => {
    const nextWeekStart = addDays(weekStart, 7);
    if (nextWeekStart <= new Date()) {
      setWeekStart(nextWeekStart);
      setWeekEnd(addDays(weekEnd, 7));
    }
  };

  const getBarFill = (value: number) => {
    if (value <= 3) return "#ef4444"; // Red for low mood
    if (value <= 6) return "#f59e0b"; // Amber for medium mood
    return "#10b981"; // Green for good mood
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Your Progress Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-5">
        {/* Weekly Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Weekly Progress</span>
            <span className="text-sm font-medium">{progressData.weeklyProgress}%</span>
          </div>
          <Progress value={progressData.weeklyProgress} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
            <Calendar className="h-6 w-6 text-blue-500 mb-1" />
            <span className="text-2xl font-bold">{progressData.streakDays}</span>
            <span className="text-xs text-muted-foreground">Day Streak</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
            <Trophy className="h-6 w-6 text-amber-500 mb-1" />
            <span className="text-2xl font-bold">{progressData.completedGoals}</span>
            <span className="text-xs text-muted-foreground">Goals Completed</span>
          </div>
        </div>

        {/* Mood Chart */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Weekly Mood</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={navigatePreviousWeek}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs">
                {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={navigateNextWeek}
                disabled={endOfWeek(new Date()) <= weekEnd}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                />
                <YAxis 
                  domain={[0, 10]} 
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  width={25}
                />
                <Tooltip 
                  formatter={(value) => [`Mood: ${value}/10`, ""]}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={30}
                >
                  {(moodData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarFill(entry.value)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
