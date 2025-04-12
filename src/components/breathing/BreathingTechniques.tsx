
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wind, Heart, Brain, ActivitySquare } from "lucide-react"; // Using Wind instead of Lungs

export interface BreathingPattern {
  inhale: number;
  hold?: number;
  exhale: number;
  holdAfterExhale?: number;
}

export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  category: "relaxation" | "energizing" | "focus" | "sleep" | "balance";
  pattern: BreathingPattern;
  benefits: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface BreathingTechniquesProps {
  onSelectTechnique: (technique: BreathingTechnique) => void;
  className?: string;
}

const techniques: BreathingTechnique[] = [
  {
    id: "box-breathing",
    name: "Box Breathing",
    description: "Equal inhale, hold, exhale, and hold. Great for stress reduction.",
    category: "relaxation",
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdAfterExhale: 4
    },
    benefits: ["Reduces stress", "Improves focus", "Lowers blood pressure"],
    difficulty: "beginner"
  },
  {
    id: "4-7-8",
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8. Helps with sleep.",
    category: "sleep",
    pattern: {
      inhale: 4,
      hold: 7,
      exhale: 8
    },
    benefits: ["Promotes sleep", "Reduces anxiety", "Calms the nervous system"],
    difficulty: "intermediate"
  },
  {
    id: "resonant",
    name: "Resonant Breathing",
    description: "Breathe at a rate of 5-7 breaths per minute to achieve resonance.",
    category: "balance",
    pattern: {
      inhale: 5.5,
      exhale: 5.5
    },
    benefits: ["Improves HRV", "Reduces stress", "Balances nervous system"],
    difficulty: "beginner"
  },
  {
    id: "wim-hof",
    name: "Wim Hof Method",
    description: "Deep inhales and relaxed exhales in cycles, followed by breath retention.",
    category: "energizing",
    pattern: {
      inhale: 2,
      exhale: 1
    },
    benefits: ["Increases energy", "Strengthens immune system", "Improves cold tolerance"],
    difficulty: "advanced"
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description: "Breathe at a rate of 5 breaths per minute to optimize heart rate variability.",
    category: "balance",
    pattern: {
      inhale: 6,
      exhale: 6
    },
    benefits: ["Optimizes HRV", "Reduces stress", "Improves cognitive function"],
    difficulty: "beginner"
  },
  {
    id: "stimulating",
    name: "Stimulating Breath",
    description: "Rapid in and out breaths through the nose to increase alertness.",
    category: "energizing",
    pattern: {
      inhale: 1,
      exhale: 1
    },
    benefits: ["Increases alertness", "Boosts energy", "Improves concentration"],
    difficulty: "intermediate"
  }
];

const BreathingTechniques: React.FC<BreathingTechniquesProps> = ({ 
  onSelectTechnique,
  className = "" 
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedTechniqueId, setSelectedTechniqueId] = useState<string | null>(null);

  const filteredTechniques = activeCategory === "all" 
    ? techniques 
    : techniques.filter(t => t.category === activeCategory);

  const handleTechniqueSelect = (technique: BreathingTechnique) => {
    setSelectedTechniqueId(technique.id);
    onSelectTechnique(technique);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "relaxation": return <Wind className="h-4 w-4" />;
      case "energizing": return <ActivitySquare className="h-4 w-4" />;
      case "focus": return <Brain className="h-4 w-4" />;
      case "sleep": return <Wind className="h-4 w-4" />;
      case "balance": return <Heart className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wind className="h-5 w-5 text-primary" />
            Breathing Techniques
          </CardTitle>
          <CardDescription>
            Select a breathing pattern to follow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="relaxation">Relaxation</TabsTrigger>
              <TabsTrigger value="energizing">Energizing</TabsTrigger>
              <TabsTrigger value="focus">Focus</TabsTrigger>
              <TabsTrigger value="balance">Balance</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeCategory} className="grid gap-2">
              {filteredTechniques.map(technique => (
                <Button
                  key={technique.id}
                  variant={selectedTechniqueId === technique.id ? "default" : "outline"}
                  className="justify-start h-auto py-3 px-3"
                  onClick={() => handleTechniqueSelect(technique)}
                >
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(technique.category)}
                      <span>{technique.name}</span>
                      <Badge variant="outline" className="ml-1 text-xs">
                        {technique.difficulty}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {technique.description}
                    </span>
                  </div>
                </Button>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreathingTechniques;
