
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { natureSounds } from "@/data/sleepSounds";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Music, 
  CloudRain, 
  Waves, 
  Wind, 
  Flame, 
  Moon,
  Birds,
  Sun
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// We'll ignore TypeScript errors for now as instructed and focus on functionality
const audioElements = new Map();

export const SoundscapePlayer = () => {
  const { toast } = useToast();
  const [activeSounds, setActiveSounds] = useState<string[]>([]);
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [isPlaying, setIsPlaying] = useState(false);

  // Create and manage audio elements
  useEffect(() => {
    // Load audio elements
    natureSounds.forEach(sound => {
      if (!audioElements.has(sound.type)) {
        try {
          const audio = new Audio(`/sounds/${sound.type}.mp3`);
          audio.loop = true;
          audio.volume = 0;
          audioElements.set(sound.type, audio);
        } catch (error) {
          console.error(`Failed to load sound: ${sound.type}`, error);
        }
      }
    });

    // Cleanup
    return () => {
      audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  // Handle volume changes
  useEffect(() => {
    audioElements.forEach((audio, type) => {
      if (activeSounds.includes(type)) {
        audio.volume = (volumes[type] || 0.5) * masterVolume;
      } else {
        audio.volume = 0;
      }
    });
  }, [volumes, masterVolume, activeSounds]);

  // Toggle playback
  const togglePlay = () => {
    if (isPlaying) {
      audioElements.forEach(audio => {
        audio.pause();
      });
    } else {
      audioElements.forEach((audio, type) => {
        if (activeSounds.includes(type)) {
          audio.play().catch(err => console.error("Playback error:", err));
        }
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Toggle a sound
  const toggleSound = (soundType: string) => {
    if (activeSounds.includes(soundType)) {
      setActiveSounds(activeSounds.filter(s => s !== soundType));
      const audio = audioElements.get(soundType);
      if (audio) {
        audio.volume = 0;
      }
    } else {
      setActiveSounds([...activeSounds, soundType]);
      const audio = audioElements.get(soundType);
      if (audio && isPlaying) {
        audio.volume = (volumes[soundType] || 0.5) * masterVolume;
        audio.play().catch(err => console.error("Playback error:", err));
      }
      
      toast({
        title: "Sound Added",
        description: `Added ${natureSounds.find(s => s.type === soundType)?.name || soundType} to your soundscape`
      });
    }
  };

  // Adjust volume for a specific sound
  const adjustVolume = (soundType: string, value: number) => {
    setVolumes(prev => ({ ...prev, [soundType]: value }));
    const audio = audioElements.get(soundType);
    if (audio) {
      audio.volume = value * masterVolume;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          Custom Soundscape
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button 
                onClick={togglePlay} 
                size="icon" 
                className="rounded-full w-12 h-12"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
              </Button>
              <div>
                <h3 className="font-medium">Master Control</h3>
                <p className="text-sm text-muted-foreground">
                  {isPlaying ? "Playing soundscape" : "Click to play"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-1/3">
              <VolumeX className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[masterVolume * 100]}
                onValueChange={values => setMasterVolume(values[0] / 100)}
                max={100}
                step={1}
              />
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <Tabs defaultValue="nature">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="nature">Nature Sounds</TabsTrigger>
              <TabsTrigger value="ambience">Ambience</TabsTrigger>
            </TabsList>
            
            <TabsContent value="nature" className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {natureSounds
                  .filter(sound => sound.categories?.includes('nature') || sound.categories?.includes('water'))
                  .map(sound => (
                    <Button
                      key={sound.type}
                      variant={activeSounds.includes(sound.type) ? "default" : "outline"}
                      className="flex flex-col h-auto py-3 gap-2"
                      onClick={() => toggleSound(sound.type)}
                    >
                      <sound.icon className="h-5 w-5" />
                      <span className="text-xs font-normal">{sound.name}</span>
                    </Button>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="ambience" className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {natureSounds
                  .filter(sound => !sound.categories?.includes('nature') && !sound.categories?.includes('water'))
                  .map(sound => (
                    <Button
                      key={sound.type}
                      variant={activeSounds.includes(sound.type) ? "default" : "outline"}
                      className="flex flex-col h-auto py-3 gap-2"
                      onClick={() => toggleSound(sound.type)}
                    >
                      <sound.icon className="h-5 w-5" />
                      <span className="text-xs font-normal">{sound.name}</span>
                    </Button>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {activeSounds.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Active Sounds</h3>
            {activeSounds.map(soundType => {
              const sound = natureSounds.find(s => s.type === soundType);
              return (
                <div key={soundType} className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleSound(soundType)}
                    className="h-8 w-8"
                  >
                    {sound?.icon ? <sound.icon className="h-4 w-4" /> : <Music className="h-4 w-4" />}
                  </Button>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{sound?.name || soundType}</p>
                    <div className="flex items-center gap-2 w-full">
                      <VolumeX className="h-3 w-3 text-muted-foreground" />
                      <Slider
                        value={[(volumes[soundType] || 0.5) * 100]}
                        onValueChange={values => adjustVolume(soundType, values[0] / 100)}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <Volume2 className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
