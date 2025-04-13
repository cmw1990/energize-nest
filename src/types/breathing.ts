
export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold?: number;
  exhale: number;
  holdAfterExhale?: number;
  cycles: number;
  category: 'relaxation' | 'energy' | 'focus' | 'sleep' | 'stress';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  icon?: string;
  pattern: {
    inhale: number;
    hold?: number;
    exhale: number;
    holdAfterExhale?: number;
  };
}
