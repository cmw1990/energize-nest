
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GuidedMeditation } from "@/components/relax/GuidedMeditation";
import { SoundscapePlayer } from "@/components/relax/SoundscapePlayer";
import { BinauralBeatPlayer } from "@/components/relax/BinauralBeatPlayer";
import { SmartBreakSuggestions } from "@/components/focus/SmartBreakSuggestions";
import { Flower2, Wind, Brain, Cloud, Music, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Relax = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Relax & Unwind</h1>
        <div className="flex items-center gap-2 text-primary">
          <Flower2 className="h-5 w-5" />
          <span className="font-medium">Mindfulness Center</span>
        </div>
      </div>
      
      {/* Quick Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-white/80 dark:bg-white/10 rounded-full p-3">
                <Wind className="h-5 w-5 text-indigo-500" />
              </div>
              <h3 className="font-medium">Breathing Exercises</h3>
              <p className="text-sm text-muted-foreground">
                Guided breathing techniques for relaxation
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/app/breathing")}
              >
                Start Breathing
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-white/80 dark:bg-white/10 rounded-full p-3">
                <Brain className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-medium">Meditation</h3>
              <p className="text-sm text-muted-foreground">
                Guided sessions for mindfulness practice
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/app/meditation")}
              >
                Begin Session
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-white/80 dark:bg-white/10 rounded-full p-3">
                <Music className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-medium">Nature Sounds</h3>
              <p className="text-sm text-muted-foreground">
                Ambient soundscapes to create calm
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById('soundscape')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Play Sounds
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card id="soundscape" className="border border-primary/10 scroll-mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-primary" />
                Ambient Sounds
              </CardTitle>
              <CardDescription>Create a custom blend of calming sounds</CardDescription>
            </CardHeader>
            <CardContent>
              <SoundscapePlayer />
            </CardContent>
          </Card>
          
          <Card id="binaural" className="border border-primary/10 scroll-mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Brain Entrainment
              </CardTitle>
              <CardDescription>Use binaural beats to influence brainwave states</CardDescription>
            </CardHeader>
            <CardContent>
              <BinauralBeatPlayer />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card id="meditation" className="border border-primary/10 scroll-mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flower2 className="h-5 w-5 text-primary" />
                Guided Sessions
              </CardTitle>
              <CardDescription>Follow guided meditations for mindfulness</CardDescription>
            </CardHeader>
            <CardContent>
              <GuidedMeditation />
            </CardContent>
          </Card>
          
          <Card id="breaks" className="border border-primary/10 scroll-mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-primary" />
                Mindful Breaks
              </CardTitle>
              <CardDescription>Take strategic breaks to refresh your mind</CardDescription>
            </CardHeader>
            <CardContent>
              <SmartBreakSuggestions />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate("/app/breathing")}
        >
          <Wind className="h-4 w-4" />
          Breathing Techniques
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate("/app/meditation")}
        >
          <Flower2 className="h-4 w-4" />
          Meditation Library
        </Button>
      </div>
    </div>
  );
};

export default Relax;
