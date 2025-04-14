
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { format, subDays, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { AIAssistant } from "@/components/AIAssistant";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Activity, Scale, TrendingDown, TrendingUp, Target, Calendar, AlarmClock } from "lucide-react";

interface WeightLog {
  id: string;
  user_id: string;
  weight_kg: number;
  height_m?: number;
  bmi?: number;
  log_date: string;
  measurement_type: "morning" | "evening" | "other";
  notes?: string;
  created_at: string;
}

interface WeightGoal {
  id: string;
  user_id: string;
  start_weight_kg: number;
  target_weight_kg: number;
  weekly_weight_goal_kg: number;
  goal_start_date: string;
  goal_end_date?: string;
  is_active: boolean;
}

const Weight = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [measurementType, setMeasurementType] = useState<"morning" | "evening" | "other">("morning");
  const [notes, setNotes] = useState("");
  const [goalTab, setGoalTab] = useState("track");
  
  // Goal state
  const [startWeight, setStartWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [weeklyGoal, setWeeklyGoal] = useState("0.5"); // Default to 0.5kg per week

  // Fetch weight logs
  const { data: weightLogs, isLoading } = useQuery({
    queryKey: ["weightLogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weight_logs")
        .select("*")
        .eq("user_id", session?.user.id)
        .order("log_date", { ascending: false })
        .limit(30);

      if (error) throw error;
      return data as WeightLog[];
    },
    enabled: !!session?.user.id,
  });

  // Fetch active weight goal
  const { data: weightGoal } = useQuery({
    queryKey: ["weightGoal"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nutrition_goals")
        .select("*")
        .eq("user_id", session?.user.id)
        .eq("is_active", true)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 is "no rows returned"
      return data as WeightGoal;
    },
    enabled: !!session?.user.id,
  });

  // Add weight log mutation
  const addWeightLog = useMutation({
    mutationFn: async (values: {
      weight: number;
      height?: number;
      measurementType: "morning" | "evening" | "other";
      notes?: string;
    }) => {
      // Calculate BMI if height is provided
      let bmi = undefined;
      if (values.height) {
        bmi = values.weight / (values.height * values.height);
      }

      const { error } = await supabase.from("weight_logs").insert([
        {
          user_id: session?.user.id,
          weight_kg: values.weight,
          height_m: values.height,
          bmi,
          log_date: new Date().toISOString().split('T')[0],
          measurement_type: values.measurementType,
          notes: values.notes,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weightLogs"] });
      toast({
        title: "Weight logged",
        description: "Your weight has been recorded successfully.",
      });
      setWeight("");
      setHeight("");
      setNotes("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to record weight. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding weight log:", error);
    },
  });

  // Set weight goal mutation
  const setWeightGoal = useMutation({
    mutationFn: async (values: {
      startWeight: number;
      targetWeight: number;
      weeklyGoal: number;
    }) => {
      // Calculate approximate end date based on weekly goal
      const totalWeightChange = Math.abs(values.targetWeight - values.startWeight);
      const weeksNeeded = totalWeightChange / values.weeklyGoal;
      const daysNeeded = Math.ceil(weeksNeeded * 7);
      
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + daysNeeded);

      const { error } = await supabase.from("nutrition_goals").insert([
        {
          user_id: session?.user.id,
          start_weight_kg: values.startWeight,
          target_weight_kg: values.targetWeight,
          weekly_weight_goal_kg: values.weeklyGoal,
          goal_start_date: startDate.toISOString().split('T')[0],
          goal_end_date: endDate.toISOString().split('T')[0],
          is_active: true,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weightGoal"] });
      toast({
        title: "Goal set",
        description: "Your weight goal has been set successfully.",
      });
      setStartWeight("");
      setTargetWeight("");
      setWeeklyGoal("0.5");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to set weight goal. Please try again.",
        variant: "destructive",
      });
      console.error("Error setting weight goal:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) {
      toast({
        title: "Missing weight",
        description: "Please enter your weight.",
        variant: "destructive",
      });
      return;
    }

    addWeightLog.mutate({
      weight: parseFloat(weight),
      height: height ? parseFloat(height) : undefined,
      measurementType,
      notes,
    });
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startWeight || !targetWeight || !weeklyGoal) {
      toast({
        title: "Missing values",
        description: "Please fill in all goal fields.",
        variant: "destructive",
      });
      return;
    }

    setWeightGoal.mutate({
      startWeight: parseFloat(startWeight),
      targetWeight: parseFloat(targetWeight),
      weeklyGoal: parseFloat(weeklyGoal),
    });
  };

  // Prepare chart data
  const chartData = weightLogs
    ? weightLogs
        .slice()
        .reverse()
        .map((log) => ({
          date: format(parseISO(log.log_date), "MMM dd"),
          weight: log.weight_kg,
          bmi: log.bmi,
        }))
    : [];

  // Calculate stats
  const getRecentWeightChange = () => {
    if (!weightLogs || weightLogs.length < 2) return null;
    
    const latest = weightLogs[0].weight_kg;
    const previous = weightLogs[1].weight_kg;
    return (latest - previous).toFixed(1);
  };

  const getAverageWeight = () => {
    if (!weightLogs || weightLogs.length === 0) return null;
    const sum = weightLogs.reduce((acc, log) => acc + log.weight_kg, 0);
    return (sum / weightLogs.length).toFixed(1);
  };

  const getLatestBMI = () => {
    if (!weightLogs || weightLogs.length === 0) return null;
    return weightLogs[0].bmi?.toFixed(1) || null;
  };

  const getProgressPercentage = () => {
    if (!weightGoal || !weightLogs || weightLogs.length === 0) return null;
    
    const latest = weightLogs[0].weight_kg;
    const totalChange = Math.abs(weightGoal.target_weight_kg - weightGoal.start_weight_kg);
    const currentChange = Math.abs(latest - weightGoal.start_weight_kg);
    
    return Math.min(Math.round((currentChange / totalChange) * 100), 100);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Weight Tracking</h1>
        
        {weightGoal && (
          <div className="flex items-center gap-2 bg-primary/10 p-2 rounded-lg">
            <Target className="h-5 w-5 text-primary" />
            <span className="font-medium">
              Goal: {weightGoal.target_weight_kg} kg by{" "}
              {format(parseISO(weightGoal.goal_end_date || ""), "MMM dd, yyyy")}
            </span>
          </div>
        )}
      </div>

      <Tabs defaultValue={goalTab} value={goalTab} onValueChange={setGoalTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="track">
            <Scale className="mr-2 h-4 w-4" />
            Track Weight
          </TabsTrigger>
          <TabsTrigger value="goals">
            <Target className="mr-2 h-4 w-4" />
            Set Goals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="track" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {weightLogs && weightLogs.length > 0
                    ? `${weightLogs[0].weight_kg} kg`
                    : "No data"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Recent Change
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  {getRecentWeightChange() ? (
                    <>
                      {parseFloat(getRecentWeightChange()!) > 0 ? (
                        <TrendingUp className="mr-2 h-5 w-5 text-red-500" />
                      ) : (
                        <TrendingDown className="mr-2 h-5 w-5 text-green-500" />
                      )}
                      {getRecentWeightChange()} kg
                    </>
                  ) : (
                    "No data"
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Average (30 days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getAverageWeight() ? `${getAverageWeight()} kg` : "No data"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Current BMI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getLatestBMI() || "No data"}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Log Weight</CardTitle>
                <CardDescription>
                  Track your weight to monitor progress over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        placeholder="e.g., 70.5"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">
                        Height (m) <span className="text-muted-foreground">(optional)</span>
                      </Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 1.75"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="measurementType">Measurement Type</Label>
                    <Select
                      value={measurementType}
                      onValueChange={(value) => setMeasurementType(value as "morning" | "evening" | "other")}
                    >
                      <SelectTrigger id="measurementType">
                        <SelectValue placeholder="Select measurement type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">
                      Notes <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="e.g., After workout, fasted, etc."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Scale className="mr-2 h-4 w-4" />
                    Log Weight
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent History</CardTitle>
                <CardDescription>
                  Your weight over the past 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Loading data...</p>
                  </div>
                ) : chartData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="weight"
                          stroke="#8884d8"
                          name="Weight (kg)"
                          strokeWidth={2}
                        />
                        {chartData.some((data) => data.bmi) && (
                          <Line
                            type="monotone"
                            dataKey="bmi"
                            stroke="#82ca9d"
                            name="BMI"
                            strokeWidth={2}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">No weight data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {weightLogs && weightLogs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Weight AI Insights</CardTitle>
                <CardDescription>
                  Personalized insights based on your weight trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIAssistant
                  type="weight_analytics"
                  data={{
                    weightLogs,
                    weightGoal,
                  }}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Set Weight Goal</CardTitle>
              <CardDescription>
                Define your target weight and weekly goal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGoalSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startWeight">Starting Weight (kg)</Label>
                    <Input
                      id="startWeight"
                      type="number"
                      step="0.1"
                      placeholder={weightLogs && weightLogs.length > 0 ? weightLogs[0].weight_kg.toString() : "e.g., 70.5"}
                      value={startWeight}
                      onChange={(e) => setStartWeight(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                    <Input
                      id="targetWeight"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 65.0"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weeklyGoal">Weekly Goal (kg)</Label>
                  <Select
                    value={weeklyGoal}
                    onValueChange={(value) => setWeeklyGoal(value)}
                  >
                    <SelectTrigger id="weeklyGoal">
                      <SelectValue placeholder="Select weekly goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.25">0.25 kg per week (Very Gradual)</SelectItem>
                      <SelectItem value="0.5">0.5 kg per week (Recommended)</SelectItem>
                      <SelectItem value="0.75">0.75 kg per week (Moderate)</SelectItem>
                      <SelectItem value="1">1 kg per week (Ambitious)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    A healthy rate of weight change is 0.5-1 kg per week.
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  <Target className="mr-2 h-4 w-4" />
                  Set Goal
                </Button>
              </form>

              {weightGoal && (
                <div className="mt-6 p-4 border rounded-lg space-y-4">
                  <h3 className="font-medium">Current Goal</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Start Weight</p>
                      <p className="font-medium">{weightGoal.start_weight_kg} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Target Weight</p>
                      <p className="font-medium">{weightGoal.target_weight_kg} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Weekly Goal</p>
                      <p className="font-medium">{weightGoal.weekly_weight_goal_kg} kg/week</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Target Date</p>
                      <p className="font-medium">
                        {format(parseISO(weightGoal.goal_end_date || ""), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>

                  {getProgressPercentage() !== null && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{getProgressPercentage()}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${getProgressPercentage()}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weight Goal Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <AlarmClock className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Consistency is Key</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Weigh yourself at the same time each day, preferably in the morning after using the bathroom and before eating.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Weekly Averages</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Focus on weekly trends rather than daily fluctuations, which can be affected by water retention, salt intake, and other factors.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Sustainable Change</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Aim for gradual, sustainable weight change. Rapid weight loss or gain is often difficult to maintain long-term.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Realistic Goals</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Set achievable goals that fit your lifestyle. Consider consulting with a healthcare provider before starting a weight change program.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Weight;
