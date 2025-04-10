
import { useState, useEffect, useCallback } from "react";
import { TileType } from "./types";

export const useGameLogic = () => {
  const [grid, setGrid] = useState<TileType[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const generateGrid = useCallback((size: number = 16) => {
    // Create pairs of numbers
    let values = [];
    for (let i = 1; i <= size / 2; i++) {
      values.push(i, i);
    }
    
    // Shuffle the array
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    
    // Create grid with shuffled values
    return values.map((value) => ({
      value,
      matched: false,
      selected: false
    }));
  }, []);
  
  const initializeGrid = useCallback(() => {
    setGrid(generateGrid());
    setSelectedTiles([]);
    setScore(0);
    setGameOver(false);
  }, [generateGrid]);
  
  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);
  
  const isMatch = useCallback((selected: number[]) => {
    if (selected.length !== 2) return false;
    const [first, second] = selected;
    return grid[first].value === grid[second].value;
  }, [grid]);
  
  const handleTileClick = useCallback((index: number) => {
    // Ignore clicks on already matched or selected tiles
    if (grid[index].matched || selectedTiles.includes(index)) {
      return;
    }
    
    // Limit to selecting only two tiles at a time
    if (selectedTiles.length === 2) {
      return;
    }
    
    // Add tile to selected
    const newSelected = [...selectedTiles, index];
    
    // Update grid to show selected tile
    const updatedGrid = [...grid];
    updatedGrid[index] = {
      ...updatedGrid[index],
      selected: true
    };
    
    setGrid(updatedGrid);
    setSelectedTiles(newSelected);
    
    // Check for match if two tiles are selected
    if (newSelected.length === 2) {
      setTimeout(() => {
        const matched = isMatch(newSelected);
        
        // Update the grid based on match result
        const updatedGrid = grid.map((tile, idx) => {
          if (newSelected.includes(idx)) {
            return {
              ...tile,
              matched: matched,
              selected: false
            };
          }
          return tile;
        });
        
        // Update score if matched
        if (matched) {
          setScore(prevScore => prevScore + 10);
        } else {
          setScore(prevScore => Math.max(0, prevScore - 1)); // Penalty for wrong match
        }
        
        // Check if game is over
        const isGameOver = updatedGrid.every(tile => tile.matched);
        
        setGrid(updatedGrid);
        setSelectedTiles([]);
        
        if (isGameOver) {
          setGameOver(true);
        }
      }, 800); // Delay to show selection before resolving
    }
  }, [grid, selectedTiles, isMatch]);
  
  return {
    grid,
    score,
    selectedTiles,
    gameOver,
    initializeGrid,
    handleTileClick
  };
};
