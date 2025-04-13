
// Types for Energy Plans

export type PlanCategory = 'charged' | 'recharged' | 'all' | 'mental' | 'physical' | 'work' | 'home';
export type PlanType = 'standard' | 'expert' | 'community' | 'personal' | 'celebrity';
export type LifeSituation = 'regular' | 'highStress' | 'recovery' | 'performance' | 'travel' | 'creative';

export interface Plan {
  id: string;
  user_id: string;
  plan_name: string;
  plan_type: PlanType;
  category?: PlanCategory;
  duration_minutes: number;
  activities: Record<string, any>;
  created_at?: string;
  is_expert_plan?: boolean;
  rating?: number;
  is_favorite?: boolean;
  description?: string;
  image_url?: string;
  author?: string;
}

export interface PersonalPlansProps {
  plans: Plan[];
  onPlanCreated: () => void;
}

export interface PlanFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: PlanCategory) => void;
}

export interface PlanDiscoveryProps {
  selectedCategory: string;
  onSavePlan: (plan: Plan) => void;
}
