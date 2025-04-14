
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2, Play, Pause, Save, Clock, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudioGenerator } from '@/hooks/useAudioGenerator';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface SequencePattern {
  id: string;
  baseFreq: number;
  beatFreq: number;
  duration: number;
}

export const BinauralBeatSequencer = () => {
  const { toast } = useToast();
  const { createBinauralBeat, stopBinauralBeat, binauralAudio } = useAudioGenerator();
  const { session } = useAuth();
  
  const [patterns, setPatterns] = useState<SequencePattern[]>([
    { id: crypto.randomUUID(), baseFreq: 200, beatFreq: 10, duration: 120 }
  ]);
  const [sequenceName, setSequenceName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [savedSequences, setSavedSequences] = useState<any[]>([]);

  // Fetch saved sequences
  useEffect(() => {
    if (session?.user?.id) {
      fetchSavedSequences();
    }
  }, [session?.user?.id]);

  const fetchSavedSequences = async () => {
    try {
      const { data, error } = await supabase
        .from('binaural_sequences')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedSequences(data || []);
    } catch (error) {
      console.error('Error fetching saved sequences:', error);
    }
  };

  // Handle sequence playback
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying && patterns.length > 0) {
      const currentPattern = patterns[currentPatternIndex];
      setRemainingTime(currentPattern.duration);
      
      // Start playing the current pattern
      createBinauralBeat(currentPattern.baseFreq, currentPattern.beatFreq);
      
      // Set up timer to track remaining time and pattern transitions
      timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            // Move to next pattern or stop if end of sequence
            const nextIndex = currentPatternIndex + 1;
            if (nextIndex < patterns.length) {
              setCurrentPatternIndex(nextIndex);
              const nextPattern = patterns[nextIndex];
              createBinauralBeat(nextPattern.baseFreq, nextPattern.beatFreq);
              return nextPattern.duration;
            } else {
              stopSequence();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [isPlaying, currentPatternIndex, patterns]);

  const addPattern = () => {
    setPatterns([
      ...patterns,
      { 
        id: crypto.randomUUID(), 
        baseFreq: 200, 
        beatFreq: 10, 
        duration: 120 
      }
    ]);
  };

  const removePattern = (id: string) => {
    if (patterns.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "You need at least one pattern in the sequence.",
        variant: "destructive"
      });
      return;
    }
    
    setPatterns(patterns.filter(pattern => pattern.id !== id));
  };

  const updatePattern = (id: string, field: keyof SequencePattern, value: number) => {
    setPatterns(patterns.map(pattern => 
      pattern.id === id ? { ...pattern, [field]: value } : pattern
    ));
  };

  const playSequence = () => {
    setCurrentPatternIndex(0);
    setIsPlaying(true);
  };

  const stopSequence = () => {
    setIsPlaying(false);
    setCurrentPatternIndex(0);
    stopBinauralBeat();
  };

  const saveSequence = async () => {
    if (!sequenceName.trim()) {
      toast({
        title: "Name Required",
        description: "Please give your sequence a name before saving.",
        variant: "destructive"
      });
      return;
    }

    if (!session?.user?.id) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to save sequences.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('binaural_sequences')
        .insert({
          user_id: session.user.id,
          name: sequenceName,
          patterns: patterns,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      toast({
        title: "Sequence Saved",
        description: "Your binaural beat sequence has been saved."
      });
      
      setSequenceName('');
      fetchSavedSequences();
    } catch (error) {
      console.error('Error saving sequence:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save your sequence. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadSequence = (sequence: any) => {
    setPatterns(sequence.patterns);
    setSequenceName(sequence.name);
    
    toast({
      title: "Sequence Loaded",
      description: `Loaded "${sequence.name}"`
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-5 w-5 text-primary"
          >
            <path d="M2 9c.9-.9 1.7-1.7 2.8-2.3 1.4-.7 3-.8 4.4-.3 1.4.5 2.4 1.7 2.8 3.1.3 1.4.1 2.8-.6 4C8.5 14 6.9 15 5 16.5"></path>
            <path d="M22 9c-.9-.9-1.7-1.7-2.8-2.3-1.4-.7-3-.8-4.4-.3-1.4.5-2.4 1.7-2.8 3.1-.3 1.4-.1 2.8.6 4 2.9.7 4.5 1.7 6.4 3.2"></path>
            <path d="M8 22h8"></path>
            <path d="M12 17v5"></path>
          </svg>
          Binaural Beat Sequencer
        </CardTitle>
        <CardDescription>
          Create custom sequences of binaural beats for different brainwave states
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isPlaying && (
          <div className="rounded-lg bg-primary/10 p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-primary animate-pulse" />
              <span className="font-medium">
                Pattern {currentPatternIndex + 1} of {patterns.length}
              </span>
            </div>
            <div className="text-2xl font-mono font-bold">
              {formatTime(remainingTime)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {patterns[currentPatternIndex].baseFreq}Hz + {patterns[currentPatternIndex].beatFreq}Hz beat
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Input 
            placeholder="Name your sequence" 
            value={sequenceName} 
            onChange={(e) => setSequenceName(e.target.value)}
            disabled={isPlaying}
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={saveSequence}
            disabled={isPlaying}
          >
            <Save className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {patterns.map((pattern, index) => (
            <Card key={pattern.id} className="border border-muted">
              <CardContent className="pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Pattern {index + 1}</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removePattern(pattern.id)}
                    disabled={isPlaying}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Base Frequency</Label>
                    <span className="text-sm font-mono">{pattern.baseFreq} Hz</span>
                  </div>
                  <Slider
                    value={[pattern.baseFreq]}
                    min={60}
                    max={500}
                    step={1}
                    onValueChange={([value]) => updatePattern(pattern.id, 'baseFreq', value)}
                    disabled={isPlaying}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Beat Frequency</Label>
                    <span className="text-sm font-mono">{pattern.beatFreq} Hz</span>
                  </div>
                  <Slider
                    value={[pattern.beatFreq]}
                    min={0.5}
                    max={40}
                    step={0.5}
                    onValueChange={([value]) => updatePattern(pattern.id, 'beatFreq', value)}
                    disabled={isPlaying}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Duration</Label>
                    <span className="text-sm font-mono">{formatTime(pattern.duration)}</span>
                  </div>
                  <Slider
                    value={[pattern.duration]}
                    min={10}
                    max={600}
                    step={10}
                    onValueChange={([value]) => updatePattern(pattern.id, 'duration', value)}
                    disabled={isPlaying}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={addPattern}
          disabled={isPlaying}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Pattern
        </Button>

        <div className="flex gap-2">
          {!isPlaying ? (
            <Button 
              className="flex-1" 
              onClick={playSequence}
            >
              <Play className="h-4 w-4 mr-2" />
              Play Sequence
            </Button>
          ) : (
            <Button 
              className="flex-1" 
              variant="destructive"
              onClick={stopSequence}
            >
              <Pause className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => {
              setPatterns([{ id: crypto.randomUUID(), baseFreq: 200, beatFreq: 10, duration: 120 }]);
              setSequenceName('');
            }}
            disabled={isPlaying}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {savedSequences.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">Your Saved Sequences</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {savedSequences.map(sequence => (
                <div 
                  key={sequence.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                  onClick={() => loadSequence(sequence)}
                >
                  <div>
                    <p className="font-medium">{sequence.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {sequence.patterns.length} patterns
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      loadSequence(sequence);
                    }}
                  >
                    Load
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
