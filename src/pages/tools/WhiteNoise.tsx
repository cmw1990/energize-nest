import React, { useState, useEffect } from "react";
import { useAudioGenerator } from "@/hooks/useAudioGenerator";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, Volume1, VolumeX, Play, Pause } from "lucide-react";

const WhiteNoise = () => {
  const { 
    playNoise,
    playNatureSound,
    stopAll,
    isPlaying,
    settings,
    setSettings,
    toggleSound,
    updateNoiseType,
    updateNatureSound,
    updateVolume
  } = useAudioGenerator();

  const [volume, setVolume] = useState(settings.volume);
  const [noiseType, setNoiseType] = useState(settings.noiseType);
  const [natureSound, setNatureSound] = useState(settings.natureSound);

  useEffect(() => {
    setVolume(settings.volume);
    setNoiseType(settings.noiseType);
    setNatureSound(settings.natureSound);
  }, [settings]);

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0] / 100;
    setVolume(volumeValue);
    updateVolume(volumeValue);
  };

  const handleNoiseTypeChange = (type: string) => {
    setNoiseType(type);
    updateNoiseType(type);
  };

  const handleNatureSoundChange = (sound: string | null) => {
    setNatureSound(sound);
    updateNatureSound(sound);
  };

  const togglePlay = () => {
    toggleSound();
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>White Noise Generator</CardTitle>
          <CardDescription>
            Generate soothing sounds to help you relax, focus, or sleep.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Volume</h3>
            <div className="flex items-center space-x-2">
              {volume === 0 ? (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              ) : volume < 0.5 ? (
                <Volume1 className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              )}
              <Slider
                defaultValue={[volume * 100]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>

          <Tabs defaultValue={noiseType} className="space-y-4">
            <TabsList>
              <TabsTrigger value="white">White Noise</TabsTrigger>
              <TabsTrigger value="pink">Pink Noise</TabsTrigger>
              <TabsTrigger value="brown">Brown Noise</TabsTrigger>
            </TabsList>
            <TabsContent value="white">
              <p>White noise is a constant background noise that masks other sounds.</p>
              <Button onClick={() => handleNoiseTypeChange("white")}>
                Set White Noise
              </Button>
            </TabsContent>
            <TabsContent value="pink">
              <p>Pink noise is similar to white noise but with lower frequencies emphasized.</p>
              <Button onClick={() => handleNoiseTypeChange("pink")}>
                Set Pink Noise
              </Button>
            </TabsContent>
            <TabsContent value="brown">
              <p>Brown noise has even stronger emphasis on lower frequencies, creating a deeper sound.</p>
              <Button onClick={() => handleNoiseTypeChange("brown")}>
                Set Brown Noise
              </Button>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Nature Sounds</h3>
            <p>Select a nature sound to add to the background.</p>
            <Button onClick={() => handleNatureSoundChange("rain")}>
              Set Rain Sound
            </Button>
            <Button onClick={() => handleNatureSoundChange("forest")}>
              Set Forest Sound
            </Button>
            <Button onClick={() => handleNatureSoundChange(null)}>
              Remove Nature Sound
            </Button>
          </div>

          <Button onClick={togglePlay}>
            {isPlaying ? (
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
        </CardContent>
      </Card>
    </div>
  );
};

export default WhiteNoise;
