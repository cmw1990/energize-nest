
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FocusEnhancementTools } from "@/components/focus/FocusEnhancementTools";
import { FocusAnalyticsDashboard } from "@/components/focus/FocusAnalyticsDashboard";
import { Brain, Focus as FocusIcon, Zap } from "lucide-react";

const Focus = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Focus Center</h1>
        <div className="flex items-center gap-2 text-primary">
          <FocusIcon className="h-5 w-5" />
          <span className="font-medium">Enhance Your Focus</span>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Focus Analytics
            </CardTitle>
            <CardDescription>Track your focus patterns and improvements</CardDescription>
          </CardHeader>
          <CardContent>
            <FocusAnalyticsDashboard />
          </CardContent>
        </Card>
        
        <Card className="border border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Focus Tools
            </CardTitle>
            <CardDescription>Tools to enhance your focus and productivity</CardDescription>
          </CardHeader>
          <CardContent>
            <FocusEnhancementTools />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Focus;
