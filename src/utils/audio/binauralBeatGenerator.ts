let audioContextInstance: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContextInstance) {
    audioContextInstance = new AudioContext();
  }
  return audioContextInstance;
};

export const generateBinauralBeat = (baseFreq: number, beatFreq: number, volume = 0.5) => {
  const context = getAudioContext();
  const masterGain = context.createGain();
  masterGain.gain.value = volume;
  masterGain.connect(context.destination);

  // Create two oscillators slightly detuned
  let osc1 = context.createOscillator();
  let osc2 = context.createOscillator();
  
  // Pan oscillators left and right
  const panLeft = context.createStereoPanner();
  const panRight = context.createStereoPanner();
  
  panLeft.pan.value = -1;
  panRight.pan.value = 1;

  osc1.frequency.value = baseFreq;
  osc2.frequency.value = baseFreq + beatFreq;

  osc1.connect(panLeft);
  osc2.connect(panRight);
  panLeft.connect(masterGain);
  panRight.connect(masterGain);

  osc1.start();
  osc2.start();

  // Dynamic frequency adjustment
  const setFrequencies = (base: number, beat: number) => {
    osc1.frequency.setValueAtTime(base, context.currentTime);
    osc2.frequency.setValueAtTime(base + beat, context.currentTime);
  };

  // We need to keep track of these oscillators to replace them
  let currentOsc1 = osc1;
  let currentOsc2 = osc2;

  return {
    play: async () => Promise.resolve(), // Already started on creation
    stop: () => {
      currentOsc1.stop();
      currentOsc2.stop();
      masterGain.disconnect();
    },
    setVolume: (newVolume: number) => {
      masterGain.gain.value = newVolume;
    },
    pause: () => {
      currentOsc1.stop();
      currentOsc2.stop();
    },
    resume: () => {
      const newOsc1 = context.createOscillator();
      const newOsc2 = context.createOscillator();
      newOsc1.frequency.value = currentOsc1.frequency.value;
      newOsc2.frequency.value = currentOsc2.frequency.value;
      newOsc1.connect(panLeft);
      newOsc2.connect(panRight);
      newOsc1.start();
      newOsc2.start();
      
      // Update references to new oscillators
      currentOsc1 = newOsc1;
      currentOsc2 = newOsc2;
    },
    setFrequencies,
    isPlaying: true,
    type: 'binaural',
    gainNode: masterGain
  };
};

// Generate advanced binaural beat patterns
export const createBinauralSequence = (patterns: Array<{baseFreq: number, beatFreq: number, duration: number}>, volume = 0.5) => {
  let currentBeat = generateBinauralBeat(patterns[0].baseFreq, patterns[0].beatFreq, volume);
  let isPlaying = true;
  let currentIndex = 0;
  let intervalId: number | null = null;
  
  const playSequence = () => {
    if (intervalId) clearInterval(intervalId);
    
    const advancePattern = () => {
      if (!isPlaying) return;
      
      currentIndex = (currentIndex + 1) % patterns.length;
      currentBeat.stop();
      currentBeat = generateBinauralBeat(
        patterns[currentIndex].baseFreq, 
        patterns[currentIndex].beatFreq,
        volume
      );
    };
    
    intervalId = window.setInterval(advancePattern, patterns[currentIndex].duration * 1000);
  };
  
  return {
    play: async () => {
      isPlaying = true;
      playSequence();
      return Promise.resolve();
    },
    stop: () => {
      isPlaying = false;
      if (intervalId) clearInterval(intervalId);
      currentBeat.stop();
    },
    pause: () => {
      isPlaying = false;
      if (intervalId) clearInterval(intervalId);
      currentBeat.pause();
    },
    resume: () => {
      isPlaying = true;
      currentBeat.resume();
      playSequence();
    },
    setVolume: (newVolume: number) => {
      volume = newVolume;
      currentBeat.setVolume(newVolume);
    },
    isPlaying: true,
    type: 'binaural-sequence'
  };
};

// Enhanced nature sound player with spatial effects
export const createNatureSoundPlayer = async (soundUrl: string, volume = 0.5) => {
  const context = getAudioContext();
  const response = await fetch(soundUrl);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await context.decodeAudioData(arrayBuffer);
  
  let source: AudioBufferSourceNode | null = null;
  let gainNode: GainNode | null = null;
  let isPlaying = false;
  let startTime = 0;
  let pauseTime = 0;
  
  // Create spatial effects
  const createSpatialEffect = () => {
    const panner = context.createPanner();
    panner.panningModel = 'equalpower';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;
    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 360;
    panner.coneOuterGain = 0;
    
    // Place sound in a specific location
    panner.positionX.value = Math.random() * 2 - 1; // Random position
    panner.positionY.value = Math.random() * 2 - 1;
    panner.positionZ.value = Math.random() * -3 - 2; // Some distance away
    
    return panner;
  };
  
  const setupSource = () => {
    source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;
    
    gainNode = context.createGain();
    gainNode.gain.value = volume;
    
    const spatialEffect = createSpatialEffect();
    
    source.connect(spatialEffect);
    spatialEffect.connect(gainNode);
    gainNode.connect(context.destination);
  };
  
  return {
    play: async () => {
      if (isPlaying) return Promise.resolve();
      
      setupSource();
      if (source && gainNode) {
        source.start(0, pauseTime);
        startTime = context.currentTime - pauseTime;
        isPlaying = true;
      }
      return Promise.resolve();
    },
    stop: () => {
      if (!isPlaying) return;
      
      if (source) {
        source.stop();
        source = null;
      }
      pauseTime = 0;
      isPlaying = false;
    },
    pause: () => {
      if (!isPlaying) return;
      
      if (source) {
        source.stop();
        source = null;
      }
      pauseTime = (context.currentTime - startTime) % audioBuffer.duration;
      isPlaying = false;
    },
    setVolume: (newVolume: number) => {
      volume = newVolume;
      if (gainNode) {
        gainNode.gain.value = newVolume;
      }
    },
    isPlaying,
    type: 'nature'
  };
};
