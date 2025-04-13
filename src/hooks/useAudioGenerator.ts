
import { useState, useEffect, useRef } from 'react';

type NoiseType = 'white' | 'pink' | 'brown' | 'none';
type NatureSound = 'rain' | 'ocean' | 'forest' | 'thunder' | 'river' | 'fire' | 'none';

interface AudioSettings {
  noiseType: NoiseType;
  natureSound: NatureSound;
  binaural: {
    enabled: boolean;
    baseFrequency: number;
    beatFrequency: number;
  };
  volume: number;
  isMuted: boolean;
}

export const useAudioGenerator = () => {
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
    isMuted: false
  });

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
      // @ts-ignore - Some browsers might use webkitAudioContext
      const AudioContext = window.AudioContext || window.webkitAudioContext;
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

    // Generate noise based on type
    switch(type) {
      case 'white':
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        break;
      case 'pink':
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11;
        }
        break;
      case 'brown':
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

  // Function to simulate nature sounds (in a real app, these would be audio files)
  const playNatureSound = (sound: NatureSound) => {
    // In a real implementation, you would load audio files and play them
    // This is a simplified simulation just for the UI demo
    setSettings(prev => ({ ...prev, natureSound: sound }));
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

    const audioContext = initAudioContext();
    
    // Create oscillators
    oscillatorLeftRef.current = audioContext.createOscillator();
    oscillatorRightRef.current = audioContext.createOscillator();
    
    // Set frequencies
    oscillatorLeftRef.current.frequency.value = baseFreq;
    oscillatorRightRef.current.frequency.value = baseFreq + beatFreq;
    
    // Create stereo panner for oscillators
    const pannerLeft = audioContext.createStereoPanner();
    const pannerRight = audioContext.createStereoPanner();
    
    pannerLeft.pan.value = -1; // Left channel only
    pannerRight.pan.value = 1; // Right channel only
    
    // Connect oscillators to panners
    oscillatorLeftRef.current.connect(pannerLeft);
    oscillatorRightRef.current.connect(pannerRight);
    
    // Connect panners to gain node
    pannerLeft.connect(gainNodeRef.current!);
    pannerRight.connect(gainNodeRef.current!);
    
    // Start oscillators
    oscillatorLeftRef.current.start();
    oscillatorRightRef.current.start();
    
    setIsPlaying(true);
    setSettings(prev => ({ 
      ...prev, 
      binaural: { 
        enabled: true, 
        baseFrequency: baseFreq, 
        beatFrequency: beatFreq 
      } 
    }));
  };

  const stopNoise = () => {
    if (noiseNodeRef.current) {
      noiseNodeRef.current.stop();
      noiseNodeRef.current.disconnect();
      noiseNodeRef.current = null;
    }
  };

  const stopNatureSound = () => {
    if (natureSoundNodeRef.current) {
      natureSoundNodeRef.current.stop();
      natureSoundNodeRef.current.disconnect();
      natureSoundNodeRef.current = null;
    }
  };

  const stopBinauralBeat = () => {
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
  };

  const stopAll = () => {
    stopNoise();
    stopNatureSound();
    stopBinauralBeat();
    setIsPlaying(false);
    setSettings(prev => ({
      ...prev,
      noiseType: 'none',
      natureSound: 'none',
      binaural: { ...prev.binaural, enabled: false }
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

  const updateNatureSound = (sound: NatureSound) => {
    if (sound === settings.natureSound) {
      stopNatureSound();
      setSettings(prev => ({ ...prev, natureSound: 'none' }));
    } else {
      playNatureSound(sound);
    }
  };

  const updateVolume = (value: number) => {
    if (gainNodeRef.current && !settings.isMuted) {
      gainNodeRef.current.gain.value = value;
    }
    setSettings(prev => ({ ...prev, volume: value }));
  };

  return {
    isPlaying,
    settings,
    setSettings,
    playNoise,
    playNatureSound,
    createBinauralBeat,
    stopAll,
    toggleSound,
    updateNoiseType,
    updateNatureSound,
    updateVolume
  };
};

// Helper function for brown noise (needed for the code to compile)
const b6 = 0;

