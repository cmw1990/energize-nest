
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { binauralPresets } from '@/data/sleepSounds';
import { Brain, Play, Pause, Volume2, ArrowRight, Info } from 'lucide-react';
import { generateBinauralBeat } from '@/utils/audio/binauralBeatGenerator';
import { useToast } from '@/hooks/use-toast';

// We'll ignore TypeScript errors for now as instructed and focus on functionality
export const BinauralBeatPlayer = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [baseFrequency, setBaseFrequency] = useState(200);
  const [beatFrequency, setBeatFrequency] = useState(6.0);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [binauralPlayer, setBinauralPlayer] = useState<any>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (binauralPlayer) {
        binauralPlayer.stop();
      }
    };
  }, [binauralPlayer]);

  const togglePlay = () => {
    if (isPlaying && binauralPlayer) {
      binauralPlayer.stop();
      setBinauralPlayer(null);
      setIsPlaying(false);
    } else {
      try {
        const player = generateBinauralBeat(baseFrequency, beatFrequency, volume);
        setBinauralPlayer(player);
        setIsPlaying(true);
        
        toast({
          title: "Binaural Beat Started",
          description: `Playing ${beatFrequency}Hz binaural beat`
        });
      } catch (err) {
        console.error("Error starting binaural beat:", err);
        toast({
          title: "Playback Error",
          description: "Could not start binaural beat playback",
          variant: "destructive"
        });
      }
    }
  };

  const applyPreset = (presetName: string, frequency: number) => {
    setBeatFrequency(frequency);
    setActivePreset(presetName);
    
    // If already playing, update the frequency
    if (isPlaying && binauralPlayer) {
      binauralPlayer.setFrequencies(baseFrequency, frequency);
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value / 100);
    if (binauralPlayer) {
      binauralPlayer.setVolume(value / 100);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Binaural Beat Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button 
                onClick={togglePlay} 
                size="icon" 
                className="rounded-full w-12 h-12"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
              </Button>
              <div>
                <h3 className="font-medium">{activePreset || "Custom Beat"}</h3>
                <p className="text-sm text-muted-foreground">
                  {isPlaying ? `Playing ${beatFrequency}Hz beat` : "Click to play"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-1/3">
              <Button variant="ghost" size="icon" className="opacity-50">
                <Volume2 className="h-4 w-4" />
              </Button>
              <Slider
                value={[volume * 100]}
                onValueChange={values => handleVolumeChange(values[0])}
                max={100}
                step={1}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Beat Frequency: {beatFrequency} Hz</span>
            </div>
            <Slider
              value={[beatFrequency]}
              onValueChange={values => {
                setBeatFrequency(values[0]);
                setActivePreset(null);
                if (isPlaying && binauralPlayer) {
                  binauralPlayer.setFrequencies(baseFrequency, values[0]);
                }
              }}
              min={1}
              max={30}
              step={0.1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Deep Sleep (1-4Hz)</span>
              <span>Relaxation (4-8Hz)</span>
              <span>Focus (8-30Hz)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-2">
            {binauralPresets.map(preset => (
              <Button
                key={preset.name}
                variant={activePreset === preset.name ? "default" : "outline"}
                size="sm"
                className="justify-start h-auto py-2"
                onClick={() => applyPreset(preset.name, preset.frequency)}
              >
                <div className="flex flex-col items-start text-left">
                  <span>{preset.name}</span>
                  <span className="text-xs opacity-70">{preset.frequency}Hz</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium">What are binaural beats?</h4>
              <p className="text-sm text-muted-foreground">
                Binaural beats are auditory illusions created when two slightly different frequencies are played in each ear, 
                potentially influencing brainwave states for relaxation or focus.
              </p>
              <p className="text-xs text-muted-foreground">
                Best experienced with headphones.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
