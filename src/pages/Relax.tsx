import React, { useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAudioGenerator } from "@/hooks/useAudioGenerator";
import { BreathingAnimations } from "@/components/breathing/BreathingAnimations";
import { BreathingTechniques } from "@/components/breathing/BreathingTechniques";
import { Wind, Music, Headphones, MessageCircle, Heart, Clock } from "lucide-react";
import { BreathingTechnique } from "@/types/breathing";

// Temporarily create stub components until the real ones are implemented
const GuidedMeditation = () => <div>Guided Meditation Component Coming Soon</div>;
const SoundScapes = () => <div>Sound Scapes Component Coming Soon</div>;
const BinauralBeats = () => <div>Binaural Beats Component Coming Soon</div>;

interface BreathingTechniquesProps {
  onSelectTechnique: (technique: BreathingTechnique) => void;
}

const Relax = () => {
  const [activeTab, setActiveTab] = useState("breathing");
  const { 
    playNoise, 
    playNatureSound, 
    createBinauralBeat, 
    stopAll, 
    isPlaying,
    settings,
    setSettings,
    toggleSound,
    updateNoiseType,
    updateNatureSound,
    updateVolume
  } = useAudioGenerator();
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);

  const handleSelectTechnique = (technique: BreathingTechnique) => {
    setSelectedTechnique(technique);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Relax &amp; Recharge</CardTitle>
            <CardDescription>
              Find your inner peace with our relaxation tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="breathing">Breathing</TabsTrigger>
                <TabsTrigger value="meditation">Meditation</TabsTrigger>
                <TabsTrigger value="sounds">Sounds</TabsTrigger>
              </TabsList>
              
              <TabsContent value="breathing">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-muted/50">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <BreathingAnimations technique={selectedTechnique} />
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle>Breathing Techniques</CardTitle>
                      <CardDescription>
                        Select a technique to start your breathing exercise
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <BreathingTechniques onSelectTechnique={handleSelectTechnique} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="meditation">
                <Card className="bg-muted/50">
                  <CardContent className="p-6">
                    <GuidedMeditation />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sounds">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle>Soundscapes</CardTitle>
                      <CardDescription>
                        Immerse yourself in calming soundscapes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SoundScapes />
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle>Binaural Beats</CardTitle>
                      <CardDescription>
                        Experience the power of binaural beats
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <BinauralBeats />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Relax;
