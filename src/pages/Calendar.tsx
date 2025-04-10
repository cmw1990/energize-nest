
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNav } from "@/components/layout/TopNav";

const Calendar = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 pt-6">
        <h1 className="text-3xl font-bold mb-6">Calendar</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Calendar & Scheduling</CardTitle>
            <CardDescription>Manage your appointments and events</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your calendar view will be displayed here. You can manage your appointments, set reminders, 
              and organize your schedule.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
