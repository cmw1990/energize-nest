
import React from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import SleepMetrics from "@/components/sleep/SleepMetrics";
import SleepRecommendations from "@/components/sleep/SleepRecommendations";
import SleepGoals from "@/components/sleep/SleepGoals";
import { useAuth } from "@/components/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, Moon, Clock, Calendar, Smartphone, Brain, Wine, Flower, 
  Cloud, Sun, Target, AlarmClock, BarChart2 as BarChart2Icon 
} from "lucide-react";

const Sleep = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Sleep Wellness</h1>
          </div>
          <Button>
            <AlarmClock className="mr-2 h-4 w-4" />
            Set Smart Alarm
          </Button>
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
            <Tabs defaultValue="metrics" className="space-y-6">
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
                {/* <TabsTrigger value="routine" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Routine
                </TabsTrigger> */}
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
              
              {/* <TabsContent value="routine" className="space-y-4">
                <SleepRoutine />
              </TabsContent> */}
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
          
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Cloud className="h-10 w-10 mx-auto text-gray-500" />
                <h2 className="text-xl font-medium">Optimize Environment</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Ensure your bedroom is dark, quiet, and cool.
                </p>
                <Button variant="outline">Checklist</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Sun className="h-10 w-10 mx-auto text-yellow-500" />
                <h2 className="text-xl font-medium">Morning Sunlight</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Get sunlight in the morning to regulate your circadian rhythm.
                </p>
                <Button variant="outline">Read More</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sleep;
