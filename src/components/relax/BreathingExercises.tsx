
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wind, Play, Pause, RefreshCcw, ChevronRight, Clock, Heart, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type BreathingPattern = {
  id: string;
  name: string;
  description: string;
  steps: {
    action: 'inhale' | 'hold' | 'exhale';
    duration: number;
    instruction?: string;
  }[];
  benefits: string[];
  category: 'calm' | 'energy' | 'balance';
  icon: JSX.Element;
};

const breathingPatterns: BreathingPattern[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal inhale, hold, exhale, and hold for stress reduction',
    steps: [
      { action: 'inhale', duration: 4 },
      { action: 'hold', duration: 4 },
      { action: 'exhale', duration: 4 },
      { action: 'hold', duration: 4 },
    ],
    benefits: ['Reduces stress', 'Improves concentration', 'Regulates blood pressure'],
    category: 'calm',
    icon: <Wind className="h-4 w-4" />
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Deeply relaxing breath pattern for sleep and anxiety',
    steps: [
      { action: 'inhale', duration: 4 },
      { action: 'hold', duration: 7 },
      { action: 'exhale', duration: 8 },
    ],
    benefits: ['Promotes sleep', 'Reduces anxiety', 'Calms nervous system'],
    category: 'calm',
    icon: <Moon className="h-4 w-4" />
  },
  {
    id: 'energizing',
    name: 'Energizing Breath',
    description: 'Quick, shallow breaths to increase alertness',
    steps: [
      { action: 'inhale', duration: 1, instruction: 'Quick, sharp inhale' },
      { action: 'exhale', duration: 1, instruction: 'Quick, sharp exhale' },
      { action: 'inhale', duration: 1, instruction: 'Quick, sharp inhale' },
      { action: 'exhale', duration: 1, instruction: 'Quick, sharp exhale' },
      { action: 'inhale', duration: 4, instruction: 'Deep, full inhale' },
      { action: 'exhale', duration: 4, instruction: 'Complete exhale' },
    ],
    benefits: ['Increases energy', 'Improves alertness', 'Enhances focus'],
    category: 'energy',
    icon: <Zap className="h-4 w-4" />
  },
  {
    id: 'coherence',
    name: 'Heart Coherence',
    description: 'Balanced breathing to synchronize heart and brain rhythms',
    steps: [
      { action: 'inhale', duration: 5, instruction: 'Breathe into your heart area' },
      { action: 'exhale', duration: 5, instruction: 'Exhale completely' },
    ],
    benefits: ['Reduces stress', 'Improves heart rate variability', 'Enhances emotional regulation'],
    category: 'balance',
    icon: <Heart className="h-4 w-4" />
  },
];

export const BreathingExercises = () => {
  const { toast } = useToast();
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [cycles, setCycles] = useState(0);
  
  // Reset timer when pattern changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setTimeRemaining(selectedPattern.steps[0].duration);
    setCycles(0);
  }, [selectedPattern]);
  
  // Timer logic
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Move to next step
          const nextIndex = (currentStepIndex + 1) % selectedPattern.steps.length;
          setCurrentStepIndex(nextIndex);
          
          // Increment cycle count if we've completed a full cycle
          if (nextIndex === 0) {
            setCycles(prev => prev + 1);
          }
          
          // Return the duration of the next step
          return selectedPattern.steps[nextIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, currentStepIndex, selectedPattern]);
  
  const currentStep = selectedPattern.steps[currentStepIndex];
  
  const toggleActive = () => {
    if (!isActive) {
      setTimeRemaining(currentStep.duration);
      toast({
        title: "Breathing Exercise Started",
        description: `Starting ${selectedPattern.name}`,
      });
    }
    setIsActive(!isActive);
  };
  
  const resetExercise = () => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setTimeRemaining(selectedPattern.steps[0].duration);
    setCycles(0);
  };
  
  const getActionColor = (action: string) => {
    switch (action) {
      case 'inhale': return 'text-blue-500';
      case 'hold': return 'text-amber-500';
      case 'exhale': return 'text-green-500';
      default: return '';
    }
  };
  
  const getActionScale = () => {
    switch (currentStep.action) {
      case 'inhale': return `scale-[${1 + (1 - timeRemaining / currentStep.duration) * 0.5}]`;
      case 'hold': return 'scale-150';
      case 'exhale': return `scale-[${1.5 - (1 - timeRemaining / currentStep.duration) * 0.5}]`;
      default: return 'scale-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-primary" />
          Breathing Exercises
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="calm">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calm">Calming</TabsTrigger>
            <TabsTrigger value="energy">Energizing</TabsTrigger>
            <TabsTrigger value="balance">Balancing</TabsTrigger>
          </TabsList>
          
          {['calm', 'energy', 'balance'].map((category) => (
            <TabsContent key={category} value={category} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {breathingPatterns
                  .filter(pattern => pattern.category === category)
                  .map(pattern => (
                    <Button
                      key={pattern.id}
                      variant={selectedPattern.id === pattern.id ? "default" : "outline"}
                      className="h-auto py-3 justify-start"
                      onClick={() => {
                        setIsActive(false);
                        setSelectedPattern(pattern);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {pattern.icon}
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{pattern.name}</p>
                          <p className="text-xs text-muted-foreground">{pattern.description}</p>
                        </div>
                      </div>
                    </Button>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="flex flex-col items-center py-8 space-y-6">
          <div 
            className={`w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-1000 ${isActive ? getActionScale() : 'scale-100'}`}
          >
            <div className="text-center">
              <p className={`text-lg font-semibold capitalize ${getActionColor(currentStep.action)}`}>
                {currentStep.action}
              </p>
              <p className="text-3xl font-mono">{timeRemaining}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={toggleActive} size="lg" className="w-32">
              {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button onClick={resetExercise} variant="outline" size="icon">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
          
          {isActive && currentStep.instruction && (
            <p className="text-center text-primary">{currentStep.instruction}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Cycles: {cycles}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>Pattern: {selectedPattern.name}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Benefits:</h3>
          <ul className="space-y-1">
            {selectedPattern.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

function Moon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
}
