
export interface Plan {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  tags: string[];
  category: string;
  difficulty: number;
  duration_days: number;
  energy_impact: number;
  focus_impact: number;
  mood_impact: number;
  components: PlanComponent[];
  image_url?: string;
  source?: string;
  source_name?: string;
  success_metrics?: string[];
}

export interface PlanComponent {
  id: string;
  plan_id: string;
  title: string;
  description: string;
  type: 'supplement' | 'habit' | 'exercise' | 'nutrition' | 'sleep' | 'other';
  frequency: 'daily' | 'weekly' | 'monthly' | 'once' | 'as_needed';
  duration_minutes?: number;
  schedule?: string;
  dosage?: string;
  notes?: string;
  day?: number;
  week?: number;
  custom_fields?: {
    [key: string]: any;
  };
  impact_score?: number;
  evidence_level?: 'anecdotal' | 'some_research' | 'well_researched' | 'clinical';
  optional: boolean;
  order: number;
}

export interface ProgressRecord {
  id: string;
  plan_id: string;
  user_id: string;
  date: string;
  overall_adherence: number;
  energy_rating?: number;
  focus_rating?: number;
  mood_rating?: number;
  notes?: string;
  component_progress: ComponentProgress[];
}

export interface ComponentProgress {
  component_id: string;
  completed: boolean;
  adherence_level?: number;
  notes?: string;
}

// DB to App model conversion utility
export function adaptDbPlanToAppPlan(dbPlan: any): Plan {
  let components: PlanComponent[] = [];
  
  if (dbPlan.energy_plan_components && Array.isArray(dbPlan.energy_plan_components)) {
    components = dbPlan.energy_plan_components.map((comp: any) => ({
      id: comp.id,
      plan_id: comp.plan_id,
      title: comp.title || '',
      description: comp.description || '',
      type: comp.type || 'other',
      frequency: comp.frequency || 'daily',
      duration_minutes: comp.duration_minutes,
      schedule: comp.schedule,
      dosage: comp.dosage,
      notes: comp.notes,
      day: comp.day,
      week: comp.week,
      custom_fields: comp.custom_fields,
      impact_score: comp.impact_score,
      evidence_level: comp.evidence_level,
      optional: comp.optional || false,
      order: comp.order || 0
    }));
  }
  
  return {
    id: dbPlan.id,
    title: dbPlan.title || 'Untitled Plan',
    description: dbPlan.description || '',
    created_by: dbPlan.created_by,
    created_at: dbPlan.created_at,
    updated_at: dbPlan.updated_at,
    is_public: dbPlan.is_public || false,
    tags: dbPlan.tags || [],
    category: dbPlan.category || 'general',
    difficulty: dbPlan.difficulty || 2,
    duration_days: dbPlan.duration_days || 30,
    energy_impact: dbPlan.energy_impact || 3,
    focus_impact: dbPlan.focus_impact || 3,
    mood_impact: dbPlan.mood_impact || 3,
    components: components,
    image_url: dbPlan.image_url,
    source: dbPlan.source,
    source_name: dbPlan.source_name,
    success_metrics: dbPlan.success_metrics
  };
}
