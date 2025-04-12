
export type NatureSound = 'rain' | 'ocean' | 'forest' | 'fire' | 'wind' | 'thunder' | 'stream' | 'whitenoise';

interface AudioInstance {
  isPlaying: boolean;
  volume: number;
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
}

// Improved binaural beat generator with actual audio functionality
export function generateBinauralBeat(baseFreq: number, beatFreq: number, volume = 0.5): AudioInstance & {
  baseFrequency: number;
  beatFrequency: number;
  setFrequencies: (newBaseFreq: number, newBeatFreq: number) => void;
} {
  let audioContext: AudioContext | null = null;
  let leftOscillator: OscillatorNode | null = null;
  let rightOscillator: OscillatorNode | null = null;
  let gainNode: GainNode | null = null;
  let pannerLeft: StereoPannerNode | null = null;
  let pannerRight: StereoPannerNode | null = null;
  let isPlaying = false;
  let baseFrequency = baseFreq;
  let beatFrequency = beatFreq;
  
  const setupAudio = () => {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create oscillators for each ear
      leftOscillator = audioContext.createOscillator();
      rightOscillator = audioContext.createOscillator();
      
      // Create gain node for volume control
      gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      
      // Create stereo panner nodes
      pannerLeft = audioContext.createStereoPanner();
      pannerRight = audioContext.createStereoPanner();
      
      // Set panning (left = -1, right = 1)
      pannerLeft.pan.value = -1;
      pannerRight.pan.value = 1;
      
      // Set frequencies
      leftOscillator.frequency.value = baseFrequency;
      rightOscillator.frequency.value = baseFrequency + beatFrequency;
      
      // Connect nodes
      leftOscillator.connect(pannerLeft);
      rightOscillator.connect(pannerRight);
      pannerLeft.connect(gainNode);
      pannerRight.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Start oscillators
      leftOscillator.start();
      rightOscillator.start();
      
      console.log(`Binaural beat created: Base ${baseFrequency}Hz, Beat ${beatFrequency}Hz`);
    } catch (error) {
      console.error('Error initializing audio:', error);
      throw new Error('Failed to initialize audio context');
    }
  };
  
  const cleanupAudio = () => {
    if (!audioContext) return;

    try {
      if (leftOscillator) {
        leftOscillator.stop();
        leftOscillator.disconnect();
      }
      
      if (rightOscillator) {
        rightOscillator.stop();
        rightOscillator.disconnect();
      }
      
      if (pannerLeft) pannerLeft.disconnect();
      if (pannerRight) pannerRight.disconnect();
      if (gainNode) gainNode.disconnect();
      
      audioContext.close();
      
      audioContext = null;
      leftOscillator = null;
      rightOscillator = null;
      gainNode = null;
      pannerLeft = null;
      pannerRight = null;
      
      console.log('Binaural beat audio cleaned up');
    } catch (error) {
      console.error('Error cleaning up audio:', error);
    }
  };
  
  return {
    baseFrequency,
    beatFrequency,
    volume,
    isPlaying,
    
    async play() {
      if (isPlaying) return;
      
      setupAudio();
      isPlaying = true;
      console.log(`Playing binaural beat: ${baseFrequency}Hz + ${beatFrequency}Hz`);
      return Promise.resolve();
    },
    
    pause() {
      if (!isPlaying) return;
      
      if (audioContext) {
        audioContext.suspend();
      }
      
      isPlaying = false;
      console.log('Binaural beat paused');
    },
    
    stop() {
      if (!isPlaying && !audioContext) return;
      
      cleanupAudio();
      isPlaying = false;
      console.log('Binaural beat stopped');
    },
    
    setVolume(newVolume: number) {
      volume = newVolume;
      
      if (gainNode) {
        gainNode.gain.value = newVolume;
      }
      
      console.log(`Binaural beat volume set to ${newVolume}`);
    },
    
    setFrequencies(newBaseFreq: number, newBeatFreq: number) {
      baseFrequency = newBaseFreq;
      beatFrequency = newBeatFreq;
      
      if (leftOscillator && rightOscillator) {
        leftOscillator.frequency.value = newBaseFreq;
        rightOscillator.frequency.value = newBaseFreq + newBeatFreq;
      }
      
      console.log(`Binaural beat frequencies updated: Base ${newBaseFreq}Hz, Beat ${newBeatFreq}Hz`);
    }
  };
}

// Enhanced nature sound generator with actual audio functionality
export function generateNatureSound(type: NatureSound | string, volume = 0.5): AudioInstance {
  const soundMap: Record<string, string> = {
    rain: '/sounds/rain.mp3',
    ocean: '/sounds/ocean.mp3',
    forest: '/sounds/forest.mp3',
    fire: '/sounds/fire.mp3',
    wind: '/sounds/wind.mp3',
    thunder: '/sounds/thunder.mp3',
    stream: '/sounds/stream.mp3',
    whitenoise: '/sounds/whitenoise.mp3'
  };
  
  const soundUrl = soundMap[type] || soundMap.rain;
  const audio = new Audio(soundUrl);
  audio.loop = true;
  audio.volume = volume;
  let isPlaying = false;
  
  return {
    isPlaying,
    volume,
    
    async play() {
      try {
        await audio.play();
        isPlaying = true;
        console.log(`Playing nature sound: ${type}`);
        return Promise.resolve();
      } catch (error) {
        console.error(`Error playing nature sound: ${error}`);
        throw error;
      }
    },
    
    pause() {
      audio.pause();
      isPlaying = false;
      console.log(`Paused nature sound: ${type}`);
    },
    
    stop() {
      audio.pause();
      audio.currentTime = 0;
      isPlaying = false;
      console.log(`Stopped nature sound: ${type}`);
    },
    
    setVolume(newVolume: number) {
      volume = newVolume;
      audio.volume = newVolume;
      console.log(`Nature sound volume set to ${newVolume}`);
    }
  };
}
