
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wind, Clock, Brain, LucideIcon, Heart, Zap, CloudFog, ArrowUp } from 'lucide-react';

type BreathingPattern = {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  icon: React.ReactNode;
};

const breathingPatterns: BreathingPattern[] = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Equal counts for inhale, hold, exhale, hold",
    duration: 16,
    category: "calm",
    icon: <CloudFog className="h-4 w-4" />
  },
  {
    id: "478",
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8",
    duration: 19,
    category: "sleep",
    icon: <Clock className="h-4 w-4" />
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description: "5-6 breaths per minute pattern",
    duration: 12,
    category: "focus",
    icon: <Heart className="h-4 w-4" />
  },
  {
    id: "energizing",
    name: "Energizing Breath",
    description: "Quick inhalations and exhalations",
    duration: 12,
    category: "energy",
    icon: <Zap className="h-4 w-4" />
  },
  {
    id: "calm",
    name: "Calming Breath",
    description: "Longer exhales for relaxation",
    duration: 12,
    category: "calm",
    icon: <CloudFog className="h-4 w-4" />
  },
  {
    id: "alternate",
    name: "Alternate Nostril",
    description: "Balance left and right brain",
    duration: 20,
    category: "balance",
    icon: <Brain className="h-4 w-4" />
  }
];

type BreathingPatternLibraryProps = {
  onSelectPattern: (patternId: string) => void;
  selectedPattern: string | null;
};

export const BreathingPatternLibrary: React.FC<BreathingPatternLibraryProps> = ({ 
  onSelectPattern,
  selectedPattern
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'calm': return 'text-blue-500';
      case 'sleep': return 'text-indigo-500';
      case 'focus': return 'text-violet-500';
      case 'energy': return 'text-amber-500';
      case 'balance': return 'text-emerald-500';
      default: return 'text-primary';
    }
  };
  
  return (
    <ScrollArea className="h-[420px] pr-3">
      <div className="space-y-3">
        {breathingPatterns.map((pattern) => (
          <div 
            key={pattern.id}
            className={`cursor-pointer rounded-lg p-3 transition-all ${
              selectedPattern === pattern.id 
                ? 'bg-primary/10 border border-primary/20' 
                : 'bg-background/50 hover:bg-background/80 border border-transparent'
            }`}
            onClick={() => onSelectPattern(pattern.id)}
          >
            <div className="flex items-start gap-3">
              <div className={`rounded-full p-2 ${getCategoryColor(pattern.category)} bg-primary/5`}>
                {pattern.icon}
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium">{pattern.name}</h4>
                <p className="text-xs text-muted-foreground">{pattern.description}</p>
                <div className="flex items-center mt-1 gap-2">
                  <span className="text-xs flex items-center text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {pattern.duration}s cycle
                  </span>
                  <span className={`text-xs capitalize ${getCategoryColor(pattern.category)}`}>
                    {pattern.category}
                  </span>
                </div>
              </div>
              
              {selectedPattern === pattern.id && (
                <ArrowUp className="h-4 w-4 text-primary rotate-45" />
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
