
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Flower2, Cloud, Zap, Clock } from "lucide-react";
import { BreathingTechniques } from "@/components/breathing/BreathingTechniques";
import { BreathingVisualizer } from "@/components/breathing/BreathingVisualizer";

const Breathing = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Relax & Breathe</h1>
        <div className="flex items-center gap-2 text-primary">
          <Wind className="h-5 w-5" />
          <span className="font-medium">Breathe Easy</span>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flower2 className="h-5 w-5 text-primary" />
              Breathing Techniques
            </CardTitle>
            <CardDescription>Learn different breathing patterns for various benefits</CardDescription>
          </CardHeader>
          <CardContent>
            <BreathingTechniques />
          </CardContent>
        </Card>
        
        <Card className="border border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              Breathing Visualizer
            </CardTitle>
            <CardDescription>Visual guidance for your breathing exercises</CardDescription>
          </CardHeader>
          <CardContent>
            <BreathingVisualizer />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border border-primary/10 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              Energy Breathing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Energizing breathing techniques to increase alertness and focus.
            </p>
            <Button className="w-full">Start Practice</Button>
          </CardContent>
        </Card>
        
        <Card className="border border-primary/10 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-blue-500" />
              Calm Breathing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Calming techniques to reduce stress and anxiety.
            </p>
            <Button className="w-full">Start Practice</Button>
          </CardContent>
        </Card>
        
        <Card className="border border-primary/10 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              Sleep Breathing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Relaxing breathing patterns to help you fall asleep.
            </p>
            <Button className="w-full">Start Practice</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Breathing;
