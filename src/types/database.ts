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

// Visibility enum for sharing settings
export enum Visibility {
  PRIVATE = 'private',
  PUBLIC = 'public',
  SHARED = 'shared'
}

// Define other missing types that were referenced in the error message
