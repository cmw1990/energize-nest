
export interface GameHeaderProps {
  score: number;
  onReset?: () => void;
  onNewGame?: () => void;
  isSubmitting?: boolean;
}

export interface GameGridProps {
  grid: TileType[];
  onTileClick: (index: number) => void;
  selectedTiles?: number[];
  isSubmitting?: boolean;
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
