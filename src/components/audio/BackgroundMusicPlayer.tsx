
import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Volume2, Volume1, VolumeX, Play, Pause, Music, 
  Wind, Radio, Waves, Cloud, TreePine, CloudLightning
} from "lucide-react";

interface AudioSetting {
  id: string;
  name: string;
  icon: JSX.Element;
}

export const BackgroundMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedSound, setSelectedSound] = useState<string | null>(null);

  const sounds: AudioSetting[] = [
    { id: "white-noise", name: "White Noise", icon: <Wind /> },
    { id: "brown-noise", name: "Brown Noise", icon: <Radio /> },
    { id: "ocean", name: "Ocean Waves", icon: <Waves /> },
    { id: "rain", name: "Rainfall", icon: <Cloud /> },
    { id: "forest", name: "Forest", icon: <TreePine /> },
    { id: "storm", name: "Thunderstorm", icon: <CloudLightning /> },
  ];

  const togglePlay = () => {
    if (!selectedSound && !isPlaying) {
      // If no sound is selected, select the first one
      setSelectedSound(sounds[0].id);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSoundSelect = (soundId: string) => {
    if (selectedSound === soundId) {
      setSelectedSound(null);
      setIsPlaying(false);
    } else {
      setSelectedSound(soundId);
      setIsPlaying(true);
    }
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX />;
    if (volume < 50) return <Volume1 />;
    return <Volume2 />;
  };

  return (
    <Card className="bg-background border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Music className="h-4 w-4" />
          Background Sounds
        </CardTitle>
        <CardDescription>
          Enhance your focus with ambient sounds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {sounds.map((sound) => (
            <Button
              key={sound.id}
              variant={selectedSound === sound.id ? "default" : "outline"}
              className="h-auto py-2 px-3 flex flex-col items-center gap-1"
              onClick={() => handleSoundSelect(sound.id)}
            >
              {sound.icon}
              <span className="text-xs mt-1">{sound.name}</span>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={togglePlay}
            disabled={!selectedSound}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleMute}
            disabled={!selectedSound}
          >
            <VolumeIcon />
          </Button>
          
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0])}
            className="flex-1"
            disabled={!selectedSound}
          />
        </div>
      </CardContent>
    </Card>
  );
};
