
export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  updated_at?: string;
}

export interface EnergyFocusLog {
  id: string;
  user_id: string;
  activity_type: string;
  activity_name: string;
  duration_minutes?: number;
  focus_rating?: number;
  energy_rating?: number;
  notes?: string;
  created_at: string;
}

export interface EnergyPlan {
  id: string;
  user_id: string;
  plan_name: string;
  plan_type: string;
  duration_minutes: number;
  activities: Record<string, any>;
  created_at: string;
}

// Type for consultation sessions used in client dashboards
export interface ConsultationSession {
  id: string;
  client_id: string;
  professional_id: string;
  session_type: string;
  status: string;
  scheduled_start: string;
  duration_minutes: number;
  session_date: string;
  meeting_link: string;
  notes: string;
  feedback_submitted: boolean;
  created_at: string;
  professional: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

// FoodItem type for nutrition tracking
export interface FoodItem {
  id: string;
  user_id: string;
  food_name: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  serving_size?: string;
  meal_type?: string;
  meal_time?: string;
  notes?: string;
  created_at: string;
}

// NutritionGoals type
export interface NutritionGoals {
  id: string;
  user_id: string;
  daily_calories: number;
  daily_protein: number;
  daily_carbs: number;
  daily_fat: number;
  created_at: string;
  updated_at: string;
}

// Task interface for use in ADHD task management and Eisenhower Matrix
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  urgency: 'urgent' | 'normal' | 'low';
  due_date: string | null;
  status: 'todo' | 'in_progress' | 'done';
  estimated_minutes: number;
  actual_minutes?: number;
  category?: string;
  cognitive_load_estimate?: number;
  created_at: string;
  updated_at: string;
}

// Journal Entry interface
export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood_rating: number;
  energy_level: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// HealthMetric interface
export interface HealthMetric {
  id: string;
  user_id: string;
  date: string;
  mood_rating: number;
  energy_level: number;
  stress_level: number;
  sleep_hours: number;
  sleep_quality: number;
  exercise_minutes: number;
  water_intake: number;
  focus_level: number;
  productivity_score: number;
  symptoms: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}

// TeaEquipment interface
export interface TeaEquipment {
  id: string;
  user_id: string;
  name: string;
  type: string;
  description: string;
  material: string;
  capacity: string;
  price_range: string;
  pros: string[];
  cons: string[];
  best_for: string[];
  care_instructions: string[];
  image_url: string;
  category: string;
  specifications: any;
  created_at: string;
  updated_at: string;
}

// TeaVendor interface
export interface TeaVendor {
  id: string;
  user_id: string;
  name: string;
  description: string;
  website: string;
  rating: number;
  review_count: number;
  shipping_regions: string[];
  verification_status: string;
  favorite: boolean;
  created_at: string;
  updated_at: string;
}

// QuitAttempt interface
export interface QuitAttempt {
  id: string;
  user_id: string;
  substance: string;
  substance_type: 'alcohol' | 'tobacco' | 'other';
  method: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  success_rating: number;
  challenges_faced: string[];
  coping_strategies: string[];
  support_received: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}

// Milestone interface
export interface Milestone {
  id: string;
  user_id: string;
  title: string;
  days_sober: number;
  achieved_at: string;
  health_improvements: string[];
  mental_improvements: string[];
  lifestyle_changes: string[];
  celebration_notes: string;
  physical_benefits: string[];
  created_at: string;
  updated_at: string;
}

// Supplement interface
export interface Supplement {
  id: string;
  user_id: string;
  name: string;
  description: string;
  category: string;
  frequency: string;
  dosage: string;
  brand: string;
  effects: string[];
  side_effects: string[];
  created_at: string;
  updated_at: string;
}

// TreatmentPlan interface
export interface TreatmentPlan {
  id: string;
  user_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  tasks: any[];
  goals: any;
  interventions: any;
  created_at: string;
  updated_at: string;
}

// Visibility enum for sharing settings
export enum Visibility {
  PRIVATE = 'private',
  PUBLIC = 'public',
  SHARED = 'shared'
}

// Define cycle related types
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

// Define other missing types that were referenced in the error message
