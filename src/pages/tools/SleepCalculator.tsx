
import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Moon, Clock, Bed, AlarmClock } from "lucide-react"
import { motion } from "framer-motion"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { useToast } from "@/hooks/use-toast"

interface SleepCycle {
  bedtime: string;
  wakeTime: string;
  cycles: number;
}

export default function SleepCalculator() {
  const [wakeUpTime, setWakeUpTime] = useState("07:00");
  const [bedTime, setBedTime] = useState("");
  const [sleepCycles, setSleepCycles] = useState<SleepCycle[]>([]);
  const [calculationMode, setCalculationMode] = useState<'wakeup' | 'bedtime'>('wakeup');
  const [isAnimating, setIsAnimating] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  const averageSleepCycleDuration = 90; // minutes
  const timeToFallAsleep = 14; // minutes

  // Calculate optimal sleep times based on wake up time
  const calculateSleepTimes = () => {
    setIsAnimating(true);
    const cycles = [3, 4, 5, 6];
    const results: SleepCycle[] = [];
    
    if (calculationMode === 'wakeup') {
      // Parse wake-up time
      const [wakeHours, wakeMinutes] = wakeUpTime.split(':').map(Number);
      const wakeTimeDate = new Date();
      wakeTimeDate.setHours(wakeHours, wakeMinutes, 0, 0);
      
      // Calculate bedtimes for each cycle count
      cycles.forEach(cycle => {
        const totalSleepMinutes = cycle * averageSleepCycleDuration;
        const totalMinutesBeforeSleep = totalSleepMinutes + timeToFallAsleep;
        
        const bedTimeDate = new Date(wakeTimeDate.getTime() - totalMinutesBeforeSleep * 60 * 1000);
        const bedtime = `${String(bedTimeDate.getHours()).padStart(2, '0')}:${String(bedTimeDate.getMinutes()).padStart(2, '0')}`;
        
        results.push({
          bedtime,
          wakeTime: wakeUpTime,
          cycles: cycle
        });
      });
    } else {
      // Parse bedtime
      const [bedHours, bedMinutes] = bedTime.split(':').map(Number);
      const bedTimeDate = new Date();
      bedTimeDate.setHours(bedHours, bedMinutes, 0, 0);
      
      // Calculate wake times for each cycle count
      cycles.forEach(cycle => {
        const totalSleepMinutes = cycle * averageSleepCycleDuration;
        const totalMinutesAfterBed = totalSleepMinutes + timeToFallAsleep;
        
        const wakeTimeDate = new Date(bedTimeDate.getTime() + totalMinutesAfterBed * 60 * 1000);
        const wakeTime = `${String(wakeTimeDate.getHours()).padStart(2, '0')}:${String(wakeTimeDate.getMinutes()).padStart(2, '0')}`;
        
        results.push({
          bedtime: bedTime,
          wakeTime,
          cycles: cycle
        });
      });
    }
    
    setSleepCycles(results);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Save user's preferred sleep time to their profile
  const saveSleepPreference = async (cycleData: SleepCycle) => {
    if (!session?.user?.id) {
      toast({
        title: "Sign in Required",
        description: "Please sign in to save your sleep preferences.",
        variant: "default"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('sleep_preferences')
        .upsert({
          user_id: session.user.id,
          preferred_bedtime: cycleData.bedtime,
          preferred_wake_time: cycleData.wakeTime,
          preferred_cycles: cycleData.cycles,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Preferences Saved",
        description: "Your sleep preferences have been saved to your profile.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving sleep preferences:', error);
      toast({
        title: "Save Error",
        description: "We couldn't save your preferences. Please try again later.",
        variant: "destructive"
      });
    }
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  // Effect to calculate on mount
  useEffect(() => {
    calculateSleepTimes();
  }, []);

  return (
    <ToolAnalyticsWrapper 
      toolName="sleep-calculator"
      toolType="sleep"
      toolSettings={{ mode: calculationMode }}
    >
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container mx-auto p-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border border-primary/10 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  Sleep Cycle Calculator
                </CardTitle>
                <CardDescription>
                  Calculate optimal bedtime or wake-up time based on sleep cycles
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex flex-col md:flex-row gap-4 w-full">
                  <div className="space-y-2 w-full md:w-1/2">
                    <div className="flex items-center mb-2">
                      <Select
                        value={calculationMode}
                        onValueChange={(value) => setCalculationMode(value as 'wakeup' | 'bedtime')}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="I want to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wakeup">I need to wake up at...</SelectItem>
                          <SelectItem value="bedtime">I plan to go to sleep at...</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {calculationMode === 'wakeup' ? (
                      <div className="flex items-center space-x-2">
                        <AlarmClock className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                        <input
                          type="time"
                          value={wakeUpTime}
                          onChange={(e) => setWakeUpTime(e.target.value)}
                          className="p-2 border rounded-md border-input bg-background w-full"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Bed className="text-indigo-600 dark:text-indigo-400 h-5 w-5" />
                        <input
                          type="time"
                          value={bedTime}
                          onChange={(e) => setBedTime(e.target.value)}
                          className="p-2 border rounded-md border-input bg-background w-full"
                        />
                      </div>
                    )}
                    
                    <Button 
                      onClick={calculateSleepTimes}
                      className="w-full"
                    >
                      Calculate
                    </Button>
                  </div>
                  
                  <div className="w-full md:w-1/2 p-4 bg-secondary/10 rounded-lg">
                    <h3 className="font-medium mb-2">About Sleep Cycles</h3>
                    <p className="text-sm text-muted-foreground">
                      Sleep occurs in cycles of approximately 90 minutes. To wake up feeling refreshed, 
                      it's better to wake at the end of a cycle rather than in the middle. Most adults 
                      need 4-6 complete sleep cycles (6-9 hours) per night.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    {calculationMode === 'wakeup' ? 'Suggested Bedtimes' : 'Suggested Wake-up Times'}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {sleepCycles.map((cycle, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ 
                          opacity: isAnimating ? 0 : 1, 
                          scale: isAnimating ? 0.9 : 1 
                        }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden h-full">
                          <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                            <CardTitle className="text-md flex justify-between items-center">
                              <span>{cycle.cycles} Cycles</span>
                              <span className="text-sm font-normal text-muted-foreground">
                                {cycle.cycles * 1.5} hours
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 text-center space-y-3">
                            {calculationMode === 'wakeup' ? (
                              <div>
                                <div className="flex items-center justify-center gap-2 mb-1">
                                  <Bed className="h-4 w-4 text-primary" />
                                  <span className="font-medium">Bedtime</span>
                                </div>
                                <p className="text-xl">{formatTime(cycle.bedtime)}</p>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center justify-center gap-2 mb-1">
                                  <AlarmClock className="h-4 w-4 text-primary" />
                                  <span className="font-medium">Wake Up</span>
                                </div>
                                <p className="text-xl">{formatTime(cycle.wakeTime)}</p>
                              </div>
                            )}
                            
                            {session?.user && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="w-full"
                                onClick={() => saveSleepPreference(cycle)}
                              >
                                Save Preference
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  );
}
