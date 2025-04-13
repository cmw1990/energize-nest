
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useAudioGenerator } from "@/hooks/useAudioGenerator";
import { Volume2, VolumeX, Activity, ChevronRight } from 'lucide-react';
import { NoiseType } from '@/types/audio';

export const NoiseGenerator = () => {
  const { 
    updateNoiseType, 
    updateVolume, 
    settings 
  } = useAudioGenerator();
  
  const [volume, setVolume] = useState(settings.volume);
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    updateVolume(newVolume);
  };
  
  const handleNoiseToggle = (noiseType: NoiseType) => {
    updateNoiseType(noiseType);
  };
  
  const noiseTypes = [
    {
      type: "white" as NoiseType,
      name: "White Noise",
      description: "Equal power across all frequencies",
      icon: <Activity className="h-5 w-5" />,
      benefits: "Masks all frequencies equally, good for general noise blocking"
    },
    {
      type: "pink" as NoiseType,
      name: "Pink Noise",
      description: "Power decreases as frequency increases",
      icon: <Activity className="h-5 w-5" />,
      benefits: "Sounds more natural and less harsh than white noise"
    },
    {
      type: "brown" as NoiseType,
      name: "Brown Noise",
      description: "Power decreases more steeply with frequency",
      icon: <Activity className="h-5 w-5" />,
      benefits: "Deep and rich sound, good for deep relaxation and sleep"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Noise Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {noiseTypes.map((noise) => (
            <Card 
              key={noise.type}
              className={`cursor-pointer transition-all hover:shadow-md ${
                settings.noiseType === noise.type ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => handleNoiseToggle(noise.type)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {noise.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{noise.name}</h3>
                    <p className="text-sm text-muted-foreground">{noise.description}</p>
                  </div>
                </div>
                {settings.noiseType === noise.type && (
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleVolumeChange([volume === 0 ? 0.5 : 0])}
          >
            {volume === 0 ? (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          
          <div className="flex-1">
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-full"
            />
          </div>
          
          <span className="w-12 text-sm text-muted-foreground">
            {Math.round(volume * 100)}%
          </span>
        </div>
        
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium mb-2">Benefits of the selected noise</h4>
            <p className="text-sm text-muted-foreground">
              {noiseTypes.find(n => n.type === settings.noiseType)?.benefits || 
                "Select a noise type to see its benefits."}
            </p>
            <div className="mt-3 text-sm text-muted-foreground">
              <h5 className="font-medium">Noise generators can help with:</h5>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Blocking out distracting sounds</li>
                <li>Improving focus and concentration</li>
                <li>Creating a consistent sound environment</li>
                <li>Masking tinnitus symptoms</li>
                <li>Promoting relaxation and sleep</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
