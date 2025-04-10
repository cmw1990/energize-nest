
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface GameHeaderProps {
  score: number;
  onReset?: () => void;
  onNewGame?: () => void;
  isSubmitting?: boolean;
}

export function GameHeader({ score, onReset, onNewGame, isSubmitting = false }: GameHeaderProps) {
  // Use whichever function is provided
  const handleReset = onReset || onNewGame;
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">Score</h3>
        <p className="text-3xl font-bold">{score}</p>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleReset} 
        disabled={isSubmitting}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        New Game
      </Button>
    </div>
  );
}
