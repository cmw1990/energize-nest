
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { shuffle } from "@/utils/arrayUtils";

export interface BrainMatchGameProps {
  onGameComplete: (finalScore: number, time: number) => void;
}

const BrainMatchGame: React.FC<BrainMatchGameProps> = ({ onGameComplete }) => {
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  // Array of possible cards (using emojis for simplicity)
  const symbols = ['🧠', '⚡', '🔬', '🧩', '🧪', '📊', '💡', '🔭', '📱', '🎮', '🤖', '👾'];
  
  useEffect(() => {
    // Initialize game
    startGame();
  }, []);

  useEffect(() => {
    // Check for game completion
    if (matched.length > 0 && matched.length === cards.length) {
      endGame();
    }
  }, [matched, cards.length]);

  useEffect(() => {
    // Timer
    let timer: NodeJS.Timeout;
    if (startTime && !gameComplete) {
      timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [startTime, gameComplete]);

  // Start a new game
  const startGame = () => {
    // Create pairs of symbols (8 pairs = 16 cards)
    const selectedSymbols = symbols.slice(0, 8);
    const pairs = [...selectedSymbols, ...selectedSymbols];
    setCards(shuffle(pairs.map((symbol, index) => ({ id: index, symbol }))));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setStartTime(Date.now());
    setTimeElapsed(0);
    setGameComplete(false);
  };

  // End the game
  const endGame = () => {
    setGameComplete(true);
    const finalTime = Math.floor((Date.now() - (startTime || 0)) / 1000);
    // Calculate score based on time and moves
    const baseScore = 1000;
    const timeScore = Math.max(0, 120 - finalTime) * 5;
    const moveScore = Math.max(0, 500 - (moves * 10));
    const finalScore = baseScore + timeScore + moveScore;
    
    // Notify parent component
    onGameComplete(finalScore, finalTime);
  };

  // Handle card flip
  const handleCardClick = (id: number) => {
    // Don't allow flipping if:
    // 1. Card is already matched
    // 2. Card is already flipped
    // 3. Two cards are already flipped
    if (matched.includes(id) || flipped.includes(id) || flipped.length === 2) {
      return;
    }

    // Flip the card
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    
    // If this is the second card flipped
    if (newFlipped.length === 2) {
      // Increase move counter
      setMoves(moves + 1);
      
      // Check if cards match
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        // If match, add to matched array
        setMatched([...matched, first, second]);
        // Reset flipped array
        setFlipped([]);
      } else {
        // If no match, flip cards back after a delay
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="bg-primary/10 p-2 rounded">
          <p className="text-sm text-muted-foreground">Moves</p>
          <p className="font-bold">{moves}</p>
        </div>
        <div className="bg-primary/10 p-2 rounded">
          <p className="text-sm text-muted-foreground">Time</p>
          <p className="font-bold">{timeElapsed}s</p>
        </div>
        <div className="bg-primary/10 p-2 rounded">
          <p className="text-sm text-muted-foreground">Matched</p>
          <p className="font-bold">{matched.length / 2} / {cards.length / 2}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => (
          <Card 
            key={card.id}
            className={`
              flex items-center justify-center h-20 cursor-pointer transition-all transform
              ${flipped.includes(card.id) || matched.includes(card.id) ? 'bg-primary/10' : 'bg-muted'}
              ${matched.includes(card.id) ? 'opacity-70' : 'opacity-100'}
              hover:shadow-md
            `}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="text-3xl">
              {(flipped.includes(card.id) || matched.includes(card.id)) ? card.symbol : '?'}
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button onClick={startGame} variant="outline">
          Restart Game
        </Button>
      </div>
    </div>
  );
};

export default BrainMatchGame;
