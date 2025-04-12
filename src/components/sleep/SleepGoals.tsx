
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { Clock, Calendar, Moon, Target, Check } from "lucide-react";

type SleepGoal = {
  id: string;
  user_id: string;
  target_duration: number;
  target_bedtime: string;
  target_wake_time: string;
  sleep_quality_goal: number;
  deep_sleep_goal: number;
  created_at: string;
  updated_at: string;
};

const timeStringToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const SleepGoals = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Default values for a new sleep goal
  const [targetDuration, setTargetDuration] = useState(8);
  const [targetBedtime, setTargetBedtime] = useState("22:30");
  const [targetWakeTime, setTargetWakeTime] = useState("06:30");
  const [sleepQualityGoal, setSleepQualityGoal] = useState(8);
  const [deepSleepGoal, setDeepSleepGoal] = useState(20);
  
  // Fetch current sleep goals
  const { data: sleepGoal, isLoading } = useQuery({
    queryKey: ["sleep_goals", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("sleep_goals")
        .select("*")
        .eq("user_id", session.user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching sleep goals:", error);
        return null;
      }
      
      // If a goal exists, update the state with the goal values
      if (data) {
        setTargetDuration(data.target_duration);
        setTargetBedtime(data.target_bedtime);
        setTargetWakeTime(data.target_wake_time);
        setSleepQualityGoal(data.sleep_quality_goal);
        setDeepSleepGoal(data.deep_sleep_goal);
      }
      
      return data;
    },
    enabled: !!session?.user?.id
  });
  
  // Save/update sleep goals
  const saveSleepGoal = useMutation({
    mutationFn: async (values: Omit<SleepGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!session?.user?.id) throw new Error("User not authenticated");
      
      const goalData = {
        ...values,
        user_id: session.user.id,
      };
      
      if (sleepGoal?.id) {
        // Update existing goal
        const { error } = await supabase
          .from("sleep_goals")
          .update(goalData)
          .eq("id", sleepGoal.id);
        
        if (error) throw error;
        return { ...sleepGoal, ...goalData };
      } else {
        // Create new goal
        const { data, error } = await supabase
          .from("sleep_goals")
          .insert([goalData])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleep_goals"] });
      toast({
        title: "Sleep goals saved",
        description: "Your sleep goals have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving sleep goals",
        description: "There was an error saving your sleep goals. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving sleep goals:", error);
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    saveSleepGoal.mutate({
      target_duration: targetDuration,
      target_bedtime: targetBedtime,
      target_wake_time: targetWakeTime,
      sleep_quality_goal: sleepQualityGoal,
      deep_sleep_goal: deepSleepGoal,
    });
  };
  
  // Calculate wake time based on bedtime and duration
  const calculateWakeTime = () => {
    const bedtimeMinutes = timeStringToMinutes(targetBedtime);
    const durationMinutes = targetDuration * 60;
    let wakeTimeMinutes = bedtimeMinutes + durationMinutes;
    
    // Handle overnight
    if (wakeTimeMinutes >= 24 * 60) {
      wakeTimeMinutes -= 24 * 60;
    }
    
    return minutesToTimeString(wakeTimeMinutes);
  };
  
  // Update wake time when bedtime or duration changes
  const updateWakeTime = () => {
    setTargetWakeTime(calculateWakeTime());
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Sleep Goals
          </CardTitle>
          <CardDescription>
            Set your sleep targets to improve your sleep quality and consistency
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center p-4">Loading your sleep goals...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="target-duration" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Target Sleep Duration: {targetDuration} hours
                  </Label>
                  <Slider
                    id="target-duration"
                    value={[targetDuration]}
                    min={5}
                    max={12}
                    step={0.5}
                    onValueChange={(value) => {
                      setTargetDuration(value[0]);
                      // Recalculate wake time when duration changes
                      setTimeout(updateWakeTime, 0);
                    }}
                  />
                  <p className="text-sm text-muted-foreground">
                    Recommended: 7-9 hours for adults
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target-bedtime" className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Target Bedtime
                    </Label>
                    <Input
                      id="target-bedtime"
                      type="time"
                      value={targetBedtime}
                      onChange={(e) => {
                        setTargetBedtime(e.target.value);
                        // Recalculate wake time when bedtime changes
                        setTimeout(updateWakeTime, 0);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="target-wake-time" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Target Wake Time
                    </Label>
                    <Input
                      id="target-wake-time"
                      type="time"
                      value={targetWakeTime}
                      onChange={(e) => setTargetWakeTime(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sleep-quality-goal" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Sleep Quality Goal: {sleepQualityGoal}/10
                  </Label>
                  <Slider
                    id="sleep-quality-goal"
                    value={[sleepQualityGoal]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setSleepQualityGoal(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deep-sleep-goal" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Deep Sleep Goal: {deepSleepGoal}%
                  </Label>
                  <Slider
                    id="deep-sleep-goal"
                    value={[deepSleepGoal]}
                    min={10}
                    max={40}
                    step={1}
                    onValueChange={(value) => setDeepSleepGoal(value[0])}
                  />
                  <p className="text-sm text-muted-foreground">
                    Healthy range: 15-25% of total sleep time
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="flex items-center gap-2"
                  disabled={saveSleepGoal.isPending}
                >
                  <Check className="h-4 w-4" />
                  {sleepGoal ? "Update Goals" : "Save Goals"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>Sleep Goal Recommendations</CardTitle>
          <CardDescription>
            Based on scientific research on optimal sleep patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Sleep Duration
                </h3>
                <p className="text-sm text-muted-foreground">
                  Adults (26-64): 7-9 hours<br />
                  Older Adults (65+): 7-8 hours<br />
                  Young Adults (18-25): 7-9 hours
                </p>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Moon className="h-4 w-4 text-primary" />
                  Sleep Composition
                </h3>
                <p className="text-sm text-muted-foreground">
                  Deep Sleep: 15-25%<br />
                  REM Sleep: 20-25%<br />
                  Light Sleep: 50-60%
                </p>
              </div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Consistency Tips
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Maintain the same sleep schedule even on weekends</li>
                <li>• Limit daytime naps to 30 minutes</li>
                <li>• Avoid caffeine and alcohol before bedtime</li>
                <li>• Create a relaxing bedtime routine</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepGoals;
