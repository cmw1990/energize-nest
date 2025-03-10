import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SUPABASE_URL, SUPABASE_KEY } from "@/integrations/supabase/db-client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Target, Puzzle, Users, Zap, Clock, BookOpen, Moon, Flower2 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import MemoryCards from "@/components/games/MemoryCards";
import PatternMatch from "@/components/games/PatternMatch";
import WordScramble from "@/components/games/WordScramble";
import ColorMatch from "@/components/games/ColorMatch";
import MathSpeed from "@/components/games/MathSpeed";
import SimonSays from "@/components/games/SimonSays";
import SpeedTyping from "@/components/games/SpeedTyping";
import VisualMemory from "@/components/games/VisualMemory";
import PatternRecognition from "@/components/games/PatternRecognition";
import SequenceMemory from "@/components/games/SequenceMemory";
import WordAssociation from "@/components/games/WordAssociation";
import BrainMatch3 from "@/components/games/BrainMatch3";
import ReactionTimeTest from "@/components/games/ReactionTimeTest";
import ZenDrift from "@/components/games/ZenDrift";
import { BreathingTechniques } from "@/components/breathing/BreathingTechniques";

import { FocusTimerTools } from "@/components/focus/FocusTimerTools";
import { FocusZoneCard } from "@/components/focus/zones/FocusZoneCard";
import { FocusRoutineCard } from "@/components/focus/routines/FocusRoutineCard";
import { TimeBlockingCard } from "@/components/focus/tools/TimeBlockingCard";
import { FocusAnalyticsDashboard } from "@/components/focus/analytics/FocusAnalyticsDashboard";
import { FocusEnvironment } from "@/components/focus/FocusEnvironment";
import { ADHDTaskBreakdown } from "@/components/focus/tasks/ADHDTaskBreakdown";
import { FocusInterruptionTracker } from "@/components/focus/FocusInterruptionTracker";
import { SmartBreakSuggestions } from "@/components/focus/SmartBreakSuggestions";
import { FocusHabitTracker } from "@/components/focus/habits/FocusHabitTracker";
import { FocusJournal } from "@/components/focus/journal/FocusJournal";
import { MedicationReminders } from "@/components/focus/medication/MedicationReminders";
import { NoiseSensitivitySettings } from "@/components/focus/noise/NoiseSensitivitySettings";
import { VisualOrganizationTools } from "@/components/focus/visual/VisualOrganizationTools";
import { FocusPriorityQueue } from "@/components/focus/priority/FocusPriorityQueue";
import { BodyDoublingTemplates } from "@/components/focus/body-doubling/BodyDoublingTemplates";
import { FocusGamificationCard } from "@/components/focus/gamification/FocusGamificationCard";
import { TaskTransitionTimer } from "@/components/focus/task-transitions/TaskTransitionTimer";
import { TaskSwitchingStrategies } from "@/components/focus/task-transitions/TaskSwitchingStrategies";

interface BodyDoublingSession {
  id: string;
  title: string;
  host_id: string;
  start_time: string;
  status: string;
  participant_count?: number;
}

