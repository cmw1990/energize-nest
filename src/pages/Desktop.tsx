import React from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EisenhowerMatrix from "@/components/focus/EisenhowerMatrix";
import { 
  Calendar, List, CheckSquare, Clock, BarChart2, 
  Activity, Zap, Brain, Award as Trophy
} from "lucide-react";

const Desktop = () => {
  const [activeTab, setActiveTab] = React.useState("tasks");

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Desktop</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Customize</Button>
          </div>
        </div>

        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Workspace</CardTitle>
            <CardDescription>
              Manage your tasks, track your progress, and stay focused
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
              <TabsContent value="tasks">
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Eisenhower Matrix</CardTitle>
                      <CardDescription>
                        Prioritize your tasks based on urgency and importance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EisenhowerMatrix />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="calendar">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendar</CardTitle>
                    <CardDescription>
                      View your schedule and upcoming events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      Coming soon...
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>
                      Track your progress and identify areas for improvement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      <BarChart2 className="mr-2 h-4 w-4" />
                      Coming soon...
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="achievements">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>
                      View your achievements and track your progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      <Trophy className="mr-2 h-4 w-4" />
                      Coming soon...
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Access your most frequently used features
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start">
                <List className="mr-2 h-4 w-4" />
                Add Task
              </Button>
              <Button variant="outline" className="justify-start">
                <CheckSquare className="mr-2 h-4 w-4" />
                Complete Task
              </Button>
              <Button variant="outline" className="justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Set Reminder
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Focus Mode</CardTitle>
              <CardDescription>
                Minimize distractions and maximize productivity
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32 text-muted-foreground">
              <Zap className="mr-2 h-4 w-4" />
              Coming soon...
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brain Training</CardTitle>
              <CardDescription>
                Improve your cognitive skills with brain training games
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32 text-muted-foreground">
              <Brain className="mr-2 h-4 w-4" />
              Coming soon...
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Desktop;
