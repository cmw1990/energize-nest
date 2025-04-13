
/**
 * Represents a breathing technique with its parameters and instructions
 */
export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold1?: number;
  exhale: number;
  hold2?: number;
  cycles: number;
  benefits: string[];
  instructions?: string;
  category: 'relaxation' | 'energy' | 'focus' | 'sleep' | 'stress';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
