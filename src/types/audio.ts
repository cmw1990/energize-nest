
export type NatureSound = 'rain' | 'forest' | 'ocean' | 'stream' | 'whitenoise' | 'pinknoise' | 'brownnoise';

export interface BinauralBeat {
  play: () => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  setVolume: (volume: number) => void;
  setFrequency: (baseFreq: number, beatFreq: number) => void;
  isPlaying: boolean;
}

export interface AudioGeneratorHook {
  startBinauralBeat: (baseFreq: number, beatFreq: number, volume?: number) => BinauralBeat | null;
  stopBinauralBeat: () => void;
  startNatureSound: (type: NatureSound | string, volume?: number) => ReturnType<typeof generateNatureSound> | null;
  stopNatureSound: () => void;
  stopAllAudio: () => void;
  pauseAllAudio: () => void;
  resumeAllAudio: () => void;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
  volume: number;
  binauralAudio: BinauralBeat | null;
  natureAudio: ReturnType<typeof generateNatureSound> | null;
}

// Add the missing functions from utils/audio.ts
export function generateBinauralBeat(baseFreq: number, beatFreq: number, volume = 0.5): BinauralBeat {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Create oscillators
  const leftOsc = audioContext.createOscillator();
  const rightOsc = audioContext.createOscillator();
  
  // Create gain nodes for volume control
  const leftGain = audioContext.createGain();
  const rightGain = audioContext.createGain();
  
  // Set initial volume
  leftGain.gain.value = volume;
  rightGain.gain.value = volume;
  
  // Connect oscillators to respective gain nodes
  leftOsc.connect(leftGain);
  rightOsc.connect(rightGain);
  
  // Create the merger to create stereo output
  const merger = audioContext.createChannelMerger(2);
  
  // Connect gain nodes to the merger
  leftGain.connect(merger, 0, 0);
  rightGain.connect(merger, 0, 1);
  
  // Connect merger to the destination (speakers/headphones)
  merger.connect(audioContext.destination);
  
  // Set frequencies - left will be baseFreq, right will be baseFreq + beatFreq
  leftOsc.frequency.value = baseFreq;
  rightOsc.frequency.value = baseFreq + beatFreq;
  
  let isPlaying = false;
  
  return {
    play: async () => {
      if (!isPlaying) {
        // Start the oscillators
        leftOsc.start();
        rightOsc.start();
        isPlaying = true;
      }
    },
    stop: () => {
      if (isPlaying) {
        // Stop the oscillators
        leftOsc.stop();
        rightOsc.stop();
        isPlaying = false;
      }
    },
    pause: () => {
      if (isPlaying) {
        // We can't actually pause an oscillator, so we'll disconnect it
        leftGain.disconnect();
        rightGain.disconnect();
        isPlaying = false;
      }
    },
    resume: () => {
      if (!isPlaying) {
        // Reconnect the gain nodes
        leftGain.connect(merger, 0, 0);
        rightGain.connect(merger, 0, 1);
        isPlaying = true;
      }
    },
    setVolume: (newVolume: number) => {
      // Set new volume level
      leftGain.gain.value = newVolume;
      rightGain.gain.value = newVolume;
    },
    setFrequency: (newBaseFreq: number, newBeatFreq: number) => {
      // Update frequencies
      leftOsc.frequency.value = newBaseFreq;
      rightOsc.frequency.value = newBaseFreq + newBeatFreq;
    },
    isPlaying
  };
}

export function generateNatureSound(type: NatureSound | string, volume = 0.5) {
  // In a real implementation, this would load audio files
  // For now, we'll create a simple approximation using noise
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Create a buffer for noise
  const bufferSize = 2 * audioContext.sampleRate;
  const noiseBuffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
  
  // Fill the buffer with noise based on the type
  for (let channel = 0; channel < noiseBuffer.numberOfChannels; channel++) {
    const data = noiseBuffer.getChannelData(channel);
    
    for (let i = 0; i < bufferSize; i++) {
      // Different noise patterns based on type
      switch (type) {
        case 'whitenoise':
          data[i] = Math.random() * 2 - 1;
          break;
        case 'pinknoise': {
          // Simple approximation of pink noise
          const whiteNoise = Math.random() * 2 - 1;
          data[i] = (data[i - 1] || 0) * 0.8 + whiteNoise * 0.2;
          break;
        }
        case 'brownnoise': {
          // Simple approximation of brown noise
          const whiteNoise = Math.random() * 2 - 1;
          data[i] = (data[i - 1] || 0) * 0.9 + whiteNoise * 0.1;
          break;
        }
        case 'rain':
        case 'stream': {
          // Higher frequency variations for rain/stream
          if (Math.random() > 0.95) {
            data[i] = Math.random() * 0.5;
          } else {
            data[i] = Math.random() * 0.15;
          }
          break;
        }
        case 'ocean': {
          // Slow rolling waves for ocean
          const period = Math.sin(i / 30000);
          data[i] = Math.random() * 0.15 * (1 + period);
          break;
        }
        case 'forest': {
          // Occasional sounds for forest
          if (Math.random() > 0.995) {
            data[i] = Math.random() * 0.5;
          } else {
            data[i] = Math.random() * 0.05;
          }
          break;
        }
        default:
          data[i] = Math.random() * 0.1; // Quiet white noise as fallback
      }
    }
  }
  
  // Create a buffer source
  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;
  
  // Create a gain node for volume control
  const gainNode = audioContext.createGain();
  gainNode.gain.value = volume;
  
  // Connect nodes
  noiseSource.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  let isPlaying = false;
  
  return {
    play: async () => {
      if (!isPlaying) {
        noiseSource.start();
        isPlaying = true;
      }
      return Promise.resolve();
    },
    stop: () => {
      if (isPlaying) {
        noiseSource.stop();
        isPlaying = false;
      }
    },
    pause: () => {
      if (isPlaying) {
        gainNode.disconnect();
        isPlaying = false;
      }
    },
    resume: () => {
      if (!isPlaying) {
        gainNode.connect(audioContext.destination);
        isPlaying = true;
      }
    },
    setVolume: (newVolume: number) => {
      gainNode.gain.value = newVolume;
    },
    isPlaying
  };
}
