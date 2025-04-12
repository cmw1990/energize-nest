import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Calendar as CalendarIcon, Clock, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function SleepLogEntry() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date>(new Date());
  const [bedtime, setBedtime] = useState("22:30");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepQuality, setSleepQuality] = useState(3);
  const [notes, setNotes] = useState("");
  const [sleepFactors, setSleepFactors] = useState<string[]>([]);

  const factors = [
    { id: "exercise", label: "Exercise", icon: "🏃‍♂️" },
    { id: "caffeine", label: "Caffeine", icon: "☕" },
    { id: "screen", label: "Screen Time", icon: "📱" },
    { id: "stress", label: "Stress", icon: "😓" },
    { id: "alcohol", label: "Alcohol", icon: "🍷" },
    { id: "food", label: "Late Meal", icon: "🍽️" },
    { id: "noise", label: "Noise", icon: "🔊" },
    { id: "temperature", label: "Temperature", icon: "🌡️" },
  ];

  const toggleFactor = (id: string) => {
    if (sleepFactors.includes(id)) {
      setSleepFactors(sleepFactors.filter((f) => f !== id));
    } else {
      setSleepFactors([...sleepFactors, id]);
    }
  };

  const { data: existingLog, isLoading } = useQuery({
    queryKey: ['sleep-log', format(date, 'yyyy-MM-dd')],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('sleep_tracking')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('date', format(date, 'yyyy-MM-dd'))
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
    onSuccess: (data) => {
      if (data) {
        setBedtime(data.bedtime || "22:30");
        setWakeTime(data.wake_time || "07:00");
        setSleepQuality(data.sleep_quality || 3);
        setNotes(data.notes || "");
        setSleepFactors(data.factors || []);
      }
    }
  });

  const saveSleepLog = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) return;
      
      const sleepData = {
        user_id: session.user.id,
        date: format(date, 'yyyy-MM-dd'),
        bedtime,
        wake_time: wakeTime,
        sleep_quality: sleepQuality,
        notes,
        factors: sleepFactors,
        duration_minutes: calculateSleepDuration(bedtime, wakeTime),
      };

      // If we have an existing log for this date, update it
      if (existingLog) {
        const { error } = await supabase
          .from('sleep_tracking')
          .update(sleepData)
          .eq('id', existingLog.id);
        
        if (error) throw error;
      } else {
        // Otherwise insert a new log
        const { error } = await supabase
          .from('sleep_tracking')
          .insert([sleepData]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep-log'] });
      queryClient.invalidateQueries({ queryKey: ['sleep-stats'] });
      toast({
        title: existingLog ? "Sleep log updated" : "Sleep log saved",
        description: "Your sleep data has been recorded",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving sleep log",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const calculateSleepDuration = (bedtime: string, wakeTime: string): number => {
    const [bedHour, bedMinute] = bedtime.split(':').map(Number);
    const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
    
    let bedMinutes = bedHour * 60 + bedMinute;
    let wakeMinutes = wakeHour * 60 + wakeMinute;
    
    // If bedtime is later than wake time, add 24 hours to wake time
    if (bedMinutes > wakeMinutes) {
      wakeMinutes += 24 * 60;
    }
    
    return wakeMinutes - bedMinutes;
  };

  const getSleepDurationString = () => {
    const minutes = calculateSleepDuration(bedtime, wakeTime);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-indigo-500" />
          Record Your Sleep
        </CardTitle>
        <CardDescription>
          Track your sleep patterns to improve your rest quality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Bedtime</Label>
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Wake Time</Label>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Sleep Quality</Label>
            <span className="text-sm font-medium">
              {sleepQuality}/5
            </span>
          </div>
          <Slider
            value={[sleepQuality]}
            onValueChange={([value]) => setSleepQuality(value)}
            min={1}
            max={5}
            step={1}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Poor</span>
            <span>Fair</span>
            <span>Good</span>
            <span>Very Good</span>
            <span>Excellent</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Factors that affected your sleep</Label>
          <div className="grid grid-cols-4 gap-2">
            {factors.map((factor) => (
              <Button
                key={factor.id}
                type="button"
                variant={sleepFactors.includes(factor.id) ? "default" : "outline"}
                className="h-auto py-2 flex flex-col gap-1"
                onClick={() => toggleFactor(factor.id)}
              >
                <span>{factor.icon}</span>
                <span className="text-xs">{factor.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            placeholder="Any additional notes about your sleep..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Sleep Duration: {getSleepDurationString()}
            </span>
          </div>
          <Button
            onClick={() => saveSleepLog.mutate()}
            disabled={saveSleepLog.isPending}
          >
            {existingLog ? "Update" : "Save"} Sleep Log
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
