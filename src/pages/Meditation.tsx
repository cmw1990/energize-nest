import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Clock,
  Calendar,
  Sparkles,
  Moon,
  Sun,
  Wind,
  ChevronRight,
  Flame,
  Timer,
  MessageSquare, // Added for feedback notes
  Smile, // Added for mood rating
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useAudioGenerator } from "@/hooks/useAudioGenerator";

interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  category: string;
  audio_url: string;
  is_favorite: boolean;
  is_guided: boolean;
  instructor?: string;
  level: string;
  image_url?: string;
  created_at: string;
}

interface MeditationProgress {
  id: string;
  user_id: string;
  session_id: string;
  completed_at: string;
  duration_minutes: number;
  mood_before?: number;
  mood_after?: number;
  notes?: string;
}

// Type for data needed to log progress after feedback
type PendingProgressData = Omit<MeditationProgress, 'id' | 'mood_after' | 'notes'>;

const Meditation = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    startNatureSound,
    stopNatureSound,
    updateVolume,
    startBinauralBeat,
    stopBinauralBeat,
    stopAllAudio
  } = useAudioGenerator();

  const [activeTab, setActiveTab] = useState('discover');
  const [currentSession, setCurrentSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [remainingTime, setRemainingTime] = useState(0);
  const [ambientSound, setAmbientSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [meditationLength, setMeditationLength] = useState(10); // minutes
  const [selectedMoodBefore, setSelectedMoodBefore] = useState<number | null>(null); // Renamed for clarity

  // State for feedback dialog
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [postSessionMood, setPostSessionMood] = useState<number | null>(null);
  const [postSessionNotes, setPostSessionNotes] = useState<string>("");
  const [pendingProgressData, setPendingProgressData] = useState<PendingProgressData | null>(null);


  const { data: meditationSessions } = useQuery<MeditationSession[]>({
    queryKey: ['meditation-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const { data: userProgress } = useQuery<MeditationProgress[]>({
    queryKey: ['meditation-progress', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('meditation_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const logProgressMutation = useMutation({
    // Accepts the full progress object including feedback
    mutationFn: async (progressData: Omit<MeditationProgress, 'id'>) => {
      const { data, error } = await supabase
        .from('meditation_progress')
        .insert(progressData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meditation-progress'] });
      toast({
        title: "Session logged",
        description: "Your meditation session has been recorded",
      });
    },
    onError: (error) => {
      console.error('Error logging meditation:', error);
      toast({
        title: "Error saving progress",
        description: "There was an issue recording your meditation session",
        variant: "destructive",
      });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ id, isFavorite }: { id: string, isFavorite: boolean }) => {
      const { data, error } = await supabase
        .from('meditation_sessions')
        .update({ is_favorite: !isFavorite })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meditation-sessions'] });
      toast({
        title: "Favorite updated",
        description: "Your favorites have been updated",
      });
    },
    onError: (error) => {
      console.error('Error updating favorite:', error);
      toast({
        title: "Error updating favorite",
        description: "There was an issue updating your favorites",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Initialize audio
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    return () => {
      stopMeditation(); // Ensure cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    updateVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (currentSession && !isPlaying) {
      setRemainingTime(currentSession.duration_minutes * 60);
    }
  }, [currentSession]);

  const startMeditation = (meditation: MeditationSession) => {
    stopMeditation(); // Stop any previous session
    setCurrentSession(meditation);

    if (meditation.audio_url && audioRef.current) {
      audioRef.current.src = meditation.audio_url;
      audioRef.current.play().catch(err => console.error('Error playing audio:', err));
    }

    // Start timer
    setRemainingTime(meditation.duration_minutes * 60);
    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          completeMeditation(); // Trigger completion logic
          return 0;
        }
        return prev - 1;
      });
      setProgress(prev => prev + (100 / (meditation.duration_minutes * 60)));
    }, 1000);

    setIsPlaying(true);
    setProgress(0);
  };

  const startUnguided = () => {
    stopMeditation(); // Stop any previous session

    const unguidedSession: MeditationSession = {
      id: 'unguided-' + Date.now(), // Unique ID for logging
      title: 'Unguided Meditation',
      description: 'A silent meditation session',
      duration_minutes: meditationLength,
      category: 'unguided',
      audio_url: '',
      is_favorite: false,
      is_guided: false,
      level: 'all',
      created_at: new Date().toISOString()
    };

    setCurrentSession(unguidedSession);
    setRemainingTime(meditationLength * 60);
    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          completeMeditation(); // Trigger completion logic
          return 0;
        }
        return prev - 1;
      });
      setProgress(prev => prev + (100 / (meditationLength * 60)));
    }, 1000);

    setIsPlaying(true);
    setProgress(0);
  };

  const stopMeditation = (resetCurrent = true) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    stopAllAudio();
    setAmbientSound(null);
    setIsPlaying(false);
    setProgress(0); // Reset progress bar
    if (resetCurrent) {
      setCurrentSession(null); // Clear the current session display
      setSelectedMoodBefore(null); // Reset pre-session mood
    }
  };

  const pauseMeditation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    setIsPlaying(false);
  };

  const resumeMeditation = () => {
    if (!currentSession) return; // Should not happen if paused

    if (audioRef.current && currentSession.audio_url) {
      audioRef.current.play().catch(err => console.error('Error playing audio:', err));
    }

    const totalSeconds = currentSession.duration_minutes * 60;

    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          completeMeditation(); // Trigger completion logic
          return 0;
        }
        return prev - 1;
      });

      setProgress(prev => prev + (100 / totalSeconds));
    }, 1000);

    setIsPlaying(true);
  };

  const completeMeditation = () => {
    const completedSession = currentSession; // Capture session before stopping
    stopMeditation(false); // Stop timers/audio but keep session data for feedback

    if (completedSession && session?.user?.id) {
      // Prepare data needed for logging, excluding feedback yet
      const dataToLog: PendingProgressData = {
        user_id: session.user.id,
        session_id: completedSession.id,
        completed_at: new Date().toISOString(),
        duration_minutes: completedSession.duration_minutes,
        mood_before: selectedMoodBefore || undefined,
      };
      setPendingProgressData(dataToLog); // Store data
      setIsFeedbackDialogOpen(true); // Open feedback dialog
    } else {
      // If no session or user, just show a generic completion message
      toast({
        title: "Meditation finished",
        description: "Your session has ended.",
      });
      setCurrentSession(null); // Clear session display
      setSelectedMoodBefore(null);
    }
  };

  const handleFeedbackSubmit = () => {
    if (!pendingProgressData) return;

    const finalProgressData: Omit<MeditationProgress, 'id'> = {
      ...pendingProgressData,
      mood_after: postSessionMood || undefined,
      notes: postSessionNotes || undefined,
    };

    logProgressMutation.mutate(finalProgressData);

    // Reset states after submission
    setIsFeedbackDialogOpen(false);
    setPostSessionMood(null);
    setPostSessionNotes("");
    setPendingProgressData(null);
    setCurrentSession(null); // Clear session display now
    setSelectedMoodBefore(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.max(0, seconds % 60); // Ensure secs is not negative
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleAmbientSound = (soundName: string) => {
    if (ambientSound === soundName) {
      stopNatureSound();
      setAmbientSound(null);
    } else {
      if (ambientSound) {
        stopNatureSound(); // Stop current nature sound if different
        stopBinauralBeat(); // Stop binaural if active
      }
      startNatureSound(soundName, volume);
      setAmbientSound(soundName);
    }
  };

  const toggleBinauralBeat = () => {
    if (ambientSound === 'binaural') {
      stopBinauralBeat();
      setAmbientSound(null);
    } else {
      if (ambientSound) {
        stopNatureSound(); // Stop nature sound if active
      }
      stopBinauralBeat(); // Ensure only one binaural beat plays
      startBinauralBeat(100, 7.83, volume); // Example: Schumann resonance
      setAmbientSound('binaural');
    }
  };

  const toggleFavorite = (id: string, isFavorite: boolean) => {
    toggleFavoriteMutation.mutate({ id, isFavorite });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sleep':
        return <Moon className="h-4 w-4" />;
      case 'focus':
        return <Sparkles className="h-4 w-4" />;
      case 'stress':
        return <Wind className="h-4 w-4" />;
      case 'morning':
        return <Sun className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getSessionsByCategory = (category: string) => {
    return meditationSessions?.filter(s => s.category === category) || [];
  };

  const getFavorites = () => {
    return meditationSessions?.filter(s => s.is_favorite) || [];
  };

  const getRecentlyCompleted = () => {
    if (!userProgress || !meditationSessions) return [];

    // Get unique recent session IDs, preserving order
    const recentSessionIds = Array.from(new Set(userProgress.map(p => p.session_id))).slice(0, 10);

    // Map IDs back to full session objects
    const recentSessionsMap = new Map(meditationSessions.map(s => [s.id, s]));
    return recentSessionIds.map(id => recentSessionsMap.get(id)).filter(Boolean) as MeditationSession[];
  };

  const getMeditationStats = () => {
    if (!userProgress) return { total: 0, streak: 0, minutes: 0 };

    const total = userProgress.length;

    // Calculate streak (simplified: checks consecutive days based on completed_at)
    let streak = 0;
    if (total > 0) {
        const sortedDates = userProgress
            .map(p => new Date(p.completed_at))
            .sort((a, b) => b.getTime() - a.getTime());

        const uniqueDays = Array.from(new Set(sortedDates.map(d => d.toDateString())));

        if (uniqueDays.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let currentStreakDate = new Date(today);

            for (let i = 0; i < uniqueDays.length; i++) {
                const meditationDate = new Date(uniqueDays[i]);
                meditationDate.setHours(0, 0, 0, 0);

                if (meditationDate.getTime() === currentStreakDate.getTime()) {
                    streak++;
                    currentStreakDate.setDate(currentStreakDate.getDate() - 1);
                } else if (meditationDate.getTime() < currentStreakDate.getTime()) {
                    // If we missed a day, break the streak check
                    break;
                }
                // If meditationDate > currentStreakDate (future date?), ignore and continue checking past days
            }
             // If the most recent meditation wasn't today, the streak is 0
             const mostRecentMeditation = new Date(uniqueDays[0]);
             mostRecentMeditation.setHours(0,0,0,0);
             if(mostRecentMeditation.getTime() !== today.getTime()){
                 streak = 0;
             }
        }
    }


    // Calculate total minutes
    const minutes = userProgress.reduce((total, progress) => {
      // Ensure duration is a number before adding
      return total + (Number(progress.duration_minutes) || 0);
    }, 0);

    return { total, streak, minutes };
  };

  // Feedback Dialog Component
  const FeedbackDialog = () => (
    <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Session Complete!</DialogTitle>
          <DialogDescription>
            How are you feeling after your meditation? Your feedback helps track your progress.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mood-after" className="text-right col-span-1">
              Mood
            </Label>
            <RadioGroup
              id="mood-after"
              className="col-span-3 grid grid-cols-5 gap-2"
              value={postSessionMood?.toString()}
              onValueChange={(value) => setPostSessionMood(Number(value))}
            >
              {[1, 2, 3, 4, 5].map(rating => (
                <div key={rating} className="flex flex-col items-center space-y-1">
                  <RadioGroupItem value={rating.toString()} id={`mood-${rating}`} className="peer sr-only" />
                  <Label
                    htmlFor={`mood-${rating}`}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Smile className={`h-6 w-6 mb-1 ${postSessionMood === rating ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-xs">{rating}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right col-span-1">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Any thoughts or sensations during the session?"
              className="col-span-3"
              value={postSessionNotes}
              onChange={(e) => setPostSessionNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
             <Button type="button" variant="outline" onClick={() => {
                 // Handle case where user closes without submitting feedback
                 // Still log basic progress if needed, or just close
                 setPendingProgressData(null); // Clear pending data
                 setCurrentSession(null);
                 setSelectedMoodBefore(null);
             }}>
              Skip
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleFeedbackSubmit}>Save Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );


  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meditation</h1>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-medium text-primary">Mindfulness Practice</span>
        </div>
      </div>

      {/* Player Card */}
      {currentSession && (
        <Card className="border-primary/20 bg-primary/5 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Timer/Visualizer */}
              <div className="w-full md:w-1/3 flex flex-col items-center text-center">
                <div className="relative w-48 h-48 mb-4">
                  {/* Background circle */}
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                  {/* Progress circle */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50" cy="50" r="46" fill="none" stroke="currentColor"
                      strokeWidth="8" strokeLinecap="round" className="text-primary/20"
                    />
                    <circle
                      cx="50" cy="50" r="46" fill="none" stroke="currentColor"
                      strokeWidth="8" strokeLinecap="round" className="text-primary animate-pulse"
                      strokeDasharray="289.2" strokeDashoffset={289.2 - (progress / 100) * 289.2}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  {/* Time display */}
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold">{formatTime(remainingTime)}</span>
                    <span className="text-sm text-muted-foreground">remaining</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold">{currentSession.title}</h2>
                <p className="text-muted-foreground text-sm mt-1 mb-4">
                  {currentSession.is_guided ? 'Guided' : 'Unguided'} • {currentSession.duration_minutes} min
                </p>

                {/* Player Controls */}
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline" size="icon" onClick={() => stopMeditation()} // Wrap in arrow function
                    className="rounded-full h-12 w-12" title="Stop Session"
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="default" size="icon" onClick={isPlaying ? pauseMeditation : resumeMeditation}
                    className="rounded-full h-14 w-14 bg-primary"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                  </Button>
                  <Button
                    variant="outline" size="icon" onClick={completeMeditation}
                    className="rounded-full h-12 w-12" title="Complete Session"
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Ambient Sounds & Volume */}
              <div className="w-full md:w-2/3 space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Ambient Sounds</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {/* Sound Buttons */}
                    <Button variant={ambientSound === 'forest' ? 'default' : 'outline'} className="h-auto py-2 flex flex-col gap-1" onClick={() => toggleAmbientSound('forest')}>
                      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M21 18H9V21H15V19.5H12V18H21ZM12 18V21H9V18H3C3 13.0294 7.02944 9 12 9C16.9706 9 21 13.0294 21 18H12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span className="text-xs">Forest</span>
                    </Button>
                    <Button variant={ambientSound === 'rain' ? 'default' : 'outline'} className="h-auto py-2 flex flex-col gap-1" onClick={() => toggleAmbientSound('rain')}>
                       <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M20 16.2214C20 18.8475 17.8475 21 15.2214 21C13.7747 21 12.5 20.2214 11.6025 19.0261M15.2214 3C17.8475 3 20 5.1525 20 7.7786C20 8.87439 19.6549 9.89767 19.0697 10.7305M3 15.2214C3 17.8475 5.1525 20 7.7786 20C9.89767 20 11.6913 18.6738 12.4549 16.7913M3 7.7786C3 5.1525 5.1525 3 7.7786 3C10.4047 3 12.5572 5.1525 12.5572 7.7786C12.5572 10.4047 10.4047 12.5572 7.7786 12.5572C5.1525 12.5572 3 10.4047 3 7.7786Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span className="text-xs">Rain</span>
                    </Button>
                    <Button variant={ambientSound === 'ocean' ? 'default' : 'outline'} className="h-auto py-2 flex flex-col gap-1" onClick={() => toggleAmbientSound('ocean')}>
                      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M3 10C5.48276 10 7.13793 7 7.96552 7C8.79311 7 9.2069 8 10.4483 8C11.6897 8 12.5172 7 13.3448 7C14.1724 7 14.5862 10 17.0689 10C19.5517 10 21 7 21 7M3 17C5.48276 17 7.13793 14 7.96552 14C8.79311 14 9.2069 15 10.4483 15C11.6897 15 12.5172 14 13.3448 14C14.1724 14 14.5862 17 17.0689 17C19.5517 17 21 14 21 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span className="text-xs">Ocean</span>
                    </Button>
                    <Button variant={ambientSound === 'night' ? 'default' : 'outline'} className="h-auto py-2 flex flex-col gap-1" onClick={() => toggleAmbientSound('night')}>
                      <Moon className="h-5 w-5" />
                      <span className="text-xs">Night</span>
                    </Button>
                    <Button variant={ambientSound === 'binaural' ? 'default' : 'outline'} className="h-auto py-2 flex flex-col gap-1" onClick={toggleBinauralBeat}>
                      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.5 17C13.5 17.8284 12.8284 18.5 12 18.5C11.1716 18.5 10.5 17.8284 10.5 17C10.5 16.1716 11.1716 15.5 12 15.5C12.8284 15.5 13.5 16.1716 13.5 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.5 12C16.5 14.4853 14.4853 16.5 12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19.5 12C19.5 16.1421 16.1421 19.5 12 19.5C7.85786 19.5 4.5 16.1421 4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C16.1421 4.5 19.5 7.85786 19.5 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span className="text-xs">Binaural</span>
                    </Button>
                    <Button variant={ambientSound === 'fire' ? 'default' : 'outline'} className="h-auto py-2 flex flex-col gap-1" onClick={() => toggleAmbientSound('fire')}>
                      <Flame className="h-5 w-5" />
                      <span className="text-xs">Fire</span>
                    </Button>
                  </div>
                </div>

                {/* Volume Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Volume2 className="h-4 w-4" /> Volume
                    </label>
                    <span className="text-sm">{Math.round(volume * 100)}%</span>
                  </div>
                  <Slider value={[volume]} max={1} step={0.01} onValueChange={(values) => setVolume(values[0])} />
                </div>

                {/* Pre-session Mood (Only show if not guided?) */}
                {/* Consider if this should be shown during the session or only for unguided setup */}
                {/*
                {!currentSession.is_guided && (
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-2">How are you feeling?</h3>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <Button
                          key={rating}
                          variant={selectedMoodBefore === rating ? "default" : "outline"}
                          className="flex-1"
                          onClick={() => setSelectedMoodBefore(rating)}
                        >
                          {rating === 1 && "Very Stressed"}
                          {rating === 2 && "Anxious"}
                          {rating === 3 && "Neutral"}
                          {rating === 4 && "Calm"}
                          {rating === 5 && "Very Peaceful"}
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Rate your current mood to track your progress over time
                    </p>
                  </div>
                )}
                */}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for Discover, Guided, Unguided */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="discover" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> <span>Discover</span>
          </TabsTrigger>
          <TabsTrigger value="guided" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> <span>Guided</span>
          </TabsTrigger>
          <TabsTrigger value="unguided" className="flex items-center gap-2">
            <Timer className="h-4 w-4" /> <span>Unguided</span>
          </TabsTrigger>
        </TabsList>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-6">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Meditation Statistics</CardTitle>
              <CardDescription>Track your mindfulness journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <h3 className="text-xl font-bold">{getMeditationStats().total}</h3>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <h3 className="text-xl font-bold">{getMeditationStats().streak}</h3>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <h3 className="text-xl font-bold">{getMeditationStats().minutes}</h3>
                  <p className="text-sm text-muted-foreground">Total Minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Favorites Section */}
          {getFavorites().length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Favorites</h2>
                {/* <Button variant="ghost" className="text-sm p-0 h-auto">See All <ChevronRight className="h-4 w-4 ml-1" /></Button> */}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getFavorites().slice(0, 3).map(meditation => (
                  <Card key={meditation.id} className="overflow-hidden">
                    {/* Card Content */}
                     <div className="relative h-40 bg-muted">
                       {meditation.image_url ? (
                         <img src={meditation.image_url} alt={meditation.title} className="w-full h-full object-cover"/>
                       ) : (
                         <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                           <Sparkles className="h-12 w-12 text-primary/40" />
                         </div>
                       )}
                       <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-white bg-black/30 hover:bg-black/50" onClick={() => toggleFavorite(meditation.id, meditation.is_favorite)}>
                         <Heart className="h-4 w-4" fill={meditation.is_favorite ? "currentColor" : "none"} />
                       </Button>
                     </div>
                     <CardContent className="p-4">
                       <h3 className="font-medium mb-1">{meditation.title}</h3>
                       <div className="flex justify-between items-center mb-3">
                         <div className="flex items-center gap-2">
                           <Badge variant="outline" className="text-xs">{meditation.duration_minutes} min</Badge>
                           <Badge variant="outline" className="text-xs capitalize">{meditation.level}</Badge>
                         </div>
                         <div className="text-xs text-muted-foreground">{meditation.is_guided ? 'Guided' : 'Unguided'}</div>
                       </div>
                       <Button className="w-full" onClick={() => startMeditation(meditation)}>
                         <Play className="h-4 w-4 mr-2" /> Begin
                       </Button>
                     </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recently Completed Section */}
           <div className="space-y-3">
             <div className="flex justify-between items-center">
               <h2 className="text-xl font-semibold">Recently Completed</h2>
               {/* <Button variant="ghost" className="text-sm p-0 h-auto">See All <ChevronRight className="h-4 w-4 ml-1" /></Button> */}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               {getRecentlyCompleted().slice(0, 4).map(meditation => (
                 <Card key={meditation.id} className="overflow-hidden">
                   <CardContent className="p-4">
                     <div className="flex justify-between items-start mb-2">
                       <h3 className="font-medium">{meditation.title}</h3>
                       <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFavorite(meditation.id, meditation.is_favorite)}>
                         <Heart className="h-4 w-4" fill={meditation.is_favorite ? "currentColor" : "none"} />
                       </Button>
                     </div>
                     <div className="flex items-center gap-2 mb-3">
                       <Badge variant="outline" className="text-xs">{meditation.duration_minutes} min</Badge>
                       <Badge variant="outline" className={`text-xs`}>
                         <div className="flex items-center gap-1">
                           {getCategoryIcon(meditation.category)}
                           <span className="capitalize">{meditation.category}</span>
                         </div>
                       </Badge>
                     </div>
                     <Button className="w-full" onClick={() => startMeditation(meditation)}>
                       <Play className="h-4 w-4 mr-2" /> Begin
                     </Button>
                   </CardContent>
                 </Card>
               ))}
             </div>
           </div>

          {/* Category Sections */}
          {['sleep', 'focus', 'stress', 'morning'].map(category => (
            <div key={category} className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold capitalize flex items-center gap-2">
                  {getCategoryIcon(category)} <span>{category} Meditations</span>
                </h2>
                {/* <Button variant="ghost" className="text-sm p-0 h-auto">See All <ChevronRight className="h-4 w-4 ml-1" /></Button> */}
              </div>
              <ScrollArea className="w-full whitespace-nowrap pb-4" type="always">
                <div className="flex space-x-4">
                  {getSessionsByCategory(category).map(meditation => (
                    <Card key={meditation.id} className="w-64 flex-shrink-0">
                      {/* Card Content */}
                       <div className="relative h-32 bg-muted">
                         {meditation.image_url ? (
                           <img src={meditation.image_url} alt={meditation.title} className="w-full h-full object-cover"/>
                         ) : (
                           <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                             {getCategoryIcon(category)}
                           </div>
                         )}
                         <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-white bg-black/30 hover:bg-black/50" onClick={() => toggleFavorite(meditation.id, meditation.is_favorite)}>
                           <Heart className="h-4 w-4" fill={meditation.is_favorite ? "currentColor" : "none"} />
                         </Button>
                       </div>
                       <CardContent className="p-4">
                         <h3 className="font-medium mb-1">{meditation.title}</h3>
                         <div className="flex items-center gap-2 mb-3">
                           <Badge variant="outline" className="text-xs">{meditation.duration_minutes} min</Badge>
                           {meditation.is_guided && <Badge variant="outline" className="text-xs">Guided</Badge>}
                         </div>
                         <Button className="w-full" onClick={() => startMeditation(meditation)}>
                           <Play className="h-4 w-4 mr-2" /> Begin
                         </Button>
                       </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ))}
        </TabsContent>

        {/* Guided Tab */}
        <TabsContent value="guided" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guided Meditations</CardTitle>
              <CardDescription>Professionally guided sessions for all levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {meditationSessions?.filter(s => s.is_guided).map(meditation => (
                  <Card key={meditation.id} className="overflow-hidden">
                    {/* Card Content */}
                     <div className="relative h-40 bg-muted">
                       {meditation.image_url ? (
                         <img src={meditation.image_url} alt={meditation.title} className="w-full h-full object-cover"/>
                       ) : (
                         <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                           {getCategoryIcon(meditation.category)}
                         </div>
                       )}
                       <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-white bg-black/30 hover:bg-black/50" onClick={() => toggleFavorite(meditation.id, meditation.is_favorite)}>
                         <Heart className="h-4 w-4" fill={meditation.is_favorite ? "currentColor" : "none"} />
                       </Button>
                     </div>
                     <CardContent className="p-4">
                       <h3 className="font-medium mb-1">{meditation.title}</h3>
                       <div className="flex justify-between items-center mb-2">
                         <div className="flex items-center gap-2">
                           <Badge variant="outline" className="text-xs">{meditation.duration_minutes} min</Badge>
                           <Badge variant="outline" className="text-xs capitalize">{meditation.level}</Badge>
                         </div>
                       </div>
                       <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{meditation.description}</p>
                       {meditation.instructor && <div className="text-xs text-muted-foreground mb-3">Instructor: {meditation.instructor}</div>}
                       <Button className="w-full" onClick={() => startMeditation(meditation)}>
                         <Play className="h-4 w-4 mr-2" /> Begin
                       </Button>
                     </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Unguided Tab */}
        <TabsContent value="unguided" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Unguided Meditation</CardTitle>
              <CardDescription>Create your own meditation experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Timer Setup */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Set Your Timer</h3>
                  <div className="space-y-4">
                    {/* Duration Buttons */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration (minutes)</label>
                      <div className="flex items-center gap-4">
                        {[5, 10, 15, 20, 30].map(len => (
                           <Button key={len} variant="outline" className={meditationLength === len ? 'bg-primary text-primary-foreground' : ''} onClick={() => setMeditationLength(len)}>
                             {len}
                           </Button>
                        ))}
                      </div>
                    </div>
                    {/* Pre-session Mood */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">How are you feeling now?</label>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map(rating => (
                          <Button
                            key={rating}
                            variant={selectedMoodBefore === rating ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setSelectedMoodBefore(rating)}
                          >
                            {rating === 1 && "Very Stressed"}
                            {rating === 2 && "Anxious"}
                            {rating === 3 && "Neutral"}
                            {rating === 4 && "Calm"}
                            {rating === 5 && "Very Peaceful"}
                          </Button>
                        ))}
                      </div>
                    </div>
                    {/* Start Button */}
                    <Button className="w-full mt-4" onClick={startUnguided}>
                      <Play className="h-4 w-4 mr-2" /> Begin Meditation
                    </Button>
                  </div>
                </div>
                {/* Meditation Tips */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Meditation Tips</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-medium mb-1 flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-primary"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.0399 7.99994C11.9599 7.99994 11.8799 7.99994 11.7999 7.99994C10.9999 8.03994 10.3599 8.73994 10.3599 9.57994C10.3599 10.4199 11.0399 11.0999 11.8799 11.0999C12.7199 11.0999 13.3999 10.4199 13.3999 9.57994C13.3999 8.73994 12.7599 8.03994 11.9599 7.99994" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M11.9998 14.7H12.0098" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Find a comfortable position
                      </h4>
                      <p className="text-sm text-muted-foreground">Sit in a position that allows you to be both alert and relaxed.</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-medium mb-1 flex items-center gap-2">
                        <Wind className="h-4 w-4 text-primary" /> Focus on your breath
                      </h4>
                      <p className="text-sm text-muted-foreground">Pay attention to the sensation of your breath. Gently bring back a wandering mind.</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-medium mb-1 flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-primary"><path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Use visualization
                      </h4>
                      <p className="text-sm text-muted-foreground">Imagine a peaceful scene or visualize tension leaving your body.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Feedback Dialog */}
      <FeedbackDialog />

    </div>
  );
};

export default Meditation;
