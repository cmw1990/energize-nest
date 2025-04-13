
import React from "react";
import { Button } from "@/components/ui/button";
import { BreathingTechnique } from "@/types/breathing";
import { 
  Wind, Moon, Sun, Brain, Zap, Heart, 
  CloudRain, Leaf, Droplets, Clock, Shield
} from "lucide-react";

export interface BreathingTechniquesProps {
  onSelectTechnique: (technique: BreathingTechnique) => void;
  className?: string;
}

export const BreathingTechniques: React.FC<BreathingTechniquesProps> = ({ 
  onSelectTechnique,
  className = ""
}) => {
  const breathingTechniques: BreathingTechnique[] = [
    {
      id: "box-breathing",
      name: "Box Breathing",
      description: "Equal inhale, hold, exhale, and hold pattern to reduce stress",
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdAfterExhale: 4,
      cycles: 5,
      category: "relaxation",
      difficulty: "beginner",
      benefits: ["Reduces stress", "Improves concentration", "Regulates blood pressure"],
      icon: "square",
      pattern: {
        inhale: 4,
        hold: 4,
        exhale: 4,
        holdAfterExhale: 4
      }
    },
    {
      id: "4-7-8",
      name: "4-7-8 Breathing",
      description: "Relax with this natural tranquilizer for the nervous system",
      inhale: 4,
      hold: 7,
      exhale: 8,
      cycles: 4,
      category: "sleep",
      difficulty: "beginner",
      benefits: ["Promotes sleep", "Reduces anxiety", "Manages cravings"],
      icon: "moon",
      pattern: {
        inhale: 4,
        hold: 7,
        exhale: 8
      }
    },
    {
      id: "diaphragmatic",
      name: "Diaphragmatic",
      description: "Deep belly breathing to maximize oxygen intake",
      inhale: 5,
      exhale: 5,
      cycles: 6,
      category: "energy",
      difficulty: "beginner",
      benefits: ["Strengthens diaphragm", "Reduces oxygen demand", "Slows breathing rate"],
      icon: "lungs",
      pattern: {
        inhale: 5,
        exhale: 5
      }
    },
    {
      id: "wim-hof",
      name: "Wim Hof Method",
      description: "Powerful breathing to influence your nervous system",
      inhale: 2,
      exhale: 2,
      cycles: 30,
      category: "energy",
      difficulty: "advanced",
      benefits: ["Boosts energy", "Enhances immune response", "Increases focus"],
      icon: "snow",
      pattern: {
        inhale: 2,
        exhale: 2
      }
    },
    {
      id: "coherent",
      name: "Coherent Breathing",
      description: "Balance your nervous system with regular breathing",
      inhale: 5.5,
      exhale: 5.5,
      cycles: 5,
      category: "focus",
      difficulty: "intermediate",
      benefits: ["Improves heart-rate variability", "Balances autonomic nervous system"],
      icon: "heart",
      pattern: {
        inhale: 5.5,
        exhale: 5.5
      }
    },
    {
      id: "alternate-nostril",
      name: "Alternate Nostril",
      description: "Balance the brain hemispheres and calm the mind",
      inhale: 4,
      hold: 2,
      exhale: 4,
      cycles: 8,
      category: "focus",
      difficulty: "intermediate",
      benefits: ["Balances brain hemispheres", "Improves focus", "Reduces anxiety"],
      icon: "git-branch",
      pattern: {
        inhale: 4,
        hold: 2,
        exhale: 4
      }
    }
  ];

  const getIconForTechnique = (technique: BreathingTechnique) => {
    const iconMap: Record<string, JSX.Element> = {
      "box-breathing": <Shield className="h-5 w-5" />,
      "4-7-8": <Moon className="h-5 w-5" />,
      "diaphragmatic": <Wind className="h-5 w-5" />,
      "wim-hof": <CloudRain className="h-5 w-5" />,
      "coherent": <Heart className="h-5 w-5" />,
      "alternate-nostril": <Brain className="h-5 w-5" />
    };

    return iconMap[technique.id] || <Wind className="h-5 w-5" />;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      "relaxation": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      "energy": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      "focus": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      "sleep": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
      "stress": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
    };

    return colorMap[category] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <div className="grid grid-cols-2 gap-3">
          {breathingTechniques.map((technique) => (
            <Button
              key={technique.id}
              variant="outline"
              onClick={() => onSelectTechnique(technique)}
              className="flex flex-col items-start text-left h-auto p-4 gap-2"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIconForTechnique(technique)}
                  <span className="font-medium">{technique.name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(technique.category)}`}>
                  {technique.category}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{technique.description}</p>
              <div className="text-xs text-muted-foreground flex gap-2 mt-auto">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {technique.cycles} cycles
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {technique.difficulty}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Re-export for convenience
export { type BreathingTechnique } from "@/types/breathing";
