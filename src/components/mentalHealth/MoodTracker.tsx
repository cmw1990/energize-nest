import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea"; // Added Textarea
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox
import { Label } from "@/components/ui/label"; // Added Label
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'; // Added Legend
import { motion } from "framer-motion"; // Added motion
import { Smile, Frown, Meh, Zap, BatteryCharging, Bed, Brain, CloudRain, Briefcase, Users, Sun } from "lucide-react"; // Added icons

// Define emotion tags
const emotionTags = [
  { id: 'happy', label: 'Happy', icon: <Smile className="h-4 w-4 text-yellow-500" /> },
  { id: 'calm', label: 'Calm', icon: <Meh className="h-4 w-4 text-green-500" /> },
  { id: 'sad', label: 'Sad', icon: <Frown className="h-4 w-4 text-blue-500" /> },
  { id: 'anxious', label: 'Anxious', icon: <Zap className="h-4 w-4 text-orange-500" /> },
  { id: 'stressed', label: 'Stressed', icon: <CloudRain className="h-4 w-4 text-gray-500" /> },
  { id: 'focused', label: 'Focused', icon: <Brain className="h-4 w-4 text-purple-500" /> },
  { id: 'tired', label: 'Tired', icon: <BatteryCharging className="h-4 w-4 text-red-500" /> },
  { id: 'motivated', label: 'Motivated', icon: <Zap className="h-4 w-4 text-emerald-500" /> },
];

// Define potential factors
const moodFactors = [
  { id: 'work', label: 'Work', icon: <Briefcase className="h-4 w-4" /> },
  { id: 'relationships', label: 'Relationships', icon: <Users className="h-4 w-4" /> },
  { id: 'sleep', label: 'Sleep', icon: <Bed className="h-4 w-4" /> },
  { id: 'weather', label: 'Weather', icon: <Sun className="h-4 w-4" /> },
  // Add more factors as needed
];

