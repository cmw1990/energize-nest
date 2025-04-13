
import React, { useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAudioGenerator } from "@/hooks/useAudioGenerator";
import { BreathingAnimations } from "@/components/breathing/BreathingAnimations";
import { BreathingTechniques } from "@/components/breathing/BreathingTechniques";
import { SoundScapes } from "@/components/relax/SoundScapes";
import { BinauralBeats } from "@/components/relax/BinauralBeats";
import { GuidedMeditation } from "@/components/relax/GuidedMeditation";
import { Wind, Music, Headphones, MessageCircle, Heart, Clock, Brain, Moon } from "lucide-react";
import { BreathingTechnique } from "@/types/breathing";
import { MetricCard } from "@/components/ui/metric-card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const Relax = () => {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("breathing");
  const { 
    stopAll, 
    isPlaying,
  } = useAudioGenerator();
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);

  const handleSelectTechnique = (technique: BreathingTechnique) => {
    setSelectedTechnique(technique);
  };

  // Get relaxation stats
  const { data: relaxStats } = useQuery({
    queryKey: ["relaxation-stats", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      try {
        // Get meditation minutes
        const { data: meditationData, error: meditationError } = await supabase
          .from("meditation_logs")
          .select("duration_minutes")
          .eq("user_id", session.user.id);
        
        if (meditationError) throw meditationError;
        
        // Get breathing session count
        const { data: breathingData, error: breathingError } = await supabase
          .from("breathing_sessions")
          .select("id")
          .eq("user_id", session.user.id);
        
        if (breathingError) throw breathingError;
        
        // Calculate total meditation time
        const totalMeditationMinutes = meditationData.reduce(
          (sum, log) => sum + (log.duration_minutes || 0), 
          0
        );
        
        return {
          totalMeditationMinutes,
          breathingSessionCount: breathingData.length,
          lastActivity: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Error fetching relaxation stats:", error);
        // Return some reasonable defaults if there are no records yet
        return {
          totalMeditationMinutes: 0,
          breathingSessionCount: 0,
          lastActivity: null,
        };
      }
    },
    enabled: !!session?.user?.id,
  });

  // Clean up on tab change
  const handleTabChange = (value: string) => {
    if (value !== activeTab && isPlaying) {
      stopAll();
    }
    setActiveTab(value);
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
            {session?.user?.id && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <MetricCard
                  icon={<Clock className="h-4 w-4" />}
                  title="Meditation Time"
                  value={`${relaxStats?.totalMeditationMinutes || 0} min`}
                  description="Total minutes spent meditating"
                />
                <MetricCard
                  icon={<Wind className="h-4 w-4" />}
                  title="Breathing Sessions"
                  value={relaxStats?.breathingSessionCount || 0}
                  description="Completed breathing exercises"
                />
                <MetricCard
                  icon={<Brain className="h-4 w-4" />}
                  title="Last Activity"
                  value={relaxStats?.lastActivity ? new Date(relaxStats.lastActivity).toLocaleDateString() : 'None'}
                  description="Your most recent session"
                />
              </div>
            )}
            
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="breathing" className="flex items-center gap-2">
                  <Wind className="h-4 w-4" />
                  <span>Breathing</span>
                </TabsTrigger>
                <TabsTrigger value="meditation" className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  <span>Meditation</span>
                </TabsTrigger>
                <TabsTrigger value="sounds" className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  <span>Sounds</span>
                </TabsTrigger>
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
                  <CardHeader>
                    <CardTitle>Guided Meditation</CardTitle>
                    <CardDescription>
                      Find peace with guided meditation sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
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
                    <CardContent className="p-4">
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
                    <CardContent className="p-4">
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
