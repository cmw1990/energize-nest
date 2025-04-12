
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sleep, AlarmClock, Moon, Sun, CloudMoon, Coffee, WineOff, Utensils, Milestone } from "lucide-react";
import { format } from "date-fns";

type SleepLogEntry = {
  id?: string;
  user_id: string;
  date: string;
  bedtime: string;
  wake_time: string;
  sleep_duration: number;
  sleep_quality: number;
  deep_percentage?: number;
  rem_percentage?: number;
  light_percentage?: number;
  awake_percentage?: number;
  interruptions?: number;
  caffeine_consumption?: string;
  alcohol_consumption?: string;
  evening_meal_time?: string;
  exercise?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

const SleepLogEntry = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form state
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [bedtime, setBedtime] = useState("22:30");
  const [wakeTime, setWakeTime] = useState("06:30");
  const [sleepQuality, setSleepQuality] = useState(7);
  const [interruptions, setInterruptions] = useState(0);
  const [caffeine, setCaffeine] = useState("none");
  const [alcohol, setAlcohol] = useState("none");
  const [mealTime, setMealTime] = useState("3+ hours before bed");
  const [exercise, setExercise] = useState("none");
  const [notes, setNotes] = useState("");
  
  // Helper function to calculate sleep duration
  const calculateSleepDuration = () => {
    const [bedHour, bedMinute] = bedtime.split(":").map(Number);
    const [wakeHour, wakeMinute] = wakeTime.split(":").map(Number);
    
    let bedTimeMinutes = bedHour * 60 + bedMinute;
    let wakeTimeMinutes = wakeHour * 60 + wakeMinute;
    
    // Handle sleeping past midnight
    if (wakeTimeMinutes < bedTimeMinutes) {
      wakeTimeMinutes += 24 * 60; // Add 24 hours
    }
    
    const durationMinutes = wakeTimeMinutes - bedTimeMinutes;
    return parseFloat((durationMinutes / 60).toFixed(1)); // Convert to hours with 1 decimal
  };
  
  // Fetch latest sleep log to pre-fill the form (optional)
  const { data: latestLog, isLoading } = useQuery({
    queryKey: ["latest_sleep_log", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("sleep_logs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("date", { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching latest sleep log:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user?.id,
    // Don't auto-fill the form with the latest log, just use it for reference
    // onSuccess: (data) => {
    //   if (data) {
    //     setDate(data.date);
    //     setBedtime(data.bedtime);
    //     setWakeTime(data.wake_time);
    //     setSleepQuality(data.sleep_quality);
    //     setInterruptions(data.interruptions || 0);
    //     setCaffeine(data.caffeine_consumption || "none");
    //     setAlcohol(data.alcohol_consumption || "none");
    //     setMealTime(data.evening_meal_time || "3+ hours before bed");
    //     setExercise(data.exercise || "none");
    //     setNotes(data.notes || "");
    //   }
    // }
  });
  
  // Save sleep log
  const saveSleepLog = useMutation({
    mutationFn: async (logData: Omit<SleepLogEntry, "id" | "created_at" | "updated_at">) => {
      if (!session?.user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("sleep_logs")
        .insert([{ ...logData, user_id: session.user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleep_logs"] });
      queryClient.invalidateQueries({ queryKey: ["latest_sleep_log"] });
      toast({
        title: "Sleep log saved",
        description: "Your sleep log has been recorded successfully.",
      });
      
      // Reset form fields except date (which stays current)
      setDate(format(new Date(), "yyyy-MM-dd"));
    },
    onError: (error) => {
      toast({
        title: "Error saving sleep log",
        description: "There was an error saving your sleep log. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving sleep log:", error);
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate sleep duration
    const sleepDuration = calculateSleepDuration();
    
    // Create sleep log entry
    const sleepLog: Omit<SleepLogEntry, "id" | "created_at" | "updated_at"> = {
      user_id: session?.user?.id || "",
      date,
      bedtime,
      wake_time: wakeTime,
      sleep_duration: sleepDuration,
      sleep_quality: sleepQuality,
      interruptions,
      caffeine_consumption: caffeine,
      alcohol_consumption: alcohol,
      evening_meal_time: mealTime,
      exercise,
      notes,
      // Mock percentages based on quality (in a real app, these would come from sleep tracking device)
      deep_percentage: Math.min(25, sleepQuality * 2), // Higher quality = more deep sleep, max 25%
      rem_percentage: Math.min(25, sleepQuality * 2.2), // Higher quality = more REM sleep, max 25%
      light_percentage: 100 - Math.min(25, sleepQuality * 2) - Math.min(25, sleepQuality * 2.2) - Math.max(0, 10 - sleepQuality), // Remaining percentage
      awake_percentage: Math.max(0, 10 - sleepQuality), // Lower quality = more awake time
    };
    
    saveSleepLog.mutate(sleepLog);
  };
  
  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Milestone className="h-4 w-4" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={format(new Date(), "yyyy-MM-dd")}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bedtime" className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Bedtime
            </Label>
            <Input
              id="bedtime"
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wake-time" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Wake Time
            </Label>
            <Input
              id="wake-time"
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sleep-quality" className="flex items-center gap-2">
              <Sleep className="h-4 w-4" />
              Sleep Quality: {sleepQuality}/10
            </Label>
            <Slider
              id="sleep-quality"
              value={[sleepQuality]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => setSleepQuality(value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="interruptions" className="flex items-center gap-2">
              <AlarmClock className="h-4 w-4" />
              Sleep Interruptions: {interruptions}
            </Label>
            <Slider
              id="interruptions"
              value={[interruptions]}
              min={0}
              max={10}
              step={1}
              onValueChange={(value) => setInterruptions(value[0])}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="caffeine" className="flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              Caffeine Consumption
            </Label>
            <Select value={caffeine} onValueChange={setCaffeine}>
              <SelectTrigger id="caffeine">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="morning">Morning only</SelectItem>
                <SelectItem value="afternoon">Afternoon (before 2pm)</SelectItem>
                <SelectItem value="evening">Evening (after 2pm)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alcohol" className="flex items-center gap-2">
              <WineOff className="h-4 w-4" />
              Alcohol Consumption
            </Label>
            <Select value={alcohol} onValueChange={setAlcohol}>
              <SelectTrigger id="alcohol">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="light">Light (1 drink)</SelectItem>
                <SelectItem value="moderate">Moderate (2 drinks)</SelectItem>
                <SelectItem value="heavy">Heavy (3+ drinks)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="meal-time" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Evening Meal Timing
            </Label>
            <Select value={mealTime} onValueChange={setMealTime}>
              <SelectTrigger id="meal-time">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3+ hours before bed">3+ hours before bed</SelectItem>
                <SelectItem value="2-3 hours before bed">2-3 hours before bed</SelectItem>
                <SelectItem value="1-2 hours before bed">1-2 hours before bed</SelectItem>
                <SelectItem value="less than 1 hour before bed">Less than 1 hour before bed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="exercise" className="flex items-center gap-2">
              <CloudMoon className="h-4 w-4" />
              Evening Exercise
            </Label>
            <Select value={exercise} onValueChange={setExercise}>
              <SelectTrigger id="exercise">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="light">Light (e.g., walking)</SelectItem>
                <SelectItem value="moderate">Moderate (e.g., yoga)</SelectItem>
                <SelectItem value="intense">Intense (e.g., HIIT, running)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about your sleep..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={saveSleepLog.isPending}>
        {saveSleepLog.isPending ? "Saving..." : "Log Sleep"}
      </Button>
    </form>
  );
};

export default SleepLogEntry;
