
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { safeArrayCast, safeGet } from "@/utils/typeSafeUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Brain, TrendingUp, TrendingDown, Minus, Clock, Activity } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const MotivationStats = () => {
  const { session } = useAuth();
  
  const { data: moodData, isLoading } = useQuery({
    queryKey: ["mood_data", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("mood_tracking")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(30);
        
      if (error) throw error;
      
      return safeArrayCast(data || []);
    },
    enabled: !!session?.user?.id,
  });
  
  const calculateAverageMood = () => {
    if (!moodData || moodData.length === 0) return "0";
    
    const sum = moodData.reduce((acc, entry) => {
      const moodValue = safeGet(entry, 'overall_mood', 0);
      return acc + (typeof moodValue === 'number' ? moodValue : 0);
    }, 0);
    
    return (sum / moodData.length).toFixed(1);
  };
  
  const calculateMoodChange = () => {
    if (!moodData || moodData.length < 2) return "0";
    
    const oldestEntries = moodData.slice(-5);
    const newestEntries = moodData.slice(0, 5);
    
    const oldestAvg = oldestEntries.reduce((acc, entry) => {
      const moodValue = safeGet(entry, 'overall_mood', 0);
      return acc + (typeof moodValue === 'number' ? moodValue : 0);
    }, 0) / oldestEntries.length;
      
    const newestAvg = newestEntries.reduce((acc, entry) => {
      const moodValue = safeGet(entry, 'overall_mood', 0);
      return acc + (typeof moodValue === 'number' ? moodValue : 0);
    }, 0) / newestEntries.length;
      
    return (newestAvg - oldestAvg).toFixed(1);
  };

  const getMoodChangeIcon = () => {
    const change = parseFloat(calculateMoodChange());
    if (change > 0.5) return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (change < -0.5) return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-yellow-500" />;
  };

  const getMoodLevel = (value: number) => {
    if (value >= 8) return "Excellent";
    if (value >= 6) return "Good";
    if (value >= 4) return "Neutral";
    if (value >= 2) return "Low";
    return "Very Low";
  };

  const getMoodLevelColor = (value: number) => {
    if (value >= 8) return "bg-green-100 text-green-800";
    if (value >= 6) return "bg-blue-100 text-blue-800";
    if (value >= 4) return "bg-yellow-100 text-yellow-800";
    if (value >= 2) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const formatChartData = () => {
    if (!moodData || moodData.length === 0) return [];
    
    return [...moodData]
      .sort((a, b) => {
        const aDate = a && typeof a === 'object' && 'created_at' in a ? new Date(a.created_at as string).getTime() : 0;
        const bDate = b && typeof b === 'object' && 'created_at' in b ? new Date(b.created_at as string).getTime() : 0;
        return aDate - bDate;
      })
      .map(entry => ({
        date: format(new Date(entry && typeof entry === 'object' && 'created_at' in entry ? entry.created_at as string : new Date()), 'MMM dd'),
        mood: safeGet(entry, 'overall_mood', 0),
        energy: safeGet(entry, 'energy_level', 0),
        focus: safeGet(entry, 'focus_level', 0),
      }));
  };

  const getStreakInfo = () => {
    if (!moodData || moodData.length === 0) return { currentStreak: 0, longestStreak: 0 };
    
    const dates = moodData.map(entry => {
      return entry && typeof entry === 'object' && 'created_at' in entry 
        ? new Date(entry.created_at as string).toDateString() 
        : '';
    }).filter(date => date !== '');
    const uniqueDates = [...new Set(dates)];
    
    let currentStreak = 1;
    let longestStreak = 1;
    
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i-1]);
      const currDate = new Date(uniqueDates[i]);
      
      const diffTime = Math.abs(prevDate.getTime() - currDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return { currentStreak, longestStreak };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const { currentStreak, longestStreak } = getStreakInfo();
  const avgMood = calculateAverageMood();
  const moodChange = calculateMoodChange();
  const chartData = formatChartData();

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Motivation & Mood Insights
        </CardTitle>
        <CardDescription>
          Track your mood patterns and motivation levels over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Average Mood</div>
                <Badge className={getMoodLevelColor(parseFloat(avgMood))}>
                  {getMoodLevel(parseFloat(avgMood))}
                </Badge>
              </div>
              <div className="text-3xl font-bold mt-2">{avgMood}</div>
              <div className="flex items-center mt-1 text-sm">
                {getMoodChangeIcon()}
                <span className="ml-1">{parseFloat(moodChange) > 0 ? '+' : ''}{moodChange}</span>
              </div>
            </div>

            <div className="bg-background rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Current Streak</div>
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div className="text-3xl font-bold mt-2">{currentStreak} day{currentStreak !== 1 ? 's' : ''}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Longest: {longestStreak} day{longestStreak !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="bg-background rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Last Entry</div>
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="text-3xl font-bold mt-2">
                {moodData && moodData.length > 0 && moodData[0] && typeof moodData[0] === 'object' && 'created_at' in moodData[0]
                  ? format(new Date(moodData[0].created_at as string), 'MMM dd') 
                  : 'No data'}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {moodData && moodData.length > 0 && moodData[0] && typeof moodData[0] === 'object' && 'created_at' in moodData[0]
                  ? format(new Date(moodData[0].created_at as string), 'h:mm a') 
                  : ''}
              </div>
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="h-64 mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">30-Day Mood Trends</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value}
                  />
                  <YAxis domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorMood)" 
                    name="Mood"
                    activeDot={{ r: 6 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="energy" 
                    stroke="#82ca9d" 
                    fillOpacity={1} 
                    fill="url(#colorEnergy)" 
                    name="Energy"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="focus" 
                    stroke="#ffc658" 
                    fillOpacity={1} 
                    fill="url(#colorFocus)" 
                    name="Focus"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center border rounded-lg bg-background">
              <div className="text-center text-muted-foreground">
                <p>No mood data available</p>
                <p className="text-sm mt-1">Start tracking your mood to see insights</p>
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            Track your mood regularly to unlock deeper insights and personalized recommendations.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
