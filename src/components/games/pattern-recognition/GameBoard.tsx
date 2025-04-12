
import React from 'react';
import { Button } from "@/components/ui/button";

interface GameBoardProps {
  isShowingPattern: boolean;
  pattern: number[];
  userPattern: number[];
  onCellClick: (index: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  isShowingPattern,
  pattern,
  userPattern,
  onCellClick
}) => {
  const renderCell = (index: number) => {
    const isActive = isShowingPattern && pattern.includes(index) && 
                   pattern[pattern.findIndex(val => val === index)] === pattern[userPattern.length];
    const isSelected = userPattern.includes(index);
    
    return (
      <Button
        key={index}
        className={`aspect-square h-20 md:h-24 transition-colors ${
          isActive ? 'bg-primary/80 hover:bg-primary/90' : 
          isSelected ? 'bg-secondary hover:bg-secondary/80' : 
          'bg-background hover:bg-secondary/30'
        }`}
        onClick={() => onCellClick(index)}
        disabled={isShowingPattern}
      />
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-3 gap-2 w-full max-w-md mx-auto">
        {Array.from({ length: 9 }).map((_, index) => renderCell(index))}
      </div>
      <div className="mt-4 text-center">
        {isShowingPattern ? (
          <p className="text-xl font-semibold text-primary animate-pulse">
            Watch the pattern...
          </p>
        ) : (
          <p className="text-xl font-semibold">
            Repeat the pattern
          </p>
        )}
      </div>
    </div>
  );
};
