
export interface MeditationSession {
  id: string;
  user_id: string;
  duration: number;
  type: MeditationType;
  completed_at: string;
  mood_before?: number;
  mood_after?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type MeditationType = 
  | 'mindfulness'
  | 'focused'
  | 'loving-kindness'
  | 'transcendental'
  | 'zen'
  | 'vipassana'
  | 'body-scan'
  | 'breath-awareness'
  | 'mantra'
  | 'guided'
  | 'sleep'
  | 'walking'
  | 'stress-relief';

export interface MeditationPreset {
  id: string;
  name: string;
  description: string;
  duration: number;
  type: MeditationType;
  background_sound?: string;
  guided_audio_url?: string;
  suitable_times: ('morning' | 'afternoon' | 'evening' | 'night')[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  total_sessions: number;
  total_minutes: number;
  current_streak: number;
  mood_improvement: number;
  created_at: string;
  updated_at: string;
}

export interface UserMeditationStats {
  total_sessions: number;
  total_minutes: number;
  current_streak: number;
  longest_streak: number;
  favorite_type: MeditationType;
  average_duration: number;
  mood_improvement: number;
  last_session_date?: string;
}
