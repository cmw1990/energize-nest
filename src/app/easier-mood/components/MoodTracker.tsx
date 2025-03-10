import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { 
  Calendar, 
  Smile, 
  Frown, 
  Meh, 
  ThumbsUp, 
  ThumbsDown,
  Save,
  Plus
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Label } from '../../../components/ui/label';
import { Slider } from '../../../components/ui/slider';
import { supabase } from '../../../integrations/supabase/client';

interface MoodTrackerProps {
  session: Session | null;
}

type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
type Emotion = 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'excited' | 'tired' | 'stressed';

interface MoodEntry {
  date: string;
  time: string;
  mood: Mood;
  emotions: Emotion[];
  energyLevel: number;
  notes: string;
}

export const MoodTracker: React.FC<MoodTrackerProps> = ({ session }) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const [energyLevel, setEnergyLevel] = useState<number[]>([5]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([
    {
      date: '2023-06-15',
      time: '09:30 AM',
      mood: 'good',
      emotions: ['happy', 'excited'],
      energyLevel: 7,
      notes: 'Feeling optimistic about the day ahead.'
    },
    {
      date: '2023-06-14',
      time: '08:45 PM',
      mood: 'neutral',
      emotions: ['tired', 'calm'],
      energyLevel: 4,
      notes: 'Long day at work, but relaxed in the evening.'
    },
    {
      date: '2023-06-13',
      time: '02:15 PM',
      mood: 'bad',
      emotions: ['stressed', 'anxious'],
      energyLevel: 3,
      notes: 'Deadline pressure is getting to me.'
    }
  ]);
  
  const emotions: { label: string; value: Emotion; icon: React.ReactNode }[] = [
    { label: 'Happy', value: 'happy', icon: <Smile className="h-5 w-5" /> },
    { label: 'Calm', value: 'calm', icon: <Meh className="h-5 w-5 rotate-180" /> },
    { label: 'Anxious', value: 'anxious', icon: <Meh className="h-5 w-5" /> },
    { label: 'Sad', value: 'sad', icon: <Frown className="h-5 w-5" /> },
    { label: 'Angry', value: 'angry', icon: <Frown className="h-5 w-5 text-red-500" /> },
    { label: 'Excited', value: 'excited', icon: <Smile className="h-5 w-5 text-yellow-500" /> },
    { label: 'Tired', value: 'tired', icon: <Meh className="h-5 w-5 text-gray-500" /> },
    { label: 'Stressed', value: 'stressed', icon: <Frown className="h-5 w-5 text-orange-500" /> }
  ];
  
  const moods: { label: string; value: Mood; icon: React.ReactNode; color: string }[] = [
    { label: 'Great', value: 'great', icon: <Smile className="h-8 w-8" />, color: 'bg-green-100 border-green-300 text-green-700' },
    { label: 'Good', value: 'good', icon: <Smile className="h-8 w-8" />, color: 'bg-blue-100 border-blue-300 text-blue-700' },
    { label: 'Neutral', value: 'neutral', icon: <Meh className="h-8 w-8" />, color: 'bg-gray-100 border-gray-300 text-gray-700' },
    { label: 'Bad', value: 'bad', icon: <Frown className="h-8 w-8" />, color: 'bg-orange-100 border-orange-300 text-orange-700' },
    { label: 'Terrible', value: 'terrible', icon: <Frown className="h-8 w-8" />, color: 'bg-red-100 border-red-300 text-red-700' }
  ];
  
  const toggleEmotion = (emotion: Emotion) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== emotion));
    } else {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would save to Supabase
      // const { data, error } = await supabase
      //   .from('mood_entries')
      //   .insert({
      //     user_id: session?.user.id,
      //     date: new Date().toISOString(),
      //     mood: selectedMood,
      //     emotions: selectedEmotions,
      //     energy_level: energyLevel[0],
      //     notes
      //   });
      
      // For demo purposes, just add to local state
      const newEntry: MoodEntry = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: selectedMood,
        emotions: selectedEmotions,
        energyLevel: energyLevel[0],
        notes
      };
      
      setRecentEntries([newEntry, ...recentEntries]);
      
      // Reset form
      setSelectedMood(null);
      setSelectedEmotions([]);
      setEnergyLevel([5]);
      setNotes('');
      
      // Show success message or notification here
      
    } catch (error) {
      console.error('Error saving mood entry:', error);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getMoodColor = (mood: Mood) => {
    return moods.find(m => m.value === mood)?.color || 'bg-gray-100';
  };
  
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Mood Tracker</h1>
      </div>
      
      <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
          <TabsTrigger value="today">Log Today's Mood</TabsTrigger>
          <TabsTrigger value="history">Mood History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
              <CardDescription>
                Track your mood and emotions to build self-awareness
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mood Selection */}
              <div className="space-y-3">
                <Label>Overall Mood</Label>
                <div className="grid grid-cols-5 gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      className={`flex flex-col items-center justify-center p-3 rounded-md border transition-colors ${
                        selectedMood === mood.value 
                          ? `${mood.color} border-2` 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedMood(mood.value)}
                    >
                      {mood.icon}
                      <span className="mt-1 text-sm font-medium">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Emotions */}
              <div className="space-y-3">
                <Label>Emotions (Select all that apply)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion.value}
                      type="button"
                      className={`flex items-center space-x-2 p-2 rounded-md border transition-colors ${
                        selectedEmotions.includes(emotion.value)
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => toggleEmotion(emotion.value)}
                    >
                      {emotion.icon}
                      <span className="text-sm font-medium">{emotion.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Energy Level */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Energy Level</Label>
                  <span className="text-sm font-medium">{energyLevel[0]}/10</span>
                </div>
                <Slider
                  value={energyLevel}
                  onValueChange={setEnergyLevel}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Low Energy</span>
                  <span>High Energy</span>
                </div>
              </div>
              
              {/* Notes */}
              <div className="space-y-3">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="What's on your mind? Any specific triggers or events?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSubmit} 
                disabled={!selectedMood || isSubmitting}
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Mood Entry
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Mood Entries
              </CardTitle>
              <CardDescription>
                View and analyze your mood patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEntries.length > 0 ? (
                  recentEntries.map((entry, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-md border ${getMoodColor(entry.mood)}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{entry.date} at {entry.time}</h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {entry.emotions.map((emotion) => (
                              <span 
                                key={emotion} 
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/50"
                              >
                                {emotion}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm mr-2">Energy: {entry.energyLevel}/10</span>
                          {entry.mood === 'great' || entry.mood === 'good' ? (
                            <ThumbsUp className="h-5 w-5" />
                          ) : entry.mood === 'bad' || entry.mood === 'terrible' ? (
                            <ThumbsDown className="h-5 w-5" />
                          ) : (
                            <Meh className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                      {entry.notes && (
                        <p className="text-sm mt-2 bg-white/50 p-2 rounded">{entry.notes}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No mood entries yet. Start tracking your mood!</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setActiveTab('today')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Entry
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 