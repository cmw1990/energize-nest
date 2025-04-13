
import { useState, useEffect, useCallback } from "react";
import { generateBinauralBeat } from "@/utils/audio/binauralBeatGenerator";
import { createNoiseBuffer } from "@/utils/audio/createNoiseBuffer";
import { NatureSound, AudioSettings, AudioInstance, BinauralBeat } from "@/types/audio";

const initialSettings: AudioSettings = {
  volume: 0.5,
  noiseType: "white",
  natureSound: null,
  isMuted: false,
  binauralBeatFrequency: null,
  baseFrequency: 100,
};

export const useAudioGenerator = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [noiseBuffer, setNoiseBuffer] = useState<AudioBuffer | null>(null);
  const [noiseSource, setNoiseSource] = useState<AudioBufferSourceNode | null>(null);
  const [natureSource, setNatureSource] = useState<HTMLAudioElement | null>(null);
  const [binauralBeat, setBinauralBeat] = useState<BinauralBeat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [settings, setSettings] = useState<AudioSettings>(initialSettings);

  useEffect(() => {
    const initializeAudio = async () => {
      const ctx = new AudioContext();
      setAudioContext(ctx);

      const buffer = createNoiseBuffer(ctx);
      setNoiseBuffer(buffer);
    };

    initializeAudio();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  const stopAll = useCallback(() => {
    if (noiseSource) {
      noiseSource.stop();
      setNoiseSource(null);
    }
    if (natureSource) {
      natureSource.pause();
      natureSource.currentTime = 0;
      setNatureSource(null);
    }
    if (binauralBeat) {
      binauralBeat.stop();
      setBinauralBeat(null);
    }
    setIsPlaying(false);
  }, [noiseSource, natureSource, binauralBeat]);

  const setSettingsWrapper = (newSettings: Partial<AudioSettings>) => {
    setSettings((prevSettings) => {
      return {
        ...prevSettings,
        ...newSettings,
      };
    });
  };

  useEffect(() => {
    if (settings.volume !== undefined) {
      if (noiseSource) {
        noiseSource.gainNode.gain.value = settings.volume;
      }
      if (natureSource) {
        natureSource.volume = settings.volume;
      }
      if (binauralBeat) {
        binauralBeat.setVolume(settings.volume);
      }
    }
  }, [settings.volume, noiseSource, natureSource, binauralBeat]);

  useEffect(() => {
    if (settings.isMuted !== undefined) {
      if (noiseSource) {
        noiseSource.gainNode.gain.value = settings.isMuted ? 0 : settings.volume;
      }
      if (natureSource) {
        natureSource.muted = settings.isMuted;
      }
      if (binauralBeat) {
        binauralBeat.setVolume(settings.isMuted ? 0 : settings.volume);
      }
    }
  }, [settings.isMuted, noiseSource, natureSource, binauralBeat, settings.volume]);

  const toggleSound = () => {
    if (isPlaying) {
      stopAll();
    } else {
      if (settings.noiseType) {
        playNoise(settings.noiseType, settings.volume);
      }
    }
  };

  const updateNoiseType = (type: string) => {
    stopAll();
    setSettingsWrapper({ noiseType: type });
    playNoise(type, settings.volume);
  };

  const updateNatureSound = (sound: string | null) => {
    stopAll();
    setSettingsWrapper({ natureSound: sound });
    if (sound) {
      playNatureSound(sound, settings.volume);
    }
  };

  const updateVolume = (volume: number) => {
    setSettingsWrapper({ volume: volume });
  };

  const createBinauralBeat = (baseFrequency: number, beatFrequency: number, volume = 0.5): BinauralBeat => {
    stopAll();
    if (!audioContext) {
      throw new Error("Audio context not initialized.");
    }

    const binauralBeatInstance = generateBinauralBeat(baseFrequency, beatFrequency, volume);

    const instance = {
      play: async () => {
        // No need to actually "play" anything, the oscillators are already running
        setIsPlaying(true);
      },
      stop: () => {
        binauralBeatInstance.stop();
        setIsPlaying(false);
      },
      pause: () => {
        binauralBeatInstance.setVolume(0);
        setIsPlaying(false);
      },
      setVolume: (newVolume: number) => {
        binauralBeatInstance.setVolume(newVolume);
        setSettingsWrapper({ volume: newVolume });
      },
      isPlaying: false,
      resume: () => {
        binauralBeatInstance.setVolume(settings.volume);
        setIsPlaying(true);
      },
      setFrequency: (newFreq: number) => {
        // This is a placeholder, actual frequency setting might require re-initialization
      }
    } as BinauralBeat;

    return instance;
  };

  const createNoiseGenerator = (type: string, volume = 0.5): AudioInstance => {
    if (!audioContext || !noiseBuffer) {
      throw new Error("Audio context or noise buffer not initialized.");
    }

    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);

    const source = audioContext.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    source.connect(gainNode);
    source.gainNode = gainNode;

    return {
      play: async () => {
        source.start(0);
        setIsPlaying(true);
        setNoiseSource(source);
      },
      stop: () => {
        source.stop(0);
        setIsPlaying(false);
        setNoiseSource(null);
      },
      pause: () => {
        if (source.gainNode) {
          source.gainNode.gain.value = 0;
        }
        setIsPlaying(false);
      },
      setVolume: (newVolume: number) => {
        if (source.gainNode) {
          source.gainNode.gain.value = newVolume;
        }
        setSettingsWrapper({ volume: newVolume });
      },
      isPlaying: false,
      resume: () => {
        if (source.gainNode) {
          source.gainNode.gain.value = settings.volume;
        }
        setIsPlaying(true);
      }
    };
  };

  const playNoise = useCallback(
    (type: string, volume = 0.5): AudioInstance => {
      stopAll();
      if (!audioContext || !noiseBuffer) {
        throw new Error("Audio context or noise buffer not initialized.");
      }

      const noise = createNoiseGenerator(type, volume);
      noise.play();
      setIsPlaying(true);
      return noise;
    },
    [audioContext, noiseBuffer, stopAll]
  );

  const playNatureSound = useCallback(
    (type: string, volume = 0.5): AudioInstance => {
      stopAll();
      const audio = new Audio(`/sounds/nature/${type}.mp3`);
      audio.volume = volume;
      audio.loop = true;
      audio.play();
      setIsPlaying(true);
      setNatureSource(audio);
      
      return {
        play: async () => {
          audio.play();
          setIsPlaying(true);
        },
        stop: () => {
          audio.pause();
          audio.currentTime = 0;
          setIsPlaying(false);
        },
        pause: () => {
          audio.pause();
          setIsPlaying(false);
        },
        setVolume: (newVolume: number) => {
          audio.volume = newVolume;
          setSettingsWrapper({ volume: newVolume });
        },
        isPlaying: !audio.paused,
        type
      };
    },
    [stopAll]
  );

  // Add these methods to fix Sleep.tsx errors
  const startBinauralBeat = (baseFreq: number, beatFreq: number, volume = 0.5) => {
    const beat = createBinauralBeat(baseFreq, beatFreq, volume);
    beat.play();
    setBinauralBeat(beat);
  };

  const stopBinauralBeat = () => {
    if (binauralBeat) {
      binauralBeat.stop();
      setBinauralBeat(null);
    }
  };

  const startNatureSound = (type: string, volume = 0.5) => {
    const sound = playNatureSound(type, volume);
    setNatureSource(sound as unknown as HTMLAudioElement);
  };

  const stopNatureSound = () => {
    if (natureSource) {
      natureSource.pause();
      natureSource.currentTime = 0;
      setNatureSource(null);
    }
  };

  const stopAllAudio = () => {
    stopAll();
  };

  return {
    playNoise,
    playNatureSound,
    createBinauralBeat,
    stopAll,
    isPlaying,
    settings,
    setSettings: setSettingsWrapper,
    toggleSound,
    updateNoiseType,
    updateNatureSound,
    updateVolume,
    // Add these properties to fix Sleep.tsx errors
    startBinauralBeat,
    stopBinauralBeat,
    startNatureSound,
    stopNatureSound,
    stopAllAudio,
    binauralAudio: binauralBeat,
    natureAudio: natureSource as unknown as AudioInstance
  };
};
