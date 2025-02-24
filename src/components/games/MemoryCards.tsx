import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Shuffle } from "lucide-react";

const ICONS = ["🌟", "🎈", "🎨", "🎭", "🎪", "🎯", "🎲", "🎮"];
const PAIRS = [...ICONS, ...ICONS];

interface CardType {
  id: number;
  content: string;
  flipped: boolean;
  matched: boolean;
}

export const MemoryCards = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    shuffleCards();
  }, []);

  const shuffleCards = () => {
    const shuffled = PAIRS.sort(() => Math.random() - 0.5).map((content, index) => ({
      id: index,
      content,
      flipped: false,
      matched: false,
    }));
    setCards(shuffled);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);
    
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    setMoves(prev => prev + 1);

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      if (cards[first].content === cards[second].content) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setFlippedCards([]);
        setMatches(prev => {
          const newMatches = prev + 1;
          if (newMatches === ICONS.length) {
            endGame(moves + 1);
          }
          return newMatches;
        });
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const endGame = async (finalMoves: number) => {
    setIsSubmitting(true);
    
    if (session?.user) {
      try {
        const { error } = await supabase.from("energy_focus_logs").insert({
          user_id: session.user.id,
          activity_type: "memory_game",
          activity_name: "Memory Cards",
          duration_minutes: Math.ceil(finalMoves / 4),
          focus_rating: Math.round((ICONS.length * 20) / finalMoves),
          energy_rating: null,
          notes: `Completed memory game in ${finalMoves} moves`
        });

        if (error) throw error;

        toast({
          title: "Game Complete!",
          description: `You won in ${finalMoves} moves! Great job!`,
        });
      } catch (error) {
        console.error("Error logging memory game:", error);
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
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Memory Cards</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg">Moves: {moves}</div>
          <div className="text-lg">Matches: {matches}/{ICONS.length}</div>
          <Button 
            onClick={shuffleCards}
            variant="outline"
            size="icon"
            disabled={isSubmitting}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <Button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            variant={card.flipped || card.matched ? "default" : "outline"}
            className={`h-20 text-2xl transition-all ${
              card.matched ? 'bg-green-500 hover:bg-green-600' : ''
            }`}
            disabled={isSubmitting}
          >
            {card.flipped || card.matched ? card.content : "?"}
          </Button>
        ))}
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        Match all pairs of cards in as few moves as possible. Click a card to reveal it, and try to find its matching pair.
      </div>
    </Card>
  );
};