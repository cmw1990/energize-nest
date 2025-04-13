
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Shield, 
  BrainCircuit, 
  Dumbbell, 
  Utensils, 
  GraduationCap, 
  Syringe, 
  CheckCircle2, 
  Cigarette,
  Timer,
  BadgeInfo,
  Clock,
  ThumbsUp,
  Flame,
  Plus,
  Brain,
  LucideIcon
} from 'lucide-react';

interface CopingStrategy {
  id: string;
  title: string;
  description: string;
  category: 'behavioral' | 'physical' | 'mental' | 'social' | 'substitute';
  icon: React.ReactNode;
  effectiveness?: number;
  timeToImplement: 'immediate' | 'short' | 'long';
}

interface CopingToolsProps {
  substance: string;
}

export const WithdrawalCopingTools: React.FC<CopingToolsProps> = ({ substance }) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [customStrategy, setCustomStrategy] = useState({
    title: '',
    description: '',
    category: 'behavioral',
  });

  // Fetch user's saved strategies
  const { data: savedStrategies, isLoading: isSavedLoading } = useQuery({
    queryKey: ['coping-strategies', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('withdrawal_coping_strategies')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('substance', substance);
      
      if (error) {
        console.error("Error fetching coping strategies:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  // Save a coping strategy
  const saveStrategy = useMutation({
    mutationFn: async (strategyId: string) => {
      if (!session?.user?.id) throw new Error("User not logged in");
      
      const matchingStrategy = predefinedStrategies.find(s => s.id === strategyId);
      if (!matchingStrategy) throw new Error("Strategy not found");
      
      const { error } = await supabase
        .from('withdrawal_coping_strategies')
        .insert({
          user_id: session.user.id,
          strategy_id: strategyId,
          title: matchingStrategy.title,
          description: matchingStrategy.description,
          category: matchingStrategy.category,
          substance,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coping-strategies', session?.user?.id] });
      toast({
        title: "Strategy saved",
        description: "The coping strategy has been added to your toolkit",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving strategy",
        description: "Could not save strategy. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving strategy:", error);
    },
  });

  // Save a custom coping strategy
  const saveCustomStrategy = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error("User not logged in");
      if (!customStrategy.title || !customStrategy.description) {
        throw new Error("Title and description are required");
      }
      
      const { error } = await supabase
        .from('withdrawal_coping_strategies')
        .insert({
          user_id: session.user.id,
          strategy_id: `custom-${Date.now()}`,
          title: customStrategy.title,
          description: customStrategy.description,
          category: customStrategy.category,
          substance,
          is_custom: true,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coping-strategies', session?.user?.id] });
      toast({
        title: "Custom strategy saved",
        description: "Your custom coping strategy has been added to your toolkit",
      });
      setCustomStrategy({
        title: '',
        description: '',
        category: 'behavioral',
      });
      setShowAddForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error saving strategy",
        description: "Could not save custom strategy. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving custom strategy:", error);
    },
  });

  // Remove a coping strategy
  const removeStrategy = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user?.id) throw new Error("User not logged in");
      
      const { error } = await supabase
        .from('withdrawal_coping_strategies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coping-strategies', session?.user?.id] });
      toast({
        title: "Strategy removed",
        description: "The coping strategy has been removed from your toolkit",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing strategy",
        description: "Could not remove strategy. Please try again.",
        variant: "destructive",
      });
      console.error("Error removing strategy:", error);
    },
  });

  // Log strategy usage
  const logStrategyUsage = useMutation({
    mutationFn: async (strategyId: string) => {
      if (!session?.user?.id) throw new Error("User not logged in");
      
      const { error } = await supabase
        .from('withdrawal_strategy_usage')
        .insert({
          user_id: session.user.id,
          strategy_id: strategyId,
          substance,
          effectiveness: 5, // Default midpoint value
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Usage logged",
        description: "Your strategy usage has been recorded",
      });
    },
    onError: (error) => {
      console.error("Error logging strategy usage:", error);
    },
  });

  const handleSaveStrategy = (strategyId: string) => {
    saveStrategy.mutate(strategyId);
  };

  const handleRemoveStrategy = (id: string) => {
    removeStrategy.mutate(id);
  };

  const handleUseStrategy = (strategyId: string) => {
    logStrategyUsage.mutate(strategyId);
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomStrategy.mutate();
  };

  // Get icon by category
  const getCategoryIcon = (category: string): React.ReactNode => {
    switch (category) {
      case 'behavioral':
        return <Shield className="h-5 w-5" />;
      case 'physical':
        return <Dumbbell className="h-5 w-5" />;
      case 'mental':
        return <BrainCircuit className="h-5 w-5" />;
      case 'social':
        return <GraduationCap className="h-5 w-5" />;
      case 'substitute':
        return <Utensils className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  // Get time indicator
  const getTimeIndicator = (time: string): { icon: React.ReactNode; label: string } => {
    switch (time) {
      case 'immediate':
        return { icon: <Timer className="h-4 w-4 text-green-500" />, label: "Immediate relief" };
      case 'short':
        return { icon: <Clock className="h-4 w-4 text-yellow-500" />, label: "Short-term" };
      case 'long':
        return { icon: <CheckCircle2 className="h-4 w-4 text-blue-500" />, label: "Long-term solution" };
      default:
        return { icon: <Timer className="h-4 w-4" />, label: "Varies" };
    }
  };

  // Predefined coping strategies for nicotine withdrawal
  const predefinedStrategies: CopingStrategy[] = [
    {
      id: 'deep-breathing',
      title: 'Deep Breathing Exercises',
      description: 'Practice deep, slow breathing to reduce anxiety and cravings. Inhale for 4 seconds, hold for 4, exhale for 6.',
      category: 'mental',
      icon: <Brain />,
      effectiveness: 85,
      timeToImplement: 'immediate',
    },
    {
      id: 'stay-hydrated',
      title: 'Stay Hydrated',
      description: 'Drink plenty of water throughout the day. This helps flush nicotine from your system and reduces intensity of cravings.',
      category: 'physical',
      icon: <Utensils />,
      effectiveness: 75,
      timeToImplement: 'short',
    },
    {
      id: 'exercise',
      title: 'Physical Exercise',
      description: 'Even a short 5-10 minute walk can reduce cravings and improve mood through endorphin release.',
      category: 'physical',
      icon: <Dumbbell />,
      effectiveness: 90,
      timeToImplement: 'immediate',
    },
    {
      id: 'delay-tactic',
      title: 'Delay Tactic',
      description: 'When a craving hits, tell yourself you'll wait just 10 minutes before giving in. By then, the craving may pass.',
      category: 'behavioral',
      icon: <Clock />,
      effectiveness: 80,
      timeToImplement: 'immediate',
    },
    {
      id: 'avoid-triggers',
      title: 'Avoid Trigger Situations',
      description: 'Temporarily avoid situations you associate with smoking (e.g., bars, coffee breaks with smokers).',
      category: 'behavioral',
      icon: <Shield />,
      effectiveness: 85,
      timeToImplement: 'short',
    },
    {
      id: 'oral-substitutes',
      title: 'Oral Substitutes',
      description: 'Use sugar-free gum, mints, carrot sticks, or sunflower seeds to satisfy oral fixation.',
      category: 'substitute',
      icon: <Utensils />,
      effectiveness: 75,
      timeToImplement: 'immediate',
    },
    {
      id: 'nrt',
      title: 'Nicotine Replacement Therapy',
      description: 'Consider using nicotine patches, gum, or lozenges to reduce withdrawal symptoms during your quit journey.',
      category: 'substitute',
      icon: <Syringe />,
      effectiveness: 85,
      timeToImplement: 'short',
    },
    {
      id: 'meditation',
      title: 'Mindfulness Meditation',
      description: 'Practice mindfulness to observe cravings without judging. Notice they come and go like waves.',
      category: 'mental',
      icon: <BrainCircuit />,
      effectiveness: 80,
      timeToImplement: 'long',
    },
    {
      id: 'support-group',
      title: 'Join a Support Group',
      description: 'Connect with others going through the same experience, either in-person or online.',
      category: 'social',
      icon: <GraduationCap />,
      effectiveness: 90,
      timeToImplement: 'long',
    },
    {
      id: 'reward-system',
      title: 'Create a Reward System',
      description: 'Save the money you would have spent on cigarettes and reward yourself with something special.',
      category: 'behavioral',
      icon: <ThumbsUp />,
      effectiveness: 75,
      timeToImplement: 'long',
    },
    {
      id: 'craving-log',
      title: 'Keep a Craving Journal',
      description: 'Track your cravings to identify patterns in when and why they occur.',
      category: 'mental',
      icon: <BadgeInfo />,
      effectiveness: 70,
      timeToImplement: 'long',
    },
    {
      id: 'stress-management',
      title: 'Stress Management Techniques',
      description: 'Learn and practice techniques like progressive muscle relaxation, yoga, or tai chi.',
      category: 'mental',
      icon: <BrainCircuit />,
      effectiveness: 85,
      timeToImplement: 'long',
    },
  ];

  // Filter strategies based on category and other filters
  const filteredStrategies = predefinedStrategies.filter(strategy => {
    if (activeCategory !== 'all' && strategy.category !== activeCategory) {
      return false;
    }
    if (activeFilter === 'immediate' && strategy.timeToImplement !== 'immediate') {
      return false;
    }
    if (activeFilter === 'effective' && (strategy.effectiveness || 0) < 80) {
      return false;
    }
    return true;
  });

  // Check if a strategy is already saved
  const isStrategySaved = (strategyId: string) => {
    if (!savedStrategies) return false;
    return savedStrategies.some(s => s.strategy_id === strategyId);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="browse">
            <Shield className="h-4 w-4 mr-2" />
            Browse Strategies
          </TabsTrigger>
          <TabsTrigger value="saved">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            My Toolkit
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('all')}
            >
              All Categories
            </Button>
            {['behavioral', 'physical', 'mental', 'social', 'substitute'].map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="flex items-center gap-1"
              >
                {getCategoryIcon(category)}
                <span className="capitalize">{category}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('all')}
            >
              All Strategies
            </Button>
            <Button
              variant={activeFilter === 'immediate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('immediate')}
              className="flex items-center gap-1"
            >
              <Timer className="h-4 w-4" />
              Immediate Relief
            </Button>
            <Button
              variant={activeFilter === 'effective' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('effective')}
              className="flex items-center gap-1"
            >
              <ThumbsUp className="h-4 w-4" />
              Most Effective
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {filteredStrategies.map(strategy => (
              <Card key={strategy.id} className={isStrategySaved(strategy.id) ? "border-green-200 dark:border-green-900/40" : ""}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-md bg-primary/10">
                          {getCategoryIcon(strategy.category)}
                        </div>
                        <h3 className="font-medium">{strategy.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getTimeIndicator(strategy.timeToImplement).icon}
                          {getTimeIndicator(strategy.timeToImplement).label}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Flame className="h-4 w-4 text-orange-500" />
                          {strategy.effectiveness}% Effective
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    {isStrategySaved(strategy.id) ? (
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const savedStrategy = savedStrategies?.find(s => s.strategy_id === strategy.id);
                          if (savedStrategy) {
                            handleUseStrategy(savedStrategy.id);
                          }
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Use This Strategy
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleSaveStrategy(strategy.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to My Toolkit
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="saved" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">My Coping Strategies</h2>
            <Button 
              variant={showAddForm ? "destructive" : "outline"} 
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? "Cancel" : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom
                </>
              )}
            </Button>
          </div>
          
          {showAddForm && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Add Custom Coping Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitCustom} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Strategy Title</Label>
                    <Input
                      id="title"
                      value={customStrategy.title}
                      onChange={(e) => setCustomStrategy({...customStrategy, title: e.target.value})}
                      placeholder="e.g., Morning Stretching Routine"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={customStrategy.description}
                      onChange={(e) => setCustomStrategy({...customStrategy, description: e.target.value})}
                      placeholder="How it helps, when to use it, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={customStrategy.category}
                      onChange={(e) => setCustomStrategy({...customStrategy, category: e.target.value as any})}
                      className="w-full p-2 rounded-md border border-input bg-transparent"
                    >
                      <option value="behavioral">Behavioral</option>
                      <option value="physical">Physical</option>
                      <option value="mental">Mental</option>
                      <option value="social">Social</option>
                      <option value="substitute">Substitute</option>
                    </select>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Save Custom Strategy
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
          
          {isSavedLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <Card key={i} className="p-4">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : savedStrategies && savedStrategies.length > 0 ? (
            <div className="grid gap-4">
              {savedStrategies.map((strategy) => (
                <Card key={strategy.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1.5 rounded-md bg-primary/10">
                            {getCategoryIcon(strategy.category)}
                          </div>
                          <h3 className="font-medium">{strategy.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{strategy.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="default" 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleUseStrategy(strategy.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Use Now
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleRemoveStrategy(strategy.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">No Strategies Saved Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add coping strategies to your toolkit to quickly access them when cravings hit.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Switch to "Browse Strategies" to find helpful techniques.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
