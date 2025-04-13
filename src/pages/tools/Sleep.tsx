import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "react-router-dom"
import { useAudioGenerator } from "@/hooks/useAudioGenerator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  AlarmClock, 
  Clock, 
  Moon, 
  Volume2, 
  VolumeX, 
  Waves, 
  Activity, 
  Brain, 
  BedDouble,
  CloudRain,
  Waves as WavesIcon,
  Wind,
  Flame,
  Sparkles,
  Volume as VolumeIcon
} from "lucide-react"

interface AudioUtils {
  playSound: (type: string, volume: number) => void;
  stopSound: (type: string) => void;
  setFrequency?: (value: number) => void;
  isPlaying?: boolean;
}

export default function Sleep() {
  const { 
    isPlaying,
    settings,
    playNoise,
    stopNoise,
    playNature,
    stopNature,
    toggleSound,
    updateNoiseType,
    updateNatureSound,
    updateVolume
  } = useAudioGenerator();
  
  const [binauralFrequency, setBinauralFrequency] = React.useState(6);
  const [binauralVolume, setBinauralVolume] = React.useState(0.5);
  const [natureVolume, setNatureVolume] = React.useState(0.5);
  
  const [binauralAudio, setBinauralAudio] = React.useState<AudioUtils | null>(null);
  const [natureAudio, setNatureAudio] = React.useState<AudioUtils | null>(null);
  
  const startBinauralBeat = (baseFreq: number, targetFreq: number, volume: number) => {
    const audio: AudioUtils = {
      playSound: (type, vol) => console.log(`Playing ${type} at volume ${vol}`),
      stopSound: (type) => console.log(`Stopping ${type}`),
      setFrequency: (value) => console.log(`Setting frequency to ${value}`),
      isPlaying: true
    };
    
    setBinauralAudio(audio);
    console.log(`Started binaural beat: base=${baseFreq}, target=${targetFreq}, volume=${volume}`);
  };
  
  const stopBinauralBeat = () => {
    if (binauralAudio) {
      binauralAudio.stopSound('binaural');
      setBinauralAudio(null);
    }
  };
  
  const startNatureSound = (type: string, volume: number) => {
    const audio: AudioUtils = {
      playSound: (t, vol) => console.log(`Playing ${t} at volume ${vol}`),
      stopSound: (t) => console.log(`Stopping ${t}`),
      isPlaying: true,
      type: type
    };
    
    setNatureAudio(audio);
    console.log(`Started nature sound: type=${type}, volume=${volume}`);
  };
  
  const stopNatureSound = () => {
    if (natureAudio) {
      natureAudio.stopSound('nature');
      setNatureAudio(null);
    }
  };
  
  const stopAllAudio = () => {
    stopBinauralBeat();
    stopNatureSound();
  };
  
  const handleBinauralFrequencyChange = (value: number[]) => {
    const frequency = value[0];
    setBinauralFrequency(frequency);
    
    if (binauralAudio && binauralAudio.setFrequency) {
      binauralAudio.setFrequency(frequency);
    }
  };
  
  const handleBinauralVolumeChange = (value: number[]) => {
    const volume = value[0];
    setBinauralVolume(volume);
    
    if (binauralAudio) {
      binauralAudio.playSound('binaural', volume);
    }
  };
  
  const handleNatureVolumeChange = (value: number[]) => {
    const volume = value[0];
    setNatureVolume(volume);
    
    if (natureAudio) {
      natureAudio.playSound('nature', volume);
    }
  };
  
  const toggleBinauralBeat = () => {
    if (binauralAudio?.isPlaying) {
      stopBinauralBeat();
    } else {
      startBinauralBeat(256, binauralFrequency, binauralVolume);
    }
  };
  
  const playNatureSound = (type: string) => {
    if (natureAudio?.isPlaying) {
      stopNatureSound();
    }
    
    if (!natureAudio?.isPlaying || type !== natureAudio.type) {
      startNatureSound(type, natureVolume);
    }
  };
  
  React.useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);
  
  return (
    <ToolAnalyticsWrapper 
      toolName="sleep-tools"
      toolType="sleep"
      toolSettings={{}}
    >
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container mx-auto p-4 space-y-6">
          <div
            className="flex flex-col opacity-100 transform translate-y-0 transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Sleep Optimization</h1>
              <Link to="/app/sleep-tracking">
                <Button variant="outline" className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4" />
                  Track Sleep
                </Button>
              </Link>
            </div>
          </div>
          
          <Tabs defaultValue="sound" className="space-y-4">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="sound" className="flex items-center gap-2">
                <Waves className="h-4 w-4" />
                <span>Sleep Sounds</span>
              </TabsTrigger>
              <TabsTrigger value="binaural" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>Binaural Beats</span>
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span>Sleep Tips</span>
              </TabsTrigger>
            </TabsList>
          
            <TabsContent value="sound">
              <Card className="border border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="h-5 w-5 text-primary" />
                    Sleep Sounds
                  </CardTitle>
                  <CardDescription>Natural sounds to help you fall asleep</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {natureSounds.map((sound) => (
                      <Card 
                        key={sound.type}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          natureAudio?.isPlaying && sound.type === natureAudio.type 
                            ? 'border-primary bg-primary/5' 
                            : ''
                        }`}
                        onClick={() => playNatureSound(sound.type)}
                      >
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                          <sound.icon className="h-8 w-8 text-primary" />
                          <p className="text-sm font-medium">{sound.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!natureAudio?.isPlaying}
                      onClick={() => stopNatureSound()}
                    >
                      {natureAudio?.isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    
                    <div className="flex-1">
                      <Slider
                        value={[natureVolume]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={handleNatureVolumeChange}
                        disabled={!natureAudio?.isPlaying}
                        className="w-full"
                      />
                    </div>
                    
                    <span className="w-12 text-sm text-muted-foreground">
                      {Math.round(natureVolume * 100)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="binaural">
              <Card className="border border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Binaural Beats
                  </CardTitle>
                  <CardDescription>
                    Sound frequencies that may help promote different brain states
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="binaural-toggle"
                        checked={binauralAudio?.isPlaying || false}
                        onCheckedChange={toggleBinauralBeat}
                      />
                      <Label htmlFor="binaural-toggle" className="font-medium">
                        {binauralAudio?.isPlaying 
                          ? 'Binaural beats playing' 
                          : 'Play binaural beats'}
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        value={[binauralVolume]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={handleBinauralVolumeChange}
                        className="w-[100px]"
                      />
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Frequency: {binauralFrequency} Hz</h3>
                    <Slider
                      value={[binauralFrequency]}
                      min={0.5}
                      max={12}
                      step={0.5}
                      onValueChange={handleBinauralFrequencyChange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Deep Sleep</span>
                      <span>Light Sleep</span>
                      <span>Relaxed</span>
                      <span>Alert</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {binauralPresets.map((preset) => (
                      <Card
                        key={preset.name}
                        className="cursor-pointer hover:shadow-sm transition-all"
                        onClick={() => {
                          setBinauralFrequency(preset.frequency);
                          if (binauralAudio?.isPlaying) {
                            binauralAudio.setFrequencies(256, preset.frequency);
                          } else {
                            startBinauralBeat(256, preset.frequency, binauralVolume);
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <h3 className="font-medium">{preset.name}</h3>
                          <p className="text-xs text-muted-foreground">{preset.description}</p>
                          <p className="text-xs text-primary mt-1">{preset.frequency} Hz</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tips">
              <Card className="border border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-primary" />
                    Sleep Optimization Tips
                  </CardTitle>
                  <CardDescription>
                    Evidence-based methods for improving sleep quality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sleepOptimizationTips.map((section) => (
                      <Card key={section.category}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <section.icon className="h-5 w-5 text-primary" />
                            {section.category}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside space-y-2">
                            {section.tips.map((tip) => (
                              <li key={tip} className="text-sm text-muted-foreground">
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlarmClock className="h-5 w-5 text-primary" />
                  Sleep Calculator
                </CardTitle>
                <CardDescription>
                  Find the perfect time to sleep or wake up
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Link to="/app/web-tools/sleep-calculator">
                  <Button>
                    Use Sleep Calculator
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-primary" />
                  Set Sleep Goals
                </CardTitle>
                <CardDescription>
                  Define and track your sleep targets
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Link to="/app/web-tools/sleep-goals">
                  <Button variant="outline">
                    Manage Sleep Goals
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  );
}
