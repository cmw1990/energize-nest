
/**
 * Defines the structure of a breathing technique
 */
export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  inhale: number;    // Duration in seconds
  exhale: number;    // Duration in seconds
  hold?: number;     // Optional hold duration in seconds
  cycles: number;    // Number of breath cycles
  category: string;  // Category like "relaxation", "energy", "focus"
  difficulty: string; // "beginner", "intermediate", "advanced"
  benefits: string[];
}

/**
 * Defines breathing animation states
 */
export type BreathingState = 'inhale' | 'hold' | 'exhale' | 'rest';
