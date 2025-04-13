
import { useState, useEffect, useRef } from 'react';
import { useToast } from './use-toast';

type SoundType = 'nature' | 'binaural' | 'meditation';

interface SoundPlayerOptions {
  autoPlay?: boolean;
  loop?: boolean;
  volume?: number;
}

const defaultOptions: SoundPlayerOptions = {
  autoPlay: false,
  loop: true,
  volume: 0.7
};

export const useSoundPlayer = (soundUrl?: string, options: SoundPlayerOptions = {}) => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [volume, setVolume] = useState(options.volume || defaultOptions.volume);
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Initialize audio element
  useEffect(() => {
    if (!soundUrl) return;
    
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(soundUrl);
      } else {
        audioRef.current.src = soundUrl;
      }
      
      audioRef.current.loop = mergedOptions.loop;
      audioRef.current.volume = volume;
      
      if (mergedOptions.autoPlay) {
        play();
      }
      
      const handleEnded = () => {
        if (!mergedOptions.loop) {
          setIsPlaying(false);
        }
      };
      
      audioRef.current.addEventListener('ended', handleEnded);
      
      return () => {
        audioRef.current?.removeEventListener('ended', handleEnded);
        audioRef.current?.pause();
      };
    } catch (err) {
      console.error('Error initializing audio:', err);
      setError(err as Error);
    }
  }, [soundUrl]);
  
  // Play sound
  const play = async () => {
    if (!audioRef.current || !soundUrl) return;
    
    setIsLoading(true);
    
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Error playing audio:', err);
      setError(err as Error);
      toast({
        title: 'Playback Error',
        description: 'Could not play the sound. Try clicking on the page first.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Pause sound
  const pause = () => {
    if (!audioRef.current || !isPlaying) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
  };
  
  // Stop and reset sound
  const stop = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };
  
  // Toggle play/pause
  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };
  
  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Change volume
  const changeVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  };
  
  return {
    isPlaying,
    isLoading,
    error,
    volume,
    play,
    pause,
    stop,
    toggle,
    changeVolume
  };
};
