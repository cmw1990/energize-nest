
// Audio generator utilities for binaural beats and nature sounds

export interface AudioPlayer {
  play: () => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
}

/**
 * Creates a binaural beat generator with the specified base and beat frequencies
 */
export function generateBinauralBeat(baseFreq: number, beatFreq: number, volume = 0.5) {
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
    
    resume() {
      if (isPlaying) return;
      
      if (audioContext) {
        audioContext.resume();
      }
      
      isPlaying = true;
      console.log('Binaural beat resumed');
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
    }
  };
}

/**
 * Creates a nature sound player with the specified sound type and volume
 */
export async function createNatureSoundPlayer(soundUrl: string, volume = 0.5) {
  const audio = new Audio(soundUrl);
  audio.loop = true;
  audio.volume = volume;
  let isPlaying = false;
  
  // Preload the audio
  await new Promise((resolve, reject) => {
    audio.addEventListener('canplaythrough', resolve, { once: true });
    audio.addEventListener('error', reject, { once: true });
    audio.load();
  });
  
  return {
    isPlaying,
    volume,
    
    async play() {
      try {
        await audio.play();
        isPlaying = true;
        console.log(`Playing nature sound: ${soundUrl}`);
        return Promise.resolve();
      } catch (error) {
        console.error(`Error playing nature sound: ${error}`);
        throw error;
      }
    },
    
    pause() {
      audio.pause();
      isPlaying = false;
      console.log(`Paused nature sound: ${soundUrl}`);
    },
    
    resume() {
      audio.play().catch(err => console.error('Error resuming audio:', err));
      isPlaying = true;
      console.log(`Resumed nature sound: ${soundUrl}`);
    },
    
    stop() {
      audio.pause();
      audio.currentTime = 0;
      isPlaying = false;
      console.log(`Stopped nature sound: ${soundUrl}`);
    },
    
    setVolume(newVolume: number) {
      volume = newVolume;
      audio.volume = newVolume;
      console.log(`Nature sound volume set to ${newVolume}`);
    }
  };
}
