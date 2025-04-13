
export type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export interface GameProps {
  breathPhase?: BreathPhase;
}

export interface NoiseSettings {
  type: 'none' | 'brown' | 'pink' | 'white';
  volume: number;
}

export interface NatureSettings {
  type: 'none' | 'ocean' | 'forest' | 'river' | 'rain' | 'thunder' | 'fire';
  volume: number;
}

export interface BinauralSettings {
  enabled: boolean;
  baseFrequency: number;
  targetFrequency: number;
  volume: number;
}

export interface AudioSettings {
  noise: NoiseSettings;
  nature: NatureSettings;
  binaural: BinauralSettings;
  masterVolume: number;
}

export type NoiseType = 'none' | 'brown' | 'pink' | 'white';
export type NatureSound = 'none' | 'ocean' | 'forest' | 'river' | 'rain' | 'thunder' | 'fire';
