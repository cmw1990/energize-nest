
/**
 * This file defines the database schema types for Supabase tables
 * and can be used for type-safe database operations
 */

import { Json } from "@/types/supabase";
import { assertType } from "@/utils/typeUtils";

// Define the actual database schema types
export interface DbTask {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: string;  // Database stores as string, not enum
  urgency: string;   // Database stores as string, not enum
  status: string;    // Database stores as string, not enum
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

export interface DbJournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  entry_type: string;
  mood_rating?: number;
  energy_level?: number;
  tags?: string[];
  created_at: string;
  updated_at?: string;
}

export interface DbHealthMetric {
  id: string;
  user_id: string;
  metric_type: string;
  value: number;
  unit: string;
  recorded_at: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface DbEnergyPlan {
  id: string;
  user_id: string;
  plan_name: string;
  plan_type: string;
  activities: Json;
  duration_minutes: number;
  effectiveness_rating: number;
  created_at: string;
  updated_at: string;
  category?: string;
  visibility?: string;
  is_expert_plan?: boolean;
  energy_level_required?: number;
  likes_count?: number;
  saves_count?: number;
  recommended_time_of_day?: string[];
  suitable_contexts?: string[];
  tags?: string[];
  celebrity_name?: string;
}

export interface DbConsultationSession {
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
  meeting_link?: string;
  scheduled_start?: string; // Added this field
}

export interface DbFoodItem {
  id: string;
  user_id?: string;
  name: string;            // Using name as in the interface
  food_name?: string;      // Some components use food_name
  calories: number;
  protein: number;         // Using protein as in the interface
  protein_grams?: number;  // Some components use protein_grams
  carbs: number;           // Using carbs as in the interface
  carbs_grams?: number;    // Some components use carbs_grams
  fat: number;             // Using fat as in the interface
  fat_grams?: number;      // Some components use fat_grams
  serving_size: string;
  is_favorite: boolean;
  created_at: string;
  updated_at?: string;
  meal_type?: string;
  meal_time?: string;
  notes?: string;
}

export interface DbNutritionGoals {
  id: string;
  user_id: string;
  calories: number;        // Using base names as in the interface
  daily_calories?: number; // Some components use daily_* names
  protein: number;
  daily_protein?: number;
  carbs: number;
  daily_carbs?: number;
  fat: number;
  daily_fat?: number;
  created_at: string;
  updated_at?: string;
}

// Helper function to safely cast database types to application types
export function safeCastDbModel<T, U>(dbObject: T): U {
  return dbObject as unknown as U;
}

// Typed method for handling database query results
export function handleDbResult<T, U>(result: T, adapter: (item: T) => U): U {
  return assertType<U>(adapter(result));
}

// Helper function for safe array casting with type adapter
export function safeCastDbArray<T, U>(dbArray: T[], adapter: (item: T) => U): U[] {
  if (!Array.isArray(dbArray)) return [] as U[];
  return dbArray.map(item => assertType<U>(adapter(item)));
}
