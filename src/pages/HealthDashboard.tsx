import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Activity,
  Brain,
  Calendar,
  Heart,
  LineChart,
  Stethoscope,
  Moon,
  Plus,
  Sun,
  Utensils,
  Weight
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { EnergyPatternAnalysis } from '@/components/health/EnergyPatternAnalysis'; // Import the component

interface HealthMetric {
  id: string;
  user_id: string;
  created_at: string;
  date: string;
  mood_rating: number;
  energy_level: number;
  stress_level: number;
  sleep_hours: number;
  sleep_quality: number;
  exercise_minutes: number;
  water_intake: number;
  meditation_minutes: number;
  weight?: number;
  blood_pressure_sys?: number;
  blood_pressure_dia?: number;
  heart_rate?: number;
  body_temperature?: number;
  symptoms?: string[];
  notes?: string;
}

const HealthDashboard = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');
  const [viewingMetric, setViewingMetric] = useState<'mood' | 'energy' | 'stress' | 'sleep'>('mood');

  const [newLog, setNewLog] = useState({
    mood_rating: 5,
    energy_level: 5,
    stress_level: 5,
    sleep_hours: 7,
    sleep_quality: 5,
    exercise_minutes: 30,
    water_intake: 8,
    meditation_minutes: 10,
    weight: '',
    blood_pressure_sys: '',
    blood_pressure_dia: '',
    heart_rate: '',
    body_temperature: '',
    symptoms: '',
    notes: '',
  });

  const { data: healthMetrics, isLoading } = useQuery({
    queryKey: ['health_metrics', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(); // Use maybeSingle to handle no rows found gracefully

      if (error && error.code !== 'PGRST116') throw error; // Ignore 'No rows found' error
      return data as HealthMetric | null;
    },
    enabled: !!session?.user?.id,
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['health_metrics_history', session?.user?.id, chartPeriod],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const daysAgo = chartPeriod === 'week' ? 7 : 30;
      const startDate = format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('date', startDate)
        .order('date', { ascending: true });

      if (error) throw error;

      return data.map((metric: HealthMetric) => ({
        date: format(new Date(metric.date), 'MMM dd'),
        mood: metric.mood_rating,
        energy: metric.energy_level,
        stress: metric.stress_level,
        sleep: metric.sleep_quality,
        sleepHours: metric.sleep_hours,
      }));
    },
    enabled: !!session?.user?.id,
  });

  const createLogMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const today = new Date().toISOString().split('T')[0];

      const { data: existingEntry, error: checkError } = await supabase
        .from('health_metrics')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('date', today)
        .maybeSingle();

      if (checkError) throw checkError;

      const symptomsArray = newLog.symptoms
        ? newLog.symptoms.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const metricData = {
        user_id: session.user.id,
        date: today,
        mood_rating: newLog.mood_rating,
        energy_level: newLog.energy_level,
        stress_level: newLog.stress_level,
        sleep_hours: newLog.sleep_hours,
        sleep_quality: newLog.sleep_quality,
        exercise_minutes: newLog.exercise_minutes,
        water_intake: newLog.water_intake,
        meditation_minutes: newLog.meditation_minutes,
        weight: newLog.weight ? parseFloat(newLog.weight) : null,
        blood_pressure_sys: newLog.blood_pressure_sys ? parseInt(newLog.blood_pressure_sys) : null,
        blood_pressure_dia: newLog.blood_pressure_dia ? parseInt(newLog.blood_pressure_dia) : null,
        heart_rate: newLog.heart_rate ? parseInt(newLog.heart_rate) : null,
        body_temperature: newLog.body_temperature ? parseFloat(newLog.body_temperature) : null,
        symptoms: symptomsArray.length > 0 ? symptomsArray : null,
        notes: newLog.notes || null,
      };

      if (existingEntry) {
        const { error: updateError } = await supabase
          .from('health_metrics')
          .update(metricData)
          .eq('id', existingEntry.id);

        if (updateError) throw updateError;
        return 'updated';
      } else {
        const { error: insertError } = await supabase
          .from('health_metrics')
          .insert([metricData]);

        if (insertError) throw insertError;
        return 'created';
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['health_metrics'] });
      queryClient.invalidateQueries({ queryKey: ['health_metrics_history'] });

      toast({
        title: `Health log ${result}`,
        description: `Your health metrics have been ${result} successfully.`,
      });

      setLogDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error logging health metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to log health metrics. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleLogSubmit = () => {
    createLogMutation.mutate();
  };

  const getWellnessStatus = (value: number) => {
    if (value <= 3) return 'Needs Attention';
    if (value <= 7) return 'Good';
    return 'Excellent';
  };

  const getWellnessColor = (value: number) => {
    if (value <= 3) return 'text-red-500';
    if (value <= 7) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getDaysSinceLastLog = () => {
    if (!healthMetrics?.date) return 'Never';

    const lastLogDate = new Date(healthMetrics.date);
    const today = new Date();

    lastLogDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastLogDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Health Dashboard</h1>
          <p className="text-muted-foreground">
            Last updated: {healthMetrics ? getDaysSinceLastLog() : 'Never'}
          </p>
        </div>
        <Button onClick={() => setLogDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Log Health Metrics
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading health metrics...</div>
      ) : healthMetrics ? (
        <>
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Mood</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {healthMetrics.mood_rating}/10
                </div>
                <p className={`text-sm ${getWellnessColor(healthMetrics.mood_rating)}`}>
                  {getWellnessStatus(healthMetrics.mood_rating)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Energy</CardTitle>
                  <Sun className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {healthMetrics.energy_level}/10
                </div>
                <p className={`text-sm ${getWellnessColor(healthMetrics.energy_level)}`}>
                  {getWellnessStatus(healthMetrics.energy_level)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Stress</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {healthMetrics.stress_level}/10
                </div>
                <p className={`text-sm ${getWellnessColor(10 - healthMetrics.stress_level)}`}>
                  {healthMetrics.stress_level <= 3 ? 'Low' : healthMetrics.stress_level <= 7 ? 'Moderate' : 'High'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Sleep</CardTitle>
                  <Moon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {healthMetrics.sleep_hours} hours
                </div>
                <p className={`text-sm ${getWellnessColor(healthMetrics.sleep_quality)}`}>
                  Quality: {healthMetrics.sleep_quality}/10
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chart and Other Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Health Trends</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={chartPeriod === 'week' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartPeriod('week')}
                    >
                      Week
                    </Button>
                    <Button
                      variant={chartPeriod === 'month' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartPeriod('month')}
                    >
                      Month
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Tracking your {
                    viewingMetric === 'mood' ? 'mood' :
                    viewingMetric === 'energy' ? 'energy levels' :
                    viewingMetric === 'stress' ? 'stress levels' :
                    'sleep quality'
                  } over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {chartLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <p>Loading chart data...</p>
                  </div>
                ) : chartData && chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      {viewingMetric === 'mood' && (
                        <Line
                          type="monotone"
                          dataKey="mood"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          name="Mood"
                        />
                      )}
                      {viewingMetric === 'energy' && (
                        <Line
                          type="monotone"
                          dataKey="energy"
                          stroke="#82ca9d"
                          activeDot={{ r: 8 }}
                          name="Energy"
                        />
                      )}
                      {viewingMetric === 'stress' && (
                        <Line
                          type="monotone"
                          dataKey="stress"
                          stroke="#ff7300"
                          activeDot={{ r: 8 }}
                          name="Stress"
                        />
                      )}
                      {viewingMetric === 'sleep' && (
                        <>
                          <Line
                            type="monotone"
                            dataKey="sleep"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                            name="Sleep Quality"
                          />
                          <Line
                            type="monotone"
                            dataKey="sleepHours"
                            stroke="#82ca9d"
                            name="Sleep Hours"
                          />
                        </>
                      )}
                    </RechartsLineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">
                      Not enough data to display chart. Log your health metrics regularly to see trends.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex flex-wrap gap-2 w-full">
                  <Button
                    variant={viewingMetric === 'mood' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewingMetric('mood')}
                    className="flex-1"
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    Mood
                  </Button>
                  <Button
                    variant={viewingMetric === 'energy' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewingMetric('energy')}
                    className="flex-1"
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Energy
                  </Button>
                  <Button
                    variant={viewingMetric === 'stress' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewingMetric('stress')}
                    className="flex-1"
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    Stress
                  </Button>
                  <Button
                    variant={viewingMetric === 'sleep' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewingMetric('sleep')}
                    className="flex-1"
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Sleep
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Other Metrics</CardTitle>
                <CardDescription>
                  Your additional health data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center">
                      <Utensils className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Water</span>
                    </div>
                    <p className="text-xl font-semibold mt-1">
                      {healthMetrics.water_intake} glasses
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Exercise</span>
                    </div>
                    <p className="text-xl font-semibold mt-1">
                      {healthMetrics.exercise_minutes} min
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center">
                      <Brain className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Meditation</span>
                    </div>
                    <p className="text-xl font-semibold mt-1">
                      {healthMetrics.meditation_minutes} min
                    </p>
                  </div>
                  {healthMetrics.weight && (
                    <div>
                      <div className="flex items-center">
                        <Weight className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">Weight</span>
                      </div>
                      <p className="text-xl font-semibold mt-1">
                        {healthMetrics.weight} kg
                      </p>
                    </div>
                  )}
                </div>

                {(healthMetrics.blood_pressure_sys && healthMetrics.blood_pressure_dia) && (
                  <div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Blood Pressure</span>
                    </div>
                    <p className="text-xl font-semibold mt-1">
                      {healthMetrics.blood_pressure_sys}/{healthMetrics.blood_pressure_dia} mmHg
                    </p>
                  </div>
                )}

                {healthMetrics.heart_rate && (
                  <div>
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Heart Rate</span>
                    </div>
                    <p className="text-xl font-semibold mt-1">
                      {healthMetrics.heart_rate} bpm
                    </p>
                  </div>
                )}

                {healthMetrics.symptoms && healthMetrics.symptoms.length > 0 && (
                  <div>
                    <div className="flex items-center mb-2">
                      <Stethoscope className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Symptoms</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {healthMetrics.symptoms.map((symptom, i) => (
                        <span
                          key={i}
                          className="bg-muted px-2 py-1 rounded-full text-xs"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {healthMetrics.notes && (
                  <div>
                    <div className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Notes</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {healthMetrics.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Energy Pattern Analysis Section */}
          <EnergyPatternAnalysis />

        </>
      ) : (
        <Card className="p-6 text-center">
          <div className="mb-4">
            <p className="text-lg font-medium mb-2">No health data recorded yet</p>
            <p className="text-muted-foreground">
              Start tracking your wellness journey by logging your health metrics.
            </p>
          </div>
          <Button onClick={() => setLogDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Log Your First Entry
          </Button>
        </Card>
      )}

      {/* Log Dialog */}
      <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Log Health Metrics</DialogTitle>
            <DialogDescription>
              Track your health metrics to monitor your wellness journey.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Mood Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Mood</Label>
                <span className="text-sm text-muted-foreground">{newLog.mood_rating}/10</span>
              </div>
              <Slider
                defaultValue={[5]} max={10} step={1} value={[newLog.mood_rating]}
                onValueChange={(vals) => setNewLog({ ...newLog, mood_rating: vals[0] })}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span><span>High</span>
              </div>
            </div>

            {/* Energy Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Energy Level</Label>
                <span className="text-sm text-muted-foreground">{newLog.energy_level}/10</span>
              </div>
              <Slider
                defaultValue={[5]} max={10} step={1} value={[newLog.energy_level]}
                onValueChange={(vals) => setNewLog({ ...newLog, energy_level: vals[0] })}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span><span>High</span>
              </div>
            </div>

            {/* Stress Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Stress Level</Label>
                <span className="text-sm text-muted-foreground">{newLog.stress_level}/10</span>
              </div>
              <Slider
                defaultValue={[5]} max={10} step={1} value={[newLog.stress_level]}
                onValueChange={(vals) => setNewLog({ ...newLog, stress_level: vals[0] })}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span><span>High</span>
              </div>
            </div>

            {/* Sleep Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sleep Hours</Label>
                <Input
                  type="number" step="0.5" min="0" max="24" value={newLog.sleep_hours}
                  onChange={(e) => setNewLog({ ...newLog, sleep_hours: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Sleep Quality</Label>
                  <span className="text-sm text-muted-foreground">{newLog.sleep_quality}/10</span>
                </div>
                <Slider
                  defaultValue={[5]} max={10} step={1} value={[newLog.sleep_quality]}
                  onValueChange={(vals) => setNewLog({ ...newLog, sleep_quality: vals[0] })}
                />
              </div>
            </div>

            {/* Exercise & Water Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Exercise (minutes)</Label>
                <Input
                  type="number" min="0" value={newLog.exercise_minutes}
                  onChange={(e) => setNewLog({ ...newLog, exercise_minutes: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Water Intake (glasses)</Label>
                <Input
                  type="number" min="0" value={newLog.water_intake}
                  onChange={(e) => setNewLog({ ...newLog, water_intake: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* Meditation Input */}
            <div className="space-y-2">
              <Label>Meditation (minutes)</Label>
              <Input
                type="number" min="0" value={newLog.meditation_minutes}
                onChange={(e) => setNewLog({ ...newLog, meditation_minutes: parseInt(e.target.value) || 0 })}
              />
            </div>

            {/* Additional Metrics Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Additional Metrics (Optional)</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input
                    type="text" value={newLog.weight}
                    onChange={(e) => setNewLog({ ...newLog, weight: e.target.value })}
                    placeholder="e.g., 70.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Heart Rate (bpm)</Label>
                  <Input
                    type="text" value={newLog.heart_rate}
                    onChange={(e) => setNewLog({ ...newLog, heart_rate: e.target.value })}
                    placeholder="e.g., 75"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Blood Pressure (systolic)</Label>
                  <Input
                    type="text" value={newLog.blood_pressure_sys}
                    onChange={(e) => setNewLog({ ...newLog, blood_pressure_sys: e.target.value })}
                    placeholder="e.g., 120"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Blood Pressure (diastolic)</Label>
                  <Input
                    type="text" value={newLog.blood_pressure_dia}
                    onChange={(e) => setNewLog({ ...newLog, blood_pressure_dia: e.target.value })}
                    placeholder="e.g., 80"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Body Temperature (°C)</Label>
                <Input
                  type="text" value={newLog.body_temperature}
                  onChange={(e) => setNewLog({ ...newLog, body_temperature: e.target.value })}
                  placeholder="e.g., 36.8"
                />
              </div>

              <div className="space-y-2">
                <Label>Symptoms (comma separated)</Label>
                <Input
                  value={newLog.symptoms}
                  onChange={(e) => setNewLog({ ...newLog, symptoms: e.target.value })}
                  placeholder="e.g., headache, fatigue, runny nose"
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={newLog.notes}
                  onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                  placeholder="Any additional notes or observations"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogSubmit} disabled={createLogMutation.isPending}>
              {createLogMutation.isPending ? 'Saving...' : 'Save Metrics'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthDashboard;
