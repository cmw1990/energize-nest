
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAudioGenerator } from "@/hooks/useAudioGenerator";
import { Headphones, BrainCircuit, CloudFog, Zap, Moon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type BeatPreset = {
  id: string;
  name: string;
  baseFrequency: number;
  beatFrequency: number;
  icon: React.ReactNode;
  description: string;
  effect: string;
};

export const BinauralBeats = () => {
  const { 
    createBinauralBeat, 
    stopBinauralBeat, 
    settings, 
    updateVolume 
  } = useAudioGenerator();
  
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [customBase, setCustomBase] = useState(200);
  const [customBeat, setCustomBeat] = useState(10);
  const [volume, setVolume] = useState(settings.volume * 100);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    // Check if binaural beat is already playing
    if (settings.binaural.enabled) {
      // Try to find matching preset
      const matchingPreset = presets.find(
        p => p.baseFrequency === settings.binaural.baseFrequency && 
             p.beatFrequency === settings.binaural.beatFrequency
      );
      if (matchingPreset) {
        setActivePreset(matchingPreset.id);
      } else {
        setCustomBase(settings.binaural.baseFrequency);
        setCustomBeat(settings.binaural.beatFrequency);
        setActivePreset('custom');
      }
    }
    setVolume(settings.volume * 100);
  }, [settings]);

  const handlePresetSelect = (presetId: string) => {
    if (activePreset === presetId) {
      stopBinauralBeat();
      setActivePreset(null);
      return;
    }

    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      createBinauralBeat(preset.baseFrequency, preset.beatFrequency);
      setActivePreset(presetId);
    } else if (presetId === 'custom') {
      createBinauralBeat(customBase, customBeat);
      setActivePreset('custom');
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(value[0]);
    updateVolume(newVolume);
  };

  const handleCustomBaseChange = (value: number[]) => {
    setCustomBase(value[0]);
    if (activePreset === 'custom') {
      createBinauralBeat(value[0], customBeat);
    }
  };

  const handleCustomBeatChange = (value: number[]) => {
    setCustomBeat(value[0]);
    if (activePreset === 'custom') {
      createBinauralBeat(customBase, value[0]);
    }
  };

  const presets: BeatPreset[] = [
    {
      id: 'delta',
      name: 'Delta (Deep Sleep)',
      baseFrequency: 200,
      beatFrequency: 2,
      icon: <Moon className="h-5 w-5" />,
      description: 'Delta waves (1-4 Hz)',
      effect: 'Deep, dreamless sleep and healing'
    },
    {
      id: 'theta',
      name: 'Theta (Meditation)',
      baseFrequency: 200,
      beatFrequency: 6,
      icon: <CloudFog className="h-5 w-5" />,
      description: 'Theta waves (4-8 Hz)',
      effect: 'Deep relaxation and meditation'
    },
    {
      id: 'alpha',
      name: 'Alpha (Relaxed Focus)',
      baseFrequency: 200,
      beatFrequency: 10,
      icon: <BrainCircuit className="h-5 w-5" />,
      description: 'Alpha waves (8-13 Hz)',
      effect: 'Relaxed focus and creativity'
    },
    {
      id: 'smr',
      name: 'SMR (Focus)',
      baseFrequency: 200,
      beatFrequency: 14,
      icon: <Zap className="h-5 w-5" />,
      description: 'SMR waves (12-15 Hz)',
      effect: 'Calm focus and attention'
    },
    {
      id: 'beta',
      name: 'Beta (Alertness)',
      baseFrequency: 200,
      beatFrequency: 20,
      icon: <Headphones className="h-5 w-5" />,
      description: 'Beta waves (15-30 Hz)',
      effect: 'Alert concentration and cognition'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {presets.map((preset) => (
          <Button
            key={preset.id}
            variant={activePreset === preset.id ? "default" : "outline"}
            className="flex flex-col items-center py-4 gap-2 h-auto"
            onClick={() => handlePresetSelect(preset.id)}
          >
            {preset.icon}
            <span className="text-xs">{preset.name}</span>
          </Button>
        ))}
        <Button
          variant={activePreset === 'custom' ? "default" : "outline"}
          className="flex flex-col items-center py-4 gap-2 h-auto"
          onClick={() => handlePresetSelect('custom')}
        >
          <Headphones className="h-5 w-5" />
          <span className="text-xs">Custom</span>
        </Button>
      </div>

      {activePreset === 'custom' && (
        <div className="space-y-4 border rounded-md p-4 bg-muted/30">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Base Frequency (Hz)</Label>
              <span className="text-sm text-muted-foreground">{customBase} Hz</span>
            </div>
            <Slider
              value={[customBase]}
              min={100}
              max={500}
              step={1}
              onValueChange={handleCustomBaseChange}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Beat Frequency (Hz)</Label>
              <span className="text-sm text-muted-foreground">{customBeat} Hz</span>
            </div>
            <Slider
              value={[customBeat]}
              min={1}
              max={30}
              step={0.5}
              onValueChange={handleCustomBeatChange}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Volume</Label>
          <span className="text-sm text-muted-foreground">{Math.round(volume)}%</span>
        </div>
        <Slider
          value={[volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
        />
      </div>

      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setShowInfo(!showInfo)}
        className="w-full"
      >
        {showInfo ? 'Hide' : 'Show'} Information
      </Button>

      {showInfo && (
        <Card className="bg-muted/30">
          <CardContent className="pt-6 space-y-4">
            <div>
              <h4 className="font-medium mb-1">What are Binaural Beats?</h4>
              <p className="text-sm text-muted-foreground">
                Binaural beats occur when slightly different frequencies are played in each ear, creating a perceived "beat" at the difference between the two frequencies. This can help entrain brainwaves to specific frequency ranges.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Brain Wave Frequencies:</h4>
              <ul className="text-sm space-y-1">
                {presets.map(preset => (
                  <li key={preset.id} className="flex justify-between">
                    <span className="font-medium">{preset.name}:</span> 
                    <span className="text-muted-foreground">{preset.effect}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Note: Headphones are required for binaural beats to work effectively.
            </p>
          </CardContent>
        </Card>
      )}

      {activePreset && (
        <Button 
          variant="destructive" 
          onClick={() => {
            stopBinauralBeat();
            setActivePreset(null);
          }}
          className="w-full"
        >
          Stop Binaural Beat
        </Button>
      )}
    </div>
  );
};
