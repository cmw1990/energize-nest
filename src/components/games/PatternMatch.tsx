import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SUPABASE_URL, SUPABASE_KEY } from "@/integrations/supabase/db-client";
import { useAuth } from "@/components/AuthProvider";
import { Brain } from "lucide-react";

const COLORS = ["red", "blue", "green", "yellow"];
const COLOR_CLASSES = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500"
};

export const PatternMatch = () => {
  const [pattern, setPattern] = useState<string[]>([]);
  const [userPattern, setUserPattern] = useState<string[]>([]);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isShowingPattern && pattern.length > 0) {
      let i = 0;
      const showNext = () => {
        if (i < pattern.length) {
          const button = document.getElementById(`pattern-${pattern[i]}`);
          if (button) {
            button.classList.add("opacity-100");
            setTimeout(() => {
              button.classList.remove("opacity-100");
              i++;
              timeout = setTimeout(showNext, 800);
            }, 500);
          }
        } else {
          setIsShowingPattern(false);
        }
      };
      timeout = setTimeout(showNext, 1000);
    }
    return () => clearTimeout(timeout);
  }, [isShowingPattern, pattern]);

  const startGame = () => {
    setIsActive(true);
    setScore(0);
    addToPattern();
  };

  const addToPattern = () => {
    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setPattern(prev => [...prev, newColor]);
    setUserPattern([]);
    setIsShowingPattern(true);
  };

  const handleColorClick = (color: string) => {
    if (isShowingPattern) return;

    const newUserPattern = [...userPattern, color];
    setUserPattern(newUserPattern);

    const isCorrect = newUserPattern.every(
      (c, i) => c === pattern[i]
    );

    if (!isCorrect) {
      endGame();
    } else if (newUserPattern.length === pattern.length) {
      setScore(prev => prev + 1);
      setTimeout(addToPattern, 1000);
    }
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
              activity_type: "pattern_match",
              activity_name: "Pattern Match",
              duration_minutes: Math.ceil(score / 2),
              focus_rating: Math.round((score / 10) * 10),
              energy_rating: null,
              notes: `Completed Pattern Match with score: ${score}`
            })
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || response.statusText);
        }

        toast({
          title: "Game Over!",
          description: `Final score: ${score}. Well done!`,
        });
      } catch (error) {
        console.error("Error logging Pattern Match:", error);
        toast({
          title: "Error Saving Results",
          description: "There was a problem saving your game results.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
        setPattern([]);
      }
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full animate-float">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Pattern Match</h2>
        </div>
        <div className="text-lg">Score: {score}</div>
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
        <div className="grid grid-cols-2 gap-4 mb-8">
          {COLORS.map((color) => (
            <Button
              key={color}
              id={`pattern-${color}`}
              onClick={() => handleColorClick(color)}
              className={`h-24 transition-all duration-300 opacity-60 hover:opacity-100 ${COLOR_CLASSES[color as keyof typeof COLOR_CLASSES]} ${
                isShowingPattern ? 'animate-breathe' : ''
              }`}
              disabled={isShowingPattern || isSubmitting}
            />
          ))}
        </div>
      )}

      <div className="mt-6 text-sm text-muted-foreground">
        Watch the pattern of colors and repeat it by clicking the buttons in the same order.
      </div>
    </Card>
  );
};