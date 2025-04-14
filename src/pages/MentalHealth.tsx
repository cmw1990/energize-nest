
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  CloudRain, 
  Activity, 
  Heart, 
  PencilLine, 
  ListChecks, 
  ThumbsUp, 
  Sparkles,
  BookOpen
} from "lucide-react";
import { StressManagement } from "@/components/mentalHealth/StressManagement";
import { CBTThoughtRecord } from "@/components/mentalHealth/CBTThoughtRecord";

export default function MentalHealth() {
  const [activeTab, setActiveTab] = useState('stress');

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Mental Health</h1>
        </div>
        <Button variant="outline" className="hidden sm:flex">
          <BookOpen className="h-4 w-4 mr-2" />
          Mental Health Resources
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-4 w-[600px]">
            <TabsTrigger value="stress" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Stress</span>
            </TabsTrigger>
            <TabsTrigger value="cbt" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>CBT Tools</span>
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Mood</span>
            </TabsTrigger>
            <TabsTrigger value="gratitude" className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" />
              <span>Gratitude</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="stress" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Stress Management</CardTitle>
              <CardDescription>
                Track and manage your stress levels with evidence-based techniques.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StressManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cbt" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Cognitive Behavioral Therapy Tools</CardTitle>
              <CardDescription>
                Identify and reframe unhelpful thoughts using cognitive behavioral techniques.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CBTThoughtRecord />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mood" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Mood Tracking</CardTitle>
              <CardDescription>
                Track your mood patterns over time to identify triggers and trends.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium">Mood Tracking Coming Soon</h3>
                <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                  We're building a comprehensive mood tracking system with emotion analysis and pattern recognition.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab('stress')}
                >
                  Try Stress Management
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gratitude" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Gratitude Journal</CardTitle>
              <CardDescription>
                Practice gratitude to improve your mental wellbeing and resilience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium">Gratitude Journal Coming Soon</h3>
                <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                  We're developing a daily gratitude practice with prompts, reminders, and progress tracking.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab('stress')}
                >
                  Try Stress Management
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
