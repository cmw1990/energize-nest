
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
}

export interface BinauralBeat extends AudioInstance {
  resume: () => void;
  setFrequency: (newFreq: number) => void;
}

export type NatureSound = {
  name: string;
  type: string;
  description: string;
  category: string;
};
