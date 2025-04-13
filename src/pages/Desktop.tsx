import React from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Clock, Calendar, Clipboard, CheckSquare, BarChart2, Activity, Zap } from "lucide-react";
import EisenhowerMatrix from "@/components/focus/EisenhowerMatrix";

export default function Desktop() {
  return (
    <div className="container">
      <TopNav />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4 today</div>
            <CardDescription className="text-xs">+2 from yesterday</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Tracked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 hrs</div>
            <CardDescription className="text-xs">+15% from last week</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <Clipboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <CardDescription className="text-xs">+3 from yesterday</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Level</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <CardDescription className="text-xs">Stable</CardDescription>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Task Prioritization</CardTitle>
            <CardDescription>Organize tasks by importance and urgency</CardDescription>
          </CardHeader>
          <CardContent>
            <EisenhowerMatrix />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Your productivity and focus metrics</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Focus Score</div>
                  <div className="text-sm text-muted-foreground">78/100</div>
                </div>
                <Progress value={78} className="h-2 mt-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Deep Work</div>
                  <div className="text-sm text-muted-foreground">2.5 hrs</div>
                </div>
                <Progress value={62} className="h-2 mt-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Task Completion</div>
                  <div className="text-sm text-muted-foreground">85%</div>
                </div>
                <Progress value={85} className="h-2 mt-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Card className="bg-muted">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4 text-primary" />
                      <div className="text-sm font-medium">Streaks</div>
                    </div>
                    <div className="text-2xl font-bold mt-2">7 days</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <div className="text-sm font-medium">Flow</div>
                    </div>
                    <div className="text-2xl font-bold mt-2">92%</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
            <CardDescription>Tasks in progress or due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <CheckSquare className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <div className="font-medium">Finalize project proposal</div>
                  <div className="text-sm text-muted-foreground">Due in 3 hours</div>
                  <Progress value={75} className="h-2 mt-1" />
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">Complete</Button>
              </div>
              
              <div className="flex items-start gap-4">
                <CheckSquare className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <div className="font-medium">Review code changes</div>
                  <div className="text-sm text-muted-foreground">Due tomorrow</div>
                  <Progress value={30} className="h-2 mt-1" />
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">Complete</Button>
              </div>
              
              <div className="flex items-start gap-4">
                <CheckSquare className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <div className="font-medium">Prepare presentation</div>
                  <div className="text-sm text-muted-foreground">Due next week</div>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">Complete</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Energy Level</CardTitle>
            <CardDescription>Current energy status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="font-bold text-4xl mb-2">74%</div>
              <Progress value={74} className="h-2 w-full" />
              <div className="flex items-center gap-2 mt-4">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="text-sm">Productive Zone</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
            <CardDescription>Next scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium">Team Meeting</div>
                <div className="text-xs text-muted-foreground">Today at 2:00 PM</div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Client Call</div>
                <div className="text-xs text-muted-foreground">Tomorrow at 10:00 AM</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
