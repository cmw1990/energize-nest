
import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NicotineTracker } from "@/components/nicotine/NicotineTracker";
import { NicotineChart } from "@/components/nicotine/NicotineChart";
import { Cigarette, BarChart, Clock, Leaf, Flag, Calendar, Target, ExternalLink } from "lucide-react";
import { format, subDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const Nicotine = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "3months">("week");
  
  const startDate = React.useMemo(() => {
    let days = 7;
    if (timeRange === "month") days = 30;
    if (timeRange === "3months") days = 90;
    
    return format(subDays(new Date(), days), "yyyy-MM-dd");
  }, [timeRange]);
  
  const { data: nicotineLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['nicotine-chart-data', timeRange],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('nicotine_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('date', startDate)
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      // Process data for chart
      return data?.map(log => ({
        date: format(new Date(log.date), 'MM/dd'),
        amount: log.amount,
        energy: log.energy_impact,
        mood: log.mood_impact
      })) || [];
    },
    enabled: !!session?.user?.id,
  });
  
  const { data: quitAttempt } = useQuery({
    queryKey: ['quit-attempt'],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('quit_attempts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_date', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });
  
  const { data: usageSummary } = useQuery({
    queryKey: ['nicotine-summary', timeRange],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('nicotine_logs')
        .select('amount, product_type, energy_impact, mood_impact')
        .eq('user_id', session.user.id)
        .gte('date', startDate);
      
      if (error) throw error;
      
      if (!data || data.length === 0) return null;
      
      // Calculate summary
      const totalAmount = data.reduce((sum, log) => sum + (log.amount || 0), 0);
      const avgEnergy = data.reduce((sum, log) => sum + (log.energy_impact || 5), 0) / data.length;
      const avgMood = data.reduce((sum, log) => sum + (log.mood_impact || 5), 0) / data.length;
      
      // Group by product type
      const productTypes: Record<string, number> = {};
      data.forEach(log => {
        const type = log.product_type || 'unknown';
        productTypes[type] = (productTypes[type] || 0) + (log.amount || 0);
      });
      
      return {
        totalAmount,
        avgEnergy,
        avgMood,
        productTypes,
        daysLogged: new Set(data.map(log => log.date)).size
      };
    },
    enabled: !!session?.user?.id,
  });
  
  const calculateDaysSince = () => {
    if (!quitAttempt) return 0;
    const startDate = new Date(quitAttempt.start_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const daysSinceQuit = calculateDaysSince();
  
  const getMilestoneProgress = () => {
    if (!daysSinceQuit) return { current: 0, next: 1, progress: 0 };
    
    const milestones = [1, 3, 7, 14, 30, 60, 90, 180, 365];
    let current = 0;
    let next = milestones[0];
    
    for (let i = milestones.length - 1; i >= 0; i--) {
      if (daysSinceQuit >= milestones[i]) {
        current = milestones[i];
        next = milestones[i + 1] || current * 2;
        break;
      }
    }
    
    // If not yet reached first milestone
    if (current === 0) {
      current = 0;
      next = milestones[0];
    }
    
    const progress = ((daysSinceQuit - current) / (next - current)) * 100;
    return { current, next, progress: Math.min(100, Math.max(0, progress)) };
  };
  
  const renderProductTypeSummary = () => {
    if (!usageSummary || !usageSummary.productTypes) return null;
    
    const types = Object.entries(usageSummary.productTypes).sort((a, b) => b[1] - a[1]);
    
    return (
      <div className="space-y-2">
        {types.map(([type, count]) => (
          <div key={type} className="flex items-center justify-between">
            <span className="text-sm capitalize">{type}</span>
            <Badge variant="outline">{count}</Badge>
          </div>
        ))}
      </div>
    );
  };
  
  const getTriggerToAvoid = () => {
    return "Stress/Anxiety";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Nicotine Tracker</h1>
        <div className="flex items-center gap-2 text-primary">
          <Leaf className="h-5 w-5" />
          <span className="font-medium">Mission Fresh</span>
        </div>
      </div>
      
      {quitAttempt && (
        <Card className="border-green-200 dark:border-green-900 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Flag className="h-5 w-5 text-green-600" />
                  <span>Quit Journey</span>
                </h2>
                <p className="text-sm text-muted-foreground">
                  You started your fresh journey on {format(new Date(quitAttempt.start_date), "MMMM d, yyyy")}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="rounded-full border-4 border-primary w-16 h-16 flex items-center justify-center bg-white dark:bg-background">
                  <span className="text-xl font-bold">{daysSinceQuit}</span>
                </div>
                <div>
                  <div className="font-medium">Days</div>
                  <div className="text-sm text-muted-foreground">Fresh & Free</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current: {getMilestoneProgress().current} days</span>
                <span>Next: {getMilestoneProgress().next} days</span>
              </div>
              <Progress value={getMilestoneProgress().progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="track" className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="track" className="flex items-center gap-2">
            <Cigarette className="h-4 w-4" />
            <span>Track</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Goals</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="track" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <NicotineTracker />
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {logsLoading ? (
                    <div className="py-8 text-center text-muted-foreground">
                      Loading your recent logs...
                    </div>
                  ) : nicotineLogs && nicotineLogs.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Date</span>
                        <span>Amount</span>
                      </div>
                      {nicotineLogs.slice(0, 5).map((log, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                          <span>{log.date}</span>
                          <Badge variant="outline">{log.amount}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      No recent nicotine logs found. Start tracking to see your data here.
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {!quitAttempt && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Flag className="h-5 w-5 text-primary" />
                      Ready to Go Fresh?
                    </CardTitle>
                    <CardDescription>Set a quit date to start your journey</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Setting a quit date is the first step to a fresher lifestyle. Our app will provide you with all the tools and support you need on your journey.
                    </p>
                    <Button className="w-full">Set Quit Date</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cigarette className="h-5 w-5 text-red-500" />
                  Usage Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Tracked</span>
                      <span className="text-2xl font-bold">{usageSummary?.totalAmount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Days Logged</span>
                      <span className="font-medium">{usageSummary?.daysLogged || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Daily Average</span>
                      <span className="font-medium">
                        {usageSummary ? (usageSummary.totalAmount / usageSummary.daysLogged).toFixed(1) : "0"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">By Product Type</h4>
                    {renderProductTypeSummary()}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-500" />
                  Primary Trigger
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="font-medium">{getTriggerToAvoid()}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your most common trigger during this period
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recommendation</h4>
                    <p className="text-sm text-muted-foreground">
                      Try a 5-minute breathing exercise when you feel stressed instead of reaching for nicotine.
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0 h-6" 
                      onClick={() => navigate("/app/breathing")}
                    >
                      Try breathing exercises →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-500" />
                  Wellbeing Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Energy Levels</span>
                      <span className="font-medium">
                        {usageSummary ? usageSummary.avgEnergy.toFixed(1) : "5"}/10
                      </span>
                    </div>
                    <Progress value={usageSummary ? (usageSummary.avgEnergy / 10) * 100 : 50} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mood Impact</span>
                      <span className="font-medium">
                        {usageSummary ? usageSummary.avgMood.toFixed(1) : "5"}/10
                      </span>
                    </div>
                    <Progress value={usageSummary ? (usageSummary.avgMood / 10) * 100 : 50} className="h-2" />
                  </div>
                  
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm text-muted-foreground">
                      {usageSummary?.avgEnergy > 7 ? 
                        "Nicotine appears to be improving your energy levels. Consider gradually reducing usage while maintaining energy through other means." : 
                        "Your energy levels may improve by reducing nicotine and focusing on natural energy boosters like exercise and proper sleep."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Usage Patterns
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant={timeRange === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("week")}
                >
                  Week
                </Button>
                <Button
                  variant={timeRange === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("month")}
                >
                  Month
                </Button>
                <Button
                  variant={timeRange === "3months" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("3months")}
                >
                  3 Months
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <NicotineChart data={nicotineLogs || []} isLoading={logsLoading} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-primary" />
                  Your Journey
                </CardTitle>
                <CardDescription>Track your progress toward a fresher life</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {quitAttempt ? (
                  <div className="space-y-6">
                    <div className="space-y-2 text-center">
                      <div className="text-4xl font-bold">{daysSinceQuit}</div>
                      <div className="text-muted-foreground">Days Fresh</div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Health Benefits Timeline</h4>
                      <div className="space-y-4">
                        <div className={`p-3 rounded-lg ${daysSinceQuit >= 1 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-muted'}`}>
                          <div className="flex items-center gap-2">
                            <Clock className={`h-4 w-4 ${daysSinceQuit >= 1 ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <span className="font-medium">20 minutes - 1 day</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Heart rate and blood pressure begin to drop
                          </p>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${daysSinceQuit >= 2 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-muted'}`}>
                          <div className="flex items-center gap-2">
                            <Clock className={`h-4 w-4 ${daysSinceQuit >= 2 ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <span className="font-medium">2-3 days</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Carbon monoxide levels in blood drop to normal
                          </p>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${daysSinceQuit >= 14 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-muted'}`}>
                          <div className="flex items-center gap-2">
                            <Clock className={`h-4 w-4 ${daysSinceQuit >= 14 ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <span className="font-medium">2 weeks</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Circulation and lung function improve
                          </p>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${daysSinceQuit >= 30 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-muted'}`}>
                          <div className="flex items-center gap-2">
                            <Clock className={`h-4 w-4 ${daysSinceQuit >= 30 ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <span className="font-medium">1 month</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Many smoking-related symptoms improve
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Set a quit date to begin tracking your fresh journey
                    </p>
                    <Button>Start Your Fresh Journey</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  Resources & Support
                </CardTitle>
                <CardDescription>Tools to help you stay fresh</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <h3 className="font-medium flex items-center gap-2">
                      <Battery className="h-4 w-4 text-green-500" />
                      Energy Support
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tools to manage energy levels during cravings
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0 h-6 mt-1" 
                      onClick={() => navigate("/app/focus")}
                    >
                      Access energy tools →
                    </Button>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted">
                    <h3 className="font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4 text-indigo-500" />
                      Focus Enhancement
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Improve concentration without nicotine
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0 h-6 mt-1" 
                      onClick={() => navigate("/app/focus")}
                    >
                      Access focus tools →
                    </Button>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted">
                    <h3 className="font-medium flex items-center gap-2">
                      <Wind className="h-4 w-4 text-blue-500" />
                      Craving Management
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Breathing techniques to reduce cravings
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0 h-6 mt-1" 
                      onClick={() => navigate("/app/breathing")}
                    >
                      Try breathing exercises →
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-primary/10">
                  <h3 className="font-medium mb-2">Need Additional Support?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Connect with professionals who specialize in nicotine cessation
                  </p>
                  <Button className="w-full" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Find Specialists
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Nicotine;
