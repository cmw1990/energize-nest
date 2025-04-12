import React, { useState, useEffect } from "react"; // Added React import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Added CardContent, CardHeader, CardTitle
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LandingHeader } from "@/components/layout/LandingHeader"; // Changed import
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"; // Added import

type Problem = {
  num1: number;
  num2: number;
  operator: '+' | '-' | '×' | '÷';
  answer: number;
};

export default function SpeedMath() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const { toast } = useToast();
  const { session } = useAuth();

  const generateProblem = (): Problem => {
    const operators: ('+' | '-' | '×' | '÷')[] = ['+', '-', '×', '÷'];
    let operator = operators[Math.floor(Math.random() * operators.length)]; // Use let here
    let num1: number, num2: number, answer: number;

    switch (operator) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * num1) + 1; // Ensure positive result
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      case '÷':
        // Ensure whole number division result
        answer = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * answer;
        break;
      // Removed default case as operator is guaranteed to be one of the four
    }

    return { num1, num2, operator, answer };
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) { // Check isPlaying to prevent multiple calls
      endGame();
    }
    return () => {
        if(timer) clearInterval(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, timeLeft]); // endGame dependency removed as it causes re-renders

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setCurrentProblem(generateProblem());
    setUserAnswer(""); // Clear answer field on start
    // Focus the input field when the game starts
    document.getElementById('user-answer-input')?.focus();
  };

  const endGame = async () => {
    setIsPlaying(false); // Set isPlaying false first
    toast({
        title: "Game Over!",
        description: `Final score: ${score}`,
    });

    if (session?.user?.id) {
      try {
        const { error } = await supabase.from("brain_game_scores").insert({
          user_id: session.user.id,
          game_type: "speed_math",
          score,
          duration_seconds: 60, // Game duration is fixed at 60s
          metadata: {} // Add any relevant metadata if needed
        });

        if (error) throw error;

        // Score saved toast can be added here if needed, but game over toast might suffice
      } catch (error) {
        console.error("Error saving score:", error);
        toast({
          title: "Error Saving Score",
          description: "There was a problem saving your score.",
          variant: "destructive",
        });
      }
    }
  };

  const checkAnswer = () => {
    if (!currentProblem || !isPlaying) return;

    if (parseInt(userAnswer, 10) === currentProblem.answer) {
      setScore((prev) => prev + 1);
      // Optional: Remove correct toast for faster gameplay
      // toast({ title: "Correct!", variant: "default" });
    } else {
      // Optional: Add penalty or just show incorrect
       toast({
         title: "Incorrect",
         description: `The answer was ${currentProblem.answer}`,
         variant: "destructive",
       });
    }

    setUserAnswer("");
    setCurrentProblem(generateProblem());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => { // Added type for event
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  return (
    <ToolAnalyticsWrapper toolName="speed-math" toolType="brain-game">
        <div className="min-h-screen bg-background">
        <LandingHeader /> {/* Changed component */}
        <div className="container mx-auto p-4">
            <Card className="p-6">
            <CardHeader className="p-0 mb-6"> {/* Adjusted padding */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Brain className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Speed Math</CardTitle>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-lg font-semibold">Score: {score}</div>
                        <div className={`text-lg font-semibold tabular-nums ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : ''}`}>
                            Time: {timeLeft}s
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0"> {/* Adjusted padding */}
                {!isPlaying ? (
                    <div className="flex flex-col items-center gap-6 text-center">
                    <p className="text-muted-foreground">
                        Solve as many math problems as you can in 60 seconds!
                    </p>
                    <Button onClick={startGame} size="lg">
                        Start Game
                    </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6">
                    {currentProblem && (
                        <>
                        <div className="text-4xl font-bold mb-4 tabular-nums"> {/* Added tabular-nums */}
                            {currentProblem.num1} {currentProblem.operator} {currentProblem.num2} = ?
                        </div>
                        <div className="flex gap-4">
                            <Input
                            id="user-answer-input" // Added ID for focus
                            type="number"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="text-center text-xl w-32"
                            autoFocus
                            />
                            <Button onClick={checkAnswer}>Submit</Button>
                        </div>
                        </>
                    )}
                    </div>
                )}
            </CardContent>
            </Card>
        </div>
        </div>
    </ToolAnalyticsWrapper>
  );
}
