
import { LucideIcon } from "lucide-react";

export type PlanCategory = "charged" | "recharged";
export type Visibility = "private" | "public";
export type PlanType = "standard" | "custom" | "expert" | "public";
export type LifeSituation = "regular" | "pregnancy" | "postpartum" | "breastfeeding";

export interface PlanComponent {
  id: string;
  plan_id: string;
  component_type: string;
  description: string;
  duration_minutes: number;
  order_index: number;
  created_at: string;
  updated_at: string;
  title?: string;
  instructions?: string;
  image_url?: string;
}

export interface Plan {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  plan_name: string;
  plan_type: PlanType;
  duration_minutes: number;
  activities: Record<string, any>;
  effectiveness_rating?: number;
  energy_plan_components?: PlanComponent[];
  is_expert_plan?: boolean;
}

export interface ProgressRecord {
  id: string;
  user_id: string;
  plan_id: string;
  completed_date: string;
  energy_before: number;
  energy_after: number;
  focus_before: number;
  focus_after: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: LucideIcon;
  category: string;
  achieved: boolean;
  points: number;
  progress: number;
  total_required?: number;
  level?: number;
  next_level_points?: number;
  streak_count?: number;
  unlocked_at?: string;
  created_at?: string;
  user_id?: string;
  type?: string;
  title?: string;
  target_value?: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  entry_type: string;
  mood_rating: number;
  tags: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  category?: string;
  cognitive_load_estimate?: number;
  difficulty_level?: number;
  estimated_minutes?: number;
  actual_minutes?: number;
}

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

export interface FoodItem {
  id: string;
  food_name: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  serving_size?: string;
  image_url?: string;
  meal_type?: string;
  meal_time?: string;
  user_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  ai_analysis?: string;
}

export interface NutritionGoals {
  id: string;
  user_id: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
  created_at?: string;
  updated_at?: string;
}
