
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useAudioGenerator } from "@/hooks/useAudioGenerator";
import { NoiseType } from "@/types/audio";
import { 
  Waves, 
  SlidersHorizontal, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CloudSnow 
} from "lucide-react";

export const NoiseGenerator = () => {
  const { 
    settings, 
    playNoise, 
    stopNoise, 
    updateNoiseType, 
    updateVolume 
  } = useAudioGenerator();
  
  const [activeNoise, setActiveNoise] = useState<NoiseType>(settings.noiseType as NoiseType || 'none');
  const [volume, setVolume] = useState(settings.volume * 100);
  const [isPlaying, setIsPlaying] = useState(settings.noiseType !== 'none');

  useEffect(() => {
    setActiveNoise(settings.noiseType as NoiseType || 'none');
    setVolume(settings.volume * 100);
    setIsPlaying(settings.noiseType !== 'none');
  }, [settings]);

  const handleNoiseSelect = (type: NoiseType) => {
    if (activeNoise === type && type !== 'none') {
      stopNoise();
      updateNoiseType('none');
      setActiveNoise('none');
      setIsPlaying(false);
      return;
    }

    if (type !== 'none') {
      playNoise(type);
      updateNoiseType(type);
      setActiveNoise(type);
      setIsPlaying(true);
    } else {
      stopNoise();
      updateNoiseType('none');
      setActiveNoise('none');
      setIsPlaying(false);
    }
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

  const noises = [
    { type: 'white', name: 'White Noise', icon: CloudSnow, description: 'Equal energy across frequencies, like static or TV noise' },
    { type: 'pink', name: 'Pink Noise', icon: Sparkles, description: 'Balanced, reminiscent of rainfall or wind' },
    { type: 'brown', name: 'Brown Noise', icon: Waves, description: 'Deep rumbling like ocean waves or thunder' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <span>Noise Generator</span>
          </div>
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
        <div className="grid grid-cols-3 gap-3">
          {noises.map((noise) => {
            const Icon = noise.icon;
            const isActive = activeNoise === noise.type;
            
            return (
              <Button
                key={noise.type}
                variant={isActive ? "default" : "outline"}
                className={`flex flex-col items-center py-3 h-auto gap-1 ${
                  isActive ? "bg-primary text-primary-foreground" : ""
                }`}
                onClick={() => handleNoiseSelect(noise.type as NoiseType)}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                <span className="text-xs font-medium">{noise.name}</span>
              </Button>
            );
          })}
        </div>
        
        <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
          <h3 className="font-medium text-sm">About Noise Colors</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            {noises.map((noise) => (
              <div key={noise.type} className="flex items-start gap-2">
                <noise.icon className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <span className="font-medium">{noise.name}:</span> {noise.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {activeNoise !== 'none' && (
          <Button 
            variant="destructive" 
            onClick={() => handleNoiseSelect('none')}
            className="w-full"
          >
            Stop Noise
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
