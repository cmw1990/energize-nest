
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Sun, Leaf, Clock } from "lucide-react";

const Meditation = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meditation</h1>
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          <span className="font-medium">Find Your Inner Peace</span>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-primary/10 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-500" />
              Mindfulness
            </CardTitle>
            <CardDescription>Be present in the moment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Practice focusing your attention on the present moment, without judgment.
            </p>
            <Button className="w-full">Start Session</Button>
          </CardContent>
        </Card>
        
        <Card className="border border-primary/10 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-500" />
              Stress Relief
            </CardTitle>
            <CardDescription>Release tension and anxiety</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Guided meditation to help you relax and let go of stress.
            </p>
            <Button className="w-full">Start Session</Button>
          </CardContent>
        </Card>
        
        <Card className="border border-primary/10 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              Energy Boost
            </CardTitle>
            <CardDescription>Uplift your energy and mood</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Energizing meditation to boost your alertness and positivity.
            </p>
            <Button className="w-full">Start Session</Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Your Meditation Journey
          </CardTitle>
          <CardDescription>Track your progress and stay consistent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-4 text-center text-muted-foreground">
            <p>Start your meditation journey to see your progress here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Meditation;
