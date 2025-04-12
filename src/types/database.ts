export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  urgency: "urgent" | "normal" | "low";
  status: "todo" | "in_progress" | "done";
  estimated_minutes: number;
  actual_minutes?: number;
  due_date?: string | null;
  created_at: string;
  updated_at?: string;
  tags?: string[];
  category?: string;
  cognitive_load_estimate?: number;
  difficulty_level?: number;
  energy_required?: number;
  blocked_by?: string[];
  blocking?: string[];
  parent_task_id?: string | null;
  completed_at?: string | null;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood_rating?: number;
  energy_level?: number;
  tags?: string[];
  created_at: string;
  updated_at?: string;
}

export interface Supplement {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  category?: string;
  dosage?: string;
  frequency?: string;
  brand?: string;
  effects?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TeaVendor {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  website?: string;
  rating?: number;
  review_count?: number;
  verification_status?: string;
  shipping_regions?: string[];
  favorite?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TeaEquipment {
  id: string;
  user_id: string;
  name: string;
  type: string;
  description?: string;
  material?: string;
  capacity?: string;
  price_range?: string;
  care_instructions?: string[];
  best_for?: string[];
  pros?: string[];
  cons?: string[];
  specifications?: any;
  created_at?: string;
  updated_at?: string;
}

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
  meditation_minutes?: number;
  focus_score?: number;
  productivity_score?: number;
  screen_time_minutes?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuitAttempt {
  id: string;
  user_id: string;
  substance: string;
  method: string;
  start_date: string;
  end_date?: string | null;
  is_active: boolean;
  success_rating?: number;
  challenges_faced?: string[];
  coping_strategies?: string[];
  support_received?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Milestone {
  id: string;
  user_id: string;
  title: string;
  achieved_at: string;
  days_sober: number;
  health_improvements?: string[];
  mental_improvements?: string[];
  lifestyle_changes?: string[];
  celebration_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TreatmentPlan {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: string;
  goals?: any;
  interventions?: any;
  tasks?: any[];
  client_id?: string;
  professional_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ConsultationSession {
  id: string;
  client_id: string;
  professional_id: string;
  session_date: string;
  session_type: string;
  duration_minutes: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: string;
  user_id?: string;
  is_favorite: boolean;
  created_at: string;
  updated_at?: string;
}

export interface NutritionGoals {
  id: string;
  user_id: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at: string;
  updated_at?: string;
}
