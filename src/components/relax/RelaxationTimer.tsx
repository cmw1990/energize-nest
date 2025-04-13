
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useAudioGenerator } from "@/hooks/useAudioGenerator";
import { useToast } from "@/hooks/use-toast";
import { Timer, Bell, Clock, Play, Pause, RefreshCcw } from 'lucide-react';

export const RelaxationTimer = () => {
  const { stopAll } = useAudioGenerator();
  const { toast } = useToast();
  
  const [duration, setDuration] = useState(10);
  const [remainingTime, setRemainingTime] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [shouldStopSounds, setShouldStopSounds] = useState(true);
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive && remainingTime > 0) {
      interval = window.setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && remainingTime === 0) {
      setIsActive(false);
      if (shouldStopSounds) {
        stopAll();
      }
      
      // Play notification sound
      const audio = new Audio('/sounds/bell.mp3');
      audio.play();
      
      toast({
        title: "Relaxation Session Complete",
        description: "Your timed session has finished.",
      });
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, remainingTime, shouldStopSounds, stopAll, toast]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const startTimer = () => {
    if (!isActive) {
      setRemainingTime(duration * 60);
      setIsActive(true);
    }
  };
  
  const pauseTimer = () => {
    setIsActive(false);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setRemainingTime(duration * 60);
  };
  
  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setDuration(newDuration);
    if (!isActive) {
      setRemainingTime(newDuration * 60);
    }
  };
  
  const progress = ((duration * 60 - remainingTime) / (duration * 60)) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relaxation Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="relative w-56 h-56">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle 
                className="text-muted stroke-current" 
                strokeWidth="4" 
                fill="transparent" 
                r="45" 
                cx="50" 
                cy="50" 
              />
              <circle 
                className="text-primary stroke-current transition-all" 
                strokeWidth="4" 
                strokeLinecap="round" 
                fill="transparent" 
                r="45" 
                cx="50" 
                cy="50" 
                strokeDasharray="282.7"
                strokeDashoffset={282.7 - (282.7 * progress) / 100}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{formatTime(remainingTime)}</span>
              <span className="text-sm text-muted-foreground">
                {isActive ? 'Session in progress' : 'Ready to begin'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Duration
            </span>
            <span className="text-sm text-muted-foreground">{duration} minutes</span>
          </div>
          <Slider
            value={[duration]}
            min={1}
            max={60}
            step={1}
            onValueChange={handleDurationChange}
            disabled={isActive}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1m</span>
            <span>15m</span>
            <span>30m</span>
            <span>45m</span>
            <span>60m</span>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          {!isActive ? (
            <Button onClick={startTimer} className="w-32">
              <Play className="mr-2 h-4 w-4" />
              Start
            </Button>
          ) : (
            <Button onClick={pauseTimer} variant="outline" className="w-32">
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          )}
          <Button 
            onClick={resetTimer} 
            variant="outline"
            disabled={!isActive && remainingTime === duration * 60}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Stop sounds when timer ends</span>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="stop-sounds" 
              checked={shouldStopSounds} 
              onChange={() => setShouldStopSounds(!shouldStopSounds)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
        </div>
        
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Use this timer for meditation, breathing exercises, or any relaxation technique.
              A gentle sound will play when your session is complete.
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
