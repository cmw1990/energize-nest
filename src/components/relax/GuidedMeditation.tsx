
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipForward, Music, Volume2, VolumeX, Heart, Brain, CloudSun, Moon } from 'lucide-react';
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: number;
  audioUrl: string;
  icon: React.ElementType;
}

export const GuidedMeditation = () => {
  const [selectedCategory, setSelectedCategory] = useState("mindfulness");
  const { toast } = useToast();
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);
  
  const { 
    isPlaying, 
    progress, 
    duration,
    volume,
    isMuted,
    togglePlay, 
    seek,
    toggleMute,
    setVolume
  } = useAudioPlayer({
    audioUrl: selectedMeditation?.audioUrl || '/sounds/meditation-demo.mp3',
    onComplete: () => {
      toast({
        title: "Meditation Complete",
        description: "Your guided meditation session has finished.",
      });
    }
  });

  const meditations: Record<string, Meditation[]> = {
    mindfulness: [
      {
        id: "mind1",
        title: "Present Moment Awareness",
        description: "A gentle meditation focusing on being fully present",
        duration: 10,
        audioUrl: "/sounds/meditation-demo.mp3",
        icon: CloudSun
      },
      {
        id: "mind2",
        title: "Body Scan Meditation",
        description: "Systematically focus attention on different body parts",
        duration: 15,
        audioUrl: "/sounds/meditation-demo.mp3",
        icon: Heart
      },
      {
        id: "mind3",
        title: "Breath Awareness",
        description: "Anchor your attention to the sensations of breathing",
        duration: 8,
        audioUrl: "/sounds/meditation-demo.mp3",
        icon: CloudSun
      }
    ],
    sleep: [
      {
        id: "sleep1",
        title: "Deep Sleep Journey",
        description: "Gentle guidance to help you fall into restful sleep",
        duration: 20,
        audioUrl: "/sounds/meditation-demo.mp3",
        icon: Moon
      },
      {
        id: "sleep2",
        title: "Peaceful Night",
        description: "Release tension and prepare your mind for sleep",
        duration: 30,
        audioUrl: "/sounds/meditation-demo.mp3",
        icon: Moon
      }
    ],
    stress: [
      {
        id: "stress1",
        title: "Stress Release",
        description: "Let go of tension and find your calm center",
        duration: 12,
        audioUrl: "/sounds/meditation-demo.mp3",
        icon: Heart
      },
      {
        id: "stress2",
        title: "Anxiety Relief",
        description: "Gentle guidance to ease worried thoughts",
        duration: 18,
        audioUrl: "/sounds/meditation-demo.mp3",
        icon: Brain
      }
    ],
    focus: [
      {
        id: "focus1",
        title: "Concentration Boost",
        description: "Sharpen your mental focus and attention",
        duration: 10,
        audioUrl: "/sounds/meditation-demo.mp3",
        icon: Brain
      },
      {
        id: "focus2",
        title: "Clarity of Mind",
        description: "Clear mental fog and improve cognitive function",
        duration: 15,
        audioUrl: "/sounds/meditation-demo.mp3",
        icon: CloudSun
      }
    ]
  };

  const handleMeditationSelect = (meditation: Meditation) => {
    if (selectedMeditation?.id === meditation.id && isPlaying) {
      togglePlay();
    } else {
      setSelectedMeditation(meditation);
      setTimeout(() => {
        togglePlay();
      }, 100);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgressTime = () => {
    if (!duration) return "0:00";
    return formatTime((progress / 100) * duration);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="mindfulness" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="mindfulness" className="flex flex-col items-center py-2">
            <CloudSun className="h-4 w-4 mb-1" />
            <span className="text-xs">Mindfulness</span>
          </TabsTrigger>
          <TabsTrigger value="sleep" className="flex flex-col items-center py-2">
            <Moon className="h-4 w-4 mb-1" />
            <span className="text-xs">Sleep</span>
          </TabsTrigger>
          <TabsTrigger value="stress" className="flex flex-col items-center py-2">
            <Heart className="h-4 w-4 mb-1" />
            <span className="text-xs">Stress Relief</span>
          </TabsTrigger>
          <TabsTrigger value="focus" className="flex flex-col items-center py-2">
            <Brain className="h-4 w-4 mb-1" />
            <span className="text-xs">Focus</span>
          </TabsTrigger>
        </TabsList>

        {Object.entries(meditations).map(([category, meditationList]) => (
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meditationList.map(meditation => (
                <Card 
                  key={meditation.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedMeditation?.id === meditation.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleMeditationSelect(meditation)}
                >
                  <CardContent className="p-4 flex items-start">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-4">
                      <meditation.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{meditation.title}</h3>
                      <p className="text-sm text-muted-foreground">{meditation.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground mt-2">
                        <Music className="h-3 w-3 mr-1" />
                        <span>{meditation.duration} minutes</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {selectedMeditation?.id === meditation.id && isPlaying ? (
                        <Pause className="h-6 w-6 text-primary" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedMeditation && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">{selectedMeditation.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {calculateProgressTime()} / {formatTime(duration)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={(value) => seek(value[0])}
                className="w-full"
              />
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-24"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Guided meditation can help reduce stress, improve sleep quality, and increase mindfulness.
            Just 5-10 minutes daily can make a significant difference in your overall well-being.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
