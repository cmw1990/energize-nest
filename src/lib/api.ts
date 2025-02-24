import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];

export type EnergyMetric = Tables['energy_metrics']['Row'];
export type Activity = Tables['activities']['Row'];
export type Recipe = Tables['recipes']['Row'];
export type UserPreferences = Tables['user_preferences']['Row'];
export type ConsultationRequest = Tables['consultation_requests']['Row'];

// Enhanced Wellness Types
export interface SleepMetrics {
  id: string;
  user_id: string;
  duration_minutes: number;
  quality: number;
  start_time: string;
  end_time: string;
  deep_sleep_minutes?: number;
  rem_sleep_minutes?: number;
  interruptions: number;
  notes?: string;
  created_at: string;
}

export interface NutritionLog {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: string[];
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fats_grams: number;
  water_ml: number;
  timestamp: string;
  energy_impact: number;
  notes?: string;
  created_at: string;
}

export interface MindfulnessSession {
  id: string;
  user_id: string;
  type: 'meditation' | 'breathing' | 'yoga' | 'journaling' | 'gratitude';
  duration_minutes: number;
  focus_level: number;
  mood_before: string;
  mood_after: string;
  notes?: string;
  timestamp: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  category: 'energy' | 'sleep' | 'nutrition' | 'mindfulness' | 'fitness';
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'completed' | 'abandoned';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'energy' | 'sleep' | 'nutrition' | 'mindfulness' | 'fitness';
  duration_days: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  status: 'active' | 'completed' | 'abandoned';
  progress: number;
  points_earned: number;
  created_at: string;
  updated_at: string;
}

export interface WellnessTip {
  id: string;
  category: 'energy' | 'sleep' | 'nutrition' | 'mindfulness' | 'fitness';
  title: string;
  content: string;
  source?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'energy' | 'sleep' | 'nutrition' | 'mindfulness' | 'fitness';
  points: number;
  achieved_at: string;
  created_at: string;
}

// Energy Metrics
export async function getEnergyMetrics(userId: string) {
  const { data, error } = await supabase
    .from('energy_metrics')
    .select('*')
    .eq('userId', userId)
    .order('timestamp', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data as EnergyMetric[];
}

export async function addEnergyMetric(metric: Omit<EnergyMetric, 'id'>) {
  const { data, error } = await supabase
    .from('energy_metrics')
    .insert([metric])
    .select()
    .single();

  if (error) throw error;
  return data as EnergyMetric;
}

// Activities
export async function getActivities(userId: string) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('userId', userId)
    .order('timestamp', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data as Activity[];
}

export async function addActivity(activity: Omit<Activity, 'id'>) {
  const { data, error } = await supabase
    .from('activities')
    .insert([activity])
    .select()
    .single();

  if (error) throw error;
  return data as Activity;
}

// Recipes
export async function getRecipes(query?: string) {
  let request = supabase.from('recipes').select('*');
  
  if (query) {
    request = request.textSearch('title', query);
  }

  const { data, error } = await request.limit(20);

  if (error) throw error;
  return data as Recipe[];
}

export async function getRecipeById(id: string) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Recipe;
}

