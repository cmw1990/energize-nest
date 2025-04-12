import React, { useState } from 'react';
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ADHDTaskManager } from "@/components/focus/ADHDTaskManager";
import EisenhowerMatrix from "@/components/focus/EisenhowerMatrix";
import { FocusTimerTools } from "@/components/focus/FocusTimerTools";
import { FocusEnvironment } from "@/components/focus/FocusEnvironment";
import { FocusAchievements } from "@/components/focus/FocusAchievements";
import { FocusAnalyticsDashboard } from "@/components/focus/FocusAnalyticsDashboard";
import { WebsiteBlocker } from "@/components/distraction/WebsiteBlocker";
import { AppBlocker } from "@/components/distraction/AppBlocker";
import { AdBlockingStats } from "@/components/adblocking/AdBlockingStats";
import { AdBlockingExceptions } from "@/components/adblocking/AdBlockingExceptions";
import { FilterListManager } from "@/components/adblocking/FilterListManager";
import { Calendar, CheckSquare, Clock, Focus, ListChecks, Zap, Layers, Shield, LineChart, Trophy, Settings, Plus } from "lucide-react";

export default function ProductivityDashboard() {
  const [adBlockingTab, setAdBlockingTab] = useState("stats");
  
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 pt-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Productivity Dashboard</h1>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            Manage your tasks, enhance your focus, and minimize distractions with our comprehensive productivity tools.
          </p>
        </div>
        
        <Tabs defaultValue="tasks" className="space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="tasks">
              <ListChecks className="h-4 w-4 mr-2" />
              Task Management
            </TabsTrigger>
            <TabsTrigger value="focus">
              <Focus className="h-4 w-4 mr-2" />
              Focus Tools
            </TabsTrigger>
            <TabsTrigger value="distraction">
              <Shield className="h-4 w-4 mr-2" />
              Distraction Blocking
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <LineChart className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5 text-primary" />
                      ADHD-Friendly Task Manager
                    </CardTitle>
                    <CardDescription>
                      Organize tasks with visual cues for priority and urgency
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ADHDTaskManager />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Today's Schedule
                    </CardTitle>
                    <CardDescription>
                      Your most important appointments for today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg border p-3">
                        <div className="flex justify-between">
                          <div className="font-medium">Team Meeting</div>
                          <div className="text-sm text-muted-foreground">10:00 AM</div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Project status update</div>
                      </div>
                      
                      <div className="rounded-lg border p-3">
                        <div className="flex justify-between">
                          <div className="font-medium">Focus Block</div>
                          <div className="text-sm text-muted-foreground">1:00 PM</div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Deep work on main project</div>
                      </div>
                      
                      <div className="rounded-lg border p-3">
                        <div className="flex justify-between">
                          <div className="font-medium">Check-in with mentor</div>
                          <div className="text-sm text-muted-foreground">3:30 PM</div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Weekly guidance session</div>
                      </div>
                      
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Event
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Eisenhower Matrix
                </CardTitle>
                <CardDescription>
                  Prioritize tasks based on importance and urgency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EisenhowerMatrix />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="focus" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Focus Timer Tools
                </CardTitle>
                <CardDescription>
                  Techniques to enhance concentration and productivity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FocusTimerTools />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Focus Environment
                </CardTitle>
                <CardDescription>
                  Create optimal conditions for deep work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FocusEnvironment />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="distraction" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <WebsiteBlocker />
              <AppBlocker />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Ad Blocking Settings
                </CardTitle>
                <CardDescription>
                  Configure ad blocking preferences and exceptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={adBlockingTab} onValueChange={setAdBlockingTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                    <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
                    <TabsTrigger value="filters">Filter Lists</TabsTrigger>
                  </TabsList>
                  
                  {adBlockingTab === "stats" && <AdBlockingStats />}
                  {adBlockingTab === "exceptions" && <AdBlockingExceptions />}
                  {adBlockingTab === "filters" && <FilterListManager />}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Focus Analytics
                </CardTitle>
                <CardDescription>
                  Track your productivity metrics and patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FocusAnalyticsDashboard />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Productivity Achievements
                </CardTitle>
                <CardDescription>
                  Celebrate your productivity milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FocusAchievements />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 bg-muted/30 p-6 rounded-lg border">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            Productivity Science
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Task Batching</h3>
              <p className="text-sm text-muted-foreground">
                Group similar tasks together to reduce context switching and maximize efficiency. This leverages our brain's ability to stay in a particular "mode" of work.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Time Blocking</h3>
              <p className="text-sm text-muted-foreground">
                Dedicate specific blocks of time to focused work, reducing the decision fatigue that comes from constantly deciding what to work on next.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Energy Management</h3>
              <p className="text-sm text-muted-foreground">
                Match your most challenging tasks to your peak energy periods. Schedule creative work when your mind is fresh and administrative tasks when energy dips.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
