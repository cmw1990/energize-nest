
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BreathingTechnique } from "@/types/breathing";

interface BreathingAnimationsProps {
  technique: BreathingTechnique | null;
}

export const BreathingAnimations: React.FC<BreathingAnimationsProps> = ({ technique }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdAfterExhale'>('inhale');
  const [progress, setProgress] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!technique) {
      setIsActive(false);
      setPhase('inhale');
      setProgress(0);
      setCycles(0);
      return;
    }

    setIsActive(true);
    setCycles(0);
  }, [technique]);

  useEffect(() => {
    if (!isActive || !technique) return;

    let animationTimer: NodeJS.Timeout;
    let phaseTimer: NodeJS.Timeout;

    const runBreathingAnimation = () => {
      const currentPhase = phase;
      let duration = 1000;

      switch (currentPhase) {
        case 'inhale':
          duration = technique.inhale * 1000;
          phaseTimer = setTimeout(() => {
            if (technique.hold && technique.hold > 0) {
              setPhase('hold');
            } else {
              setPhase('exhale');
            }
            setProgress(0);
          }, duration);
          break;
        case 'hold':
          duration = (technique.hold || 0) * 1000;
          phaseTimer = setTimeout(() => {
            setPhase('exhale');
            setProgress(0);
          }, duration);
          break;
        case 'exhale':
          duration = technique.exhale * 1000;
          phaseTimer = setTimeout(() => {
            if (technique.holdAfterExhale && technique.holdAfterExhale > 0) {
              setPhase('holdAfterExhale');
            } else {
              setPhase('inhale');
              const newCycles = cycles + 1;
              setCycles(newCycles);
              if (newCycles >= technique.cycles) {
                setIsActive(false);
              }
            }
            setProgress(0);
          }, duration);
          break;
        case 'holdAfterExhale':
          duration = (technique.holdAfterExhale || 0) * 1000;
          phaseTimer = setTimeout(() => {
            setPhase('inhale');
            const newCycles = cycles + 1;
            setCycles(newCycles);
            if (newCycles >= technique.cycles) {
              setIsActive(false);
            }
            setProgress(0);
          }, duration);
          break;
      }

      // Animate progress
      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const newProgress = Math.min(elapsed / duration, 1);
        setProgress(newProgress);

        if (newProgress < 1 && isActive) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    runBreathingAnimation();

    return () => {
      clearTimeout(phaseTimer);
      clearTimeout(animationTimer);
    };
  }, [phase, cycles, isActive, technique]);

  if (!technique) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
        <div className="text-muted-foreground mb-4">
          <div className="h-32 w-32 rounded-full border-4 border-muted-foreground/20 mx-auto"></div>
        </div>
        <h3 className="text-lg font-medium">Select a breathing technique</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Choose from our collection of breathing exercises to get started
        </p>
      </div>
    );
  }

  // Calculate circle size based on breathing phase
  const maxSize = 250;
  const minSize = 100;
  
  let currentSize;
  if (phase === 'inhale') {
    currentSize = minSize + (maxSize - minSize) * progress;
  } else if (phase === 'exhale') {
    currentSize = maxSize - (maxSize - minSize) * progress;
  } else {
    currentSize = phase === 'hold' ? maxSize : minSize;
  }

  // Determine text instructions
  let instructions = "";
  switch (phase) {
    case 'inhale':
      instructions = "Inhale";
      break;
    case 'hold':
      instructions = "Hold";
      break;
    case 'exhale':
      instructions = "Exhale";
      break;
    case 'holdAfterExhale':
      instructions = "Hold";
      break;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 h-full">
      <div className="text-center mb-6">
        <h3 className="text-xl font-medium">{technique.name}</h3>
        <p className="text-sm text-muted-foreground">{technique.description}</p>
      </div>

      <div className="relative flex items-center justify-center">
        <div
          className="rounded-full bg-primary/10 border-2 border-primary/30 transition-all duration-300 flex items-center justify-center"
          style={{
            width: `${currentSize}px`,
            height: `${currentSize}px`,
          }}
        >
          <span className="text-2xl text-primary/80 font-semibold">
            {instructions}
          </span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Cycle {cycles + 1} of {technique.cycles}
        </p>
        <div className="mt-2 text-xs flex gap-6 text-muted-foreground">
          <span>Inhale: {technique.inhale}s</span>
          {technique.hold && <span>Hold: {technique.hold}s</span>}
          <span>Exhale: {technique.exhale}s</span>
          {technique.holdAfterExhale && <span>Hold: {technique.holdAfterExhale}s</span>}
        </div>
      </div>
    </div>
  );
};
