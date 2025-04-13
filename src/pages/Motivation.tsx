
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DailyMotivation } from "@/components/motivation/DailyMotivation";
import { MotivationStats } from "@/components/motivation/MotivationStats";
import { AchievementWall } from "@/components/motivation/AchievementWall";
import { MotivationJournal } from "@/components/motivation/MotivationJournal";
import { VisionBoard } from "@/components/motivation/VisionBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, Lightbulb, Brain, Target, Rocket, ArrowUpRight, Trophy, 
  ScrollText, ImagePlus, Star, Clock, Calendar, BookOpen, BadgeCheck,
  Heart, Briefcase, DollarSign
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const Motivation = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState("personal");
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fetch user's motivational goals
  const { data: goals, isLoading: isLoadingGoals } = useQuery({
    queryKey: ['motivation-goals', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('motivation_goals')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  // Fetch user's motivational achievements
  const { data: achievements, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ['motivation-achievements', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('motivation_achievements')
        .select('*')
        .eq('user_id', session.user.id)
        .order('achieved_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  // Fetch personalized motivation tips
  const { data: motivationTips } = useQuery({
    queryKey: ['motivation-tips'],
    queryFn: async () => {
      const tips = [
        {
          id: 1,
          title: "Morning Routine Impact",
          description: "Starting your day with intention sets the tone for productivity",
          icon: Lightbulb,
          color: "text-amber-500",
          bgColor: "bg-amber-50",
        },
        {
          id: 2,
          title: "Mindfulness Breaks",
          description: "Short mental breaks improve focus and reduce burnout",
          icon: Brain,
          color: "text-purple-500",
          bgColor: "bg-purple-50",
        },
        {
          id: 3,
          title: "Goal Visualization",
          description: "Regularly visualizing your goals increases achievement rates",
          icon: Target,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
        },
        {
          id: 4,
          title: "Progress Celebration",
          description: "Celebrating small wins boosts dopamine and motivation",
          icon: Rocket,
          color: "text-emerald-500",
          bgColor: "bg-emerald-50",
        },
      ];
      
      return tips;
    }
  });

  // Add new goal mutation
  const addGoalMutation = useMutation({
    mutationFn: async (newGoal: any) => {
      const { data, error } = await supabase
        .from('motivation_goals')
        .insert({
          user_id: session?.user?.id,
          title: newGoal.title,
          description: newGoal.description,
          deadline: newGoal.deadline,
          category: newGoal.category,
          progress: 0,
          status: 'active'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motivation-goals'] });
      toast({
        title: "Goal Added",
        description: "Your new goal has been added successfully.",
      });
      setIsGoalDialogOpen(false);
      resetGoalForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add goal. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding goal:", error);
    },
  });

  // Update goal progress mutation
  const updateGoalProgressMutation = useMutation({
    mutationFn: async ({ goalId, progress }: { goalId: string; progress: number }) => {
      const { data, error } = await supabase
        .from('motivation_goals')
        .update({ 
          progress,
          status: progress >= 100 ? 'completed' : 'active'
        })
        .eq('id', goalId)
        .select()
        .single();
      
      if (error) throw error;
      
      // If goal is completed, create an achievement
      if (progress >= 100) {
        const goal = goals?.find(g => g.id === goalId);
        
        if (goal) {
          const { error: achievementError } = await supabase
            .from('motivation_achievements')
            .insert({
              user_id: session?.user?.id,
              title: `Completed: ${goal.title}`,
              description: goal.description,
              achieved_at: new Date().toISOString(),
              category: goal.category,
              associated_goal_id: goalId
            });
          
          if (achievementError) console.error("Error creating achievement:", achievementError);
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motivation-goals'] });
      queryClient.invalidateQueries({ queryKey: ['motivation-achievements'] });
      toast({
        title: "Progress Updated",
        description: "Your goal progress has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating goal progress:", error);
    },
  });

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a goal title.",
        variant: "destructive",
      });
      return;
    }
    
    addGoalMutation.mutate({
      title: newGoalTitle,
      description: newGoalDescription,
      deadline: newGoalDeadline || null,
      category: newGoalCategory
    });
  };

  const handleUpdateProgress = (goalId: string, newProgress: number) => {
    updateGoalProgressMutation.mutate({
      goalId,
      progress: Math.min(100, Math.max(0, newProgress))
    });
  };

  const resetGoalForm = () => {
    setNewGoalTitle("");
    setNewGoalDescription("");
    setNewGoalDeadline("");
    setNewGoalCategory("personal");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal':
        return <Star className="h-4 w-4 text-amber-500" />;
      case 'health':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'career':
        return <Briefcase className="h-4 w-4 text-blue-500" />;
      case 'education':
        return <BookOpen className="h-4 w-4 text-purple-500" />;
      case 'financial':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal':
        return "bg-amber-100 text-amber-800";
      case 'health':
        return "bg-red-100 text-red-800";
      case 'career':
        return "bg-blue-100 text-blue-800";
      case 'education':
        return "bg-purple-100 text-purple-800";
      case 'financial':
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Animation variants for staggered loading
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

  const filteredGoals = goals?.filter(goal => {
    if (!searchQuery) return true;
    return (
      goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <motion.div 
        className="container mx-auto p-4 space-y-8"
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
              <Sparkles className="h-7 w-7 text-primary" />
              Motivation Center
            </h1>
            <p className="text-muted-foreground mt-1">
              Tools to keep you motivated and focused on your wellness journey
            </p>
          </div>
          <div className="w-full md:w-auto flex gap-2">
            <Input
              placeholder="Search goals and achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-sm transition-all">
                  <Target className="mr-2 h-4 w-4" />
                  New Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                  <DialogDescription>
                    Set a clear, achievable goal to stay motivated
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Goal Title</label>
                    <Input
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      placeholder="What do you want to achieve?"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description (optional)</label>
                    <Textarea
                      value={newGoalDescription}
                      onChange={(e) => setNewGoalDescription(e.target.value)}
                      placeholder="Add details about your goal..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select
                        value={newGoalCategory}
                        onChange={(e) => setNewGoalCategory(e.target.value)}
                        className="w-full p-2 rounded-md border border-input bg-background"
                      >
                        <option value="personal">Personal</option>
                        <option value="health">Health</option>
                        <option value="career">Career</option>
                        <option value="education">Education</option>
                        <option value="financial">Financial</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Deadline (optional)</label>
                      <Input
                        type="date"
                        value={newGoalDeadline}
                        onChange={(e) => setNewGoalDeadline(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddGoal} disabled={addGoalMutation.isPending}>
                    {addGoalMutation.isPending ? "Creating..." : "Create Goal"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="hidden md:inline">Dashboard</span>
                <span className="md:hidden">Home</span>
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden md:inline">Goals</span>
                <span className="md:hidden">Goals</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden md:inline">Achievements</span>
                <span className="md:hidden">Achieve</span>
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex items-center gap-2">
                <ScrollText className="h-4 w-4" />
                <span className="hidden md:inline">Journal</span>
                <span className="md:hidden">Journal</span>
              </TabsTrigger>
              <TabsTrigger value="vision" className="flex items-center gap-2">
                <ImagePlus className="h-4 w-4" />
                <span className="hidden md:inline">Vision Board</span>
                <span className="md:hidden">Vision</span>
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span className="hidden md:inline">Motivation Tips</span>
                <span className="md:hidden">Tips</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <motion.div variants={itemVariants}>
                  <DailyMotivation />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <MotivationStats />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <Card className="border-primary/10 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Current Goals
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setActiveTab("goals")}
                        variant="outline"
                      >
                        View All
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Track your progress on active goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingGoals ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse flex space-x-4">
                            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                            <div className="flex-1 space-y-2 py-1">
                              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                              <div className="h-2 bg-slate-200 rounded w-full"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : goals?.filter(goal => goal.status === 'active').length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center p-8">
                        <Target className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                        <h3 className="font-medium mb-1">No active goals</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Set some goals to track your progress and stay motivated
                        </p>
                        <Button
                          onClick={() => setIsGoalDialogOpen(true)}
                          className="bg-gradient-to-r from-primary to-primary/80"
                        >
                          Create Your First Goal
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {goals
                          ?.filter(goal => goal.status === 'active')
                          .slice(0, 3)
                          .map((goal) => (
                            <div key={goal.id} className="space-y-2">
                              <div className="flex items-center gap-2">
                                {getCategoryIcon(goal.category)}
                                <h3 className="font-medium">{goal.title}</h3>
                                <Badge
                                  variant="outline"
                                  className={`ml-auto ${getCategoryColor(goal.category)}`}
                                >
                                  {goal.category}
                                </Badge>
                              </div>
                              {goal.description && (
                                <p className="text-sm text-muted-foreground pl-6">
                                  {goal.description}
                                </p>
                              )}
                              <div className="pl-6 space-y-1">
                                <div className="flex justify-between items-center text-sm">
                                  <span>Progress</span>
                                  <span>{goal.progress}%</span>
                                </div>
                                <Progress value={goal.progress} />
                              </div>
                              <div className="pl-6 flex justify-between items-center">
                                {goal.deadline && (
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>
                                      Due {new Date(goal.deadline).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateProgress(goal.id, goal.progress + 10)}
                                >
                                  Update Progress
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-primary/10 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Recent Achievements
                    </CardTitle>
                    <CardDescription>
                      Celebrate your progress and successes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingAchievements ? (
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="animate-pulse flex space-x-4">
                            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                            <div className="flex-1 space-y-2 py-1">
                              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : achievements?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center p-8">
                        <Trophy className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                        <h3 className="font-medium mb-1">No achievements yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Complete goals to earn achievements and track your progress
                        </p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {achievements?.slice(0, 4).map((achievement) => (
                          <Card key={achievement.id} className="bg-white/80 hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <BadgeCheck className="h-5 w-5 text-primary" />
                                <h3 className="font-medium text-sm">{achievement.title}</h3>
                              </div>
                              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                <Badge
                                  variant="outline"
                                  className={getCategoryColor(achievement.category)}
                                >
                                  {achievement.category}
                                </Badge>
                                <span>
                                  {new Date(achievement.achieved_at).toLocaleDateString()}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="goals" className="space-y-6">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Your Goals
                    </div>
                    <Button onClick={() => setIsGoalDialogOpen(true)}>
                      <Target className="mr-2 h-4 w-4" />
                      Add Goal
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Set, track, and achieve your personal goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="active" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="active">Active Goals</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                      <TabsTrigger value="all">All Goals</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="active" className="space-y-4">
                      {isLoadingGoals ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse flex space-x-4">
                              <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                              <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                                <div className="h-2 bg-slate-200 rounded w-full"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : filteredGoals?.filter(goal => goal.status === 'active').length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center p-8">
                          <Target className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                          <h3 className="font-medium mb-1">No active goals</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Set some goals to track your progress and stay motivated
                          </p>
                          <Button
                            onClick={() => setIsGoalDialogOpen(true)}
                            className="bg-gradient-to-r from-primary to-primary/80"
                          >
                            Create Your First Goal
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {filteredGoals
                            ?.filter(goal => goal.status === 'active')
                            .map((goal) => (
                              <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2">
                                  {getCategoryIcon(goal.category)}
                                  <h3 className="font-medium">{goal.title}</h3>
                                  <Badge
                                    variant="outline"
                                    className={`ml-auto ${getCategoryColor(goal.category)}`}
                                  >
                                    {goal.category}
                                  </Badge>
                                </div>
                                {goal.description && (
                                  <p className="text-sm text-muted-foreground mt-2 pl-6">
                                    {goal.description}
                                  </p>
                                )}
                                <div className="mt-4 pl-6 space-y-1">
                                  <div className="flex justify-between items-center text-sm">
                                    <span>Progress</span>
                                    <span>{goal.progress}%</span>
                                  </div>
                                  <Progress value={goal.progress} />
                                </div>
                                <div className="mt-4 pl-6 flex flex-wrap justify-between items-center gap-2">
                                  {goal.deadline && (
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      <span>
                                        Due {new Date(goal.deadline).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleUpdateProgress(goal.id, goal.progress - 10)}
                                      disabled={goal.progress <= 0}
                                    >
                                      -10%
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleUpdateProgress(goal.id, goal.progress + 10)}
                                      disabled={goal.progress >= 100}
                                    >
                                      +10%
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleUpdateProgress(goal.id, 100)}
                                      className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                    >
                                      <BadgeCheck className="mr-2 h-4 w-4" />
                                      Complete
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="completed" className="space-y-4">
                      {isLoadingGoals ? (
                        <div className="space-y-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="animate-pulse flex space-x-4">
                              <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                              <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : filteredGoals?.filter(goal => goal.status === 'completed').length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center p-8">
                          <Trophy className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                          <h3 className="font-medium mb-1">No completed goals yet</h3>
                          <p className="text-sm text-muted-foreground">
                            Your completed goals will appear here
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredGoals
                            ?.filter(goal => goal.status === 'completed')
                            .map((goal) => (
                              <div key={goal.id} className="border rounded-lg p-4 bg-green-50/50">
                                <div className="flex items-center gap-2">
                                  <BadgeCheck className="h-5 w-5 text-green-600" />
                                  <h3 className="font-medium">{goal.title}</h3>
                                  <Badge
                                    variant="outline"
                                    className={`ml-auto ${getCategoryColor(goal.category)}`}
                                  >
                                    {goal.category}
                                  </Badge>
                                </div>
                                {goal.description && (
                                  <p className="text-sm text-muted-foreground mt-2 pl-6">
                                    {goal.description}
                                  </p>
                                )}
                                <div className="mt-2 pl-6 space-y-1">
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-green-700">Completed!</span>
                                    <span>{goal.progress}%</span>
                                  </div>
                                  <Progress value={100} className="bg-green-200" />
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="all" className="space-y-4">
                      {isLoadingGoals ? (
                        <div className="space-y-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse flex space-x-4">
                              <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                              <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : filteredGoals?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center p-8">
                          <Target className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                          <h3 className="font-medium mb-1">No goals found</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Add some goals to get started
                          </p>
                          <Button onClick={() => setIsGoalDialogOpen(true)}>
                            Create New Goal
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredGoals?.map((goal) => (
                            <div 
                              key={goal.id} 
                              className={`border rounded-lg p-4 ${
                                goal.status === 'completed' ? 'bg-green-50/50' : 'hover:shadow-md transition-shadow'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {goal.status === 'completed' ? (
                                  <BadgeCheck className="h-5 w-5 text-green-600" />
                                ) : (
                                  getCategoryIcon(goal.category)
                                )}
                                <h3 className="font-medium">{goal.title}</h3>
                                <Badge
                                  variant="outline"
                                  className={`ml-auto ${getCategoryColor(goal.category)}`}
                                >
                                  {goal.category}
                                </Badge>
                              </div>
                              {goal.description && (
                                <p className="text-sm text-muted-foreground mt-2 pl-6">
                                  {goal.description}
                                </p>
                              )}
                              <div className="mt-2 pl-6 space-y-1">
                                <div className="flex justify-between items-center text-sm">
                                  <span>
                                    {goal.status === 'completed' ? (
                                      <span className="text-green-700">Completed!</span>
                                    ) : (
                                      <span>Progress</span>
                                    )}
                                  </span>
                                  <span>{goal.progress}%</span>
                                </div>
                                <Progress 
                                  value={goal.progress} 
                                  className={goal.status === 'completed' ? 'bg-green-200' : ''}
                                />
                              </div>
                              {goal.status !== 'completed' && (
                                <div className="mt-4 pl-6 flex flex-wrap justify-between items-center gap-2">
                                  {goal.deadline && (
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      <span>
                                        Due {new Date(goal.deadline).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleUpdateProgress(goal.id, goal.progress + 10)}
                                      disabled={goal.progress >= 100}
                                    >
                                      Update Progress
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements" className="space-y-6">
              <AchievementWall />
            </TabsContent>
            
            <TabsContent value="journal" className="space-y-6">
              <MotivationJournal />
            </TabsContent>
            
            <TabsContent value="vision" className="space-y-6">
              <VisionBoard />
            </TabsContent>
            
            <TabsContent value="tips" className="space-y-6">
              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Motivation Science
                  </CardTitle>
                  <CardDescription>
                    Evidence-based strategies to boost your motivation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {motivationTips?.map((tip) => (
                      <Card key={tip.id} className={`${tip.bgColor} dark:bg-transparent dark:border-primary/20 transition-all hover:shadow-md`}>
                        <CardContent className="p-4">
                          <tip.icon className={`h-8 w-8 ${tip.color} mb-2`} />
                          <h3 className="font-medium">{tip.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {tip.description}
                          </p>
                          <Button 
                            variant="link" 
                            className={`p-0 h-auto mt-2 ${tip.color}`}
                            onClick={() => toast({
                              title: "Feature coming soon",
                              description: "Detailed motivation resources will be available soon!"
                            })}
                          >
                            Learn more
                            <ArrowUpRight className="h-3 w-3 ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/10 shadow-md bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    The Science of Motivation
                  </CardTitle>
                  <CardDescription>
                    Understanding how motivation works helps you maintain it
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="bg-white/70 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-blue-500" />
                        <h3 className="font-medium">Goal Setting</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Specific, measurable, achievable, relevant, and time-bound (SMART) goals increase your chances of success by providing clear direction and milestones.
                      </p>
                    </div>
                    
                    <div className="bg-white/70 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="h-5 w-5 text-amber-500" />
                        <h3 className="font-medium">Reward Systems</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your brain responds to rewards by releasing dopamine, reinforcing behaviors. Creating a reward system for your goals leverages this natural mechanism.
                      </p>
                    </div>
                    
                    <div className="bg-white/70 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-green-500" />
                        <h3 className="font-medium">Implementation Intentions</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Planning exactly when, where, and how you'll take action on your goals significantly increases follow-through and creates powerful habits.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Motivation;
