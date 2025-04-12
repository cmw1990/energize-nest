
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Trophy, Zap, AlarmClock, Grid3X3, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';

type GameMode = "sequence" | "position" | "combined";

export const AdvancedPatternGame = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [gameMode, setGameMode] = useState<GameMode>("sequence");
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [patternSpeed, setPatternSpeed] = useState(1000);
  const [showModeSelector, setShowModeSelector] = useState(true);

  // Calculate grid size based on difficulty and level
  const getGridSize = useCallback(() => {
    const baseSize = 3;
    const levelBonus = Math.floor(level / 3);
    const difficultyBonus = Math.floor(difficulty / 2);
    return Math.min(baseSize + levelBonus + difficultyBonus, 6);
  }, [difficulty, level]);
  
  const gridSize = getGridSize();
  const totalCells = gridSize * gridSize;

  const generatePattern = useCallback(() => {
    // Pattern length increases with difficulty and level
    const patternLength = Math.min(difficulty + Math.floor(level / 2), totalCells / 2);
    let newPattern: number[] = [];
    
    switch (gameMode) {
      case "sequence":
        // Simple sequence pattern
        while (newPattern.length < patternLength) {
          const randomIndex = Math.floor(Math.random() * totalCells);
          newPattern.push(randomIndex);
        }
        break;
        
      case "position":
        // Non-repeating positions
        while (newPattern.length < patternLength) {
          const randomIndex = Math.floor(Math.random() * totalCells);
          if (!newPattern.includes(randomIndex)) {
            newPattern.push(randomIndex);
          }
        }
        break;
        
      case "combined":
        // Mix of sequence and unique positions
        const uniquePositions = Math.ceil(patternLength / 2);
        const sequenceLength = patternLength - uniquePositions;
        
        // Generate unique positions first
        while (newPattern.length < uniquePositions) {
          const randomIndex = Math.floor(Math.random() * totalCells);
          if (!newPattern.includes(randomIndex)) {
            newPattern.push(randomIndex);
          }
        }
        
        // Then add sequenced positions
        for (let i = 0; i < sequenceLength; i++) {
          const randomIndex = Math.floor(Math.random() * totalCells);
          newPattern.push(randomIndex);
        }
        break;
    }
    
    return newPattern;
  }, [gameMode, difficulty, level, totalCells]);

  const startGame = useCallback(() => {
    setShowModeSelector(false);
    setIsPlaying(true);
    setIsShowingPattern(true);
    setLevel(1);
    setScore(0);
    setUserPattern([]);
    
    // Set pattern display speed based on difficulty
    setPatternSpeed(Math.max(1200 - (difficulty * 200), 400));
    
    const newPattern = generatePattern();
    setPattern(newPattern);
    
    // Calculate time limit based on difficulty and pattern length
    const timeLimit = Math.max(30 - (difficulty * 3), 10);
    setTimeLeft(timeLimit);
    
    // Display pattern cells one by one with a delay
    showPatternSequentially(newPattern);
  }, [difficulty, generatePattern]);

  const showPatternSequentially = (patternArray: number[]) => {
    setIsShowingPattern(true);
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= patternArray.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsShowingPattern(false);
          // Start the timer after showing pattern
          startTimer();
        }, 500);
        return;
      }
      
      // Update pattern to show only current cell
      setPattern(prevPattern => {
        const newPattern = [...prevPattern];
        // Reset all to false except current index
        return newPattern.map((_, i) => i === currentIndex ? patternArray[currentIndex] : -1);
      });
      
      currentIndex++;
    }, patternSpeed);
  };

  const startTimer = () => {
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Clean up timer if component unmounts
    return () => clearInterval(timerInterval);
  };

  const handleCellClick = (index: number) => {
    if (isShowingPattern || !isPlaying) return;
    
    const newUserPattern = [...userPattern, index];
    setUserPattern(newUserPattern);
    
    const isCorrect = checkPattern(newUserPattern);
    
    if (!isCorrect) {
      // Incorrect selection
      handleGameOver();
      return;
    }
    
    // Check if pattern is complete
    if (newUserPattern.length === pattern.length) {
      // Calculate points based on difficulty, level, and remaining time
      const timeBonus = Math.ceil(timeLeft / 2);
      const pointsEarned = (difficulty * 10) + (level * 5) + timeBonus;
      
      setScore(prev => prev + pointsEarned);
      
      toast({
        title: "Level Complete!",
        description: `+${pointsEarned} points (Time bonus: +${timeBonus})`,
      });
      
      // Confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Go to next level
      setTimeout(() => {
        goToNextLevel();
      }, 1000);
    }
  };

  const checkPattern = (userPatternToCheck: number[]) => {
    const userIndex = userPatternToCheck.length - 1;
    
    switch (gameMode) {
      case "sequence":
        // Must match exact sequence
        return userPatternToCheck[userIndex] === pattern[userIndex];
        
      case "position":
        // Must click all pattern cells (order doesn't matter)
        return pattern.includes(userPatternToCheck[userIndex]);
        
      case "combined":
        // First half must be in position, second half in sequence
        const positionCount = Math.ceil(pattern.length / 2);
        if (userIndex < positionCount) {
          // Check position
          return pattern.slice(0, positionCount).includes(userPatternToCheck[userIndex]);
        } else {
          // Check sequence
          return userPatternToCheck[userIndex] === pattern[userIndex];
        }
        
      default:
        return false;
    }
  };

  const goToNextLevel = () => {
    setLevel(prev => prev + 1);
    setUserPattern([]);
    setIsShowingPattern(true);
    
    // Increase speed slightly with each level
    setPatternSpeed(prev => Math.max(prev - 50, 300));
    
    const newPattern = generatePattern();
    setPattern(newPattern);
    
    // Reset timer with bonus time for higher levels
    const timeLimit = Math.max(30 - (difficulty * 3) + Math.floor(level / 3), 10);
    setTimeLeft(timeLimit);
    
    // Show pattern again
    showPatternSequentially(newPattern);
  };

  const handleGameOver = async () => {
    setIsPlaying(false);
    
    toast({
      title: "Game Over",
      description: `Final score: ${score} | Reached level: ${level}`,
      variant: "destructive",
    });
    
    // Save score to database if user is authenticated
    if (session?.user?.id) {
      try {
        await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "brain_game",
          activity_name: "Advanced Pattern Recognition",
          duration_minutes: Math.ceil(level),
          focus_rating: Math.min(100, score / 10),
          notes: `Game mode: ${gameMode} | Reached level ${level} on difficulty ${difficulty} with score ${score}`
        });
      } catch (error) {
        console.error("Error saving game results:", error);
      }
    }
    
    // Show mode selector after game over
    setShowModeSelector(true);
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Brain className="h-5 w-5 text-primary" />
          Advanced Pattern Recognition
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {showModeSelector ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select Game Mode</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Choose your challenge type
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <Card 
                className={`border-2 cursor-pointer hover:bg-accent transition-colors ${gameMode === 'sequence' ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setGameMode('sequence')}
              >
                <CardContent className="p-4 text-center">
                  <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <AlarmClock className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium">Sequence</h4>
                  <p className="text-xs text-muted-foreground mt-2">
                    Remember the exact order of pattern elements
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className={`border-2 cursor-pointer hover:bg-accent transition-colors ${gameMode === 'position' ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setGameMode('position')}
              >
                <CardContent className="p-4 text-center">
                  <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Grid3X3 className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium">Position</h4>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recall all highlighted positions (order doesn't matter)
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className={`border-2 cursor-pointer hover:bg-accent transition-colors ${gameMode === 'combined' ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setGameMode('combined')}
              >
                <CardContent className="p-4 text-center">
                  <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium">Combined</h4>
                  <p className="text-xs text-muted-foreground mt-2">
                    Mix of position and sequence challenges - expert level
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Difficulty: {difficulty}</span>
                <span className="text-xs text-muted-foreground">
                  {difficulty === 1 ? "Easy" : difficulty === 2 ? "Medium" : "Hard"}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                value={difficulty}
                onChange={(e) => setDifficulty(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <Button 
              className="w-full group relative overflow-hidden"
              onClick={startGame}
            >
              <span className="relative z-10 flex items-center">
                <Play className="h-4 w-4 mr-2" />
                Start Game
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-75 group-hover:animate-shimmer" />
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    Score
                  </span>
                  <span className="text-lg font-bold">{score}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-amber-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(score / 200 * 100, 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <AlarmClock className="h-4 w-4 text-red-500" />
                    Time
                  </span>
                  <span className="text-lg font-bold">{timeLeft}s</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-red-500"
                    initial={{ width: '100%' }}
                    animate={{ width: `${(timeLeft / 30) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className={`absolute inset-0 flex items-center justify-center bg-background/80 ${isShowingPattern ? 'opacity-100 z-10' : 'opacity-0 -z-10'} transition-opacity duration-300`}>
                <div className="text-xl font-medium text-primary animate-pulse">
                  Memorize the pattern!
                </div>
              </div>
              
              <div className={`grid gap-2`} style={{ 
                gridTemplateColumns: `repeat(${gridSize}, 1fr)` 
              }}>
                {Array.from({ length: totalCells }).map((_, index) => (
                  <motion.button
                    key={index}
                    className={`aspect-square rounded-lg transition-colors ${
                      isShowingPattern && pattern.includes(index)
                        ? 'bg-primary text-primary-foreground'
                        : userPattern.includes(index)
                        ? 'bg-primary/50 hover:bg-primary/60'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCellClick(index)}
                    disabled={isShowingPattern}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="font-medium">Level: {level}</span>
                <span className="text-muted-foreground ml-2">
                  Grid: {gridSize}×{gridSize}
                </span>
              </div>
              
              <div className="text-sm font-medium flex items-center gap-1">
                <span className="text-muted-foreground">Mode:</span>
                <span className="capitalize">{gameMode}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
