import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { TopNav } from "@/components/layout/TopNav";
import {
  Trophy,
  Calendar,
  Heart,
  DollarSign,
  Lungs,
  Activity,
  Brain,
  Zap,
  BarChart,
  Clock,
  Users,
  Smile,
  ChevronRight,
  Wind
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Recovery() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user's current quit attempt details
  const { data: quitAttempt, isLoading: isLoadingQuitAttempt } = useQuery({
    queryKey: ['current-quit-attempt', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quit_attempts')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('start_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch the user's recovery milestones
  const { data: milestones, isLoading: isLoadingMilestones } = useQuery({
    queryKey: ['recovery-milestones', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recovery_milestones')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('achieved_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch the user's health metrics over time
  const { data: healthMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['recovery-health-metrics', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recovery_health_metrics')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('recorded_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch community support data
  const { data: communityStats, isLoading: isLoadingCommunity } = useQuery({
    queryKey: ['recovery-community-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recovery_community_stats')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const isLoading = isLoadingQuitAttempt || isLoadingMilestones || isLoadingMetrics || isLoadingCommunity;

  // Calculate various metrics
  const daysSince = quitAttempt
    ? Math.floor((new Date().getTime() - new Date(quitAttempt.start_date).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const hoursSince = quitAttempt
    ? Math.floor((new Date().getTime() - new Date(quitAttempt.start_date).getTime()) / (1000 * 60 * 60))
    : 0;

  const moneySaved = quitAttempt
    ? (daysSince * (quitAttempt.daily_cost || 10)).toFixed(2)
    : "0.00";

  // Calculate health score based on days since quitting (capped at 100%)
  const healthScore = Math.min(100, Math.floor(daysSince * 1.5));

  // Functions to get different milestone categories
  const getPhysicalMilestones = () => 
    milestones?.filter(m => m.milestone_category === 'physical') || [];
  
  const getMentalMilestones = () => 
    milestones?.filter(m => m.milestone_category === 'mental') || [];
  
  const getLifestyleMilestones = () => 
    milestones?.filter(m => m.milestone_category === 'lifestyle') || [];

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
        className="container mx-auto p-4 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="h-7 w-7 text-primary" />
              Recovery Journey
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your progress and celebrate each milestone on your path to better health
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button variant="outline" onClick={() => navigate('/app/sobriety')}>
              Back to Dashboard
            </Button>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 mr-4">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Days Free</h3>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{daysSince}</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">That's {hoursSince} hours of freedom!</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-3 mr-4">
                  <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Milestones</h3>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{milestones?.length || 0}</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Achievements unlocked on your journey</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 mr-4">
                  <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Health Score</h3>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{healthScore}%</p>
                  )}
                </div>
              </div>
              <Progress value={healthScore} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">Improving daily as you stay on track</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mr-4">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Money Saved</h3>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <p className="text-2xl font-bold">${moneySaved}</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Financial benefits since you quit</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="physical" className="flex items-center gap-1">
                <Lungs className="h-4 w-4" />
                <span className="hidden sm:inline">Physical</span>
                <span className="sm:hidden">Physical</span>
              </TabsTrigger>
              <TabsTrigger value="mental" className="flex items-center gap-1">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Mental</span>
                <span className="sm:hidden">Mental</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Recovery Timeline
                  </CardTitle>
                  <CardDescription>
                    Your journey to better health, one milestone at a time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      ))
                    ) : milestones?.length ? (
                      milestones.slice(0, 5).map((milestone) => (
                        <div key={milestone.id} className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Trophy className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{milestone.milestone_type}</p>
                              <Badge variant="outline" className="ml-2">
                                {milestone.milestone_category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {new Date(milestone.achieved_at).toLocaleDateString()}
                            </p>
                            {milestone.health_improvements && (
                              <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                                {milestone.health_improvements.map((improvement, i) => (
                                  <li key={i} className="text-muted-foreground">{improvement}</li>
                                ))}
                              </ul>
                            )}
                            {milestone.celebration_notes && (
                              <p className="mt-2 text-sm italic bg-muted/30 p-2 rounded-md">
                                "{milestone.celebration_notes}"
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                        <Trophy className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                        <h3 className="font-medium mb-1">No milestones reached yet</h3>
                        <p className="text-sm max-w-md">
                          Stay strong on your journey! Your first milestone is just around the corner.
                        </p>
                      </div>
                    )}

                    {milestones?.length > 5 && (
                      <div className="flex justify-center">
                        <Button variant="outline" onClick={() => setActiveTab("physical")}>
                          View All Milestones
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 mt-6 md:grid-cols-2">
                <Card className="border-primary/10 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lungs className="h-5 w-5 text-primary" />
                      Health Improvements
                    </CardTitle>
                    <CardDescription>
                      Physical changes happening in your body
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium">Circulation</span>
                        </div>
                        <div className="w-1/2">
                          <Progress value={Math.min(100, daysSince * 2)} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Lungs className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Lung Function</span>
                        </div>
                        <div className="w-1/2">
                          <Progress value={Math.min(100, daysSince)} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">Energy Levels</span>
                        </div>
                        <div className="w-1/2">
                          <Progress value={Math.min(100, daysSince * 1.5)} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Overall Health</span>
                        </div>
                        <div className="w-1/2">
                          <Progress value={healthScore} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/10 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Community Support
                    </CardTitle>
                    <CardDescription>
                      You're not alone on this journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center p-4 bg-muted/10 rounded-lg">
                        <h3 className="text-lg font-semibold mb-1">
                          {communityStats?.total_quitters?.toLocaleString() || "Many"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          People on the same journey as you
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-muted/10 rounded-lg">
                          <h3 className="text-base font-semibold mb-1">
                            {communityStats?.success_stories?.toLocaleString() || "Thousands"}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Success stories shared
                          </p>
                        </div>
                        
                        <div className="text-center p-4 bg-muted/10 rounded-lg">
                          <h3 className="text-base font-semibold mb-1">
                            {communityStats?.avg_quit_days || "XX"} days
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Average time smoke-free
                          </p>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => navigate('/app/community')}
                      >
                        Join Community Discussions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="physical">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lungs className="h-5 w-5 text-primary" />
                    Physical Recovery Milestones
                  </CardTitle>
                  <CardDescription>
                    Track how your body physically recovers over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      ))
                    ) : getPhysicalMilestones().length ? (
                      getPhysicalMilestones().map((milestone) => (
                        <div key={milestone.id} className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Lungs className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{milestone.milestone_type}</p>
                            <p className="text-sm text-muted-foreground mb-2">
                              {new Date(milestone.achieved_at).toLocaleDateString()}
                            </p>
                            {milestone.health_improvements && (
                              <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                                {milestone.health_improvements.map((improvement, i) => (
                                  <li key={i} className="text-muted-foreground">{improvement}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                        <Lungs className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                        <h3 className="font-medium mb-1">No physical milestones yet</h3>
                        <p className="text-sm max-w-md">
                          Your body is already starting to heal! Physical improvements will become noticeable soon.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mental">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Mental Health Improvements
                  </CardTitle>
                  <CardDescription>
                    Track your mental and emotional recovery journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      ))
                    ) : getMentalMilestones().length ? (
                      getMentalMilestones().map((milestone) => (
                        <div key={milestone.id} className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Brain className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{milestone.milestone_type}</p>
                            <p className="text-sm text-muted-foreground mb-2">
                              {new Date(milestone.achieved_at).toLocaleDateString()}
                            </p>
                            {milestone.health_improvements && (
                              <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                                {milestone.health_improvements.map((improvement, i) => (
                                  <li key={i} className="text-muted-foreground">{improvement}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                        <Brain className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                        <h3 className="font-medium mb-1">No mental milestones logged yet</h3>
                        <p className="text-sm max-w-md">
                          Mental clarity and emotional stability improve significantly as you continue on your journey.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-md mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smile className="h-5 w-5 text-primary" />
                    Mood Improvements
                  </CardTitle>
                  <CardDescription>
                    Track how your emotional state improves over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Anxiety Reduction</span>
                      </div>
                      <div className="w-1/2">
                        <Progress value={Math.min(100, daysSince * 1.2)} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-pink-500" />
                        <span className="text-sm font-medium">Mood Stability</span>
                      </div>
                      <div className="w-1/2">
                        <Progress value={Math.min(100, daysSince * 0.8)} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">Mental Clarity</span>
                      </div>
                      <div className="w-1/2">
                        <Progress value={Math.min(100, daysSince * 1.5)} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Smile className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Overall Happiness</span>
                      </div>
                      <div className="w-1/2">
                        <Progress value={Math.min(100, daysSince)} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Financial Benefits
              </CardTitle>
              <CardDescription>
                The money you've saved by staying smoke-free
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Daily Savings</span>
                  <span className="font-bold">${quitAttempt?.daily_cost || 10}.00</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Savings</span>
                  <span className="font-bold">${moneySaved}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Monthly Projection</span>
                  <span className="font-bold">${((quitAttempt?.daily_cost || 10) * 30).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Yearly Projection</span>
                  <span className="font-bold">${((quitAttempt?.daily_cost || 10) * 365).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">5-Year Projection</span>
                  <span className="font-bold">${((quitAttempt?.daily_cost || 10) * 365 * 5).toFixed(2)}</span>
                </div>
                
                <div className="p-4 bg-muted/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    Consider setting aside some of your savings as a reward for your commitment to better health!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Time Reclaimed
              </CardTitle>
              <CardDescription>
                The time you've gained back in your life
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Smoke Breaks Avoided</span>
                  <span className="font-bold">{daysSince * 15}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Hours Saved</span>
                  <span className="font-bold">{(daysSince * 1.5).toFixed(1)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Days Added to Life</span>
                  <span className="font-bold">{(daysSince * 0.1).toFixed(1)}</span>
                </div>
                
                <div className="p-4 bg-muted/10 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Did you know?</h4>
                  <p className="text-sm text-muted-foreground">
                    The average smoker spends about 1.5 hours per day on smoke breaks and related activities.
                    By quitting, you've already gained back {(daysSince * 1.5).toFixed(1)} hours of your life!
                  </p>
                </div>
                
                <Button variant="outline" className="w-full" onClick={() => navigate('/app/activities')}>
                  Find Activities for Your Reclaimed Time
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
