
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Clock, Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { useAudioGenerator } from "@/hooks/useAudioGenerator";

export const RelaxationTimer = () => {
  const [duration, setDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showEndSound, setShowEndSound] = useState(false);
  const [endSoundVolume, setEndSoundVolume] = useState(50);

  const countdownRef = useRef<number | null>(null);
  const { toast } = useToast();
  const { settings, updateVolume } = useAudioGenerator();

  // Sound effects
  const bellSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for bell sound
    bellSoundRef.current = new Audio("/sounds/bell.mp3");
    bellSoundRef.current.volume = endSoundVolume / 100;
    
    return () => {
      if (bellSoundRef.current) {
        bellSoundRef.current.pause();
        bellSoundRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    if (bellSoundRef.current) {
      bellSoundRef.current.volume = endSoundVolume / 100;
    }
  }, [endSoundVolume]);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (isActive && !isPaused) {
      countdownRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(countdownRef.current!);
            setIsActive(false);
            playEndSound();
            
            // Show notification
            toast({
              title: "Relaxation session complete",
              description: `Your ${duration} minute relaxation session has ended.`,
            });
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [isActive, isPaused, duration, toast]);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
  };

  const playEndSound = () => {
    if (bellSoundRef.current) {
      bellSoundRef.current.currentTime = 0;
      bellSoundRef.current.play();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Relaxation Timer</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEndSound(!showEndSound)}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div className="text-5xl font-bold text-primary">{formatTime(timeLeft)}</div>
        </div>
        
        {showEndSound && (
          <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
            <Label>End Sound Volume</Label>
            <Slider
              value={[endSoundVolume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setEndSoundVolume(value[0])}
            />
            <div className="text-xs text-muted-foreground text-center">
              A bell will play when your session ends
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Session Duration: {duration} minutes</Label>
          <Slider
            value={[duration]}
            min={1}
            max={60}
            step={1}
            onValueChange={(value) => {
              setDuration(value[0]);
              setTimeLeft(value[0] * 60);
            }}
            disabled={isActive}
          />
        </div>
        
        <div className="flex justify-center space-x-3">
          {!isActive ? (
            <Button onClick={startTimer} className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Start Session
            </Button>
          ) : isPaused ? (
            <Button onClick={resumeTimer} className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Resume
            </Button>
          ) : (
            <Button onClick={pauseTimer} className="w-full">
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={resetTimer} 
            disabled={!isActive && timeLeft === duration * 60}
            className="w-full"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
