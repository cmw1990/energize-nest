
export interface ConsultationSession {
  id: string;
  title: string;
  description: string;
  client_id: string;
  professional_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  price: number;
  created_at: string;
  updated_at: string;
}

export interface ClientProgressTracking {
  id?: string;
  client_id: string;
  session_id: string;
  progress_rating: number;
  notes: string;
  homework: string;
  next_steps: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClientProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  emergency_contact?: string;
  date_of_birth?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalProfile {
  id: string;
  user_id: string;
  full_name: string;
  bio: string;
  specialty: string[];
  credentials: string[];
  years_experience: number;
  hourly_rate: number;
  availability: Availability[];
  created_at: string;
  updated_at: string;
}

export interface Availability {
  day: string;
  start_time: string;
  end_time: string;
}

export interface ConsultationPackage {
  id: string;
  title: string;
  description: string;
  professional_id: string;
  session_count: number;
  total_price: number;
  validity_days: number;
  created_at: string;
  updated_at: string;
}

export interface TreatmentPlan {
  id: string;
  client_id: string;
  professional_id: string;
  title: string;
  description: string;
  goals: string[];
  activities: TreatmentActivity[];
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface TreatmentActivity {
  id: string;
  title: string;
  description: string;
  frequency: string;
  is_completed: boolean;
}

export interface ClientGoal {
  id: string;
  client_id: string;
  professional_id?: string;
  title: string;
  description: string;
  target_date?: string;
  progress: number;
  status: 'active' | 'completed' | 'abandoned';
  created_at: string;
  updated_at: string;
}
