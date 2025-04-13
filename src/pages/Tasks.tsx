
import React from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Temporarily create stub components until the real ones are implemented
const EisenhowerMatrix = () => <div>Eisenhower Matrix Component Coming Soon</div>;
const TaskAnalytics = () => <div>TaskAnalytics Component Coming Soon</div>;
const TaskAutomation = () => <div>TaskAutomation Component Coming Soon</div>;
const TaskReminders = () => <div>TaskReminders Component Coming Soon</div>;

const Tasks = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="matrix" className="space-y-4">
              <TabsList>
                <TabsTrigger value="matrix">Eisenhower Matrix</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="automation">Automation</TabsTrigger>
                <TabsTrigger value="reminders">Reminders</TabsTrigger>
              </TabsList>
              <TabsContent value="matrix">
                <EisenhowerMatrix />
              </TabsContent>
              <TabsContent value="analytics">
                <TaskAnalytics />
              </TabsContent>
              <TabsContent value="automation">
                <TaskAutomation />
              </TabsContent>
              <TabsContent value="reminders">
                <TaskReminders />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tasks;
