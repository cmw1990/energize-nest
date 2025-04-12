
/**
 * Generates and plays naturalistic sounds for meditation and breathing exercises
 * @param type The type of sound to generate (e.g., 'wind', 'rain', 'ocean')
 * @param volume Volume from 0 to 1
 * @returns The audio controller object
 */
export const generateNatureSound = (type: string, volume: number = 0.5) => {
  // In a real app, you would have actual sound files to play
  // For this example, we'll simulate by just returning an object with controls
  
  const sound = {
    type,
    volume,
    isPlaying: false,
    
    play: function() {
      this.isPlaying = true;
      console.log(`Playing ${type} sound at volume ${volume}`);
      return Promise.resolve();
    },
    
    pause: function() {
      this.isPlaying = false;
      console.log(`Paused ${type} sound`);
    },
    
    stop: function() {
      this.isPlaying = false;
      console.log(`Stopped ${type} sound`);
    },
    
    setVolume: function(newVolume: number) {
      this.volume = newVolume;
      console.log(`Set ${type} sound volume to ${newVolume}`);
    }
  };
  
  return sound;
};

/**
 * Plays a meditation sound with a gradual fade in
 * @param duration Duration in seconds
 * @param type Type of meditation sound
 * @param volume Initial volume
 * @returns Audio controller
 */
export const playMeditationSound = (
  duration: number, 
  type: string = 'ambient', 
  volume: number = 0.5
) => {
  const sound = generateNatureSound(type, 0);
  
  // Fade in over 5 seconds
  let currentVolume = 0;
  const fadeInterval = setInterval(() => {
    currentVolume += 0.05;
    if (currentVolume >= volume) {
      currentVolume = volume;
      clearInterval(fadeInterval);
    }
    sound.setVolume(currentVolume);
  }, 250);
  
  // Auto-stop after duration
  if (duration > 0) {
    setTimeout(() => {
      // Fade out
      const fadeOutInterval = setInterval(() => {
        currentVolume -= 0.05;
        if (currentVolume <= 0) {
          currentVolume = 0;
          clearInterval(fadeOutInterval);
          sound.stop();
        }
        sound.setVolume(currentVolume);
      }, 250);
    }, (duration * 1000) - 5000); // Start fade 5 seconds before end
  }
  
  sound.play();
  return sound;
};
