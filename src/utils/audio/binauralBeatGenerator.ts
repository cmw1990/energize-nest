
import { NatureSound } from '@/types/audio';

// Function to generate a binaural beat
export function generateBinauralBeat(baseFreq: number, beatFreq: number, volume = 0.5) {
  let audioContext: AudioContext | null = null;
  let leftOscillator: OscillatorNode | null = null;
  let rightOscillator: OscillatorNode | null = null;
  let gainNode: GainNode | null = null;
  let pannerLeft: StereoPannerNode | null = null;
  let pannerRight: StereoPannerNode | null = null;
  let isPlaying = false;
  
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
      leftOscillator.frequency.value = baseFreq;
      rightOscillator.frequency.value = baseFreq + beatFreq;
      
      // Connect nodes
      leftOscillator.connect(pannerLeft);
      rightOscillator.connect(pannerRight);
      pannerLeft.connect(gainNode);
      pannerRight.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Start oscillators
      leftOscillator.start();
      rightOscillator.start();
    } catch (error) {
      console.error('Error initializing audio:', error);
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
    } catch (error) {
      console.error('Error cleaning up audio:', error);
    }
  };
  
  return {
    baseFrequency: baseFreq,
    beatFrequency: beatFreq,
    volume,
    isPlaying,
    
    async play() {
      if (isPlaying) return;
      
      setupAudio();
      isPlaying = true;
      return Promise.resolve();
    },
    
    pause() {
      if (!isPlaying) return;
      
      if (audioContext) {
        audioContext.suspend();
      }
      
      isPlaying = false;
    },
    
    stop() {
      if (!isPlaying && !audioContext) return;
      
      cleanupAudio();
      isPlaying = false;
    },
    
    setVolume(newVolume: number) {
      volume = newVolume;
      
      if (gainNode) {
        gainNode.gain.value = newVolume;
      }
    },
    
    setFrequencies(newBaseFreq: number, newBeatFreq: number) {
      if (leftOscillator && rightOscillator) {
        leftOscillator.frequency.value = newBaseFreq;
        rightOscillator.frequency.value = newBaseFreq + newBeatFreq;
      }
    }
  };
}

// Function to create a nature sound player
export async function createNatureSoundPlayer(url: string, volume = 0.5) {
  const audio = new Audio(url);
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
        return Promise.resolve();
      } catch (error) {
        console.error(`Error playing nature sound: ${error}`);
        throw error;
      }
    },
    
    pause() {
      audio.pause();
      isPlaying = false;
    },
    
    stop() {
      audio.pause();
      audio.currentTime = 0;
      isPlaying = false;
    },
    
    setVolume(newVolume: number) {
      volume = newVolume;
      audio.volume = newVolume;
    }
  };
}
