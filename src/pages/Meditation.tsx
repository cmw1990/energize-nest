
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
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
  Timer
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
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  
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
      stopMeditation();
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
    stopMeditation();
    setCurrentSession(meditation);
    
    if (meditation.audio_url && audioRef.current) {
      audioRef.current.src = meditation.audio_url;
      audioRef.current.play().catch(err => console.error('Error playing audio:', err));
    }
    
    // For unguided meditation, start a timer
    setRemainingTime(meditation.duration_minutes * 60);
    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          completeMeditation();
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
    stopMeditation();
    
    const unguidedSession: MeditationSession = {
      id: 'unguided',
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
          completeMeditation();
          return 0;
        }
        return prev - 1;
      });
      setProgress(prev => prev + (100 / (meditationLength * 60)));
    }, 1000);
    
    setIsPlaying(true);
    setProgress(0);
  };
  
  const stopMeditation = () => {
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
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.error('Error playing audio:', err));
    }
    
    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          completeMeditation();
          return 0;
        }
        return prev - 1;
      });
      
      const totalSeconds = currentSession?.duration_minutes 
        ? currentSession.duration_minutes * 60 
        : meditationLength * 60;
      
      setProgress(prev => prev + (100 / totalSeconds));
    }, 1000);
    
    setIsPlaying(true);
  };
  
  const completeMeditation = () => {
    stopMeditation();
    
    if (currentSession && session?.user?.id) {
      const progressData: Omit<MeditationProgress, 'id'> = {
        user_id: session.user.id,
        session_id: currentSession.id,
        completed_at: new Date().toISOString(),
        duration_minutes: currentSession.duration_minutes,
        mood_before: selectedMood || undefined,
      };
      
      logProgressMutation.mutate(progressData);
    }
    
    toast({
      title: "Meditation complete",
      description: "Great job! You've completed your meditation session.",
    });
    
    setSelectedMood(null);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const toggleAmbientSound = (soundName: string) => {
    if (ambientSound === soundName) {
      stopNatureSound();
      setAmbientSound(null);
    } else {
      if (ambientSound) {
        stopNatureSound();
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
        stopNatureSound();
      }
      stopBinauralBeat();
      startBinauralBeat(100, 7.83, volume); // Schumann resonance
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
    
    const recentSessionIds = userProgress
      .slice(0, 10)
      .map(p => p.session_id);
    
    return meditationSessions.filter(s => recentSessionIds.includes(s.id));
  };
  
  const getMeditationStats = () => {
    if (!userProgress) return { total: 0, streak: 0, minutes: 0 };
    
    const total = userProgress.length;
    
    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if meditated today
    const lastMeditationDate = userProgress[0]?.completed_at
      ? new Date(userProgress[0].completed_at)
      : null;
    
    if (lastMeditationDate) {
      lastMeditationDate.setHours(0, 0, 0, 0);
      
      if (lastMeditationDate.getTime() === today.getTime()) {
        streak = 1;
        
        // Check previous days for streak
        let currentDate = new Date(today);
        currentDate.setDate(currentDate.getDate() - 1);
        
        for (let i = 1; i < userProgress.length; i++) {
          const meditationDate = new Date(userProgress[i].completed_at);
          meditationDate.setHours(0, 0, 0, 0);
          
          if (meditationDate.getTime() === currentDate.getTime()) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }
    
    // Calculate total minutes
    const minutes = userProgress.reduce((total, progress) => {
      return total + progress.duration_minutes;
    }, 0);
    
    return { total, streak, minutes };
  };
  
  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meditation</h1>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-medium text-primary">Mindfulness Practice</span>
        </div>
      </div>
      
      {currentSession && (
        <Card className="border-primary/20 bg-primary/5 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 flex flex-col items-center text-center">
                <div className="relative w-48 h-48 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                  <svg 
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className="text-primary/20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className="text-primary animate-pulse"
                      strokeDasharray="289.2"
                      strokeDashoffset={289.2 - (progress / 100) * 289.2}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold">{formatTime(remainingTime)}</span>
                    <span className="text-sm text-muted-foreground">remaining</span>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold">{currentSession.title}</h2>
                <p className="text-muted-foreground text-sm mt-1 mb-4">
                  {currentSession.is_guided ? 'Guided' : 'Unguided'} • {currentSession.duration_minutes} min
                </p>
                
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={stopMeditation}
                    className="rounded-full h-12 w-12"
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="default" 
                    size="icon"
                    onClick={isPlaying ? pauseMeditation : resumeMeditation}
                    className="rounded-full h-14 w-14 bg-primary"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-1" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={completeMeditation}
                    className="rounded-full h-12 w-12"
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="w-full md:w-2/3 space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Ambient Sounds</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    <Button 
                      variant={ambientSound === 'forest' ? 'default' : 'outline'}
                      className="h-auto py-2 flex flex-col gap-1"
                      onClick={() => toggleAmbientSound('forest')}
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                        <path d="M21 18H9V21H15V19.5H12V18H21ZM12 18V21H9V18H3C3 13.0294 7.02944 9 12 9C16.9706 9 21 13.0294 21 18H12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-xs">Forest</span>
                    </Button>
                    
                    <Button 
                      variant={ambientSound === 'rain' ? 'default' : 'outline'}
                      className="h-auto py-2 flex flex-col gap-1"
                      onClick={() => toggleAmbientSound('rain')}
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                        <path d="M20 16.2214C20 18.8475 17.8475 21 15.2214 21C13.7747 21 12.5 20.2214 11.6025 19.0261M15.2214 3C17.8475 3 20 5.1525 20 7.7786C20 8.87439 19.6549 9.89767 19.0697 10.7305M3 15.2214C3 17.8475 5.1525 20 7.7786 20C9.89767 20 11.6913 18.6738 12.4549 16.7913M3 7.7786C3 5.1525 5.1525 3 7.7786 3C10.4047 3 12.5572 5.1525 12.5572 7.7786C12.5572 10.4047 10.4047 12.5572 7.7786 12.5572C5.1525 12.5572 3 10.4047 3 7.7786Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-xs">Rain</span>
                    </Button>
                    
                    <Button 
                      variant={ambientSound === 'ocean' ? 'default' : 'outline'}
                      className="h-auto py-2 flex flex-col gap-1"
                      onClick={() => toggleAmbientSound('ocean')}
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                        <path d="M3 10C5.48276 10 7.13793 7 7.96552 7C8.79311 7 9.2069 8 10.4483 8C11.6897 8 12.5172 7 13.3448 7C14.1724 7 14.5862 10 17.0689 10C19.5517 10 21 7 21 7M3 17C5.48276 17 7.13793 14 7.96552 14C8.79311 14 9.2069 15 10.4483 15C11.6897 15 12.5172 14 13.3448 14C14.1724 14 14.5862 17 17.0689 17C19.5517 17 21 14 21 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-xs">Ocean</span>
                    </Button>
                    
                    <Button 
                      variant={ambientSound === 'night' ? 'default' : 'outline'}
                      className="h-auto py-2 flex flex-col gap-1"
                      onClick={() => toggleAmbientSound('night')}
                    >
                      <Moon className="h-5 w-5" />
                      <span className="text-xs">Night</span>
                    </Button>
                    
                    <Button 
                      variant={ambientSound === 'binaural' ? 'default' : 'outline'}
                      className="h-auto py-2 flex flex-col gap-1"
                      onClick={toggleBinauralBeat}
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                        <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13.5 17C13.5 17.8284 12.8284 18.5 12 18.5C11.1716 18.5 10.5 17.8284 10.5 17C10.5 16.1716 11.1716 15.5 12 15.5C12.8284 15.5 13.5 16.1716 13.5 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16.5 12C16.5 14.4853 14.4853 16.5 12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19.5 12C19.5 16.1421 16.1421 19.5 12 19.5C7.85786 19.5 4.5 16.1421 4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C16.1421 4.5 19.5 7.85786 19.5 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-xs">Binaural</span>
                    </Button>
                    
                    <Button 
                      variant={ambientSound === 'fire' ? 'default' : 'outline'}
                      className="h-auto py-2 flex flex-col gap-1"
                      onClick={() => toggleAmbientSound('fire')}
                    >
                      <Flame className="h-5 w-5" />
                      <span className="text-xs">Fire</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Volume
                    </label>
                    <span className="text-sm">{Math.round(volume * 100)}%</span>
                  </div>
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.01}
                    onValueChange={(values) => setVolume(values[0])}
                  />
                </div>
                
                {!currentSession.is_guided && (
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-2">How are you feeling?</h3>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <Button 
                          key={rating}
                          variant={selectedMood === rating ? "default" : "outline"}
                          className="flex-1"
                          onClick={() => setSelectedMood(rating)}
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
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="discover" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Discover</span>
          </TabsTrigger>
          <TabsTrigger value="guided" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Guided</span>
          </TabsTrigger>
          <TabsTrigger value="unguided" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span>Unguided</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="discover" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meditation Statistics</CardTitle>
              <CardDescription>
                Track your mindfulness journey
              </CardDescription>
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
          
          {getFavorites().length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Favorites</h2>
                <Button variant="ghost" className="text-sm p-0 h-auto">
                  See All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getFavorites().slice(0, 3).map(meditation => (
                  <Card key={meditation.id} className="overflow-hidden">
                    <div className="relative h-40 bg-muted">
                      {meditation.image_url ? (
                        <img 
                          src={meditation.image_url} 
                          alt={meditation.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                          <Sparkles className="h-12 w-12 text-primary/40" />
                        </div>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="absolute top-2 right-2 text-white bg-black/30 hover:bg-black/50"
                        onClick={() => toggleFavorite(meditation.id, meditation.is_favorite)}
                      >
                        <Heart className="h-4 w-4" fill={meditation.is_favorite ? "currentColor" : "none"} />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">{meditation.title}</h3>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {meditation.duration_minutes} min
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {meditation.level}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {meditation.is_guided ? 'Guided' : 'Unguided'}
                        </div>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => startMeditation(meditation)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Begin
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recently Completed</h2>
              <Button variant="ghost" className="text-sm p-0 h-auto">
                See All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {getRecentlyCompleted().slice(0, 4).map(meditation => (
                <Card key={meditation.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{meditation.title}</h3>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleFavorite(meditation.id, meditation.is_favorite)}
                      >
                        <Heart className="h-4 w-4" fill={meditation.is_favorite ? "currentColor" : "none"} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {meditation.duration_minutes} min
                      </Badge>
                      <Badge variant="outline" className={`text-xs`}>
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(meditation.category)}
                          <span className="capitalize">{meditation.category}</span>
                        </div>
                      </Badge>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => startMeditation(meditation)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Begin
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {['sleep', 'focus', 'stress', 'morning'].map(category => (
            <div key={category} className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold capitalize flex items-center gap-2">
                  {getCategoryIcon(category)}
                  <span>{category} Meditations</span>
                </h2>
                <Button variant="ghost" className="text-sm p-0 h-auto">
                  See All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <ScrollArea className="w-full whitespace-nowrap pb-4" type="always">
                <div className="flex space-x-4">
                  {getSessionsByCategory(category).map(meditation => (
                    <Card key={meditation.id} className="w-64 flex-shrink-0">
                      <div className="relative h-32 bg-muted">
                        {meditation.image_url ? (
                          <img 
                            src={meditation.image_url} 
                            alt={meditation.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                            {getCategoryIcon(category)}
                          </div>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="absolute top-2 right-2 text-white bg-black/30 hover:bg-black/50"
                          onClick={() => toggleFavorite(meditation.id, meditation.is_favorite)}
                        >
                          <Heart className="h-4 w-4" fill={meditation.is_favorite ? "currentColor" : "none"} />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1">{meditation.title}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {meditation.duration_minutes} min
                          </Badge>
                          {meditation.is_guided && (
                            <Badge variant="outline" className="text-xs">
                              Guided
                            </Badge>
                          )}
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => startMeditation(meditation)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Begin
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="guided" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guided Meditations</CardTitle>
              <CardDescription>
                Professionally guided sessions for all levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {meditationSessions?.filter(s => s.is_guided).map(meditation => (
                  <Card key={meditation.id} className="overflow-hidden">
                    <div className="relative h-40 bg-muted">
                      {meditation.image_url ? (
                        <img 
                          src={meditation.image_url} 
                          alt={meditation.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                          {getCategoryIcon(meditation.category)}
                        </div>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="absolute top-2 right-2 text-white bg-black/30 hover:bg-black/50"
                        onClick={() => toggleFavorite(meditation.id, meditation.is_favorite)}
                      >
                        <Heart className="h-4 w-4" fill={meditation.is_favorite ? "currentColor" : "none"} />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">{meditation.title}</h3>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {meditation.duration_minutes} min
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {meditation.level}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {meditation.description}
                      </p>
                      {meditation.instructor && (
                        <div className="text-xs text-muted-foreground mb-3">
                          Instructor: {meditation.instructor}
                        </div>
                      )}
                      <Button 
                        className="w-full"
                        onClick={() => startMeditation(meditation)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Begin
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unguided" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Unguided Meditation</CardTitle>
              <CardDescription>
                Create your own meditation experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Set Your Timer</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration (minutes)</label>
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="outline" 
                          className={meditationLength === 5 ? 'bg-primary text-primary-foreground' : ''}
                          onClick={() => setMeditationLength(5)}
                        >
                          5
                        </Button>
                        <Button 
                          variant="outline"
                          className={meditationLength === 10 ? 'bg-primary text-primary-foreground' : ''}
                          onClick={() => setMeditationLength(10)}
                        >
                          10
                        </Button>
                        <Button 
                          variant="outline"
                          className={meditationLength === 15 ? 'bg-primary text-primary-foreground' : ''}
                          onClick={() => setMeditationLength(15)}
                        >
                          15
                        </Button>
                        <Button 
                          variant="outline"
                          className={meditationLength === 20 ? 'bg-primary text-primary-foreground' : ''}
                          onClick={() => setMeditationLength(20)}
                        >
                          20
                        </Button>
                        <Button 
                          variant="outline"
                          className={meditationLength === 30 ? 'bg-primary text-primary-foreground' : ''}
                          onClick={() => setMeditationLength(30)}
                        >
                          30
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">How are you feeling now?</label>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map(rating => (
                          <Button 
                            key={rating}
                            variant={selectedMood === rating ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setSelectedMood(rating)}
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
                    
                    <Button 
                      className="w-full mt-4"
                      onClick={startUnguided}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Begin Meditation
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Meditation Tips</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-medium mb-1 flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-primary">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12.0399 7.99994C11.9599 7.99994 11.8799 7.99994 11.7999 7.99994C10.9999 8.03994 10.3599 8.73994 10.3599 9.57994C10.3599 10.4199 11.0399 11.0999 11.8799 11.0999C12.7199 11.0999 13.3999 10.4199 13.3999 9.57994C13.3999 8.73994 12.7599 8.03994 11.9599 7.99994" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11.9998 14.7H12.0098" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Find a comfortable position
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Sit in a position that allows you to be both alert and relaxed. You can sit on a chair, cushion, or meditation bench.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-medium mb-1 flex items-center gap-2">
                        <Wind className="h-4 w-4 text-primary" />
                        Focus on your breath
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Pay attention to the sensation of your breath as it enters and leaves your body. When your mind wanders, gently bring it back.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-medium mb-1 flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-primary">
                          <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Use visualization
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Imagine a peaceful scene or visualize tension leaving your body with each exhale. This can enhance the relaxation response.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Meditation;
