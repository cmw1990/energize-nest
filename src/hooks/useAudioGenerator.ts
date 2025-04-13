
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { NoiseType, NatureSound, AudioGeneratorHook, AudioSettings as AudioSettingsType } from '@/types/audio';
import { generateBinauralBeat, createNatureSoundPlayer } from '@/utils/audio/binauralBeatGenerator';

interface AudioSettings {
  noiseType: NoiseType;
  natureSound: NatureSound | null;
  binaural?: {
    enabled: boolean;
    baseFrequency: number;
    beatFrequency: number;
  };
  volume: number;
  isMuted: boolean;
  binauralBeatFrequency: number | null;
  baseFrequency: number;
}

const AudioGeneratorContext = createContext<AudioGeneratorHook | null>(null);

export const AudioGeneratorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioUtils = useAudioGeneratorInternal();
  return (
    <AudioGeneratorContext.Provider value={audioUtils}>
      {children}
    </AudioGeneratorContext.Provider>
  );
};

export const useAudioGenerator = (): AudioGeneratorHook => {
  const context = useContext(AudioGeneratorContext);
  if (!context) {
    throw new Error('useAudioGenerator must be used within an AudioGeneratorProvider');
  }
  return context;
};

const useAudioGeneratorInternal = (): AudioGeneratorHook => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [settings, setSettings] = useState<AudioSettings>({
    noiseType: 'none',
    natureSound: 'none',
    binaural: {
      enabled: false,
      baseFrequency: 200,
      beatFrequency: 10
    },
    volume: 0.5,
    isMuted: false,
    binauralBeatFrequency: null,
    baseFrequency: 200
  });

  const [activeBinauralBeat, setActiveBinauralBeat] = useState<ReturnType<typeof generateBinauralBeat> | null>(null);
  const [activeNatureSound, setActiveNatureSound] = useState<ReturnType<typeof createNatureSoundPlayer> | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const natureSoundNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const oscillatorLeftRef = useRef<OscillatorNode | null>(null);
  const oscillatorRightRef = useRef<OscillatorNode | null>(null);
  const mergerRef = useRef<ChannelMergerNode | null>(null);

  useEffect(() => {
    return () => {
      stopAll();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = settings.volume;
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
    return audioContextRef.current;
  };

  const playNoise = (type: NoiseType) => {
    stopNoise();
    
    if (type === 'none') {
      setSettings(prev => ({ ...prev, noiseType: 'none' }));
      return;
    }

    const audioContext = initAudioContext();
    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    switch(type) {
      case "white":
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        break;
      case "pink":
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          b6 = white * 0.115926;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6;
          output[i] *= 0.11;
        }
        break;
      case "brown":
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        }
        break;
    }

    noiseNodeRef.current = audioContext.createBufferSource();
    noiseNodeRef.current.buffer = noiseBuffer;
    noiseNodeRef.current.loop = true;
    noiseNodeRef.current.connect(gainNodeRef.current!);
    noiseNodeRef.current.start();
    setIsPlaying(true);
    setSettings(prev => ({ ...prev, noiseType: type }));
  };

  const playNature = async (sound: NatureSound) => {
    if (sound === 'none') {
      stopNature();
      return;
    }
    
    stopNature();
    
    try {
      const player = await createNatureSoundPlayer(`/sounds/${sound}.mp3`, settings.volume);
      setActiveNatureSound(player);
      await player.play();
      
      setSettings(prev => ({ ...prev, natureSound: sound }));
      setIsPlaying(true);
    } catch (error) {
      console.error("Failed to play nature sound:", error);
    }
  };

  const createBinauralBeat = (baseFreq: number, beatFreq: number) => {
    stopBinauralBeat();
    
    if (!baseFreq || !beatFreq) {
      setSettings(prev => ({ 
        ...prev, 
        binaural: { ...prev.binaural, enabled: false } 
      }));
      return;
    }

    try {
      const beat = generateBinauralBeat(baseFreq, beatFreq, settings.volume);
      setActiveBinauralBeat(beat);
      beat.play();
      
      setIsPlaying(true);
      setSettings(prev => ({ 
        ...prev, 
        binaural: { 
          enabled: true, 
          baseFrequency: baseFreq, 
          beatFrequency: beatFreq 
        },
        binauralBeatFrequency: beatFreq,
        baseFrequency: baseFreq
      }));
    } catch (error) {
      console.error("Failed to create binaural beat:", error);
    }
  };

  const stopNoise = () => {
    if (noiseNodeRef.current) {
      noiseNodeRef.current.stop();
      noiseNodeRef.current.disconnect();
      noiseNodeRef.current = null;
    }
    
    setSettings(prev => ({ ...prev, noiseType: 'none' }));
  };

  const stopNature = () => {
    if (activeNatureSound) {
      activeNatureSound.stop();
      setActiveNatureSound(null);
    }
    
    if (natureSoundNodeRef.current) {
      natureSoundNodeRef.current.stop();
      natureSoundNodeRef.current.disconnect();
      natureSoundNodeRef.current = null;
    }
    
    setSettings(prev => ({ ...prev, natureSound: 'none' }));
  };

  const stopBinauralBeat = () => {
    if (activeBinauralBeat) {
      activeBinauralBeat.stop();
      setActiveBinauralBeat(null);
    }
    
    if (oscillatorLeftRef.current) {
      oscillatorLeftRef.current.stop();
      oscillatorLeftRef.current.disconnect();
      oscillatorLeftRef.current = null;
    }
    
    if (oscillatorRightRef.current) {
      oscillatorRightRef.current.stop();
      oscillatorRightRef.current.disconnect();
      oscillatorRightRef.current = null;
    }
    
    setSettings(prev => ({
      ...prev,
      binaural: { ...prev.binaural, enabled: false },
      binauralBeatFrequency: null
    }));
  };

  const stopAll = () => {
    stopNoise();
    stopNature();
    stopBinauralBeat();
    setIsPlaying(false);
    setSettings(prev => ({
      ...prev,
      noiseType: 'none',
      natureSound: 'none',
      binaural: { ...prev.binaural, enabled: false },
      binauralBeatFrequency: null
    }));
  };

  const toggleSound = () => {
    if (gainNodeRef.current) {
      const newMuted = !settings.isMuted;
      gainNodeRef.current.gain.value = newMuted ? 0 : settings.volume;
      setSettings(prev => ({ ...prev, isMuted: newMuted }));
    }
  };

  const updateNoiseType = (type: NoiseType) => {
    if (type === settings.noiseType) {
      stopNoise();
      setSettings(prev => ({ ...prev, noiseType: 'none' }));
    } else {
      playNoise(type);
    }
  };

  const updateNatureSound = (sound: NatureSound | null) => {
    if (sound === settings.natureSound) {
      stopNature();
    } else if (sound) {
      playNature(sound);
    }
  };

  const updateVolume = (value: number) => {
    if (gainNodeRef.current && !settings.isMuted) {
      gainNodeRef.current.gain.value = value;
    }
    
    if (activeBinauralBeat) {
      activeBinauralBeat.setVolume(value);
    }
    
    if (activeNatureSound) {
      activeNatureSound.setVolume(value);
    }
    
    setSettings(prev => ({ ...prev, volume: value }));
  };

  const startBinauralBeat = (baseFreq: number, beatFreq: number, volume?: number) => {
    if (volume !== undefined) {
      updateVolume(volume);
    }
    createBinauralBeat(baseFreq, beatFreq);
  };

  const startNatureSound = async (type: string, volume?: number) => {
    if (volume !== undefined) {
      updateVolume(volume);
    }
    await playNature(type as NatureSound);
  };

  return {
    isPlaying,
    settings: settings as unknown as AudioSettingsType,
    setSettings: setSettings as unknown as React.Dispatch<React.SetStateAction<AudioSettingsType>>,
    playNoise,
    playNature,
    stopNoise,
    stopNature,
    stopAll,
    toggleSound,
    updateNoiseType,
    updateNatureSound,
    updateVolume,
    stopAllAudio: stopAll,
    startBinauralBeat,
    stopBinauralBeat,
    startNatureSound,
    stopNatureSound: stopNature,
    binauralAudio: activeBinauralBeat,
    natureAudio: activeNatureSound,
    createBinauralBeat
  };
};
