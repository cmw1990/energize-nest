
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADHDTaskManager } from "@/components/focus/ADHDTaskManager";
import { TopNav } from "@/components/layout/TopNav";
import { EisenhowerMatrix } from "@/components/focus/EisenhowerMatrix";
import { TaskAnalytics } from "@/components/focus/TaskAnalytics";
import { TaskAutomation } from "@/components/focus/TaskAutomation";
import { TaskReminders } from "@/components/focus/TaskReminders";
import { CheckSquare, BarChart, Clock, Zap, Bell } from "lucide-react";
import { motion } from "framer-motion";

const Tasks = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <motion.div 
        className="container mx-auto p-4 pt-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CheckSquare className="h-7 w-7 text-primary" />
              Task Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Organize your priorities and boost productivity with our ADHD-friendly task management system
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden md:inline">Task Manager</span>
              <span className="md:hidden">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="eisenhower" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden md:inline">Priority Matrix</span>
              <span className="md:hidden">Matrix</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="hidden md:inline">Task Analytics</span>
              <span className="md:hidden">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden md:inline">Automation</span>
              <span className="md:hidden">Auto</span>
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Reminders</span>
              <span className="md:hidden">Remind</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  Task Manager
                </CardTitle>
                <CardDescription>
                  Organize your tasks with our ADHD-friendly interface designed to reduce overwhelm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ADHDTaskManager />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="eisenhower" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Eisenhower Priority Matrix
                </CardTitle>
                <CardDescription>
                  Organize tasks by importance and urgency to focus on what truly matters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EisenhowerMatrix />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  Task Analytics
                </CardTitle>
                <CardDescription>
                  Track your productivity patterns and identify opportunities for improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskAnalytics />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="automation" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Task Automation
                </CardTitle>
                <CardDescription>
                  Create rules to automate repetitive tasks and reduce decision fatigue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskAutomation />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reminders" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Task Reminders
                </CardTitle>
                <CardDescription>
                  Set up effective reminders that work with your attention patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskReminders />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Tasks;
