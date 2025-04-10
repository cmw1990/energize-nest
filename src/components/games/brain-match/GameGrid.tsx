
import { TileType } from "./types";
import { cn } from "@/lib/utils";

interface GameGridProps {
  grid: TileType[];
  onTileClick: (index: number) => void;
  selectedTiles?: number[];
  isSubmitting?: boolean;
}

export function GameGrid({ grid, onTileClick, selectedTiles = [], isSubmitting = false }: GameGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2 w-full h-full">
      {grid.map((tile, index) => (
        <button
          key={index}
          onClick={() => onTileClick(index)}
          disabled={tile.matched || isSubmitting}
          className={cn(
            "rounded-lg flex items-center justify-center text-xl font-bold transition-all duration-300",
            tile.matched ? "bg-primary/20 text-primary" : "bg-card hover:bg-primary/10",
            selectedTiles.includes(index) && !tile.matched ? "bg-primary/30 scale-95" : "",
            "border-2",
            tile.matched ? "border-primary/30" : "border-border",
            "shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          )}
        >
          {tile.matched || selectedTiles.includes(index) ? tile.value : "?"}
        </button>
      ))}
    </div>
  );
}
