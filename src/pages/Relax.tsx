
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SoundscapePlayer } from "@/components/audio/SoundscapePlayer";
import { BinauralBeatPlayer } from "@/components/audio/BinauralBeatPlayer";
import { BinauralBeatSequencer } from "@/components/audio/BinauralBeatSequencer";
import { BreathingExercise } from "@/components/breathing/BreathingExercise";
import { useNavigate } from "react-router-dom";
import { Wind, Waves, Brain, Leaf, Clock, LucideIcon, Sparkles } from "lucide-react";

// Define relaxation categories with their respective icons
const relaxationCategories = [
  { name: "Ambient Sounds", icon: Waves, description: "Natural soundscapes to relax your mind", path: "sounds" },
  { name: "Binaural Beats", icon: Brain, description: "Frequency-based audio for brain entrainment", path: "binaural" },
  { name: "Breathing", icon: Wind, description: "Guided breathing exercises for relaxation", path: "breathing" },
  { name: "Meditation", icon: Sparkles, description: "Guided meditation sessions", path: "/app/meditation" },
  { name: "Quick Breaks", icon: Clock, description: "Short relaxation activities for busy schedules", path: "breaks" },
];

const Relax = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sounds");

  return (
    <div className="container space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Relax & Unwind</h1>
        <p className="text-muted-foreground">Tools to help you relax, reduce stress, and find calm</p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {relaxationCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card 
              key={category.name}
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                activeTab === category.path ? "border-primary border-2" : ""
              }`}
              onClick={() => {
                if (category.path.startsWith("/")) {
                  navigate(category.path);
                } else {
                  setActiveTab(category.path);
                }
              }}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsContent value="sounds" className="space-y-4">
          <SoundscapePlayer />
        </TabsContent>

        <TabsContent value="binaural" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <BinauralBeatPlayer />
            <BinauralBeatSequencer />
          </div>
        </TabsContent>

        <TabsContent value="breathing" className="space-y-4">
          <BreathingExercise />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                More Breathing Techniques
              </CardTitle>
              <CardDescription>
                Explore our comprehensive library of breathing exercises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/app/breathing")}>
                View Breathing Library
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breaks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Relaxation Breaks</CardTitle>
              <CardDescription>
                Short activities to reset your mind during a busy day
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">2-Minute Mindfulness</h3>
                    <p className="text-sm text-muted-foreground">
                      A quick mindfulness exercise to center yourself
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">Desk Stretches</h3>
                    <p className="text-sm text-muted-foreground">
                      Simple stretches you can do at your desk
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">Eye Rest</h3>
                    <p className="text-sm text-muted-foreground">
                      Exercises to reduce eye strain from screen time
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">Quick Visualization</h3>
                    <p className="text-sm text-muted-foreground">
                      Brief guided visualization for mental reset
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relax;
