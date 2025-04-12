
/**
 * This file defines the database schema types for Supabase tables
 * and can be used for type-safe database operations
 */

import { Json } from "@/types/supabase";

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
}

export interface DbFoodItem {
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

export interface DbNutritionGoals {
  id: string;
  user_id: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at: string;
  updated_at?: string;
}

// Helper function to safely cast database types to application types
export function safeCast<T, U>(dbObject: T): U {
  return dbObject as unknown as U;
}

// Helper function for safe array casting
export function safeArrayCast<T, U>(dbArray: T[]): U[] {
  return dbArray as unknown as U[];
}
