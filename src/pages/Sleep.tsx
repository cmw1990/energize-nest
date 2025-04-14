import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import SleepAnalytics from "@/components/sleep/SleepAnalytics"; // Renamed import for clarity
import SleepRecommendations from "@/components/sleep/SleepRecommendations";
import SleepGoals from "@/components/sleep/SleepGoals"; // Assuming this exists and is functional
import { SleepTrackingForm } from "@/components/sleep/SleepTrackingForm"; // Import the form
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Moon, Clock, Target, AlarmClock, BarChart2Icon, MoonStar, 
  BedDouble, Lightbulb, Clipboard, CheckCircle, GraduationCap, Sparkles, PlusCircle, ListTodo // Added ListTodo
} from "lucide-react";
import { sleepOptimizationTips } from "@/data/sleepSounds"; // Assuming this data exists and is structured correctly

const Sleep = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("log"); // Default to log tab

  // Removed local state for score, streak etc. - should come from analytics/data
  
  // Placeholder function - actual alarm logic would be more complex
  const setupNewAlarm = () => {
    toast({
      title: "Smart Alarm Feature",
      description: "Smart alarm functionality coming soon!" 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6"> 
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Moon className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Sleep Hub</h1>
        </div>
        <Button onClick={setupNewAlarm} variant="outline" size="sm">
          <AlarmClock className="mr-2 h-4 w-4" />
          Set Smart Alarm (Coming Soon)
        </Button>
      </div>

      {/* Main Content Area with Tabs */}
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5"> 
          <TabsTrigger value="log" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Log Sleep
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart2Icon className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="hygiene" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" /> {/* Changed icon */}
            Sleep Hygiene
          </TabsTrigger>
        </TabsList>
        
        {/* Tab Contents */}
        <div className="mt-6"> {/* Add margin top for content */}
          <TabsContent value="log" className="mt-0"> 
             <SleepTrackingForm />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <SleepAnalytics /> 
          </TabsContent>
          
          <TabsContent value="recommendations" className="mt-0">
            <SleepRecommendations />
          </TabsContent>
          
          <TabsContent value="goals" className="mt-0">
            <SleepGoals /> {/* Assuming SleepGoals component exists */}
          </TabsContent>
          
          <TabsContent value="hygiene" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Sleep Hygiene Checklist
                </CardTitle>
                <CardDescription>
                  Follow these evidence-based recommendations for better sleep quality.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {sleepOptimizationTips.map((category, index) => (
                    <div key={index} className="space-y-3 p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2">
                        {/* Render icon if available */}
                        {category.icon && <category.icon className="h-5 w-5 text-primary" />} 
                        <h3 className="font-medium">{category.category}</h3>
                      </div>
                      <ul className="space-y-2">
                        {category.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                      {category.scientificSources && (
                        <div className="text-xs text-muted-foreground italic mt-2 pt-2 border-t border-dashed">
                          Sources: {category.scientificSources.join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Sleep Science Snippet</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Most adults need 7-9 hours of quality sleep. Sleep cycles last about 90 minutes, with each cycle 
                    containing light sleep, deep sleep, and REM sleep phases. Planning your sleep schedule around complete 
                    cycles can help you wake up feeling more refreshed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Sleep;
