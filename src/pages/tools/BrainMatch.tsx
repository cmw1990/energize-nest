
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/layout/TopNav";
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper";
import { Brain, Trophy, Timer, RotateCcw, BookOpen, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

const CARD_PAIRS = 8;

export default function BrainMatch() {
  const [cards, setCards] = useState<{ id: number; value: number; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  const initializeGame = () => {
    const values = Array.from({ length: CARD_PAIRS }, (_, i) => i + 1);
    const cardPairs = [...values, ...values];
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameCompleted(false);
    setTimer(0);
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };
  
  const startGame = () => {
    initializeGame();
    setGameStarted(true);
    
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };
  
  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched) {
      return;
    }
    
    // Flip the card
    const updatedCards = [...cards];
    updatedCards[id].flipped = true;
    setCards(updatedCards);
    
    // Add to flipped cards
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    // Check for matches when two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      
      if (cards[firstCardId].value === cards[secondCardId].value) {
        // Match found
        updatedCards[firstCardId].matched = true;
        updatedCards[secondCardId].matched = true;
        setCards(updatedCards);
        setMatchedPairs(prev => {
          const newMatchedPairs = prev + 1;
          
          // Check if game is completed
          if (newMatchedPairs === CARD_PAIRS) {
            setGameCompleted(true);
            if (timerInterval) {
              clearInterval(timerInterval);
              setTimerInterval(null);
            }
          }
          
          return newMatchedPairs;
        });
        setFlippedCards([]);
      } else {
        // No match, flip cards back after a delay
        setTimeout(() => {
          updatedCards[firstCardId].flipped = false;
          updatedCards[secondCardId].flipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);
  
  return (
    <ToolAnalyticsWrapper toolName="brain-match" toolType="cognitive" toolSettings={{}}>
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container mx-auto p-4">
          <header className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                Brain Match
              </h1>
              <p className="text-muted-foreground">
                Exercise your memory and cognitive skills
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
              {gameStarted ? (
                <>
                  <Card className="bg-muted">
                    <CardContent className="py-2 px-4 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span>Pairs: {matchedPairs}/{CARD_PAIRS}</span>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted">
                    <CardContent className="py-2 px-4 flex items-center gap-2">
                      <RotateCcw className="h-4 w-4 text-primary" />
                      <span>Moves: {moves}</span>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted">
                    <CardContent className="py-2 px-4 flex items-center gap-2">
                      <Timer className="h-4 w-4 text-primary" />
                      <span>Time: {formatTime(timer)}</span>
                    </CardContent>
                  </Card>
                  
                  <Button variant="outline" onClick={startGame}>
                    Restart
                  </Button>
                </>
              ) : (
                <Button onClick={startGame}>Start Game</Button>
              )}
            </div>
          </header>
          
          {gameStarted && (
            <div className="grid grid-cols-4 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {cards.map(card => (
                <motion.div
                  key={card.id}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: card.flipped ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    className={`cursor-pointer h-24 flex items-center justify-center ${
                      card.matched ? 'bg-primary/10 border-primary' : ''
                    }`}
                    onClick={() => handleCardClick(card.id)}
                  >
                    <CardContent className="flex items-center justify-center h-full">
                      {card.flipped ? (
                        <span className="text-2xl font-bold">{card.value}</span>
                      ) : (
                        <BrainCircuit className="h-8 w-8 text-muted-foreground" />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          
          {gameCompleted && (
            <Card className="mt-8 max-w-md mx-auto border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Game Completed!
                </CardTitle>
                <CardDescription>
                  Well done on completing the memory challenge!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Time:</strong> {formatTime(timer)}
                  </p>
                  <p>
                    <strong>Moves:</strong> {moves}
                  </p>
                  <p>
                    <strong>Score:</strong> {Math.round(1000 * (CARD_PAIRS / moves) * (CARD_PAIRS * 15 / timer))}
                  </p>
                  
                  <Button className="w-full mt-4" onClick={startGame}>
                    Play Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {!gameStarted && (
            <Card className="max-w-md mx-auto mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  How to Play
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Test your memory by finding all matching pairs of cards.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Click on any card to flip it over</li>
                  <li>Remember the number and find its match</li>
                  <li>Match all pairs to complete the game</li>
                  <li>Try to complete with fewer moves and less time</li>
                </ul>
                <Button className="w-full" onClick={startGame}>
                  Start Game
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ToolAnalyticsWrapper>
  );
}
