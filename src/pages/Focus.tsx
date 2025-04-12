
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FocusEnhancementTools } from "@/components/focus/FocusEnhancementTools";
import { TaskManagementTools } from "@/components/focus/TaskManagementTools";
import { ADHDTaskManager } from "@/components/focus/ADHDTaskManager";
import { FocusAnalyticsDashboard } from "@/components/focus/FocusAnalyticsDashboard";
import { FocusAchievements } from "@/components/focus/FocusAchievements";
import { Focus as FocusIcon, Brain, Zap, Target, CheckCircle2, BarChart2, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Focus = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Focus Center</h1>
        <div className="flex items-center gap-2 text-primary">
          <FocusIcon className="h-5 w-5" />
          <span className="font-medium">Enhance Your Focus</span>
        </div>
      </div>
      
      {/* Quick Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-white/80 dark:bg-white/10 rounded-full p-3">
                <Brain className="h-5 w-5 text-indigo-500" />
              </div>
              <h3 className="font-medium">ADHD Support</h3>
              <p className="text-sm text-muted-foreground">
                Task organization tools for ADHD challenges
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById('adhd-tools')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Tools
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-white/80 dark:bg-white/10 rounded-full p-3">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-medium">Focus Timers</h3>
              <p className="text-sm text-muted-foreground">
                Structured time blocks for maximum productivity
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById('focus-tools')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Focusing
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-white/80 dark:bg-white/10 rounded-full p-3">
                <CheckCheck className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-medium">Task Manager</h3>
              <p className="text-sm text-muted-foreground">
                Time estimation and task management strategies
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById('task-tools')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Manage Tasks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card id="focus-tools" className="border border-primary/10 scroll-mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FocusIcon className="h-5 w-5 text-primary" />
              Focus Tools
            </CardTitle>
            <CardDescription>Enhance your focus and productivity with these tools</CardDescription>
          </CardHeader>
          <CardContent>
            <FocusEnhancementTools />
          </CardContent>
        </Card>
        
        <Card id="adhd-tools" className="border border-primary/10 scroll-mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              ADHD Task Support
            </CardTitle>
            <CardDescription>Tools designed for ADHD mind management</CardDescription>
          </CardHeader>
          <CardContent>
            <ADHDTaskManager />
          </CardContent>
        </Card>
      </div>
      
      <Card id="task-tools" className="border border-primary/10 scroll-mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Task Management
          </CardTitle>
          <CardDescription>Improve your time estimation skills</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskManagementTools />
        </CardContent>
      </Card>
      
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Achievements</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="space-y-4">
          <FocusAnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-4">
          <FocusAchievements />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate("/app/distraction-manager")}
        >
          <FocusIcon className="h-4 w-4" />
          Manage Distractions
        </Button>
      </div>
    </div>
  );
};

export default Focus;
