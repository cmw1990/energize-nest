
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAudioGenerator } from "@/hooks/useAudioGenerator";
import { Wind, Cloud, CloudRain, CloudSnow, CloudLightning, Waves, Music, Leaf } from "lucide-react";

type SoundOption = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

export const SoundScapes = () => {
  const { 
    playNoise, 
    updateNoiseType, 
    updateNatureSound, 
    updateVolume, 
    settings, 
    isPlaying,
    stopNoise,
    stopNature,
    stopAll
  } = useAudioGenerator();
  
  const [activeNoise, setActiveNoise] = useState<string | null>(null);
  const [activeNature, setActiveNature] = useState<string | null>(null);
  const [volume, setVolume] = useState(settings.volume * 100);
  const [autoStop, setAutoStop] = useState(false);
  const [stopMinutes, setStopMinutes] = useState(30);

  useEffect(() => {
    // When component mounts, check if any sounds are already playing
    if (settings.noiseType !== 'none') {
      setActiveNoise(settings.noiseType);
    }
    if (settings.natureSound !== 'none') {
      setActiveNature(settings.natureSound);
    }
    setVolume(settings.volume * 100);
  }, [settings]);

  useEffect(() => {
    let timer: number | null = null;
    if (autoStop && isPlaying) {
      timer = window.setTimeout(() => {
        stopAll();
        setActiveNoise(null);
        setActiveNature(null);
      }, stopMinutes * 60 * 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoStop, stopMinutes, isPlaying, stopAll]);

  const handleNoiseToggle = (noiseType: string) => {
    if (activeNoise === noiseType) {
      stopNoise();
      setActiveNoise(null);
    } else {
      updateNoiseType(noiseType as any);
      setActiveNoise(noiseType);
    }
  };

  const handleNatureToggle = (natureSound: string) => {
    if (activeNature === natureSound) {
      stopNature();
      setActiveNature(null);
    } else {
      updateNatureSound(natureSound as any);
      setActiveNature(natureSound);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(value[0]);
    updateVolume(newVolume);
  };

  const noiseOptions: SoundOption[] = [
    { id: 'white', name: 'White Noise', icon: <Wind className="h-5 w-5" /> },
    { id: 'pink', name: 'Pink Noise', icon: <Cloud className="h-5 w-5" /> },
    { id: 'brown', name: 'Brown Noise', icon: <Music className="h-5 w-5" /> },
  ];

  const natureOptions: SoundOption[] = [
    { id: 'rain', name: 'Rain', icon: <CloudRain className="h-5 w-5" /> },
    { id: 'thunder', name: 'Thunder', icon: <CloudLightning className="h-5 w-5" /> },
    { id: 'ocean', name: 'Ocean', icon: <Waves className="h-5 w-5" /> },
    { id: 'forest', name: 'Forest', icon: <Leaf className="h-5 w-5" /> },
    { id: 'snow', name: 'Snow', icon: <CloudSnow className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {noiseOptions.map((option) => (
          <Button
            key={option.id}
            variant={activeNoise === option.id ? "default" : "outline"}
            className="flex flex-col items-center py-4 gap-2 h-auto"
            onClick={() => handleNoiseToggle(option.id)}
          >
            {option.icon}
            <span className="text-xs">{option.name}</span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {natureOptions.map((option) => (
          <Button
            key={option.id}
            variant={activeNature === option.id ? "default" : "outline"}
            className="flex flex-col items-center py-4 gap-2 h-auto"
            onClick={() => handleNatureToggle(option.id)}
          >
            {option.icon}
            <span className="text-xs">{option.name}</span>
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Volume</Label>
            <span className="text-sm text-muted-foreground">{Math.round(volume)}%</span>
          </div>
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="auto-stop"
            checked={autoStop}
            onCheckedChange={setAutoStop}
          />
          <Label htmlFor="auto-stop">Auto-stop after</Label>
          <select
            className="ml-2 rounded-md border border-input bg-transparent p-1 text-sm"
            value={stopMinutes}
            onChange={(e) => setStopMinutes(Number(e.target.value))}
            disabled={!autoStop}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
          </select>
        </div>
      </div>

      {(activeNoise || activeNature) && (
        <Button 
          variant="destructive" 
          onClick={() => {
            stopAll();
            setActiveNoise(null);
            setActiveNature(null);
          }}
          className="w-full"
        >
          Stop All Sounds
        </Button>
      )}
    </div>
  );
};
