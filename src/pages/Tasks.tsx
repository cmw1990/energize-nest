
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ADHDTaskManager } from "@/components/focus/ADHDTaskManager";
import { TopNav } from "@/components/layout/TopNav";

const Tasks = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 pt-6">
        <h1 className="text-3xl font-bold mb-6">Task Management</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Manager</CardTitle>
              <CardDescription>Manage your tasks and stay organized</CardDescription>
            </CardHeader>
            <CardContent>
              <ADHDTaskManager />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
