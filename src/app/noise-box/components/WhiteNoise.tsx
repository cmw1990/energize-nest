import React, { useState, useEffect, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { dbClient } from '@/lib/db-client';
import { Volume2, VolumeX, Play, Pause, Clock, Save, RefreshCw } from 'lucide-react';

interface WhiteNoiseProps {
  session: Session | null;
}

interface NoisePreset {
  id: string;
  name: string;
  noiseType: string;
  volume: number;
  timerDuration: number | null;
  user_id: string;
}

export const WhiteNoise: React.FC<WhiteNoiseProps> = ({ session }) => {
  // Audio contexts and nodes
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // UI state
  const [noiseType, setNoiseType] = useState<string>('white');
  const [volume, setVolume] = useState<number>(50);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timerEnabled, setTimerEnabled] = useState<boolean>(false);
  const [timerDuration, setTimerDuration] = useState<number>(30);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const [presets, setPresets] = useState<NoisePreset[]>([]);
  const [presetName, setPresetName] = useState<string>('');
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch user presets on mount
  useEffect(() => {
    if (session?.user?.id) {
      fetchPresets();
    }
    
    return () => {
      stopNoise();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [session]);

  // Initialize audio context
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
  };

  // Fetch user presets
  const fetchPresets = async () => {
    try {
      const { data, error } = await dbClient
        .from('noise_presets')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching presets:', error);
        return;
      }
      
      setPresets(data || []);
    } catch (err) {
      console.error('Error in preset fetch:', err);
    }
  };

  // Save current settings as preset
  const savePreset = async () => {
    if (!session?.user?.id || !presetName.trim()) return;
    
    try {
      const preset = {
        user_id: session.user.id,
        name: presetName.trim(),
        noiseType,
        volume,
        timerDuration: timerEnabled ? timerDuration : null,
      };
      
      const { error } = await dbClient
        .from('noise_presets')
        .insert(preset);
      
      if (error) {
        console.error('Error saving preset:', error);
        return;
      }
      
      setPresetName('');
      fetchPresets();
    } catch (err) {
      console.error('Error in preset save:', err);
    }
  };

  // Load a preset
  const loadPreset = (preset: NoisePreset) => {
    setNoiseType(preset.noiseType);
    setVolume(preset.volume);
    
    if (preset.timerDuration) {
      setTimerEnabled(true);
      setTimerDuration(preset.timerDuration);
    } else {
      setTimerEnabled(false);
    }
    
    if (isPlaying) {
      stopNoise();
      setTimeout(() => {
        playNoise(preset.noiseType, preset.volume / 100);
      }, 100);
    }
  };

  // Delete a preset
  const deletePreset = async (presetId: string) => {
    try {
      const { error } = await dbClient
        .from('noise_presets')
        .delete()
        .eq('id', presetId)
        .eq('user_id', session?.user?.id);
      
      if (error) {
        console.error('Error deleting preset:', error);
        return;
      }
      
      fetchPresets();
    } catch (err) {
      console.error('Error in preset deletion:', err);
    }
  };

  // Generate noise buffer
  const generateNoiseBuffer = (type: string): AudioBuffer => {
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const bufferSize = 2 * sampleRate; // 2 seconds
    const buffer = audioContextRef.current!.createBuffer(2, bufferSize, sampleRate);
    
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const data = buffer.getChannelData(channel);
      
      for (let i = 0; i < bufferSize; i++) {
        // Different noise types
        if (type === 'white') {
          // White noise - equal energy per frequency
          data[i] = Math.random() * 2 - 1;
        } else if (type === 'pink') {
          // Pink noise - equal energy per octave
          // Simple approximation
          data[i] = (Math.random() * 2 - 1) * 0.5;
          if (i > 0) data[i] = (data[i - 1] + data[i]) / 2;
        } else if (type === 'brown') {
          // Brown/red noise - power decreases with frequency
          // Simple approximation
          data[i] = (Math.random() * 2 - 1) * 0.25;
          if (i > 0) data[i] = (data[i - 1] + data[i]) / 1.5;
        }
      }
    }
    
    return buffer;
  };

  // Play noise
  const playNoise = (type: string = noiseType, vol: number = volume / 100) => {
    initAudioContext();
    
    // Stop any currently playing noise
    if (noiseNodeRef.current) {
      noiseNodeRef.current.stop();
      noiseNodeRef.current.disconnect();
    }
    
    // Create and configure noise source
    noiseNodeRef.current = audioContextRef.current!.createBufferSource();
    noiseNodeRef.current.buffer = generateNoiseBuffer(type);
    noiseNodeRef.current.loop = true;
    
    // Set volume
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = vol;
    }
    
    // Connect and play
    noiseNodeRef.current.connect(gainNodeRef.current!);
    noiseNodeRef.current.start();
    
    setIsPlaying(true);
    
    // Set up timer if enabled
    if (timerEnabled) {
      startTimer();
    }
  };

  // Stop noise
  const stopNoise = () => {
    if (noiseNodeRef.current) {
      noiseNodeRef.current.stop();
      noiseNodeRef.current.disconnect();
      noiseNodeRef.current = null;
    }
    
    setIsPlaying(false);
    stopTimer();
  };

  // Update volume
  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
    
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume / 100;
    }
  };

  // Start timer
  const startTimer = () => {
    stopTimer();
    setTimerRemaining(timerDuration * 60);
    
    timerIntervalRef.current = setInterval(() => {
      setTimerRemaining(prev => {
        if (prev === null || prev <= 1) {
          stopTimer();
          stopNoise();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Stop timer
  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimerRemaining(null);
  };

  // Format timer display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">White Noise Generator</h2>
        <p className="text-muted-foreground">
          Create the perfect ambient sound environment for relaxation, focus, or sleep.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Main Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Noise Controls</CardTitle>
            <CardDescription>Adjust your sound environment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Noise Type Selector */}
            <div className="space-y-2">
              <Label>Noise Type</Label>
              <Tabs
                defaultValue={noiseType}
                onValueChange={(value) => {
                  setNoiseType(value);
                  if (isPlaying) {
                    stopNoise();
                    setTimeout(() => playNoise(value), 100);
                  }
                }}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="white">White</TabsTrigger>
                  <TabsTrigger value="pink">Pink</TabsTrigger>
                  <TabsTrigger value="brown">Brown</TabsTrigger>
                </TabsList>
                <TabsContent value="white" className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    White noise contains all frequencies at equal intensity, like TV or radio static. 
                    Great for masking sudden environmental noises.
                  </p>
                </TabsContent>
                <TabsContent value="pink" className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Pink noise emphasizes lower frequencies, creating a deeper sound like steady rainfall.
                    Often preferred for sleep and relaxation.
                  </p>
                </TabsContent>
                <TabsContent value="brown" className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Brown (or red) noise has even more energy in lower frequencies, similar to ocean waves or thunder.
                    Excellent for deep relaxation and blocking low-frequency disturbances.
                  </p>
                </TabsContent>
              </Tabs>
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Volume</Label>
                <span className="text-sm text-muted-foreground">{volume}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <VolumeX className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(values) => updateVolume(values[0])}
                />
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Sleep Timer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Sleep Timer</Label>
                <Switch
                  checked={timerEnabled}
                  onCheckedChange={(checked) => {
                    setTimerEnabled(checked);
                    if (!checked) stopTimer();
                    else if (isPlaying) startTimer();
                  }}
                />
              </div>
              
              {timerEnabled && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Timer Duration (minutes)</Label>
                    <span className="text-sm text-muted-foreground">{timerDuration} min</span>
                  </div>
                  <Slider
                    value={[timerDuration]}
                    min={5}
                    max={120}
                    step={5}
                    onValueChange={(values) => setTimerDuration(values[0])}
                    disabled={timerRemaining !== null}
                  />
                  
                  {timerRemaining !== null && (
                    <div className="flex items-center justify-center mt-4 space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-semibold">{formatTime(timerRemaining)}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={stopTimer}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Play/Pause Button */}
            <div className="flex justify-center pt-2">
              <Button 
                size="lg" 
                className="w-40 rounded-full"
                onClick={() => isPlaying ? stopNoise() : playNoise()}
              >
                {isPlaying ? (
                  <><Pause className="mr-2 h-5 w-5" /> Pause</>
                ) : (
                  <><Play className="mr-2 h-5 w-5" /> Play</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Presets */}
        <Card>
          <CardHeader>
            <CardTitle>My Presets</CardTitle>
            <CardDescription>Save and load your favorite sound configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Save New Preset */}
            {session && (
              <div className="space-y-2">
                <Label>Save Current Settings</Label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Preset name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                  />
                  <Button onClick={savePreset} disabled={!presetName.trim()}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            )}

            {/* Preset List */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Saved Presets</Label>
                <Button variant="ghost" size="sm" onClick={fetchPresets}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              {presets.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  {session ? "You haven't saved any presets yet." : "Sign in to save and access your presets."}
                </p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {presets.map((preset) => (
                    <div 
                      key={preset.id} 
                      className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 cursor-pointer"
                      onClick={() => loadPreset(preset)}
                    >
                      <div>
                        <p className="font-medium">{preset.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {preset.noiseType.charAt(0).toUpperCase() + preset.noiseType.slice(1)} noise • {preset.volume}% volume
                          {preset.timerDuration ? ` • ${preset.timerDuration} min timer` : ''}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePreset(preset.id);
                        }}
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Information section */}
            <div className="bg-muted p-4 rounded-md text-sm space-y-2">
              <h4 className="font-semibold">About White Noise</h4>
              <p className="text-muted-foreground">
                Consistent background noise can help mask disruptive sounds, aid concentration, and promote better sleep.
                Different types of noise benefit different activities and personal preferences.
              </p>
              <h4 className="font-semibold mt-3">Benefits</h4>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Improves focus and concentration</li>
                <li>Masks distracting environmental sounds</li>
                <li>Helps with sleep onset and quality</li>
                <li>Reduces stress and anxiety</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
