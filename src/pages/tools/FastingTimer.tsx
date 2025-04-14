
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper";
import { useToast } from "@/hooks/use-toast";
import { Settings, Timer, Play, Pause, RotateCcw, Clock4, Clock, BarChart, BatteryFull, Brain, Heart, Coffee } from "lucide-react";
import { format, differenceInMilliseconds, differenceInHours, differenceInMinutes, differenceInSeconds, addHours, formatDistanceStrict } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Define fasting protocol types
interface FastingProtocol {
  id: string;
  name: string;
  fastHours: number;
  eatHours: number;
  description: string;
}

// Define fasting milestone types
interface FastingMilestone {
  id: string;
  hour: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function FastingTimer() {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [targetTime, setTargetTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedProtocol, setSelectedProtocol] = useState<string>("intermittent-16-8");
  const [progress, setProgress] = useState(0);
  const [elapsedHours, setElapsedHours] = useState(0);
  const [remainingHours, setRemainingHours] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Fasting protocols
  const fastingProtocols: FastingProtocol[] = [
    {
      id: "intermittent-16-8",
      name: "Intermittent 16:8",
      fastHours: 16,
      eatHours: 8,
      description: "Fast for 16 hours, eat during an 8-hour window."
    },
    {
      id: "intermittent-18-6",
      name: "Intermittent 18:6",
      fastHours: 18,
      eatHours: 6,
      description: "Fast for 18 hours, eat during a 6-hour window."
    },
    {
      id: "intermittent-20-4",
      name: "Intermittent 20:4",
      fastHours: 20,
      eatHours: 4,
      description: "Fast for 20 hours, eat during a 4-hour window."
    },
    {
      id: "omad",
      name: "OMAD (One Meal a Day)",
      fastHours: 23,
      eatHours: 1,
      description: "Fast for 23 hours, eat during a 1-hour window."
    },
    {
      id: "alternate-day",
      name: "Alternate Day Fasting",
      fastHours: 36,
      eatHours: 12,
      description: "Fast for 36 hours, followed by 12 hours of normal eating."
    },
    {
      id: "custom",
      name: "Custom",
      fastHours: 18,
      eatHours: 6,
      description: "Set a custom fasting duration."
    }
  ];

  // Fasting milestones
  const fastingMilestones: FastingMilestone[] = [
    {
      id: "food-digestion",
      hour: 4,
      title: "Food Digestion Complete",
      description: "Your body has finished digesting your last meal.",
      icon: <Clock className="text-blue-500 h-6 w-6" />
    },
    {
      id: "fat-burning",
      hour: 12,
      title: "Fat Burning Mode",
      description: "Your body has entered ketosis and is now primarily burning fat for energy.",
      icon: <BatteryFull className="text-green-500 h-6 w-6" />
    },
    {
      id: "autophagy",
      hour: 16,
      title: "Autophagy Begins",
      description: "Cellular cleanup process starts to remove damaged components.",
      icon: <RotateCcw className="text-indigo-500 h-6 w-6" />
    },
    {
      id: "growth-hormone",
      hour: 24,
      title: "Growth Hormone Spike",
      description: "Human growth hormone levels increase to help repair cells.",
      icon: <BarChart className="text-purple-500 h-6 w-6" />
    },
    {
      id: "immune-regeneration",
      hour: 36,
      title: "Immune System Regeneration",
      description: "Your body begins to regenerate your immune system.",
      icon: <Heart className="text-red-500 h-6 w-6" />
    },
    {
      id: "brain-clarity",
      hour: 48,
      title: "Brain Clarity Peak",
      description: "BDNF (Brain-Derived Neurotrophic Factor) levels increase, supporting brain health.",
      icon: <Brain className="text-amber-500 h-6 w-6" />
    }
  ];

  // Get selected protocol data
  const getSelectedProtocol = () => {
    return fastingProtocols.find(protocol => protocol.id === selectedProtocol) || fastingProtocols[0];
  };

  // Start fasting timer
  const startFasting = () => {
    const now = new Date();
    const selected = getSelectedProtocol();
    const target = addHours(now, selected.fastHours);
    
    setStartTime(now);
    setTargetTime(target);
    setIsActive(true);
    
    toast({
      title: "Fasting Started",
      description: `Your ${selected.fastHours}-hour fast has begun. You'll reach your goal at ${format(target, 'h:mm a')} on ${format(target, 'MMM d')}.`,
    });
  };

  // Stop fasting timer
  const stopFasting = () => {
    setShowSummary(true);
  };

  // Reset fasting timer
  const resetFasting = () => {
    setIsActive(false);
    setStartTime(null);
    setTargetTime(null);
    setProgress(0);
    setElapsedHours(0);
    setRemainingHours(0);
    setShowSummary(false);
  };

  // Calculate elapsed time and progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && startTime && targetTime) {
      interval = setInterval(() => {
        const now = new Date();
        setCurrentTime(now);
        
        // Calculate elapsed and remaining time
        const elapsed = differenceInMilliseconds(now, startTime);
        const total = differenceInMilliseconds(targetTime, startTime);
        const elapsedHrs = differenceInHours(now, startTime);
        const remainingHrs = Math.max(0, differenceInHours(targetTime, now));
        
        // Calculate progress percentage
        const progressValue = Math.min(100, (elapsed / total) * 100);
        
        setProgress(progressValue);
        setElapsedHours(elapsedHrs);
        setRemainingHours(remainingHrs);
        
        // Check if fasting is complete
        if (now >= targetTime) {
          setIsActive(false);
          setShowSummary(true);
          clearInterval(interval);
          
          toast({
            title: "Fasting Complete!",
            description: "Congratulations! You've successfully completed your fast.",
            variant: "success",
          });
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, startTime, targetTime, toast]);

  // Get current milestone
  const getCurrentMilestone = () => {
    if (!elapsedHours) return null;
    
    // Find the most recent milestone passed
    const passedMilestones = fastingMilestones.filter(milestone => milestone.hour <= elapsedHours);
    if (passedMilestones.length === 0) return null;
    
    return passedMilestones.reduce((latest, current) => 
      current.hour > latest.hour ? current : latest, passedMilestones[0]);
  };

  // Get next milestone
  const getNextMilestone = () => {
    if (!elapsedHours) return fastingMilestones[0];
    
    // Find the next milestone not yet reached
    const futureMilestones = fastingMilestones.filter(milestone => milestone.hour > elapsedHours);
    return futureMilestones.length > 0 ? futureMilestones[0] : null;
  };

  // Format time display
  const formatTimeDisplay = (hours: number) => {
    if (!startTime) return "00:00:00";
    
    const now = new Date();
    const referenceTime = hours === elapsedHours 
      ? new Date(startTime.getTime() + (hours * 60 * 60 * 1000))
      : new Date(now.getTime() + (hours * 60 * 60 * 1000));
    
    const hoursDiff = hours === elapsedHours
      ? differenceInHours(now, startTime)
      : hours;
    
    const minutesDiff = hours === elapsedHours
      ? differenceInMinutes(now, startTime) % 60
      : differenceInMinutes(referenceTime, now) % 60;
    
    const secondsDiff = hours === elapsedHours
      ? differenceInSeconds(now, startTime) % 60
      : differenceInSeconds(referenceTime, now) % 60;
    
    return `${String(hoursDiff).padStart(2, '0')}:${String(minutesDiff).padStart(2, '0')}:${String(secondsDiff).padStart(2, '0')}`;
  };

  // Summary dialog
  const FastingSummary = () => {
    if (!startTime) return null;
    
    const duration = elapsedHours;
    const endTime = new Date();
    const durationText = formatDistanceStrict(startTime, endTime);
    
    // Find achieved milestones
    const achievedMilestones = fastingMilestones.filter(milestone => milestone.hour <= duration);
    
    return (
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fasting Summary</DialogTitle>
            <DialogDescription>
              You completed your fast on {format(endTime, 'MMMM d, yyyy')} at {format(endTime, 'h:mm a')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Started</h4>
                <p>{format(startTime, 'MMM d, h:mm a')}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Ended</h4>
                <p>{format(endTime, 'MMM d, h:mm a')}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Duration</h4>
              <p className="text-2xl font-bold">{durationText}</p>
            </div>
            
            {achievedMilestones.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Milestones Reached</h4>
                {achievedMilestones.map(milestone => (
                  <div key={milestone.id} className="flex items-start gap-2">
                    {milestone.icon}
                    <div>
                      <p className="font-medium">{milestone.title}</p>
                      <p className="text-xs text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={resetFasting}>Start New Fast</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <ToolAnalyticsWrapper toolName="fasting-timer" toolType="nutrition">
      <div className="min-h-screen bg-background">
        <LandingHeader />
        <div className="container mx-auto p-4 pt-6 max-w-4xl">
          <Card className="border-primary/10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Timer className="h-6 w-6 text-primary" />
                <CardTitle>Intermittent Fasting Timer</CardTitle>
              </div>
              <CardDescription>
                Track your fasting periods and monitor health milestones during your intermittent fasting journey.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="timer" className="space-y-6">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="timer" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Timer</span>
                  </TabsTrigger>
                  <TabsTrigger value="protocols" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Protocols</span>
                  </TabsTrigger>
                  <TabsTrigger value="milestones" className="flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    <span>Milestones</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="timer" className="space-y-6">
                  {isActive ? (
                    <div className="space-y-6">
                      <div className="relative pt-8">
                        <div className="absolute inset-0 flex items-center justify-center text-center">
                          <div className="space-y-1">
                            <div className="text-4xl font-mono font-bold">
                              {formatTimeDisplay(elapsedHours)}
                            </div>
                            <p className="text-sm text-muted-foreground">Elapsed Time</p>
                          </div>
                        </div>
                        <Progress value={progress} className="h-4" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 my-8">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-1">Started</p>
                          <p className="font-medium">{startTime && format(startTime, 'MMM d, h:mm a')}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-1">Target</p>
                          <p className="font-medium">{targetTime && format(targetTime, 'MMM d, h:mm a')}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-gray-50 dark:bg-gray-900/30">
                          <CardContent className="p-4 text-center">
                            <h3 className="text-sm text-muted-foreground mb-1">Current Milestone</h3>
                            {getCurrentMilestone() ? (
                              <div className="flex flex-col items-center gap-1">
                                <div className="mt-1 mb-2">
                                  {getCurrentMilestone()?.icon}
                                </div>
                                <p className="font-medium">{getCurrentMilestone()?.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {getCurrentMilestone()?.description}
                                </p>
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-sm">No milestone reached yet</p>
                            )}
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gray-50 dark:bg-gray-900/30">
                          <CardContent className="p-4 text-center">
                            <h3 className="text-sm text-muted-foreground mb-1">Next Milestone</h3>
                            {getNextMilestone() ? (
                              <div className="flex flex-col items-center gap-1">
                                <div className="mt-1 mb-2">
                                  {getNextMilestone()?.icon}
                                </div>
                                <p className="font-medium">{getNextMilestone()?.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  In {getNextMilestone() && (getNextMilestone()!.hour - elapsedHours)} hours
                                </p>
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-sm">All milestones reached!</p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="flex justify-center gap-4 pt-4">
                        <Button 
                          variant="outline" 
                          size="lg" 
                          onClick={stopFasting}
                          className="gap-2"
                        >
                          <Pause className="h-4 w-4" />
                          End Fast
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-primary/5 rounded-lg p-6 text-center space-y-4">
                        <h3 className="text-lg font-medium">{getSelectedProtocol().name}</h3>
                        <p className="text-muted-foreground">{getSelectedProtocol().description}</p>
                        
                        <div className="flex justify-center items-center gap-3 text-primary font-bold text-xl">
                          <span>{getSelectedProtocol().fastHours}h</span>
                          <span className="text-muted-foreground">/</span>
                          <span>{getSelectedProtocol().eatHours}h</span>
                        </div>
                        
                        <Button 
                          onClick={startFasting} 
                          size="lg" 
                          className="mt-4 gap-2"
                        >
                          <Play className="h-4 w-4" />
                          Start Fasting
                        </Button>
                      </div>
                      
                      <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30">
                        <CardContent className="p-4 flex items-start gap-3">
                          <Coffee className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-1" />
                          <div>
                            <h3 className="font-medium text-amber-800 dark:text-amber-300">During your fast</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                              You may drink water, black coffee, unsweetened tea, and other non-caloric beverages.
                              Avoid food, caloric drinks, and supplements that break your fast.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="protocols" className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Select a fasting protocol based on your experience level and goals. 
                    Start with a less intense protocol if you're new to intermittent fasting.
                  </p>
                  
                  <RadioGroup 
                    value={selectedProtocol} 
                    onValueChange={setSelectedProtocol}
                    className="space-y-4"
                    disabled={isActive}
                  >
                    {fastingProtocols.map(protocol => (
                      <div key={protocol.id} className="flex items-start space-x-2">
                        <RadioGroupItem value={protocol.id} id={protocol.id} className="mt-1" />
                        <div className="grid gap-1.5 w-full">
                          <Label htmlFor={protocol.id} className="font-medium flex items-center gap-2">
                            {protocol.name}
                            <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                              <Badge variant="outline" className="bg-primary/5">
                                {protocol.fastHours}h fast
                              </Badge>
                              <Badge variant="outline" className="bg-secondary/5">
                                {protocol.eatHours}h eat
                              </Badge>
                            </div>
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {protocol.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  {isActive && (
                    <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
                      You cannot change the fasting protocol while a fast is in progress.
                      To change protocols, end your current fast first.
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="milestones" className="space-y-6">
                  <p className="text-sm text-muted-foreground mb-6">
                    During your fast, your body goes through various metabolic changes. These milestones 
                    represent the typical effects that occur at different stages of fasting.
                    Individual results may vary.
                  </p>
                  
                  <div className="space-y-6">
                    {fastingMilestones.map((milestone, index) => (
                      <div key={milestone.id} className="relative">
                        {index !== fastingMilestones.length - 1 && (
                          <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-muted-foreground/20" />
                        )}
                        
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 z-10">
                            {milestone.icon}
                          </div>
                          
                          <div className="pb-6">
                            <div className="flex items-baseline gap-2">
                              <h3 className="text-base font-medium">{milestone.title}</h3>
                              <Badge variant="outline">{milestone.hour} hours</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <FastingSummary />
    </ToolAnalyticsWrapper>
  );
}
