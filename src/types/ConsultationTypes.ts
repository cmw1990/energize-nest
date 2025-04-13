

export interface ConsultationNote {
  id?: string;
  session_id: string;
  professional_id: string;
  client_id: string;
  content: string;
  mood_observed?: string;
  progress_notes?: string;
  recommendations?: Record<string, any>;
  follow_up_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerBehavior {
  id: string;
  behavior_patterns: {
    active_users: number;
    engagement_rate: number;
    response_rate: number;
    segments: {
      name: string;
      value: number;
    }[];
  };
}

export interface ExpertProfile {
  id: string;
  created_at: string;
  updated_at: string;
  credentials: any;
  specialties: string[];
  verification_status: string;
  verified_at: string | null;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

export interface ClientProgressTracking {
  id?: string;
  session_id: string;
  client_id: string;
  progress_rating?: number;
  notes?: string;
  homework?: string;
  next_steps?: string;
  milestone_achievements?: string[];
  treatment_goals?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ClientGoal {
  id: string;
  client_id: string;
  professional_id?: string;
  title: string;
  description?: string;
  target_date?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  progress: number;
  created_at?: string;
  updated_at?: string;
}

