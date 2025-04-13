
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { useToast } from "@/hooks/use-toast";
import { Brain, Clock, Award, RotateCcw, Share2, Trophy } from "lucide-react";
import BrainMatchGame from "@/components/games/brain-match/BrainMatchGame";

const BrainMatch = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('brainMatchBestScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const { toast } = useToast();

  useEffect(() => {
    if (gameCompleted && score > bestScore) {
      setBestScore(score);
      localStorage.setItem('brainMatchBestScore', score.toString());
      
      toast({
        title: "New High Score!",
        description: `Congratulations! You've set a new personal best: ${score} points.`,
        variant: "default",
      });
    }
  }, [gameCompleted, score, bestScore, toast]);

  const handleStart = () => {
    setGameStarted(true);
    setGameCompleted(false);
    setScore(0);
    setTimeElapsed(0);
  };

  const handleGameComplete = (finalScore: number, time: number) => {
    setScore(finalScore);
    setTimeElapsed(time);
    setGameCompleted(true);
    setGameStarted(false);
  };

  const handleShare = () => {
    const text = `I scored ${score} points in ${timeElapsed} seconds on BrainMatch! Can you beat my score? #BrainMatch #CognitiveTraining`;
    
    if (navigator.share) {
      navigator.share({
        title: 'BrainMatch Score',
        text: text,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(text)
        .then(() => {
          toast({
            title: "Copied to clipboard",
            description: "Your score has been copied. Paste it anywhere to share!",
          });
        })
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  return (
    <ToolAnalyticsWrapper toolName="brain-match" toolType="cognitive-game">
      <div className="min-h-screen bg-background">
        <LandingHeader />
        <div className="container mx-auto p-4 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>BrainMatch</CardTitle>
                  <CardDescription>Test and improve your visual memory and pattern recognition</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>Best: {bestScore}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!gameStarted && !gameCompleted && (
                <div className="text-center space-y-6 py-12">
                  <div className="max-w-md mx-auto space-y-3">
                    <h2 className="text-2xl font-bold">Challenge Your Memory</h2>
                    <p className="text-muted-foreground">
                      Match pairs of identical tiles by flipping them two at a time. Find all matches as quickly as possible!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 py-4">
                      <div className="text-center p-3 bg-primary/10 rounded-lg">
                        <Brain className="h-7 w-7 text-primary mx-auto mb-2" />
                        <p className="font-medium">Memory</p>
                      </div>
                      <div className="text-center p-3 bg-primary/10 rounded-lg">
                        <Clock className="h-7 w-7 text-primary mx-auto mb-2" />
                        <p className="font-medium">Speed</p>
                      </div>
                      <div className="text-center p-3 bg-primary/10 rounded-lg">
                        <Award className="h-7 w-7 text-primary mx-auto mb-2" />
                        <p className="font-medium">Focus</p>
                      </div>
                    </div>
                  </div>
                  <Button size="lg" onClick={handleStart}>
                    Start Game
                  </Button>
                </div>
              )}

              {gameStarted && (
                <BrainMatchGame onGameComplete={handleGameComplete} />
              )}

              {gameCompleted && (
                <div className="text-center space-y-6 py-8">
                  <h2 className="text-2xl font-bold">Game Complete!</h2>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="text-3xl font-bold">{score}</p>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="text-3xl font-bold">{timeElapsed}s</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-3 pt-4">
                    <Button onClick={handleStart} className="gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Play Again
                    </Button>
                    <Button variant="outline" onClick={handleShare} className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share Score
                    </Button>
                  </div>
                  
                  <div className="max-w-md mx-auto mt-8 text-muted-foreground text-sm">
                    <p>Regular brain training with memory games like this one has been shown to improve cognitive function and may help reduce cognitive decline.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Benefits of Memory Games</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Cognitive Enhancement
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Regular memory training may improve concentration, attention to detail, and overall cognitive function.
                  </p>
                </div>
                <div className="p-4 border rounded-lg space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Processing Speed
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Memory matching games can help increase your brain's processing speed and mental agility.
                  </p>
                </div>
                <div className="p-4 border rounded-lg space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Long-term Health
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Research suggests cognitive training may help maintain brain health and potentially reduce age-related cognitive decline.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  );
};

export default BrainMatch;
