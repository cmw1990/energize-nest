import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Clock, Bed, Activity, Coffee, Wine, Brain } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { format, differenceInHours, differenceInMinutes, parse } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface SleepEntry {
  id: string;
  userId: string;
  bedTime: string;
  wakeTime: string;
  sleepQuality: number;
  sleepDuration: number;
  factors: {
    caffeine?: boolean;
    exercise?: boolean;
    alcohol?: boolean;
    screenTime?: boolean;
    stress?: boolean;
  };
  notes?: string;
  createdAt: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function SleepTracker() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [bedTime, setBedTime] = useState('22:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepQuality, setSleepQuality] = useState(7);
  const [factors, setFactors] = useState({
    caffeine: false,
    exercise: false,
    alcohol: false,
    screenTime: false,
    stress: false
  });
  const [notes, setNotes] = useState('');

  // Fetch sleep history
  const { data: sleepHistory } = useQuery({
    queryKey: ['sleep-history', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sleep_entries')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data as SleepEntry[];
    },
    enabled: !!session?.user?.id
  });

  // Create sleep entry
  const createSleepEntry = useMutation({
    mutationFn: async () => {
      const bedDateTime = parse(bedTime, 'HH:mm', new Date());
      const wakeDateTime = parse(wakeTime, 'HH:mm', new Date());
      const duration = differenceInHours(wakeDateTime, bedDateTime);

      const entry = {
        user_id: session?.user?.id,
        bed_time: bedTime,
        wake_time: wakeTime,
        sleep_quality: sleepQuality,
        sleep_duration: duration,
        factors,
        notes,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('sleep_entries')
        .insert([entry]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep-history'] });
      toast({
        title: 'Sleep Entry Added',
        description: 'Your sleep data has been recorded successfully.',
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save sleep entry. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const resetForm = () => {
    setBedTime('22:00');
    setWakeTime('07:00');
    setSleepQuality(7);
    setFactors({
      caffeine: false,
      exercise: false,
      alcohol: false,
      screenTime: false,
      stress: false
    });
    setNotes('');
  };

  // Calculate sleep stats
  const sleepStats = React.useMemo(() => {
    if (!sleepHistory?.length) return null;

    const avgQuality = sleepHistory.reduce((sum, entry) => sum + entry.sleepQuality, 0) / sleepHistory.length;
    const avgDuration = sleepHistory.reduce((sum, entry) => sum + entry.sleepDuration, 0) / sleepHistory.length;
    
    const factorImpact = sleepHistory.reduce((acc, entry) => {
      Object.entries(entry.factors).forEach(([factor, value]) => {
        if (value) {
          acc[factor] = acc[factor] || { count: 0, totalQuality: 0 };
          acc[factor].count++;
          acc[factor].totalQuality += entry.sleepQuality;
        }
      });
      return acc;
    }, {} as Record<string, { count: number; totalQuality: number; }>);

    return {
      avgQuality,
      avgDuration,
      factorImpact: Object.entries(factorImpact).map(([factor, data]) => ({
        name: factor,
        impact: data.totalQuality / data.count
      }))
    };
  }, [sleepHistory]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-6 w-6 text-primary" />
              Sleep Tracker
            </CardTitle>
            <CardDescription>
              Monitor your sleep patterns and identify factors affecting your sleep quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="log" className="space-y-4">
              <TabsList>
                <TabsTrigger value="log">Log Sleep</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="factors">Factors</TabsTrigger>
              </TabsList>

              <TabsContent value="log">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bed Time</Label>
                      <Input
                        type="time"
                        value={bedTime}
                        onChange={(e) => setBedTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Wake Time</Label>
                      <Input
                        type="time"
                        value={wakeTime}
                        onChange={(e) => setWakeTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Sleep Quality (1-10)</Label>
                    <Slider
                      value={[sleepQuality]}
                      onValueChange={([value]) => setSleepQuality(value)}
                      max={10}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Poor</span>
                      <span>Average</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Factors</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <Button
                        variant={factors.caffeine ? "default" : "outline"}
                        onClick={() => setFactors(f => ({ ...f, caffeine: !f.caffeine }))}
                        className="flex items-center gap-2"
                      >
                        <Coffee className="h-4 w-4" />
                        Caffeine
                      </Button>
                      <Button
                        variant={factors.exercise ? "default" : "outline"}
                        onClick={() => setFactors(f => ({ ...f, exercise: !f.exercise }))}
                        className="flex items-center gap-2"
                      >
                        <Activity className="h-4 w-4" />
                        Exercise
                      </Button>
                      <Button
                        variant={factors.alcohol ? "default" : "outline"}
                        onClick={() => setFactors(f => ({ ...f, alcohol: !f.alcohol }))}
                        className="flex items-center gap-2"
                      >
                        <Wine className="h-4 w-4" />
                        Alcohol
                      </Button>
                      <Button
                        variant={factors.screenTime ? "default" : "outline"}
                        onClick={() => setFactors(f => ({ ...f, screenTime: !f.screenTime }))}
                        className="flex items-center gap-2"
                      >
                        <Sun className="h-4 w-4" />
                        Screen Time
                      </Button>
                      <Button
                        variant={factors.stress ? "default" : "outline"}
                        onClick={() => setFactors(f => ({ ...f, stress: !f.stress }))}
                        className="flex items-center gap-2"
                      >
                        <Brain className="h-4 w-4" />
                        Stress
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any additional notes about your sleep..."
                    />
                  </div>

                  <Button
                    onClick={() => createSleepEntry.mutate()}
                    className="w-full"
                  >
                    Log Sleep Entry
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <div className="space-y-4">
                  {sleepHistory?.map((entry) => (
                    <Card key={entry.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {entry.bedTime} - {entry.wakeTime}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(entry.createdAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Quality</span>
                            <span className="text-sm font-medium">{entry.sleepQuality}/10</span>
                          </div>
                          <Progress value={(entry.sleepQuality / 10) * 100} />
                          {entry.notes && (
                            <p className="text-sm text-muted-foreground mt-2">{entry.notes}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="insights">
                {sleepStats && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Average Sleep Quality</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">
                              {sleepStats.avgQuality.toFixed(1)}/10
                            </span>
                            <Moon className="h-4 w-4 text-primary" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Average Duration</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">
                              {sleepStats.avgDuration.toFixed(1)} hrs
                            </span>
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Sleep Quality Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sleepHistory}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="createdAt"
                                tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                              />
                              <YAxis domain={[0, 10]} />
                              <Tooltip
                                labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                              />
                              <Line
                                type="monotone"
                                dataKey="sleepQuality"
                                stroke="#8884d8"
                                name="Sleep Quality"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="factors">
                {sleepStats && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Impact of Factors on Sleep Quality</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sleepStats.factorImpact}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis domain={[0, 10]} />
                              <Tooltip />
                              <Bar dataKey="impact" fill="#8884d8">
                                {sleepStats.factorImpact.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
