
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
    author: dbPlan.author || dbPlan.created_by_name
  };
};