export function MoodTracker() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient(); // Get query client instance
  const [moodScore, setMoodScore] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const { data: moodHistory, refetch, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['mood-history', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      // TODO: Replace with REST API call if required
      const { data, error } = await supabase
        .from('mental_health_progress')
        .select('*')
        .eq('client_id', session.user.id)
        .order('date', { ascending: false })
        .limit(30); // Fetch more data for better chart view

      if (error) {
        console.error("Error fetching mood history:", error);
        toast({ title: "Error", description: "Could not load mood history.", variant: "destructive" });
        return []; // Return empty array on error
      }
      return data;
    },
    enabled: !!session?.user?.id
  });

  // Mutation for saving mood entry
  const saveMoodMutation = useMutation({
    mutationFn: async (newEntry: any) => {
      if (!session?.user?.id) throw new Error("User not logged in");
      // TODO: Replace with REST API call if required
      const { error } = await supabase
        .from('mental_health_progress')
        .insert({
          client_id: session.user.id,
          mood_score: newEntry.moodScore,
          energy_level: newEntry.energyLevel,
          sleep_quality: newEntry.sleepQuality,
          emotion_tags: newEntry.selectedTags, // Save tags
          notes: newEntry.notes, // Save notes
          factors: newEntry.selectedFactors, // Save factors
          // 'date' column likely defaults to now() in DB
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Mood entry saved successfully!"
      });
      refetch(); // Refetch history after saving
      // Reset form state
      setMoodScore(5);
      setEnergyLevel(5);
      setSleepQuality(5);
      setSelectedTags([]);
      setSelectedFactors([]);
      setNotes("");
      queryClient.invalidateQueries({ queryKey: ['mood-history', session?.user?.id] }); // Invalidate cache
    },
    onError: (error) => {
      console.error("Error saving mood entry:", error);
      toast({
        title: "Error",
        description: "Failed to save mood entry. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSaveMoodEntry = () => {
    saveMoodMutation.mutate({
      moodScore,
      energyLevel,
      sleepQuality,
      selectedTags,
      selectedFactors,
      notes
    });
  };

  const handleTagChange = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const handleFactorChange = (factorId: string) => {
    setSelectedFactors(prev =>
      prev.includes(factorId) ? prev.filter(f => f !== factorId) : [...prev, factorId]
    );
  };

  // Prepare data for the chart
  const chartData = moodHistory?.map(entry => ({
    // Format date for better readability on X-axis
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: entry.mood_score,
    energy: entry.energy_level,
    sleep: entry.sleep_quality,
    tags: entry.emotion_tags || [],
    notes: entry.notes || '',
    factors: entry.factors || [],
  })).reverse() ?? []; // Ensure it's an array even if undefined

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Mood Logging Card */}
        <motion.div variants={cardVariants}>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>How are you today?</CardTitle>
              <CardDescription>Log your mood, energy, and sleep.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow flex flex-col">
              {/* Sliders */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex justify-between">
                    <span>Mood ({moodScore}/10)</span>
                    {/* Optional: Add emoji indicator */}
                  </Label>
                  <Slider
                    value={[moodScore]}
                    onValueChange={([value]) => setMoodScore(value)}
                    max={10} step={1} aria-label="Mood Score"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex justify-between">
                    <span>Energy ({energyLevel}/10)</span>
                  </Label>
                  <Slider
                    value={[energyLevel]}
                    onValueChange={([value]) => setEnergyLevel(value)}
                    max={10} step={1} aria-label="Energy Level"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex justify-between">
                    <span>Sleep Quality ({sleepQuality}/10)</span>
                  </Label>
                  <Slider
                    value={[sleepQuality]}
                    onValueChange={([value]) => setSleepQuality(value)}
                    max={10} step={1} aria-label="Sleep Quality"
                  />
                </div>
              </div>

              {/* Emotion Tags */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Emotions Felt</Label>
                <div className="flex flex-wrap gap-2">
                  {emotionTags.map(tag => (
                    <Button
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTagChange(tag.id)}
                      className="flex items-center gap-1 transition-all"
                    >
                      {tag.icon}
                      {tag.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Factors */}
               <div className="space-y-2">
                <Label className="text-sm font-medium">Influencing Factors (Optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {moodFactors.map(factor => (
                    <Button
                      key={factor.id}
                      variant={selectedFactors.includes(factor.id) ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleFactorChange(factor.id)}
                      className="flex items-center gap-1 transition-all"
                    >
                      {factor.icon}
                      {factor.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2 flex-grow flex flex-col">
                <Label htmlFor="mood-notes" className="text-sm font-medium">Notes (Optional)</Label>
                <Textarea
                  id="mood-notes"
                  placeholder="Any thoughts or details about your day?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="flex-grow min-h-[80px]"
                />
              </div>

              <Button
                onClick={handleSaveMoodEntry}
                disabled={saveMoodMutation.isPending}
                className="w-full mt-auto" // Push button to bottom
              >
                {saveMoodMutation.isPending ? "Saving..." : "Save Entry"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mood History Chart Card */}
        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Mood History (Last 30 Days)</CardTitle>
              <CardDescription>Visualize your mood, energy, and sleep trends.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                 <div className="h-[350px] flex items-center justify-center">
                   <p className="text-muted-foreground">Loading chart data...</p>
                 </div>
              ) : chartData && chartData.length > 0 ? (
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                      <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 10]} fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#333' }}
                        labelStyle={{ fontWeight: 'bold', color: '#000' }}
                        formatter={(value, name, props) => {
                           const entry = props.payload;
                           let details = '';
                           if (entry?.tags?.length > 0) {
                             details += ` Tags: ${entry.tags.join(', ')}.`;
                           }
                           if (entry?.factors?.length > 0) {
                             details += ` Factors: ${entry.factors.join(', ')}.`;
                           }
                           if (entry?.notes) {
                             details += ` Notes: ${entry.notes.substring(0, 50)}${entry.notes.length > 50 ? '...' : ''}`;
                           }
                           return [`${value}/10`, `${name}${details ? ` - ${details}` : ''}`];
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="mood" stroke="#ec4899" name="Mood" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="energy" stroke="#eab308" name="Energy" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="sleep" stroke="#3b82f6" name="Sleep" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[350px] flex items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    Log your mood to see your history here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
