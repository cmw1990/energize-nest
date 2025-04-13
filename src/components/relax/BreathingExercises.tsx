
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { 
  CircleIcon, 
  MoveHorizontal, 
  Square, 
  RefreshCw, 
  Pause, 
  Play, 
  Settings 
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BreathingPattern = {
  name: string;
  pattern: {
    inhale: number;
    hold1?: number;
    exhale: number;
    hold2?: number;
  };
  description: string;
};

const breathingPatterns: BreathingPattern[] = [
  {
    name: '4-7-8 Breathing',
    pattern: { inhale: 4, hold1: 7, exhale: 8 },
    description: 'Calming breath pattern to reduce anxiety and help with sleep'
  },
  {
    name: 'Box Breathing',
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    description: 'Square pattern to increase focus and reduce stress'
  },
  {
    name: 'Resonant Breathing',
    pattern: { inhale: 5, exhale: 5 },
    description: 'Balance your nervous system with this 5-5 pattern'
  },
  {
    name: 'Deep Belly Breathing',
    pattern: { inhale: 4, exhale: 6 },
    description: 'Deep diaphragmatic breathing for relaxation'
  },
  {
    name: 'Energizing Breath',
    pattern: { inhale: 6, hold1: 0, exhale: 2 },
    description: 'Stimulating pattern to increase alertness'
  }
];

export const BreathingExercises = () => {
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [duration, setDuration] = useState(100); // percentage
  const [speed, setSpeed] = useState(1); // multiplier
  
  useEffect(() => {
    let timer: number | null = null;
    
    if (isPlaying) {
      const totalTime = selectedPattern.pattern[phase] || 0;
      const adjustedTime = totalTime / speed;
      
      if (timeRemaining <= 0) {
        // Move to next phase
        switch (phase) {
          case 'inhale':
            setPhase(selectedPattern.pattern.hold1 ? 'hold1' : 'exhale');
            setTimeRemaining(selectedPattern.pattern.hold1 ? (selectedPattern.pattern.hold1 / speed) : (selectedPattern.pattern.exhale / speed));
            break;
          case 'hold1':
            setPhase('exhale');
            setTimeRemaining(selectedPattern.pattern.exhale / speed);
            break;
          case 'exhale':
            if (selectedPattern.pattern.hold2) {
              setPhase('hold2');
              setTimeRemaining(selectedPattern.pattern.hold2 / speed);
            } else {
              setPhase('inhale');
              setTimeRemaining(selectedPattern.pattern.inhale / speed);
              setCycleCount(count => count + 1);
            }
            break;
          case 'hold2':
            setPhase('inhale');
            setTimeRemaining(selectedPattern.pattern.inhale / speed);
            setCycleCount(count => count + 1);
            break;
        }
      } else {
        timer = window.setTimeout(() => {
          setTimeRemaining(prev => prev - 0.1);
        }, 100);
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, phase, timeRemaining, selectedPattern.pattern, speed]);
  
  // Reset when pattern changes
  useEffect(() => {
    setPhase('inhale');
    setTimeRemaining(selectedPattern.pattern.inhale / speed);
    setCycleCount(0);
  }, [selectedPattern, speed]);
  
  const handlePatternSelect = (value: string) => {
    const pattern = breathingPatterns.find(p => p.name === value) || breathingPatterns[0];
    setSelectedPattern(pattern);
    setIsPlaying(false);
  };
  
  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0] / 100);
  };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && timeRemaining <= 0) {
      setTimeRemaining(selectedPattern.pattern.inhale / speed);
    }
  };
  
  const resetExercise = () => {
    setIsPlaying(false);
    setPhase('inhale');
    setTimeRemaining(selectedPattern.pattern.inhale / speed);
    setCycleCount(0);
  };
  
  const getInstructions = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold1':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'hold2':
        return 'Hold';
      default:
        return '';
    }
  };
  
  const getProgressPercent = () => {
    const total = selectedPattern.pattern[phase] || 1;
    const current = timeRemaining;
    return ((total - current) / total) * 100;
  };
  
  const getPhaseIcon = () => {
    switch (phase) {
      case 'inhale':
        return <CircleIcon className="h-5 w-5 text-blue-500" />;
      case 'hold1':
      case 'hold2':
        return <Square className="h-5 w-5 text-indigo-500" />;
      case 'exhale':
        return <MoveHorizontal className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Breathing Pattern</label>
        <Select 
          value={selectedPattern.name} 
          onValueChange={handlePatternSelect}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a pattern" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {breathingPatterns.map((pattern) => (
                <SelectItem key={pattern.name} value={pattern.name}>
                  {pattern.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">{selectedPattern.description}</p>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-64 flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background">
            <div 
              className="absolute inset-0 bg-primary/10 transition-all duration-200 ease-in-out"
              style={{ 
                transform: `scaleY(${phase === 'inhale' 
                  ? getProgressPercent() / 100 
                  : phase === 'exhale' 
                    ? 1 - (getProgressPercent() / 100) 
                    : phase === 'hold1' 
                      ? 1 
                      : 0
                })` 
              }}
            />
            
            <div className="z-10 space-y-3 text-center">
              <div className="flex items-center justify-center gap-2">
                {getPhaseIcon()}
                <span className="text-xl font-semibold">{getInstructions()}</span>
              </div>
              
              <div className="text-4xl font-bold">
                {Math.ceil(timeRemaining)}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Cycle: {cycleCount}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={resetExercise}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        <Button 
          onClick={togglePlay} 
          className="flex-1"
          variant={isPlaying ? "secondary" : "default"}
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Speed</label>
          <span className="text-sm text-muted-foreground">{speed.toFixed(1)}x</span>
        </div>
        <Slider
          value={[speed * 100]}
          min={50}
          max={150}
          step={10}
          onValueChange={handleSpeedChange}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Slower</span>
          <span>Normal</span>
          <span>Faster</span>
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Pattern Details</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>Inhale:</div>
          <div>{selectedPattern.pattern.inhale} seconds</div>
          
          {selectedPattern.pattern.hold1 !== undefined && (
            <>
              <div>Hold after inhale:</div>
              <div>{selectedPattern.pattern.hold1} seconds</div>
            </>
          )}
          
          <div>Exhale:</div>
          <div>{selectedPattern.pattern.exhale} seconds</div>
          
          {selectedPattern.pattern.hold2 !== undefined && (
            <>
              <div>Hold after exhale:</div>
              <div>{selectedPattern.pattern.hold2} seconds</div>
            </>
          )}
          
          <div>Total cycle:</div>
          <div>
            {selectedPattern.pattern.inhale + 
             (selectedPattern.pattern.hold1 || 0) + 
             selectedPattern.pattern.exhale + 
             (selectedPattern.pattern.hold2 || 0)} seconds
          </div>
        </div>
      </div>
    </div>
  );
};
