
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAudioGenerator } from "@/hooks/useAudioGenerator";
import { natureSounds } from "@/data/sleepSounds";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { NatureSound } from "@/types/audio";

export const NatureSoundPlayer = () => {
  const { 
    settings, 
    updateNatureSound, 
    updateVolume, 
    natureAudio, 
    startNatureSound,
    stopNatureSound
  } = useAudioGenerator();

  const [activeSound, setActiveSound] = useState<string | null>(settings.natureSound);
  const [volume, setVolume] = useState(settings.volume * 100);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(natureAudio?.isPlaying || false);
    setActiveSound(settings.natureSound);
    setVolume(settings.volume * 100);
  }, [settings, natureAudio]);

  const handleSoundSelect = (type: string) => {
    if (activeSound === type) {
      stopNatureSound();
      updateNatureSound(null);
      setActiveSound(null);
      setIsPlaying(false);
      return;
    }

    startNatureSound(type, settings.volume);
    updateNatureSound(type as NatureSound);
    setActiveSound(type);
    setIsPlaying(true);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(value[0]);
    updateVolume(newVolume);
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(50);
      updateVolume(0.5);
    } else {
      setVolume(0);
      updateVolume(0);
    }
  };

  const groupedSounds = natureSounds.reduce((acc, sound) => {
    const firstCategory = sound.categories?.[0] || 'other';
    if (!acc[firstCategory]) {
      acc[firstCategory] = [];
    }
    acc[firstCategory].push(sound);
    return acc;
  }, {} as Record<string, typeof natureSounds>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Nature Sounds</span>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMute}
            >
              {volume === 0 ? (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Volume2 className="h-5 w-5 text-primary" />
              )}
            </Button>
            <div className="w-24">
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groupedSounds).map(([category, sounds]) => (
          <div key={category} className="space-y-2">
            <Label className="text-sm font-medium capitalize">{category}</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {sounds.map((sound) => {
                const Icon = sound.icon;
                const isActive = activeSound === sound.type;
                
                return (
                  <Button
                    key={sound.type}
                    variant={isActive ? "default" : "outline"}
                    className={`flex flex-col items-center py-3 h-auto gap-1 ${
                      isActive ? "bg-primary text-primary-foreground" : ""
                    }`}
                    onClick={() => handleSoundSelect(sound.type)}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                    <span className="text-xs font-medium">{sound.name}</span>
                    {isActive && (
                      <div className="absolute top-1 right-1">
                        {isPlaying ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}

        {activeSound && (
          <Button 
            variant="destructive" 
            onClick={() => {
              stopNatureSound();
              updateNatureSound(null);
              setActiveSound(null);
              setIsPlaying(false);
            }}
            className="w-full mt-4"
          >
            Stop Nature Sound
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
