
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SleepMetrics } from "@/components/sleep/SleepMetrics";
import { Activity, Moon } from "lucide-react";

const SleepTracking = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sleep Tracking</h1>
        <div className="flex items-center gap-2 text-primary">
          <Activity className="h-5 w-5" />
          <span className="font-medium">Track Your Sleep</span>
        </div>
      </div>
      
      <Card className="border border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            Sleep Metrics
          </CardTitle>
          <CardDescription>Detailed analysis of your sleep patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <SleepMetrics />
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepTracking;
