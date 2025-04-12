
import { useState, useEffect, useRef } from 'react';
import { useToast } from './use-toast';
import { generateNatureSound, generateBinauralBeat, NatureSound } from '@/utils/audio';
import type { BinauralBeat, AudioGeneratorHook } from '@/types/audio';

export const useAudioGenerator = (): AudioGeneratorHook => {
  const [binauralAudio, setBinauralAudio] = useState<BinauralBeat | null>(null);
  const [natureAudio, setNatureAudio] = useState<ReturnType<typeof generateNatureSound> | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const { toast } = useToast();
  
  // Store audio settings for resume functionality
  const audioSettingsRef = useRef<{
    binaural?: { baseFreq: number; beatFreq: number; volume: number };
    nature?: { type: NatureSound | string; volume: number };
  }>({});
  
  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  // Adjust the volume for all active audio
  useEffect(() => {
    if (binauralAudio) {
      binauralAudio.setVolume(volume);
    }
    if (natureAudio) {
      natureAudio.setVolume(volume);
    }
  }, [volume, binauralAudio, natureAudio]);

  const startBinauralBeat = (baseFreq: number, beatFreq: number, volume = 0.5): BinauralBeat | null => {
    stopBinauralBeat();
    
    try {
      const audio = generateBinauralBeat(baseFreq, beatFreq, volume);
      audio.play()
        .then(() => {
          setIsPlaying(true);
          // Store settings for resume
          audioSettingsRef.current.binaural = { baseFreq, beatFreq, volume };
        })
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
      setIsPlaying(false);
    }
  };

  const startNatureSound = (type: NatureSound | string, volume = 0.5) => {
    stopNatureSound();
    
    try {
      const audio = generateNatureSound(type, volume);
      audio.play()
        .then(() => {
          setIsPlaying(true);
          // Store settings for resume
          audioSettingsRef.current.nature = { type, volume };
        })
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
      setIsPlaying(false);
    }
  };

  const stopAllAudio = () => {
    stopBinauralBeat();
    stopNatureSound();
    setIsPlaying(false);
  };

  const pauseAllAudio = () => {
    if (binauralAudio) {
      binauralAudio.pause();
    }
    if (natureAudio) {
      natureAudio.pause();
    }
    setIsPlaying(false);
  };

  const resumeAllAudio = () => {
    if (binauralAudio) {
      binauralAudio.resume();
      setIsPlaying(true);
      return;
    }
    
    if (natureAudio) {
      natureAudio.resume();
      setIsPlaying(true);
      return;
    }
    
    // If no active audio but we have settings stored, restart audio
    const settings = audioSettingsRef.current;
    if (settings.binaural) {
      startBinauralBeat(
        settings.binaural.baseFreq, 
        settings.binaural.beatFreq, 
        settings.binaural.volume
      );
    } else if (settings.nature) {
      startNatureSound(
        settings.nature.type, 
        settings.nature.volume
      );
    }
  };

  const setGlobalVolume = (newVolume: number) => {
    const clampedVolume = Math.min(1, Math.max(0, newVolume));
    setVolume(clampedVolume);
  };

  return {
    startBinauralBeat,
    stopBinauralBeat,
    startNatureSound,
    stopNatureSound,
    stopAllAudio,
    pauseAllAudio,
    resumeAllAudio,
    setVolume: setGlobalVolume,
    isPlaying,
    volume,
    binauralAudio,
    natureAudio
  };
};
