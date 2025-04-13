
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pause, Play, RefreshCcw, Clock, Wind } from 'lucide-react';

export const BreathingExercises = () => {
  const [exercise, setExercise] = useState<string>("box");
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState<number>(10);
  const [cycleCount, setCycleCount] = useState<number>(0);
  
  const [inhaleTime, setInhaleTime] = useState<number>(4);
  const [holdTime, setHoldTime] = useState<number>(4);
  const [exhaleTime, setExhaleTime] = useState<number>(4);
  const [holdOutTime, setHoldOutTime] = useState<number>(4);
  
  const [phase, setPhase] = useState<string>("inhale");
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState<number>(inhaleTime);
  const [progress, setProgress] = useState<number>(0);
  
  // Exercise patterns
  const exercises = {
    box: {
      name: "Box Breathing",
      description: "Equal inhale, hold, exhale, and hold pattern",
      pattern: {
        inhale: 4,
        hold: 4,
        exhale: 4,
        holdOut: 4
      },
      benefits: "Reduces stress and improves concentration"
    },
    relaxing: {
      name: "4-7-8 Breathing",
      description: "Inhale for 4, hold for 7, exhale for 8",
      pattern: {
        inhale: 4,
        hold: 7,
        exhale: 8,
        holdOut: 0
      },
      benefits: "Promotes deep relaxation and helps with sleep"
    },
    energizing: {
      name: "Energizing Breath",
      description: "Quick inhale, brief hold, long exhale",
      pattern: {
        inhale: 2,
        hold: 1,
        exhale: 4,
        holdOut: 0
      },
      benefits: "Increases energy and alertness"
    },
    calm: {
      name: "Calming Breath",
      description: "Long inhale, long exhale",
      pattern: {
        inhale: 6,
        hold: 0,
        exhale: 6,
        holdOut: 0
      },
      benefits: "Promotes calm and balance"
    }
  };

  // Update times when exercise changes
  useEffect(() => {
    const selectedExercise = exercises[exercise as keyof typeof exercises];
    setInhaleTime(selectedExercise.pattern.inhale);
    setHoldTime(selectedExercise.pattern.hold);
    setExhaleTime(selectedExercise.pattern.exhale);
    setHoldOutTime(selectedExercise.pattern.holdOut);
    
    setPhase("inhale");
    setPhaseTimeRemaining(selectedExercise.pattern.inhale);
  }, [exercise]);

  // Main breathing exercise timer
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setPhaseTimeRemaining(prev => {
        if (prev <= 0) {
          // Move to next phase
          switch (phase) {
            case "inhale":
              setPhase(holdTime > 0 ? "hold" : "exhale");
              return holdTime > 0 ? holdTime : exhaleTime;
            case "hold":
              setPhase("exhale");
              return exhaleTime;
            case "exhale":
              if (holdOutTime > 0) {
                setPhase("holdOut");
                return holdOutTime;
              } else {
                setPhase("inhale");
                setCycleCount(prev => prev + 1);
                return inhaleTime;
              }
            case "holdOut":
              setPhase("inhale");
              setCycleCount(prev => prev + 1);
              return inhaleTime;
            default:
              return prev;
          }
        }
        return prev - 0.1;
      });
      
      // Calculate overall progress
      const totalCycleTime = inhaleTime + holdTime + exhaleTime + holdOutTime;
      let currentProgress = 0;
      
      switch (phase) {
        case "inhale":
          currentProgress = 0 + ((inhaleTime - phaseTimeRemaining) / totalCycleTime) * 100;
          break;
        case "hold":
          currentProgress = (inhaleTime / totalCycleTime) * 100 + 
            ((holdTime - phaseTimeRemaining) / totalCycleTime) * 100;
          break;
        case "exhale":
          currentProgress = ((inhaleTime + holdTime) / totalCycleTime) * 100 + 
            ((exhaleTime - phaseTimeRemaining) / totalCycleTime) * 100;
          break;
        case "holdOut":
          currentProgress = ((inhaleTime + holdTime + exhaleTime) / totalCycleTime) * 100 + 
            ((holdOutTime - phaseTimeRemaining) / totalCycleTime) * 100;
          break;
      }
      
      setProgress(currentProgress);
    }, 100);
    
    return () => clearInterval(interval);
  }, [isActive, phase, phaseTimeRemaining, inhaleTime, holdTime, exhaleTime, holdOutTime]);

  // Duration timer
  useEffect(() => {
    if (!isActive) return;
    
    const durationTimer = setTimeout(() => {
      if (duration > 0) {
        setDuration(prev => prev - 1);
      } else {
        setIsActive(false);
        setCycleCount(0);
      }
    }, 60000); // 1 minute
    
    return () => clearTimeout(durationTimer);
  }, [isActive, duration]);

  const startExercise = () => {
    setIsActive(true);
    setPhase("inhale");
    setPhaseTimeRemaining(inhaleTime);
    setCycleCount(0);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase("inhale");
    setPhaseTimeRemaining(inhaleTime);
    setCycleCount(0);
    setProgress(0);
  };

  const handleDurationChange = (value: number[]) => {
    setDuration(value[0]);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="box" value={exercise} onValueChange={setExercise} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          {Object.entries(exercises).map(([key, ex]) => (
            <TabsTrigger
              key={key}
              value={key}
              disabled={isActive}
              className="flex flex-col py-2 h-auto"
            >
              <Wind className="h-4 w-4 mb-1" />
              <span className="text-xs">{ex.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(exercises).map(([key, ex]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium">{ex.name}</h3>
                <p className="text-sm text-muted-foreground">{ex.description}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="font-medium">Benefits:</span> {ex.benefits}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-center">
        <div className="relative w-64 h-64">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
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
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-bold">
              {phase === "inhale" ? "Inhale" :
               phase === "hold" ? "Hold" :
               phase === "exhale" ? "Exhale" : "Hold"}
            </h3>
            <p className="text-4xl font-mono mt-2">
              {phaseTimeRemaining.toFixed(1)}
            </p>
            {isActive && (
              <p className="text-sm text-muted-foreground mt-4">
                Cycle: {cycleCount} • {duration} min remaining
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        {!isActive ? (
          <Button onClick={startExercise} className="w-32">
            <Play className="mr-2 h-4 w-4" />
            Start
          </Button>
        ) : (
          <Button onClick={pauseExercise} variant="outline" className="w-32">
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
        )}
        <Button
          onClick={resetExercise}
          variant="outline"
          disabled={!isActive && cycleCount === 0}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
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
          max={30}
          step={1}
          onValueChange={handleDurationChange}
          disabled={isActive}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1m</span>
          <span>10m</span>
          <span>20m</span>
          <span>30m</span>
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Regular breathing exercises can help reduce stress, improve focus, and promote relaxation.
            Try to practice for at least 5-10 minutes daily for best results.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
