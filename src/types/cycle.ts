
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

export interface CycleSleepCorrelation {
  id: string;
  user_id: string;
  date: string;
  phase_type: string;
  sleep_duration: number;
  sleep_quality: number;
  notes?: string; // Make it optional
  created_at: string;
  heart_rate_variability?: number;
  resting_heart_rate?: number;
  temperature_celsius?: number;
}

export interface CycleWeatherImpact {
  id: string;
  user_id: string;
  date: string;
  phase_type: string;
  symptom_type: string;
  symptom_intensity: number;
  weather_data: any;
  notes: string;
  created_at: string;
}

export interface CycleWeatherImpactType {
  id?: string;
  user_id: string;
  date: string;
  phase_type: string;
  symptom_type: string;
  symptom_intensity: number;
  weather_data?: any;
  notes?: string;
  created_at?: string;
}

export interface UserWearableDevice {
  id: string;
  user_id: string;
  device_type: string;
  device_name?: string;
  is_connected?: boolean;
  last_synced?: string;
  settings?: any;
  created_at: string;
  updated_at?: string;
  auth_token?: string;
  device_id?: string;
  is_active?: boolean;
  last_synced_at?: string;
}
