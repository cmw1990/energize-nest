
import React, { useState, useEffect } from "react";
import { useAudioGenerator } from "@/hooks/useAudioGenerator";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Volume2, Volume1, VolumeX, Play, Pause, Moon, CloudRain, 
  Wind, Waves, Flame, Music, Save, Clock, ListMusic, Timer,
  Settings, Heart, Plus, Trash2, Thermometer, Sparkles, Download, Headphones, CloudSnow
} from "lucide-react";
import { NoiseType, NatureSound } from "@/types/audio";
import { Switch } from "@/components/ui/switch";
import { natureSounds, binauralPresets } from "@/data/sleepSounds";

const WhiteNoise = () => {
  const { 
    playNoise,
    stopNoise,
    isPlaying,
    settings,
    setSettings,
    toggleSound,
    updateNoiseType,
    updateNatureSound,
    updateVolume
  } = useAudioGenerator();

  const { toast } = useToast();
  const [volume, setVolume] = useState(settings.volume);
  const [noiseType, setNoiseType] = useState<NoiseType>(settings.noiseType as NoiseType || 'white');
  const [natureSound, setNatureSound] = useState<NatureSound>(settings.natureSound as NatureSound || 'none');
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [savedPresets, setSavedPresets] = useState<{name: string, noiseType: string, natureSound: string, volume: number}[]>([
    { name: "Deep Focus", noiseType: "brown", natureSound: "rain", volume: 0.6 },
    { name: "Bedtime", noiseType: "pink", natureSound: "night", volume: 0.5 },
    { name: "Meditation", noiseType: "white", natureSound: "ocean", volume: 0.7 }
  ]);
  const [newPresetName, setNewPresetName] = useState("");
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [showBinauralBeats, setShowBinauralBeats] = useState(false);
  const [binauralFrequency, setBinauralFrequency] = useState(5.0);

  useEffect(() => {
    setVolume(settings.volume);
    if (settings.noiseType) {
      setNoiseType(settings.noiseType as NoiseType);
    }
    if (settings.natureSound) {
      setNatureSound(settings.natureSound as NatureSound);
    }
  }, [settings]);

  useEffect(() => {
    if (timerEnabled && timerRemaining > 0 && isPlaying) {
      const id = setTimeout(() => {
        setTimerRemaining(prev => prev - 1);
      }, 1000);
      setTimerId(id);
      
      if (timerRemaining === 1) {
        stopSound();
        toast({
          title: "Timer Completed",
          description: "Sound has been automatically stopped"
        });
      }
      
      return () => clearTimeout(id);
    }
  }, [timerRemaining, timerEnabled, isPlaying]);

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0] / 100;
    setVolume(volumeValue);
    updateVolume(volumeValue);
  };

  const handleNoiseTypeChange = (type: NoiseType) => {
    setNoiseType(type);
    updateNoiseType(type);
    setActivePreset(null);
  };

  const handleNatureSoundChange = (sound: NatureSound | null) => {
    if (sound) {
      setNatureSound(sound);
      updateNatureSound(sound);
    } else {
      setNatureSound('none');
      updateNatureSound('none');
    }
    setActivePreset(null);
  };

  const startTimer = () => {
    if (timerDuration > 0) {
      setTimerEnabled(true);
      setTimerRemaining(timerDuration * 60);
      
      toast({
        title: "Timer Started",
        description: `Sound will stop after ${timerDuration} minutes`
      });
    }
  };

  const cancelTimer = () => {
    setTimerEnabled(false);
    setTimerRemaining(0);
    if (timerId) clearTimeout(timerId);
    
    toast({
      title: "Timer Cancelled",
      description: "Sound timer has been cancelled"
    });
  };

  const togglePlay = () => {
    if (isPlaying && timerEnabled) {
      cancelTimer();
    }
    toggleSound();
  };

  const savePreset = () => {
    if (newPresetName.trim()) {
      const newPreset = {
        name: newPresetName,
        noiseType,
        natureSound,
        volume
      };
      
      setSavedPresets([...savedPresets, newPreset]);
      setNewPresetName("");
      
      toast({
        title: "Preset Saved",
        description: `"${newPresetName}" has been saved to your presets`
      });
    } else {
      toast({
        title: "Name Required",
        description: "Please enter a name for your preset",
        variant: "destructive"
      });
    }
  };

  const loadPreset = (preset: typeof savedPresets[0]) => {
    setNoiseType(preset.noiseType as NoiseType);
    updateNoiseType(preset.noiseType as NoiseType);
    setNatureSound(preset.natureSound as NatureSound);
    updateNatureSound(preset.natureSound as NatureSound);
    setVolume(preset.volume);
    updateVolume(preset.volume);
    setActivePreset(preset.name);
    
    toast({
      title: "Preset Loaded",
      description: `"${preset.name}" has been loaded`
    });
  };

  const deletePreset = (presetName: string) => {
    setSavedPresets(savedPresets.filter(p => p.name !== presetName));
    
    toast({
      title: "Preset Deleted",
      description: `"${presetName}" has been removed from your presets`
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getNatureSoundDisplay = () => {
    const soundObj = natureSounds.find(s => s.type === natureSound);
    return soundObj ? soundObj.name : "None";
  };

  const stopSound = () => {
    stopNoise();
    cancelTimer();
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Sound Machine</CardTitle>
              <CardDescription>
                Generate soothing sounds to help you relax, focus, or sleep.
              </CardDescription>
            </div>
            {isPlaying && timerEnabled && timerRemaining > 0 && (
              <Badge variant="outline" className="px-3 py-1">
                <Timer className="h-3 w-3 mr-1" />
                {formatTime(timerRemaining)}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="sounds" className="space-y-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="sounds">
                <Volume2 className="h-4 w-4 mr-2" />
                Sounds
              </TabsTrigger>
              <TabsTrigger value="nature">
                <CloudRain className="h-4 w-4 mr-2" />
                Nature
              </TabsTrigger>
              <TabsTrigger value="presets">
                <ListMusic className="h-4 w-4 mr-2" />
                Presets
              </TabsTrigger>
              <TabsTrigger value="advanced">
                <Settings className="h-4 w-4 mr-2" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sounds" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Noise Type</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    className={`p-4 border rounded-md cursor-pointer transition-colors ${
                      noiseType === "white" ? "bg-primary/10 border-primary" : ""
                    }`}
                    onClick={() => handleNoiseTypeChange("white")}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <Volume2 className="h-6 w-6 text-primary" />
                      </div>
                      <span className="font-medium">White Noise</span>
                      <span className="text-xs text-muted-foreground">Balanced frequencies</span>
                    </div>
                  </div>
                  
                  <div
                    className={`p-4 border rounded-md cursor-pointer transition-colors ${
                      noiseType === "pink" ? "bg-primary/10 border-primary" : ""
                    }`}
                    onClick={() => handleNoiseTypeChange("pink")}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <Wind className="h-6 w-6 text-primary" />
                      </div>
                      <span className="font-medium">Pink Noise</span>
                      <span className="text-xs text-muted-foreground">Lower frequencies</span>
                    </div>
                  </div>
                  
                  <div
                    className={`p-4 border rounded-md cursor-pointer transition-colors ${
                      noiseType === "brown" ? "bg-primary/10 border-primary" : ""
                    }`}
                    onClick={() => handleNoiseTypeChange("brown")}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <Waves className="h-6 w-6 text-primary" />
                      </div>
                      <span className="font-medium">Brown Noise</span>
                      <span className="text-xs text-muted-foreground">Deeper, richer sound</span>
                    </div>
                  </div>
                </div>
              </div>

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
                    value={[volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="flex-1"
                  />
                  <span className="w-10 text-center">{Math.round(volume * 100)}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Timer</h3>
                <div className="flex items-center gap-4">
                  <Select 
                    value={timerDuration.toString()} 
                    onValueChange={(value) => setTimerDuration(parseInt(value))}
                    disabled={timerEnabled}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="180">3 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {!timerEnabled ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={startTimer}
                      disabled={!isPlaying}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Set Timer
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelTimer}
                      className="bg-destructive/10 hover:bg-destructive/20 text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Sound will automatically stop after the selected duration
                </p>
              </div>
            </TabsContent>

            <TabsContent value="nature" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Nature Sounds</h3>
                  <Badge variant="outline">
                    {natureSound !== 'none' ? getNatureSoundDisplay() : 'None'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {natureSounds.slice(0, 8).map((sound) => (
                    <div
                      key={sound.type}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        natureSound === sound.type ? "bg-primary/10 border-primary" : ""
                      }`}
                      onClick={() => handleNatureSoundChange(sound.type as NatureSound)}
                    >
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <sound.icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium text-sm">{sound.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Select 
                    value={natureSound} 
                    onValueChange={(value) => handleNatureSoundChange(value as NatureSound)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a nature sound" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Nature Sound</SelectItem>
                      {natureSounds.map((sound) => (
                        <SelectItem key={sound.type} value={sound.type}>
                          {sound.name} - {sound.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-4 bg-muted rounded-lg mt-4">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Headphones className="h-4 w-4 text-primary" />
                    Sound Mixing Tips
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Try combining Brown Noise with Rain sounds for deep sleep, or Pink Noise with Forest ambiance for focus.
                    Adjust the volume balance for the perfect atmosphere.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="presets" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Saved Presets</h3>
                <div className="grid gap-3">
                  {savedPresets.map((preset) => (
                    <div 
                      key={preset.name}
                      className={`p-4 border rounded-md ${
                        activePreset === preset.name ? "bg-primary/10 border-primary" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            {preset.natureSound === 'ocean' || preset.natureSound === 'river' ? (
                              <Waves className="h-5 w-5 text-primary" />
                            ) : preset.natureSound === 'rain' ? (
                              <CloudRain className="h-5 w-5 text-primary" />
                            ) : preset.natureSound === 'fire' ? (
                              <Flame className="h-5 w-5 text-primary" />
                            ) : preset.natureSound === 'night' ? (
                              <Moon className="h-5 w-5 text-primary" />
                            ) : preset.noiseType === 'brown' ? (
                              <Volume2 className="h-5 w-5 text-primary" />
                            ) : (
                              <Wind className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {preset.noiseType.charAt(0).toUpperCase() + preset.noiseType.slice(1)} + 
                              {preset.natureSound !== 'none' 
                                ? ` ${preset.natureSound.charAt(0).toUpperCase() + preset.natureSound.slice(1)}` 
                                : ' No nature sound'}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => loadPreset(preset)}
                          >
                            Load
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deletePreset(preset.name)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 mt-2 border-t">
                  <h3 className="text-lg font-medium mb-2">Save Current Settings</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Preset name"
                      value={newPresetName}
                      onChange={(e) => setNewPresetName(e.target.value)}
                    />
                    <Button onClick={savePreset}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-primary" />
                  Recommended Presets
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div className="bg-background p-3 rounded-md">
                    <div className="font-medium text-sm">Deep Focus</div>
                    <div className="text-xs text-muted-foreground">
                      Brown noise + coffee shop ambiance for peak concentration
                    </div>
                  </div>
                  <div className="bg-background p-3 rounded-md">
                    <div className="font-medium text-sm">Sleep Helper</div>
                    <div className="text-xs text-muted-foreground">
                      Pink noise + gentle rain with 8-hour timer
                    </div>
                  </div>
                  <div className="bg-background p-3 rounded-md">
                    <div className="font-medium text-sm">Meditation</div>
                    <div className="text-xs text-muted-foreground">
                      White noise + ocean waves for mindfulness practice
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-medium">Binaural Beats</h3>
                    <p className="text-sm text-muted-foreground">
                      Add frequency-based brain wave entrainment
                    </p>
                  </div>
                  <Switch 
                    checked={showBinauralBeats}
                    onCheckedChange={setShowBinauralBeats}
                  />
                </div>
                
                {showBinauralBeats && (
                  <div className="bg-muted p-4 rounded-lg space-y-4">
                    <div className="space-y-2">
                      <Label>Frequency (Hz)</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          value={[binauralFrequency]}
                          min={0.5}
                          max={20}
                          step={0.5}
                          onValueChange={(value) => setBinauralFrequency(value[0])}
                        />
                        <span className="w-14 text-center">{binauralFrequency.toFixed(1)} Hz</span>
                      </div>
                    </div>
                    
                    <div className="grid gap-3">
                      {binauralPresets.slice(0, 4).map((preset) => (
                        <div key={preset.name} className="flex items-center">
                          <RadioGroupItem 
                            value={preset.frequency.toString()} 
                            id={preset.name}
                            className="mr-2"
                            onClick={() => setBinauralFrequency(preset.frequency)}
                          />
                          <div>
                            <Label htmlFor={preset.name} className="font-medium text-sm">
                              {preset.name} ({preset.frequency} Hz)
                            </Label>
                            <p className="text-xs text-muted-foreground">{preset.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                        <p className="text-xs text-muted-foreground">
                          Binaural beats require headphones to be effective. 
                          Different frequencies entrain different brain states.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Auto-decrease Volume</h3>
                      <p className="text-sm text-muted-foreground">
                        Gradually lower volume over time
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">High-quality Audio</h3>
                      <p className="text-sm text-muted-foreground">
                        Use higher sample rate (uses more battery)
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Background Play</h3>
                      <p className="text-sm text-muted-foreground">
                        Continue playing when app is minimized
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Sound Information</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">White Noise:</span> Equal intensity across frequencies, good for masking all sounds</div>
                    <div><span className="font-medium">Pink Noise:</span> Decreasing energy at higher frequencies, mimics many natural sounds</div>
                    <div><span className="font-medium">Brown Noise:</span> Even less high frequency content, similar to ocean or heavy rain</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center">
            <Button 
              onClick={togglePlay} 
              size="lg"
              className="px-8"
            >
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
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            {isPlaying && (
              <>
                <span className="font-medium">Now playing:</span>{" "}
                {noiseType.charAt(0).toUpperCase() + noiseType.slice(1)} Noise
                {natureSound !== 'none' && ` + ${getNatureSoundDisplay()}`}
              </>
            )}
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Download className="h-3 w-3 mr-1" />
              Premium Sounds
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WhiteNoise;
