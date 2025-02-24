import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export const ReactionTimeTest = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'clicked' | 'finished'>('waiting');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (gameState === 'ready') {
      const delay = Math.random() * 3000 + 1000; // Random delay between 1-4 seconds
      timeoutId = setTimeout(() => {
        setStartTime(Date.now());
        setGameState('waiting');
      }, delay);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [gameState]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (countdown > 0 && gameState === 'waiting') {
      intervalId = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setGameState('ready');
      setCountdown(3);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [countdown, gameState]);

  const handleClick = async () => {
    if (gameState === 'waiting' && startTime) {
      const currentTime = Date.now();
      const newReactionTime = currentTime - startTime;
      setReactionTime(newReactionTime);
      
      if (!bestTime || newReactionTime < bestTime) {
        setBestTime(newReactionTime);
      }
      
      setGameState('clicked');

      if (session?.user?.id) {
        setIsSubmitting(true);
        try {
          const { error } = await supabase.from("energy_focus_logs").insert({
            user_id: session.user.id,
            activity_type: "brain_game",
            activity_name: "Reaction Time Test",
            duration_minutes: 1,
            focus_rating: Math.max(0, Math.min(100, Math.round(100 - (newReactionTime / 10)))),
            energy_rating: null,
            notes: `Completed Reaction Time Test with time ${newReactionTime}ms`
          });

          if (error) throw error;

          toast({
            title: "Score saved!",
            description: "Your progress has been recorded.",
          });
        } catch (error) {
          console.error("Error saving score:", error);
          toast({
            title: "Error Saving Score",
            description: "There was a problem saving your progress.",
            variant: "destructive",
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    } else if (gameState === 'clicked') {
      setGameState('waiting');
      setStartTime(0);
      setCountdown(3);
    }
  };

  const getButtonColor = () => {
    switch (gameState) {
      case 'ready':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'waiting':
        return startTime ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600';
      case 'clicked':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getButtonText = () => {
    if (gameState === 'waiting') {
      if (countdown > 0) return `Starting in ${countdown}...`;
      if (startTime) return 'Click Now!';
      return 'Start Test';
    }
    if (gameState === 'ready') return 'Wait for green...';
    if (gameState === 'clicked') return 'Click to try again';
    return 'Start';
  };

  return (
    <Card className="p-6 max-w-xl mx-auto">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Reaction Time Test</h2>
          <p className="text-muted-foreground">
            Test your reflexes! Click as soon as the color changes to green.
          </p>
        </div>

        <Button
          className={`w-full h-32 text-xl transition-colors ${getButtonColor()}`}
          onClick={handleClick}
          disabled={isSubmitting}
        >
          {getButtonText()}
        </Button>

        <div className="space-y-2">
          {reactionTime && (
            <p className="text-lg">
              Your reaction time: <span className="font-bold">{reactionTime}ms</span>
            </p>
          )}
          {bestTime && (
            <p className="text-lg">
              Best time: <span className="font-bold">{bestTime}ms</span>
            </p>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Average reaction times:</p>
          <ul className="list-disc list-inside">
            <li>Exceptional: &lt; 150ms</li>
            <li>Good: 150-250ms</li>
            <li>Average: 250-350ms</li>
            <li>Slow: &gt; 350ms</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};