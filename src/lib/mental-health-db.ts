import { supabase } from '@/integrations/supabase/client';

// Types for all mental health related data
export interface MoodEntry {
  id?: string;
  user_id?: string;
  timestamp: Date;
  mood_score: number;
  energy_level: number;
  activities?: string[];
  triggers?: string[];
  notes?: string;
}

export interface AnxietyEntry {
  id?: string;
  user_id?: string;
  timestamp: Date;
  anxiety_level: number;
  physical_symptoms?: string[];
  thoughts?: string;
  coping_strategies?: string[];
  notes?: string;
}

export interface MindfulnessSession {
  id?: string;
  user_id?: string;
  start_time: Date;
  duration_minutes: number;
  session_type: string;
  focus_rating?: number;
  notes?: string;
}

export interface TherapyGoal {
  id?: string;
  user_id?: string;
  title: string;
  description?: string;
  target_date?: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  progress_notes?: string[];
}

export interface StressLevel {
  id?: string;
  user_id?: string;
  timestamp: Date;
  stress_level: number;
  triggers?: string[];
  physical_symptoms?: string[];
  coping_strategies?: string[];
  notes?: string;
}

export interface SleepMental {
  id?: string;
  user_id?: string;
  date: Date;
  sleep_quality?: number;
  bedtime_routine?: string[];
  sleep_anxiety_level?: number;
  dream_journal?: string;
  night_thoughts?: string;
}

export interface SocialConnection {
  id?: string;
  user_id?: string;
  date: Date;
  interaction_type: string;
  connection_quality: number;
  energy_impact: number;
  boundary_notes?: string;
  support_received?: boolean;
  support_provided?: boolean;
  notes?: string;
}

export interface CognitiveExercise {
  id?: string;
  user_id?: string;
  timestamp: Date;
  exercise_type: string;
  situation?: string;
  thoughts?: string;
  emotions?: string[];
  cognitive_distortions?: string[];
  reframed_thoughts?: string;
  behavioral_actions?: string[];
  outcome_rating?: number;
}

export interface CrisisPlan {
  id?: string;
  user_id?: string;
  plan_type: string;
  triggers?: string[];
  warning_signs?: string[];
  coping_strategies?: string[];
  emergency_contacts?: any[];
  professional_contacts?: any[];
  safe_places?: string[];
  medications?: any[];
}

export interface EnergyCorrelation {
  id?: string;
  user_id?: string;
  date: Date;
  mental_energy_score: number;
  physical_energy_score: number;
  recovery_need_score: number;
  energy_drains?: string[];
  recharge_activities?: string[];
  wellness_score: number;
  notes?: string;
}

class MentalHealthDB {
  // Existing methods for mood tracking
  async createMoodEntry(entry: MoodEntry) {
    const { data, error } = await supabase
      .from('mood_tracking8')
      .insert([entry]);
    if (error) throw error;
    return data;
  }

  async getMoodEntries(startDate: Date) {
    const { data, error } = await supabase
      .from('mood_tracking8')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return data;
  }

  // Existing methods for anxiety tracking
  async createAnxietyEntry(entry: AnxietyEntry) {
    const { data, error } = await supabase
      .from('anxiety_tracking8')
      .insert([entry]);
    if (error) throw error;
    return data;
  }

  async getAnxietyEntries(startDate: Date) {
    const { data, error } = await supabase
      .from('anxiety_tracking8')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return data;
  }

  // Existing methods for mindfulness sessions
  async createMindfulnessSession(session: MindfulnessSession) {
    const { data, error } = await supabase
      .from('mindfulness_sessions8')
      .insert([session]);
    if (error) throw error;
    return data;
  }

  async getMindfulnessSessions(startDate: Date) {
    const { data, error } = await supabase
      .from('mindfulness_sessions8')
      .select('*')
      .gte('start_time', startDate.toISOString())
      .order('start_time', { ascending: false });
    if (error) throw error;
    return data;
  }

  // Existing methods for therapy goals
  async createTherapyGoal(goal: TherapyGoal) {
    const { data, error } = await supabase
      .from('therapy_goals8')
      .insert([goal]);
    if (error) throw error;
    return data;
  }

  async getTherapyGoals() {
    const { data, error } = await supabase
      .from('therapy_goals8')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async updateTherapyGoal(goalId: string, updates: Partial<TherapyGoal>) {
    const { data, error } = await supabase
      .from('therapy_goals8')
      .update(updates)
      .eq('id', goalId);
    if (error) throw error;
    return data;
  }

  // New methods for stress levels
  async createStressLevel(entry: StressLevel) {
    const { data, error } = await supabase
      .from('stress_levels8')
      .insert([entry]);
    if (error) throw error;
    return data;
  }

  async getStressLevels(startDate: Date) {
    const { data, error } = await supabase
      .from('stress_levels8')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return data;
  }

  // New methods for sleep mental health
  async createSleepMental(entry: SleepMental) {
    const { data, error } = await supabase
      .from('sleep_mental8')
      .insert([entry]);
    if (error) throw error;
    return data;
  }

  async getSleepMental(startDate: Date) {
    const { data, error } = await supabase
      .from('sleep_mental8')
      .select('*')
      .gte('date', startDate.toISOString())
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  }

  // New methods for social connections
  async createSocialConnection(entry: SocialConnection) {
    const { data, error } = await supabase
      .from('social_connections8')
      .insert([entry]);
    if (error) throw error;
    return data;
  }

  async getSocialConnections(startDate: Date) {
    const { data, error } = await supabase
      .from('social_connections8')
      .select('*')
      .gte('date', startDate.toISOString())
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  }

  // New methods for cognitive exercises
  async createCognitiveExercise(exercise: CognitiveExercise) {
    const { data, error } = await supabase
      .from('cognitive_exercises8')
      .insert([exercise]);
    if (error) throw error;
    return data;
  }

  async getCognitiveExercises(startDate: Date) {
    const { data, error } = await supabase
      .from('cognitive_exercises8')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return data;
  }

  // New methods for crisis plans
  async createCrisisPlan(plan: CrisisPlan) {
    const { data, error } = await supabase
      .from('crisis_plans8')
      .insert([plan]);
    if (error) throw error;
    return data;
  }

  async getCrisisPlans() {
    const { data, error } = await supabase
      .from('crisis_plans8')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async updateCrisisPlan(planId: string, updates: Partial<CrisisPlan>) {
    const { data, error } = await supabase
      .from('crisis_plans8')
      .update(updates)
      .eq('id', planId);
    if (error) throw error;
    return data;
  }

  // New methods for energy correlations
  async createEnergyCorrelation(entry: EnergyCorrelation) {
    const { data, error } = await supabase
      .from('energy_correlations8')
      .insert([entry]);
    if (error) throw error;
    return data;
  }

  async getEnergyCorrelations(startDate: Date) {
    const { data, error } = await supabase
      .from('energy_correlations8')
      .select('*')
      .gte('date', startDate.toISOString())
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  }
}

export const mentalHealthDb = new MentalHealthDB();
