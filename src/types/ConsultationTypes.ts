
import { Json } from "./supabase";

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

export interface CustomerBehavior {
  id: string;
  vendor_id: string;
  behavior_patterns: {
    active_users: number;
    engagement_rate: number;
    response_rate: number;
    peak_hours: string[];
    segments: Array<{name: string, value: number}>;
  };
  customer_segments: {
    new: number;
    returning: number;
    inactive: number;
  };
  revenue_trends: {
    daily: any[];
    weekly: any[];
    monthly: any[];
  };
  created_at: string;
}

export interface ClientConsultation {
  id: string;
  client_id: string;
  professional_id: string;
  consultation_date: string;
  duration_minutes: number;
  notes: string;
  status: string;
  mode: string;
  primary_concern: string;
  created_at: string;
  updated_at: string;
  client?: {
    full_name: string;
    email: string;
    profile_image?: string;
  };
}

export interface ConsultationNote {
  id: string;
  consultation_id?: string;
  session_id?: string;
  client_id?: string;
  professional_id: string;
  note_content?: string;
  content?: string; // Some components use this field
  mood_observed?: string;
  progress_notes?: string;
  recommendations?: Json;
  follow_up_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface ConsultationSession {
  id: string;
  client_id: string;
  professional_id: string;
  session_date: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface PackagePurchase {
  id: string;
  client_id: string;
  package_id: string;
  purchase_date: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface TreatmentPlan {
  id: string;
  client_id: string;
  professional_id: string;
  title: string;
  description: string;
  goals: string[];
  created_at: string;
  updated_at?: string;
}

export interface ClientGoal {
  id: string;
  client_id: string;
  professional_id: string;
  title: string;
  description: string;
  status: string;
  target_date?: string;
  created_at: string;
  updated_at?: string;
}
