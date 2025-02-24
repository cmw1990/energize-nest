import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain } from "lucide-react";

export const MathSpeed = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState<'+' | '-' | '×'>('+');
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      endGame();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const generateProblem = () => {
    const operators: ('+' | '-' | '×')[] = ['+', '-', '×'];
    const newOperator = operators[Math.floor(Math.random() * operators.length)];
    let n1, n2;
    
    switch (newOperator) {
      case '+':
        n1 = Math.floor(Math.random() * 50) + 1;
        n2 = Math.floor(Math.random() * 50) + 1;
        break;
      case '-':
        n1 = Math.floor(Math.random() * 50) + 25;
        n2 = Math.floor(Math.random() * n1);
        break;
      case '×':
        n1 = Math.floor(Math.random() * 12) + 1;
        n2 = Math.floor(Math.random() * 12) + 1;
        break;
      default:
        n1 = 0;
        n2 = 0;
    }
    
    setNum1(n1);
    setNum2(n2);
    setOperator(newOperator);
    setUserAnswer("");
  };

  const startGame = () => {
    setIsActive(true);
    setScore(0);
    setTimeLeft(30);
    generateProblem();
  };

  const calculateCorrectAnswer = (): number => {
    switch (operator) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '×': return num1 * num2;
      default: return 0;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctAnswer = calculateCorrectAnswer();
    
    if (parseInt(userAnswer) === correctAnswer) {
      setScore(prev => prev + 1);
      generateProblem();
    } else {
      setScore(prev => Math.max(0, prev - 1));
      setUserAnswer("");
    }
  };

  const endGame = async () => {
    setIsActive(false);
    setIsSubmitting(true);
    
    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "math_speed",
          activity_name: "Math Speed",
          duration_minutes: 0.5,
          focus_rating: Math.round((score / 30) * 10),
          energy_rating: null,
          notes: `Completed math speed with score: ${score}`
        });

        if (error) throw error;

        toast({
          title: "Game Complete!",
          description: `Final score: ${score}. Well done!`,
        });
      } catch (error) {
        console.error("Error logging math speed:", error);
        toast({
          title: "Error Saving Results",
          description: "There was a problem saving your game results.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full animate-bounce">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Math Speed</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg">Score: {score}</div>
          <div className="text-lg">Time: {timeLeft}s</div>
        </div>
      </div>

      {!isActive ? (
        <Button 
          onClick={startGame} 
          className="w-full animate-pulse"
          disabled={isSubmitting}
        >
          Start Game
        </Button>
      ) : (
        <>
          <div className="text-center mb-8">
            <div className="text-4xl font-bold mb-8 animate-float">
              {num1} {operator} {num2} = ?
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter answer"
                className="text-center text-xl focus:ring-2 ring-primary transition-all"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="hover:scale-105 transition-transform"
              >
                Submit
              </Button>
            </form>
          </div>
        </>
      )}

      <div className="mt-6 text-sm text-muted-foreground">
        Solve as many math problems as you can in 30 seconds. Each correct answer adds a point, wrong answers subtract a point.
      </div>
    </Card>
  );
};