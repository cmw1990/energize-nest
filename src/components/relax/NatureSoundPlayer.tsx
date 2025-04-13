
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAudioGenerator } from "@/hooks/useAudioGenerator";
import { natureSounds } from "@/data/sleepSounds";
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

export const NatureSoundPlayer = () => {
  const { 
    updateNatureSound, 
    updateVolume, 
    settings, 
    natureAudio,
    startNatureSound,
    stopNatureSound
  } = useAudioGenerator();
  
  const [volume, setVolume] = useState(settings.volume);
  const [activeCategory, setActiveCategory] = useState<string>("popular");
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    updateVolume(newVolume);
  };
  
  const handleSoundToggle = (soundType: string) => {
    if (settings.natureSound === soundType) {
      stopNatureSound();
    } else {
      startNatureSound(soundType, volume);
    }
  };
  
  const categories = ["popular", "water", "nature", "sleep", "focus", "all"];
  
  const filteredSounds = activeCategory === "all" 
    ? natureSounds 
    : natureSounds.filter(sound => 
        sound.categories?.includes(activeCategory) || 
        (activeCategory === "popular" && !sound.categories));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nature Sounds</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs 
          defaultValue="popular" 
          value={activeCategory} 
          onValueChange={setActiveCategory}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredSounds.map((sound) => (
            <Card 
              key={sound.type}
              className={`cursor-pointer transition-all hover:shadow-md ${
                settings.natureSound === sound.type ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => handleSoundToggle(sound.type)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center">
                  <sound.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium">{sound.name}</p>
                {settings.natureSound === sound.type && (
                  <span className="text-xs text-primary">Playing</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => stopNatureSound()}
            disabled={!natureAudio?.isPlaying}
          >
            {natureAudio?.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <div className="flex-1">
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-full"
            />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleVolumeChange([volume === 0 ? 0.5 : 0])}
          >
            {volume === 0 ? (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Nature sounds can help mask background noise, promote relaxation, and improve sleep quality.
              Try combining different sounds for a personalized atmosphere.
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
