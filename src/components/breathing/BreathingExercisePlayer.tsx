
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Play, Pause, RefreshCw, Gauge, TimerReset } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Pattern library (in a real app, this would come from an API or Redux store)
const breathingPatterns = {
  "box": {
    name: "Box Breathing",
    description: "Equal inhale, hold, exhale, and hold for stress reduction",
    sequence: [
      { phase: "inhale", seconds: 4, instruction: "Breathe in slowly" },
      { phase: "hold", seconds: 4, instruction: "Hold your breath" },
      { phase: "exhale", seconds: 4, instruction: "Breathe out slowly" },
      { phase: "hold", seconds: 4, instruction: "Hold" },
    ],
    benefits: ["Reduces stress", "Improves concentration", "Navy SEAL technique"]
  },
  "478": {
    name: "4-7-8 Breathing",
    description: "Deeply relaxing breath pattern for sleep and anxiety",
    sequence: [
      { phase: "inhale", seconds: 4, instruction: "Breathe in through your nose" },
      { phase: "hold", seconds: 7, instruction: "Hold your breath" },
      { phase: "exhale", seconds: 8, instruction: "Exhale completely through mouth" },
    ],
    benefits: ["Promotes sleep", "Reduces anxiety", "Calms nervous system"]
  },
  "coherent": {
    name: "Coherent Breathing",
    description: "Five breaths per minute for heart and nervous system balance",
    sequence: [
      { phase: "inhale", seconds: 6, instruction: "Breathe in slowly" },
      { phase: "exhale", seconds: 6, instruction: "Breathe out slowly" },
    ],
    benefits: ["Improves heart rate variability", "Balances nervous system", "Reduces stress"]
  },
  "energizing": {
    name: "Energizing Breath",
    description: "Quick breaths to increase alertness and energy",
    sequence: [
      { phase: "inhale", seconds: 1, instruction: "Quick, sharp inhale" },
      { phase: "exhale", seconds: 1, instruction: "Quick, sharp exhale" },
      { phase: "inhale", seconds: 1, instruction: "Quick, sharp inhale" },
      { phase: "exhale", seconds: 1, instruction: "Quick, sharp exhale" },
      { phase: "inhale", seconds: 4, instruction: "Deep, full inhale" },
      { phase: "exhale", seconds: 4, instruction: "Complete exhale" },
    ],
    benefits: ["Increases energy", "Improves alertness", "Enhances focus"]
  },
  "calm": {
    name: "Calming Breath",
    description: "Slow breathing with longer exhales to activate relaxation",
    sequence: [
      { phase: "inhale", seconds: 4, instruction: "Breathe in through your nose" },
      { phase: "hold", seconds: 1, instruction: "Brief pause" },
      { phase: "exhale", seconds: 6, instruction: "Long, slow exhale through mouth" },
      { phase: "hold", seconds: 1, instruction: "Brief pause" },
    ],
    benefits: ["Activates parasympathetic system", "Reduces stress response", "Decreases heart rate"]
  },
  "alternate": {
    name: "Alternate Nostril",
    description: "Balancing breath for nervous system and focus",
    sequence: [
      { phase: "inhale-right", seconds: 4, instruction: "Close left nostril, inhale through right" },
      { phase: "hold", seconds: 2, instruction: "Close both nostrils" },
      { phase: "exhale-left", seconds: 4, instruction: "Open left nostril, exhale" },
      { phase: "inhale-left", seconds: 4, instruction: "Inhale through left nostril" },
      { phase: "hold", seconds: 2, instruction: "Close both nostrils" },
      { phase: "exhale-right", seconds: 4, instruction: "Open right nostril, exhale" },
    ],
    benefits: ["Balances left and right brain", "Improves focus", "Traditional yoga technique"]
  }
};

type BreathingExercisePlayerProps = {
  selectedPattern: string | null;
};

