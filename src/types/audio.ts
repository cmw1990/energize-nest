
import { NatureSound } from "@/utils/audio";

export interface BinauralBeat {
  baseFrequency: number;
  beatFrequency: number;
  volume: number;
  isPlaying: boolean;
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  setVolume: (newVolume: number) => void;
  setFrequencies: (newBaseFreq: number, newBeatFreq: number) => void;
}

export interface AudioGeneratorHook {
  startBinauralBeat: (baseFreq: number, beatFreq: number, volume?: number) => BinauralBeat | null;
  stopBinauralBeat: () => void;
  startNatureSound: (type: NatureSound | string, volume?: number) => any;
  stopNatureSound: () => void;
  stopAllAudio: () => void;
  binauralAudio: BinauralBeat | null;
  natureAudio: any;
}
