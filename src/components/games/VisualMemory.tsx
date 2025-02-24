import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain } from "lucide-react";

export const VisualMemory = () => {
  const [gridSize, setGridSize] = useState(3);
  const [pattern, setPattern] = useState<boolean[]>([]);
  const [userPattern, setUserPattern] = useState<boolean[]>([]);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    if (isShowingPattern) {
      const timer = setTimeout(() => {
        setIsShowingPattern(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isShowingPattern]);

  const generatePattern = () => {
    const totalCells = gridSize * gridSize;
    const numHighlighted = Math.min(Math.floor(gridSize * 1.5), totalCells);
    const newPattern = Array(totalCells).fill(false);
    
    let highlighted = 0;
    while (highlighted < numHighlighted) {
      const index = Math.floor(Math.random() * totalCells);
      if (!newPattern[index]) {
        newPattern[index] = true;
        highlighted++;
      }
    }
    
    setPattern(newPattern);
    setUserPattern(Array(totalCells).fill(false));
    setIsShowingPattern(true);
  };

  const startGame = () => {
    setIsActive(true);
    setScore(0);
    setGridSize(3);
    generatePattern();
  };

  const handleCellClick = (index: number) => {
    if (isShowingPattern) return;

    const newUserPattern = [...userPattern];
    newUserPattern[index] = !newUserPattern[index];
    setUserPattern(newUserPattern);

    // Check if user has selected the same number of cells as the pattern
    const userSelectedCount = newUserPattern.filter(cell => cell).length;
    const patternSelectedCount = pattern.filter(cell => cell).length;

    if (userSelectedCount === patternSelectedCount) {
      checkPattern(newUserPattern);
    }
  };

  const checkPattern = async (userPattern: boolean[]) => {
    const isCorrect = pattern.every((cell, index) => cell === userPattern[index]);

    if (isCorrect) {
      setScore(prev => prev + 1);
      if (score > 0 && score % 3 === 0) {
        setGridSize(prev => Math.min(prev + 1, 6));
      }
      setTimeout(() => generatePattern(), 500);
    } else {
      endGame();
    }
  };

  const endGame = async () => {
    setIsActive(false);
    setIsSubmitting(true);
    
    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "visual_memory",
          activity_name: "Visual Memory",
          duration_minutes: Math.ceil(score / 2),
          focus_rating: Math.round((score / 10) * 10),
          energy_rating: null,
          notes: `Completed visual memory with score: ${score}`
        });

        if (error) throw error;

        toast({
          title: "Game Complete!",
          description: `Final score: ${score}. Well done!`,
        });
      } catch (error) {
        console.error("Error logging visual memory:", error);
        toast({
          title: "Error Saving Results",
          description: "There was a problem saving your game results.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full animate-bounce">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Visual Memory</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg">Score: {score}</div>
          <div className="text-lg">Grid: {gridSize}x{gridSize}</div>
        </div>
      </div>

      {!isActive ? (
        <Button 
          onClick={startGame} 
          className="w-full animate-pulse"
          disabled={isSubmitting}
        >
          Start Game
        </Button>
      ) : (
        <div className="grid gap-2 mb-8" style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`
        }}>
          {pattern.map((cell, index) => (
            <Button
              key={index}
              onClick={() => handleCellClick(index)}
              variant="outline"
              className={`h-16 transition-all duration-300 ${
                isShowingPattern
                  ? cell
                    ? 'bg-primary animate-breathe'
                    : ''
                  : userPattern[index]
                  ? 'bg-primary/50 hover:bg-primary/60'
                  : 'hover:bg-primary/10'
              }`}
              disabled={isShowingPattern || isSubmitting}
            />
          ))}
        </div>
      )}

      <div className="mt-6 text-sm text-muted-foreground">
        Memorize the pattern of highlighted squares, then recreate it by clicking the cells. The grid will grow as you progress.
      </div>
    </Card>
  );
};