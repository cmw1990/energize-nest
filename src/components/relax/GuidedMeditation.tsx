
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Play, Pause, Volume2, VolumeX, Heart, Clock, Download } from 'lucide-react';

const meditations = [
  {
    id: "mindful",
    title: "Mindful Breathing",
    duration: "10 min",
    description: "Focus on your breath to anchor yourself in the present moment",
    category: "beginner",
    audioUrl: "/meditation/mindful-breathing.mp3"
  },
  {
    id: "body-scan",
    title: "Body Scan",
    duration: "15 min",
    description: "Bring awareness to each part of your body to release tension",
    category: "beginner",
    audioUrl: "/meditation/body-scan.mp3"
  },
  {
    id: "loving-kindness",
    title: "Loving Kindness",
    duration: "12 min",
    description: "Cultivate feelings of goodwill toward yourself and others",
    category: "intermediate",
    audioUrl: "/meditation/loving-kindness.mp3"
  },
  {
    id: "stress",
    title: "Stress Reduction",
    duration: "18 min",
    description: "Let go of stress and find a calmer state of mind",
    category: "intermediate",
    audioUrl: "/meditation/stress-reduction.mp3"
  },
  {
    id: "sleep",
    title: "Sleep Meditation",
    duration: "20 min",
    description: "Gently guide your mind toward restful sleep",
    category: "beginner",
    audioUrl: "/meditation/sleep.mp3"
  },
  {
    id: "focus",
    title: "Focus Enhancement",
    duration: "10 min",
    description: "Sharpen your attention and mental clarity",
    category: "advanced",
    audioUrl: "/meditation/focus.mp3"
  }
];

export const GuidedMeditation = () => {
  const [activeCategory, setActiveCategory] = useState("beginner");
  const [selectedMeditation, setSelectedMeditation] = useState(meditations[0]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const audioPlayer = useAudioPlayer({
    audioUrl: selectedMeditation.audioUrl,
    onComplete: () => {
      console.log("Meditation completed");
    }
  });
  
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };
  
  const filteredMeditations = meditations.filter(
    med => activeCategory === "favorites" 
      ? favorites.includes(med.id) 
      : med.category === activeCategory
  );
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleSelectMeditation = (meditation: typeof meditations[0]) => {
    if (selectedMeditation.id === meditation.id && audioPlayer.isPlaying) {
      audioPlayer.togglePlay();
    } else {
      setSelectedMeditation(meditation);
      if (audioPlayer.isPlaying) {
        audioPlayer.togglePlay();
      }
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="beginner" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-4 gap-2">
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeditations.length > 0 ? (
          filteredMeditations.map((meditation) => (
            <Card 
              key={meditation.id} 
              className={`cursor-pointer transition-all hover:shadow ${
                selectedMeditation.id === meditation.id ? 'border-primary' : ''
              }`}
              onClick={() => handleSelectMeditation(meditation)}
            >
              <CardContent className="p-4 flex justify-between items-center">
                <div className="space-y-1">
                  <div className="font-medium">{meditation.title}</div>
                  <div className="text-xs text-muted-foreground">{meditation.duration}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(meditation.id);
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        favorites.includes(meditation.id) 
                          ? 'fill-primary text-primary' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  </Button>
                  {selectedMeditation.id === meditation.id && audioPlayer.isPlaying ? (
                    <Pause className="h-4 w-4 text-primary" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-4 text-muted-foreground">
            No favorites added yet. Click the heart icon to add meditations to your favorites.
          </div>
        )}
      </div>
      
      <div className="pt-4 space-y-4 border-t">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-md flex items-center justify-center shrink-0">
            <Play className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="font-medium">{selectedMeditation.title}</h3>
            <p className="text-sm text-muted-foreground">{selectedMeditation.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{selectedMeditation.duration}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={audioPlayer.togglePlay}
            className="w-32"
          >
            {audioPlayer.isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Play
              </>
            )}
          </Button>
          
          <div className="flex items-center gap-2 flex-1">
            <Button variant="ghost" size="icon" onClick={audioPlayer.toggleMute}>
              {audioPlayer.isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[audioPlayer.volume * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => audioPlayer.setVolume(value[0] / 100)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Slider
            value={[audioPlayer.progress]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={(value) => audioPlayer.seek(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(audioPlayer.duration * (audioPlayer.progress / 100))}</span>
            <span>{formatTime(audioPlayer.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
