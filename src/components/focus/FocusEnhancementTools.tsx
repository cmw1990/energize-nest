
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Focus, 
  Target, 
  Volume2, 
  VolumeX, 
  Zap, 
  Droplet,
  Eye,
  Wind,
  Cloud
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export const FocusEnhancementTools = () => {
  const { toast } = useToast();
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(50);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [sound, setSound] = useState<HTMLAudioElement | null>(null);
  const [breathCycle, setBreathCycle] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [breathCount, setBreathCount] = useState<number>(0);
  const [isBoxAnimating, setIsBoxAnimating] = useState<boolean>(false);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (activeTimer && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (activeTimer && timeRemaining === 0) {
      setActiveTimer(null);
      toast({
        title: "Timer Complete",
        description: "Your focus session has ended.",
      });
      
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer, timeRemaining, toast, sound]);

  // Breathing animation logic
  useEffect(() => {
    let breathInterval: NodeJS.Timeout | null = null;
    
    if (isBoxAnimating) {
      breathInterval = setInterval(() => {
        setBreathCycle(prev => {
          switch (prev) {
            case 'inhale':
              return 'hold';
            case 'hold':
              return 'exhale';
            case 'exhale':
              return 'rest';
            case 'rest':
              setBreathCount(count => count + 1);
              return 'inhale';
            default:
              return 'inhale';
          }
        });
      }, breathCycle === 'inhale' || breathCycle === 'exhale' ? 4000 : breathCycle === 'hold' || breathCycle === 'rest' ? 2000 : 4000);
    }
    
    return () => {
      if (breathInterval) clearInterval(breathInterval);
    };
  }, [isBoxAnimating, breathCycle]);

  // Sound management
  useEffect(() => {
    if (sound) {
      sound.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted, sound]);

  const startTimer = (minutes: number, soundOption: string = 'none') => {
    setTotalTime(minutes * 60);
    setTimeRemaining(minutes * 60);
    setActiveTimer('focus');
    
    // Clean up existing sound
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
    
    // Start new sound if selected
    if (soundOption !== 'none') {
      const audio = new Audio(`/sounds/${soundOption}.mp3`);
      audio.loop = true;
      audio.volume = isMuted ? 0 : volume / 100;
      audio.play().catch(error => console.error("Error playing audio:", error));
      setSound(audio);
    } else {
      setSound(null);
    }
    
    toast({
      title: "Focus Timer Started",
      description: `${minutes} minute focus session started.`,
    });
  };

  const stopTimer = () => {
    setActiveTimer(null);
    setTimeRemaining(0);
    
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
      setSound(null);
    }
    
    toast({
      title: "Timer Stopped",
      description: "Your focus session has been stopped.",
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (sound) {
      sound.volume = !isMuted ? 0 : volume / 100;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    if (totalTime === 0) return 0;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  const toggleBoxBreathing = () => {
    setIsBoxAnimating(!isBoxAnimating);
    if (!isBoxAnimating) {
      setBreathCycle('inhale');
      setBreathCount(0);
      toast({
        title: "Box Breathing Started",
        description: "Follow the animation to regulate your breathing.",
      });
    } else {
      toast({
        title: "Box Breathing Stopped",
        description: `You completed ${breathCount} breath cycles.`,
      });
    }
  };

  const getBoxStyles = () => {
    switch (breathCycle) {
      case 'inhale':
        return 'scale-100 bg-blue-100 dark:bg-blue-900/30';
      case 'hold':
        return 'scale-100 bg-green-100 dark:bg-green-900/30';
      case 'exhale':
        return 'scale-50 bg-purple-100 dark:bg-purple-900/30';
      case 'rest':
        return 'scale-50 bg-gray-100 dark:bg-gray-900/30';
      default:
        return 'scale-75 bg-blue-100 dark:bg-blue-900/30';
    }
  };

  const getBreathText = () => {
    switch (breathCycle) {
      case 'inhale':
        return 'Inhale';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Exhale';
      case 'rest':
        return 'Rest';
      default:
        return 'Breathe';
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="pomodoro" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="pomodoro" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Pomodoro</span>
          </TabsTrigger>
          <TabsTrigger value="focus" className="flex items-center gap-2">
            <Focus className="h-4 w-4" />
            <span>Focus Mode</span>
          </TabsTrigger>
          <TabsTrigger value="breathing" className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            <span>Breathing</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pomodoro" className="space-y-4">
          {activeTimer ? (
            <Card className="border-primary/20">
              <CardContent className="pt-6 pb-4">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="rounded-full w-32 h-32 border-4 border-primary flex items-center justify-center">
                    <span className="text-3xl font-mono font-bold">{formatTime(timeRemaining)}</span>
                  </div>
                  <Progress value={calculateProgress()} className="w-full h-2" />
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleMute}
                      className="rounded-full"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Slider
                      value={[volume]}
                      onValueChange={(values) => setVolume(values[0])}
                      disabled={isMuted}
                      className="w-24"
                    />
                    <Button
                      variant="destructive"
                      onClick={stopTimer}
                    >
                      Stop Timer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Pomodoro Timer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Work in focused intervals with short breaks
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => startTimer(25, 'white-noise')} 
                      className="w-full"
                    >
                      25 Min Focus
                    </Button>
                    <Button 
                      onClick={() => startTimer(5, 'nature')} 
                      variant="outline" 
                      className="w-full"
                    >
                      5 Min Break
                    </Button>
                    <Button 
                      onClick={() => startTimer(15, 'nature')} 
                      variant="outline" 
                      className="w-full"
                    >
                      15 Min Long Break
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Custom Focus Session
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set a custom length focus session
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => startTimer(45, 'white-noise')} 
                      className="w-full"
                    >
                      45 Min Deep Work
                    </Button>
                    <Button 
                      onClick={() => startTimer(60, 'rain')} 
                      variant="outline" 
                      className="w-full"
                    >
                      60 Min Flow State
                    </Button>
                    <Button 
                      onClick={() => startTimer(90, 'ambient')} 
                      variant="outline" 
                      className="w-full"
                    >
                      90 Min Complete Cycle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="focus" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Visual Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Reduce visual distractions and eye strain
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Dark Mode Activated",
                        description: "Reduced blue light to minimize eye strain."
                      });
                    }} 
                    className="w-full"
                  >
                    Dark Focus Mode
                  </Button>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Reading Mode Activated",
                        description: "Optimized contrast for extended reading."
                      });
                    }} 
                    variant="outline" 
                    className="w-full"
                  >
                    Reading Mode
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Energy Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Enhance energy and mental clarity
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Energy Boost Activated",
                        description: "Quick exercises to improve circulation and focus."
                      });
                    }} 
                    className="w-full"
                  >
                    5-Min Energy Boost
                  </Button>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Hydration Reminder Set",
                        description: "We'll remind you to stay hydrated for optimal focus."
                      });
                    }} 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Droplet className="h-4 w-4" />
                    Hydration Reminders
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="breathing" className="space-y-4">
          <Card className="border-primary/20">
            <CardContent className="pt-6 pb-4">
              <div className="flex flex-col items-center text-center space-y-6">
                <h3 className="font-medium">Box Breathing Technique</h3>
                <p className="text-sm text-muted-foreground">
                  A powerful technique to calm your mind and improve focus
                </p>
                
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <div 
                    className={`absolute w-32 h-32 rounded-lg transition-all duration-[4000ms] flex items-center justify-center ${getBoxStyles()}`}
                  >
                    <span className="text-lg font-medium">{getBreathText()}</span>
                  </div>
                </div>
                
                <div className="space-y-2 w-full">
                  {isBoxAnimating && (
                    <div className="text-center">
                      <p className="text-sm font-medium">Breath Cycles: {breathCount}</p>
                    </div>
                  )}
                  <Button
                    onClick={toggleBoxBreathing}
                    className="w-full"
                    variant={isBoxAnimating ? "destructive" : "default"}
                  >
                    {isBoxAnimating ? "Stop" : "Start"} Box Breathing
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Cloud className="h-5 w-5 text-primary" />
                Other Breathing Techniques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-muted flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2 mt-1">
                    <Wind className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">4-7-8 Breathing</h4>
                    <p className="text-sm text-muted-foreground">
                      Inhale for 4 seconds, hold for 7, exhale for 8. Reduces anxiety and improves focus.
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 h-auto"
                      onClick={() => {
                        toast({
                          title: "4-7-8 Breathing Guide",
                          description: "Try this technique when you need to calm your mind."
                        });
                      }}
                    >
                      Learn more
                    </Button>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-muted flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2 mt-1">
                    <Wind className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Coherent Breathing</h4>
                    <p className="text-sm text-muted-foreground">
                      Simple 5-second inhale, 5-second exhale pattern to balance the nervous system.
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 h-auto"
                      onClick={() => {
                        toast({
                          title: "Coherent Breathing Guide",
                          description: "A simple technique to quickly restore balance."
                        });
                      }}
                    >
                      Learn more
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="text-center py-2">
        <p className="text-sm text-muted-foreground">
          Start using these tools to improve your focus and productivity
        </p>
      </div>
    </div>
  );
};
