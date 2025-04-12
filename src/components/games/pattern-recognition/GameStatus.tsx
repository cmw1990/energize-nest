
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Settings } from "lucide-react";

interface GameStatusProps {
  isPlaying: boolean;
  isShowingPattern: boolean;
  difficulty: number;
  setDifficulty: (difficulty: number) => void;
}

export const GameStatus = ({ 
  isPlaying, 
  isShowingPattern, 
  difficulty, 
  setDifficulty 
}: GameStatusProps) => {
  return (
    <div className="space-y-4">
      {!isPlaying ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Difficulty Level: {difficulty}</span>
          </div>
          <Slider
            value={[difficulty]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => setDifficulty(value[0])}
          />
          <Button className="w-full" onClick={() => {}}>
            <Play className="h-4 w-4 mr-2" />
            Start Game
          </Button>
        </div>
      ) : (
        <div className="text-center">
          {isShowingPattern ? (
            <div className="text-lg font-medium text-primary">
              Memorize the pattern!
            </div>
          ) : (
            <div className="text-lg font-medium">
              Repeat the pattern
            </div>
          )}
        </div>
      )}
    </div>
  );
};