const Focus = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [activeSessions, setActiveSessions] = useState<BodyDoublingSession[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");

  useEffect(() => {
    if (session?.user) {
      loadActiveSessions();
      subscribeToBodyDoublingSessions();
      checkAndCelebrateStreaks();
    }
  }, [session?.user]);

  const loadActiveSessions = async () => {
    if (!session?.user) return;

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/body_doubling_sessions?status=eq.active&order=start_time.asc`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || response.statusText);
      }

      const data = await response.json();
      setActiveSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast({
        title: "Error loading sessions",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const subscribeToBodyDoublingSessions = () => {
    // Note: Real-time subscriptions require WebSocket connection
    // For now, we'll poll every 30 seconds as a fallback
    const interval = setInterval(loadActiveSessions, 30000);
    return () => clearInterval(interval);
  };

  const checkAndCelebrateStreaks = async () => {
    if (!session?.user) return;

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/focus_achievements?user_id=eq.${session.user.id}&order=achieved_at.desc&limit=1`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || response.statusText);
      }

      const achievements = await response.json();

      if (achievements && achievements.length > 0) {
        const latestAchievement = achievements[0];
        if (latestAchievement.streak_count >= 5) {
          setCelebrationMessage(`🎉 Amazing! You've maintained a ${latestAchievement.streak_count} day focus streak!`);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 5000);
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  const saveFocusScore = async (score: number, exercise: string) => {
    if (!session?.user) return;

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/energy_focus_logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${session.access_token}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          user_id: session.user.id,
          activity_type: 'focus_exercise',
          activity_name: exercise,
          focus_rating: score,
          duration_minutes: 5,
          notes: `Completed ${exercise} exercise`
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || response.statusText);
      }

      toast({
        title: "Score saved!",
        description: `Your score of ${score} has been recorded.`
      });
    } catch (error) {
      console.error('Error saving focus score:', error);
      toast({
        title: "Error saving score",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const joinBodyDoublingSession = async (sessionId: string) => {
    if (!session?.user) return;

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/body_doubling_participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${session.access_token}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: session.user.id
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || response.statusText);
      }

      toast({
        title: "Joined session",
        description: "You've successfully joined the body doubling session"
      });
    } catch (error) {
      console.error('Error joining session:', error);
      toast({
        title: "Error joining session",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container max-w-6xl mx-auto space-y-8 p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full animate-float">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Focus Dashboard
        </h1>
      </div>

      {showCelebration && (
        <Card className="p-4 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 border-2 border-yellow-500/50">
          <div className="flex items-center justify-center text-center">
            <p className="text-lg font-semibold">{celebrationMessage}</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FocusTimerTools />
        <ADHDTaskBreakdown />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FocusPriorityQueue />
        <BodyDoublingTemplates />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FocusJournal />
        <FocusGamificationCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MedicationReminders />
        <NoiseSensitivitySettings />
        <VisualOrganizationTools />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FocusInterruptionTracker />
        <SmartBreakSuggestions />
      </div>

      <FocusAnalyticsDashboard />

      {/* Body Doubling Section */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Active Body Doubling Sessions</h2>
        </div>
        <div className="grid gap-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div>
                <h3 className="font-medium">{session.title}</h3>
                <p className="text-sm text-gray-500">
                  Started: {new Date(session.start_time).toLocaleTimeString()}
                </p>
              </div>
              <Button onClick={() => joinBodyDoublingSession(session.id)}>
                Join Session
              </Button>
            </div>
          ))}
          {activeSessions.length === 0 && (
            <p className="text-center text-gray-500">No active sessions at the moment</p>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FocusZoneCard />
        <FocusRoutineCard />
        <TimeBlockingCard />
      </div>

      <FocusEnvironment />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskSwitchingStrategies />
        <TaskTransitionTimer />
      </div>

      {/* Games section */}
      <Tabs defaultValue="quick" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <TabsTrigger value="quick" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick
          </TabsTrigger>
          <TabsTrigger value="memory" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Memory
          </TabsTrigger>
          <TabsTrigger value="relax" className="flex items-center gap-2">
            <Flower2 className="h-4 w-4" />
            Relax
          </TabsTrigger>
          <TabsTrigger value="cognitive" className="flex items-center gap-2">
            <Puzzle className="h-4 w-4" />
            Cognitive
          </TabsTrigger>
          <TabsTrigger value="timed" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-4">
          <BrainMatch3 />
          <ReactionTimeTest />
          <ColorMatch />
          <MathSpeed />
        </TabsContent>

        <TabsContent value="memory" className="space-y-4">
          <MemoryCards />
          <SequenceMemory />
          <VisualMemory />
        </TabsContent>

        <TabsContent value="relax" className="space-y-4">
          <Card className="p-6 bg-primary/5 border-2 border-primary/20">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <Moon className="h-12 w-12 text-primary animate-pulse" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Relaxation Tools</h2>
                <p className="text-muted-foreground mb-6">
                  Take a moment to unwind with these calming activities
                </p>
              </div>
            </div>
          </Card>
          <ZenDrift />
          <BreathingTechniques />
        </TabsContent>

        <TabsContent value="cognitive" className="space-y-4">
          <WordScramble />
          <PatternMatch />
          <WordAssociation />
        </TabsContent>

        <TabsContent value="timed" className="space-y-4">
          <SimonSays />
          <SpeedTyping />
          <PatternRecognition />
        </TabsContent>
      </Tabs>

      {/* About section */}
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          About These Exercises
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Quick Exercises</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Brain Match 3: Test mathematical thinking and pattern recognition</li>
              <li>• Color Match: Improve reaction time and cognitive flexibility</li>
              <li>• Math Speed: Enhance mental calculation abilities</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Memory Training</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Memory Cards: Challenge visual memory</li>
              <li>• Sequence Memory: Improve working memory</li>
              <li>• Visual Memory: Enhance spatial recall</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Relaxation Tools</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Zen Drift: Find peace in meditative motion</li>
              <li>• Breathing Techniques: Guide your breath for calmness</li>
              <li>• Mindful Activities: Center your focus and reduce stress</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Cognitive Development</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Word Scramble: Build vocabulary and mental agility</li>
              <li>• Pattern Match: Strengthen pattern recognition</li>
              <li>• Word Association: Develop cognitive connections</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Focus;
