import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Timer, Pause, Play, RefreshCw, Clock, Brain, Zap } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BackgroundMusicPlayer } from "@/components/audio/BackgroundMusicPlayer";
import { useAuth } from "@/components/AuthProvider";
import { focusDb } from "@/lib/focus-db";

export const FocusTimerTools = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [isBreak, setIsBreak] = useState(false);
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const startSession = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error("No user ID");
      
      const result = await focusDb.createTimerSession({
        timer_type: 'pomodoro',
        work_duration: workDuration,
        break_duration: breakDuration,
        mood_before: moodBefore || undefined,
        energy_level: energyLevel || undefined,
      });

      setCurrentSessionId(result.id);
    },
    onSuccess: () => {
      toast({
        title: "Focus session started",
        description: "Your progress will be tracked automatically.",
      });
      setIsActive(true);
    },
  });

  const endSession = useMutation({
    mutationFn: async () => {
      if (!currentSessionId) return;
      
      await focusDb.updateTimerSession(currentSessionId, {
        ended_at: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      toast({
        title: "Focus session completed",
        description: "Great work! Your session has been saved.",
      });
      setCurrentSessionId(null);
      setIsActive(false);
      queryClient.invalidateQueries({ queryKey: ['focus-sessions'] });
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      if (isBreak) {
        setTime(workDuration * 60);
        setIsBreak(false);
        toast({
          title: "Break time over",
          description: "Time to focus!",
        });
      } else {
        setTime(breakDuration * 60);
        setIsBreak(true);
        toast({
          title: "Time for a break",
          description: `Take ${breakDuration} minutes to recharge.`,
        });
      }
    }
    return () => clearInterval(interval);
  }, [isActive, time, workDuration, breakDuration, isBreak]);

  const toggleTimer = () => {
    if (!isActive && !currentSessionId) {
      startSession.mutate();
    } else {
      setIsActive(!isActive);
    }
  };

  const resetTimer = () => {
    if (currentSessionId) {
      endSession.mutate();
    }
    setTime(workDuration * 60);
    setIsBreak(false);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          Focus Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-6xl font-bold text-center text-primary">
          {formatTime(time)}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Work Duration (minutes)</Label>
            <Slider
              value={[workDuration]}
              onValueChange={(value) => setWorkDuration(value[0])}
              min={5}
              max={60}
              step={5}
              disabled={isActive}
            />
          </div>

          <div className="space-y-2">
            <Label>Break Duration (minutes)</Label>
            <Slider
              value={[breakDuration]}
              onValueChange={(value) => setBreakDuration(value[0])}
              min={1}
              max={15}
              step={1}
              disabled={isActive}
            />
          </div>

          {!isActive && !currentSessionId && (
            <>
              <div className="space-y-2">
                <Label>Current Mood (1-10)</Label>
                <Slider
                  value={moodBefore ? [moodBefore] : [5]}
                  onValueChange={(value) => setMoodBefore(value[0])}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Energy Level (1-10)</Label>
                <Slider
                  value={energyLevel ? [energyLevel] : [5]}
                  onValueChange={(value) => setEnergyLevel(value[0])}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={toggleTimer} size="lg" className="w-32">
            {isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="lg" className="w-32">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <BackgroundMusicPlayer />

        {isBreak && (
          <Card className="bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-primary">
              <Zap className="h-5 w-5" />
              <p className="font-medium">Break Time Activities:</p>
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Stand up and stretch</li>
              <li>• Take a short walk</li>
              <li>• Drink water</li>
              <li>• Deep breathing exercises</li>
              <li>• Rest your eyes</li>
            </ul>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
