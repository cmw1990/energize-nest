
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SleepAnalysis } from "@/components/sleep/SleepAnalysis";
import { SleepMetrics } from "@/components/sleep/SleepMetrics";
import { SleepRecommendations } from "@/components/sleep/SleepRecommendations";
import { Clock, Moon, Zap, BedDouble, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sleep = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sleep Dashboard</h1>
        <div className="flex items-center gap-2 text-primary">
          <Moon className="h-5 w-5" />
          <span className="font-medium">Better Sleep, Better Life</span>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-3 mb-3">
                <BedDouble className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-medium mb-1">Log Sleep</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Track your sleep patterns
              </p>
              <Button
                size="sm"
                onClick={() => navigate("/app/sleep-tracking")}
                className="mt-auto"
              >
                Record Sleep
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mb-3">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-medium mb-1">Sleep Calculator</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Find your ideal bedtime
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/app/web-tools/sleep-calculator")}
                className="mt-auto"
              >
                Calculate
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-teal-100 dark:bg-teal-900/30 p-3 mb-3">
                <Activity className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="font-medium mb-1">Sleep Trends</h3>
              <p className="text-sm text-muted-foreground mb-3">
                View your sleep analytics
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/app/sleep-tracking?tab=metrics")}
                className="mt-auto"
              >
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
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
      
      <SleepRecommendations />
    </div>
  );
};

export default Sleep;
