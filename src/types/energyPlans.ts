
// Types for Energy Plans

export type PlanCategory = 'charged' | 'recharged' | 'all' | 'mental' | 'physical' | 'work' | 'home';
export type PlanType = 'standard' | 'expert' | 'community' | 'personal' | 'celebrity';
export type LifeSituation = 'regular' | 'highStress' | 'recovery' | 'performance' | 'travel' | 'creative';

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
  
  // Additional properties used in components
  title?: string;
  energy_level_required?: number;
  estimated_duration_minutes?: number;
  energy_plan_components?: PlanComponent[];
  celebrity_name?: string;
  recommended_time_of_day?: string[];
  suitable_contexts?: string[];
  likes_count?: number;
  saves_count?: number;
  visibility?: 'public' | 'private' | 'expert';
}

export interface ProgressRecord {
  id: string;
  user_id: string;
  plan_id: string;
  completed?: boolean;
  completed_date?: string;
  energy_before?: number;
  energy_after?: number;
  focus_before?: number;
  focus_after?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PersonalPlansProps {
  onSharePlan?: (plan: Plan) => void;
  progress?: ProgressRecord[];
}

export interface PlanFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: PlanCategory) => void;
}

export interface PlanDiscoveryProps {
  selectedCategory: string;
  onSavePlan: (id: string) => void;
  progress?: ProgressRecord[];
  savedPlans?: Plan[];
  currentLifeSituation?: LifeSituation;
  currentCyclePhase?: string;
  biometricData?: {
    energyLevel?: number;
    stressLevel?: number;
    sleepQuality?: number;
    mood?: string;
  };
}

/**
 * Adapts a database plan model to the application Plan model
 * This function handles converting database-specific formats to the application format
 */
export const adaptDbPlanToAppPlan = (dbPlan: any): Plan => {
  return {
    id: dbPlan.id,
    user_id: dbPlan.user_id || dbPlan.created_by,
    plan_name: dbPlan.plan_name || dbPlan.title || "Unnamed Plan",
    plan_type: (dbPlan.plan_type as PlanType) || "standard",
    category: (dbPlan.category as PlanCategory) || undefined,
    duration_minutes: dbPlan.duration_minutes || 0,
    activities: dbPlan.activities || {},
    created_at: dbPlan.created_at,
    is_expert_plan: dbPlan.is_expert_plan || false,
    rating: dbPlan.rating || dbPlan.effectiveness_rating,
    is_favorite: dbPlan.is_favorite || false,
    description: dbPlan.description,
    image_url: dbPlan.image_url,
    author: dbPlan.author || dbPlan.created_by_name,
    
    // Map additional fields
    title: dbPlan.title || dbPlan.plan_name,
    energy_level_required: dbPlan.energy_level_required,
    estimated_duration_minutes: dbPlan.estimated_duration_minutes || dbPlan.duration_minutes,
    energy_plan_components: dbPlan.energy_plan_components,
    celebrity_name: dbPlan.celebrity_name,
    recommended_time_of_day: dbPlan.recommended_time_of_day,
    suitable_contexts: dbPlan.suitable_contexts,
    likes_count: dbPlan.likes_count || 0,
    saves_count: dbPlan.saves_count || 0,
    visibility: dbPlan.visibility || dbPlan.is_public ? 'public' : 'private'
  };
};
