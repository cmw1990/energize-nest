
export type PlanCategory = 'charged' | 'recharged';
export type PlanType = 'energizing_boost' | 'sustained_focus' | 'mental_clarity' | 'physical_vitality' | 'deep_relaxation' | 'stress_relief' | 'evening_winddown' | 'sleep_preparation' | 'meditation' | 'expert';
export type LifeSituation = 'regular' | 'high_stress' | 'low_energy' | 'recovery' | 'focused_work' | 'creative_flow';

export interface Plan {
  id: string;
  title: string;
  description: string;
  plan_type: PlanType;
  category: PlanCategory;
  created_by?: string;
  is_public?: boolean;
  is_expert_plan?: boolean;
  energy_level_required?: number;
  estimated_duration_minutes?: number;
  likes_count?: number;
  saves_count?: number;
  recommended_time_of_day?: string[];
  suitable_contexts?: string[];
  tags?: string[];
  celebrity_name?: string;
  created_at?: string;
  updated_at?: string;
  energy_plan_components?: PlanComponent[];
}

export interface PlanComponent {
  id: string;
  plan_id: string;
  component_type: string;
  title: string;
  description: string;
  duration_minutes: number;
  order: number;
  settings?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ProgressRecord {
  id: string;
  user_id: string;
  plan_id: string;
  component_id?: string;
  completed: boolean;
  completion_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export function adaptDbPlanToAppPlan(dbPlan: any): Plan {
  return {
    id: dbPlan.id,
    title: dbPlan.title || dbPlan.plan_name,
    description: dbPlan.description,
    plan_type: dbPlan.plan_type,
    category: dbPlan.category || 'charged',
    created_by: dbPlan.created_by || dbPlan.user_id,
    is_public: dbPlan.is_public,
    is_expert_plan: dbPlan.is_expert_plan,
    energy_level_required: dbPlan.energy_level_required,
    estimated_duration_minutes: dbPlan.estimated_duration_minutes || dbPlan.duration_minutes,
    likes_count: dbPlan.likes_count || 0,
    saves_count: dbPlan.saves_count || 0,
    recommended_time_of_day: dbPlan.recommended_time_of_day || [],
    suitable_contexts: dbPlan.suitable_contexts || [],
    tags: dbPlan.tags || [],
    celebrity_name: dbPlan.celebrity_name,
    created_at: dbPlan.created_at,
    updated_at: dbPlan.updated_at,
    energy_plan_components: dbPlan.energy_plan_components || []
  };
}
