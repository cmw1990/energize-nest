
export interface GameHeaderProps {
  score: number;
  onReset: () => void;
}

export interface GameGridProps {
  grid: TileType[];
  onTileClick: (index: number) => void;
  selectedTiles: number[];
}

export interface GameFooterProps {
  score: number;
  isSubmitting: boolean;
  onSaveScore: () => void;
}

export type TileType = {
  id?: string;
  value: number;
  matched: boolean;
  selected?: boolean;
};
