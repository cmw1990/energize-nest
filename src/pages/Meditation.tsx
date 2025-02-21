
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ChevronRight, Clock, Moon, Sun, Target, Heart, Wind, Sparkles, Waves } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { MeditationPreset, MeditationType } from "@/types/meditation";
import { AIStoryPlayer } from "@/components/meditation/AIStoryPlayer";

const MEDITATION_CATEGORIES = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'Start your meditation journey',
    icon: Sun,
  },
  {
    id: 'focus',
    title: 'Focus & Concentration',
    description: 'Enhance mental clarity',
    icon: Target,
  },
  {
    id: 'stress-relief',
    title: 'Stress Relief',
    description: 'Find peace and calmness',
    icon: Heart,
  },
  {
    id: 'sleep',
    title: 'Sleep & Rest',
    description: 'Improve sleep quality',
    icon: Moon,
  },
  {
    id: 'anxiety',
    title: 'Anxiety Relief',
    description: 'Reduce anxiety and worry',
    icon: Wind,
  },
  {
    id: 'advanced',
    title: 'Advanced Practice',
    description: 'Deepen your practice',
    icon: Sparkles,
  },
];

const QUICK_DURATION_OPTIONS = [
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min' },
];

const Meditation = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('beginner');
  const [activeSession, setActiveSession] = useState<string | null>(null);

  const { data: meditationPresets } = useQuery({
    queryKey: ['meditation-presets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meditation_presets')
        .select('*')
        .eq('category', selectedCategory)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MeditationPreset[];
    },
  });

  const { data: userStats } = useQuery({
    queryKey: ['meditation-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meditation_stats')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
  });

  const startSession = (preset: MeditationPreset) => {
    setActiveSession(preset.id);
    toast({
      title: "Session Started",
      description: `Starting ${preset.name}. Find a comfortable position and follow along.`,
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{userStats?.total_sessions || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Total Minutes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{userStats?.total_minutes || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{userStats?.current_streak || 0} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-4 w-4 text-primary" />
              Mood Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">+{userStats?.mood_improvement || 0}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {QUICK_DURATION_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className="flex-shrink-0"
                onClick={() => {
                  toast({
                    title: "Timer Started",
                    description: `Starting ${option.value} minute meditation session`,
                  });
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI-Guided Meditation Stories */}
      <AIStoryPlayer theme="mindfulness" duration={5} />

      {/* Main Categories */}
      <Tabs defaultValue="beginner" onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {MEDITATION_CATEGORIES.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              <category.icon className="h-4 w-4" />
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {MEDITATION_CATEGORIES.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {meditationPresets?.map((preset) => (
                <Card key={preset.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{preset.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{preset.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{preset.duration} minutes</span>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => startSession(preset)}
                      >
                        Start Session
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Meditation;
