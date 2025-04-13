
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Timer, 
  Heart, 
  Brain, 
  Sparkles, 
  Moon
} from 'lucide-react';

type Meditation = {
  id: string;
  title: string;
  duration: number; // in minutes
  category: string;
  description: string;
  imageUrl: string;
  icon: React.ReactNode;
};

const meditations: Meditation[] = [
  {
    id: 'mind-1',
    title: 'Mindfulness Basics',
    duration: 10,
    category: 'mindfulness',
    description: 'A simple introduction to mindfulness meditation techniques',
    imageUrl: '/images/meditation-1.jpg',
    icon: <Brain className="h-4 w-4" />
  },
  {
    id: 'sleep-1',
    title: 'Deep Sleep Journey',
    duration: 20,
    category: 'sleep',
    description: 'Gentle guidance into deep and restful sleep',
    imageUrl: '/images/meditation-2.jpg',
    icon: <Moon className="h-4 w-4" />
  },
  {
    id: 'relax-1',
    title: 'Anxiety Relief',
    duration: 15,
    category: 'relaxation',
    description: 'Calm your mind and release tension and worry',
    imageUrl: '/images/meditation-3.jpg',
    icon: <Sparkles className="h-4 w-4" />
  },
  {
    id: 'grat-1',
    title: 'Gratitude Practice',
    duration: 8,
    category: 'gratitude',
    description: 'Cultivate appreciation and positive outlook',
    imageUrl: '/images/meditation-4.jpg',
    icon: <Heart className="h-4 w-4" />
  }
];

export const GuidedMeditation = () => {
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  const togglePlay = () => {
    if (!selectedMeditation) {
      setSelectedMeditation(meditations[0]);
    }
    setIsPlaying(!isPlaying);
  };
  
  const selectMeditation = (meditation: Meditation) => {
    setSelectedMeditation(meditation);
    setCurrentTime(0);
    setIsPlaying(true);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="space-y-6">
      {selectedMeditation ? (
        <div className="space-y-4">
          <div className="relative h-48 rounded-lg overflow-hidden bg-gradient-to-r from-primary/30 to-primary/5 flex items-end">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            <div className="relative p-4 space-y-1">
              <Badge variant="outline" className="mb-1">
                {selectedMeditation.category}
              </Badge>
              <h3 className="text-xl font-semibold">{selectedMeditation.title}</h3>
              <p className="text-sm text-muted-foreground">{selectedMeditation.description}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(selectedMeditation.duration * 60)}</span>
            </div>
            <div className="h-1 w-full bg-muted overflow-hidden rounded-full">
              <div 
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${(currentTime / (selectedMeditation.duration * 60)) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon">
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button onClick={togglePlay} size="lg" className="rounded-full w-14 h-14">
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>
            
            <Button variant="outline" size="icon">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-between">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Volume2 className="h-4 w-4 mr-1" />
              Audio
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Timer className="h-4 w-4 mr-1" />
              Timer
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={togglePlay} className="w-full">
          <Play className="h-4 w-4 mr-2" />
          Start Guided Meditation
        </Button>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {meditations.map((meditation) => (
          <Card
            key={meditation.id}
            className={`cursor-pointer transition-all ${
              selectedMeditation?.id === meditation.id ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => selectMeditation(meditation)}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                {meditation.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{meditation.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{meditation.duration} min</span>
                  <span>•</span>
                  <span className="capitalize">{meditation.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
