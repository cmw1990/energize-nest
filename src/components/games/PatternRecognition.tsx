import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Shapes } from "lucide-react";

type Shape = {
  type: 'circle' | 'square' | 'triangle' | 'diamond';
  color: string;
  position: number;
};

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
const SHAPES = ['circle', 'square', 'triangle', 'diamond'] as const;

export const PatternRecognition = () => {
  const [pattern, setPattern] = useState<Shape[]>([]);
  const [userPattern, setUserPattern] = useState<Shape[]>([]);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    if (isShowingPattern) {
      const timer = setTimeout(() => {
        setIsShowingPattern(false);
      }, pattern.length * 1000 + 1000);
      return () => clearTimeout(timer);
    }
  }, [isShowingPattern, pattern.length]);

  const generatePattern = () => {
    const length = Math.min(score + 3, 8);
    const newPattern: Shape[] = Array(length).fill(null).map(() => ({
      type: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      position: Math.floor(Math.random() * 9)
    }));
    
    setPattern(newPattern);
    setUserPattern([]);
    setIsShowingPattern(true);
  };

  const startGame = () => {
    setIsActive(true);
    setScore(0);
    generatePattern();
  };

  const handleShapeClick = (shape: Shape) => {
    if (isShowingPattern) return;

    const newUserPattern = [...userPattern, shape];
    setUserPattern(newUserPattern);

    // Check if the shape matches the pattern at the current index
    const currentIndex = userPattern.length;
    if (
      shape.type !== pattern[currentIndex].type ||
      shape.color !== pattern[currentIndex].color ||
      shape.position !== pattern[currentIndex].position
    ) {
      endGame();
    } else if (newUserPattern.length === pattern.length) {
      setScore(prev => prev + 1);
      setTimeout(() => generatePattern(), 500);
    }
  };

  const endGame = async () => {
    setIsActive(false);
    setIsSubmitting(true);
    
    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "pattern_recognition",
          activity_name: "Pattern Recognition",
          duration_minutes: Math.ceil(score / 2),
          focus_rating: Math.round((score / 10) * 10),
          energy_rating: null,
          notes: `Completed pattern recognition with score: ${score}`
        });

        if (error) throw error;

        toast({
          title: "Game Complete!",
          description: `Final score: ${score}. Well done!`,
        });
      } catch (error) {
        console.error("Error logging pattern recognition:", error);
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

  const renderShape = (shape: Shape) => {
    const baseClasses = "w-full h-full transition-all duration-300";
    
    switch (shape.type) {
      case 'circle':
        return <div className={`${baseClasses} rounded-full`} style={{ backgroundColor: shape.color }} />;
      case 'square':
        return <div className={`${baseClasses}`} style={{ backgroundColor: shape.color }} />;
      case 'triangle':
        return (
          <div
            className={`${baseClasses}`}
            style={{
              backgroundColor: 'transparent',
              borderLeft: '30px solid transparent',
              borderRight: '30px solid transparent',
              borderBottom: `60px solid ${shape.color}`,
            }}
          />
        );
      case 'diamond':
        return (
          <div
            className={`${baseClasses} rotate-45`}
            style={{ backgroundColor: shape.color }}
          />
        );
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Shapes className="h-5 w-5 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold">Pattern Recognition</h2>
        </div>
        <div className="text-lg font-semibold">
          Score: <span className="text-primary">{score}</span>
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
        <div className="grid grid-cols-3 gap-4">
          {Array(9).fill(null).map((_, index) => {
            const patternShape = isShowingPattern
              ? pattern.find(s => s.position === index)
              : undefined;
            
            return (
              <Button
                key={index}
                onClick={() => {
                  if (!isShowingPattern && !isSubmitting) {
                    const shape = {
                      type: SHAPES[index % SHAPES.length],
                      color: COLORS[Math.floor(index / 3)],
                      position: index
                    };
                    handleShapeClick(shape);
                  }
                }}
                variant="outline"
                className="h-20 p-2 flex items-center justify-center"
                disabled={isShowingPattern || isSubmitting}
              >
                {patternShape && renderShape(patternShape)}
              </Button>
            );
          })}
        </div>
      )}

      <div className="mt-6">
        <div className="text-sm text-muted-foreground">
          Remember the sequence of shapes, colors, and positions. Recreate the pattern by clicking the cells in the correct order.
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Brain className="h-4 w-4" />
          <span>Improves: Visual Memory, Pattern Recognition, Spatial Awareness</span>
        </div>
      </div>
    </Card>
  );
};