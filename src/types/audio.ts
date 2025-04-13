
export type NatureSound = 
  | 'rain' 
  | 'ocean' 
  | 'forest' 
  | 'river' 
  | 'fire' 
  | 'thunder' 
  | 'wind' 
  | 'cafe' 
  | 'birds' 
  | 'night' 
  | 'lullaby' 
  | 'sunny' 
  | 'tropical' 
  | 'storm' 
  | 'home' 
  | 'snow'
  | 'stream'
  | 'crickets'
  | 'shower-relax'
  | 'shower-calm'
  | 'shower-creative'
  | 'shower-energy';

export type AudioPlayerType = 'binaural' | 'nature' | 'binaural-sequence';

export interface AudioPlayer {
  play: () => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
  type: AudioPlayerType;
  gainNode?: GainNode;
}

export interface BinauralBeatOptions {
  baseFrequency: number;
  beatFrequency: number;
  volume?: number;
}

export interface NatureSoundOptions {
  type: NatureSound;
  volume?: number;
}

export interface BinauralSequenceOptions {
  patterns: Array<{
    baseFreq: number;
    beatFreq: number;
    duration: number;
  }>;
  volume?: number;
}

export interface AudioContextState {
  context: AudioContext | null;
  initialize: () => void;
  getContext: () => AudioContext;
  isInitialized: boolean;
}
