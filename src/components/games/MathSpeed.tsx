import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SUPABASE_URL, SUPABASE_KEY } from "@/integrations/supabase/db-client";
import { useAuth } from "@/components/AuthProvider";
import { Calculator } from "lucide-react";

export const MathSpeed = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState("+");
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
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

  const generateQuestion = () => {
    const operators = ["+", "-", "*"];
    const newOperator = operators[Math.floor(Math.random() * operators.length)];
    let n1, n2;

    switch (newOperator) {
      case "+":
        n1 = Math.floor(Math.random() * 50) + 1;
        n2 = Math.floor(Math.random() * 50) + 1;
        break;
      case "-":
        n1 = Math.floor(Math.random() * 50) + 26;
        n2 = Math.floor(Math.random() * 25) + 1;
        break;
      case "*":
        n1 = Math.floor(Math.random() * 12) + 1;
        n2 = Math.floor(Math.random() * 12) + 1;
        break;
      default:
        n1 = Math.floor(Math.random() * 50) + 1;
        n2 = Math.floor(Math.random() * 50) + 1;
    }

    setNum1(n1);
    setNum2(n2);
    setOperator(newOperator);
    setUserAnswer("");
  };

  const startGame = () => {
    setIsActive(true);
    setScore(0);
    setTimeLeft(60);
    generateQuestion();
  };

  const checkAnswer = () => {
    let correctAnswer;
    switch (operator) {
      case "+":
        correctAnswer = num1 + num2;
        break;
      case "-":
        correctAnswer = num1 - num2;
        break;
      case "*":
        correctAnswer = num1 * num2;
        break;
      default:
        correctAnswer = 0;
    }

    if (parseInt(userAnswer) === correctAnswer) {
      setScore(prev => prev + 1);
      toast({
        title: "Correct!",
        description: "Keep going!",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The answer was ${correctAnswer}`,
        variant: "destructive",
      });
    }
    generateQuestion();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer) return;
    checkAnswer();
  };

  const endGame = async () => {
    setIsActive(false);
    setIsSubmitting(true);
    
    if (session?.user) {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/energy_focus_logs`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${session.access_token}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              user_id: session.user.id,
              activity_type: "math_speed",
              activity_name: "Math Speed",
              duration_minutes: 1,
              focus_rating: Math.round((score / 30) * 10),
              energy_rating: null,
              notes: `Completed Math Speed with score: ${score}`
            })
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || response.statusText);
        }

        toast({
          title: "Game Complete!",
          description: `Final score: ${score}. Well done!`,
        });
      } catch (error) {
        console.error("Error logging Math Speed:", error);
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
          <div className="p-2 bg-primary/10 rounded-full animate-float">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Math Speed</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">Score: {score}</div>
          <div className={`text-lg font-semibold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : ''}`}>
            Time: {timeLeft}s
          </div>
        </div>
      </div>

      {!isActive ? (
        <Button 
          onClick={startGame} 
          className="w-full animate-pulse bg-primary/90 hover:bg-primary"
          disabled={isSubmitting}
        >
          Start Game
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-4xl font-bold text-center">
            {num1} {operator} {num2} = ?
          </div>
          
          <Input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer"
            className="text-center text-2xl"
            autoFocus
          />
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!userAnswer || isSubmitting}
          >
            Submit
          </Button>
        </form>
      )}

      <div className="mt-6 text-sm text-muted-foreground">
        Solve as many math problems as you can in 60 seconds. The faster you are, the higher your score!
      </div>
    </Card>
  );
};