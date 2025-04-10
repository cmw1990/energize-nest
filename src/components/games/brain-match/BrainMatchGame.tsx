
import { useState } from "react";
import { useGameLogic } from "./useGameLogic";
import { GameHeader } from "./GameHeader";
import { GameGrid } from "./GameGrid";
import { GameFooter } from "./GameFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function BrainMatchGame() {
  const { grid, score, selectedTiles, gameOver, initializeGrid, handleTileClick } = useGameLogic();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSaveScore = async () => {
    if (score === 0) return;
    
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create the entry with the game_type, score, and optional metadata
      const { error } = await supabase
        .from('game_scores')
        .insert({
          user_id: user?.id,
          game_type: 'brain_match',
          score,
          metadata: { difficulty: 'normal' }
        });

      if (error) throw error;
      
      toast({
        title: "Score saved!",
        description: `Your score of ${score} has been recorded.`,
      });
    } catch (error) {
      console.error('Error saving score:', error);
      toast({
        title: "Error saving score",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Brain Match
            <Badge variant="outline" className="ml-2">
              Math Edition
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-6">
          <GameHeader 
            score={score} 
            onReset={initializeGrid} 
          />
          
          <div className="aspect-square w-full max-w-lg mx-auto">
            <GameGrid 
              grid={grid} 
              onTileClick={handleTileClick} 
              selectedTiles={selectedTiles}
            />
          </div>
          
          <GameFooter 
            score={score} 
            isSubmitting={isSubmitting} 
            onSaveScore={handleSaveScore} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
