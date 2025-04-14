import React, { useState } from 'react'; // Added useState
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wind, Clock, Brain, LucideIcon, Heart, Zap, CloudFog, ArrowUp, Filter } from 'lucide-react'; // Added Filter
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // Added ToggleGroup
import { Label } from "@/components/ui/label"; // Added Label import
import { cn } from "@/lib/utils"; // Added cn

type BreathingPattern = {
  id: string;
  name: string;
  description: string;
  duration: number; // Cycle duration in seconds
  category: 'calm' | 'sleep' | 'focus' | 'energy' | 'balance';
  icon: React.ReactNode;
};

// Keep patterns hardcoded for now
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
    duration: 12, // Note: Duration might be misleading for rapid breaths, consider revising
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

const categories = ['all', 'calm', 'sleep', 'focus', 'energy', 'balance'] as const;
type Category = typeof categories[number];

type BreathingPatternLibraryProps = {
  onSelectPattern: (patternId: string) => void;
  selectedPattern: string | null;
};

export const BreathingPatternLibrary: React.FC<BreathingPatternLibraryProps> = ({
  onSelectPattern,
  selectedPattern
}) => {
  const [filterCategory, setFilterCategory] = useState<Category>('all');

  const getCategoryColor = (category: Category | string) => {
    switch (category) {
      case 'calm': return 'text-blue-500 border-blue-500/50 bg-blue-500/10';
      case 'sleep': return 'text-indigo-500 border-indigo-500/50 bg-indigo-500/10';
      case 'focus': return 'text-violet-500 border-violet-500/50 bg-violet-500/10';
      case 'energy': return 'text-amber-500 border-amber-500/50 bg-amber-500/10';
      case 'balance': return 'text-emerald-500 border-emerald-500/50 bg-emerald-500/10';
      default: return 'text-primary border-primary/50 bg-primary/10';
    }
  };

  const filteredPatterns = filterCategory === 'all'
    ? breathingPatterns
    : breathingPatterns.filter(p => p.category === filterCategory);

  return (
    <div className="flex flex-col h-full">
      {/* Filter Controls */}
      <div className="mb-3 px-1">
         <Label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
           <Filter className="h-3 w-3" /> Filter by Category
         </Label>
         <ToggleGroup
           type="single"
           value={filterCategory}
           onValueChange={(value: Category) => { if (value) setFilterCategory(value); }}
           className="flex flex-wrap gap-1 justify-start"
           size="sm"
         >
           {categories.map(cat => (
             <ToggleGroupItem
               key={cat}
               value={cat}
               aria-label={`Filter ${cat}`}
               className={cn(
                 "capitalize px-2 py-1 h-auto text-xs transition-all",
                 filterCategory === cat ? getCategoryColor(cat) : 'border'
               )}
             >
               {cat}
             </ToggleGroupItem>
           ))}
         </ToggleGroup>
      </div>

      {/* Pattern List */}
      <ScrollArea className="flex-grow pr-3">
        <div className="space-y-2">
          {filteredPatterns.length > 0 ? (
            filteredPatterns.map((pattern) => (
              <div
                key={pattern.id}
                className={cn(
                  "cursor-pointer rounded-lg p-3 transition-all border",
                  selectedPattern === pattern.id
                    ? 'bg-primary/10 border-primary/30 shadow-sm'
                    : 'bg-background/50 hover:bg-accent/50 border-transparent hover:border-accent'
                )}
                onClick={() => onSelectPattern(pattern.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("rounded-full p-2", getCategoryColor(pattern.category))}>
                    {pattern.icon}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{pattern.name}</h4>
                    <p className="text-xs text-muted-foreground">{pattern.description}</p>
                    <div className="flex items-center mt-1 gap-2">
                      <span className="text-xs flex items-center text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {pattern.duration}s cycle
                      </span>
                      <span className={cn("text-xs capitalize px-1.5 py-0.5 rounded-full border", getCategoryColor(pattern.category))}>
                        {pattern.category}
                      </span>
                    </div>
                  </div>

                  {selectedPattern === pattern.id && (
                    <ArrowUp className="h-4 w-4 text-primary rotate-45 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))
          ) : (
             <div className="text-center py-10 text-muted-foreground text-sm">
               No patterns found for "{filterCategory}".
             </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
