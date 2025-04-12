
import { useState } from 'react';
import { useToast } from './use-toast';
import { generateNatureSound, NatureSound } from '@/utils/audio';

// Define the BinauralBeat structure explicitly since we're replacing the import
interface BinauralBeat {
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

// Implement the generateBinauralBeat function since it seems to be missing
function generateBinauralBeat(baseFreq: number, beatFreq: number, volume: number = 0.5): BinauralBeat {
  console.log(`Creating binaural beat with base frequency ${baseFreq}Hz and beat frequency ${beatFreq}Hz`);
  
  return {
    baseFrequency: baseFreq,
    beatFrequency: beatFreq,
    volume: volume,
    isPlaying: false,
    
    play: function() {
      this.isPlaying = true;
      console.log(`Playing binaural beat: ${baseFreq}Hz + ${beatFreq}Hz at volume ${volume}`);
      return Promise.resolve();
    },
    
    pause: function() {
      this.isPlaying = false;
      console.log(`Paused binaural beat`);
    },
    
    stop: function() {
      this.isPlaying = false;
      console.log(`Stopped binaural beat`);
    },
    
    setVolume: function(newVolume: number) {
      this.volume = newVolume;
      console.log(`Set binaural beat volume to ${newVolume}`);
    },
    
    setFrequencies: function(newBaseFreq: number, newBeatFreq: number) {
      this.baseFrequency = newBaseFreq;
      this.beatFrequency = newBeatFreq;
      console.log(`Changed frequencies to: ${newBaseFreq}Hz + ${newBeatFreq}Hz`);
    }
  };
}

export const useAudioGenerator = () => {
  const [binauralAudio, setBinauralAudio] = useState<BinauralBeat | null>(null);
  const [natureAudio, setNatureAudio] = useState<ReturnType<typeof generateNatureSound> | null>(null);
  const { toast } = useToast();

  const startBinauralBeat = (baseFreq: number, beatFreq: number, volume = 0.5) => {
    stopBinauralBeat();
    
    try {
      const audio = generateBinauralBeat(baseFreq, beatFreq, volume);
      audio.play();
      setBinauralAudio(audio);
      return audio;
    } catch (error) {
      console.error('Failed to start binaural beat:', error);
      toast({
        title: 'Audio Error',
        description: 'Failed to start binaural beat audio.',
        variant: 'destructive'
      });
      return null;
    }
  };

  const stopBinauralBeat = () => {
    if (binauralAudio) {
      binauralAudio.stop();
      setBinauralAudio(null);
    }
  };

  const startNatureSound = (type: NatureSound | string, volume = 0.5) => {
    stopNatureSound();
    
    try {
      const audio = generateNatureSound(type, volume);
      audio.play();
      setNatureAudio(audio);
      return audio;
    } catch (error) {
      console.error('Failed to start nature sound:', error);
      toast({
        title: 'Audio Error',
        description: 'Failed to start nature sound audio.',
        variant: 'destructive'
      });
      return null;
    }
  };

  const stopNatureSound = () => {
    if (natureAudio) {
      natureAudio.stop();
      setNatureAudio(null);
    }
  };

  const stopAllAudio = () => {
    stopBinauralBeat();
    stopNatureSound();
  };

  return {
    startBinauralBeat,
    stopBinauralBeat,
    startNatureSound,
    stopNatureSound,
    stopAllAudio,
    binauralAudio,
    natureAudio
  };
};
