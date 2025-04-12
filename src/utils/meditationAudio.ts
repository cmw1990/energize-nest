
import { NatureSound } from "@/types/audio";

interface AudioState {
  audioContext: AudioContext;
  gainNode: GainNode;
  source?: AudioBufferSourceNode | OscillatorNode;
  isPlaying: boolean;
}

export function createMeditationAudio(type: string, volume: number = 0.5): AudioState {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const gainNode = audioContext.createGain();
  gainNode.gain.value = volume;
  gainNode.connect(audioContext.destination);
  
  let source: AudioBufferSourceNode | OscillatorNode;
  
  switch (type) {
    case 'mindfulness':
      // Gentle ambient sound for mindfulness
      source = createAmbientSound(audioContext, gainNode, 'gentle');
      break;
    case 'focus':
      // Alpha wave binaural beats (8-12 Hz)
      source = createBinauralBeat(audioContext, gainNode, 200, 10);
      break;
    case 'energy':
      // Beta wave binaural beats (15-20 Hz)
      source = createBinauralBeat(audioContext, gainNode, 200, 18);
      break;
    case 'stress-relief':
      // Theta wave binaural beats (4-8 Hz)
      source = createBinauralBeat(audioContext, gainNode, 200, 6);
      break;
    case 'sleep':
      // Delta wave binaural beats (1-4 Hz)
      source = createBinauralBeat(audioContext, gainNode, 200, 2);
      break;
    default:
      // Default ambient sound
      source = createAmbientSound(audioContext, gainNode, 'default');
  }
  
  return {
    audioContext,
    gainNode,
    source,
    isPlaying: true
  };
}

function createBinauralBeat(
  audioContext: AudioContext, 
  gainNode: GainNode, 
  baseFreq: number, 
  beatFreq: number
): OscillatorNode {
  // Create stereo panner to simulate binaural effect
  const pannerLeft = audioContext.createStereoPanner();
  pannerLeft.pan.value = -1; // Left channel
  
  const pannerRight = audioContext.createStereoPanner();
  pannerRight.pan.value = 1; // Right channel
  
  // Create oscillators
  const oscillatorLeft = audioContext.createOscillator();
  oscillatorLeft.type = 'sine';
  oscillatorLeft.frequency.value = baseFreq;
  
  const oscillatorRight = audioContext.createOscillator();
  oscillatorRight.type = 'sine';
  oscillatorRight.frequency.value = baseFreq + beatFreq;
  
  // Connect everything
  oscillatorLeft.connect(pannerLeft);
  oscillatorRight.connect(pannerRight);
  
  pannerLeft.connect(gainNode);
  pannerRight.connect(gainNode);
  
  // Start oscillators
  oscillatorLeft.start();
  oscillatorRight.start();
  
  return oscillatorLeft; // Return one of the oscillators for reference
}

function createAmbientSound(
  audioContext: AudioContext, 
  gainNode: GainNode, 
  variant: string = 'default'
): AudioBufferSourceNode {
  // Create a buffer for noise
  const bufferSize = 2 * audioContext.sampleRate;
  const noiseBuffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
  
  // Fill the buffer with ambient noise based on variant
  for (let channel = 0; channel < noiseBuffer.numberOfChannels; channel++) {
    const data = noiseBuffer.getChannelData(channel);
    
    for (let i = 0; i < bufferSize; i++) {
      switch (variant) {
        case 'gentle':
          // Gentle flowing ambient sound
          const slowWave = Math.sin(i / 10000) * 0.5 + 0.5;
          data[i] = Math.random() * 0.05 * slowWave;
          break;
        case 'nature':
          // Nature-like ambient with occasional sounds
          if (Math.random() > 0.995) {
            data[i] = Math.random() * 0.2;
          } else {
            data[i] = Math.random() * 0.01;
          }
          break;
        default:
          // Default quiet ambient sound
          data[i] = Math.random() * 0.02;
      }
    }
  }
  
  // Create a buffer source
  const source = audioContext.createBufferSource();
  source.buffer = noiseBuffer;
  source.loop = true;
  
  // Connect and start the source
  source.connect(gainNode);
  source.start();
  
  return source;
}

export function stopMeditationAudio(audioState: AudioState): void {
  if (audioState.source) {
    try {
      if ('stop' in audioState.source) {
        audioState.source.stop();
      }
    } catch (error) {
      console.warn('Error stopping audio source:', error);
    }
  }
  
  try {
    audioState.gainNode.disconnect();
    // @ts-ignore - some browsers have this method
    if (audioState.audioContext.close) {
      audioState.audioContext.close();
    }
  } catch (error) {
    console.warn('Error closing audio context:', error);
  }
}

export function updateMeditationVolume(audioState: AudioState, volume: number): void {
  if (audioState.gainNode) {
    audioState.gainNode.gain.value = Math.max(0, Math.min(1, volume));
  }
}
