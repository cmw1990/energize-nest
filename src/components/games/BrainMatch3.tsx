import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SUPABASE_URL, SUPABASE_KEY } from "@/integrations/supabase/db-client";
import { useAuth } from "@/components/AuthProvider";
import { GameHeader } from "./brain-match/GameHeader";
import { GameGrid } from "./brain-match/GameGrid";
import { GameFooter } from "./brain-match/GameFooter";
import { useGameLogic } from "./brain-match/useGameLogic";

export const BrainMatch3 = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { grid, score, handleTileClick, initializeGrid } = useGameLogic();

  const saveScore = async () => {
    if (!session?.user?.id || score === 0) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/energy_focus_logs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${session.access_token}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            user_id: session.user.id,
            activity_type: "brain_game",
            activity_name: "Brain Match 3",
            duration_minutes: Math.ceil(score / 30),
            focus_rating: Math.min(100, score),
            energy_rating: null,
            notes: `Completed Brain Match 3 with score ${score}`
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || response.statusText);
      }

      toast({
        title: "Score saved!",
        description: "Your progress has been recorded.",
      });
    } catch (error) {
      console.error("Error saving score:", error);
      toast({
        title: "Error Saving Score",
        description: "There was a problem saving your progress.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <GameHeader 
        score={score}
        onNewGame={initializeGrid}
        isSubmitting={isSubmitting}
      />
      <GameGrid 
        grid={grid}
        onTileClick={handleTileClick}
        isSubmitting={isSubmitting}
      />
      <GameFooter 
        score={score}
        isSubmitting={isSubmitting}
        onSaveScore={saveScore}
      />
    </Card>
  );
};