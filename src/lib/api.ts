import { rpc } from './db';
import type { User } from '@supabase/supabase-js';

// Helper to get user ID from response
const getUserId = (user: User | null): string => {
  if (!user) throw new Error('User not authenticated');
  return user.id;
};

// Recipe management
export async function getRecipes(filters?: {
  category?: string;
  difficulty?: string;
  time?: number;
}) {
  const { data, error } = await rpc('get_recipes', filters);
  if (error) throw error;
  return data;
}

// Sleep tracking
export async function recordSleepMetrics(user: User | null, data: {
  duration: number;
  quality: number;
  notes?: string;
}) {
  const userId = getUserId(user);
  const { error } = await rpc('record_sleep_metrics', {
    user_id: userId,
    ...data
  });
  if (error) throw error;
}

// Nutrition logging
export async function recordNutritionLog(user: User | null, data: {
  meal_type: string;
  foods: string[];
  calories?: number;
  notes?: string;
}) {
  const userId = getUserId(user);
  const { error } = await rpc('record_nutrition_log', {
    user_id: userId,
    ...data
  });
  if (error) throw error;
}

// Mindfulness sessions
export async function recordMindfulnessSession(user: User | null, data: {
  duration: number;
  type: string;
  notes?: string;
}) {
  const userId = getUserId(user);
  const { error } = await rpc('record_mindfulness_session', {
    user_id: userId,
    ...data
  });
  if (error) throw error;
}

// Goals
export async function recordGoal(user: User | null, data: {
  title: string;
  description?: string;
  target_date?: string;
  category: string;
}) {
  const userId = getUserId(user);
  const { error } = await rpc('record_goal', {
    user_id: userId,
    ...data
  });
  if (error) throw error;
}

// Challenges
export async function getChallenges(filters?: {
  category?: string;
  difficulty?: string;
}) {
  const { data, error } = await rpc('get_challenges', filters);
  if (error) throw error;
  return data;
}

// Challenge participation
export async function joinChallenge(user: User | null, challengeId: string) {
  const userId = getUserId(user);
  const { error } = await rpc('join_challenge', {
    user_id: userId,
    challenge_id: challengeId
  });
  if (error) throw error;
}

// Wellness tips
export async function getWellnessTips(category?: string) {
  const { data, error } = await rpc('get_wellness_tips', { category });
  if (error) throw error;
  return data;
}

// Achievements
export async function recordAchievement(user: User | null, data: {
  title: string;
  description: string;
  points: number;
  category: string;
}) {
  const userId = getUserId(user);
  const { error } = await rpc('record_achievement', {
    user_id: userId,
    ...data
  });
  if (error) throw error;
}

// Progress tracking
export async function getProgress(user: User | null) {
  const userId = getUserId(user);
  const { data, error } = await rpc('get_progress', {
    user_id: userId
  });
  if (error) throw error;
  return data;
}

// Recommendations
export async function getRecommendations(user: User | null) {
  const userId = getUserId(user);
  const { data, error } = await rpc('get_recommendations', {
    user_id: userId
  });
  if (error) throw error;
  return data;
}

// Analytics
export async function getAnalytics(user: User | null, timeframe: string) {
  const userId = getUserId(user);
  const { data, error } = await rpc('get_analytics', {
    user_id: userId,
    timeframe
  });
  if (error) throw error;
  return data;
}

// Settings
export async function updateSettings(user: User | null, settings: Record<string, any>) {
  const userId = getUserId(user);
  const { error } = await rpc('update_settings', {
    user_id: userId,
    settings
  });
  if (error) throw error;
}

// Notifications
export async function getNotifications(user: User | null) {
  const userId = getUserId(user);
  const { data, error } = await rpc('get_notifications', {
    user_id: userId
  });
  if (error) throw error;
  return data;
}

// Mark notification as read
export async function markNotificationRead(user: User | null, notificationId: string) {
  const userId = getUserId(user);
  const { error } = await rpc('mark_notification_read', {
    user_id: userId,
    notification_id: notificationId
  });
  if (error) throw error;
}

// Get user preferences
export async function getUserPreferences(user: User | null) {
  const userId = getUserId(user);
  const { data, error } = await rpc('get_user_preferences', {
    user_id: userId
  });
  if (error) throw error;
  return data;
}

// Update user preferences
export async function updateUserPreferences(user: User | null, preferences: Record<string, any>) {
  const userId = getUserId(user);
  const { error } = await rpc('update_user_preferences', {
    user_id: userId,
    preferences
  });
  if (error) throw error;
}

// Mental health API for version 8
export const mentalHealthApi8 = {
  // Get mood entries for a given time period
  getMoodEntries8: async (userId: string, startDate: string, endDate: string) => {
    const { data, error } = await rpc('get_mood_entries8', {
      user_id: userId,
      start_date: startDate,
      end_date: endDate
    });
    return { data, error };
  },

  // Get anxiety entries for a given time period
  getAnxietyEntries8: async (userId: string, startDate: string, endDate: string) => {
    const { data, error } = await rpc('get_anxiety_entries8', {
      user_id: userId,
      start_date: startDate,
      end_date: endDate
    });
    return { data, error };
  },

  // Get all mindfulness sessions for a user
  getMindfulnessSessions8: async (userId: string) => {
    const { data, error } = await rpc('get_mindfulness_sessions8', {
      user_id: userId
    });
    return { data, error };
  },

  // Get all therapy goals for a user
  getTherapyGoals8: async (userId: string) => {
    const { data, error } = await rpc('get_therapy_goals8', {
      user_id: userId
    });
    return { data, error };
  },

  // Add a new mood entry
  addMoodEntry8: async (entry: {
    user_id: string,
    timestamp: string,
    mood_score: number,
    energy_level: number,
    activities: string[],
    triggers: string[],
    notes?: string
  }) => {
    const { data, error } = await rpc('add_mood_entry8', entry);
    return { data, error };
  },

  // Add a new mindfulness session
  addMindfulnessSession8: async (session: {
    user_id: string,
    timestamp: string,
    session_type: 'meditation' | 'breathing' | 'body_scan' | 'visualization' | 'grounding',
    duration_minutes: number,
    focus_quality: number,
    calm_level_before: number,
    calm_level_after: number,
    notes?: string
  }) => {
    const { data, error } = await rpc('add_mindfulness_session8', session);
    return { data, error };
  },

  // Add a new anxiety entry
  addAnxietyEntry8: async (entry: {
    user_id: string,
    timestamp: string,
    anxiety_level: number,
    physical_symptoms: string[],
    triggers: string[],
    coping_strategies: string[],
    effectiveness_score: number,
    notes?: string
  }) => {
    const { data, error } = await rpc('add_anxiety_entry8', entry);
    return { data, error };
  },

  // Add a new therapy goal
  addTherapyGoal8: async (goal: {
    user_id: string,
    goal_type: 'mood' | 'anxiety' | 'depression' | 'ocd' | 'mindfulness' | 'general',
    title: string,
    description?: string,
    target_date?: string,
    progress: number,
    status: 'not_started' | 'in_progress' | 'completed' | 'on_hold',
    notes?: string
  }) => {
    const { data, error } = await rpc('add_therapy_goal8', goal);
    return { data, error };
  },

  // Update therapy goal progress
  updateGoalProgress8: async (goalId: string, progress: number) => {
    const { data, error } = await rpc('update_goal_progress8', {
      goal_id: goalId,
      progress
    });
    return { data, error };
  }
};
