
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Calendar, Star, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { safeNumber } from "@/utils/typeUtils";

export const MotivationStats = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalEntries: 0,
    avgMoodScore: 0,
    streakDays: 0,
    improvements: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      loadStats();
    }
  }, [session?.user?.id]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      // Get journal entries
      const { data: journalData, error: journalError } = await supabase
        .from("journal_entries")
        .select("created_at, mood_rating")
        .eq("user_id", session.user.id);

      if (journalError) throw journalError;

      // Calculate average mood score
      const totalEntries = journalData?.length || 0;
      let totalMoodScore = 0;
      
      journalData?.forEach((entry) => {
        // Use safeNumber to handle unknown types
        totalMoodScore += safeNumber(entry.mood_rating);
      });
      
      const avgMoodScore = totalEntries > 0 ? totalMoodScore / totalEntries : 0;

      // Get streak information
      const { data: streakData, error: streakError } = await supabase
        .from("user_stats")
        .select("streak_count")
        .eq("user_id", session.user.id)
        .single();

      if (streakError && streakError.code !== "PGRST116") {
        // PGRST116 is "The result contains 0 rows" which is expected if no stats
        throw streakError;
      }

      // Get improvements
      const { data: improvementData, error: improvementError } = await supabase
        .from("user_improvements")
        .select("count")
        .eq("user_id", session.user.id)
        .single();

      if (improvementError && improvementError.code !== "PGRST116") {
        throw improvementError;
      }

      setStats({
        totalEntries,
        avgMoodScore: parseFloat(avgMoodScore.toFixed(1)),
        streakDays: safeNumber(streakData?.streak_count),
        improvements: safeNumber(improvementData?.count),
      });
    } catch (error) {
      console.error("Error loading motivation stats:", error);
      toast({
        title: "Failed to load stats",
        description: "There was an error loading your motivation statistics.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatsCard
        title="Journal Entries"
        value={stats.totalEntries.toString()}
        icon={<Calendar className="h-5 w-5 text-blue-500" />}
        isLoading={isLoading}
      />
      <StatsCard
        title="Average Mood"
        value={stats.avgMoodScore.toString()}
        icon={<Brain className="h-5 w-5 text-purple-500" />}
        isLoading={isLoading}
      />
      <StatsCard
        title="Current Streak"
        value={`${stats.streakDays} days`}
        icon={<TrendingUp className="h-5 w-5 text-green-500" />}
        isLoading={isLoading}
      />
      <StatsCard
        title="Improvements"
        value={stats.improvements.toString()}
        icon={<Star className="h-5 w-5 text-amber-500" />}
        isLoading={isLoading}
      />
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  isLoading: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, isLoading }) => (
  <Card>
    <CardHeader className="p-4 pb-2 flex flex-row justify-between items-center">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <div className="text-2xl font-bold">
        {isLoading ? (
          <div className="h-7 bg-muted animate-pulse rounded-md"></div>
        ) : (
          value
        )}
      </div>
    </CardContent>
  </Card>
);
