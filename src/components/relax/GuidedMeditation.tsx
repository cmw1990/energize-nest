import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AudioService, AudioTrack } from "@/services/AudioService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Heart, 
  Clock, 
  Music,
  Volume2,
  HeartOff,
  Brain,
  Moon
} from "lucide-react";

export const GuidedMeditation = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const { toast } = useToast();

  // Load meditation tracks
  useEffect(() => {
    const loadTracks = async () => {
      try {
        // Since we don't have actual data, we'll create dummy data
        // In a real app, this would be: const tracks = await AudioService.getMeditationAudio();
        const dummyTracks: AudioTrack[] = [
          {
            id: "1",
            title: "Calm Mind Meditation",
            description: "A gentle meditation to quiet your thoughts",
            audio_url: "/sounds/meditation1.mp3",
            duration_seconds: 600,
            category: "relaxation"
          },
          {
            id: "2",
            title: "Deep Sleep Journey",
            description: "Prepare your mind and body for restful sleep",
            audio_url: "/sounds/meditation2.mp3",
            duration_seconds: 900,
            category: "sleep"
          },
          {
            id: "3",
            title: "Morning Energy",
            description: "Start your day with positive energy",
            audio_url: "/sounds/meditation3.mp3",
            duration_seconds: 450,
            category: "energy"
          },
          {
            id: "4",
            title: "Anxiety Relief",
            description: "Release worry and find calm",
            audio_url: "/sounds/meditation4.mp3",
            duration_seconds: 720,
            category: "stress"
          },
          {
            id: "5",
            title: "Focus Enhancement",
            description: "Sharpen your concentration",
            audio_url: "/sounds/meditation5.mp3",
            duration_seconds: 540,
            category: "focus"
          }
        ];
        
        setTracks(dummyTracks);
        
        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('meditation-favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error("Failed to load meditation tracks:", error);
        toast({
          title: "Error",
          description: "Failed to load meditation tracks",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTracks();
  }, [toast]);

  // Set up audio element
  useEffect(() => {
    const audio = new Audio();
    
    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      
      // Auto-play next track
      if (currentTrack) {
        const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % tracks.length;
        const nextTrack = tracks[nextIndex];
        playTrack(nextTrack);
      }
    };
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', updateProgress);
    
    setAudioElement(audio);
    
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [currentTrack, tracks]);

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Play a track
  const playTrack = (track: AudioTrack) => {
    if (!audioElement) return;
    
    setCurrentTrack(track);
    audioElement.src = track.audio_url;
    audioElement.volume = volume;
    audioElement.play().catch(err => {
      console.error("Error playing audio:", err);
      toast({
        title: "Playback Error",
        description: "There was an error playing this track",
        variant: "destructive"
      });
    });
    setIsPlaying(true);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioElement || !currentTrack) return;
    
    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  // Skip to next track
  const nextTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    const nextTrack = tracks[nextIndex];
    playTrack(nextTrack);
  };

  // Skip to previous track
  const previousTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    const prevTrack = tracks[prevIndex];
    playTrack(prevTrack);
  };

  // Set volume
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (audioElement) {
      audioElement.volume = newVolume;
    }
  };

  // Seek in track
  const handleSeek = (value: number[]) => {
    if (!audioElement) return;
    const newTime = value[0];
    audioElement.currentTime = newTime;
    setProgress(newTime);
  };

  // Toggle favorite
  const toggleFavorite = (trackId: string) => {
    let newFavorites: string[];
    
    if (favorites.includes(trackId)) {
      newFavorites = favorites.filter(id => id !== trackId);
    } else {
      newFavorites = [...favorites, trackId];
      toast({
        title: "Added to Favorites",
        description: "This meditation has been added to your favorites.",
      });
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('meditation-favorites', JSON.stringify(newFavorites));
  };

  // Filter tracks by category
  const getFilteredTracks = () => {
    if (activeCategory === "all") return tracks;
    if (activeCategory === "favorites") return tracks.filter(track => favorites.includes(track.id));
    return tracks.filter(track => track.category === activeCategory);
  };

  const filteredTracks = getFilteredTracks();

  return (
    <div className="space-y-6">
      {/* Player */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {currentTrack ? (
            <div className="p-6">
              <div className="flex flex-col space-y-2 mb-4">
                <h3 className="text-lg font-medium">{currentTrack.title}</h3>
                <p className="text-sm text-muted-foreground">{currentTrack.description}</p>
              </div>
              
              <div className="space-y-4">
                {/* Progress bar */}
                <div className="space-y-2">
                  <Slider
                    value={[progress]}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleSeek}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={previousTrack}
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant="default"
                    size="icon"
                    className="rounded-full h-12 w-12"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? 
                      <Pause className="h-6 w-6" /> : 
                      <Play className="h-6 w-6 ml-1" />
                    }
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={nextTrack}
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Volume */}
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                  />
                </div>
                
                {/* Favorite button */}
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(currentTrack.id)}
                  >
                    {favorites.includes(currentTrack.id) ? (
                      <>
                        <Heart className="h-4 w-4 mr-2 text-destructive" fill="#e11d48" />
                        <span>Remove from Favorites</span>
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 mr-2" />
                        <span>Add to Favorites</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <Music className="h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">No Track Selected</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a meditation from the list below to begin
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Tracks List */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all" onValueChange={setActiveCategory}>
            <TabsList className="mb-4 grid grid-cols-4 md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="sleep">Sleep</TabsTrigger>
              <TabsTrigger value="focus">Focus</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              {filteredTracks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Music className="h-8 w-8 mx-auto mb-2" />
                  <p>No meditation tracks available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTracks.map((track) => (
                    <div 
                      key={track.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                        currentTrack?.id === track.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => playTrack(track)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <Button 
                            variant={currentTrack?.id === track.id && isPlaying ? "default" : "outline"} 
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (currentTrack?.id === track.id) {
                                togglePlayPause();
                              } else {
                                playTrack(track);
                              }
                            }}
                          >
                            {currentTrack?.id === track.id && isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4 ml-0.5" />
                            )}
                          </Button>
                        </div>
                        <div>
                          <div className="font-medium">{track.title}</div>
                          <div className="text-xs text-muted-foreground">{track.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(track.duration_seconds)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(track.id);
                          }}
                        >
                          {favorites.includes(track.id) ? (
                            <Heart className="h-4 w-4 text-destructive" fill="#e11d48" />
                          ) : (
                            <Heart className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="favorites" className="m-0">
              {filteredTracks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <HeartOff className="h-8 w-8 mx-auto mb-2" />
                  <p>No favorite meditations yet</p>
                  <p className="text-sm mt-1">Add some favorites to see them here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTracks.map((track) => (
                    <div 
                      key={track.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                        currentTrack?.id === track.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => playTrack(track)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <Button 
                            variant={currentTrack?.id === track.id && isPlaying ? "default" : "outline"} 
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (currentTrack?.id === track.id) {
                                togglePlayPause();
                              } else {
                                playTrack(track);
                              }
                            }}
                          >
                            {currentTrack?.id === track.id && isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4 ml-0.5" />
                            )}
                          </Button>
                        </div>
                        <div>
                          <div className="font-medium">{track.title}</div>
                          <div className="text-xs text-muted-foreground">{track.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(track.duration_seconds)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(track.id);
                          }}
                        >
                          <Heart className="h-4 w-4 text-destructive" fill="#e11d48" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="sleep" className="m-0">
              {filteredTracks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Moon className="h-8 w-8 mx-auto mb-2" />
                  <p>No sleep meditations available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTracks.map((track) => (
                    <div 
                      key={track.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                        currentTrack?.id === track.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => playTrack(track)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <Button 
                            variant={currentTrack?.id === track.id && isPlaying ? "default" : "outline"} 
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (currentTrack?.id === track.id) {
                                togglePlayPause();
                              } else {
                                playTrack(track);
                              }
                            }}
                          >
                            {currentTrack?.id === track.id && isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4 ml-0.5" />
                            )}
                          </Button>
                        </div>
                        <div>
                          <div className="font-medium">{track.title}</div>
                          <div className="text-xs text-muted-foreground">{track.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(track.duration_seconds)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(track.id);
                          }}
                        >
                          {favorites.includes(track.id) ? (
                            <Heart className="h-4 w-4 text-destructive" fill="#e11d48" />
                          ) : (
                            <Heart className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="focus" className="m-0">
              {filteredTracks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-8 w-8 mx-auto mb-2" />
                  <p>No focus meditations available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTracks.map((track) => (
                    <div 
                      key={track.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                        currentTrack?.id === track.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => playTrack(track)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <Button 
                            variant={currentTrack?.id === track.id && isPlaying ? "default" : "outline"} 
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (currentTrack?.id === track.id) {
                                togglePlayPause();
                              } else {
                                playTrack(track);
                              }
                            }}
                          >
                            {currentTrack?.id === track.id && isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4 ml-0.5" />
                            )}
                          </Button>
                        </div>
                        <div>
                          <div className="font-medium">{track.title}</div>
                          <div className="text-xs text-muted-foreground">{track.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(track.duration_seconds)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(track.id);
                          }}
                        >
                          {favorites.includes(track.id) ? (
                            <Heart className="h-4 w-4 text-destructive" fill="#e11d48" />
                          ) : (
                            <Heart className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
