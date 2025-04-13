
import React, { useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SleepMetrics } from "@/components/sleep/SleepMetrics";
import SleepRecommendations from "@/components/sleep/SleepRecommendations";
import SleepGoals from "@/components/sleep/SleepGoals";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Bell, Moon, Clock, Calendar, Smartphone, Brain, Wine, Flower, 
  Cloud, Sun, Target, AlarmClock, BarChart2Icon, MoonStar, Clock4, 
  BedDouble, ArrowRight, Lightbulb, Clipboard, PenLine, ListTodo,
  CheckCircle, GraduationCap, Sparkles
} from "lucide-react";
import { sleepOptimizationTips, whiteNoiseDevices, sleepMaskRecommendations } from "@/data/sleepSounds";
import { supabase } from "@/integrations/supabase/client";

const Sleep = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [sleepScore, setSleepScore] = useState(78);
  const [activeTab, setActiveTab] = useState("metrics");
  const [sleepStreak, setSleepStreak] = useState(5);
  const [upcomingAlarm, setUpcomingAlarm] = useState("7:00 AM");
  const [sleepScheduleCompliance, setSleepScheduleCompliance] = useState(85);

  const setupNewAlarm = () => {
    toast({
      title: "Smart Alarm Set",
      description: "Your alarm will wake you during light sleep phase for optimal energy"
    });
  };

  const saveSleepGoal = async (goal: string) => {
    if (!session?.user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save goals",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('sleep_goals')
        .insert({
          user_id: session.user.id,
          goal: goal,
          created_at: new Date().toISOString(),
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Goal Saved",
        description: "Your sleep goal has been saved successfully"
      });
    } catch (error) {
      console.error("Error saving sleep goal:", error);
      toast({
        title: "Error",
        description: "Failed to save your sleep goal",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Sleep Wellness</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setActiveTab("goals")}>
              <Target className="mr-2 h-4 w-4" />
              Sleep Goals
            </Button>
            <Button onClick={setupNewAlarm}>
              <AlarmClock className="mr-2 h-4 w-4" />
              Set Smart Alarm
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2">
                <MoonStar className="h-4 w-4 text-primary" />
                Sleep Score
              </CardTitle>
              <Badge variant="outline" className="bg-primary/10 text-primary px-3">
                {sleepStreak} day streak
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-muted-foreground opacity-25"
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="none"
                      />
                      <circle
                        className="text-primary"
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - sleepScore / 100)}`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">{sleepScore}</span>
                      <span className="text-xs text-muted-foreground">out of 100</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-xs text-center">
                    Your sleep score is based on duration, quality, and consistency of your sleep patterns
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <Clock4 className="h-8 w-8 text-blue-500 mb-2" />
                    <span className="text-lg font-medium">7.2 hrs</span>
                    <span className="text-xs text-muted-foreground">Avg Duration</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <BedDouble className="h-8 w-8 text-indigo-500 mb-2" />
                    <span className="text-lg font-medium">86%</span>
                    <span className="text-xs text-muted-foreground">Sleep Quality</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <AlarmClock className="h-8 w-8 text-violet-500 mb-2" />
                    <span className="text-lg font-medium">{upcomingAlarm}</span>
                    <span className="text-xs text-muted-foreground">Next Alarm</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Schedule Compliance</span>
                    <span className="text-sm text-muted-foreground">{sleepScheduleCompliance}%</span>
                  </div>
                  <Progress value={sleepScheduleCompliance} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Your bedtime consistency is a key factor in quality sleep
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-primary" />
                Sleep To-Do
              </CardTitle>
              <CardDescription>
                Today's recommendations for better sleep
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Limit caffeine after 2pm</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Reduce blue light 1hr before bed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Set bedroom temperature to 65-68°F</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">5-minute breathing exercise</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("hygiene")}>
                  <Clipboard className="mr-2 h-4 w-4" />
                  View Sleep Hygiene Checklist
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Your Sleep Sanctuary
            </CardTitle>
            <CardDescription>
              Optimize your sleep for better health and productivity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="metrics" className="flex items-center gap-2">
                  <BarChart2Icon className="h-4 w-4" />
                  Metrics
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Goals
                </TabsTrigger>
                <TabsTrigger value="hygiene" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Sleep Hygiene
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="metrics" className="space-y-4">
                <SleepMetrics />
              </TabsContent>
              
              <TabsContent value="recommendations" className="space-y-4">
                <SleepRecommendations />
              </TabsContent>
              
              <TabsContent value="goals" className="space-y-4">
                <SleepGoals />
              </TabsContent>
              
              <TabsContent value="hygiene" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Sleep Hygiene Checklist
                    </CardTitle>
                    <CardDescription>
                      Follow these evidence-based recommendations for better sleep quality
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {sleepOptimizationTips.map((category, index) => (
                        <div key={index} className="space-y-3 p-4 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <category.icon className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">{category.category}</h3>
                          </div>
                          <ul className="space-y-2">
                            {category.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{tip}</span>
                              </li>
                            ))}
                          </ul>
                          {category.scientificSources && (
                            <div className="text-xs text-muted-foreground italic mt-2">
                              Sources: {category.scientificSources.join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">Sleep Science</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Most adults need 7-9 hours of quality sleep. Sleep cycles last about 90 minutes, with each cycle 
                        containing light sleep, deep sleep, and REM sleep phases. Planning your sleep schedule around complete 
                        cycles can help you wake up feeling more refreshed.
                      </p>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Cloud className="h-4 w-4 text-primary" />
                            Recommended White Noise Machines
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {whiteNoiseDevices.slice(0, 3).map((device, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="bg-muted rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm">{device.name}</p>
                                  <Badge variant="outline">{device.price}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {device.features[0]}
                                </p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <MoonStar className="h-4 w-4 text-primary" />
                            Recommended Sleep Masks
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {sleepMaskRecommendations.slice(0, 3).map((mask, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="bg-muted rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                                <Moon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm">{mask.name}</p>
                                  <Badge variant="outline">{mask.price}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {mask.features[0]}
                                </p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Button className="w-full" onClick={() => saveSleepGoal("Implement complete sleep hygiene routine")}>
                      <Target className="h-4 w-4 mr-2" />
                      Create Sleep Hygiene Goal
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Smartphone className="h-10 w-10 mx-auto text-blue-500" />
                <h2 className="text-xl font-medium">Digital Detox</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Reduce screen time before bed to improve sleep quality.
                </p>
                <Button variant="outline">Explore Tips</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Brain className="h-10 w-10 mx-auto text-green-500" />
                <h2 className="text-xl font-medium">Mindfulness</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Practice meditation or deep breathing for relaxation.
                </p>
                <Button variant="outline">Start Session</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Wine className="h-10 w-10 mx-auto text-red-500" />
                <h2 className="text-xl font-medium">Limit Alcohol</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Avoid alcohol close to bedtime to prevent sleep disruption.
                </p>
                <Button variant="outline">Learn More</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Flower className="h-10 w-10 mx-auto text-purple-500" />
                <h2 className="text-xl font-medium">Create a Routine</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Establish a relaxing pre-sleep routine.
                </p>
                <Button variant="outline">View Examples</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-0">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="md:w-1/3 text-center md:text-left">
                <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-4">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Sleep Learning Center</h2>
                <p className="text-muted-foreground">
                  Explore our curated resources to deepen your understanding of sleep science and optimization
                </p>
              </div>
              
              <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-4 bg-white dark:bg-background rounded-lg shadow-sm">
                  <GraduationCap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Sleep Cycle Mastery</h3>
                    <p className="text-sm text-muted-foreground">Learn how to optimize your sleep cycles for maximum recovery</p>
                    <Button variant="link" className="px-0 h-auto mt-1">
                      Read article <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white dark:bg-background rounded-lg shadow-sm">
                  <Brain className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Memory and Sleep</h3>
                    <p className="text-sm text-muted-foreground">How quality sleep improves learning and memory consolidation</p>
                    <Button variant="link" className="px-0 h-auto mt-1">
                      Read article <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white dark:bg-background rounded-lg shadow-sm">
                  <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Circadian Rhythms</h3>
                    <p className="text-sm text-muted-foreground">Understand your body's natural clock and how to sync with it</p>
                    <Button variant="link" className="px-0 h-auto mt-1">
                      Read article <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white dark:bg-background rounded-lg shadow-sm">
                  <Sun className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Light Exposure Guide</h3>
                    <p className="text-sm text-muted-foreground">How to use light to regulate your sleep-wake cycle</p>
                    <Button variant="link" className="px-0 h-auto mt-1">
                      Read article <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sleep;
