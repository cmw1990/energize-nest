
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SleepMetrics } from "@/components/sleep/SleepMetrics";
import { SleepLogEntry } from "@/components/sleep/SleepLogEntry";
import { SleepRecommendations } from "@/components/sleep/SleepRecommendations";
import { Activity, Moon, ClipboardCheck, Bed } from "lucide-react";

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
      
      <Tabs defaultValue="track" className="space-y-4">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="track" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Log Sleep</span>
            <span className="sm:hidden">Log</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Metrics</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center gap-2">
            <Bed className="h-4 w-4" />
            <span className="hidden sm:inline">Recommendations</span>
            <span className="sm:hidden">Tips</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="track">
          <SleepLogEntry />
        </TabsContent>

        <TabsContent value="metrics">
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
        </TabsContent>

        <TabsContent value="tips">
          <SleepRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SleepTracking;
