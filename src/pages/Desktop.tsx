
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EisenhowerMatrix } from '@/components/focus/EisenhowerMatrix';
import { Button } from '@/components/ui/button';
import { LifestyleInsights } from '@/components/desktop/LifestyleInsights';
import { Clock, CircleUser, Workflow, FolderKanban, GanttChart, Grid3X3, Map, Pencil, Gamepad, Battery, Calendar, Activity, Sun, Moon, PieChart, Brain, LayoutDashboard } from 'lucide-react';
import { TaskList } from '@/components/desktop/TaskList';
import { DigitalClock } from '@/components/desktop/DigitalClock';
import { CalendarView } from '@/components/desktop/CalendarView';
import { NotePad } from '@/components/desktop/NotePad';
import { GameAssetsGenerator } from '@/components/GameAssetsGenerator';
import { MoodOverview } from '@/components/MoodOverview';
import { ADHDTaskManager } from '@/components/focus/ADHDTaskManager';
import { FocusAnalyticsDashboard } from '@/components/focus/FocusAnalyticsDashboard';
import { FocusAchievements } from '@/components/focus/FocusAchievements';
import { FocusTimerTools } from '@/components/focus/FocusTimerTools';
import { FocusEnvironment } from '@/components/focus/FocusEnvironment';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TopNav } from '@/components/layout/TopNav';
import { motion } from 'framer-motion';

