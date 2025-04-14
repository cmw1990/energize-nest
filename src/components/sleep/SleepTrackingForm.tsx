import React, { useState, useEffect } from 'react'; // Added useEffect
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from 'date-fns'; // Added parseISO
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Plus, Clock, Star, Coffee, BedDouble, Wind, Sun, Activity, Utensils, AlertCircle, Brain as BrainIcon, Zap, Briefcase, Thermometer, Wine, Smartphone, Calendar as CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Define the structure for sleep log data
interface SleepLogData {
  date: string; // yyyy-MM-dd format
  bedTime: string; // HH:mm format
  wakeTime: string; // HH:mm format
  sleepQuality: number; // 1-10
  deepSleepPercentage?: number | null; // 0-100
  remSleepPercentage?: number | null; // 0-100
  lightSleepPercentage?: number | null; // 0-100
  awakeSleepPercentage?: number | null; // 0-100
  totalSleepCycles?: number | null; // Integer
  timeToFallAsleep?: number | null; // Minutes
  nightWakings?: number | null; // Integer
  sleepEfficiency?: number | null; // 0-100
  sleepDisruptions?: string[] | null; // Array of strings
  caffeine_mg?: number | null; // Milligrams
  alcohol_drinks?: number | null; // Number of standard drinks
  exercise_minutes?: number | null; // Minutes
  stress_level?: number | null; // 1-10
  mood_rating?: number | null; // 1-10 (Morning mood)
  notes?: string | null; // General notes
  screen_time_minutes?: number | null; // Minutes before bed
  sleep_factors?: string[] | null; // Array of factor IDs
  pre_sleep_notes?: string | null; // Notes about pre-sleep routine
  is_night_shift_sleep?: boolean | null; // Boolean
  room_temperature?: number | null; // Celsius
  room_brightness?: number | null; // 1-5 (Dark to Bright)
  room_noise_level?: number | null; // 1-5 (Silent to Loud)
  recovery_score?: number | null; // 0-100 (Calculated or from wearable)
}

