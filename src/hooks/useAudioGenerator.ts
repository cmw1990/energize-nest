
import { useState } from 'react';
import { useToast } from './use-toast';
import { generateBinauralBeat, generateNatureSound } from '@/utils/audio';

export const useAudioGenerator = () => {
  const [binauralAudio, setBinauralAudio] = useState<ReturnType<typeof generateBinauralBeat> | null>(null);
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

  const startNatureSound = (type: string, volume = 0.5) => {
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
