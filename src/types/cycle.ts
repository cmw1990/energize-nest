
export interface CyclePhaseRecommendation {
  id: string;
  phase_type: string;
  title: string;
  description: string;
  tags: string[];
  priority: number;
  created_at: string;
}

export interface CycleExerciseRecommendation {
  id: string;
  phase_type: string;
  exercise_type: string;
  intensity_level: string;
  description: string;
  benefits: string[];
  precautions: string[];
  created_at: string;
}

export interface CycleNutritionRecommendation {
  id: string;
  phase_type: string;
  food_category: string;
  food_items: string[];
  nutrients: string[];
  benefits: string;
  created_at: string;
}