// User Preferences
export async function getUserPreferences(userId: string) {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('userId', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateUserPreferences(userId: string, preferences: Partial<UserPreferences>) {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({ userId, ...preferences })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Analytics
export async function getEnergyTrends(userId: string, days: number = 30) {
  const { data, error } = await supabase
    .from('energy_metrics')
    .select('*')
    .eq('userId', userId)
    .gte('timestamp', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
    .order('timestamp', { ascending: true });

  if (error) throw error;
  return data as EnergyMetric[];
}

// Consultation
export async function requestConsultation(request: Omit<ConsultationRequest, 'id' | 'status'>) {
  const { data, error } = await supabase
    .from('consultation_requests')
    .insert([{ ...request, status: 'pending' }])
    .select()
    .single();

  if (error) throw error;
  return data as ConsultationRequest;
}

export async function getConsultationRequests(userId: string) {
  const { data, error } = await supabase
    .from('consultation_requests')
    .select('*')
    .eq('userId', userId)
    .order('preferredDate', { ascending: true });

  if (error) throw error;
  return data as ConsultationRequest[];
}

// Enhanced Wellness API Functions
export const api = {
  // Sleep Metrics
  getSleepMetrics: async (userId: string, startDate?: string, endDate?: string) => {
    const query = supabase
      .from('sleep_metrics')
      .select('*')
      .eq('user_id', userId);
    
    if (startDate) query.gte('start_time', startDate);
    if (endDate) query.lte('end_time', endDate);
    
    return await query.order('start_time', { ascending: false });
  },
  
  addSleepMetrics: async (data: Omit<SleepMetrics, 'id' | 'created_at'>) => {
    return await supabase.from('sleep_metrics').insert(data);
  },

  // Nutrition Logs
  getNutritionLogs: async (userId: string, date?: string) => {
    const query = supabase
      .from('nutrition_logs')
      .select('*')
      .eq('user_id', userId);
    
    if (date) query.eq('timestamp::date', date);
    
    return await query.order('timestamp', { ascending: false });
  },
  
  addNutritionLog: async (data: Omit<NutritionLog, 'id' | 'created_at'>) => {
    return await supabase.from('nutrition_logs').insert(data);
  },

  // Mindfulness Sessions
  getMindfulnessSessions: async (userId: string, type?: MindfulnessSession['type']) => {
    const query = supabase
      .from('mindfulness_sessions')
      .select('*')
      .eq('user_id', userId);
    
    if (type) query.eq('type', type);
    
    return await query.order('timestamp', { ascending: false });
  },
  
  addMindfulnessSession: async (data: Omit<MindfulnessSession, 'id' | 'created_at'>) => {
    return await supabase.from('mindfulness_sessions').insert(data);
  },

  // Goals
  getGoals: async (userId: string, status?: Goal['status']) => {
    const query = supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId);
    
    if (status) query.eq('status', status);
    
    return await query.order('created_at', { ascending: false });
  },
  
  addGoal: async (data: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) => {
    return await supabase.from('goals').insert(data);
  },
  
  updateGoal: async (goalId: string, data: Partial<Goal>) => {
    return await supabase
      .from('goals')
      .update(data)
      .eq('id', goalId);
  },

  // Challenges
  getChallenges: async (category?: Challenge['category'], difficulty?: Challenge['difficulty']) => {
    const query = supabase.from('challenges').select('*');
    
    if (category) query.eq('category', category);
    if (difficulty) query.eq('difficulty', difficulty);
    
    return await query.order('start_date', { ascending: true });
  },
  
  getUserChallenges: async (userId: string, status?: UserChallenge['status']) => {
    const query = supabase
      .from('user_challenges')
      .select(`
        *,
        challenge:challenges(*)
      `)
      .eq('user_id', userId);
    
    if (status) query.eq('status', status);
    
    return await query.order('created_at', { ascending: false });
  },
  
  joinChallenge: async (userId: string, challengeId: string) => {
    return await supabase.from('user_challenges').insert({
      user_id: userId,
      challenge_id: challengeId,
      status: 'active',
      progress: 0,
      points_earned: 0
    });
  },
  
  updateChallengeProgress: async (userChallengeId: string, progress: number, pointsEarned: number) => {
    return await supabase
      .from('user_challenges')
      .update({ progress, points_earned: pointsEarned })
      .eq('id', userChallengeId);
  },

  // Wellness Tips
  getWellnessTips: async (category?: WellnessTip['category'], difficulty?: WellnessTip['difficulty']) => {
    const query = supabase.from('wellness_tips').select('*');
    
    if (category) query.eq('category', category);
    if (difficulty) query.eq('difficulty', difficulty);
    
    return await query.order('created_at', { ascending: false });
  },

  // Achievements
  getAchievements: async (userId: string) => {
    return await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('achieved_at', { ascending: false });
  },
  
  unlockAchievement: async (data: Omit<Achievement, 'id' | 'created_at'>) => {
    return await supabase.from('user_achievements').insert(data);
  },

  // Analytics and Insights
  getEnergyInsights: async (userId: string, startDate: string, endDate: string) => {
    const [energyMetrics, activities, nutrition] = await Promise.all([
      supabase
        .from('energy_metrics')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', startDate)
        .lte('timestamp', endDate),
      supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', startDate)
        .lte('timestamp', endDate),
      supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', startDate)
        .lte('timestamp', endDate)
    ]);

    return {
      energyMetrics: energyMetrics.data,
      activities: activities.data,
      nutrition: nutrition.data
    };
  },

  getSleepInsights: async (userId: string, days: number) => {
    const endDate = new Date().toISOString();
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    return await supabase
      .from('sleep_metrics')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', startDate)
      .lte('end_time', endDate)
      .order('start_time', { ascending: true });
  },

  getMindfulnessInsights: async (userId: string, days: number) => {
    const endDate = new Date().toISOString();
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    return await supabase
      .from('mindfulness_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', startDate)
      .lte('timestamp', endDate)
      .order('timestamp', { ascending: true });
  }
};

// Well-Charged API Functions for Tables with "8" Suffix
export const api8 = {
  // Sleep Records
  async getSleepRecords8(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('sleep_records8')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    return await query;
  },

  async addSleepRecord8(data: Omit<SleepRecord8, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase.from('sleep_records8').insert([data]);
  },

  // Exercise Sessions
  async getExerciseSessions8(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('exercise_sessions8')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);

    return await query;
  },

  async addExerciseSession8(data: Omit<ExerciseSession8, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase.from('exercise_sessions8').insert([data]);
  },

  // Focus Sessions
  async getFocusSessions8(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('focus_sessions8')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: false });

    if (startDate) query = query.gte('start_time', startDate);
    if (endDate) query = query.lte('end_time', endDate);

    return await query;
  },

  async addFocusSession8(data: Omit<FocusSession8, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase.from('focus_sessions8').insert([data]);
  },

  // Mental Health
  async getMentalHealthRecords8(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('mental_health8')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    return await query;
  },

  async addMentalHealthRecord8(data: Omit<MentalHealth8, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase.from('mental_health8').insert([data]);
  },

  // Analytics
  async getWellnessInsights8(userId: string, startDate: string, endDate: string) {
    const [sleepData, exerciseData, focusData, mentalHealthData] = await Promise.all([
      this.getSleepRecords8(userId, startDate, endDate),
      this.getExerciseSessions8(userId, startDate, endDate),
      this.getFocusSessions8(userId, startDate, endDate),
      this.getMentalHealthRecords8(userId, startDate, endDate)
    ]);

    return {
      sleep: {
        records: sleepData.data || [],
        averageQuality: sleepData.data?.reduce((acc, curr) => acc + curr.quality, 0) / (sleepData.data?.length || 1),
        averageDuration: sleepData.data?.reduce((acc, curr) => acc + curr.duration, 0) / (sleepData.data?.length || 1)
      },
      exercise: {
        sessions: exerciseData.data || [],
        totalCalories: exerciseData.data?.reduce((acc, curr) => acc + curr.calories, 0),
        averageIntensity: exerciseData.data?.reduce((acc, curr) => acc + curr.intensity, 0) / (exerciseData.data?.length || 1)
      },
      focus: {
        sessions: focusData.data || [],
        totalDuration: focusData.data?.reduce((acc, curr) => {
          const start = new Date(curr.start_time);
          const end = new Date(curr.end_time);
          return acc + (end.getTime() - start.getTime()) / (1000 * 60); // minutes
        }, 0),
        averageScore: focusData.data?.reduce((acc, curr) => acc + curr.score, 0) / (focusData.data?.length || 1)
      },
      mentalHealth: {
        records: mentalHealthData.data || [],
        averageMood: mentalHealthData.data?.reduce((acc, curr) => acc + curr.mood, 0) / (mentalHealthData.data?.length || 1),
        averageAnxiety: mentalHealthData.data?.reduce((acc, curr) => acc + curr.anxiety_level, 0) / (mentalHealthData.data?.length || 1),
        averageStress: mentalHealthData.data?.reduce((acc, curr) => acc + curr.stress_level, 0) / (mentalHealthData.data?.length || 1),
        totalMeditation: mentalHealthData.data?.reduce((acc, curr) => acc + (curr.meditation_minutes || 0), 0)
      }
    };
  }
};

