
export interface Plan {
  id: string;
  name: string;
  description: string;
  category: PlanCategory;
  duration_minutes: number;
  energy_level_required: number;
  user_id: string;
  components: PlanComponent[];
  suitable_life_situations?: LifeSituation[];
  created_at: string;
  updated_at: string;
  visibility: 'public' | 'private' | 'shared';
  likes_count: number;
  views_count: number;
  saves_count?: number;
  plan_type?: string;
  title?: string;
  is_expert_plan?: boolean;
  celebrity_name?: string;
  estimated_duration_minutes?: number;
  recommended_time_of_day?: string[];
  suitable_contexts?: string[];
  tags?: string[];
  energy_plan_components?: any[];
}

export type PlanType = 
  | 'standard'
  | 'expert'
  | 'celebrity'
  | 'community'
  | 'custom';

export type PlanCategory = 
  | 'morning'
  | 'midday'
  | 'evening'
  | 'work'
  | 'study'
  | 'exercise'
  | 'social'
  | 'recovery'
  | 'creative'
  | 'charged'
  | 'recharged';

export interface PlanComponent {
  id: string;
  plan_id: string;
  activity_type: string;
  activity_name: string;
  duration_minutes: number;
  description: string;
  order: number;
  created_at: string;
}

export interface ProgressRecord {
  id: string;
  plan_id: string;
  user_id: string;
  date: string;
  completed: boolean;
  completion_rate: number;
  energy_before: number;
  energy_after: number;
  notes: string;
  created_at: string;
  completed_at?: string;
}

export type LifeSituation = 
  | 'work_from_home'
  | 'office_work'
  | 'student'
  | 'parent'
  | 'high_stress'
  | 'low_energy'
  | 'recovering'
  | 'traveling'
  | 'busy_schedule'
  | 'regular';

export interface PersonalPlansProps {
  onPlanCreated: () => void;
  plans?: Plan[];
}

export interface PlanFiltersProps {
  selectedCategory: PlanCategory | null;
  onCategoryChange: (category: PlanCategory | null) => void;
}

export interface PlanDiscoveryProps {
  selectedCategory: PlanCategory | null; 
  onSavePlan: (id: string) => void;
}

export interface LifeSituationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (situation: LifeSituation) => void;
  lifeSituation?: LifeSituation;
}
