
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { 
  Brain, 
  Leaf, 
  Clock, 
  Thermometer, 
  CloudRain, 
  Heart, 
  Lightbulb, 
  Activity, 
  BookOpen, 
  ListChecks, 
  Zap,
  Award,
  Calendar,
  Plus,
  BarChart 
} from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface StressLevel {
  id: string;
  user_id: string;
  stress_level: number;
  timestamp: string;
  triggers: string[];
  notes: string;
}

interface StressTrigger {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
}

interface StressTechnique {
  id: string;
  name: string;
  description: string;
  duration: string;
  category: string;
  steps: string[];
  benefits: string[];
  icon: React.ReactNode;
}

export function StressManagement() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('assessment');
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [isLoggingStress, setIsLoggingStress] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<StressTechnique | null>(null);
  
  const { data: stressLog = [], isLoading: isLoadingStressLog } = useQuery({
    queryKey: ['stress-log', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('stress_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('timestamp', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching stress log:', error);
        throw error;
      }
      
      return data as StressLevel[];
    },
    enabled: !!session?.user?.id
  });
  
  const logStress = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('stress_logs')
        .insert({
          user_id: session.user.id,
          stress_level: stressLevel,
          triggers: selectedTriggers,
          notes: notes,
          timestamp: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stress-log', session?.user?.id] });
      toast({
        title: 'Stress level logged',
        description: 'Your stress level has been recorded successfully.',
      });
      setIsLoggingStress(false);
      setStressLevel(5);
      setSelectedTriggers([]);
      setNotes('');
    },
    onError: (error) => {
      toast({
        title: 'Error logging stress level',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  });
  
  const stressTriggers: StressTrigger[] = [
    { id: 'work', name: 'Work', category: 'occupation', icon: <Zap className="h-4 w-4 text-amber-500" /> },
    { id: 'deadlines', name: 'Deadlines', category: 'occupation', icon: <Clock className="h-4 w-4 text-amber-500" /> },
    { id: 'finances', name: 'Finances', category: 'personal', icon: <Activity className="h-4 w-4 text-red-500" /> },
    { id: 'relationships', name: 'Relationships', category: 'personal', icon: <Heart className="h-4 w-4 text-pink-500" /> },
    { id: 'health', name: 'Health Issues', category: 'health', icon: <Thermometer className="h-4 w-4 text-blue-500" /> },
    { id: 'sleep', name: 'Sleep Issues', category: 'health', icon: <CloudRain className="h-4 w-4 text-indigo-500" /> },
    { id: 'environment', name: 'Environment', category: 'environment', icon: <Leaf className="h-4 w-4 text-green-500" /> },
    { id: 'major-change', name: 'Major Life Change', category: 'personal', icon: <Activity className="h-4 w-4 text-purple-500" /> },
    { id: 'social', name: 'Social Pressure', category: 'personal', icon: <Brain className="h-4 w-4 text-orange-500" /> },
    { id: 'news', name: 'News/Media', category: 'environment', icon: <Activity className="h-4 w-4 text-gray-500" /> },
    { id: 'over-thinking', name: 'Over-thinking', category: 'cognitive', icon: <Brain className="h-4 w-4 text-teal-500" /> },
    { id: 'uncertainty', name: 'Uncertainty', category: 'cognitive', icon: <Lightbulb className="h-4 w-4 text-yellow-500" /> }
  ];
  
  const stressTechniques: StressTechnique[] = [
    { 
      id: 'box-breathing', 
      name: 'Box Breathing', 
      description: 'A simple breathing technique used by Navy SEALs to reduce stress and improve focus.',
      duration: '5 minutes',
      category: 'breathing',
      steps: [
        'Sit upright in a comfortable position.',
        'Slowly exhale completely through your mouth.',
        'Inhale through your nose for a count of 4.',
        'Hold your breath for a count of 4.',
        'Exhale through your mouth for a count of 4.',
        'Hold your breath for a count of 4.',
        'Repeat for at least 5 minutes.'
      ],
      benefits: [
        'Reduces stress',
        'Improves mental clarity',
        'Lowers heart rate',
        'Can be done anywhere'
      ],
      icon: <CloudRain className="h-5 w-5 text-blue-500" />
    },
    { 
      id: 'progressive-relaxation', 
      name: 'Progressive Muscle Relaxation', 
      description: 'A technique that involves tensing and then releasing each muscle group in the body.',
      duration: '10-15 minutes',
      category: 'physical',
      steps: [
        'Lie down in a comfortable position.',
        'Start with your feet. Tense your foot muscles for 5 seconds.',
        'Release and relax for 10 seconds, noticing the difference.',
        'Move up to your calves, then thighs, and continue up through your body.',
        'End with facial muscles like your forehead and jaw.',
        'Breathe deeply throughout the exercise.'
      ],
      benefits: [
        'Reduces physical tension',
        'Helps identify stress in the body',
        'Improves body awareness',
        'Can help with insomnia and anxiety'
      ],
      icon: <Activity className="h-5 w-5 text-green-500" />
    },
    { 
      id: 'visualization', 
      name: 'Positive Visualization', 
      description: 'A technique that uses mental imagery to induce calm and reduce stress.',
      duration: '5-10 minutes',
      category: 'cognitive',
      steps: [
        'Find a quiet place and sit comfortably.',
        'Close your eyes and take deep breaths.',
        'Imagine a peaceful place (beach, forest, etc.).',
        'Engage all your senses - what do you see, hear, smell, feel?',
        'Stay in this place for 5-10 minutes.',
        'When ready, slowly return your awareness to the present.'
      ],
      benefits: [
        'Reduces stress hormones',
        'Creates mental escape',
        'Can improve mood',
        'Helps with emotional regulation'
      ],
      icon: <Brain className="h-5 w-5 text-purple-500" />
    },
    { 
      id: 'mindfulness-meditation', 
      name: 'Mindfulness Meditation', 
      description: 'A meditation practice that involves focusing on the present moment without judgment.',
      duration: '10-20 minutes',
      category: 'meditation',
      steps: [
        'Sit in a comfortable position with good posture.',
        'Focus your attention on your breath.',
        'Notice when your mind wanders and gently bring attention back to breath.',
        'Observe thoughts and feelings without judgment.',
        'Continue for 10-20 minutes.',
        'Gradually expand awareness back to your surroundings.'
      ],
      benefits: [
        'Reduces rumination',
        'Improves attention and focus',
        'Decreases emotional reactivity',
        'Backed by extensive research'
      ],
      icon: <Brain className="h-5 w-5 text-amber-500" />
    },
    { 
      id: 'gratitude-practice', 
      name: 'Gratitude Practice', 
      description: 'A simple exercise of acknowledging things you're grateful for to shift perspective.',
      duration: '5 minutes',
      category: 'cognitive',
      steps: [
        'Take out a notebook or open a notes app.',
        'Write down 3-5 things you're genuinely grateful for.',
        'For each item, write a sentence about why you're grateful for it.',
        'Try to find new things each day, not repeating items.',
        'Read your list aloud if possible.',
        'Notice how you feel before and after the exercise.'
      ],
      benefits: [
        'Shifts focus from negative to positive',
        'Improves overall mood',
        'Can help with depression and anxiety',
        'Simple yet effective daily practice'
      ],
      icon: <Heart className="h-5 w-5 text-red-500" />
    },
    { 
      id: 'grounding-technique', 
      name: '5-4-3-2-1 Grounding Technique', 
      description: 'A sensory awareness exercise to bring you back to the present moment.',
      duration: '3-5 minutes',
      category: 'mindfulness',
      steps: [
        'Acknowledge 5 things you can see.',
        'Acknowledge 4 things you can touch/feel.',
        'Acknowledge 3 things you can hear.',
        'Acknowledge 2 things you can smell.',
        'Acknowledge 1 thing you can taste.',
        'Take a deep breath to conclude.'
      ],
      benefits: [
        'Quickly reduces anxiety',
        'Works during panic attacks',
        'Easy to remember and practice',
        'Can be done discreetly anywhere'
      ],
      icon: <Leaf className="h-5 w-5 text-emerald-500" />
    }
  ];
  
  const getStressLevelColor = (level: number) => {
    if (level <= 3) return 'text-green-500';
    if (level <= 6) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const getStressLevelText = (level: number) => {
    if (level <= 2) return 'Very Low';
    if (level <= 4) return 'Low';
    if (level <= 6) return 'Moderate';
    if (level <= 8) return 'High';
    return 'Very High';
  };
  
  const toggleTrigger = (triggerId: string) => {
    if (selectedTriggers.includes(triggerId)) {
      setSelectedTriggers(selectedTriggers.filter(id => id !== triggerId));
    } else {
      setSelectedTriggers([...selectedTriggers, triggerId]);
    }
  };
  
  const averageStressLevel = React.useMemo(() => {
    if (stressLog.length === 0) return null;
    const sum = stressLog.reduce((acc, log) => acc + log.stress_level, 0);
    return Math.round((sum / stressLog.length) * 10) / 10;
  }, [stressLog]);
  
  const mostCommonTriggers = React.useMemo(() => {
    if (stressLog.length === 0) return [];
    
    const triggerCounts: Record<string, number> = {};
    stressLog.forEach(log => {
      if (log.triggers) {
        log.triggers.forEach(trigger => {
          triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
        });
      }
    });
    
    return Object.entries(triggerCounts)
      .map(([id, count]) => ({ 
        id, 
        count, 
        name: stressTriggers.find(t => t.id === id)?.name || id,
        icon: stressTriggers.find(t => t.id === id)?.icon
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [stressLog, stressTriggers]);
  
  const renderLogStressForm = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="text-center space-y-3">
          <h3 className="text-base font-medium">How stressed do you feel right now?</h3>
          <div className="flex justify-center">
            <div className={`text-5xl font-bold ${getStressLevelColor(stressLevel)}`}>
              {stressLevel}
            </div>
          </div>
          <p className="text-muted-foreground">{getStressLevelText(stressLevel)}</p>
        </div>
        
        <div className="py-4">
          <Input
            type="range"
            min="1"
            max="10"
            step="1"
            value={stressLevel}
            onChange={(e) => setStressLevel(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Very Low</span>
            <span>Moderate</span>
            <span>Very High</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <Label>What's causing your stress? (Select all that apply)</Label>
        <div className="flex flex-wrap gap-2">
          {stressTriggers.map(trigger => (
            <Button
              key={trigger.id}
              variant={selectedTriggers.includes(trigger.id) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTrigger(trigger.id)}
              className="flex items-center gap-1"
            >
              {trigger.icon}
              {trigger.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="stress-notes">Notes (optional)</Label>
        <textarea
          id="stress-notes"
          className="w-full min-h-[100px] px-3 py-2 border rounded-md"
          placeholder="Add any details about your stress..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      
      <Button 
        onClick={() => logStress.mutate()} 
        disabled={logStress.isPending}
        className="w-full"
      >
        {logStress.isPending ? 'Logging...' : 'Log Stress Level'}
      </Button>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="assessment" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Assessment
          </TabsTrigger>
          <TabsTrigger value="techniques" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Techniques
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Progress
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assessment" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Stress Assessment
                </CardTitle>
                <CardDescription>
                  Track your stress levels and identify patterns over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {session?.user?.id ? (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div>
                        <h3 className="text-base font-medium">Your Stress Summary</h3>
                        <p className="text-sm text-muted-foreground">
                          Based on {stressLog.length} log entries
                        </p>
                      </div>
                      <Dialog open={isLoggingStress} onOpenChange={setIsLoggingStress}>
                        <DialogTrigger asChild>
                          <Button className="w-full sm:w-auto">
                            <Plus className="h-4 w-4 mr-2" />
                            Log Current Stress
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Log Your Stress Level</DialogTitle>
                            <DialogDescription>
                              Track your stress to identify patterns and triggers.
                            </DialogDescription>
                          </DialogHeader>
                          {renderLogStressForm()}
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    {isLoadingStressLog ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {Array(3).fill(0).map((_, i) => (
                          <Card key={i} className="h-24 animate-pulse">
                            <CardContent className="p-4">
                              <div className="h-4 bg-muted rounded w-1/2 mb-3"></div>
                              <div className="h-6 bg-muted rounded w-4/5"></div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : stressLog.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <Card className="bg-muted/30">
                            <CardContent className="p-4">
                              <h4 className="text-sm text-muted-foreground">Average Stress Level</h4>
                              <div className="flex items-end gap-2 mt-1">
                                <span className={`text-2xl font-bold ${getStressLevelColor(averageStressLevel || 0)}`}>
                                  {averageStressLevel}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  / 10
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-muted/30">
                            <CardContent className="p-4">
                              <h4 className="text-sm text-muted-foreground">Latest Reading</h4>
                              <div className="flex items-end gap-2 mt-1">
                                <span className={`text-2xl font-bold ${getStressLevelColor(stressLog[0]?.stress_level || 0)}`}>
                                  {stressLog[0]?.stress_level}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {stressLog[0]?.timestamp ? format(new Date(stressLog[0].timestamp), 'MMM d') : ''}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-muted/30">
                            <CardContent className="p-4">
                              <h4 className="text-sm text-muted-foreground">Top Trigger</h4>
                              {mostCommonTriggers.length > 0 ? (
                                <div className="flex items-center gap-2 mt-1">
                                  {mostCommonTriggers[0].icon}
                                  <span className="text-base font-medium">
                                    {mostCommonTriggers[0].name}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm italic text-muted-foreground">No triggers logged</span>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="border rounded-md">
                          <div className="p-3 border-b bg-muted/30">
                            <h3 className="font-medium">Recent Stress Logs</h3>
                          </div>
                          <div className="divide-y">
                            {stressLog.slice(0, 5).map((log) => (
                              <div key={log.id} className="flex p-3 hover:bg-muted/20">
                                <div className="w-16 flex-shrink-0">
                                  <div className={`text-xl font-bold ${getStressLevelColor(log.stress_level)}`}>
                                    {log.stress_level}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {format(new Date(log.timestamp), 'MMM d')}
                                  </div>
                                </div>
                                <div className="flex-grow">
                                  <div className="flex flex-wrap gap-1 mb-1">
                                    {log.triggers && log.triggers.map(triggerId => {
                                      const trigger = stressTriggers.find(t => t.id === triggerId);
                                      return trigger ? (
                                        <Badge key={triggerId} variant="outline" className="text-xs flex items-center gap-1">
                                          {trigger.icon}
                                          {trigger.name}
                                        </Badge>
                                      ) : null;
                                    })}
                                  </div>
                                  {log.notes && (
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                      {log.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-10 border rounded-md">
                        <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">No stress logs yet</h3>
                        <p className="text-muted-foreground mt-1 mb-4 max-w-md mx-auto">
                          Start tracking your stress levels to identify patterns and triggers.
                        </p>
                        <Button onClick={() => setIsLoggingStress(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Log Your First Entry
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 border rounded-md">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                    <h3 className="text-lg font-medium">Sign in to track your stress</h3>
                    <p className="text-muted-foreground mt-1 mb-4 max-w-md mx-auto">
                      Create an account to log and track your stress levels over time.
                    </p>
                    <Button>Sign In</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Learn
                </CardTitle>
                <CardDescription>
                  Understanding stress and its effects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">What is stress?</h3>
                  <p className="text-sm text-muted-foreground">
                    Stress is your body's response to pressure from a situation or life event. It can affect your physical and mental health in various ways.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Effects of chronic stress</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Headaches and muscle tension</li>
                    <li>Sleep disruption</li>
                    <li>Digestive issues</li>
                    <li>Weakened immune system</li>
                    <li>Anxiety and depression</li>
                    <li>Cognitive impairment</li>
                  </ul>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full" size="sm">
                    <Brain className="h-4 w-4 mr-2" />
                    Read Full Stress Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="techniques" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stressTechniques.map(technique => (
              <Card key={technique.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    {technique.icon}
                    {technique.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {technique.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Clock className="h-4 w-4" />
                    <span>{technique.duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">{technique.category}</Badge>
                    {technique.benefits.length > 0 && (
                      <Badge variant="secondary">{technique.benefits[0]}</Badge>
                    )}
                    {technique.benefits.length > 1 && (
                      <Badge variant="secondary" className="hidden sm:inline-flex">
                        {technique.benefits[1]}
                      </Badge>
                    )}
                    {technique.benefits.length > 2 && (
                      <Badge variant="outline">+{technique.benefits.length - 2}</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedTechnique(technique)}
                  >
                    View Technique
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {selectedTechnique && (
            <Dialog open={!!selectedTechnique} onOpenChange={(open) => !open && setSelectedTechnique(null)}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedTechnique.icon}
                    {selectedTechnique.name}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedTechnique.description}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-3 pb-2 border-b">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedTechnique.duration}</span>
                    <Badge variant="outline">{selectedTechnique.category}</Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">How to do it:</h3>
                    <ol className="space-y-2">
                      {selectedTechnique.steps.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-medium">
                            {index + 1}
                          </div>
                          <p className="text-sm">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Benefits:</h3>
                    <ul className="space-y-1">
                      {selectedTechnique.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="flex-shrink-0 pt-0.5">
                            <Heart className="h-4 w-4 text-primary" />
                          </div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {session?.user?.id && (
                    <div className="pt-2">
                      <Button className="w-full" size="sm">
                        Start Guided Session
                      </Button>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedTechnique(null)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6 pt-4">
          {!session?.user?.id ? (
            <div className="text-center py-12 border rounded-md">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-medium">Sign in to track your progress</h3>
              <p className="text-muted-foreground mt-1 mb-4 max-w-md mx-auto">
                Create an account to view your stress reduction progress over time.
              </p>
              <Button>Sign In</Button>
            </div>
          ) : stressLog.length < 2 ? (
            <div className="text-center py-12 border rounded-md">
              <ListChecks className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-medium">Not enough data</h3>
              <p className="text-muted-foreground mt-1 mb-4 max-w-md mx-auto">
                Log your stress levels regularly to see your progress over time. At least 2 entries are needed.
              </p>
              <Button onClick={() => setIsLoggingStress(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Log Stress Level
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Stress Trend</CardTitle>
                    <CardDescription>
                      Your stress level over the past {stressLog.length} entries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-center">
                      <div className="text-muted-foreground">
                        <BarChart className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p>Stress trend chart will appear here</p>
                        <p className="text-xs">(Chart visualization coming soon)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Common Triggers</CardTitle>
                    <CardDescription>
                      Identifying your main stress sources
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mostCommonTriggers.length > 0 ? (
                      mostCommonTriggers.map(trigger => (
                        <div key={trigger.id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {trigger.icon}
                              <span className="font-medium">{trigger.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {Math.round((trigger.count / stressLog.length) * 100)}%
                            </span>
                          </div>
                          <Progress value={(trigger.count / stressLog.length) * 100} className="h-2" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No triggers recorded yet</p>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        <ListChecks className="h-4 w-4 mr-2" />
                        View Full Trigger Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Stress Management Plan</CardTitle>
                  <CardDescription>
                    Personalized recommendations based on your stress patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        <h3 className="font-medium">For Immediate Relief</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Try box breathing for 5 minutes when stress peaks, especially during work situations.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Start Now
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <h3 className="font-medium">Daily Practice</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Schedule 10 minutes of mindfulness meditation each morning to build resilience.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Add to Routine
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <ListChecks className="h-5 w-5 text-green-500" />
                        <h3 className="font-medium">Structural Changes</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Consider addressing work-related triggers through boundary setting and time management.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Guide
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
