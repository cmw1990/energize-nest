import React, { useState, useEffect } from "react"; // Added React import
import { LandingHeader } from "@/components/layout/LandingHeader"; // Changed import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Added CardContent, CardHeader, CardTitle
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"; // Added import

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple'];
const COLOR_NAMES = ['Red', 'Blue', 'Green', 'Yellow', 'Purple'];

export default function StroopTest() {
  const [words, setWords] = useState<{ text: string; color: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const { toast } = useToast();
  const { session } = useAuth();

  const generateWords = () => {
    const newWords = [];
    for (let i = 0; i < 10; i++) {
      const textIndex = Math.floor(Math.random() * COLOR_NAMES.length);
      let colorIndex = Math.floor(Math.random() * COLORS.length);
      // Ensure text and color are different for the Stroop effect
      while (colorIndex === textIndex) {
        colorIndex = Math.floor(Math.random() * COLORS.length);
      }
      newWords.push({
        text: COLOR_NAMES[textIndex],
        color: COLORS[colorIndex],
      });
    }
    return newWords;
  };

  const startGame = () => {
    setWords(generateWords());
    setCurrentIndex(0);
    setScore(0); // Reset score at the start of a new game
    setIsPlaying(true);
    setStartTime(Date.now());
  };

  const handleAnswer = (colorName: string) => {
    if (!isPlaying) return; // Prevent answering when not playing

    if (colorName.toLowerCase() === words[currentIndex].color.toLowerCase()) {
      setScore(prev => prev + 1);
      // Optional: Remove correct toast for faster gameplay
      // toast({ title: "Correct!", variant: "default" });
    } else {
      // Optional: Add penalty or just show incorrect
       toast({ title: "Incorrect", description: `Color was ${words[currentIndex].color}`, variant: "destructive" });
    }

    if (currentIndex === words.length - 1) {
      // End of round
      setIsPlaying(false);
      saveScore(); // Save score after round ends
      setRound(prev => prev + 1); // Increment round for next game
       toast({
           title: "Round Complete!",
           description: `Score: ${score + (colorName.toLowerCase() === words[currentIndex].color.toLowerCase() ? 1 : 0)}/${words.length}. Click Start Game for Round ${round + 1}.`,
       });
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const saveScore = async () => {
    if (!session?.user?.id) return;

    const timeTaken = (Date.now() - startTime) / 1000;
    // Correctly calculate final score based on the last answer
    const lastAnswerCorrect = words.length > 0 && currentIndex === words.length - 1 && words[currentIndex].color.toLowerCase() === words[currentIndex].color.toLowerCase();
    const finalScore = score + (lastAnswerCorrect ? 1 : 0);


    try {
      const { error } = await supabase.from("brain_game_scores").insert({
        user_id: session.user.id,
        game_type: "stroop_test",
        score: finalScore, // Use final score
        difficulty: round, // Save the round number as difficulty
        duration_seconds: Math.round(timeTaken)
      });

      if (error) throw error;

      // Toast moved to handleAnswer for immediate feedback after round end
    } catch (error) {
      console.error("Error saving score:", error);
      toast({
        title: "Error Saving Score",
        description: "There was a problem saving your progress.",
        variant: "destructive",
      });
    }
  };

  return (
    <ToolAnalyticsWrapper toolName="stroop-test" toolType="brain-game">
        <div className="min-h-screen bg-background">
        <LandingHeader /> {/* Changed component */}
        <div className="container mx-auto p-4">
            <Card className="p-6">
            <CardHeader className="p-0 mb-6"> {/* Added CardHeader and adjusted padding */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Brain className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Stroop Test</CardTitle>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-lg">Score: {score}</div>
                        <div className="text-lg">Round: {round}</div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0"> {/* Adjusted padding */}
                <div className="flex flex-col items-center gap-6 min-h-[200px]"> {/* Added min-height */}
                    {!isPlaying && round === 1 && ( // Show instructions only before first round
                        <div className="space-y-4 text-center">
                            <p className="text-muted-foreground">
                            Click the button that matches the COLOR of the word, not what the word says.
                            </p>
                            <Button onClick={startGame} size="lg">
                            Start Game
                            </Button>
                        </div>
                    )}
                    {!isPlaying && round > 1 && ( // Show after round completion
                        <div className="space-y-4 text-center">
                            <p className="text-muted-foreground">
                                Round {round -1} complete! Ready for Round {round}?
                            </p>
                            <Button onClick={startGame} size="lg">
                                Start Round {round}
                            </Button>
                        </div>
                    )}

                    {isPlaying && words.length > 0 && currentIndex < words.length && (
                    <div className="space-y-8 text-center">
                        <div className="text-6xl font-bold" style={{ color: words[currentIndex].color }}>
                        {words[currentIndex].text}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {COLORS.map((color) => (
                            <Button
                            key={color}
                            onClick={() => handleAnswer(color)}
                            style={{ backgroundColor: color, color: 'white', textShadow: '1px 1px 2px black' }} // Ensure text visibility
                            className="h-12 hover:opacity-90"
                            >
                            {color.charAt(0).toUpperCase() + color.slice(1)} {/* Capitalize button text */}
                            </Button>
                        ))}
                        </div>
                    </div>
                    )}
                </div>
            </CardContent>
            </Card>
        </div>
        </div>
    </ToolAnalyticsWrapper>
  );
}
