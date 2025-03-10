import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { dbClient } from '@/lib/db-client';
import { Play, Pause, RotateCcw, Settings as SettingsIcon, Volume2 } from 'lucide-react';

interface PomodoroProps {
  session: Session | null;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  focusTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  intervalsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundVolume: number;
}

export const Pomodoro: React.FC<PomodoroProps> = ({ session }) => {
  // Timer settings
  const [settings, setSettings] = useState<TimerSettings>({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    intervalsBeforeLongBreak: 4,
    autoStartBreaks: true,
    autoStartFocus: true,
    soundVolume: 50,
  });

  // Timer state
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [intervals, setIntervals] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Get current timer duration based on mode
  const getCurrentDuration = useCallback((): number => {
    switch (mode) {
      case 'focus':
        return settings.focusTime * 60;
      case 'shortBreak':
        return settings.shortBreakTime * 60;
      case 'longBreak':
        return settings.longBreakTime * 60;
      default:
        return settings.focusTime * 60;
    }
  }, [mode, settings]);

  // Load user settings from database
  useEffect(() => {
    const loadSettings = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await dbClient
          .from('user_settings')
          .select('pomodoro_settings')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error loading settings:', error);
          return;
        }

        if (data?.pomodoro_settings) {
          setSettings(data.pomodoro_settings);
          setTimeLeft(data.pomodoro_settings.focusTime * 60);
        }
      } catch (err) {
        console.error('Error fetching pomodoro settings:', err);
      }
    };

    loadSettings();
  }, [session]);

  // Save settings to database
  const saveSettings = async () => {
    if (!session?.user?.id) return;

    try {
      const { error } = await dbClient
        .from('user_settings')
        .upsert({
          user_id: session.user.id,
          pomodoro_settings: settings,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving settings:', error);
      }
    } catch (err) {
      console.error('Error saving pomodoro settings:', err);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      handleTimerComplete();
    }

    return () => clearInterval(intervalId);
  }, [isActive, timeLeft]);

  // Reset timer when mode changes
  useEffect(() => {
    setTimeLeft(getCurrentDuration());
    setIsActive(false);
  }, [mode, getCurrentDuration]);

  // Handle timer completion
  const handleTimerComplete = () => {
    // Play notification sound
    const audio = new Audio('/assets/timer-complete.mp3');
    audio.volume = settings.soundVolume / 100;
    audio.play();

    if (mode === 'focus') {
      // Increment interval counter
      const newIntervals = intervals + 1;
      setIntervals(newIntervals);

      // Determine if we need a long break or short break
      if (newIntervals % settings.intervalsBeforeLongBreak === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }

      // Auto-start break if enabled
      setIsActive(settings.autoStartBreaks);
    } else {
      // After break, go back to focus
      setMode('focus');
      // Auto-start focus if enabled
      setIsActive(settings.autoStartFocus);
    }

    // Save pomodoro session to database for analytics
    savePomodoroSession();
  };

  // Save completed pomodoro session
  const savePomodoroSession = async () => {
    if (!session?.user?.id) return;

    try {
      await dbClient
        .from('pomodoro_sessions')
        .insert({
          user_id: session.user.id,
          mode,
          duration: getCurrentDuration(),
          completed_at: new Date().toISOString(),
        });
    } catch (err) {
      console.error('Error saving pomodoro session:', err);
    }
  };

  // Timer controls
  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getCurrentDuration());
  };

  // Calculate progress
  const progress = (1 - timeLeft / getCurrentDuration()) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pomodoro Timer</h2>
        <p className="text-muted-foreground">
          Boost your productivity with focused work sessions and scheduled breaks.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Timer Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Timer</CardTitle>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setShowSettings(!showSettings)}
              >
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
            {/* Timer Mode Selector */}
            <div className="mb-6 flex">
              <Button 
                variant={mode === 'focus' ? 'default' : 'outline'}
                className="rounded-r-none"
                onClick={() => setMode('focus')}
              >
                Focus
              </Button>
              <Button 
                variant={mode === 'shortBreak' ? 'default' : 'outline'}
                className="rounded-none border-x-0"
                onClick={() => setMode('shortBreak')}
              >
                Short Break
              </Button>
              <Button 
                variant={mode === 'longBreak' ? 'default' : 'outline'}
                className="rounded-l-none"
                onClick={() => setMode('longBreak')}
              >
                Long Break
              </Button>
            </div>
            
            {/* Timer Display */}
            <div 
              className="relative w-64 h-64 rounded-full border-8 border-indigo-100 flex items-center justify-center mb-6"
              style={{
                background: `conic-gradient(#6366f1 ${progress}%, transparent ${progress}%)`
              }}
            >
              <div className="w-52 h-52 bg-white rounded-full flex items-center justify-center">
                <span className="text-5xl font-bold text-gray-800">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            
            {/* Timer Controls */}
            <div className="flex space-x-4">
              <Button 
                size="lg" 
                onClick={toggleTimer}
                className="w-32"
              >
                {isActive ? (
                  <><Pause className="mr-2 h-5 w-5" /> Pause</>
                ) : (
                  <><Play className="mr-2 h-5 w-5" /> Start</>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={resetTimer}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="text-center border-t pt-4">
            <div className="w-full text-gray-500 text-sm">
              {mode === 'focus' ? (
                <span>Focus session {intervals + 1} of {settings.intervalsBeforeLongBreak}</span>
              ) : mode === 'shortBreak' ? (
                <span>Short break - return to focus soon</span>
              ) : (
                <span>Long break - take time to recharge</span>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Settings or Stats Panel */}
        <Card>
          {showSettings ? (
            <>
              <CardHeader>
                <CardTitle>Timer Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Focus Duration */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Focus Duration (minutes)</label>
                    <span className="text-sm text-gray-500">{settings.focusTime}</span>
                  </div>
                  <Select 
                    value={settings.focusTime.toString()} 
                    onValueChange={(value) => setSettings({...settings, focusTime: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Focus duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {[15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((min) => (
                        <SelectItem key={min} value={min.toString()}>{min} minutes</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Short Break Duration */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Short Break (minutes)</label>
                    <span className="text-sm text-gray-500">{settings.shortBreakTime}</span>
                  </div>
                  <Select 
                    value={settings.shortBreakTime.toString()} 
                    onValueChange={(value) => setSettings({...settings, shortBreakTime: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Short break duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 5, 10].map((min) => (
                        <SelectItem key={min} value={min.toString()}>{min} minutes</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Long Break Duration */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Long Break (minutes)</label>
                    <span className="text-sm text-gray-500">{settings.longBreakTime}</span>
                  </div>
                  <Select 
                    value={settings.longBreakTime.toString()} 
                    onValueChange={(value) => setSettings({...settings, longBreakTime: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Long break duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 15, 20, 25, 30].map((min) => (
                        <SelectItem key={min} value={min.toString()}>{min} minutes</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Intervals before long break */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Sessions Before Long Break</label>
                    <span className="text-sm text-gray-500">{settings.intervalsBeforeLongBreak}</span>
                  </div>
                  <Select 
                    value={settings.intervalsBeforeLongBreak.toString()} 
                    onValueChange={(value) => setSettings({...settings, intervalsBeforeLongBreak: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sessions before long break" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5, 6].map((count) => (
                        <SelectItem key={count} value={count.toString()}>{count} sessions</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Auto-start breaks */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Auto-start Breaks</label>
                  <Switch 
                    checked={settings.autoStartBreaks}
                    onCheckedChange={(checked) => setSettings({...settings, autoStartBreaks: checked})}
                  />
                </div>
                
                {/* Auto-start focus */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Auto-start Focus</label>
                  <Switch 
                    checked={settings.autoStartFocus}
                    onCheckedChange={(checked) => setSettings({...settings, autoStartFocus: checked})}
                  />
                </div>
                
                {/* Sound volume */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="flex items-center text-sm font-medium">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Notification Volume
                    </label>
                    <span className="text-sm text-gray-500">{settings.soundVolume}%</span>
                  </div>
                  <Slider
                    value={[settings.soundVolume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setSettings({...settings, soundVolume: value[0]})}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  saveSettings();
                  setShowSettings(false);
                }}>
                  Save Settings
                </Button>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Pomodoro Technique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Benefits:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Improved focus and concentration</li>
                    <li>Reduced mental fatigue</li>
                    <li>Increased productivity and accountability</li>
                    <li>Better time awareness and estimation</li>
                    <li>Clear separation between work and breaks</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">How to use:</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Set your focus session (traditionally 25 minutes)</li>
                    <li>Work until the timer rings</li>
                    <li>Take a short break (5 minutes)</li>
                    <li>After 4 cycles, take a longer break (15-30 minutes)</li>
                  </ol>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};
