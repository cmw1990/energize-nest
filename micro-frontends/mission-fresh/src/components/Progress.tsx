import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, 
         Calendar, Tabs, TabsContent, TabsList, TabsTrigger, 
         Slider, Label, Select, SelectContent, SelectItem, 
         SelectTrigger, SelectValue, Button } from './ui';
import { useToast } from '../hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Battery, BrainCircuit, CalendarDays, Heart, Smile, SunMedium, Zap } from 'lucide-react';
import { getProgressData, saveProgressData, ProgressEntry } from '../api/missionFreshApiClient';

interface ProgressProps {
  session: Session | null;
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
  const [date, setDate] = useState<Date>(new Date());
  const [progressData, setProgressData] = useState<ProgressEntry[]>([]);
  const [activeTab, setActiveTab] = useState('tracking');
  // New state for energy and mood
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [mood, setMood] = useState<MoodOption>('neutral');
  const [cravings, setCravings] = useState<number>(0);
  const [cigarettesAvoided, setCigarettesAvoided] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadProgressData();
  }, [session, date]);

  const loadProgressData = async () => {
    setIsLoading(true);
    try {
      // Get userId from session or use default for demo
      const userId = session?.user?.id || 'user123';
      
      // Format dates for API query
      const startDate = new Date(date);
      startDate.setDate(startDate.getDate() - 30); // Get last 30 days
      const endDate = new Date(date);
      
      // Call API
      const data = await getProgressData(
        userId,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        session
      );
      
      setProgressData(data);
    } catch (error) {
      console.error('Failed to load progress data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your progress data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Get userId from session or use default for demo
      const userId = session?.user?.id || 'user123';
      
      const entryData: ProgressEntry = {
        user_id: userId,
        date: date.toISOString().split('T')[0],
        cravings: cravings,
        cigarettes_avoided: cigarettesAvoided,
        energy_level: energyLevel,
        mood_score: mood
      };
      
      await saveProgressData(entryData, session);
      
      toast({
        title: 'Success',
        description: 'Your progress has been recorded.',
      });
      
      // Refresh data
      loadProgressData();
      
      // Reset form
      setCravings(0);
      setCigarettesAvoided(0);
      setEnergyLevel(5);
      setMood('neutral');
    } catch (error) {
      console.error('Failed to save progress:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your progress. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Transform data for charts
  const chartData = progressData.map(entry => ({
    date: entry.date,
    cravings: entry.cravings,
    cigarettesAvoided: entry.cigarettes_avoided,
    energyLevel: entry.energy_level,
    mood: entry.mood_score
  })).reverse(); // Reverse to show oldest to newest

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Progress Tracking</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-8">
          <TabsTrigger value="tracking">Track Today</TabsTrigger>
          <TabsTrigger value="history">View History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="mr-2 h-5 w-5" />
                Track Your Progress
              </CardTitle>
              <CardDescription>
                Record your daily smoking-reduction progress and how you're feeling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Calendar
                  value={date}
                  onSelect={(date) => date && setDate(date)}
                  disabled={isSubmitting}
                  className="border rounded-md p-4"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cravings">Cravings Experienced</Label>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setCravings(Math.max(0, cravings - 1))}
                    disabled={isSubmitting || cravings === 0}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{cravings}</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setCravings(cravings + 1)}
                    disabled={isSubmitting}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cigarettes">Cigarettes Avoided</Label>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setCigarettesAvoided(Math.max(0, cigarettesAvoided - 1))}
                    disabled={isSubmitting || cigarettesAvoided === 0}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{cigarettesAvoided}</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setCigarettesAvoided(cigarettesAvoided + 1)}
                    disabled={isSubmitting}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="energy">Energy Level (1-10)</Label>
                <div className="flex items-center space-x-4">
                  <Battery className="h-5 w-5 text-gray-500" />
                  <Slider
                    value={[energyLevel]}
                    onValueChange={(value) => setEnergyLevel(value[0])}
                    min={1}
                    max={10}
                    step={1}
                    disabled={isSubmitting}
                  />
                  <span className="w-8 text-center">{energyLevel}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mood">Overall Mood</Label>
                <Select
                  value={mood}
                  onValueChange={(value) => setMood(value as MoodOption)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your mood" />
                  </SelectTrigger>
                  <SelectContent>
                    {moodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center">
                          <span className="mr-2">{option.emoji}</span>
                          {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Saving...' : 'Save Progress'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BrainCircuit className="mr-2 h-5 w-5" />
                Progress History
              </CardTitle>
              <CardDescription>
                View your smoking-reduction journey over time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : chartData.length > 0 ? (
                <>
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Cravings vs. Cigarettes Avoided</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          />
                          <YAxis />
                          <Tooltip 
                            formatter={(value, name) => [value, name === 'cravings' ? 'Cravings' : 'Cigarettes Avoided']}
                            labelFormatter={(label) => new Date(label).toLocaleDateString()}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="cravings" 
                            stroke="#ef4444" 
                            name="Cravings" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="cigarettesAvoided" 
                            stroke="#22c55e" 
                            name="Cigarettes Avoided"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-8">Energy Levels</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          />
                          <YAxis domain={[0, 10]} />
                          <Tooltip 
                            formatter={(value) => [`${value}/10`, 'Energy Level']}
                            labelFormatter={(label) => new Date(label).toLocaleDateString()}
                          />
                          <Bar 
                            dataKey="energyLevel" 
                            fill="#3b82f6" 
                            name="Energy Level" 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 border rounded-lg bg-gray-50 dark:bg-gray-900">
                  <Zap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No progress data yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Start tracking your progress to see your journey here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
