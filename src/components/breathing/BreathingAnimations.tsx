
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface BreathingAnimationsProps {
  technique: string;
}

export const BreathingAnimations: React.FC<BreathingAnimationsProps> = ({ technique }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [counter, setCounter] = useState(0);
  const [maxCount, setMaxCount] = useState(4);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!technique) {
      setIsActive(false);
      return;
    }

    setIsActive(true);
    setPhase('inhale');
    setCounter(0);

    // Set timing based on technique
    switch (technique) {
      case 'box':
        setMaxCount(4);
        break;
      case '4-7-8':
        setMaxCount(technique === '4-7-8' && phase === 'hold' ? 7 : technique === '4-7-8' && phase === 'exhale' ? 8 : 4);
        break;
      case 'calm':
        setMaxCount(7);
        break;
      default:
        setMaxCount(4);
    }
  }, [technique]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      if (counter < maxCount - 1) {
        setCounter(counter + 1);
      } else {
        // Move to next phase
        switch (phase) {
          case 'inhale':
            setPhase('hold');
            setMaxCount(technique === '4-7-8' ? 7 : 4);
            break;
          case 'hold':
            setPhase('exhale');
            setMaxCount(technique === '4-7-8' ? 8 : 4);
            break;
          case 'exhale':
            setPhase(technique === 'box' ? 'hold' : 'rest');
            setMaxCount(4);
            break;
          case 'rest':
            setPhase('inhale');
            setMaxCount(4);
            break;
        }
        setCounter(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [counter, maxCount, phase, isActive, technique]);

  if (!technique) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="text-lg font-medium">Select a breathing technique</div>
        <p className="text-muted-foreground mt-2">
          Choose a technique from the list to begin a guided breathing exercise
        </p>
      </div>
    );
  }

  const getAnimationSize = () => {
    const baseSize = 200;
    const inhaleGrowth = phase === 'inhale' ? (counter / (maxCount - 1)) * 50 : 0;
    const holdSize = phase === 'hold' ? 50 : 0;
    const exhaleShrink = phase === 'exhale' ? ((maxCount - 1 - counter) / (maxCount - 1)) * 50 : 0;
    
    return phase === 'rest' ? baseSize : baseSize + inhaleGrowth + holdSize + exhaleShrink;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-center">{technique} Breathing</h3>
        <p className="text-center text-muted-foreground">
          {phase === 'inhale' && 'Inhale slowly through your nose...'}
          {phase === 'hold' && 'Hold your breath...'}
          {phase === 'exhale' && 'Exhale completely through your mouth...'}
          {phase === 'rest' && 'Pause briefly...'}
        </p>
      </div>

      <div 
        className="rounded-full bg-primary/30 transition-all duration-1000 flex items-center justify-center"
        style={{ 
          width: `${getAnimationSize()}px`, 
          height: `${getAnimationSize()}px`,
        }}
      >
        <span className="text-4xl">{counter + 1}</span>
      </div>

      <div className="mt-8 text-center">
        <p className="text-lg font-medium">{phase.charAt(0).toUpperCase() + phase.slice(1)}</p>
        <p className="text 6 xl text-muted-foreground">
          {counter + 1} of {maxCount} seconds
        </p>
      </div>
    </div>
  );
};
