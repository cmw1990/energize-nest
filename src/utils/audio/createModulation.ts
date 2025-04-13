
export const createModulation = (context: AudioContext, frequency: number, scale: number = 1) => {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  gain.gain.value = scale;
  
  oscillator.connect(gain);
  oscillator.start();
  
  return gain;
};

export const createNoiseBuffer = (context: AudioContext, length: number = 1) => {
  const bufferSize = context.sampleRate * length;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  return buffer;
};
