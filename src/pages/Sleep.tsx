
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SleepAnalysis } from "@/components/sleep/SleepAnalysis";
import { SleepMetrics } from "@/components/sleep/SleepMetrics";
import { Clock, Moon, Zap } from "lucide-react";

const Sleep = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sleep Dashboard</h1>
        <div className="flex items-center gap-2 text-primary">
          <Moon className="h-5 w-5" />
          <span className="font-medium">Better Sleep, Better Life</span>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Sleep Metrics
            </CardTitle>
            <CardDescription>Track your sleep quality and duration</CardDescription>
          </CardHeader>
          <CardContent>
            <SleepMetrics />
          </CardContent>
        </Card>
        
        <Card className="border border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Sleep Analysis
            </CardTitle>
            <CardDescription>Understand your sleep patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <SleepAnalysis />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sleep;