// Define factors affecting sleep
const sleepFactorsOptions = [
  { id: 'noise', label: 'Noise', icon: <Wind className="h-4 w-4" /> },
  { id: 'temperature', label: 'Temperature', icon: <Thermometer className="h-4 w-4" /> },
  { id: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
  { id: 'stress', label: 'Stress', icon: <BrainIcon className="h-4 w-4" /> },
  { id: 'exercise_late', label: 'Late Exercise', icon: <Activity className="h-4 w-4" /> },
  { id: 'caffeine_late', label: 'Late Caffeine', icon: <Coffee className="h-4 w-4" /> },
  { id: 'alcohol', label: 'Alcohol', icon: <Wine className="h-4 w-4" /> },
  { id: 'screen_time', label: 'Late Screen Time', icon: <Smartphone className="h-4 w-4" /> },
  { id: 'late_meal', label: 'Late Meal', icon: <Utensils className="h-4 w-4" /> },
  { id: 'worry', label: 'Worry/Anxiety', icon: <AlertCircle className="h-4 w-4" /> },
  { id: 'discomfort', label: 'Discomfort', icon: <Activity className="h-4 w-4" /> }, // Reusing Activity icon
  { id: 'other', label: 'Other', icon: <Plus className="h-4 w-4" /> },
];

export const SleepTrackingForm = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [showEnvironment, setShowEnvironment] = useState(false);

  // Initialize form state with correct types and defaults
  const [formData, setFormData] = useState<SleepLogData>({
    date: format(new Date(), 'yyyy-MM-dd'),
    bedTime: '23:00',
    wakeTime: '07:00',
    sleepQuality: 7,
    deepSleepPercentage: 20,
    remSleepPercentage: 25,
    lightSleepPercentage: 45,
    awakeSleepPercentage: 10,
    totalSleepCycles: 4,
    timeToFallAsleep: 15,
    nightWakings: 0,
    sleepEfficiency: 90,
    sleepDisruptions: [],
    caffeine_mg: 0,
    alcohol_drinks: 0,
    exercise_minutes: 30,
    stress_level: 5,
    mood_rating: 7,
    notes: '',
    screen_time_minutes: 30,
    sleep_factors: [],
    pre_sleep_notes: '',
    is_night_shift_sleep: false,
    room_temperature: 21,
    room_brightness: 2,
    room_noise_level: 1,
    recovery_score: 85,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => {
        let processedValue: string | number | null = value;
        // Handle number inputs, converting empty string to null
        if (type === 'number') {
            processedValue = value === '' ? null : parseFloat(value);
            if (isNaN(processedValue as number)) {
                processedValue = null; // Reset to null if parsing fails (e.g., user types text)
            }
        }
        return { ...prev, [name]: processedValue };
    });
};

  // Specific handler for Select components storing numeric values
  const handleSelectChange = (name: keyof SleepLogData, value: string) => {
      const numericValue = value === '' ? null : parseInt(value);
      setFormData(prev => ({
          ...prev,
          [name]: isNaN(numericValue as number) ? null : numericValue
      }));
  };

  const handleSliderChange = (name: keyof SleepLogData, value: number[]) => {
    setFormData(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleFactorChange = (factorId: string) => {
    setFormData(prev => {
      const currentFactors = prev.sleep_factors || [];
      const newFactors = currentFactors.includes(factorId)
        ? currentFactors.filter(f => f !== factorId)
        : [...currentFactors, factorId];
      return { ...prev, sleep_factors: newFactors };
    });
  };

  const handleSwitchChange = (name: keyof SleepLogData, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Calculate sleep duration (returns total minutes)
  const calculateSleepDurationMinutes = (): number | null => {
    if (!formData.bedTime || !formData.wakeTime || !formData.date) return null;

    try {
      const [bedHours, bedMinutes] = formData.bedTime.split(':').map(Number);
      const [wakeHours, wakeMinutes] = formData.wakeTime.split(':').map(Number);

      // Use the selected date for calculations
      const logDate = parseISO(formData.date); // Parse the date string
      const bedDateTime = new Date(logDate);
      bedDateTime.setHours(bedHours, bedMinutes, 0, 0);

      const wakeDateTime = new Date(logDate);
      wakeDateTime.setHours(wakeHours, wakeMinutes, 0, 0);

      // If wake time is on the next day
      if (wakeDateTime.getTime() <= bedDateTime.getTime()) {
        wakeDateTime.setDate(wakeDateTime.getDate() + 1);
      }

      const durationMillis = wakeDateTime.getTime() - bedDateTime.getTime();
      if (durationMillis < 0) return 0; // Should not happen with the logic above

      return Math.round(durationMillis / (1000 * 60));
    } catch (e) {
      console.error("Error calculating sleep duration:", e);
      toast({ title: "Time Error", description: "Invalid bed time or wake time format.", variant: "destructive" });
      return null;
    }
  };

  const formatDuration = (totalMinutes: number | null): string => {
    if (totalMinutes === null || totalMinutes < 0) return 'N/A';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const saveLogMutation = useMutation({
    mutationFn: async (logData: SleepLogData) => { // Use SleepLogData type
      if (!session?.user?.id) throw new Error('Not authenticated');

      const durationMinutes = calculateSleepDurationMinutes();
      if (durationMinutes === null) {
        throw new Error("Invalid time input for duration calculation.");
      }

      const { data: existingEntry, error: checkError } = await supabase
        .from('sleep_logs')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('date', logData.date)
        .maybeSingle();

      if (checkError) throw checkError;

      // Prepare data, ensuring null for empty optional fields
      const dataToSave = {
        user_id: session.user.id,
        date: logData.date,
        bed_time: logData.bedTime,
        wake_time: logData.wakeTime,
        sleep_quality: logData.sleepQuality,
        sleep_duration_minutes: durationMinutes,
        deep_sleep_percentage: logData.deepSleepPercentage,
        rem_sleep_percentage: logData.remSleepPercentage,
        light_sleep_percentage: logData.lightSleepPercentage,
        awake_sleep_percentage: logData.awakeSleepPercentage,
        total_sleep_cycles: logData.totalSleepCycles,
        time_to_fall_asleep: logData.timeToFallAsleep,
        night_wakings: logData.nightWakings,
        sleep_efficiency: logData.sleepEfficiency,
        sleep_disruptions: logData.sleepDisruptions?.length ? logData.sleepDisruptions : null,
        caffeine_mg: logData.caffeine_mg,
        alcohol_drinks: logData.alcohol_drinks,
        exercise_minutes: logData.exercise_minutes,
        stress_level: logData.stress_level,
        mood_rating: logData.mood_rating,
        notes: logData.notes || null,
        screen_time_minutes: logData.screen_time_minutes,
        sleep_factors: logData.sleep_factors?.length ? logData.sleep_factors : null,
        pre_sleep_notes: logData.pre_sleep_notes || null,
        is_night_shift_sleep: logData.is_night_shift_sleep,
        room_temperature: logData.room_temperature,
        room_brightness: logData.room_brightness,
        room_noise_level: logData.room_noise_level,
        recovery_score: logData.recovery_score,
      };

      let resultAction: 'created' | 'updated' = 'created';
      if (existingEntry) {
        const { error: updateError } = await supabase
          .from('sleep_logs')
          .update(dataToSave)
          .eq('id', existingEntry.id);
        if (updateError) throw updateError;
        resultAction = 'updated';
      } else {
        const { error: insertError } = await supabase
          .from('sleep_logs')
          .insert([dataToSave]);
        if (insertError) throw insertError;
      }
      return resultAction;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['sleep_logs', session?.user?.id] });
      queryClient.invalidateQueries({ queryKey: ['health_metrics', session?.user?.id] });
      queryClient.invalidateQueries({ queryKey: ['health_metrics_history', session?.user?.id] });

      toast({
        title: `Sleep log ${result}`,
        description: `Your sleep data for ${formData.date} has been ${result}.`,
      });

      // Reset form to default for next day
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        date: format(tomorrow, 'yyyy-MM-dd'), // Default to next day
        bedTime: '23:00',
        wakeTime: '07:00',
        sleepQuality: 7,
        deepSleepPercentage: 20,
        remSleepPercentage: 25,
        lightSleepPercentage: 45,
        awakeSleepPercentage: 10,
        totalSleepCycles: 4,
        timeToFallAsleep: 15,
        nightWakings: 0,
        sleepEfficiency: 90,
        sleepDisruptions: [],
        caffeine_mg: 0,
        alcohol_drinks: 0,
        exercise_minutes: 30,
        stress_level: 5,
        mood_rating: 7,
        notes: '',
        screen_time_minutes: 30,
        sleep_factors: [],
        pre_sleep_notes: '',
        is_night_shift_sleep: false,
        room_temperature: 21,
        room_brightness: 2,
        room_noise_level: 1,
        recovery_score: 85,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error saving sleep data",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    saveLogMutation.mutate(formData);
  };

  const calculatedDuration = formatDuration(calculateSleepDurationMinutes());

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary animate-pulse" />
          Log Your Sleep
        </CardTitle>
        <CardDescription>Record your sleep details to track patterns and improvements.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column: Time & Duration */}
            <div className="space-y-4">
              <div className="space-y-2 transition-all duration-300">
                <Label htmlFor="date">Sleep Date</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(parseISO(formData.date), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date ? parseISO(formData.date) : undefined}
                        onSelect={(date) => setFormData(prev => ({...prev, date: date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 transition-all duration-300">
                  <Label htmlFor="bedTime" className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-blue-500 animate-pulse" />
                    Bed Time
                  </Label>
                  <Input id="bedTime" name="bedTime" type="time" value={formData.bedTime} onChange={handleInput} required
                         className="focus:ring-2 focus:ring-blue-500"/>
                </div>
                <div className="space-y-2 transition-all duration-300">
                  <Label htmlFor="wakeTime" className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-amber-500 animate-pulse" />
                    Wake Time
                  </Label>
                  <Input id="wakeTime" name="wakeTime" type="time" value={formData.wakeTime} onChange={handleInput} required
                         className="focus:ring-2 focus:ring-amber-500"/>
                </div>
              </div>
              <div className="flex items-center justify-center py-2 px-4 bg-primary/5 rounded-lg border transition-all duration-300 hover:bg-primary/10">
                <Clock className="h-5 w-5 text-primary mr-2 animate-pulse" />
                <span className="text-xl font-bold">{calculatedDuration}</span>
                <span className="text-sm text-muted-foreground ml-2">Total Sleep</span>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 animate-pulse" />
                    Sleep Quality
                  </Label>
                  <div className="space-y-1">
                    <Slider value={[formData.sleepQuality]} min={1} max={10} step={1}
                            onValueChange={(value) => handleSliderChange('sleepQuality', value)}
                            className="transition-all duration-300" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                </div>

                {/* Sleep Efficiency Score */}
                <div className="p-4 bg-primary/5 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary animate-pulse" />
                      Sleep Efficiency
                    </Label>
                    <Badge>{formData.sleepEfficiency}%</Badge>
                  </div>
                  <div className="space-y-4">
                    {/* Time to Fall Asleep */}
                    <div className="space-y-2">
                      <Label htmlFor="timeToFallAsleep" className="text-sm text-muted-foreground">
                        Time to Fall Asleep (minutes)
                      </Label>
                      <Input
                        id="timeToFallAsleep"
                        name="timeToFallAsleep" // Add name attribute
                        type="number"
                        min="0"
                        max="180"
                        value={formData.timeToFallAsleep ?? ''}
                        onChange={handleInput} // Use generic handler
                      />
                    </div>

                    {/* Night Wakings */}
                    <div className="space-y-2">
                      <Label htmlFor="nightWakings" className="text-sm text-muted-foreground">
                        Number of Night Wakings
                      </Label>
                      <Input
                        id="nightWakings"
                        name="nightWakings" // Add name attribute
                        type="number"
                        min="0"
                        value={formData.nightWakings ?? ''}
                        onChange={handleInput} // Use generic handler
                      />
                    </div>
                  </div>
                </div>

                 {/* Collapsible Advanced Metrics */}
                 <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                    <CollapsibleTrigger asChild>
                       <Button variant="ghost" className="w-full justify-start px-0 text-primary hover:text-primary/80">
                         {showAdvanced ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                         Advanced Sleep Metrics (Optional)
                       </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 pt-2 pl-2 border-l-2 border-primary/20">
                       {/* Sleep Cycle Analysis */}
                       <div className="p-4 bg-muted/30 rounded-lg border">
                         <Label className="flex items-center gap-2 mb-4 text-sm font-medium">
                           <Moon className="h-4 w-4" /> Sleep Cycle Analysis
                         </Label>
                         <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Total Sleep Cycles</span>
                              <Input name="totalSleepCycles" type="number" min="0" max="10" value={formData.totalSleepCycles ?? ''} onChange={handleInput} className="w-20"/>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-2"><Label className="text-xs">Deep Sleep %</Label><Input name="deepSleepPercentage" type="number" min="0" max="100" value={formData.deepSleepPercentage ?? ''} onChange={handleInput} /></div>
                              <div className="space-y-2"><Label className="text-xs">REM Sleep %</Label><Input name="remSleepPercentage" type="number" min="0" max="100" value={formData.remSleepPercentage ?? ''} onChange={handleInput} /></div>
                              <div className="space-y-2"><Label className="text-xs">Light Sleep %</Label><Input name="lightSleepPercentage" type="number" min="0" max="100" value={formData.lightSleepPercentage ?? ''} onChange={handleInput} /></div>
                              <div className="space-y-2"><Label className="text-xs">Awake %</Label><Input name="awakeSleepPercentage" type="number" min="0" max="100" value={formData.awakeSleepPercentage ?? ''} onChange={handleInput} /></div>
                            </div>
                         </div>
                       </div>
                    </CollapsibleContent>
                 </Collapsible>

                 {/* Collapsible Environmental Factors */}
                 <Collapsible open={showEnvironment} onOpenChange={setShowEnvironment}>
                    <CollapsibleTrigger asChild>
                       <Button variant="ghost" className="w-full justify-start px-0 text-primary hover:text-primary/80">
                         {showEnvironment ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                         Sleep Environment (Optional)
                       </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 pt-2 pl-2 border-l-2 border-primary/20">
                       <div className="p-4 bg-muted/30 rounded-lg border">
                         <Label className="flex items-center gap-2 mb-4 text-sm font-medium">
                           <Wind className="h-4 w-4" /> Sleep Environment
                         </Label>
                         <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2"><Label className="text-xs">Temperature (°C)</Label><Input name="room_temperature" type="number" min="10" max="35" value={formData.room_temperature ?? ''} onChange={handleInput} /></div>
                            <div className="space-y-2"><Label className="text-xs">Brightness (1-5)</Label><Input name="room_brightness" type="number" min="1" max="5" value={formData.room_brightness ?? ''} onChange={handleInput} /></div>
                            <div className="space-y-2"><Label className="text-xs">Noise Level (1-5)</Label><Input name="room_noise_level" type="number" min="1" max="5" value={formData.room_noise_level ?? ''} onChange={handleInput} /></div>
                         </div>
                       </div>
                    </CollapsibleContent>
                 </Collapsible>
              </div>

              {/* Pre-Sleep Notes */}
              <div className="space-y-2 transition-all duration-300">
                <Label htmlFor="pre_sleep_notes">Pre-Sleep Routine & Notes</Label>
                <Textarea
                  id="pre_sleep_notes"
                  name="pre_sleep_notes"
                  value={formData.pre_sleep_notes || ''}
                  onChange={handleInput}
                  placeholder="What did you do before bed? (e.g., read, watched TV, meditation)"
                  rows={3}
                  className="focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Night Shift Toggle */}
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="night-shift"
                  checked={formData.is_night_shift_sleep ?? false}
                  onCheckedChange={(checked) => handleSwitchChange('is_night_shift_sleep', checked)}
                  className="data-[state=checked]:bg-primary"
                />
                <Label htmlFor="night-shift" className="flex items-center gap-1 cursor-pointer">
                  <Briefcase className="h-4 w-4 animate-pulse" />
                  Night Shift Sleep?
                </Label>
              </div>
            </div>

            {/* Right Column: Factors & Additional Metrics */}
            <div className="space-y-4">
              {/* Factors Affecting Sleep */}
              <div className="space-y-2">
                <Label>Factors Affecting Sleep (Optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {sleepFactorsOptions.map(factor => (
                    <Button
                      key={factor.id}
                      type="button"
                      variant={formData.sleep_factors?.includes(factor.id) ? "secondary" : "outline"}
                      size="sm"
                      className={`flex items-center gap-1 transition-all duration-300 hover:scale-105
                                ${formData.sleep_factors?.includes(factor.id) ? 'animate-pulse' : ''}`}
                      onClick={() => handleFactorChange(factor.id)}
                    >
                      {factor.icon}
                      {factor.label}
                    </Button>
                  ))}
                </div>
              </div>

               {/* Collapsible Contextual Factors */}
               <Collapsible open={showContext} onOpenChange={setShowContext}>
                  <CollapsibleTrigger asChild>
                     <Button variant="ghost" className="w-full justify-start px-0 text-primary hover:text-primary/80">
                       {showContext ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                       Contextual Factors (Optional)
                     </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-2 pl-2 border-l-2 border-primary/20">
                     {/* Other Metrics */}
                     <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2"><Label htmlFor="caffeine_mg" className="flex items-center gap-1 text-xs"><Coffee className="h-3 w-3" /> Caffeine (mg)</Label><Input id="caffeine_mg" name="caffeine_mg" type="number" min="0" value={formData.caffeine_mg ?? ''} onChange={handleInput} /></div>
                        <div className="space-y-2"><Label htmlFor="alcohol_drinks" className="flex items-center gap-1 text-xs"><Wine className="h-3 w-3" /> Alcohol (drinks)</Label><Input id="alcohol_drinks" name="alcohol_drinks" type="number" min="0" step="0.5" value={formData.alcohol_drinks ?? ''} onChange={handleInput} /></div>
                        <div className="space-y-2"><Label htmlFor="exercise_minutes" className="flex items-center gap-1 text-xs"><Activity className="h-3 w-3" /> Exercise (min)</Label><Input id="exercise_minutes" name="exercise_minutes" type="number" min="0" value={formData.exercise_minutes ?? ''} onChange={handleInput} /></div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label className="flex items-center gap-1 text-xs"><BrainIcon className="h-3 w-3" /> Stress Level</Label><Slider value={[formData.stress_level ?? 5]} min={1} max={10} step={1} onValueChange={(value) => handleSliderChange('stress_level', value)} /></div>
                        <div className="space-y-2"><Label className="flex items-center gap-1 text-xs"><Sun className="h-3 w-3" /> Morning Mood</Label><Slider value={[formData.mood_rating ?? 7]} min={1} max={10} step={1} onValueChange={(value) => handleSliderChange('mood_rating', value)} /></div>
                     </div>
                  </CollapsibleContent>
               </Collapsible>

              <div className="space-y-2 transition-all duration-300">
                <Label htmlFor="screen_time_minutes" className="flex items-center gap-1 text-xs">
                  <Smartphone className="h-3 w-3 animate-pulse" />
                  Screen Time Before Bed
                </Label>
                <Select
                  value={String(formData.screen_time_minutes ?? 30)}
                  onValueChange={(value) => handleSelectChange('screen_time_minutes', value)}
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 transition-all duration-300">
                <Label htmlFor="notes">General Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInput}
                  placeholder="Any dreams, disruptions, or other observations?"
                  rows={3}
                  className="focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Sleep Log'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
