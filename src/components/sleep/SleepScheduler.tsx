
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AlarmClock, Moon, Sun, BedDouble, Coffee, Clock, Bell } from "lucide-react";
import { format, addHours, addMinutes, set } from 'date-fns';

export const SleepScheduler = () => {
  const [wakeTime, setWakeTime] = useState<Date>(set(new Date(), { hours: 7, minutes: 0, seconds: 0 }));
  const [bedTime, setBedTime] = useState<Date>(set(new Date(), { hours: 23, minutes: 0, seconds: 0 }));
  const [cyclesNeeded, setCyclesNeeded] = useState(5);
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [bedtimeReminderEnabled, setBedtimeReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState(30);
  const [scheduleMode, setScheduleMode] = useState<'sleep-now' | 'wake-up' | 'bed-time'>('wake-up');

  // Calculate sleep duration based on bedtime and wake time
  const calculateSleepDuration = () => {
    let duration = wakeTime.getTime() - bedTime.getTime();
    if (duration < 0) {
      duration += 24 * 60 * 60 * 1000; // Add 24 hours if wake time is earlier than bedtime
    }
    
    const hours = Math.floor(duration / (60 * 60 * 1000));
    const minutes = Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000));
    
    return { hours, minutes, totalMinutes: hours * 60 + minutes };
  };

  // Calculate ideal bedtime based on wake time and sleep cycles
  const calculateIdealBedtime = () => {
    // Each sleep cycle is approximately 90 minutes
    const cycleDuration = 90;
    const totalSleepMinutes = cyclesNeeded * cycleDuration;
    
    // Add 14 minutes to fall asleep
    const totalMinutesNeeded = totalSleepMinutes + 14;
    
    return new Date(wakeTime.getTime() - totalMinutesNeeded * 60 * 1000);
  };

  // Calculate wake time based on current time (for "Sleep Now" mode)
  const calculateWakeTime = () => {
    const now = new Date();
    // Each sleep cycle is approximately 90 minutes
    const cycleDuration = 90;
    const totalSleepMinutes = cyclesNeeded * cycleDuration;
    
    // Add 14 minutes to fall asleep
    const totalMinutesNeeded = totalSleepMinutes + 14;
    
    return new Date(now.getTime() + totalMinutesNeeded * 60 * 1000);
  };

  const handleBedTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newBedTime = set(new Date(), { hours, minutes, seconds: 0 });
    setBedTime(newBedTime);
  };

  const handleWakeTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newWakeTime = set(new Date(), { hours, minutes, seconds: 0 });
    setWakeTime(newWakeTime);
  };

  const handleCyclesChange = (value: number[]) => {
    setCyclesNeeded(value[0]);
  };

  const handleReminderTimeChange = (value: number[]) => {
    setReminderTime(value[0]);
  };

  const handleSleepNow = () => {
    setScheduleMode('sleep-now');
    setBedTime(new Date());
    const calculatedWakeTime = calculateWakeTime();
    setWakeTime(calculatedWakeTime);
  };

  const handleScheduleByWakeTime = () => {
    setScheduleMode('wake-up');
    const calculatedBedTime = calculateIdealBedtime();
    setBedTime(calculatedBedTime);
  };

  const handleScheduleByBedTime = () => {
    setScheduleMode('bed-time');
    const cycleDuration = 90;
    const totalSleepMinutes = cyclesNeeded * cycleDuration;
    const totalMinutesNeeded = totalSleepMinutes + 14;
    const calculatedWakeTime = new Date(bedTime.getTime() + totalMinutesNeeded * 60 * 1000);
    setWakeTime(calculatedWakeTime);
  };

  useEffect(() => {
    if (scheduleMode === 'wake-up') {
      handleScheduleByWakeTime();
    } else if (scheduleMode === 'bed-time') {
      handleScheduleByBedTime();
    }
  }, [cyclesNeeded, scheduleMode]);

  const sleepDuration = calculateSleepDuration();
  const sleepCyclesCount = Math.floor(sleepDuration.totalMinutes / 90);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlarmClock className="h-5 w-5 text-primary" />
          Smart Sleep Scheduler
        </CardTitle>
        <CardDescription>
          Plan your sleep schedule for optimal rest
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant={scheduleMode === 'sleep-now' ? "default" : "outline"} 
            className="flex-1 gap-2"
            onClick={handleSleepNow}
          >
            <Moon className="h-4 w-4" />
            Sleep Now
          </Button>
          <Button 
            variant={scheduleMode === 'wake-up' ? "default" : "outline"} 
            className="flex-1 gap-2"
            onClick={() => setScheduleMode('wake-up')}
          >
            <Sun className="h-4 w-4" />
            Plan by Wake Time
          </Button>
          <Button 
            variant={scheduleMode === 'bed-time' ? "default" : "outline"} 
            className="flex-1 gap-2"
            onClick={() => setScheduleMode('bed-time')}
          >
            <BedDouble className="h-4 w-4" />
            Plan by Bedtime
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-blue-500" />
                Bedtime
              </Label>
              <div className="flex items-center gap-2">
                <input 
                  type="time" 
                  value={format(bedTime, 'HH:mm')}
                  onChange={handleBedTimeChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={scheduleMode === 'wake-up' || scheduleMode === 'sleep-now'}
                />
                {scheduleMode === 'wake-up' && (
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    ({format(bedTime, 'h:mm a')})
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-500" />
                Wake-up Time
              </Label>
              <div className="flex items-center gap-2">
                <input 
                  type="time" 
                  value={format(wakeTime, 'HH:mm')}
                  onChange={handleWakeTimeChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={scheduleMode === 'bed-time' || scheduleMode === 'sleep-now'}
                />
                {(scheduleMode === 'bed-time' || scheduleMode === 'sleep-now') && (
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    ({format(wakeTime, 'h:mm a')})
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-yellow-600" />
                Recommended Sleep Cycles
              </Label>
              <div className="space-y-4">
                <Slider
                  value={[cyclesNeeded]}
                  min={3}
                  max={7}
                  step={1}
                  onValueChange={handleCyclesChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Minimum (4.5h)</span>
                  <span>Ideal (6-7.5h)</span>
                  <span>Maximum (9h)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/10">
              <CardContent className="p-4">
                <div className="text-center space-y-1 mb-4">
                  <h3 className="font-semibold text-lg">Sleep Summary</h3>
                  <p className="text-muted-foreground text-sm">
                    {format(bedTime, 'h:mm a')} to {format(wakeTime, 'h:mm a')}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="flex flex-col items-center">
                    <Clock className="h-5 w-5 text-primary mb-1" />
                    <span className="text-lg font-bold">
                      {sleepDuration.hours}h {sleepDuration.minutes}m
                    </span>
                    <span className="text-xs text-muted-foreground">Duration</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <Moon className="h-5 w-5 text-primary mb-1" />
                    <span className="text-lg font-bold">{sleepCyclesCount}</span>
                    <span className="text-xs text-muted-foreground">Cycles</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <Coffee className="h-5 w-5 text-primary mb-1" />
                    <span className="text-lg font-bold">
                      {sleepDuration.hours >= 7 ? 'Optimal' : 
                        sleepDuration.hours >= 6 ? 'Good' : 'Limited'}
                    </span>
                    <span className="text-xs text-muted-foreground">Quality</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {sleepDuration.hours >= 7 
                    ? "This schedule provides optimal sleep duration for most adults." 
                    : sleepDuration.hours >= 6 
                    ? "This schedule provides adequate sleep for most adults."
                    : "This schedule provides less than the recommended amount of sleep for adults."
                  }
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span>Set wake-up alarm</span>
                </div>
                <Switch
                  checked={alarmEnabled}
                  onCheckedChange={setAlarmEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Bedtime reminder</span>
                </div>
                <Switch
                  checked={bedtimeReminderEnabled}
                  onCheckedChange={setBedtimeReminderEnabled}
                />
              </div>
              
              {bedtimeReminderEnabled && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Remind me before bedtime
                  </Label>
                  <div className="space-y-1">
                    <Slider
                      value={[reminderTime]}
                      min={5}
                      max={60}
                      step={5}
                      onValueChange={handleReminderTimeChange}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5 min</span>
                      <span>30 min</span>
                      <span>60 min</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full">Set Sleep Schedule</Button>
      </CardFooter>
    </Card>
  );
};
