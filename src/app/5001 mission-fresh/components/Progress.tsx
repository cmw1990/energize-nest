import React from 'react';
import { Session } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Battery, BrainCircuit, CalendarDays, Heart, Smile, SunMedium, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProgressProps {
  session: Session | null;
}

interface ProgressData {
  date: string;
  cravings: number;
  cigarettes_avoided: number;
  energy_level?: number;
  mood_score?: number;
}

// Adding mood options
type MoodOption = 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
const moodOptions: { value: MoodOption; label: string; emoji: string }[] = [
  { value: 'very_negative', label: 'Very Low', emoji: '😭' },
  { value: 'negative', label: 'Low', emoji: '😟' },
  { value: 'neutral', label: 'Neutral', emoji: '😐' },
  { value: 'positive', label: 'Good', emoji: '😊' },
  { value: 'very_positive', label: 'Great', emoji: '😁' },
];

export const Progress: React.FC<ProgressProps> = ({ session }) => {
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date>(new Date());
  const [progressData, setProgressData] = React.useState<ProgressData[]>([]);
  const [activeTab, setActiveTab] = React.useState('tracking');
  // New state for energy and mood
  const [energyLevel, setEnergyLevel] = React.useState<number>(5);
  const [mood, setMood] = React.useState<MoodOption>('neutral');
  const [cravings, setCravings] = React.useState<number>(0);
  const [cigarettesAvoided, setCigarettesAvoided] = React.useState<number>(0);

  React.useEffect(() => {
    if (session?.user) {
      loadProgressData();
    }
  }, [session, date]);

  const loadProgressData = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('quit_smoking_progress')
        .select('*')
        .eq('user_id', session?.user?.id)
        .gte('date', thirtyDaysAgo.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;

      if (data) {
        setProgressData(data.map(item => ({
          date: new Date(item.date).toLocaleDateString(),
          cravings: item.cravings,
          cigarettes_avoided: item.cigarettes_avoided,
          energy_level: item.energy_level || 0,
          mood_score: item.mood_score || 0
        })));
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load progress data',
        variant: 'destructive',
      });
    }
  };

  const logProgress = async () => {
    try {
      // Convert mood to numerical score for the chart
      const moodScoreMap: Record<MoodOption, number> = {
        very_negative: 1,
        negative: 2,
        neutral: 3,
        positive: 4,
        very_positive: 5
      };

      const { error } = await supabase
        .from('quit_smoking_progress')
        .upsert({
          user_id: session?.user?.id,
          date: date.toISOString(),
          cravings: cravings,
          cigarettes_avoided: cigarettesAvoided,
          energy_level: energyLevel,
          mood_score: moodScoreMap[mood]
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Progress logged successfully',
      });

      loadProgressData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log progress',
        variant: 'destructive',
      });
    }
  };

  // Get mood emoji based on numerical mood score
  const getMoodEmoji = (score?: number) => {
    if (!score) return '😐';
    if (score === 1) return '😭';
    if (score === 2) return '😟';
    if (score === 3) return '😐';
    if (score === 4) return '😊';
    if (score === 5) return '😁';
    return '😐';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Progress Tracking</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="tracking">
            <CalendarDays className="h-4 w-4 mr-2" />
            Track Progress
          </TabsTrigger>
          <TabsTrigger value="insights">
            <BrainCircuit className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Log Your Daily Progress</CardTitle>
              <CardDescription>
                Track your cravings, energy levels, and mood to see how they change throughout your quit journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    className="rounded-md border"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <Label>Cravings Experienced</Label>
                    </div>
                    <Slider
                      value={[cravings]}
                      onValueChange={(value) => setCravings(value[0])}
                      min={0}
                      max={20}
                      step={1}
                    />
                    <span className="text-sm text-muted-foreground">{cravings} cravings today</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <SunMedium className="h-4 w-4 text-amber-500" />
                      <Label>Cigarettes Avoided</Label>
                    </div>
                    <Slider
                      value={[cigarettesAvoided]}
                      onValueChange={(value) => setCigarettesAvoided(value[0])}
                      min={0}
                      max={30}
                      step={1}
                    />
                    <span className="text-sm text-muted-foreground">{cigarettesAvoided} cigarettes avoided</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <Label>Energy Level</Label>
                    </div>
                    <Slider
                      value={[energyLevel]}
                      onValueChange={(value) => setEnergyLevel(value[0])}
                      min={1}
                      max={10}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Very Low</span>
                      <span>Moderate</span>
                      <span>Very High</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Smile className="h-4 w-4 text-blue-500" />
                      <Label>Mood</Label>
                    </div>
                    <Select value={mood} onValueChange={(value: MoodOption) => setMood(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your mood" />
                      </SelectTrigger>
                      <SelectContent>
                        {moodOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <span>{option.emoji}</span>
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full mt-6" onClick={logProgress}>Log Today's Progress</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Quit Journey Insights</CardTitle>
              <CardDescription>
                Data-driven insights to help you understand your patterns and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Cravings & Cigarettes Avoided</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={progressData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="cravings" stroke="#ef4444" name="Cravings" />
                          <Line type="monotone" dataKey="cigarettes_avoided" stroke="#f59e0b" name="Cigarettes Avoided" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Energy & Mood Levels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={progressData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip labelFormatter={(label) => `Date: ${label}`} formatter={(value, name) => {
                            if (name === 'Mood') {
                              return [`${value}/5 ${getMoodEmoji(Number(value))}`, name];
                            }
                            return [`${value}/10`, name];
                          }} />
                          <Legend />
                          <Line type="monotone" dataKey="energy_level" stroke="#eab308" name="Energy" />
                          <Line type="monotone" dataKey="mood_score" stroke="#3b82f6" name="Mood" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Energy & Mood Correlation</CardTitle>
                  <CardDescription>See how your energy and mood correlate with your cravings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 flex flex-col items-center">
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Battery className="h-5 w-5 text-green-500" /> 
                        Energy Impact
                      </h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        Your energy levels typically {progressData.length > 5 ? 'increase' : 'vary'} as you progress in your quit journey. 
                        Many people report improved energy after 2-3 weeks of quitting.
                      </p>
                      <div className="w-full h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={progressData.slice(-7)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="energy_level" fill="#eab308" name="Energy Level" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex flex-col items-center">
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Smile className="h-5 w-5 text-blue-500" /> 
                        Mood Changes
                      </h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        While mood can fluctuate during withdrawal, most people report improved mood after 
                        the initial withdrawal period (usually 2-4 weeks).
                      </p>
                      <div className="w-full h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={progressData.slice(-7)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="mood_score" fill="#3b82f6" name="Mood Score" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
