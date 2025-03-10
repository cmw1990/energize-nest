import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Clock, Cigarette, Trophy, TrendingDown, Brain, Zap, Heart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

interface DashboardProps {
  session: Session | null;
}

type Mood = 'happy' | 'neutral' | 'sad' | 'angry' | 'anxious';
type MoodImprovement = { from: Mood, to: Mood };

const moodEmojis: Record<Mood, string> = {
  happy: '😊',
  neutral: '😐',
  sad: '😔',
  angry: '😠',
  anxious: '😰'
};

const moodColors: Record<Mood, string> = {
  happy: 'bg-green-100 border-green-300 text-green-700',
  neutral: 'bg-blue-100 border-blue-300 text-blue-700',
  sad: 'bg-indigo-100 border-indigo-300 text-indigo-700',
  angry: 'bg-red-100 border-red-300 text-red-700',
  anxious: 'bg-amber-100 border-amber-300 text-amber-700'
};

const breathingInstructions = [
  { text: "Breathe in deeply...", duration: 4000 },
  { text: "Hold your breath...", duration: 4000 },
  { text: "Exhale slowly...", duration: 6000 },
  { text: "Relax...", duration: 2000 }
];

export const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    daysSmokeFreee: 0,
    cigarettesAvoided: 0,
    moneySaved: 0,
    streakDays: 0,
  });
  
  // Mood game state
  const [currentMood, setCurrentMood] = useState<Mood>('neutral');
  const [moodHistory, setMoodHistory] = useState<MoodImprovement[]>([]);
  const [breathingExercise, setBreathingExercise] = useState(false);
  const [breathingStep, setBreathingStep] = useState(0);
  const [breathingProgress, setBreathingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('stats');
  
  // Craving distraction game state
  const [showDistraction, setShowDistraction] = useState(false);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [score, setScore] = useState(0);
  
  // Initialize bubbles for distraction game
  useEffect(() => {
    if (showDistraction) {
      const initialBubbles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 30
      }));
      setBubbles(initialBubbles);
      setScore(0);
    }
  }, [showDistraction]);
  
  // Handle breathing exercise animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (breathingExercise) {
      const step = breathingInstructions[breathingStep];
      let progress = 0;
      const interval = 50; // Update every 50ms
      
      timer = setInterval(() => {
        progress += (interval / step.duration) * 100;
        setBreathingProgress(Math.min(progress, 100));
        
        if (progress >= 100) {
          const nextStep = (breathingStep + 1) % breathingInstructions.length;
          setBreathingStep(nextStep);
          setBreathingProgress(0);
        }
      }, interval);
    }
    
    return () => clearInterval(timer);
  }, [breathingExercise, breathingStep]);

  useEffect(() => {
    if (session?.user) {
      loadUserStats();
    }
  }, [session]);

  const loadUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from('quit_smoking_stats')
        .select('*')
        .eq('user_id', session?.user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setStats({
          daysSmokeFreee: data.days_smoke_free,
          cigarettesAvoided: data.cigarettes_avoided,
          moneySaved: data.money_saved,
          streakDays: data.streak_days,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load quit smoking statistics',
        variant: 'destructive',
      });
    }
  };
  
  const handleMoodSelection = (mood: Mood) => {
    if (currentMood !== mood) {
      // Record the mood change
      const improvement: MoodImprovement = { from: currentMood, to: mood };
      setMoodHistory(prev => [improvement, ...prev.slice(0, 4)]);
      setCurrentMood(mood);
      
      if (['sad', 'angry', 'anxious'].includes(mood)) {
        // Suggest coping strategies for negative moods
        toast({
          title: 'Coping Strategy Available',
          description: 'Try the breathing exercise or distraction game to improve your mood',
        });
      }
    }
  };
  
  const startBreathingExercise = () => {
    setBreathingExercise(true);
    setBreathingStep(0);
    setBreathingProgress(0);
  };
  
  const stopBreathingExercise = () => {
    setBreathingExercise(false);
    
    if (['sad', 'angry', 'anxious'].includes(currentMood)) {
      // Automatically improve mood after completing breathing exercise
      const moodMap: Record<Mood, Mood> = {
        sad: 'neutral',
        angry: 'neutral',
        anxious: 'neutral',
        neutral: 'happy',
        happy: 'happy'
      };
      
      const newMood = moodMap[currentMood];
      const improvement: MoodImprovement = { from: currentMood, to: newMood };
      setMoodHistory(prev => [improvement, ...prev.slice(0, 4)]);
      setCurrentMood(newMood);
      
      toast({
        title: 'Great job!',
        description: 'Deep breathing helps reduce stress and cravings. Your mood has improved!',
      });
    }
  };
  
  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== id));
    setScore(prev => prev + 1);
    
    if (bubbles.length === 1) {
      // Last bubble popped - game over
      setShowDistraction(false);
      
      if (['sad', 'angry', 'anxious'].includes(currentMood)) {
        // Improve mood after completing the game
        const newMood: Mood = score > 10 ? 'happy' : 'neutral';
        const improvement: MoodImprovement = { from: currentMood, to: newMood };
        setMoodHistory(prev => [improvement, ...prev.slice(0, 4)]);
        setCurrentMood(newMood);
      }
      
      toast({
        title: 'Distraction complete!',
        description: 'You successfully redirected your attention away from cravings.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Mission Fresh Dashboard</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stats">
              <Trophy className="h-4 w-4 mr-2" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="mood">
              <Brain className="h-4 w-4 mr-2" />
              Mood Manager
            </TabsTrigger>
          </TabsList>
        
          <TabsContent value="stats" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Smoke-Free Days</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.daysSmokeFreee} days</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cigarettes Avoided</CardTitle>
                  <Cigarette className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.cigarettesAvoided}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Money Saved</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.moneySaved.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.streakDays} days</div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Daily Motivation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "Every day is a new opportunity to stay committed to your health. Your future self will thank you for the decision you're making today."
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mood" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mood Tracker</CardTitle>
                  <CardDescription>
                    Tracking your mood helps identify triggers and patterns during your quit journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-medium">How are you feeling right now?</p>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(moodEmojis) as Mood[]).map(mood => (
                        <Button
                          key={mood}
                          variant="outline"
                          className={`h-auto py-2 px-4 border ${currentMood === mood ? moodColors[mood] : ''}`}
                          onClick={() => handleMoodSelection(mood)}
                        >
                          <span className="text-xl mr-2">{moodEmojis[mood]}</span>
                          <span className="capitalize">{mood}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {moodHistory.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-medium">Recent Mood Changes</p>
                      <div className="space-y-2">
                        {moodHistory.map((change, idx) => (
                          <div key={idx} className="flex items-center text-sm">
                            <span className="text-lg">{moodEmojis[change.from]}</span>
                            <span className="mx-2">→</span>
                            <span className="text-lg">{moodEmojis[change.to]}</span>
                            <span className="ml-2 text-muted-foreground text-xs">
                              {idx === 0 ? 'Just now' : `${idx + 1} ${idx === 0 ? 'change' : 'changes'} ago`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {['sad', 'angry', 'anxious'].includes(currentMood) && (
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md">
                      <p className="text-sm font-medium mb-2">Feeling {currentMood}? That's normal during quitting.</p>
                      <p className="text-sm text-muted-foreground mb-3">Try one of these tools to improve your mood:</p>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" className="bg-white dark:bg-gray-800"
                          onClick={startBreathingExercise}
                          disabled={breathingExercise}
                        >
                          <Zap className="h-4 w-4 mr-2 text-blue-500" />
                          Breathing Exercise
                        </Button>
                        
                        <Button variant="outline" className="bg-white dark:bg-gray-800"
                          onClick={() => setShowDistraction(true)}
                          disabled={showDistraction}
                        >
                          <Heart className="h-4 w-4 mr-2 text-red-500" />
                          Distraction Game
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                {breathingExercise && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Deep Breathing Exercise</CardTitle>
                      <CardDescription>
                        Follow the instructions below to reduce stress and cravings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-center h-48">
                        <motion.div
                          className="w-32 h-32 rounded-full bg-blue-100 border-4 border-blue-300 flex items-center justify-center"
                          animate={{
                            scale: breathingStep === 0 ? 1.5 : breathingStep === 1 ? 1.5 : 1,
                            opacity: 1
                          }}
                          transition={{
                            duration: breathingInstructions[breathingStep].duration / 1000,
                            ease: "easeInOut"
                          }}
                        >
                          <span className="text-blue-600 font-medium">
                            {breathingInstructions[breathingStep].text}
                          </span>
                        </motion.div>
                      </div>
                      <Progress value={breathingProgress} className="h-2 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={stopBreathingExercise}
                      >
                        End Exercise
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                {showDistraction && (
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>Craving Distraction Game</CardTitle>
                      <CardDescription>
                        Pop all the bubbles to redirect your attention from cravings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="w-full aspect-video bg-gradient-to-b from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 relative overflow-hidden p-4">
                        <div className="absolute top-2 right-4 bg-white dark:bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold">
                          Score: {score}
                        </div>
                        {bubbles.map((bubble) => (
                          <motion.div
                            key={bubble.id}
                            className="absolute rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg"
                            style={{
                              left: `${bubble.x}%`,
                              top: `${bubble.y}%`,
                              width: `${bubble.size}px`,
                              height: `${bubble.size}px`
                            }}
                            animate={{
                              x: Math.random() * 20 - 10,
                              y: Math.random() * 20 - 10,
                              scale: [1, 1.05, 1]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: 'reverse'
                            }}
                            onClick={() => popBubble(bubble.id)}
                            whileTap={{ scale: 0 }}
                          />
                        ))}
                        {bubbles.length === 0 && !score && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <p className="text-lg font-medium mb-2">Loading bubbles...</p>
                              <Button
                                variant="outline"
                                onClick={() => setShowDistraction(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                        {bubbles.length === 0 && score > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <h3 className="text-2xl font-bold mb-2">Great job!</h3>
                              <p className="mb-4">You popped {score} bubbles and redirected your attention.</p>
                              <Button
                                onClick={() => setShowDistraction(false)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Done
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {!breathingExercise && !showDistraction && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Understanding Your Quit Journey</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Mood fluctuations are a normal part of quitting smoking. When you stop smoking:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                        <li>Your brain is adjusting to functioning without nicotine</li>
                        <li>Dopamine levels are temporarily reduced, affecting your mood</li>
                        <li>Irritability, anxiety, and sadness are common withdrawal symptoms</li>
                        <li>These mood changes typically improve after 2-4 weeks</li>
                      </ul>
                      <p className="text-sm font-medium mt-4">
                        Using tools like breathing exercises and distraction games can help manage mood 
                        and cravings during this challenging period.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab('stats')}>
                        View Your Progress
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/mission-fresh/app/progress')}>
                        Track Your Journey
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
