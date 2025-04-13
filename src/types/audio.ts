export interface AudioSettings {
  volume: number;
  noiseType: string;
  natureSound: string | null;
  isMuted: boolean;
  binauralBeatFrequency: number | null;
  baseFrequency: number;
  binaural?: {
    enabled: boolean;
    baseFrequency: number;
    beatFrequency: number;
  };
}

export interface AudioInstance {
  play: () => Promise<void>;
  stop: () => void;
  pause: () => void;
  setVolume: (newVolume: number) => void;
  isPlaying: boolean;
  resume?: () => void;
  gainNode?: GainNode;
  type?: string;
}

export interface BinauralBeat extends AudioInstance {
  resume: () => void;
  setFrequency: (newFreq: number) => void;
  setFrequencies?: (baseFreq: number, beatFreq: number) => void;
}

export type NatureSound = 'none' | 'ocean' | 'forest' | 'river' | 'rain' | 'thunder' | 'fire' | 'cafe' | 'birds' | 'night' | 'lullaby' | 'sunny' | 'tropical' | 'storm' | 'home' | 'snow' | 'wind';
export type NoiseType = 'none' | 'brown' | 'pink' | 'white';

declare global {
  interface AudioBufferSourceNode {
    gainNode?: GainNode;
  }
}

export interface AudioUtils {
  playSound: (type: string, volume: number) => void;
  stopSound: (type: string) => void;
  setFrequency?: (value: number) => void;
  setFrequencies?: (baseFreq: number, beatFreq: number) => void;
  isPlaying?: boolean;
  type?: string;
}

export interface AudioGeneratorHook {
  isPlaying: boolean;
  settings: AudioSettings;
  setSettings: React.Dispatch<React.SetStateAction<AudioSettings>>;
  playNoise: (type: NoiseType) => void;
  playNature: (type: NatureSound) => void;
  stopNoise: () => void;
  stopNature: () => void;
  stopAll: () => void;
  toggleSound: () => void;
  updateNoiseType: (type: NoiseType) => void;
  updateNatureSound: (type: NatureSound | null) => void;
  updateVolume: (volume: number) => void;
  
  stopAllAudio: () => void;
  startBinauralBeat: (baseFreq: number, beatFreq: number, volume?: number) => void;
  stopBinauralBeat: () => void;
  startNatureSound: (type: string, volume?: number) => void;
  stopNatureSound: () => void;
  binauralAudio: BinauralBeat | null;
  natureAudio: AudioInstance | null;
  
  createBinauralBeat?: (baseFreq: number, beatFreq: number) => void;
}
