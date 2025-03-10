import React, { useState, useRef, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Volume2, Clock } from 'lucide-react';
import { dbClient } from '@/lib/db-client';

interface SoundScapesProps {
  session: Session | null;
}

interface SoundOption {
  id: string;
  name: string;
  description: string;
  image: string;
  audioSrc: string;
  category: 'nature' | 'ambient' | 'white-noise';
}

// Simple timer component as a replacement for the missing Timer component
const Timer: React.FC<{ duration: number; onEnd: () => void }> = ({ duration, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onEnd();
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, onEnd]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4" />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export const SoundScapes: React.FC<SoundScapesProps> = ({ session }) => {
  const [activeSound, setActiveSound] = useState<SoundOption | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [timer, setTimer] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const soundOptions: SoundOption[] = [
    // Nature sounds
    {
      id: 'rain',
      name: 'Gentle Rain',
      description: 'Calming rainfall on a quiet night',
      image: '/assets/sounds/rain.jpg',
      audioSrc: '/assets/sounds/rain.mp3',
      category: 'nature'
    },
    {
      id: 'forest',
      name: 'Forest Ambience',
      description: 'Relaxing forest with birds and gentle breeze',
      image: '/assets/sounds/forest.jpg',
      audioSrc: '/assets/sounds/forest.mp3',
      category: 'nature'
    },
    {
      id: 'ocean',
      name: 'Ocean Waves',
      description: 'Peaceful ocean waves breaking on the shore',
      image: '/assets/sounds/ocean.jpg',
      audioSrc: '/assets/sounds/ocean.mp3',
      category: 'nature'
    },
    {
      id: 'thunderstorm',
      name: 'Distant Thunder',
      description: 'Distant rolling thunder with soft rain',
      image: '/assets/sounds/thunder.jpg',
      audioSrc: '/assets/sounds/thunder.mp3',
      category: 'nature'
    },
    
    // Ambient sounds
    {
      id: 'cafe',
      name: 'Cozy Café',
      description: 'Ambient background noise of a busy café',
      image: '/assets/sounds/cafe.jpg',
      audioSrc: '/assets/sounds/cafe.mp3',
      category: 'ambient'
    },
    {
      id: 'fireplace',
      name: 'Crackling Fire',
      description: 'Warm crackling fireplace on a winter night',
      image: '/assets/sounds/fire.jpg',
      audioSrc: '/assets/sounds/fire.mp3',
      category: 'ambient'
    },
    {
      id: 'night',
      name: 'Summer Night',
      description: 'Crickets and subtle nighttime ambience',
      image: '/assets/sounds/night.jpg',
      audioSrc: '/assets/sounds/night.mp3',
      category: 'ambient'
    },
    
    // White noise
    {
      id: 'white',
      name: 'White Noise',
      description: 'Pure white noise for maximum focus',
      image: '/assets/sounds/white.jpg',
      audioSrc: '/assets/sounds/white-noise.mp3',
      category: 'white-noise'
    },
    {
      id: 'pink',
      name: 'Pink Noise',
      description: 'Balanced pink noise for sleep and relaxation',
      image: '/assets/sounds/pink.jpg',
      audioSrc: '/assets/sounds/pink-noise.mp3',
      category: 'white-noise'
    },
    {
      id: 'brown',
      name: 'Brown Noise',
      description: 'Deep brown noise for deep sleep',
      image: '/assets/sounds/brown.jpg',
      audioSrc: '/assets/sounds/brown-noise.mp3',
      category: 'white-noise'
    },
  ];
  
  // Fetch user's favorite sounds
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user?.id) return;
      
      try {
        const { data, error } = await dbClient
          .from('user_sound_preferences')
          .select('favorite_sounds')
          .eq('user_id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching favorite sounds:', error);
          return;
        }
        
        if (data?.favorite_sounds) {
          setFavorites(data.favorite_sounds);
        }
      } catch (err) {
        console.error('Error in fetching favorites:', err);
      }
    };
    
    fetchFavorites();
  }, [session]);
  
  // Handle audio playback
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
    
    // Set volume
    audioRef.current.volume = volume / 100;
    
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, volume, activeSound]);
  
  // Handle timer
  useEffect(() => {
    if (timer && isPlaying) {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Set new timer
      timerRef.current = setTimeout(() => {
        setIsPlaying(false);
        setTimer(null);
      }, timer * 60 * 1000); // Convert minutes to milliseconds
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [timer, isPlaying]);
  
  const handleSoundSelect = (sound: SoundOption) => {
    // If selecting the same sound that's already playing, just toggle play state
    if (activeSound?.id === sound.id) {
      setIsPlaying(!isPlaying);
      return;
    }
    
    // Otherwise, select the new sound and start playing
    setActiveSound(sound);
    setIsPlaying(true);
    
    // Create new audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    const audio = new Audio(sound.audioSrc);
    audio.loop = true;
    audio.volume = volume / 100;
    audioRef.current = audio;
  };
  
  const toggleFavorite = async (soundId: string) => {
    if (!session?.user?.id) return;
    
    let newFavorites = [...favorites];
    
    if (newFavorites.includes(soundId)) {
      newFavorites = newFavorites.filter(id => id !== soundId);
    } else {
      newFavorites.push(soundId);
    }
    
    setFavorites(newFavorites);
    
    try {
      const { error } = await dbClient
        .from('user_sound_preferences')
        .upsert({
          user_id: session.user.id,
          favorite_sounds: newFavorites,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
        
      if (error) {
        console.error('Error saving favorite sounds:', error);
      }
    } catch (err) {
      console.error('Error in saving favorites:', err);
    }
  };
  
  const renderSoundCard = (sound: SoundOption) => {
    const isActive = activeSound?.id === sound.id;
    const isFavorite = favorites.includes(sound.id);
    
    return (
      <Card 
        key={sound.id} 
        className={`overflow-hidden transition-all ${isActive ? 'ring-2 ring-indigo-500' : ''}`}
      >
        <div className="relative h-40">
          <img 
            src={sound.image} 
            alt={sound.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
              onClick={() => handleSoundSelect(sound)}
            >
              {isActive && isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        <CardHeader className="p-3">
          <CardTitle className="text-base">{sound.name}</CardTitle>
          <CardDescription className="text-xs">{sound.description}</CardDescription>
        </CardHeader>
        <CardFooter className="p-3 pt-0 flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            className={`px-2 ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
            onClick={() => toggleFavorite(sound.id)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill={isFavorite ? "currentColor" : "none"}
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </Button>
          {isActive && (
            <div className="text-xs text-gray-500">
              {isPlaying ? "Now Playing" : "Paused"}
            </div>
          )}
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sleep Soundscapes</h2>
        <p className="text-muted-foreground">
          Ambient sounds to help you relax and fall asleep
        </p>
      </div>
      
      {activeSound && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/3 lg:w-1/4">
                <img 
                  src={activeSound.image} 
                  alt={activeSound.name} 
                  className="w-full h-40 md:h-auto object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold">{activeSound.name}</h3>
                  <p className="text-gray-500">{activeSound.description}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-5 w-5 text-gray-500" />
                    <Slider 
                      value={[volume]} 
                      min={0} 
                      max={100} 
                      step={1}
                      onValueChange={(value) => setVolume(value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 w-8">{volume}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button 
                        size="lg"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="px-6"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Play
                          </>
                        )}
                      </Button>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <select 
                          className="rounded-md border-gray-300 p-1.5 text-sm"
                          value={timer || ""}
                          onChange={(e) => setTimer(e.target.value ? Number(e.target.value) : null)}
                        >
                          <option value="">No Timer</option>
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="45">45 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                          <option value="480">8 hours</option>
                        </select>
                      </div>
                    </div>
                    
                    {timer && isPlaying && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Timer duration={timer * 60} onEnd={() => setIsPlaying(false)} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Sounds</TabsTrigger>
          <TabsTrigger value="nature">Nature</TabsTrigger>
          <TabsTrigger value="ambient">Ambient</TabsTrigger>
          <TabsTrigger value="white-noise">White Noise</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {soundOptions.map(renderSoundCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="nature" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {soundOptions
              .filter(sound => sound.category === 'nature')
              .map(renderSoundCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="ambient" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {soundOptions
              .filter(sound => sound.category === 'ambient')
              .map(renderSoundCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="white-noise" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {soundOptions
              .filter(sound => sound.category === 'white-noise')
              .map(renderSoundCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-6">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {soundOptions
                .filter(sound => favorites.includes(sound.id))
                .map(renderSoundCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-600">No favorites yet</h3>
              <p className="text-gray-500 mt-2">
                Browse the sounds and click the heart icon to add to your favorites
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
