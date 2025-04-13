
import React, { useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SleepMetrics } from "@/components/sleep/SleepMetrics";
import { SleepScheduler } from "@/components/sleep/SleepScheduler";
import { SleepTrackingForm } from "@/components/sleep/SleepTrackingForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import {
  Activity,
  AlarmClock,
  ArrowRight,
  BedDouble,
  Calendar,
  ChevronRight,
  Clock,
  Hourglass,
  Moon,
  Plus,
  Settings,
  Sunrise,
  Sunset,
  Zap,
  BarChart2,
  CheckSquare,
  Heart,
  Brain,
  LineChart,
  Thermometer,
  Users,
  Smartphone,
  MessageCircle,
  ClipboardList,
  GraduationCap
} from "lucide-react";
import { sleepOptimizationTips } from "@/data/sleepSounds";
import { Progress } from "@/components/ui/progress";

const SleepTracking = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sleepImprovement, setSleepImprovement] = useState(12);
  const [streakCount, setStreakCount] = useState(7);
  const [sleepRating, setSleepRating] = useState(4);
  const [bedtimeConsistency, setBedtimeConsistency] = useState(85);

  const addSleepJournalEntry = async (entry: string) => {
    if (!session?.user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save journal entries",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('sleep_journal')
        .insert({
          user_id: session.user.id,
          content: entry,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Journal Entry Saved",
        description: "Your sleep journal entry has been saved"
      });
    } catch (error) {
      console.error("Error saving sleep journal entry:", error);
      toast({
        title: "Error",
        description: "Failed to save your journal entry",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center gap-2">
          <Moon className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Sleep Tracking</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-0">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <BedDouble className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-1">Sleep Quality Score</h2>
                <div className="text-4xl font-bold text-primary mb-2">82/100</div>
                <p className="text-sm text-muted-foreground">
                  {sleepImprovement}% improvement in the last 30 days
                </p>
                <Button variant="link" onClick={() => setActiveTab("dashboard")}>
                  View details <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full border-2 border-primary flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{streakCount} days</div>
                  <p className="text-sm text-muted-foreground">
                    Consistent sleep tracking
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Bedtime Consistency</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlarmClock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">Last 7 days</span>
                </div>
                <span className="font-medium">{bedtimeConsistency}%</span>
              </div>
              <Progress value={bedtimeConsistency} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Consistent bedtimes improve sleep quality and energy levels
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="scheduler" className="flex items-center gap-2">
                <AlarmClock className="h-4 w-4" />
                <span className="hidden sm:inline">Scheduler</span>
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Log Sleep</span>
              </TabsTrigger>
              <TabsTrigger value="hygiene" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Sleep Hygiene</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="dashboard">
            <SleepMetrics />
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    Sleep Insights
                  </CardTitle>
                  <CardDescription>
                    Personalized insights based on your sleep patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Thermometer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Temperature Impact</h3>
                        <p className="text-sm text-muted-foreground">
                          You sleep 18% better when your bedroom is below 68°F (20°C)
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Exercise Correlation</h3>
                        <p className="text-sm text-muted-foreground">
                          Days with 30+ minutes of exercise show 22% better deep sleep
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Moon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Optimal Bedtime</h3>
                        <p className="text-sm text-muted-foreground">
                          Your optimal bedtime appears to be between 10:30-11:00 PM
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Sunrise className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Morning Routine</h3>
                        <p className="text-sm text-muted-foreground">
                          Early sunlight exposure improves your next night's sleep quality by 15%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Screen Time</h3>
                        <p className="text-sm text-muted-foreground">
                          Late evening screen time delays your sleep onset by ~25 minutes
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <Heart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Recovery Pattern</h3>
                        <p className="text-sm text-muted-foreground">
                          Your recovery is strongest between 2-4 AM based on heart rate variability
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row p-4 rounded-lg bg-primary/5 border border-primary/10 gap-4">
                    <div className="flex items-center gap-3 md:border-r md:border-primary/10 md:pr-4 md:w-1/3">
                      <GraduationCap className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-medium">Weekly Sleep Report</h3>
                        <p className="text-sm text-muted-foreground">
                          Get detailed analysis of your sleep trends
                        </p>
                      </div>
                    </div>
                    <div className="md:w-2/3 flex items-center">
                      <p className="text-sm text-muted-foreground">
                        Your average sleep quality has improved by 8% this week. Continue maintaining your consistent sleep schedule to further improve your sleep score.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="scheduler">
            <SleepScheduler />
          </TabsContent>
          
          <TabsContent value="tracking">
            <SleepTrackingForm />
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Sleep Journal
                  </CardTitle>
                  <CardDescription>
                    Record notes about your sleep experience to identify patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="journal" className="text-sm font-medium">
                      Today's Sleep Journal Entry
                    </label>
                    <textarea 
                      id="journal" 
                      className="w-full h-32 p-3 border rounded-md bg-background" 
                      placeholder="How did you sleep? Any dreams, disruptions, or observations to note?"
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label htmlFor="sleep-rating" className="text-sm font-medium">
                        How would you rate your sleep? (1-5)
                      </label>
                      <div className="flex items-center gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setSleepRating(rating)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              sleepRating >= rating
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button onClick={() => addSleepJournalEntry("Sample journal entry text")}>
                      Save Entry
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-3">Recent Journal Entries</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">April 12, 2025</span>
                          <div className="flex items-center">
                            <span className="text-xs mr-1">Rating:</span>
                            <span className="inline-block px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">4/5</span>
                          </div>
                        </div>
                        <p className="text-sm mt-2">
                          Fell asleep quickly but woke up around 2am for about 30 minutes. Otherwise good quality sleep. Tried the new breathing technique which helped me fall back asleep.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-muted rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">April 11, 2025</span>
                          <div className="flex items-center">
                            <span className="text-xs mr-1">Rating:</span>
                            <span className="inline-block px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">3/5</span>
                          </div>
                        </div>
                        <p className="text-sm mt-2">
                          Had trouble falling asleep after late work session. Room was a bit warm. Used white noise app which helped eventually.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="hygiene">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  Sleep Hygiene Checklist
                </CardTitle>
                <CardDescription>
                  Follow these recommendations for better sleep quality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {sleepOptimizationTips.map((category, index) => (
                    <SleepHygieneCategory 
                      key={index}
                      title={category.category} 
                      icon={<category.icon className="h-5 w-5 text-primary" />}
                      items={category.tips.map(text => ({ text, checked: false }))}
                    />
                  ))}
                </div>
                
                <div className="grid gap-4 mt-6">
                  <Card className="bg-primary/5 border-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" />
                        Sleep Science
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Most adults need 7-9 hours of quality sleep. Sleep cycles last about 90 minutes, with each cycle 
                        containing light sleep, deep sleep, and REM sleep phases. Planning your sleep schedule around complete 
                        cycles can help you wake up feeling more refreshed.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-primary/5 border-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Personalized Recommendation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Based on your sleep data, focusing on <span className="font-medium text-foreground">consistent bedtimes</span> and
                        <span className="font-medium text-foreground"> reducing screen time before bed</span> would have the biggest impact on your sleep quality.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Button className="w-full">
                  Get Personalized Sleep Plan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface SleepHygieneCategoryProps {
  title: string;
  icon: React.ReactNode;
  items: { text: string; checked: boolean }[];
}

const SleepHygieneCategory: React.FC<SleepHygieneCategoryProps> = ({ title, icon, items }) => {
  const [checklist, setChecklist] = useState(items);
  
  const toggleItem = (index: number) => {
    const newChecklist = [...checklist];
    newChecklist[index].checked = !newChecklist[index].checked;
    setChecklist(newChecklist);
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <ul className="space-y-2">
        {checklist.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <input 
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(index)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SleepTracking;
