
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatternGrid } from "./PatternGrid";
import { GameStatus } from "./GameStatus";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Trophy } from "lucide-react";
import confetti from 'canvas-confetti';

export const PatternGame = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  const generatePattern = useCallback(() => {
    const patternLength = Math.min(difficulty + level, 9);
    const newPattern: number[] = [];
    
    while (newPattern.length < patternLength) {
      const randomIndex = Math.floor(Math.random() * 9);
      if (!newPattern.includes(randomIndex)) {
        newPattern.push(randomIndex);
      }
    }
    
    return newPattern;
  }, [difficulty, level]);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setIsShowingPattern(true);
    setLevel(1);
    setScore(0);
    setUserPattern([]);
    const newPattern = generatePattern();
    setPattern(newPattern);
    
    // Show pattern for a duration based on difficulty
    const showDuration = Math.max(4000 - (difficulty * 500), 1000);
    setTimeout(() => {
      setIsShowingPattern(false);
    }, showDuration);
  }, [difficulty, generatePattern]);

  const handleCellClick = (index: number) => {
    if (isShowingPattern) return;
    
    const newUserPattern = [...userPattern, index];
    setUserPattern(newUserPattern);
    
    // Check if the user selection is correct
    const currentIndex = userPattern.length;
    if (pattern[currentIndex] !== index) {
      // Incorrect selection
      setTimeout(() => {
        handleGameOver();
      }, 500);
      return;
    }
    
    // Check if pattern is complete
    if (newUserPattern.length === pattern.length) {
      // Level complete
      const pointsEarned = difficulty * level * 10;
      setScore(prev => prev + pointsEarned);
      
      toast({
        title: "Level Complete!",
        description: `+${pointsEarned} points`,
      });
      
      // Small confetti celebration
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Go to next level
      setTimeout(() => {
        goToNextLevel();
      }, 1000);
    }
  };

  const goToNextLevel = () => {
    setLevel(prev => prev + 1);
    setUserPattern([]);
    setIsShowingPattern(true);
    
    const newPattern = generatePattern();
    setPattern(newPattern);
    
    // Show pattern for a duration based on difficulty
    const showDuration = Math.max(4000 - (difficulty * 500), 1000);
    setTimeout(() => {
      setIsShowingPattern(false);
    }, showDuration);
  };

  const handleGameOver = async () => {
    setIsPlaying(false);
    
    toast({
      title: "Game Over",
      description: `Final score: ${score}`,
      variant: "destructive",
    });
    
    // Save score to database if user is authenticated
    if (session?.user?.id) {
      try {
        await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "brain_game",
          activity_name: "Pattern Recognition",
          duration_minutes: Math.ceil(level / 2),
          focus_rating: Math.min(100, score / 10),
          notes: `Completed ${level} levels on difficulty ${difficulty} with score ${score}`
        });
      } catch (error) {
        console.error("Error saving game results:", error);
      }
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Brain className="h-5 w-5 text-primary" />
          Pattern Recognition Game
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <PatternGrid
              pattern={pattern}
              userPattern={userPattern}
              isShowingPattern={isShowingPattern}
              onCellClick={handleCellClick}
            />
            
            {isPlaying && (
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">Score: {score}</span>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  Level: {level}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <GameStatus
              isPlaying={isPlaying}
              isShowingPattern={isShowingPattern}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              startGame={startGame}
            />
            
            <div className="mt-6 space-y-2">
              <h3 className="text-sm font-medium">How to Play:</h3>
              <p className="text-sm text-muted-foreground">
                Memorize the pattern of highlighted cells, then repeat it in the correct order.
              </p>
              <h3 className="text-sm font-medium mt-4">Benefits:</h3>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Improves visual memory</li>
                <li>Enhances concentration</li>
                <li>Strengthens working memory</li>
                <li>Boosts pattern recognition skills</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
