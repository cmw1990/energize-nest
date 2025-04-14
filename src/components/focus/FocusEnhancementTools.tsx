import React, { useState, useEffect, useRef } from 'react';
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
  Cloud,
  Play, // Added Play
  Pause, // Added Pause
  StopCircle // Added StopCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Added mutation hooks
import { supabase } from '@/integrations/supabase/client'; // Added supabase client
import { useAuth } from '@/components/AuthProvider'; // Added AuthProvider
import { motion } from "framer-motion"; // Added motion

// Define Timer Type
type TimerType = 'pomodoro_focus' | 'pomodoro_short_break' | 'pomodoro_long_break' | 'custom_focus' | 'box_breathing';

export const FocusEnhancementTools = () => {
  const { session } = useAuth(); // Get user session
  const { toast } = useToast();
  const queryClient = useQueryClient(); // Get query client
  const [activeTimerType, setActiveTimerType] = useState<TimerType | null>(null); // More specific timer type
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(50);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [sound, setSound] = useState<HTMLAudioElement | null>(null);
  const [soundType, setSoundType] = useState<string>('none'); // Track current sound type
  const [breathCycle, setBreathCycle] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [breathCount, setBreathCount] = useState<number>(0);
  const [isBoxAnimating, setIsBoxAnimating] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // Track play/pause state
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Use NodeJS.Timeout type

  // Mutation to save focus session
  const saveFocusSessionMutation = useMutation({
    mutationFn: async (sessionData: { duration_minutes: number; type: TimerType }) => {
      if (!session?.user?.id) throw new Error("User not authenticated");
      // TODO: Replace with REST API call if required
      const { error } = await supabase
        .from('focus_sessions') // Assuming this table exists
        .insert({
          user_id: session.user.id,
          duration_minutes: sessionData.duration_minutes,
          type: sessionData.type,
          // completed_at defaults to now() in DB
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focus-analytics', session?.user?.id] }); // Invalidate analytics data
      // Toast is handled in complete/stop functions
    },
    onError: (error) => {
      console.error("Error saving focus session:", error);
      toast({
        title: "Logging Error",
        description: "Could not save your focus session.",
        variant: "destructive",
      });
    },
  });


  // Timer logic
  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isPlaying && timeRemaining === 0) {
      // Timer finished naturally
      completeTimer();
    }

    // Cleanup interval on unmount or when isPlaying/timeRemaining changes
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timeRemaining]); // Dependencies: isPlaying, timeRemaining

  // Sound management
  useEffect(() => {
    if (sound) {
      sound.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted, sound]);

  // Cleanup sound on component unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    };
  }, [sound]);


  // Breathing animation logic (keep as is)
  useEffect(() => {
    let breathInterval: NodeJS.Timeout | null = null;
    if (isBoxAnimating) {
      breathInterval = setInterval(() => {
        setBreathCycle(prev => {
          switch (prev) {
            case 'inhale': return 'hold';
            case 'hold': return 'exhale';
            case 'exhale': return 'rest';
            case 'rest': setBreathCount(count => count + 1); return 'inhale';
            default: return 'inhale';
          }
        });
      }, breathCycle === 'inhale' || breathCycle === 'exhale' ? 4000 : breathCycle === 'hold' || breathCycle === 'rest' ? 2000 : 4000);
    }
    return () => { if (breathInterval) clearInterval(breathInterval); };
  }, [isBoxAnimating, breathCycle]);


  const startTimer = (minutes: number, type: TimerType, soundName: string = 'none') => {
    stopTimer(false); // Stop previous timer without logging completion
    setIsBoxAnimating(false); // Stop breathing animation if running

    const totalSeconds = minutes * 60;
    setTotalTime(totalSeconds);
    setTimeRemaining(totalSeconds);
    setActiveTimerType(type);
    setIsPlaying(true);
    setSoundType(soundName); // Store selected sound

    // Clean up existing sound
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }

    // Start new sound if selected
    if (soundName !== 'none') {
      try {
        const audio = new Audio(`/sounds/${soundName}.mp3`);
        audio.loop = true;
        audio.volume = isMuted ? 0 : volume / 100;
        audio.play().catch(error => console.error("Error playing audio:", error));
        setSound(audio);
      } catch (error) {
         console.error(`Failed to load sound: ${soundName}`, error);
         setSound(null);
         toast({ title: "Sound Error", description: `Could not load ${soundName} sound.`, variant: "destructive" });
      }
    } else {
      setSound(null);
    }

    toast({
      title: `${type.replace(/_/g, ' ')} Started`,
      description: `${minutes} minute session initiated.`,
    });
  };

  const pauseTimer = () => {
     if (timerRef.current) clearInterval(timerRef.current);
     setIsPlaying(false);
     if (sound) sound.pause();
  };

  const resumeTimer = () => {
     setIsPlaying(true);
     if (sound) sound.play().catch(error => console.error("Error resuming audio:", error));
  };

  // Function called when timer completes naturally
  const completeTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
      setSound(null);
    }

    if (activeTimerType && totalTime > 0 && session?.user?.id) {
      saveFocusSessionMutation.mutate({
        duration_minutes: totalTime / 60,
        type: activeTimerType,
      });
    }

    toast({
      title: "Session Complete!",
      description: `Your ${activeTimerType?.replace(/_/g, ' ')} session has finished.`,
    });

    // Reset state after completion
    setActiveTimerType(null);
    setTimeRemaining(0);
    setTotalTime(0);
    setSoundType('none');
  };

  // Function called when user manually stops the timer
  const stopTimer = (showToast = true) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
      setSound(null);
    }

    // Log session if it ran for a significant duration (e.g., > 1 minute)
    const elapsedSeconds = totalTime - timeRemaining;
    if (activeTimerType && elapsedSeconds > 60 && session?.user?.id) {
       saveFocusSessionMutation.mutate({
         duration_minutes: Math.round(elapsedSeconds / 60),
         type: activeTimerType,
       });
       if (showToast) toast({ title: "Session Stopped & Logged", description: "Your focus session progress has been saved." });
    } else if (showToast) {
       toast({ title: "Timer Stopped", description: "Your focus session has been stopped." });
    }


    // Reset state
    setActiveTimerType(null);
    setTimeRemaining(0);
    setTotalTime(0);
    setSoundType('none');
  };


  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Volume is handled by useEffect
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
    if (isBoxAnimating) {
       // Stop breathing
       setIsBoxAnimating(false);
       if (timerRef.current) clearInterval(timerRef.current); // Clear any potential timer from breathing
       toast({
         title: "Box Breathing Stopped",
         description: `You completed ${breathCount} breath cycles.`,
       });
    } else {
       // Start breathing
       stopTimer(false); // Stop any active focus timer
       setIsBoxAnimating(true);
       setBreathCycle('inhale');
       setBreathCount(0);
       setActiveTimerType('box_breathing'); // Set type for context
       toast({
         title: "Box Breathing Started",
         description: "Follow the animation to regulate your breathing.",
       });
    }
  };


  const getBoxStyles = () => {
    switch (breathCycle) {
      case 'inhale': return 'scale-100 bg-blue-100 dark:bg-blue-900/30';
      case 'hold': return 'scale-100 bg-green-100 dark:bg-green-900/30';
      case 'exhale': return 'scale-50 bg-purple-100 dark:bg-purple-900/30';
      case 'rest': return 'scale-50 bg-gray-100 dark:bg-gray-900/30';
      default: return 'scale-75 bg-blue-100 dark:bg-blue-900/30';
    }
  };

  const getBreathText = () => {
    switch (breathCycle) {
      case 'inhale': return 'Inhale';
      case 'hold': return 'Hold';
      case 'exhale': return 'Exhale';
      case 'rest': return 'Rest';
      default: return 'Breathe';
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
          {activeTimerType && activeTimerType.startsWith('pomodoro') ? (
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
              <CardContent className="pt-6 pb-4">
                <div className="flex flex-col items-center text-center space-y-4">
                   <h3 className="text-lg font-semibold capitalize">{activeTimerType.replace(/_/g, ' ')}</h3>
                  <div className="rounded-full w-32 h-32 border-4 border-primary flex items-center justify-center relative">
                     {/* Progress Ring */}
                     <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary/10" />
                       <motion.circle
                         cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
                         className="text-primary"
                         strokeDasharray="289.2"
                         initial={{ strokeDashoffset: 289.2 }}
                         animate={{ strokeDashoffset: 289.2 - (calculateProgress() / 100) * 289.2 }}
                         transition={{ duration: 1, ease: "linear" }}
                         transform="rotate(-90 50 50)"
                       />
                     </svg>
                    <span className="text-3xl font-mono font-bold z-10">{formatTime(timeRemaining)}</span>
                  </div>
                  {/* <Progress value={calculateProgress()} className="w-full h-2" /> */}
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={toggleMute} className="rounded-full">
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Slider value={[volume]} onValueChange={(values) => setVolume(values[0])} disabled={isMuted} className="w-24" max={100} step={1}/>
                    <Button variant={isPlaying ? "outline" : "default"} size="icon" onClick={isPlaying ? pauseTimer : resumeTimer} className="rounded-full w-12 h-12">
                       {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => stopTimer()} className="rounded-full w-12 h-12">
                       <StopCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Pomodoro Timer</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Work in focused intervals with short breaks</p>
                  <div className="space-y-3">
                    <Button onClick={() => startTimer(25, 'pomodoro_focus', 'white-noise')} className="w-full">25 Min Focus</Button>
                    <Button onClick={() => startTimer(5, 'pomodoro_short_break', 'nature')} variant="outline" className="w-full">5 Min Break</Button>
                    <Button onClick={() => startTimer(15, 'pomodoro_long_break', 'nature')} variant="outline" className="w-full">15 Min Long Break</Button>
                  </div>
                </CardContent>
              </Card>
              {/* Custom Focus Session Card remains the same */}
              <Card className="hover:shadow-md transition-shadow">
                 <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-primary" />Custom Focus Session</CardTitle></CardHeader>
                 <CardContent>
                   <p className="text-sm text-muted-foreground mb-4">Set a custom length focus session</p>
                   <div className="space-y-3">
                     <Button onClick={() => startTimer(45, 'custom_focus', 'white-noise')} className="w-full">45 Min Deep Work</Button>
                     <Button onClick={() => startTimer(60, 'custom_focus', 'rain')} variant="outline" className="w-full">60 Min Flow State</Button>
                     <Button onClick={() => startTimer(90, 'custom_focus', 'ambient')} variant="outline" className="w-full">90 Min Complete Cycle</Button>
                   </div>
                 </CardContent>
               </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="focus" className="space-y-4">
           {/* Focus Mode Content (Visual Focus, Energy Focus) - Keep as is for now */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="hover:shadow-md transition-shadow">
               <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Eye className="h-5 w-5 text-primary" />Visual Focus</CardTitle></CardHeader>
               <CardContent>
                 <p className="text-sm text-muted-foreground mb-4">Reduce visual distractions and eye strain</p>
                 <div className="space-y-3">
                   <Button onClick={() => toast({ title: "Dark Mode Activated", description: "Reduced blue light to minimize eye strain."})} className="w-full">Dark Focus Mode</Button>
                   <Button onClick={() => toast({ title: "Reading Mode Activated", description: "Optimized contrast for extended reading."})} variant="outline" className="w-full">Reading Mode</Button>
                 </div>
               </CardContent>
             </Card>
             <Card className="hover:shadow-md transition-shadow">
               <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Zap className="h-5 w-5 text-primary" />Energy Focus</CardTitle></CardHeader>
               <CardContent>
                 <p className="text-sm text-muted-foreground mb-4">Enhance energy and mental clarity</p>
                 <div className="space-y-3">
                   <Button onClick={() => toast({ title: "Energy Boost Activated", description: "Quick exercises to improve circulation and focus."})} className="w-full">5-Min Energy Boost</Button>
                   <Button onClick={() => toast({ title: "Hydration Reminder Set", description: "We'll remind you to stay hydrated for optimal focus."})} variant="outline" className="w-full flex items-center justify-center gap-2"><Droplet className="h-4 w-4" />Hydration Reminders</Button>
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
                <p className="text-sm text-muted-foreground">A powerful technique to calm your mind and improve focus</p>
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <motion.div
                    className={`absolute w-32 h-32 rounded-lg flex items-center justify-center transition-all duration-1000 ease-in-out ${getBoxStyles()}`}
                    animate={{ scale: breathCycle === 'inhale' || breathCycle === 'hold' ? 1 : 0.6 }}
                    transition={{ duration: breathCycle === 'inhale' || breathCycle === 'exhale' ? 4 : 0.5 }} // Adjust duration based on phase
                  >
                    <span className="text-lg font-medium">{getBreathText()}</span>
                  </motion.div>
                </div>
                <div className="space-y-2 w-full">
                  {isBoxAnimating && (<div className="text-center"><p className="text-sm font-medium">Breath Cycles: {breathCount}</p></div>)}
                  <Button onClick={toggleBoxBreathing} className="w-full" variant={isBoxAnimating ? "destructive" : "default"}>
                    {isBoxAnimating ? "Stop" : "Start"} Box Breathing
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Other Breathing Techniques Card - Keep as is */}
           <Card className="hover:shadow-md transition-shadow">
             <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Cloud className="h-5 w-5 text-primary" />Other Breathing Techniques</CardTitle></CardHeader>
             <CardContent>
               <div className="space-y-4">
                 <div className="p-3 rounded-lg bg-muted flex items-start gap-3">
                   <div className="rounded-full bg-primary/10 p-2 mt-1"><Wind className="h-4 w-4 text-primary" /></div>
                   <div>
                     <h4 className="font-medium mb-1">4-7-8 Breathing</h4>
                     <p className="text-sm text-muted-foreground">Inhale for 4 seconds, hold for 7, exhale for 8. Reduces anxiety and improves focus.</p>
                     <Button variant="link" size="sm" className="px-0 h-auto" onClick={() => toast({ title: "4-7-8 Breathing Guide", description: "Try this technique when you need to calm your mind."})}>Learn more</Button>
                   </div>
                 </div>
                 <div className="p-3 rounded-lg bg-muted flex items-start gap-3">
                   <div className="rounded-full bg-primary/10 p-2 mt-1"><Wind className="h-4 w-4 text-primary" /></div>
                   <div>
                     <h4 className="font-medium mb-1">Coherent Breathing</h4>
                     <p className="text-sm text-muted-foreground">Simple 5-second inhale, 5-second exhale pattern to balance the nervous system.</p>
                     <Button variant="link" size="sm" className="px-0 h-auto" onClick={() => toast({ title: "Coherent Breathing Guide", description: "A simple technique to quickly restore balance."})}>Learn more</Button>
                   </div>
                 </div>
               </div>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>

      {/* Removed redundant footer text */}
    </div>
  );
};
