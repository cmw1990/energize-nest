
import React from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SleepMetrics } from "@/components/sleep/SleepMetrics";
import { Moon, Clock, Calendar, Clipboard, AlarmClock, Bell } from "lucide-react";

const SleepTracking = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center gap-2">
          <Moon className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Sleep Tracking</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Sleep Tools
              </CardTitle>
              <CardDescription>
                Track and optimize your sleep
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <AlarmClock className="mr-2 h-4 w-4" />
                Smart Alarm
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clipboard className="mr-2 h-4 w-4" />
                Sleep Log
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Sleep Schedule
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Bedtime Reminder
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 w-full">
            <CardHeader>
              <CardTitle>Sleep Analytics</CardTitle>
              <CardDescription>
                Insights into your sleep patterns and quality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SleepMetrics />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SleepTracking;
