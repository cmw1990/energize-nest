import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Moon, Sun, Bed, Activity } from "lucide-react";
import { format, subDays } from "date-fns";

export const formatValue = (value: any, precision: number = 1): string => {
  if (typeof value === 'number') {
    return value.toFixed(precision);
  } else if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      return parsed.toFixed(precision);
    }
  }
  return String(value);
};

const SleepMetrics = ({ sleepData }: SleepMetricsProps) => {
  const { session } = useAuth();
  
  const { data: sleepData, isLoading } = useQuery({
    queryKey: ["sleep_metrics", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("sleep_logs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(30);
      
      if (error) {
        console.error("Error fetching sleep data:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!session?.user?.id
  });
  
  const getDurationData = () => {
    if (!sleepData?.length) return [];
    
    return sleepData.slice(0, 14).map(entry => ({
      date: format(new Date(entry.created_at), "MMM dd"),
      hours: entry.sleep_duration || 0,
      target: entry.target_duration || 8
    })).reverse();
  };
  
  const getQualityData = () => {
    if (!sleepData?.length) return [];
    
    return sleepData.slice(0, 14).map(entry => ({
      date: format(new Date(entry.created_at), "MMM dd"),
      quality: entry.sleep_quality || 0,
      target: 8
    })).reverse();
  };
  
  const getCompositionData = () => {
    if (!sleepData?.length) return [];
    
    const recentData = sleepData.slice(0, 7);
    
    const avgDeep = recentData.reduce((sum, entry) => sum + (entry.deep_percentage || 0), 0) / recentData.length;
    const avgRem = recentData.reduce((sum, entry) => sum + (entry.rem_percentage || 0), 0) / recentData.length;
    const avgLight = recentData.reduce((sum, entry) => sum + (entry.light_percentage || 0), 0) / recentData.length;
    const avgAwake = recentData.reduce((sum, entry) => sum + (entry.awake_percentage || 0), 0) / recentData.length;
    
    return [
      { name: "Deep Sleep", value: avgDeep, color: "#4C51BF" },
      { name: "REM Sleep", value: avgRem, color: "#ED64A6" },
      { name: "Light Sleep", value: avgLight, color: "#48BB78" },
      { name: "Awake", value: avgAwake, color: "#ECC94B" }
    ];
  };
  
  const getTimingData = () => {
    if (!sleepData?.length) return [];
    
    return sleepData.slice(0, 14).map(entry => {
      const bedtimeHours = entry.bedtime ? 
        parseTimeStringToDecimal(entry.bedtime) : null;
      
      const wakeTimeHours = entry.wake_time ? 
        parseTimeStringToDecimal(entry.wake_time) : null;
      
      return {
        date: format(new Date(entry.created_at), "MMM dd"),
        bedtime: bedtimeHours,
        wakeTime: wakeTimeHours
      };
    }).reverse();
  };
  
  const parseTimeStringToDecimal = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours + (minutes / 60);
  };
  
  const calculateMetrics = () => {
    if (!sleepData || sleepData.length === 0) {
      return { avgDuration: 0, avgQuality: 0, consistency: 0, avgDeep: 0 };
    }
    
    const durationValues = sleepData.map(entry => entry.sleep_duration || 0);
    const qualityValues = sleepData.map(entry => entry.sleep_quality || 0);
    const deepSleepValues = sleepData.map(entry => entry.deep_percentage || 0);
    
    const avgDuration = durationValues.reduce((sum, val) => sum + val, 0) / durationValues.length;
    const avgQuality = qualityValues.reduce((sum, val) => sum + val, 0) / qualityValues.length;
    const avgDeep = deepSleepValues.reduce((sum, val) => sum + val, 0) / deepSleepValues.length;
    
    const durationVariance = durationValues.reduce((sum, val) => {
      const diff = val - avgDuration;
      return sum + (diff * diff);
    }, 0) / durationValues.length;
    
    const durationStdDev = Math.sqrt(durationVariance);
    const consistency = Math.max(0, 100 - (durationStdDev * 20));
    
    return { avgDuration, avgQuality, consistency, avgDeep };
  };
  
  const metrics = calculateMetrics();
  
  if (isLoading) {
    return <div className="p-6 text-center text-muted-foreground">Loading sleep metrics...</div>;
  }
  
  if (!sleepData || sleepData.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No sleep data available yet. Start tracking your sleep to see metrics.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sleep Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgDuration.toFixed(1)}h</div>
            <div className="text-xs text-muted-foreground text-center">
              Average: {formatValue(metrics.avgDuration, 1)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sleep Quality</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.avgQuality * 10).toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground text-center">
              Average: {formatValue(metrics.avgQuality * 10, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sleep Consistency</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.consistency.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground text-center">
              Average: {formatValue(metrics.consistency, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deep Sleep</CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgDeep.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground text-center">
              Average: {formatValue(metrics.avgDeep, 0)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="duration" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="duration" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Duration</span>
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Quality</span>
          </TabsTrigger>
          <TabsTrigger value="composition" className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span className="hidden sm:inline">Composition</span>
          </TabsTrigger>
          <TabsTrigger value="timing" className="flex items-center gap-2">
            <Bed className="h-4 w-4" />
            <span className="hidden sm:inline">Timing</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="duration">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Duration Trends</CardTitle>
              <CardDescription>Your sleep duration over the last 14 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getDurationData()}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" name="Sleep Duration" fill="#8884d8" />
                    <Line dataKey="target" name="Target" stroke="#ff7300" strokeWidth={2} dot={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Quality Trends</CardTitle>
              <CardDescription>Your sleep quality over the last 14 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getQualityData()}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} label={{ value: 'Quality (1-10)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="quality" 
                      name="Sleep Quality" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      name="Target Quality" 
                      stroke="#ff7300" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="composition">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Composition</CardTitle>
              <CardDescription>Average sleep stages breakdown (last 7 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getCompositionData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      label={({name, value}) => `${name}: ${formatValue(value)}%`}
                    >
                      {getCompositionData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Percentage']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timing">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Timing</CardTitle>
              <CardDescription>Your bedtime and wake time patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getTimingData()}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                    <XAxis dataKey="date" />
                    <YAxis 
                      domain={[0, 24]} 
                      ticks={[0, 6, 12, 18, 24]} 
                      tickFormatter={(hour) => {
                        if (hour === 0 || hour === 24) return "12am";
                        if (hour < 12) return `${hour}am`;
                        if (hour === 12) return "12pm";
                        return `${hour - 12}pm`;
                      }}
                      label={{ value: 'Time of Day', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip 
                      formatter={(value) => {
                        const hour = Math.floor(value as number);
                        const minute = Math.round(((value as number) - hour) * 60);
                        const period = hour < 12 || hour === 24 ? 'AM' : 'PM';
                        const hour12 = hour === 0 || hour === 24 ? 12 : hour > 12 ? hour - 12 : hour;
                        return [`${hour12}:${minute.toString().padStart(2, '0')} ${period}`, ''];
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="bedtime" 
                      name="Bedtime" 
                      stroke="#4C51BF" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="wakeTime" 
                      name="Wake Time" 
                      stroke="#F56565" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SleepMetrics;
