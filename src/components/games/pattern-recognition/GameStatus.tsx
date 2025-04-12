
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Settings, Award, Brain } from "lucide-react";

interface GameStatusProps {
  isPlaying: boolean;
  isShowingPattern: boolean;
  difficulty: number;
  setDifficulty: (difficulty: number) => void;
  startGame: () => void;
}

export const GameStatus = ({ 
  isPlaying, 
  isShowingPattern, 
  difficulty, 
  setDifficulty,
  startGame 
}: GameStatusProps) => {
  const difficultyLabels = [
    "Beginner",
    "Easy",
    "Medium",
    "Hard",
    "Expert"
  ];

  return (
    <div className="space-y-4">
      {!isPlaying ? (
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Difficulty: {difficultyLabels[difficulty-1]}</span>
            </div>
            <Slider
              value={[difficulty]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) => setDifficulty(value[0])}
              className="my-4"
            />
            <div className="grid grid-cols-5 gap-1 text-xs text-center text-muted-foreground">
              {difficultyLabels.map((label, i) => (
                <div key={i} className="text-center">{label}</div>
              ))}
            </div>
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
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Brain className="h-4 w-4 text-primary" />
              <span>Memory Training</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 text-amber-500" />
              <span>Focus: High</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-4 border rounded-lg bg-card">
          {isShowingPattern ? (
            <div className="text-lg font-medium text-primary animate-pulse">
              Memorize the pattern!
            </div>
          ) : (
            <div className="text-lg font-medium">
              Repeat the pattern
            </div>
          )}
          <div className="text-sm text-muted-foreground mt-2">
            {isShowingPattern 
              ? "Watch carefully..." 
              : "Click the cells in the order they appeared"}
          </div>
        </div>
      )}
    </div>
  );
};
