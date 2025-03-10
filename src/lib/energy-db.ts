import { SUPABASE_URL, SUPABASE_KEY } from '@/integrations/supabase/db-client';
import type { User } from '@supabase/supabase-js';

// Helper to get user ID from response
const getUserId = (user: User | null): string => {
  if (!user) throw new Error('User not authenticated');
  return user.id;
};

// Helper for making Supabase REST API calls
const supabaseRestCall = async (endpoint: string, options: RequestInit = {}, session?: { access_token: string } | null) => {
  const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${session?.access_token || SUPABASE_KEY}`,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || response.statusText);
  }

  return await response.json();
};

// Record energy level
export async function recordEnergyLevel(user: User | null, data: {
  level: number;
  mood: string;
  activities: string[];
  notes?: string;
}, session?: { access_token: string } | null) {
  const userId = getUserId(user);
  try {
    await supabaseRestCall('/rest/v1/energy_tracking8', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        ...data,
        timestamp: new Date().toISOString()
      })
    }, session);
  } catch (error) {
    console.error('Error recording energy level:', error);
    throw error;
  }
}

// Set energy goals
export async function setEnergyGoals(user: User | null, data: {
  target_level: number;
  daily_activities: string[];
  rest_periods: number;
  sleep_hours: number;
}, session?: { access_token: string } | null) {
  const userId = getUserId(user);
  try {
    await supabaseRestCall('/rest/v1/energy_goals8', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        ...data,
        created_at: new Date().toISOString()
      })
    }, session);
  } catch (error) {
    console.error('Error setting energy goals:', error);
    throw error;
  }
}

// Get energy history
export async function getEnergyHistory(user: User | null, startDate?: string, endDate?: string, session?: { access_token: string } | null) {
  const userId = getUserId(user);
  try {
    let url = `/rest/v1/energy_tracking8?user_id=eq.${userId}&order=timestamp.desc`;
    if (startDate) url += `&timestamp=gte.${startDate}`;
    if (endDate) url += `&timestamp=lte.${endDate}`;
    
    return await supabaseRestCall(url, {}, session);
  } catch (error) {
    console.error('Error getting energy history:', error);
    throw error;
  }
}

// Get energy goals
export async function getEnergyGoals(user: User | null, session?: { access_token: string } | null) {
  const userId = getUserId(user);
  try {
    return await supabaseRestCall(
      `/rest/v1/energy_goals8?user_id=eq.${userId}&order=created_at.desc&limit=1`,
      {},
      session
    );
  } catch (error) {
    console.error('Error getting energy goals:', error);
    throw error;
  }
}

// Get energy analytics
export async function getEnergyAnalytics(user: User | null, timeframe: string, session?: { access_token: string } | null) {
  const userId = getUserId(user);
  try {
    return await supabaseRestCall('/rest/v1/rpc/get_energy_analytics', {
      method: 'POST',
      body: JSON.stringify({
        p_user_id: userId,
        p_timeframe: timeframe
      })
    }, session);
  } catch (error) {
    console.error('Error getting energy analytics:', error);
    throw error;
  }
}

// Update energy goals
export async function updateEnergyGoals(user: User | null, goalId: string, updates: {
  target_level?: number;
  daily_activities?: string[];
  rest_periods?: number;
  sleep_hours?: number;
}, session?: { access_token: string } | null) {
  const userId = getUserId(user);
  try {
    await supabaseRestCall(`/rest/v1/energy_goals8?id=eq.${goalId}&user_id=eq.${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...updates,
        updated_at: new Date().toISOString()
      })
    }, session);
  } catch (error) {
    console.error('Error updating energy goals:', error);
    throw error;
  }
}

// Delete energy goals
export async function deleteEnergyGoals(user: User | null, goalId: string, session?: { access_token: string } | null) {
  const userId = getUserId(user);
  try {
    await supabaseRestCall(`/rest/v1/energy_goals8?id=eq.${goalId}&user_id=eq.${userId}`, {
      method: 'DELETE'
    }, session);
  } catch (error) {
    console.error('Error deleting energy goals:', error);
    throw error;
  }
}

// Record focus session
export async function recordFocusSession(user: User | null, data: {
  duration: number;
  task_type: string;
  productivity_rating: number;
  distractions: string[];
  notes?: string;
}, session?: { access_token: string } | null) {
  const userId = getUserId(user);
  try {
    await supabaseRestCall('/rest/v1/focus_sessions8', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        ...data,
        timestamp: new Date().toISOString()
      })
    }, session);
  } catch (error) {
    console.error('Error recording focus session:', error);
    throw error;
  }
}

// Get focus history
export async function getFocusHistory(user: User | null, startDate?: string, endDate?: string, session?: { access_token: string } | null) {
  const userId = getUserId(user);
  try {
    let url = `/rest/v1/focus_sessions8?user_id=eq.${userId}&order=timestamp.desc`;
    if (startDate) url += `&timestamp=gte.${startDate}`;
    if (endDate) url += `&timestamp=lte.${endDate}`;
    
    return await supabaseRestCall(url, {}, session);
  } catch (error) {
    console.error('Error getting focus history:', error);
    throw error;
  }
} 