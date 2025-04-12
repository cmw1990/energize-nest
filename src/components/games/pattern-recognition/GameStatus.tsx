
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Brain, Play, Settings } from "lucide-react";

interface GameStatusProps {
  isPlaying: boolean;
  isShowingPattern: boolean;
  difficulty: number;
  setDifficulty: (value: number) => void;
  startGame: () => void;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  isPlaying,
  isShowingPattern,
  difficulty,
  setDifficulty,
  startGame
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Game Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isPlaying ? (
          <>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <span className="text-sm font-medium">
                    {difficulty === 1 && "Easy"}
                    {difficulty === 2 && "Casual"}
                    {difficulty === 3 && "Medium"}
                    {difficulty === 4 && "Hard"}
                    {difficulty === 5 && "Expert"}
                  </span>
                </div>
                <Slider
                  id="difficulty"
                  min={1}
                  max={5}
                  step={1}
                  value={[difficulty]}
                  onValueChange={(value) => setDifficulty(value[0])}
                  className="mt-2"
                />
              </div>
              
              <div className="bg-muted p-3 rounded-md text-sm space-y-2">
                <div className="font-medium">Game Rules:</div>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Watch the pattern of highlighted cells</li>
                  <li>Remember the sequence</li>
                  <li>Repeat the pattern by clicking cells in order</li>
                  <li>Each correct sequence advances you to the next level</li>
                  <li>Higher difficulty means longer patterns</li>
                </ol>
              </div>
            </div>
            
            <Button 
              onClick={startGame} 
              className="w-full"
              size="lg"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Game
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-primary/10 p-4 rounded-md">
              <div className="text-sm font-medium mb-2">Game in Progress</div>
              {isShowingPattern ? (
                <div className="text-sm text-muted-foreground">
                  Watch and remember the pattern...
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Your turn! Repeat the pattern.
                </div>
              )}
            </div>
            
            <div className="bg-muted p-3 rounded-md text-sm space-y-1">
              <div className="font-medium">Benefits:</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Improves working memory</li>
                <li>• Enhances concentration</li>
                <li>• Strengthens neural connections</li>
                <li>• Helps with learning and recall</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
