
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAudioGenerator } from "@/hooks/useAudioGenerator";
import { NoiseType } from "@/types/audio";
import { Volume2, VolumeX, Waveform, Clock, Activity, Wind } from 'lucide-react';

export const NoiseGenerator = () => {
  const { 
    updateNoiseType, 
    updateVolume, 
    settings 
  } = useAudioGenerator();
  
  const [volume, setVolume] = useState(settings.volume);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30);
  const [timerRemaining, setTimerRemaining] = useState(0);
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    updateVolume(newVolume);
  };
  
  const handleNoiseToggle = (type: NoiseType) => {
    updateNoiseType(type);
  };
  
  const handleTimerToggle = (enabled: boolean) => {
    setTimerEnabled(enabled);
    if (enabled) {
      setTimerRemaining(timerDuration * 60);
      // Start timer countdown logic
    } else {
      setTimerRemaining(0);
      // Clear timer logic
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Noise Generator</CardTitle>
        <CardDescription>
          Different colors of noise for focus, relaxation, and sleep
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className={`cursor-pointer hover:shadow-md transition-all ${
              settings.noiseType === 'white' ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => handleNoiseToggle('white')}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">White Noise</h3>
                <p className="text-xs text-muted-foreground">Equal energy across all frequencies</p>
                <div className="w-full h-8 bg-muted rounded-md overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer hover:shadow-md transition-all ${
              settings.noiseType === 'pink' ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => handleNoiseToggle('pink')}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Waveform className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Pink Noise</h3>
                <p className="text-xs text-muted-foreground">Lower frequencies are more prominent</p>
                <div className="w-full h-8 bg-muted rounded-md overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary/50 via-primary/30 to-primary/10" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer hover:shadow-md transition-all ${
              settings.noiseType === 'brown' ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => handleNoiseToggle('brown')}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Wind className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Brown Noise</h3>
                <p className="text-xs text-muted-foreground">Much stronger bass frequencies</p>
                <div className="w-full h-8 bg-muted rounded-md overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary/80 via-primary/20 to-primary/5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            disabled={settings.noiseType === 'none'}
            onClick={() => updateNoiseType('none')}
          >
            {settings.noiseType === 'none' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
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
        </div>
        
        <div className="flex items-center justify-between space-x-4 pt-2 border-t">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Timer</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 60].map(mins => (
                <Button
                  key={mins}
                  variant={timerDuration === mins ? "secondary" : "outline"}
                  size="sm"
                  className="px-2 py-1 h-auto text-xs"
                  disabled={timerEnabled}
                  onClick={() => setTimerDuration(mins)}
                >
                  {mins} min
                </Button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="timer"
                checked={timerEnabled}
                onCheckedChange={handleTimerToggle}
                disabled={settings.noiseType === 'none'}
              />
              <Label htmlFor="timer" className="text-sm">
                {timerEnabled ? formatTime(timerRemaining) : 'Off'}
              </Label>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t">
          <div className="bg-muted p-3 rounded-md">
            <h4 className="text-sm font-medium">White Noise</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Great for masking sounds in noisy environments. Helpful for focusing in busy settings.
            </p>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <h4 className="text-sm font-medium">Pink Noise</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Mimics many natural sounds. May enhance memory and improve sleep quality.
            </p>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <h4 className="text-sm font-medium">Brown Noise</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Deeper than pink noise. Often described as comforting, like the sound of heavy rainfall.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
