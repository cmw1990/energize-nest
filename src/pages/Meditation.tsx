
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Brain, 
  Sun, 
  Leaf, 
  Clock, 
  Moon, 
  Heart, 
  Wind, 
  Zap, 
  Mountains, 
  Timer,
  Play,
  Pause,
  SkipBack,
  Volume2,
  VolumeX
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";

interface MeditationItem {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  icon: React.ElementType;
  color: string;
  bgColor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: "Mindfulness" | "Stress Relief" | "Energy" | "Sleep" | "Focus";
}

const Meditation = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [activeMeditation, setActiveMeditation] = useState<MeditationItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  
  const meditations: MeditationItem[] = [
    {
      id: "mindfulness-1",
      title: "Mindfulness Meditation",
      description: "Focus your attention on the present moment, without judgment.",
      duration: 10,
      icon: Brain,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      level: "Beginner",
      category: "Mindfulness"
    },
    {
      id: "stress-1",
      title: "Stress Relief",
      description: "Release tension and anxiety with this guided meditation.",
      duration: 15,
      icon: Leaf,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      level: "Beginner",
      category: "Stress Relief"
    },
    {
      id: "energy-1",
      title: "Energy Boost",
      description: "Energizing meditation to increase alertness and positivity.",
      duration: 8,
      icon: Sun,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      level: "Intermediate",
      category: "Energy"
    },
    {
      id: "sleep-1",
      title: "Sleep Preparation",
      description: "Calm your mind and prepare your body for restful sleep.",
      duration: 20,
      icon: Moon,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      level: "Beginner",
      category: "Sleep"
    },
    {
      id: "compassion-1",
      title: "Loving-Kindness",
      description: "Cultivate compassion for yourself and others.",
      duration: 12,
      icon: Heart,
      color: "text-rose-500",
      bgColor: "bg-rose-50 dark:bg-rose-900/20",
      level: "Intermediate",
      category: "Mindfulness"
    },
    {
      id: "breathe-1",
      title: "Breath Awareness",
      description: "Connect with your breath to anchor yourself in the present moment.",
      duration: 5,
      icon: Wind,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      level: "Beginner",
      category: "Mindfulness"
    },
    {
      id: "focus-1",
      title: "Focus Enhancement",
      description: "Sharpen your concentration and mental clarity.",
      duration: 15,
      icon: Zap,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      level: "Intermediate",
      category: "Focus"
    },
    {
      id: "nature-1",
      title: "Nature Connection",
      description: "Connect with the natural world to restore balance.",
      duration: 18,
      icon: Mountains,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      level: "Advanced",
      category: "Stress Relief"
    }
  ];
  
  const filteredMeditations = activeTab === "all" 
    ? meditations 
    : meditations.filter(m => m.category.toLowerCase() === activeTab);
  
  const startMeditation = (meditation: MeditationItem) => {
    setActiveMeditation(meditation);
    setTimeRemaining(meditation.duration * 60);
    setProgress(0);
    setIsPlaying(true);
    
    toast({
      title: "Meditation Started",
      description: `${meditation.title} - ${meditation.duration} minutes`
    });
    
    // In a real application, you would start the audio here
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    // In a real application, you would pause/resume the audio here
    toast({
      title: isPlaying ? "Meditation Paused" : "Meditation Resumed",
      description: activeMeditation?.title
    });
  };
  
  const resetMeditation = () => {
    if (activeMeditation) {
      setTimeRemaining(activeMeditation.duration * 60);
      setProgress(0);
      setIsPlaying(false);
      
      toast({
        title: "Meditation Reset",
        description: activeMeditation.title
      });
    }
  };
  
  const endMeditation = () => {
    setActiveMeditation(null);
    setIsPlaying(false);
    setProgress(0);
    setTimeRemaining(0);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // In a real application, you would mute/unmute the audio here
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // In a real application, you would have this useEffect to update the timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsPlaying(false);
            toast({
              title: "Meditation Complete",
              description: "Your session has ended. How do you feel?"
            });
            clearInterval(interval!);
            return 0;
          }
          
          // Update progress
          if (activeMeditation) {
            const totalSeconds = activeMeditation.duration * 60;
            const completed = totalSeconds - newTime;
            const newProgress = (completed / totalSeconds) * 100;
            setProgress(newProgress);
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeRemaining, activeMeditation, toast]);
  
  if (activeMeditation) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Meditation</h1>
          <Button variant="ghost" onClick={endMeditation}>
            Exit Session
          </Button>
        </div>
        
        <Card className="border border-primary/20 max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <activeMeditation.icon className={`h-5 w-5 ${activeMeditation.color}`} />
                <CardTitle>{activeMeditation.title}</CardTitle>
              </div>
              <Badge variant="outline">{activeMeditation.duration} min</Badge>
            </div>
            <CardDescription>{activeMeditation.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center justify-center space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isPlaying ? "playing" : "paused"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-48 h-48 flex items-center justify-center"
                >
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeOpacity="0.1"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * progress) / 100}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-mono">{formatTime(timeRemaining)}</span>
                    <span className="text-sm text-muted-foreground">remaining</span>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={resetMeditation}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-0.5" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="w-full max-w-md">
                <Slider
                  value={[volume]}
                  onValueChange={(values) => setVolume(values[0])}
                  disabled={isMuted}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Elapsed</span>
                <span className="text-muted-foreground">Remaining</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          </CardFooter>
        </Card>
        
        <div className="max-w-2xl mx-auto">
          <Card className={`border-none ${activeMeditation.bgColor}`}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="font-medium">Guidance</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <Brain className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Find a comfortable position where you can be alert yet relaxed.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <Wind className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Take a few deep breaths to center yourself.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <Heart className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Be kind to yourself if your mind wanders. Gently bring your attention back.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">When the session ends, take a moment to notice how you feel.</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meditation</h1>
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          <span className="font-medium">Find Your Inner Peace</span>
        </div>
      </div>
      
      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-full inline-flex justify-start md:justify-center px-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>All</span>
            </TabsTrigger>
            <TabsTrigger value="mindfulness" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>Mindfulness</span>
            </TabsTrigger>
            <TabsTrigger value="stress relief" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              <span>Stress Relief</span>
            </TabsTrigger>
            <TabsTrigger value="focus" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Focus</span>
            </TabsTrigger>
            <TabsTrigger value="sleep" className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <span>Sleep</span>
            </TabsTrigger>
            <TabsTrigger value="energy" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <span>Energy</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMeditations.map((meditation) => (
              <motion.div
                key={meditation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="border border-primary/10 hover:shadow-md transition-all h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <meditation.icon className={`h-5 w-5 ${meditation.color}`} />
                      {meditation.title}
                    </CardTitle>
                    <CardDescription>{meditation.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{meditation.duration} minutes</span>
                      </div>
                      <Badge variant="outline">{meditation.level}</Badge>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => startMeditation(meditation)}
                    >
                      Start Session
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="border border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Your Meditation Journey
          </CardTitle>
          <CardDescription>Track your progress and stay consistent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-4 text-center text-muted-foreground">
            <p className="mb-4">Start your meditation journey to see your progress here.</p>
            <Button variant="outline" onClick={() => {
              toast({
                title: "Coming Soon",
                description: "Meditation progress tracking will be available soon!"
              });
            }}>
              View My Progress
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none bg-indigo-50 dark:bg-indigo-900/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 rounded-full bg-white/80 dark:bg-white/10">
                <Brain className="h-6 w-6 text-indigo-500" />
              </div>
              <h3 className="font-medium">Improves Focus</h3>
              <p className="text-sm text-muted-foreground">
                Regular meditation strengthens attention and concentration.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 rounded-full bg-white/80 dark:bg-white/10">
                <Leaf className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-medium">Reduces Stress</h3>
              <p className="text-sm text-muted-foreground">
                Meditation activates your body's relaxation response.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none bg-rose-50 dark:bg-rose-900/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 rounded-full bg-white/80 dark:bg-white/10">
                <Heart className="h-6 w-6 text-rose-500" />
              </div>
              <h3 className="font-medium">Emotional Wellbeing</h3>
              <p className="text-sm text-muted-foreground">
                Develop greater self-awareness and emotional regulation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Meditation;
