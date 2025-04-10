
export interface GameHeaderProps {
  score: number;
  onReset: () => void;
}

export interface GameGridProps {
  grid: any[];
  onTileClick: (index: number) => void;
  selectedTiles: number[];
}

export interface GameFooterProps {
  score: number;
  isSubmitting: boolean;
  onSaveScore: () => void;
}

export type TileType = {
  value: number;
  matched: boolean;
};
