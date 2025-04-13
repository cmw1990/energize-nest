
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BreathingTechnique } from "@/types/breathing";
import { Wind, Clock, Sparkles, MoonStar, Brain } from "lucide-react";

// Predefined breathing patterns
const breathingTechniques: BreathingTechnique[] = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Equal inhale, hold, exhale, and pause for stress relief and focus",
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfterExhale: 4,
    cycles: 5,
    category: "stress",
    difficulty: "beginner",
    benefits: ["Reduces stress", "Improves concentration", "Calms the nervous system"],
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdAfterExhale: 4
    }
  },
  {
    id: "478",
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8 - perfect for sleep and anxiety",
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 4,
    category: "sleep",
    difficulty: "beginner",
    benefits: ["Helps with sleep", "Reduces anxiety", "Decreases stress"],
    pattern: {
      inhale: 4,
      hold: 7,
      exhale: 8
    }
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description: "Simple 5-5 pattern to balance the nervous system",
    inhale: 5,
    exhale: 5,
    cycles: 6,
    category: "relaxation",
    difficulty: "beginner",
    benefits: ["Balances nervous system", "Reduces stress", "Good for beginners"],
    pattern: {
      inhale: 5,
      exhale: 5
    }
  },
  {
    id: "alternateNostril",
    name: "Alternate Nostril",
    description: "Yogic breathing for balance and calm",
    inhale: 4,
    hold: 4,
    exhale: 4,
    cycles: 5,
    category: "focus",
    difficulty: "intermediate",
    benefits: ["Balances hemispheres", "Improves focus", "Promotes calm"],
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4
    }
  },
  {
    id: "energizing",
    name: "Energizing Breath",
    description: "Quick inhales and exhales to boost energy",
    inhale: 2,
    exhale: 2,
    cycles: 10,
    category: "energy",
    difficulty: "intermediate",
    benefits: ["Increases energy", "Improves alertness", "Enhances clarity"],
    pattern: {
      inhale: 2,
      exhale: 2
    }
  }
];

