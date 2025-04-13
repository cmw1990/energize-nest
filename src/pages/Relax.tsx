
import React, { useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BinauralBeats } from "@/components/relax/BinauralBeats";
import { BreathingExercises } from "@/components/relax/BreathingExercises";
import { GuidedMeditation } from "@/components/relax/GuidedMeditation";
import { AudioGeneratorProvider } from "@/hooks/useAudioGenerator";
import { NatureSoundPlayer } from "@/components/relax/NatureSoundPlayer";
import { NoiseGenerator } from "@/components/relax/NoiseGenerator";
import { RelaxationTimer } from "@/components/relax/RelaxationTimer";

import { 
  Music, 
  Waves, 
  Brain, 
  Wind, 
  Timer,
  SlidersHorizontal 
} from "lucide-react";

const Relax = () => {
  const [activeTab, setActiveTab] = useState("breathing");

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <AudioGeneratorProvider>
        <div className="container mx-auto p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Relaxation Studio</h1>
              <p className="text-muted-foreground">
                Unwind with powerful sound therapy and relaxation techniques
              </p>
            </div>
          </div>

          <Tabs 
            defaultValue="breathing" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
              <TabsTrigger value="breathing" className="flex flex-col py-3 px-2 h-auto">
                <Wind className="h-4 w-4 mb-1" />
                <span className="text-xs">Breathing</span>
              </TabsTrigger>
              <TabsTrigger value="nature" className="flex flex-col py-3 px-2 h-auto">
                <Waves className="h-4 w-4 mb-1" />
                <span className="text-xs">Nature Sounds</span>
              </TabsTrigger>
              <TabsTrigger value="noise" className="flex flex-col py-3 px-2 h-auto">
                <SlidersHorizontal className="h-4 w-4 mb-1" />
                <span className="text-xs">Noise</span>
              </TabsTrigger>
              <TabsTrigger value="binaural" className="flex flex-col py-3 px-2 h-auto">
                <Brain className="h-4 w-4 mb-1" />
                <span className="text-xs">Binaural Beats</span>
              </TabsTrigger>
              <TabsTrigger value="meditation" className="flex flex-col py-3 px-2 h-auto">
                <Music className="h-4 w-4 mb-1" />
                <span className="text-xs">Meditation</span>
              </TabsTrigger>
              <TabsTrigger value="timer" className="flex flex-col py-3 px-2 h-auto">
                <Timer className="h-4 w-4 mb-1" />
                <span className="text-xs">Timer</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="breathing">
              <Card>
                <CardHeader>
                  <CardTitle>Breathing Exercises</CardTitle>
                </CardHeader>
                <CardContent>
                  <BreathingExercises />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nature">
              <NatureSoundPlayer />
            </TabsContent>

            <TabsContent value="noise">
              <NoiseGenerator />
            </TabsContent>

            <TabsContent value="binaural">
              <Card>
                <CardHeader>
                  <CardTitle>Binaural Beats</CardTitle>
                </CardHeader>
                <CardContent>
                  <BinauralBeats />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="meditation">
              <Card>
                <CardHeader>
                  <CardTitle>Guided Meditation</CardTitle>
                </CardHeader>
                <CardContent>
                  <GuidedMeditation />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timer">
              <RelaxationTimer />
            </TabsContent>
          </Tabs>

          <Card className="bg-primary/5 border-primary/30">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Your Relaxation Center</h3>
              <p className="text-sm text-muted-foreground">
                Combine different techniques for a personalized relaxation experience. 
                Try nature sounds with breathing exercises, or binaural beats during meditation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    For Focus
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pink noise + Alpha binaural beats (8-12 Hz)
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Wind className="h-4 w-4 text-primary" />
                    For Sleep
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Rain sounds + Delta binaural beats (1-4 Hz)
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Waves className="h-4 w-4 text-primary" />
                    For Calm
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ocean waves + 4-7-8 breathing technique
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AudioGeneratorProvider>
    </div>
  );
};

export default Relax;
