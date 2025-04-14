
// Binaural beat generator utilities

export interface AudioPlayer {
  play: () => Promise<void>;
  stop: () => void;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
}

/**
 * Generates a binaural beat - when two slightly different frequencies
 * are played in each ear, the brain perceives a beating tone
 */
export function generateBinauralBeat(
  baseFrequency: number, 
  beatFrequency: number, 
  volume = 0.5
): AudioPlayer & { setFrequency: (beatFreq: number) => void } {
  let audioContext: AudioContext | null = null;
  let oscillatorLeft: OscillatorNode | null = null;
  let oscillatorRight: OscillatorNode | null = null;
  let gainNode: GainNode | null = null;
  let isPlaying = false;
  
  const initialize = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioCtx();
      
      // Create the oscillator nodes for left and right ears
      oscillatorLeft = audioContext.createOscillator();
      oscillatorRight = audioContext.createOscillator();
      
      // Create stereo output
      const merger = audioContext.createChannelMerger(2);
      
      // Create gain node for volume control
      gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      
      // Set frequency values
      oscillatorLeft.frequency.value = baseFrequency;
      oscillatorRight.frequency.value = baseFrequency + beatFrequency;
      
      // Connect left oscillator to left channel
      oscillatorLeft.connect(merger, 0, 0);
      
      // Connect right oscillator to right channel
      oscillatorRight.connect(merger, 0, 1);
      
      // Connect merger to gain node and gain node to output
      merger.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      console.log(`Binaural beat created: Base ${baseFrequency}Hz, Beat ${beatFrequency}Hz`);
    } catch (error) {
      console.error("Error initializing audio context:", error);
      throw new Error("Could not initialize audio context");
    }
  };
  
  const cleanup = () => {
    if (oscillatorLeft) {
      oscillatorLeft.stop();
      oscillatorLeft.disconnect();
      oscillatorLeft = null;
    }
    
    if (oscillatorRight) {
      oscillatorRight.stop();
      oscillatorRight.disconnect();
      oscillatorRight = null;
    }
    
    if (gainNode) {
      gainNode.disconnect();
      gainNode = null;
    }
    
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    
    isPlaying = false;
  };
  
  return {
    async play() {
      if (isPlaying) return Promise.resolve();
      
      initialize();
      
      if (oscillatorLeft && oscillatorRight) {
        oscillatorLeft.start();
        oscillatorRight.start();
        isPlaying = true;
      }
      
      return Promise.resolve();
    },
    
    stop() {
      cleanup();
    },
    
    setVolume(newVolume: number) {
      if (gainNode) {
        gainNode.gain.value = newVolume;
      }
    },
    
    setFrequency(beatFreq: number) {
      if (oscillatorRight && baseFrequency) {
        oscillatorRight.frequency.value = baseFrequency + beatFreq;
      }
    },
    
    get isPlaying() {
      return isPlaying;
    }
  };
}

/**
 * Creates a player for nature sounds
 */
export async function createNatureSoundPlayer(
  soundUrl: string, 
  volume = 0.5
): Promise<AudioPlayer> {
  const audio = new Audio(soundUrl);
  audio.volume = volume;
  audio.loop = true;
  let isPlaying = false;
  
  // Preload the audio
  return new Promise((resolve) => {
    audio.addEventListener('canplaythrough', () => {
      resolve({
        async play() {
          try {
            await audio.play();
            isPlaying = true;
            return Promise.resolve();
          } catch (error) {
            console.error("Error playing audio:", error);
            return Promise.reject(error);
          }
        },
        
        stop() {
          audio.pause();
          audio.currentTime = 0;
          isPlaying = false;
        },
        
        setVolume(newVolume: number) {
          audio.volume = newVolume;
        },
        
        get isPlaying() {
          return isPlaying;
        }
      });
    }, { once: true });
    
    audio.load();
  });
}
