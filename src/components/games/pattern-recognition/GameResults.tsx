
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Brain, Award } from "lucide-react";

interface GameResultsProps {
  score: number;
  level: number;
  difficulty: number;
  onPlayAgain: () => void;
}

export const GameResults: React.FC<GameResultsProps> = ({
  score,
  level,
  difficulty,
  onPlayAgain
}) => {
  const getBadge = () => {
    if (level >= 10) return <Trophy className="h-16 w-16 text-yellow-500" />;
    if (level >= 7) return <Medal className="h-16 w-16 text-blue-500" />;
    if (level >= 5) return <Award className="h-16 w-16 text-green-500" />;
    return <Brain className="h-16 w-16 text-purple-500" />;
  };

  const getBadgeText = () => {
    if (level >= 10) return "Memory Master!";
    if (level >= 7) return "Pattern Pro!";
    if (level >= 5) return "Good Memory!";
    return "Nice Try!";
  };

  const getPerformanceText = () => {
    if (level >= 10) return "Exceptional memory skills! You have superior pattern recognition abilities.";
    if (level >= 7) return "Great job! Your memory is well above average.";
    if (level >= 5) return "Good performance! You have solid memory skills.";
    return "Keep practicing! Memory is like a muscle that gets stronger with use.";
  };

  const difficultyText = () => {
    switch(difficulty) {
      case 1: return "Easy";
      case 2: return "Casual";
      case 3: return "Medium";
      case 4: return "Hard";
      case 5: return "Expert";
      default: return "Medium";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
        <p className="text-muted-foreground">Let's see how you did:</p>
      </div>

      <div className="flex flex-col items-center space-y-2">
        {getBadge()}
        <span className="text-xl font-bold">{getBadgeText()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="bg-muted p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">{score}</div>
          <div className="text-sm text-muted-foreground">Total Score</div>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">{level}</div>
          <div className="text-sm text-muted-foreground">Level Reached</div>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center md:col-span-2">
          <div className="text-lg font-medium">{difficultyText()} Mode</div>
        </div>
      </div>

      <div className="text-center bg-primary/10 p-4 rounded-lg max-w-md">
        <p className="italic">{getPerformanceText()}</p>
      </div>

      <Button size="lg" onClick={onPlayAgain} className="mt-4">
        Play Again
      </Button>
    </div>
  );
};