export const BreathingExercises = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<string>("box");
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "holdAfterExhale">("inhale");
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(1);
  const [customCycles, setCustomCycles] = useState(5);
  const [customInhale, setCustomInhale] = useState(4);
  const [customHold, setCustomHold] = useState(4);
  const [customExhale, setCustomExhale] = useState(4);
  const [customHoldAfter, setCustomHoldAfter] = useState(4);
  const [isCustom, setIsCustom] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const breathingRef = useRef<HTMLDivElement>(null);
  
  // Get current technique
  const getCurrentTechnique = (): BreathingTechnique => {
    if (isCustom) {
      return {
        id: "custom",
        name: "Custom Breathing",
        description: "Your custom breathing pattern",
        inhale: customInhale,
        hold: customHold,
        exhale: customExhale,
        holdAfterExhale: customHoldAfter,
        cycles: customCycles,
        category: "focus",
        difficulty: "beginner",
        benefits: ["Personalized benefits"],
        pattern: {
          inhale: customInhale,
          hold: customHold,
          exhale: customExhale,
          holdAfterExhale: customHoldAfter
        }
      };
    }
    return breathingTechniques.find(t => t.id === selectedTechnique) || breathingTechniques[0];
  };
  
  const technique = getCurrentTechnique();
  
  // Start breathing exercise
  const startBreathing = () => {
    setIsActive(true);
    setPhase("inhale");
    setTimeLeft(technique.inhale);
    setCycle(1);
  };
  
  // Stop breathing exercise
  const stopBreathing = () => {
    setIsActive(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
  };
  
  // Reset to beginning
  const resetBreathing = () => {
    stopBreathing();
    setPhase("inhale");
    setTimeLeft(technique.inhale);
    setCycle(1);
  };
  
  // Change technique
  const handleTechniqueChange = (value: string) => {
    if (value === "custom") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setSelectedTechnique(value);
    }
    resetBreathing();
  };
  
  // Animation for the breathing circle
  useEffect(() => {
    if (!breathingRef.current) return;
    
    if (phase === "inhale") {
      breathingRef.current.style.transform = "scale(1.5)";
      breathingRef.current.style.transition = `transform ${technique.inhale}s ease-in`;
    } else if (phase === "exhale") {
      breathingRef.current.style.transform = "scale(1)";
      breathingRef.current.style.transition = `transform ${technique.exhale}s ease-out`;
    }
  }, [phase, technique]);
  
  // Timer logic
  useEffect(() => {
    if (!isActive) return;
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft(time => {
        if (time <= 1) {
          // Move to next phase
          if (phase === "inhale") {
            if (technique.hold) {
              setPhase("hold");
              return technique.hold;
            } else {
              setPhase("exhale");
              return technique.exhale;
            }
          } else if (phase === "hold") {
            setPhase("exhale");
            return technique.exhale;
          } else if (phase === "exhale") {
            if (technique.holdAfterExhale) {
              setPhase("holdAfterExhale");
              return technique.holdAfterExhale;
            } else {
              // Move to next cycle or end
              if (cycle >= technique.cycles) {
                stopBreathing();
                return 0;
              } else {
                setCycle(c => c + 1);
                setPhase("inhale");
                return technique.inhale;
              }
            }
          } else if (phase === "holdAfterExhale") {
            // Move to next cycle or end
            if (cycle >= technique.cycles) {
              stopBreathing();
              return 0;
            } else {
              setCycle(c => c + 1);
              setPhase("inhale");
              return technique.inhale;
            }
          }
        }
        return time - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isActive, phase, cycle, technique]);
  
  const getPhaseLabel = () => {
    switch (phase) {
      case "inhale": return "Inhale";
      case "hold": return "Hold";
      case "exhale": return "Exhale";
      case "holdAfterExhale": return "Hold";
      default: return "";
    }
  };
  
  const getPhaseIcon = () => {
    switch (phase) {
      case "inhale": return <Wind className="h-6 w-6 text-primary-foreground animate-pulse" />;
      case "hold": return <Clock className="h-6 w-6 text-primary-foreground" />;
      case "exhale": return <Wind className="h-6 w-6 text-primary-foreground animate-pulse transform rotate-180" />;
      case "holdAfterExhale": return <Clock className="h-6 w-6 text-primary-foreground" />;
      default: return null;
    }
  };
  
  const getBenefitIcon = (category: string) => {
    switch (category) {
      case "focus": return <Brain className="h-4 w-4" />;
      case "sleep": return <MoonStar className="h-4 w-4" />;
      case "energy": return <Sparkles className="h-4 w-4" />;
      default: return <Wind className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Select Technique</Label>
        <Select
          value={isCustom ? "custom" : selectedTechnique}
          onValueChange={handleTechniqueChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a breathing technique" />
          </SelectTrigger>
          <SelectContent>
            {breathingTechniques.map(technique => (
              <SelectItem key={technique.id} value={technique.id}>
                {technique.name}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom Technique</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isCustom && (
        <Card className="p-4 space-y-4 bg-muted/50">
          <h3 className="text-sm font-medium">Custom Breathing Pattern</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="inhale">Inhale (seconds)</Label>
                <span className="text-sm text-muted-foreground">{customInhale}s</span>
              </div>
              <Slider
                id="inhale"
                value={[customInhale]} 
                min={1} 
                max={10} 
                step={1}
                onValueChange={(vals) => setCustomInhale(vals[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="hold">Hold (seconds)</Label>
                <span className="text-sm text-muted-foreground">{customHold}s</span>
              </div>
              <Slider
                id="hold"
                value={[customHold]} 
                min={0} 
                max={10} 
                step={1}
                onValueChange={(vals) => setCustomHold(vals[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="exhale">Exhale (seconds)</Label>
                <span className="text-sm text-muted-foreground">{customExhale}s</span>
              </div>
              <Slider
                id="exhale"
                value={[customExhale]} 
                min={1} 
                max={10} 
                step={1}
                onValueChange={(vals) => setCustomExhale(vals[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="holdAfter">Hold after exhale (seconds)</Label>
                <span className="text-sm text-muted-foreground">{customHoldAfter}s</span>
              </div>
              <Slider
                id="holdAfter"
                value={[customHoldAfter]} 
                min={0} 
                max={10} 
                step={1}
                onValueChange={(vals) => setCustomHoldAfter(vals[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="cycles">Number of cycles</Label>
                <span className="text-sm text-muted-foreground">{customCycles}</span>
              </div>
              <Slider
                id="cycles"
                value={[customCycles]} 
                min={1} 
                max={10} 
                step={1}
                onValueChange={(vals) => setCustomCycles(vals[0])}
              />
            </div>
          </div>
        </Card>
      )}
      
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-square flex flex-col items-center justify-center relative p-4">
            <div 
              ref={breathingRef}
              className={`w-32 h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center ${
                isActive ? "bg-primary" : "bg-muted"
              } transition-all`}
            >
              {isActive ? (
                <div className="text-center">
                  {getPhaseIcon()}
                  <div className="text-xl md:text-3xl font-bold text-primary-foreground">
                    {timeLeft}
                  </div>
                  <div className="text-sm md:text-base text-primary-foreground/80">
                    {getPhaseLabel()}
                  </div>
                </div>
              ) : (
                <Wind className="h-10 w-10 text-primary" />
              )}
            </div>
            
            {isActive && (
              <div className="absolute bottom-4 text-sm font-medium">
                Cycle {cycle} of {technique.cycles}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-2">
        {!isActive ? (
          <Button 
            onClick={startBreathing} 
            className="w-full"
          >
            Start {technique.name}
          </Button>
        ) : (
          <Button 
            onClick={stopBreathing} 
            variant="destructive"
            className="w-full"
          >
            Stop
          </Button>
        )}
        
        {isActive && (
          <Button 
            onClick={resetBreathing} 
            variant="outline"
            className="w-1/3"
          >
            Reset
          </Button>
        )}
      </div>
      
      <div className="p-4 bg-muted/50 rounded-lg space-y-2">
        <h3 className="font-medium">{technique.name}</h3>
        <p className="text-sm text-muted-foreground">{technique.description}</p>
        
        <div className="mt-2 text-sm">
          <div className="font-medium">Benefits:</div>
          <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
            {technique.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-1">
                {getBenefitIcon(technique.category)}
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
