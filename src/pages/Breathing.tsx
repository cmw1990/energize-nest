import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wind, Flower2, Cloud, Zap, Clock, MountainSnow, Waves, Brain, Heart } from "lucide-react";
import { BreathingTechniques, BreathingTechnique } from "@/components/breathing/BreathingTechniques";
import { BreathingVisualizer } from "@/components/breathing/BreathingVisualizer";
import { useNavigate } from "react-router-dom";

const Breathing = () => {
  const navigate = useNavigate();
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  
  const handleSelectTechnique = (technique: BreathingTechnique) => {
    setSelectedTechnique(technique);
    // You can add additional handling here if needed
  };
  
  const ambienceOptions = [
    { id: 'forest', name: 'Forest Sounds', icon: MountainSnow, color: 'text-green-500' },
    { id: 'ocean', name: 'Ocean Waves', icon: Waves, color: 'text-blue-500' },
    { id: 'rain', name: 'Rainfall', icon: Cloud, color: 'text-sky-500' },
  ];
  
  const breathingCards = [
    {
      title: "Energy Breathing",
      icon: Zap,
      color: "text-orange-500",
      description: "Energizing breathing techniques to increase alertness and focus.",
      action: () => navigate("/app/breathing?type=energy"),
    },
    {
      title: "Calm Breathing",
      icon: Wind,
      color: "text-blue-500",
      description: "Calming techniques to reduce stress and anxiety.",
      action: () => navigate("/app/breathing?type=calm"),
    },
    {
      title: "Sleep Breathing",
      icon: Clock,
      color: "text-purple-500",
      description: "Relaxing breathing patterns to help you fall asleep.",
      action: () => navigate("/app/breathing?type=sleep"),
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Relax & Breathe</h1>
        <div className="flex items-center gap-2 text-primary">
          <Wind className="h-5 w-5" />
          <span className="font-medium">Breathe Easy</span>
        </div>
      </div>
      
      <Tabs defaultValue="techniques" className="space-y-6">
        <TabsList className="grid grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="techniques" className="flex items-center gap-2">
            <Flower2 className="h-4 w-4" />
            <span>Techniques</span>
          </TabsTrigger>
          <TabsTrigger value="visualizer" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            <span>Visualizer</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="techniques" className="space-y-6">
          <BreathingTechniques onSelectTechnique={handleSelectTechnique} />
        </TabsContent>
        
        <TabsContent value="visualizer" className="space-y-6">
          <BreathingVisualizer />
        </TabsContent>
      </Tabs>
      
      {/* Quick access breathing practices */}
      <div className="grid gap-6 md:grid-cols-3">
        {breathingCards.map((card) => (
          <Card 
            key={card.title}
            className="border border-primary/10 hover:shadow-md transition-shadow cursor-pointer"
            onClick={card.action}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <card.icon className={`h-5 w-5 ${card.color}`} />
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {card.description}
              </p>
              <Button className="w-full">Start Practice</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Ambient sounds section */}
      <Card className="border border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-primary" />
            Ambient Sounds
          </CardTitle>
          <CardDescription>
            Natural soundscapes to enhance your breathing practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ambienceOptions.map((option) => (
              <Card key={option.id} className="bg-muted hover:bg-muted/80 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="rounded-full bg-background/50 p-3">
                    <option.icon className={`h-5 w-5 ${option.color}`} />
                  </div>
                  <div>
                    <h3 className="font-medium">{option.name}</h3>
                    <Button variant="link" className="p-0 h-auto">Play</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Benefits section */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-none">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Improved Mental Clarity</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Regular breathing exercises enhance cognitive function and mental focus.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <h3 className="font-medium">Lower Blood Pressure</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Deep breathing can reduce blood pressure and improve cardiovascular health.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Stress Reduction</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Activates the parasympathetic nervous system, reducing stress hormones.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <h3 className="font-medium">Increased Energy</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Proper breathing delivers more oxygen to your cells, boosting energy levels.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Breathing;
