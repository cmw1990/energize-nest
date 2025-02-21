
export interface LifeSituation {
  id: string;
  user_id: string;
  situation_type: string;
  notes: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  energy_level_required: number;
  estimated_duration_minutes: number;
  plan_type: string;
  category: 'charged' | 'recharged';
  tags: string[];
  likes_count: number;
  saves_count: number;
  energy_plan_components: any[];
  is_expert_plan: boolean;
  celebrity_name?: string;
  recommended_time_of_day?: string[];
  suitable_contexts?: string[];
}

export interface ProgressRecord {
  id: string;
  plan_id: string;
  completed_at?: string;
  user_id: string;
}

