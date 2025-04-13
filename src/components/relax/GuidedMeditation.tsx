
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, SkipBack, SkipForward, Volume2, Clock, Heart, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

interface Meditation {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  duration_minutes: number;
  category: string;
  instructor: string;
  thumbnail_url?: string;
  is_premium: boolean;
  popularity: number;
}

export const GuidedMeditation = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentMeditation, setCurrentMeditation] = useState<Meditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  const { data: meditations, isLoading } = useQuery({
    queryKey: ["meditations"],
    queryFn: async () => {
      // Fallback data in case the database doesn't have this table yet
      const fallbackData: Meditation[] = [
        {
          id: "1",
          title: "Mindful Breathing",
          description: "A simple practice to calm your mind and focus on the present moment.",
          audio_url: "https://example.com/mindful-breathing.mp3",
          duration_minutes: 10,
          category: "mindfulness",
          instructor: "Sarah Johnson",
          thumbnail_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
          is_premium: false,
          popularity: 95,
        },
        {
          id: "2",
          title: "Body Scan Relaxation",
          description: "Progressive relaxation technique to release tension throughout your body.",
          audio_url: "https://example.com/body-scan.mp3",
          duration_minutes: 15,
          category: "relaxation",
          instructor: "David Chen",
          thumbnail_url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmF0dXJlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
          is_premium: false,
          popularity: 87,
        },
        {
          id: "3",
          title: "Sleep Meditation",
          description: "Gentle guidance to help you fall into a deep, restful sleep.",
          audio_url: "https://example.com/sleep-meditation.mp3",
          duration_minutes: 30,
          category: "sleep",
          instructor: "Emily Roberts",
          thumbnail_url: "https://images.unsplash.com/photo-1511295742362-92c96b7d3a8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2xlZXB8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
          is_premium: true,
          popularity: 92,
        },
        {
          id: "4",
          title: "Loving Kindness",
          description: "Cultivate compassion for yourself and others with this heart-centered practice.",
          audio_url: "https://example.com/loving-kindness.mp3",
          duration_minutes: 12,
          category: "compassion",
          instructor: "Michael Brown",
          thumbnail_url: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG92ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
          is_premium: false,
          popularity: 85,
        },
        {
          id: "5",
          title: "Anxiety Relief",
          description: "Calm anxious thoughts and find your center with this guided practice.",
          audio_url: "https://example.com/anxiety-relief.mp3",
          duration_minutes: 18,
          category: "stress",
          instructor: "Lisa Wong",
          thumbnail_url: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FsbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
          is_premium: true,
          popularity: 89,
        }
      ];

      try {
        const { data, error } = await supabase.from("meditations").select("*");
        if (error) throw error;
        return data.length > 0 ? data : fallbackData;
      } catch (error) {
        console.error("Error fetching meditations:", error);
        return fallbackData;
      }
    },
  });

  // Load user favorites
  useQuery({
    queryKey: ["meditation-favorites", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      try {
        const { data, error } = await supabase
          .from("meditation_favorites")
          .select("meditation_id")
          .eq("user_id", session.user.id);
        
        if (error) throw error;
        const favoriteIds = data.map(fav => fav.meditation_id);
        setFavorites(favoriteIds);
        return favoriteIds;
      } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
      }
    },
    enabled: !!session?.user?.id,
  });

  // Filter meditations based on selected category
  const filteredMeditations = meditations
    ? activeFilter === "all"
      ? meditations
      : activeFilter === "favorites"
      ? meditations.filter(med => favorites.includes(med.id))
      : meditations.filter(med => med.category === activeFilter)
    : [];

  const playMeditation = (meditation: Meditation) => {
    if (currentMeditation?.id === meditation.id) {
      togglePlayPause();
      return;
    }

    if (audioPlayer) {
      audioPlayer.pause();
    }

    setCurrentMeditation(meditation);
    const audio = new Audio(meditation.audio_url);
    audio.volume = volume / 100;
    
    audio.onloadedmetadata = () => {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
        toast({
          title: "Playback Error",
          description: "There was an error playing this meditation. Please try again.",
          variant: "destructive",
        });
      });
    };
    
    audio.ontimeupdate = () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      setCurrentProgress(progress);
    };
    
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentProgress(0);
    };
    
    setAudioPlayer(audio);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!audioPlayer || !currentMeditation) return;
    
    if (isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioPlayer) {
      audioPlayer.volume = newVolume / 100;
    }
  };

  const toggleFavorite = async (meditationId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      if (favorites.includes(meditationId)) {
        // Remove from favorites
        await supabase
          .from("meditation_favorites")
          .delete()
          .eq("user_id", session.user.id)
          .eq("meditation_id", meditationId);
        
        setFavorites(prev => prev.filter(id => id !== meditationId));
        
        toast({
          title: "Removed from Favorites",
          description: "Meditation removed from your favorites",
        });
      } else {
        // Add to favorites
        await supabase
          .from("meditation_favorites")
          .insert({
            user_id: session.user.id,
            meditation_id: meditationId,
          });
        
        setFavorites(prev => [...prev, meditationId]);
        
        toast({
          title: "Added to Favorites",
          description: "Meditation added to your favorites",
        });
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast({
        title: "Error",
        description: "There was an error updating your favorites",
        variant: "destructive",
      });
    }
  };

  const categories = [
    { id: "all", label: "All" },
    { id: "favorites", label: "Favorites" },
    { id: "mindfulness", label: "Mindfulness" },
    { id: "sleep", label: "Sleep" },
    { id: "stress", label: "Stress" },
    { id: "relaxation", label: "Relaxation" },
    { id: "compassion", label: "Compassion" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={activeFilter === category.id ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveFilter(category.id)}
          >
            {category.label}
          </Badge>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-muted/50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-muted animate-pulse rounded-md"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-3/4 bg-muted animate-pulse rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMeditations.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground">No meditations found in this category.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredMeditations.map((meditation) => (
            <Card 
              key={meditation.id} 
              className={`hover:bg-muted/50 transition-colors ${currentMeditation?.id === meditation.id ? 'border-primary' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-md bg-muted overflow-hidden flex-shrink-0"
                    style={{
                      backgroundImage: meditation.thumbnail_url ? `url(${meditation.thumbnail_url})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <button 
                      className="w-full h-full flex items-center justify-center bg-black/30 text-white hover:bg-black/50 transition-colors"
                      onClick={() => playMeditation(meditation)}
                    >
                      {currentMeditation?.id === meditation.id && isPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8" />
                      )}
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">{meditation.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{meditation.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleFavorite(meditation.id)}
                      >
                        <Heart 
                          className={`h-4 w-4 ${favorites.includes(meditation.id) ? 'fill-current text-red-500' : ''}`} 
                        />
                      </Button>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" /> {meditation.duration_minutes} min
                      <span className="mx-2">•</span>
                      <User className="h-3 w-3 mr-1" /> {meditation.instructor}
                      {meditation.is_premium && (
                        <>
                          <span className="mx-2">•</span>
                          <Badge variant="outline" className="text-xs py-0 h-4">Premium</Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {currentMeditation && (
        <Card className="sticky bottom-0 border-t p-3 bg-background/80 backdrop-blur-lg">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{currentMeditation.title}</p>
                  <p className="text-xs text-muted-foreground">{currentMeditation.instructor}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-24"
                  />
                </div>
              </div>
              
              <Slider 
                value={[currentProgress]} 
                min={0} 
                max={100} 
                step={0.1} 
                className="mt-1"
                onValueChange={() => {}} // Read-only for now
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
