import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Zap } from "lucide-react";

export const SequenceMemory = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playbackIndex, setPlaybackIndex] = useState(-1);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (playbackIndex >= 0 && playbackIndex < sequence.length) {
      timeout = setTimeout(() => {
        setPlaybackIndex(prev => prev + 1);
      }, 1000);
    } else if (playbackIndex >= sequence.length) {
      setPlaybackIndex(-1);
      setIsPlaying(false);
    }
    return () => clearTimeout(timeout);
  }, [playbackIndex, sequence.length]);

  const startGame = () => {
    setScore(0);
    addToSequence();
    toast({
      title: "Game Started!",
      description: "Watch the sequence carefully and repeat it.",
    });
  };

  const addToSequence = () => {
    const newNumber = Math.floor(Math.random() * 9) + 1;
    const newSequence = [...sequence, newNumber];
    setSequence(newSequence);
    setUserSequence([]);
    setIsPlaying(true);
    setPlaybackIndex(0);
  };

  const handleNumberClick = (number: number) => {
    if (isPlaying) return;

    const newUserSequence = [...userSequence, number];
    setUserSequence(newUserSequence);

    const isCorrect = newUserSequence.every(
      (num, index) => num === sequence[index]
    );

    if (!isCorrect) {
      endGame();
    } else if (newUserSequence.length === sequence.length) {
      setScore(prev => prev + sequence.length);
      setTimeout(addToSequence, 1000);
    }
  };

  const endGame = async () => {
    setIsPlaying(false);
    setIsSubmitting(true);
    
    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "sequence_memory",
          activity_name: "Sequence Memory",
          duration_minutes: Math.ceil(score / 2),
          focus_rating: Math.round((score / 20) * 10),
          energy_rating: null,
          notes: `Completed sequence memory with score: ${score}`
        });

        if (error) throw error;

        toast({
          title: "Game Complete!",
          description: `Final score: ${score}. Well done!`,
        });
      } catch (error) {
        console.error("Error logging sequence memory:", error);
        toast({
          title: "Error Saving Results",
          description: "There was a problem saving your game results.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
        setSequence([]);
      }
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Zap className="h-5 w-5 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Sequence Memory
          </h2>
        </div>
        <div className="text-lg font-semibold">
          Score: <span className="text-primary">{score}</span>
        </div>
      </div>

      {sequence.length === 0 ? (
        <Button 
          onClick={startGame} 
          className="w-full group relative overflow-hidden"
          disabled={isSubmitting}
        >
          <span className="relative z-10">Start Game</span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-75 group-hover:animate-shimmer" />
        </Button>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <Button
              key={number}
              onClick={() => handleNumberClick(number)}
              variant={playbackIndex >= 0 && sequence[playbackIndex] === number ? "default" : "outline"}
              className={`h-16 text-xl font-bold transition-all hover:scale-105 ${
                playbackIndex >= 0 && sequence[playbackIndex] === number ? 'animate-breathe bg-primary' : ''
              }`}
              disabled={isPlaying || isSubmitting}
            >
              {number}
            </Button>
          ))}
        </div>
      )}

      <div className="mt-6">
        <div className="text-sm text-muted-foreground">
          Watch the sequence of numbers and repeat it in the same order. The sequence gets longer with each successful round.
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Brain className="h-4 w-4" />
          <span>Improves: Working Memory, Pattern Recognition, Concentration</span>
        </div>
      </div>
    </Card>
  );
};