export default function Desktop() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('morning');
    } else if (hour >= 12 && hour < 17) {
      setTimeOfDay('afternoon');
    } else if (hour >= 17 && hour < 21) {
      setTimeOfDay('evening');
    } else {
      setTimeOfDay('night');
    }
  }, []);

  const { data: userData } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const { data: focusStats } = useQuery({
    queryKey: ['focus-stats', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('duration')
        .eq('user_id', session.user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      
      // Calculate total focus time in minutes
      const totalMinutes = data.reduce((sum, session) => sum + (session.duration || 0), 0);
      
      return {
        totalSessions: data.length,
        totalMinutes,
        averageSession: data.length ? Math.round(totalMinutes / data.length) : 0
      };
    },
    enabled: !!session?.user?.id
  });

  const { data: energyLevel } = useQuery({
    queryKey: ['energy-level', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('energy_logs')
        .select('energy_level')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data?.energy_level || 70; // Default to 70% if no data
    },
    enabled: !!session?.user?.id
  });

  const getTimeBasedGreeting = () => {
    const name = userData?.first_name || 'there';
    
    switch (timeOfDay) {
      case 'morning':
        return `Good morning, ${name}!`;
      case 'afternoon':
        return `Good afternoon, ${name}!`;
      case 'evening':
        return `Good evening, ${name}!`;
      case 'night':
        return `Good night, ${name}!`;
      default:
        return `Hello, ${name}!`;
    }
  };

  const getTimeBasedSuggestion = () => {
    switch (timeOfDay) {
      case 'morning':
        return "Start your day with intention and energy";
      case 'afternoon':
        return "Stay focused and maintain your momentum";
      case 'evening':
        return "Wind down and reflect on your day's achievements";
      case 'night':
        return "Prepare for restorative sleep to recharge";
      default:
        return "Make the most of your time today";
    }
  };

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <Sun className="h-5 w-5 text-amber-500" />;
      case 'afternoon':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'evening':
        return <Sun className="h-5 w-5 text-orange-500" />;
      case 'night':
        return <Moon className="h-5 w-5 text-indigo-500" />;
      default:
        return <Clock className="h-5 w-5 text-primary" />;
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container mx-auto p-6 space-y-6">
          <Card className="border-primary/10 shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center text-center p-8">
                <CircleUser className="h-16 w-16 text-primary mb-4 opacity-80" />
                <h1 className="text-2xl font-bold mb-4">Welcome to Energy Support</h1>
                <p className="mb-8 text-muted-foreground max-w-md">
                  Sign in to access your personal energy dashboard, track your progress, and get personalized recommendations.
                </p>
                <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-sm transition-all">
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <motion.div 
        className="container mx-auto p-4 md:p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <LayoutDashboard className="h-7 w-7 text-primary" />
              Desktop
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              {getTimeIcon()}
              <span>{getTimeBasedGreeting()} {getTimeBasedSuggestion()}</span>
            </div>
          </div>
          
          <DigitalClock className="text-lg md:text-xl font-semibold" />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 hover:shadow-md transition-shadow border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Battery className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">Current Energy Level</h2>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold">{energyLevel}%</span>
                </div>
              </div>
              <div className="w-full bg-primary/10 rounded-full h-4 mb-4">
                <div 
                  className="bg-primary rounded-full h-4 transition-all duration-1000"
                  style={{ width: `${energyLevel}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Low Energy</span>
                <span>High Energy</span>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" onClick={() => navigate('/app/energy-assessment')}>
                  <Activity className="h-4 w-4 mr-2" />
                  Update Energy Level
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-semibold">Focus Stats</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Focus Sessions</span>
                      <span className="font-semibold">{focusStats?.totalSessions || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Minutes</span>
                      <span className="font-semibold">{focusStats?.totalMinutes || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg. Session</span>
                      <span className="font-semibold">{focusStats?.averageSession || 0} min</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => navigate('/app/focus')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Start Focus Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:inline">Dashboard</span>
                <span className="md:hidden">Home</span>
              </TabsTrigger>
              <TabsTrigger value="productivity" className="flex items-center gap-2">
                <Workflow className="h-4 w-4" />
                <span className="hidden md:inline">Productivity</span>
                <span className="md:hidden">Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden md:inline">Calendar</span>
                <span className="md:hidden">Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span className="hidden md:inline">Insights</span>
                <span className="md:hidden">Stats</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MoodOverview />
                <TaskList />
              </div>

              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Battery className="h-5 w-5 text-primary" />
                    Energy Support Tools
                  </CardTitle>
                  <CardDescription>
                    Quick access to tools for managing your energy levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-auto flex flex-col items-center justify-center p-4 gap-2"
                      onClick={() => navigate('/app/energy-plans')}
                    >
                      <GanttChart className="h-6 w-6 text-primary" />
                      <span className="text-sm">Energy Plans</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto flex flex-col items-center justify-center p-4 gap-2"
                      onClick={() => navigate('/app/focus')}
                    >
                      <Brain className="h-6 w-6 text-purple-500" />
                      <span className="text-sm">Focus Timer</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto flex flex-col items-center justify-center p-4 gap-2"
                      onClick={() => navigate('/app/sleep')}
                    >
                      <Moon className="h-6 w-6 text-blue-500" />
                      <span className="text-sm">Sleep Tools</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto flex flex-col items-center justify-center p-4 gap-2"
                      onClick={() => navigate('/app/supplements')}
                    >
                      <Activity className="h-6 w-6 text-green-500" />
                      <span className="text-sm">Supplements</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <FocusTimerTools />
            </TabsContent>
            
            <TabsContent value="productivity" className="space-y-6">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-primary" />
                    Task Management
                  </CardTitle>
                  <CardDescription>
                    Organize your tasks with our ADHD-friendly interface
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ADHDTaskManager />
                </CardContent>
              </Card>
              
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid3X3 className="h-5 w-5 text-primary" />
                    Priority Matrix
                  </CardTitle>
                  <CardDescription>
                    Organize tasks by importance and urgency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EisenhowerMatrix />
                </CardContent>
              </Card>
              
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pencil className="h-5 w-5 text-primary" />
                    Quick Notes
                  </CardTitle>
                  <CardDescription>
                    Capture your thoughts and ideas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NotePad />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calendar" className="space-y-6">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Calendar
                  </CardTitle>
                  <CardDescription>
                    View and manage your schedule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CalendarView />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-6">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Focus Analytics
                  </CardTitle>
                  <CardDescription>
                    Detailed analysis of your focus patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FocusAnalyticsDashboard />
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-primary/10 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Achievements
                    </CardTitle>
                    <CardDescription>
                      Track your progress and celebrate your wins
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FocusAchievements />
                  </CardContent>
                </Card>
                
                <Card className="border-primary/10 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="h-5 w-5 text-primary" />
                      Lifestyle Insights
                    </CardTitle>
                    <CardDescription>
                      Understand factors affecting your energy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LifestyleInsights />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad className="h-5 w-5 text-primary" />
                Quick Break
              </CardTitle>
              <CardDescription>
                Take a short mental break to refresh your mind
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Gamepad className="h-5 w-5 text-pink-500" />
                      <h3 className="font-medium">Balloon Adventure</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      A breath-controlled journey through the clouds
                    </p>
                    <Button 
                      onClick={() => navigate("/app/breathing-balloon")}
                      size="sm"
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    >
                      <Gamepad className="mr-2 h-4 w-4" />
                      Play Now
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Activity className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Breathing Exercise</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Guided breathing to reduce stress and anxiety
                    </p>
                    <Button 
                      onClick={() => navigate("/app/breathing")}
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    >
                      <Activity className="mr-2 h-4 w-4" />
                      Start Breathing
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Brain className="h-5 w-5 text-emerald-500" />
                      <h3 className="font-medium">Brain Games</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Fun cognitive exercises to sharpen your mind
                    </p>
                    <Button 
                      onClick={() => navigate("/app/brain-games")}
                      size="sm"
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Play Games
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
