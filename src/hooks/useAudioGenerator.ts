
import { useState, useEffect, useRef } from 'react';
import { useToast } from './use-toast';
import { generateNatureSound, generateBinauralBeat, NatureSound } from '@/utils/audio';
import type { BinauralBeat, AudioGeneratorHook } from '@/types/audio';

export const useAudioGenerator = (): AudioGeneratorHook => {
  const [binauralAudio, setBinauralAudio] = useState<BinauralBeat | null>(null);
  const [natureAudio, setNatureAudio] = useState<ReturnType<typeof generateNatureSound> | null>(null);
  const { toast } = useToast();
  
  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const startBinauralBeat = (baseFreq: number, beatFreq: number, volume = 0.5): BinauralBeat | null => {
    stopBinauralBeat();
    
    try {
      const audio = generateBinauralBeat(baseFreq, beatFreq, volume);
      audio.play()
        .catch(error => {
          console.error('Failed to start binaural beat:', error);
          toast({
            title: 'Audio Error',
            description: 'Failed to start binaural beat. Please try again.',
            variant: 'destructive'
          });
        });
      
      setBinauralAudio(audio as BinauralBeat);
      return audio as BinauralBeat;
    } catch (error) {
      console.error('Failed to create binaural beat:', error);
      toast({
        title: 'Audio Error',
        description: 'Failed to create binaural beat audio.',
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
      audio.play()
        .catch(error => {
          console.error('Failed to play nature sound:', error);
          toast({
            title: 'Audio Error',
            description: 'Failed to play nature sound. Please try again.',
            variant: 'destructive'
          });
        });
      
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
