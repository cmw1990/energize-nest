import { supabase } from '@/integrations/supabase/client';

export const focusDb = {
  // Timer Sessions
  async createTimerSession(data: {
    timer_type: string;
    work_duration: number;
    break_duration: number;
    mood_before?: number;
    energy_level?: number;
  }) {
    const { data: result, error } = await supabase
      .from('focus_timer_sessions8')
      .insert({
        ...data,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async updateTimerSession(id: string, data: {
    ended_at?: string;
    completed_cycles?: number;
  }) {
    const { data: result, error } = await supabase
      .from('focus_timer_sessions8')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Task Breakdowns
  async createTaskBreakdown(data: {
    task_name: string;
    micro_steps: any[];
    energy_level: number;
    motivation_notes?: string;
    reward?: string;
    total_steps: number;
  }) {
    const { data: result, error } = await supabase
      .from('focus_task_breakdowns8')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async updateTaskProgress(id: string, completedSteps: number) {
    const { data: result, error } = await supabase
      .from('focus_task_breakdowns8')
      .update({ completed_steps: completedSteps })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Interruptions
  async logInterruption(data: {
    session_id: string;
    interruption_type: string;
    duration?: number;
    impact_level: number;
    notes?: string;
  }) {
    const { data: result, error } = await supabase
      .from('focus_interruptions8')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Environment
  async updateEnvironment(data: {
    noise_type?: string[];
    light_preference?: string;
    temperature_preference?: string;
    ambient_sounds?: string[];
    music_preferences?: any;
  }) {
    const { data: result, error } = await supabase
      .from('focus_environment8')
      .upsert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Zones
  async createZone(data: {
    name: string;
    description?: string;
    environment_settings?: any;
    automation_rules?: any;
  }) {
    const { data: result, error } = await supabase
      .from('focus_zones8')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async updateZone(id: string, data: {
    name?: string;
    description?: string;
    environment_settings?: any;
    automation_rules?: any;
    is_active?: boolean;
  }) {
    const { data: result, error } = await supabase
      .from('focus_zones8')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Routines
  async createRoutine(data: {
    name: string;
    type: string;
    steps: any[];
    duration?: number;
    preferred_time?: string;
  }) {
    const { data: result, error } = await supabase
      .from('focus_routines8')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Journal
  async createJournalEntry(data: {
    productivity_rating: number;
    challenges?: string[];
    successes?: string[];
    strategies?: string[];
    notes?: string;
  }) {
    const { data: result, error } = await supabase
      .from('focus_journal8')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Cognitive Games
  async saveGameScore(data: {
    game_type: string;
    score: number;
    duration: number;
    difficulty_level?: number;
  }) {
    const { data: result, error } = await supabase
      .from('cognitive_games8')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Analytics
  async updateAnalytics(data: {
    total_focus_time?: number;
    total_break_time?: number;
    completed_tasks?: number;
    interruptions?: number;
    average_focus_score?: number;
    energy_correlation?: number;
    productivity_score?: number;
  }) {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: result, error } = await supabase
      .from('focus_analytics8')
      .upsert({
        date: today,
        ...data
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Queries
  async getTimerSessions(startDate: Date, endDate?: Date) {
    let query = supabase
      .from('focus_timer_sessions8')
      .select('*')
      .gte('started_at', startDate.toISOString());

    if (endDate) {
      query = query.lte('started_at', endDate.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getTaskBreakdowns(includeCompleted = false) {
    let query = supabase
      .from('focus_task_breakdowns8')
      .select('*');

    if (!includeCompleted) {
      query = query.lt('completed_steps', 'total_steps');
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getAnalytics(days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('focus_analytics8')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Distraction Blocking
  async getBlockedSites() {
    const { data, error } = await supabase
      .from('focus_blocked_sites8')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addBlockedSite(data: {
    domain: string;
  }) {
    const { data: result, error } = await supabase
      .from('focus_blocked_sites8')
      .insert({
        ...data,
        is_blocked: true,
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async removeBlockedSite(id: string) {
    const { error } = await supabase
      .from('focus_blocked_sites8')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateBlockedSite(id: string, data: {
    isBlocked: boolean;
  }) {
    const { data: result, error } = await supabase
      .from('focus_blocked_sites8')
      .update({ is_blocked: data.isBlocked })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async getBlockingSettings() {
    const { data, error } = await supabase
      .from('focus_blocking_settings8')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateBlockingSettings(data: {
    blockAds: boolean;
    blockSocialMedia: boolean;
    blockNotifications: boolean;
    allowlist: string[];
    scheduleEnabled: boolean;
    scheduleStart: string;
    scheduleEnd: string;
  }) {
    const { data: result, error } = await supabase
      .from('focus_blocking_settings8')
      .upsert({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Body Doubling
  async getSessionParticipants() {
    const { data, error } = await supabase
      .from('focus_body_doubling_participants8')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getBodyDoublingSettings() {
    const { data, error } = await supabase
      .from('focus_body_doubling_settings8')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async joinBodyDoublingSession(data: {
    taskDescription: string;
    videoEnabled: boolean;
    audioEnabled: boolean;
  }) {
    const { data: result, error } = await supabase
      .from('focus_body_doubling_participants8')
      .insert({
        ...data,
        is_host: false,
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async leaveBodyDoublingSession() {
    const { error } = await supabase
      .from('focus_body_doubling_participants8')
      .delete()
      .eq('user_id', auth.user()?.id);

    if (error) throw error;
  },

  async updateBodyDoublingSettings(data: {
    duration: number;
    taskDescription: string;
    allowChat: boolean;
    showTimer: boolean;
    breakReminders: boolean;
  }) {
    const { data: result, error } = await supabase
      .from('focus_body_doubling_settings8')
      .upsert({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  },
};