// Mental Health API Functions (with "8" suffix)
export const mentalHealthApi8 = {
  // Mood Tracking
  async getMoodEntries8(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('mood_tracking8')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (startDate) query = query.gte('timestamp', startDate);
    if (endDate) query = query.lte('timestamp', endDate);

    return await query;
  },

  async addMoodEntry8(data: Omit<MoodTracking8, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase.from('mood_tracking8').insert([data]);
  },

  // Anxiety Tracking
  async getAnxietyEntries8(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('anxiety_tracking8')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (startDate) query = query.gte('timestamp', startDate);
    if (endDate) query = query.lte('timestamp', endDate);

    return await query;
  },

  async addAnxietyEntry8(data: Omit<AnxietyTracking8, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase.from('anxiety_tracking8').insert([data]);
  },

  // Depression Monitoring
  async getDepressionEntries8(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('depression_monitoring8')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (startDate) query = query.gte('timestamp', startDate);
    if (endDate) query = query.lte('timestamp', endDate);

    return await query;
  },

  async addDepressionEntry8(data: Omit<DepressionMonitoring8, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase.from('depression_monitoring8').insert([data]);
  },

  // OCD Management
  async getOCDEntries8(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('ocd_management8')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (startDate) query = query.gte('timestamp', startDate);
    if (endDate) query = query.lte('timestamp', endDate);

    return await query;
  },

  async addOCDEntry8(data: Omit<OCDManagement8, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase.from('ocd_management8').insert([data]);
  },

  // Mindfulness Sessions
  async getMindfulnessSessions8(userId: string, sessionType?: MindfulnessSession8['session_type']) {
    let query = supabase
      .from('mindfulness_sessions8')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (sessionType) query = query.eq('session_type', sessionType);

    return await query;
  },

  async addMindfulnessSession8(data: Omit<MindfulnessSession8, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase.from('mindfulness_sessions8').insert([data]);
  },

  // Therapy Goals
  async getTherapyGoals8(userId: string, status?: TherapyGoal8['status']) {
    let query = supabase
      .from('therapy_goals8')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    return await query;
  },

  async addTherapyGoal8(data: Omit<TherapyGoal8, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase.from('therapy_goals8').insert([data]);
  },

  async updateTherapyGoal8(goalId: string, data: Partial<TherapyGoal8>) {
    return await supabase
      .from('therapy_goals8')
      .update(data)
      .eq('id', goalId);
  },

  // Coping Strategies
  async getCopingStrategies8(userId: string, category?: CopingStrategy8['category']) {
    let query = supabase
      .from('coping_strategies8')
      .select('*')
      .eq('user_id', userId)
      .order('effectiveness_score', { ascending: false });

    if (category) query = query.eq('category', category);

    return await query;
  },

  async addCopingStrategy8(data: Omit<CopingStrategy8, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase.from('coping_strategies8').insert([data]);
  },

  async updateCopingStrategy8(strategyId: string, data: Partial<CopingStrategy8>) {
    return await supabase
      .from('coping_strategies8')
      .update(data)
      .eq('id', strategyId);
  },

  // Mental Health Analytics
  async getMentalHealthInsights8(userId: string, startDate: string, endDate: string) {
    const [moodData, anxietyData, depressionData, ocdData, mindfulnessData] = await Promise.all([
      this.getMoodEntries8(userId, startDate, endDate),
      this.getAnxietyEntries8(userId, startDate, endDate),
      this.getDepressionEntries8(userId, startDate, endDate),
      this.getOCDEntries8(userId, startDate, endDate),
      this.getMindfulnessSessions8(userId)
    ]);

    return {
      mood: {
        entries: moodData.data || [],
        averageMood: moodData.data?.reduce((acc, curr) => acc + curr.mood_score, 0) / (moodData.data?.length || 1),
        averageEnergy: moodData.data?.reduce((acc, curr) => acc + curr.energy_level, 0) / (moodData.data?.length || 1),
        commonTriggers: this.analyzeArrayField(moodData.data || [], 'triggers'),
        commonActivities: this.analyzeArrayField(moodData.data || [], 'activities')
      },
      anxiety: {
        entries: anxietyData.data || [],
        averageLevel: anxietyData.data?.reduce((acc, curr) => acc + curr.anxiety_level, 0) / (anxietyData.data?.length || 1),
        commonSymptoms: this.analyzeArrayField(anxietyData.data || [], 'physical_symptoms'),
        effectiveStrategies: this.analyzeArrayField(anxietyData.data || [], 'coping_strategies')
      },
      depression: {
        entries: depressionData.data || [],
        averageMood: depressionData.data?.reduce((acc, curr) => acc + curr.mood_score, 0) / (depressionData.data?.length || 1),
        averageSleep: depressionData.data?.reduce((acc, curr) => acc + curr.sleep_quality, 0) / (depressionData.data?.length || 1),
        averageEnergy: depressionData.data?.reduce((acc, curr) => acc + curr.energy_level, 0) / (depressionData.data?.length || 1),
        socialInteraction: depressionData.data?.reduce((acc, curr) => acc + curr.social_interaction_level, 0) / (depressionData.data?.length || 1)
      },
      ocd: {
        entries: ocdData.data || [],
        averageObsession: ocdData.data?.reduce((acc, curr) => acc + curr.obsession_intensity, 0) / (ocdData.data?.length || 1),
        averageCompulsion: ocdData.data?.reduce((acc, curr) => acc + curr.compulsion_intensity, 0) / (ocdData.data?.length || 1),
        averageResistance: ocdData.data?.reduce((acc, curr) => acc + curr.resistance_level, 0) / (ocdData.data?.length || 1),
        commonTriggers: this.analyzeArrayField(ocdData.data || [], 'trigger_type')
      },
      mindfulness: {
        sessions: mindfulnessData.data || [],
        totalMinutes: mindfulnessData.data?.reduce((acc, curr) => acc + curr.duration_minutes, 0) || 0,
        averageImprovement: mindfulnessData.data?.reduce((acc, curr) => acc + (curr.calm_level_after - curr.calm_level_before), 0) / (mindfulnessData.data?.length || 1)
      }
    };
  },

  // Helper function to analyze array fields
  private analyzeArrayField(data: any[], field: string): { [key: string]: number } {
    const frequency: { [key: string]: number } = {};
    data.forEach(item => {
      if (Array.isArray(item[field])) {
        item[field].forEach((value: string) => {
          frequency[value] = (frequency[value] || 0) + 1;
        });
      } else if (typeof item[field] === 'string') {
        frequency[item[field]] = (frequency[item[field]] || 0) + 1;
      }
    });
    return frequency;
  }
};
