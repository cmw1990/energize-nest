
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Volume2, VolumeX, Play, Pause, Timer, RotateCcw } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

interface TechniquePattern {
  inhale: number;
  hold?: number;
  exhale: number;
  holdAfterExhale?: number;
  repetitions: number;
}

interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  pattern: TechniquePattern;
  icon: React.ElementType;
  color: string;
}

interface BreathingExerciseProps {
  technique: BreathingTechnique;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale';

export function BreathingExercise({ technique }: BreathingExerciseProps) {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [phaseProgress, setPhaseProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { inhale, hold, exhale, holdAfterExhale, repetitions } = technique.pattern;
  
  useEffect(() => {
    // Initialize audio
    if (!audioRef.current) {
      // Create audio for breathing sounds - in real app, you would have actual sound files
      audioRef.current = new Audio('/sounds/breathing.mp3');
      audioRef.current.loop = true;
    }
    
    return () => {
      // Clean up
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    // Handle volume changes
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);
  
  useEffect(() => {
    if (!isActive) return;
    
    // Set initial phase duration
    setSecondsLeft(getPhaseDuration(currentPhase));
    
    // Set up the timer
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        // Update progress for animation
        const totalDuration = getPhaseDuration(currentPhase);
        setPhaseProgress(((totalDuration - (prev - 1)) / totalDuration) * 100);
        
        if (prev <= 1) {
          // Move to next phase
          const nextPhase = getNextPhase(currentPhase);
          setCurrentPhase(nextPhase);
          
          // If we've completed a full cycle, increment the cycle counter
          if (nextPhase === 'inhale' && currentPhase !== 'inhale') {
            if (currentCycle >= repetitions) {
              // Exercise complete
              setIsActive(false);
              clearInterval(intervalRef.current!);
              intervalRef.current = null;
              
              toast({
                title: "Exercise Complete!",
                description: `You've completed all ${repetitions} cycles of ${technique.name}.`,
              });
              
              if (audioRef.current) {
                audioRef.current.pause();
              }
              
              return 0;
            }
            setCurrentCycle(prev => prev + 1);
          }
          
          return getPhaseDuration(nextPhase);
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, currentPhase]);
  
  const getPhaseDuration = (phase: BreathPhase): number => {
    switch (phase) {
      case 'inhale': return inhale;
      case 'hold': return hold || 0;
      case 'exhale': return exhale;
      case 'holdAfterExhale': return holdAfterExhale || 0;
      default: return 0;
    }
  };
  
  const getNextPhase = (phase: BreathPhase): BreathPhase => {
    switch (phase) {
      case 'inhale':
        return hold ? 'hold' : 'exhale';
      case 'hold':
        return 'exhale';
      case 'exhale':
        return holdAfterExhale ? 'holdAfterExhale' : 'inhale';
      case 'holdAfterExhale':
        return 'inhale';
      default:
        return 'inhale';
    }
  };
  
  const toggleExercise = () => {
    if (isActive) {
      // Stop the exercise
      setIsActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      toast({
        title: "Exercise Paused",
        description: "You can resume your breathing exercise when ready.",
      });
    } else {
      // Start the exercise
      setIsActive(true);
      if (audioRef.current && !isMuted) {
        audioRef.current.play().catch(e => console.log("Audio play error:", e));
      }
      toast({
        title: "Exercise Started",
        description: "Follow the breathing pattern on screen.",
      });
    }
  };
  
  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setCurrentCycle(1);
    setSecondsLeft(0);
    setPhaseProgress(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    toast({
      title: "Exercise Reset",
      description: "Ready to start fresh!",
    });
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume / 100;
        if (isActive) {
          audioRef.current.play().catch(e => console.log("Audio play error:", e));
        }
      } else {
        audioRef.current.volume = 0;
      }
    }
  };
  
  const getPhaseLabel = (phase: BreathPhase): string => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'holdAfterExhale': return 'Hold';
      default: return '';
    }
  };
  
  const getCircleSize = () => {
    switch (currentPhase) {
      case 'inhale': return 'scale-100';
      case 'hold': return 'scale-100';
      case 'exhale': return 'scale-50';
      case 'holdAfterExhale': return 'scale-50';
      default: return 'scale-75';
    }
  };
  
  const getCircleColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'bg-blue-100 dark:bg-blue-900/30';
      case 'hold': return 'bg-green-100 dark:bg-green-900/30';
      case 'exhale': return 'bg-purple-100 dark:bg-purple-900/30';
      case 'holdAfterExhale': return 'bg-gray-100 dark:bg-gray-900/30';
      default: return 'bg-blue-100 dark:bg-blue-900/30';
    }
  };
  
  const getCompletionPercentage = () => {
    const totalCycles = technique.pattern.repetitions;
    const completedPercentage = ((currentCycle - 1) / totalCycles) * 100;
    return isActive ? completedPercentage + (phaseProgress / (4 * totalCycles)) : completedPercentage;
  };
  
  const renderBreathingPattern = () => {
    const { inhale, hold, exhale, holdAfterExhale } = technique.pattern;
    return (
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="font-mono">Inhale: {inhale}s</Badge>
        {hold && <Badge variant="outline" className="font-mono">Hold: {hold}s</Badge>}
        <Badge variant="outline" className="font-mono">Exhale: {exhale}s</Badge>
        {holdAfterExhale && <Badge variant="outline" className="font-mono">Hold: {holdAfterExhale}s</Badge>}
      </div>
    );
  };
  
  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <technique.icon className={`h-5 w-5 ${technique.color}`} />
          {technique.name}
        </CardTitle>
        <CardDescription>{technique.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Breathing Visualization */}
        <div className="relative flex items-center justify-center h-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                animate={{
                  scale: currentPhase === 'inhale' ? 1 : 
                         currentPhase === 'exhale' ? 0.5 : 
                         currentPhase === 'hold' ? 1 : 0.5
                }}
                transition={{ duration: getPhaseDuration(currentPhase) }}
                className={`h-48 w-48 rounded-full flex items-center justify-center transition-colors ${getCircleColor()}`}
              >
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">{getPhaseLabel(currentPhase)}</h3>
                  {isActive && <p className="text-3xl font-mono">{secondsLeft}</p>}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Controls */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="font-medium">
                Cycle {currentCycle} of {technique.pattern.repetitions}
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {Math.round(
                    (inhale + (hold || 0) + exhale + (holdAfterExhale || 0)) * 
                    (repetitions - currentCycle + 1) / 60
                  )} min remaining
                </span>
              </div>
            </div>
            <Progress value={getCompletionPercentage()} className="h-2" />
          </div>
          
          {renderBreathingPattern()}
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMute}
                className="rounded-full"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[volume]}
                onValueChange={(values) => setVolume(values[0])}
                disabled={isMuted}
                max={100}
                step={1}
                className="w-24"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={resetExercise}
                disabled={!isActive && currentCycle === 1 && phaseProgress === 0}
                className="rounded-full"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                onClick={toggleExercise}
                className="rounded-full w-12 h-12 p-0"
              >
                {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="space-y-2 w-full">
          <h4 className="font-medium text-sm">Benefits</h4>
          <div className="grid grid-cols-2 gap-2">
            {technique.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
