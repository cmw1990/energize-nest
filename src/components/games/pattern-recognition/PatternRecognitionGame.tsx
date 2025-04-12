
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GameStatus } from './GameStatus';
import { GameBoard } from './GameBoard';
import { GameResults } from './GameResults';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export const PatternRecognitionGame = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(3); // 1-5 scale
  
  // Generate a random pattern based on level and difficulty
  const generatePattern = () => {
    const patternLength = level + difficulty;
    const newPattern = [];
    
    for (let i = 0; i < patternLength; i++) {
      newPattern.push(Math.floor(Math.random() * 9));
    }
    
    return newPattern;
  };
  
  // Start a new game
  const startGame = () => {
    setIsPlaying(true);
    setIsShowingPattern(true);
    setGameOver(false);
    setLevel(1);
    setScore(0);
    setUserPattern([]);
    setPattern(generatePattern());
    
    // Show pattern for a few seconds
    setTimeout(() => {
      setIsShowingPattern(false);
    }, 2000 + (difficulty * 500));
  };
  
  // Handle cell click during user input
  const handleCellClick = (index: number) => {
    if (isShowingPattern || gameOver) return;
    
    const newUserPattern = [...userPattern, index];
    setUserPattern(newUserPattern);
    
    // Check if user input matches pattern so far
    const isCorrect = newUserPattern.every((val, idx) => val === pattern[idx]);
    
    if (!isCorrect) {
      handleGameOver();
      return;
    }
    
    // Check if user completed the pattern
    if (newUserPattern.length === pattern.length) {
      const newScore = score + (level * difficulty * 10);
      setScore(newScore);
      
      // Level up
      const newLevel = level + 1;
      setLevel(newLevel);
      
      // Reset for next level
      setUserPattern([]);
      setIsShowingPattern(true);
      
      // Generate new pattern for next level
      const newPattern = generatePattern();
      setPattern(newPattern);
      
      setTimeout(() => {
        setIsShowingPattern(false);
      }, 2000 + (difficulty * 500));
    }
  };
  
  const handleGameOver = async () => {
    setGameOver(true);
    
    // Save score to database if user is logged in
    if (session?.user?.id) {
      try {
        await supabase.from('brain_game_scores').insert({
          user_id: session.user.id,
          game_type: 'pattern_recognition',
          score: score,
          difficulty: difficulty,
          metadata: { level_reached: level }
        });
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
    
    toast({
      title: 'Game Over!',
      description: `You reached level ${level} with a score of ${score}`,
    });
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {gameOver ? (
              <GameResults 
                score={score} 
                level={level} 
                difficulty={difficulty}
                onPlayAgain={startGame}
              />
            ) : (
              <GameBoard
                isShowingPattern={isShowingPattern}
                pattern={pattern}
                userPattern={userPattern}
                onCellClick={handleCellClick}
              />
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
