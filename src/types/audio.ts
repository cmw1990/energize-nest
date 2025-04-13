export interface AudioSettings {
  volume: number;
  noiseType: string;
  natureSound: string | null;
  isMuted: boolean;
  binauralBeatFrequency: number | null;
  baseFrequency: number;
}

export interface AudioInstance {
  play: () => Promise<void>;
  stop: () => void;
  pause: () => void;
  setVolume: (newVolume: number) => void;
  isPlaying: boolean;
  resume?: () => void;
  gainNode?: GainNode;
}

export interface BinauralBeat extends AudioInstance {
  resume: () => void;
  setFrequency: (newFreq: number) => void;
  setFrequencies?: (baseFreq: number, beatFreq: number) => void;
}

export type NatureSound = {
  name: string;
  type: string;
  description: string;
  category: string;
};

declare global {
  interface AudioBufferSourceNode {
    gainNode?: GainNode;
  }
}

export interface AudioGeneratorHook {
  playNoise: (type: string, volume?: number) => AudioInstance;
  playNatureSound: (type: string, volume?: number) => AudioInstance;
  createBinauralBeat: (baseFrequency: number, beatFrequency: number, volume?: number) => BinauralBeat;
  stopAll: () => void;
  isPlaying: boolean;
  settings: AudioSettings;
  setSettings: (newSettings: Partial<AudioSettings>) => void;
  toggleSound: () => void;
  updateNoiseType: (type: string) => void;
  updateNatureSound: (sound: string | null) => void;
  updateVolume: (volume: number) => void;
  
  startBinauralBeat?: (baseFreq: number, beatFreq: number, volume?: number) => void;
  stopBinauralBeat?: () => void;
  startNatureSound?: (type: string, volume?: number) => void;
  stopNatureSound?: () => void;
  stopAllAudio?: () => void;
  binauralAudio?: BinauralBeat | null;
  natureAudio?: AudioInstance | null;
}
