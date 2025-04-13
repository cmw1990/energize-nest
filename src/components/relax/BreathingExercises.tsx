
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Wind, RefreshCcw, Clock, Lungs, ArrowUpDown } from 'lucide-react';

const breathingTechniques = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Inhale, hold, exhale, hold - each for equal counts",
    steps: ["Inhale", "Hold", "Exhale", "Hold"],
    durations: [4, 4, 4, 4],
  },
  {
    id: "478",
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8",
    steps: ["Inhale", "Hold", "Exhale"],
    durations: [4, 7, 8],
  },
  {
    id: "deep",
    name: "Deep Breathing",
    description: "Slow, deep breaths to center yourself",
    steps: ["Inhale", "Exhale"],
    durations: [5, 5],
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description: "Equal inhale and exhale to balance the nervous system",
    steps: ["Inhale", "Exhale"],
    durations: [6, 6],
  },
  {
    id: "calm",
    name: "Calming Breath",
    description: "Longer exhale promotes relaxation",
    steps: ["Inhale", "Exhale"],
    durations: [4, 6],
  }
];

export const BreathingExercises = () => {
  const [activeTechnique, setActiveTechnique] = useState(breathingTechniques[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timer, setTimer] = useState(activeTechnique.durations[0]);
  const [cycles, setCycles] = useState(0);
  const [targetCycles, setTargetCycles] = useState(5);
  const [breathingSpeed, setBreathingSpeed] = useState(1);

  useEffect(() => {
    let interval: number | null = null;

    if (isActive) {
      interval = window.setInterval(() => {
        setTimer((prevTimer) => {
          // If timer reaches 0, move to next step
          if (prevTimer <= 0) {
            // Calculate next step index
            const nextStepIndex = (currentStepIndex + 1) % activeTechnique.steps.length;
            setCurrentStepIndex(nextStepIndex);
            
            // If we've completed a full cycle
            if (nextStepIndex === 0) {
              setCycles(prevCycles => {
                const newCycles = prevCycles + 1;
                // If we've reached target cycles, stop
                if (newCycles >= targetCycles) {
                  setIsActive(false);
                }
                return newCycles;
              });
            }
            
            // Return duration for next step
            return activeTechnique.durations[nextStepIndex] / breathingSpeed;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, currentStepIndex, activeTechnique, breathingSpeed, targetCycles]);

  const toggleActive = () => {
    if (!isActive) {
      // Reset when starting
      setCurrentStepIndex(0);
      setTimer(activeTechnique.durations[0] / breathingSpeed);
      setCycles(0);
    }
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setTimer(activeTechnique.durations[0] / breathingSpeed);
    setCycles(0);
  };

  const handleTechniqueChange = (techniqueId: string) => {
    const technique = breathingTechniques.find(t => t.id === techniqueId) || breathingTechniques[0];
    setActiveTechnique(technique);
    resetExercise();
  };

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0];
    setBreathingSpeed(newSpeed);
    if (!isActive) {
      setTimer(activeTechnique.durations[currentStepIndex] / newSpeed);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="box" onValueChange={handleTechniqueChange}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {breathingTechniques.map((technique) => (
            <TabsTrigger 
              key={technique.id} 
              value={technique.id}
              disabled={isActive}
              className="flex flex-col py-3 px-2 h-auto"
            >
              <span className="text-xs">{technique.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="text-center space-y-2">
        <p className="text-muted-foreground">{activeTechnique.description}</p>
      </div>

      <div className="flex justify-center">
        <Card className="w-64 h-64 rounded-full flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full" 
            style={{
              backgroundImage: `conic-gradient(
                rgba(var(--primary-rgb), 0.2) 0%, 
                rgba(var(--primary-rgb), 0.05) ${(timer / (activeTechnique.durations[currentStepIndex] / breathingSpeed) * 100)}%,
                transparent ${(timer / (activeTechnique.durations[currentStepIndex] / breathingSpeed) * 100)}% 100%
              )`,
              transform: `rotate(${90 - (timer / (activeTechnique.durations[currentStepIndex] / breathingSpeed) * 360)}deg)`
            }}
          />
          <div className="z-10 flex flex-col items-center">
            <div className="text-2xl font-bold">{activeTechnique.steps[currentStepIndex]}</div>
            <div className="text-4xl font-bold mt-2">{Math.ceil(timer)}</div>
            {isActive ? (
              <span className="text-sm text-muted-foreground mt-2">Cycle {cycles + 1} of {targetCycles}</span>
            ) : (
              <span className="text-sm text-muted-foreground mt-2">Ready to begin</span>
            )}
          </div>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button 
          onClick={toggleActive} 
          size="lg" 
          className="w-32"
        >
          {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isActive ? "Pause" : "Start"}
        </Button>
        <Button 
          onClick={resetExercise} 
          variant="outline" 
          size="lg" 
          disabled={!isActive && cycles === 0}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Breathing Speed</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Slow</span>
            <Slider
              value={[breathingSpeed]}
              min={0.5}
              max={2}
              step={0.1}
              disabled={isActive}
              onValueChange={handleSpeedChange}
            />
            <span className="text-xs text-muted-foreground">Fast</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Number of Cycles</span>
          </div>
          <div className="flex items-center space-x-2">
            <Slider
              value={[targetCycles]}
              min={1}
              max={20}
              step={1}
              disabled={isActive}
              onValueChange={(value) => setTargetCycles(value[0])}
            />
            <span className="text-xs text-muted-foreground w-8">{targetCycles}</span>
          </div>
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Lungs className="h-4 w-4 text-primary mt-0.5" />
            <p>
              Breathing exercises can help reduce stress, lower blood pressure, and improve focus.
              Practice regularly for best results.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
