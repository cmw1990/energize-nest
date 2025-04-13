
import React, { useState } from 'react';
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Plus, Clock, Star, Coffee, BedDouble, Wind, Sun, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const SleepTrackingForm = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    bedTime: '23:00',
    wakeTime: '07:00',
    sleepQuality: 7,
    sleepDuration: 8,
    deepSleepPercentage: 20,
    remSleepPercentage: 25,
    caffeine: 0,
    alcohol: 0,
    exercise: 0,
    stress: 5,
    mood: 7,
    notes: '',
    screenTime: '30',
    factors: [] as string[],
  });
  
  const sleepFactors = [
    { id: 'noise', label: 'Noise', icon: <Wind className="h-3 w-3" /> },
    { id: 'temperature', label: 'Temperature', icon: <Sun className="h-3 w-3" /> },
    { id: 'light', label: 'Light', icon: <Sun className="h-3 w-3" /> },
    { id: 'stress', label: 'Stress', icon: <Activity className="h-3 w-3" /> },
    { id: 'exercise', label: 'Exercise', icon: <Activity className="h-3 w-3" /> },
    { id: 'caffeine', label: 'Caffeine', icon: <Coffee className="h-3 w-3" /> },
    { id: 'alcohol', label: 'Alcohol', icon: <Coffee className="h-3 w-3" /> },
    { id: 'screen', label: 'Screen Time', icon: <Moon className="h-3 w-3" /> },
    { id: 'late_meal', label: 'Late Meal', icon: <Coffee className="h-3 w-3" /> },
  ];
  
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSliderChange = (name: string, value: number[]) => {
    setFormData(prev => ({ ...prev, [name]: value[0] }));
  };
  
  const toggleSleepFactor = (factorId: string) => {
    setFormData(prev => {
      const factors = [...prev.factors];
      const index = factors.indexOf(factorId);
      
      if (index === -1) {
        factors.push(factorId);
      } else {
        factors.splice(index, 1);
      }
      
      return { ...prev, factors };
    });
  };
  
  const calculateSleepDuration = () => {
    const [bedHours, bedMinutes] = formData.bedTime.split(':').map(Number);
    const [wakeHours, wakeMinutes] = formData.wakeTime.split(':').map(Number);
    
    let bedTimeMinutes = bedHours * 60 + bedMinutes;
    let wakeTimeMinutes = wakeHours * 60 + wakeMinutes;
    
    // If wake time is earlier in the day than bedtime
    if (wakeTimeMinutes < bedTimeMinutes) {
      wakeTimeMinutes += 24 * 60; // Add 24 hours
    }
    
    const durationMinutes = wakeTimeMinutes - bedTimeMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return { hours, minutes, totalMinutes: durationMinutes };
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to track your sleep",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const duration = calculateSleepDuration();
      
      const { error } = await supabase
        .from('sleep_logs')
        .insert({
          user_id: session.user.id,
          date: formData.date,
          bed_time: formData.bedTime,
          wake_time: formData.wakeTime,
          sleep_quality: formData.sleepQuality,
          sleep_duration_minutes: duration.totalMinutes,
          deep_sleep_percentage: formData.deepSleepPercentage,
          rem_sleep_percentage: formData.remSleepPercentage,
          caffeine_mg: formData.caffeine,
          alcohol_drinks: formData.alcohol,
          exercise_minutes: formData.exercise,
          stress_level: formData.stress,
          mood_rating: formData.mood,
          notes: formData.notes,
          screen_time_minutes: parseInt(formData.screenTime),
          affecting_factors: formData.factors,
        });
      
      if (error) throw error;
      
      toast({
        title: "Sleep tracked",
        description: "Your sleep data has been saved successfully",
      });
      
      // Reset form to defaults
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        bedTime: '23:00',
        wakeTime: '07:00',
        sleepQuality: 7,
        sleepDuration: 8,
        deepSleepPercentage: 20,
        remSleepPercentage: 25,
        caffeine: 0,
        alcohol: 0,
        exercise: 0,
        stress: 5,
        mood: 7,
        notes: '',
        screenTime: '30',
        factors: [],
      });
      
    } catch (error: any) {
      toast({
        title: "Error saving sleep data",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const duration = calculateSleepDuration();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Track Your Sleep
        </CardTitle>
        <CardDescription>
          Record your sleep details to track patterns and improvements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Sleep Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInput}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedTime" className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-blue-500" />
                    Bed Time
                  </Label>
                  <Input
                    id="bedTime"
                    name="bedTime"
                    type="time"
                    value={formData.bedTime}
                    onChange={handleInput}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wakeTime" className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-amber-500" />
                    Wake Time
                  </Label>
                  <Input
                    id="wakeTime"
                    name="wakeTime"
                    type="time"
                    value={formData.wakeTime}
                    onChange={handleInput}
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-center py-2 px-4 bg-primary/5 rounded-lg border">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <span className="text-xl font-bold">
                  {duration.hours}h {duration.minutes}m
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  Total Sleep
                </span>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Sleep Quality
                </Label>
                <div className="space-y-1">
                  <Slider
                    value={[formData.sleepQuality]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => handleSliderChange('sleepQuality', value)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Poor</span>
                    <span>Average</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>What affected your sleep?</Label>
                <div className="flex flex-wrap gap-2">
                  {sleepFactors.map(factor => (
                    <Badge
                      key={factor.id}
                      variant={formData.factors.includes(factor.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleSleepFactor(factor.id)}
                    >
                      {factor.icon}
                      <span className="ml-1">{factor.label}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="caffeine" className="flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-brown-500" />
                    Caffeine (mg)
                  </Label>
                  <Input
                    id="caffeine"
                    name="caffeine"
                    type="number"
                    min="0"
                    value={formData.caffeine}
                    onChange={handleInput}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alcohol" className="flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-red-500" />
                    Alcohol (drinks)
                  </Label>
                  <Input
                    id="alcohol"
                    name="alcohol"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.alcohol}
                    onChange={handleInput}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exercise" className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    Exercise (min)
                  </Label>
                  <Input
                    id="exercise"
                    name="exercise"
                    type="number"
                    min="0"
                    value={formData.exercise}
                    onChange={handleInput}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-500" />
                  Stress Level
                </Label>
                <div className="space-y-1">
                  <Slider
                    value={[formData.stress]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => handleSliderChange('stress', value)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>None</span>
                    <span>Moderate</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  Morning Mood
                </Label>
                <div className="space-y-1">
                  <Slider
                    value={[formData.mood]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => handleSliderChange('mood', value)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Terrible</span>
                    <span>Neutral</span>
                    <span>Great</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="screenTime" className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-blue-500" />
                  Screen Time Before Bed (minutes)
                </Label>
                <Select 
                  value={formData.screenTime} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, screenTime: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInput}
                  placeholder="Any additional notes about your sleep..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Sleep Log'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
