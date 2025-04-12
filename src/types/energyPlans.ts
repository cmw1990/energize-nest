
import { Json } from "./supabase";

export type PlanCategory = 'charged' | 'recharged';

export interface Plan {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  title: string;
  description: string | null;
  plan_type: string;
  category: PlanCategory;
  visibility: 'public' | 'private' | 'shared';
  is_expert_plan: boolean;
  energy_level_required: number;
  estimated_duration_minutes: number;
  likes_count: number;
  saves_count: number;
  recommended_time_of_day: string[];
  suitable_contexts: string[];
  tags: string[];
  energy_plan_components?: PlanComponent[];
  celebrity_name?: string; // Added celebrity_name field
}

export interface PlanComponent {
  id: string;
  plan_id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  order: number;
  type: string;
  details: Json;
  media_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProgressRecord {
  id: string;
  user_id: string;
  plan_id: string;
  date: string;
  energy_before: number;
  energy_after: number;
  mood_before: number;
  mood_after: number;
  completed: boolean; // Changed from completed_at to match database schema
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type LifeSituation = 
  | 'working_from_home'
  | 'office_work'
  | 'parenting'
  | 'traveling'
  | 'studying'
  | 'recovery'
  | 'illness'
  | 'burnout'
  | 'vacation'
  | 'regular'; // Added 'regular' to match usage in code

export type PlanType = 
  | 'standard' 
  | 'custom' 
  | 'expert' 
  | 'public';

// Adapter function to transform database model to application model
export function adaptDbPlanToAppPlan(dbPlan: any): Plan {
  return {
    id: dbPlan.id,
    created_at: dbPlan.created_at,
    updated_at: dbPlan.updated_at,
    created_by: dbPlan.user_id || dbPlan.created_by,
    title: dbPlan.plan_name || dbPlan.title,
    description: dbPlan.description,
    plan_type: dbPlan.plan_type,
    category: (dbPlan.category || 'charged') as PlanCategory,
    visibility: dbPlan.visibility || 'private',
    is_expert_plan: !!dbPlan.is_expert_plan,
    energy_level_required: dbPlan.energy_level_required || 5,
    estimated_duration_minutes: dbPlan.duration_minutes || dbPlan.estimated_duration_minutes || 30,
    likes_count: dbPlan.likes_count || 0,
    saves_count: dbPlan.saves_count || 0,
    recommended_time_of_day: dbPlan.recommended_time_of_day || [],
    suitable_contexts: dbPlan.suitable_contexts || [],
    tags: dbPlan.tags || [],
    energy_plan_components: dbPlan.energy_plan_components || [],
    celebrity_name: dbPlan.celebrity_name || null,
  };
}

// Adapter function to transform application model to database model
export function adaptAppPlanToDbPlan(appPlan: Partial<Plan>): any {
  return {
    user_id: appPlan.created_by,
    plan_name: appPlan.title,
    description: appPlan.description,
    plan_type: appPlan.plan_type,
    category: appPlan.category,
    visibility: appPlan.visibility,
    is_expert_plan: appPlan.is_expert_plan,
    energy_level_required: appPlan.energy_level_required,
    duration_minutes: appPlan.estimated_duration_minutes,
    recommended_time_of_day: appPlan.recommended_time_of_day,
    suitable_contexts: appPlan.suitable_contexts,
    tags: appPlan.tags,
    celebrity_name: appPlan.celebrity_name,
  };
}
