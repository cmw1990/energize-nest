import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Play, Pause, RefreshCw, Gauge, TimerReset, Save } from 'lucide-react'; // Added Save icon
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider'; // Added AuthProvider
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Added mutation hooks
import { supabase } from '@/integrations/supabase/client'; // Added supabase client

// Pattern library (keep as is)
const breathingPatterns: Record<string, { name: string; description: string; sequence: { phase: string; seconds: number; instruction: string }[]; benefits: string[] }> = {
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
  const { session } = useAuth(); // Get user session
  const { toast } = useToast();
  const queryClient = useQueryClient(); // Get query client
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(4);
  const [currentPattern, setCurrentPattern] = useState<string>("box");
  const [breathSpeed, setBreathSpeed] = useState(1.0);
  const circleRef = useRef<SVGCircleElement>(null);
  const sessionStartTime = useRef<number | null>(null); // Track start time

  // Mutation to save breathing session
  const saveSessionMutation = useMutation({
    mutationFn: async (sessionData: { pattern_name: string; cycles_completed: number; duration_seconds: number }) => {
      if (!session?.user?.id) throw new Error("User not authenticated");
      // TODO: Replace with REST API call if required
      const { error } = await supabase
        .from('breathing_sessions') // Assuming this table exists
        .insert({
          user_id: session.user.id,
          pattern_name: sessionData.pattern_name,
          cycles_completed: sessionData.cycles_completed,
          duration_seconds: sessionData.duration_seconds,
          // created_at defaults to now() in DB
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Session Saved",
        description: "Your breathing session has been logged.",
      });
      // Optionally invalidate queries related to session history if displayed elsewhere
      queryClient.invalidateQueries({ queryKey: ['breathing-history', session?.user?.id] });
    },
    onError: (error) => {
      console.error("Error saving breathing session:", error);
      toast({
        title: "Save Error",
        description: "Could not save your session. Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Update when selected pattern changes
  useEffect(() => {
    if (selectedPattern && breathingPatterns[selectedPattern]) {
      setCurrentPattern(selectedPattern);
      resetExercise(false); // Reset without saving when pattern changes
    }
  }, [selectedPattern]);

  // Handle the breathing timer
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          const sequence = breathingPatterns[currentPattern].sequence;
          const nextIndex = (currentStepIndex + 1) % sequence.length;
          setCurrentStepIndex(nextIndex);
          if (nextIndex === 0) {
            setCycles(prevCycles => prevCycles + 1);
          }
          return Math.round(sequence[nextIndex].seconds / breathSpeed);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, currentStepIndex, currentPattern, breathSpeed]);

  const saveCurrentSession = () => {
    if (cycles > 0 && sessionStartTime.current) {
      const durationSeconds = Math.round((Date.now() - sessionStartTime.current) / 1000);
      saveSessionMutation.mutate({
        pattern_name: breathingPatterns[currentPattern].name,
        cycles_completed: cycles,
        duration_seconds: durationSeconds,
      });
    } else if (isActive) {
       // Don't save if paused immediately or no cycles completed
       toast({ title: "Session Not Saved", description: "Complete at least one cycle to save.", variant: "default" });
    }
  };

  const toggleActive = () => {
    if (!isActive) { // Starting
      const sequence = breathingPatterns[currentPattern].sequence;
      setTimeRemaining(Math.round(sequence[currentStepIndex].seconds / breathSpeed));
      sessionStartTime.current = Date.now(); // Record start time
      toast({
        title: "Breathing Exercise Started",
        description: `Starting ${breathingPatterns[currentPattern].name}`,
      });
    } else { // Pausing
      saveCurrentSession(); // Attempt to save when pausing
    }
    setIsActive(!isActive);
  };

  const resetExercise = (shouldSave = true) => {
    if (isActive && shouldSave) {
      saveCurrentSession(); // Attempt to save before resetting if active
    }
    setIsActive(false);
    setCurrentStepIndex(0);
    setCycles(0);
    sessionStartTime.current = null; // Clear start time
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
    const duration = Math.max(0.5, timeRemaining); // Ensure minimum duration for animation
    if (phase.includes('inhale')) {
      return { scale: [1, 1.3], opacity: [0.7, 1], transition: { duration, ease: "easeInOut" } };
    }
    if (phase === 'hold') {
      return { scale: 1.3, opacity: 1, transition: { duration } };
    }
    if (phase.includes('exhale')) {
      return { scale: [1.3, 1], opacity: [1, 0.7], transition: { duration, ease: "easeInOut" } };
    }
    return {};
  };

  const getCurrentInstruction = () => {
    if (!breathingPatterns[currentPattern]) return "";
    return breathingPatterns[currentPattern].sequence[currentStepIndex].instruction;
  };

  const calculateCircleProgress = () => {
    if (!isActive || !breathingPatterns[currentPattern]) return 0;
    const currentStep = breathingPatterns[currentPattern].sequence[currentStepIndex];
    const totalDuration = Math.round(currentStep.seconds / breathSpeed);
    if (totalDuration <= 0) return 100; // Avoid division by zero
    const elapsed = totalDuration - timeRemaining;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
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
              strokeWidth="3" fill="transparent" r="45" cx="50" cy="50"
            />
            <motion.circle
              ref={circleRef}
              className="text-primary stroke-current"
              strokeWidth="3" strokeLinecap="round" fill="transparent" r="45" cx="50" cy="50"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - (circumference * progress) / 100 }}
              transition={{ duration: 0.5, ease: "linear" }} // Smooth progress animation
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentStepIndex}-${timeRemaining}`} // Key change triggers animation
                className="relative w-40 h-40 rounded-full bg-blue-50/50 dark:bg-blue-900/10 flex items-center justify-center"
                initial={{ scale: 1, opacity: 0.7 }} // Start state for animation
                animate={getAnimationStyles()} // Apply phase-specific animation
              >
                <div className="text-center">
                  <span className={`text-4xl font-bold ${getPhaseColor(getCurrentPhase())}`}>{timeRemaining}</span>
                  <motion.span
                    className="block text-sm text-muted-foreground capitalize"
                    key={getCurrentPhase()} // Key change triggers fade in/out
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {getCurrentPhase().replace('-right', '').replace('-left', '')}
                  </motion.span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="w-full max-w-xs mb-6">
          <p className={`text-center mb-2 font-medium ${getPhaseColor(getCurrentPhase())}`}>
            {getCurrentInstruction()}
          </p>

          <div className="flex gap-4 justify-center mb-4">
            <Button onClick={toggleActive} size="lg" className="w-1/2">
              {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isActive ? "Pause" : "Start"}
            </Button>

            <Button onClick={() => resetExercise()} variant="outline" size="lg" className="w-1/2">
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
              min={5} max={15} step={1}
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
