import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Keyboard } from "lucide-react";

const WORDS = [
  "focus", "brain", "smart", "think", "learn",
  "study", "mind", "sharp", "quick", "alert",
  "memory", "wisdom", "growth", "mental", "skill",
  "power", "logic", "solve", "puzzle", "speed"
];

export const SpeedTyping = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [userInput, setUserInput] = useState("");
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

  const startGame = () => {
    setIsActive(true);
    setScore(0);
    setTimeLeft(30);
    generateNewWord();
    toast({
      title: "Game Started!",
      description: "Type as many words as you can in 30 seconds.",
    });
  };

  const generateNewWord = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(newWord);
    setUserInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input);

    if (input === currentWord) {
      setScore(prev => prev + 1);
      generateNewWord();
    }
  };

  const endGame = async () => {
    setIsActive(false);
    setIsSubmitting(true);
    
    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "speed_typing",
          activity_name: "Speed Typing",
          duration_minutes: 0.5,
          focus_rating: Math.round((score / 20) * 10),
          energy_rating: null,
          notes: `Completed speed typing with score: ${score}`
        });

        if (error) throw error;

        toast({
          title: "Game Complete!",
          description: `Final score: ${score}. Well done!`,
        });
      } catch (error) {
        console.error("Error logging speed typing:", error);
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
            <Keyboard className="h-5 w-5 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Speed Typing
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">
            Score: <span className="text-primary">{score}</span>
          </div>
          <div className="text-lg font-semibold">
            Time: <span className={`${timeLeft <= 10 ? 'text-energy-low animate-pulse' : 'text-secondary'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {!isActive ? (
        <Button 
          onClick={startGame} 
          className="w-full group relative overflow-hidden"
          disabled={isSubmitting}
        >
          <span className="relative z-10">Start Game</span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-75 group-hover:animate-shimmer" />
        </Button>
      ) : (
        <>
          <div className="text-center mb-8">
            <div className="text-4xl font-bold mb-4 animate-breathe bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {currentWord}
            </div>
            <Input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type the word..."
              className="text-center text-xl focus:ring-2 ring-primary transition-all transform hover:scale-105"
              autoFocus
              disabled={isSubmitting}
            />
          </div>
        </>
      )}

      <div className="mt-6">
        <div className="text-sm text-muted-foreground">
          Type each word as quickly and accurately as possible. Score points for each correct word typed.
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Brain className="h-4 w-4" />
          <span>Improves: Typing Speed, Focus, Reaction Time</span>
        </div>
      </div>
    </Card>
  );
};