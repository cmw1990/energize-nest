
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Star } from "lucide-react";
import { Achievement, Challenge, GamificationData, RawGamificationData, GamificationDataUpdate } from "./types";
import { AchievementItem } from "./AchievementItem";
import { ChallengeItem } from "./ChallengeItem";

export const FocusGamificationCard = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      loadGamificationData();
    }
  }, [session?.user]);

  const loadGamificationData = async () => {
    try {
      const { data: rawData, error } = await supabase
        .from('focus_gamification')
        .select('*')
        .eq('user_id', session?.user.id)
        .single();

      if (error) throw error;

      // Transform the raw data into the correct types
      const transformedData: GamificationData = {
        id: rawData.id,
        points_earned: rawData.points_earned || 0,
        streak_count: rawData.streak_count || 0,
        level: rawData.level || 1,
        achievements: Array.isArray(rawData.achievements) ? rawData.achievements.map((achievement: any) => ({
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon || 'trophy',
          unlocked: achievement.unlocked || false
        })) : [],
        daily_challenges: Array.isArray(rawData.daily_challenges) ? rawData.daily_challenges.map((challenge: any) => ({
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          points: challenge.points || 0,
          completed: challenge.completed || false
        })) : []
      };
      
      setGamificationData(transformedData);
    } catch (error) {
      console.error('Error loading gamification data:', error);
      toast({
        title: "Error loading gamification data",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getNextLevelPoints = (currentLevel: number) => {
    return currentLevel * 100;
  };

  const getProgressToNextLevel = () => {
    if (!gamificationData) return 0;
    const nextLevelPoints = getNextLevelPoints(gamificationData.level);
    return (gamificationData.points_earned % nextLevelPoints) / nextLevelPoints * 100;
  };

  const handleChallengeComplete = async (challengeId: string) => {
    if (!session?.user || !gamificationData) return;

    try {
      // Update the local state first for immediate feedback
      const updatedChallenges = gamificationData.daily_challenges.map(challenge => 
        challenge.id === challengeId ? { ...challenge, completed: true } : challenge
      );

      const updatedPoints = gamificationData.points_earned + 
        (gamificationData.daily_challenges.find(c => c.id === challengeId)?.points || 0);

      // Prepare the update payload
      const updatePayload: GamificationDataUpdate = {
        daily_challenges: updatedChallenges.map(challenge => ({
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          points: challenge.points,
          completed: challenge.completed
        })),
        points_earned: updatedPoints
      };

      setGamificationData({
        ...gamificationData,
        daily_challenges: updatedChallenges,
        points_earned: updatedPoints
      });

      // Update in the database
      const { error } = await supabase
        .from('focus_gamification')
        .update(updatePayload)
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: "Challenge completed!",
        description: "You've earned points for completing this challenge.",
      });
    } catch (error) {
      console.error('Error completing challenge:', error);
      toast({
        title: "Error completing challenge",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Focus Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-12 bg-muted rounded animate-pulse"></div>
          </div>
        ) : gamificationData ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <span className="font-medium">Level {gamificationData.level}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {gamificationData.points_earned} points
                </span>
              </div>
              
              <Progress value={getProgressToNextLevel()} className="h-2" />
              
              <p className="text-xs text-muted-foreground text-right">
                {Math.round(getNextLevelPoints(gamificationData.level) - (gamificationData.points_earned % getNextLevelPoints(gamificationData.level)))} points to next level
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Daily Challenges</h3>
              {gamificationData.daily_challenges.length > 0 ? (
                <div className="space-y-2">
                  {gamificationData.daily_challenges.map(challenge => (
                    <ChallengeItem 
                      key={challenge.id} 
                      challenge={challenge} 
                      onComplete={handleChallengeComplete} 
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No challenges available today.</p>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Achievements</h3>
              {gamificationData.achievements.length > 0 ? (
                <div className="grid gap-2 md:grid-cols-2">
                  {gamificationData.achievements.map(achievement => (
                    <AchievementItem key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No achievements unlocked yet.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground">No gamification data available.</p>
        )}
      </CardContent>
    </Card>
  );
};