export const BreathingExercisePlayer: React.FC<BreathingExercisePlayerProps> = ({ 
  selectedPattern 
}) => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(4);
  const [currentPattern, setCurrentPattern] = useState<string>("box");
  const [breathSpeed, setBreathSpeed] = useState(1.0);
  const circleRef = useRef<SVGCircleElement>(null);
  
  // Update when selected pattern changes
  useEffect(() => {
    if (selectedPattern && breathingPatterns[selectedPattern]) {
      setCurrentPattern(selectedPattern);
      resetExercise();
    }
  }, [selectedPattern]);
  
  // Handle the breathing timer
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Get current sequence
          const sequence = breathingPatterns[currentPattern].sequence;
          
          // Move to next step
          const nextIndex = (currentStepIndex + 1) % sequence.length;
          setCurrentStepIndex(nextIndex);
          
          // Update cycles count if we completed a full cycle
          if (nextIndex === 0) {
            setCycles(prev => prev + 1);
          }
          
          // Return new step duration
          return Math.round(sequence[nextIndex].seconds / breathSpeed);
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, currentStepIndex, currentPattern, breathSpeed]);
  
  const toggleActive = () => {
    if (!isActive) {
      const sequence = breathingPatterns[currentPattern].sequence;
      setTimeRemaining(Math.round(sequence[currentStepIndex].seconds / breathSpeed));
      
      toast({
        title: "Breathing Exercise Started",
        description: `Starting ${breathingPatterns[currentPattern].name}`,
      });
    }
    setIsActive(!isActive);
  };
  
  const resetExercise = () => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setCycles(0);
    const sequence = breathingPatterns[currentPattern].sequence;
    setTimeRemaining(Math.round(sequence[0].seconds / breathSpeed));
  };
  
  const getCurrentPhase = () => {
    if (!breathingPatterns[currentPattern]) return "inhale";
    return breathingPatterns[currentPattern].sequence[currentStepIndex].phase;
  };
  
  const getPhaseColor = (phase: string) => {
    if (phase.includes('inhale')) return "text-blue-500"; 
    if (phase === 'hold') return "text-amber-500";
    if (phase.includes('exhale')) return "text-emerald-500";
    return "text-primary";
  };
  
  const getAnimationStyles = () => {
    const phase = getCurrentPhase();
    if (phase.includes('inhale')) {
      return { 
        scale: [1, 1.3], 
        opacity: [0.7, 1],
        transition: { duration: timeRemaining, ease: "easeInOut" }
      };
    }
    if (phase === 'hold') {
      return { 
        scale: 1.3,
        opacity: 1,
        transition: { duration: timeRemaining }
      };
    }
    if (phase.includes('exhale')) {
      return { 
        scale: [1.3, 1], 
        opacity: [1, 0.7],
        transition: { duration: timeRemaining, ease: "easeInOut" }
      };
    }
    return {};
  };
  
  const getCurrentInstruction = () => {
    if (!breathingPatterns[currentPattern]) return "";
    return breathingPatterns[currentPattern].sequence[currentStepIndex].instruction;
  };
  
  // Calculate the progress for the circle
  const calculateCircleProgress = () => {
    if (!breathingPatterns[currentPattern]) return 0;
    const totalDuration = breathingPatterns[currentPattern].sequence[currentStepIndex].seconds;
    return ((totalDuration - timeRemaining * breathSpeed) / totalDuration) * 100;
  };
  
  const progress = calculateCircleProgress();
  const circumference = 2 * Math.PI * 45;
  
  if (!breathingPatterns[currentPattern]) {
    return (
      <Card className="bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center h-64 p-6">
          <p className="text-center text-muted-foreground">
            Please select a breathing pattern to begin
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-0 shadow-sm">
      <CardContent className="flex flex-col items-center p-6 pb-8">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold">{breathingPatterns[currentPattern].name}</h2>
          <p className="text-sm text-muted-foreground">{breathingPatterns[currentPattern].description}</p>
        </div>
        
        <div className="relative w-60 h-60 mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle 
              className="text-muted/20 stroke-current" 
              strokeWidth="3" 
              fill="transparent" 
              r="45" 
              cx="50" 
              cy="50" 
            />
            <circle 
              ref={circleRef}
              className="text-primary stroke-current" 
              strokeWidth="3" 
              strokeLinecap="round" 
              fill="transparent" 
              r="45" 
              cx="50" 
              cy="50" 
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * progress) / 100}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${currentStepIndex}-${timeRemaining}`}
                className="relative w-40 h-40 rounded-full bg-blue-50/50 dark:bg-blue-900/10"
                animate={getAnimationStyles()}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${getPhaseColor(getCurrentPhase())}`}>{timeRemaining}</span>
                  <motion.span 
                    className="text-sm text-muted-foreground capitalize"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={getCurrentPhase()}
                  >
                    {getCurrentPhase().replace('-right', '').replace('-left', '')}
                  </motion.span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        <div className="w-full max-w-xs mb-6">
          <p className={`text-center mb-2 ${getPhaseColor(getCurrentPhase())}`}>
            {getCurrentInstruction()}
          </p>
          
          <div className="flex gap-4 justify-center mb-4">
            <Button onClick={toggleActive} size="lg" className="w-1/2">
              {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isActive ? "Pause" : "Start"}
            </Button>
            
            <Button onClick={resetExercise} variant="outline" size="lg" className="w-1/2">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center">
                <Gauge className="h-4 w-4 mr-2 text-muted-foreground" />
                Breath Speed
              </Label>
              <span className="text-sm text-muted-foreground">{breathSpeed.toFixed(1)}x</span>
            </div>
            
            <Slider
              value={[breathSpeed * 10]}
              min={5}
              max={15}
              step={1}
              onValueChange={(value) => setBreathSpeed(value[0] / 10)}
              disabled={isActive}
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slower</span>
              <span>Normal</span>
              <span>Faster</span>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground flex items-center">
          <TimerReset className="h-4 w-4 mr-2" />
          Completed cycles: {cycles}
        </div>
      </CardContent>
    </Card>
  );
};
