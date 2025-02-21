
export interface LifeSituation {
  id: string;
  user_id: string;
  situation: 'regular' | 'pregnancy' | 'postpartum' | 'breastfeeding';
  notes: string;
  started_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  energy_level_required: number;
  estimated_duration_minutes: number;
  plan_type: PlanType;
  category: PlanCategory;
  tags: string[];
  likes_count: number;
  saves_count: number;
  energy_plan_components: any[];
  is_expert_plan: boolean;
  celebrity_name?: string;
  recommended_time_of_day?: string[];
  suitable_contexts?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  visibility: 'public' | 'private' | 'shared';
}

export type PlanType = 
  | 'energizing_boost'
  | 'sustained_focus'
  | 'mental_clarity'
  | 'physical_vitality'
  | 'deep_relaxation'
  | 'stress_relief'
  | 'evening_winddown'
  | 'sleep_preparation'
  | 'meditation';

export type PlanCategory = 'charged' | 'recharged';

export interface ProgressRecord {
  id: string;
  plan_id: string;
  completed_at?: string;
  user_id: string;
}
