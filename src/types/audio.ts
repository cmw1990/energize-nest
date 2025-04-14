
export type NoiseType = 'none' | 'white' | 'pink' | 'brown';

export type NatureSound = 
  | 'none'
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
  pause?: () => void;
  resume?: () => void;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
  type?: AudioPlayerType;
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

export interface AudioSettings {
  noiseType: NoiseType;
  natureSound: NatureSound;
  binaural: {
    enabled: boolean;
    baseFrequency: number;
    beatFrequency: number;
  };
  volume: number;
  isMuted: boolean;
  binauralBeatFrequency: number | null;
  baseFrequency: number;
}

export interface AudioUtils {
  playSound: (type: string, vol: number) => void;
  stopSound: (type: string) => void;
  setFrequency?: (value: number) => void;
  isPlaying: boolean;
  type?: string;
}

export interface AudioGeneratorHook {
  isPlaying: boolean;
  settings: AudioSettings;
  setSettings: React.Dispatch<React.SetStateAction<AudioSettings>>;
  playNoise: (type: NoiseType) => void;
  playNature: (sound: NatureSound) => Promise<void>;
  stopNoise: () => void;
  stopNature: () => void;
  stopAll: () => void;
  toggleSound: () => void;
  updateNoiseType: (type: NoiseType) => void;
  updateNatureSound: (sound: NatureSound | null) => void;
  updateVolume: (value: number) => void;
  stopAllAudio: () => void;
  startBinauralBeat: (baseFreq: number, beatFreq: number, volume?: number) => void;
  stopBinauralBeat: () => void;
  startNatureSound: (type: string, volume?: number) => Promise<void>;
  stopNatureSound: () => void;
  binauralAudio: any;
  natureAudio: any;
  createBinauralBeat: (baseFreq: number, beatFreq: number) => void;
}
