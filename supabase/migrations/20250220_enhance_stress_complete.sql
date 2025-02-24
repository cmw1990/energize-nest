-- Guided Meditations
CREATE TABLE IF NOT EXISTS meditation_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT CHECK (category IN ('stress_relief', 'focus', 'sleep', 'anxiety', 'energy', 'motivation')),
    duration_minutes INTEGER,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    guide_name TEXT,
    audio_url TEXT,
    background_sound_url TEXT,
    transcript TEXT,
    benefits TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Emotional Check-ins
CREATE TABLE IF NOT EXISTS emotion_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    emotion_type TEXT NOT NULL,
    intensity INTEGER CHECK (intensity BETWEEN 1 AND 10),
    triggers TEXT[],
    physical_sensations TEXT[],
    coping_strategies_used TEXT[],
    effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 10),
    energy_impact INTEGER CHECK (energy_impact BETWEEN -5 AND 5),
    recorded_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Stress Response Patterns
CREATE TABLE IF NOT EXISTS stress_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pattern_name TEXT NOT NULL,
    triggers JSONB,
    physical_responses JSONB,
    emotional_responses JSONB,
    behavioral_responses JSONB,
    energy_drain_rate INTEGER CHECK (energy_drain_rate BETWEEN 1 AND 10),
    recovery_strategies TEXT[],
    prevention_strategies TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Recovery Activities Library
CREATE TABLE IF NOT EXISTS recovery_activities_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_name TEXT NOT NULL,
    category TEXT CHECK (category IN ('physical', 'mental', 'social', 'creative', 'nature')),
    duration_minutes INTEGER,
    energy_restoration INTEGER CHECK (energy_restoration BETWEEN 1 AND 10),
    stress_reduction INTEGER CHECK (stress_reduction BETWEEN 1 AND 10),
    scientific_evidence TEXT,
    recommended_frequency TEXT,
    contraindications TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Mindfulness Exercises
CREATE TABLE IF NOT EXISTS mindfulness_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('body_scan', 'visualization', 'grounding', 'loving_kindness', 'mindful_movement')),
    duration_minutes INTEGER,
    instructions TEXT,
    benefits TEXT[],
    energy_impact INTEGER CHECK (energy_impact BETWEEN -5 AND 5),
    audio_guidance_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Recovery Protocols
CREATE TABLE IF NOT EXISTS recovery_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    protocol_name TEXT NOT NULL,
    trigger_condition TEXT CHECK (trigger_condition IN ('high_stress', 'low_energy', 'poor_sleep', 'intense_workout', 'emotional_event')),
    activities JSONB,
    duration_minutes INTEGER,
    effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 10),
    energy_restoration INTEGER CHECK (energy_restoration BETWEEN 1 AND 10),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Biofeedback Sessions
CREATE TABLE IF NOT EXISTS biofeedback_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type TEXT CHECK (session_type IN ('hrv', 'breathing', 'temperature', 'muscle_tension', 'eeg')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    measurements JSONB,
    baseline_values JSONB,
    improvements JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Energy Recovery Tracking
CREATE TABLE IF NOT EXISTS energy_recovery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date_recorded DATE NOT NULL,
    starting_energy INTEGER CHECK (starting_energy BETWEEN 1 AND 100),
    ending_energy INTEGER CHECK (ending_energy BETWEEN 1 AND 100),
    recovery_activities JSONB,
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    nutrition_quality INTEGER CHECK (nutrition_quality BETWEEN 1 AND 10),
    recovery_score INTEGER CHECK (recovery_score BETWEEN 1 AND 100),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Stress Reduction Games
CREATE TABLE IF NOT EXISTS stress_games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_name TEXT NOT NULL,
    category TEXT CHECK (category IN ('breathing', 'focus', 'meditation', 'visualization')),
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration_minutes INTEGER,
    stress_reduction_score INTEGER CHECK (stress_reduction_score BETWEEN 1 AND 10),
    energy_impact INTEGER CHECK (energy_impact BETWEEN -5 AND 5),
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Recovery Challenges
CREATE TABLE IF NOT EXISTS recovery_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER,
    activities JSONB,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    benefits TEXT[],
    points_available INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE meditation_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE stress_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_activities_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE mindfulness_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE biofeedback_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_recovery ENABLE ROW LEVEL SECURITY;
ALTER TABLE stress_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_challenges ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view meditation content"
    ON meditation_content FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own emotion tracking"
    ON emotion_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own stress patterns"
    ON stress_patterns FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view recovery activities library"
    ON recovery_activities_library FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view mindfulness exercises"
    ON mindfulness_exercises FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own recovery protocols"
    ON recovery_protocols FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own biofeedback sessions"
    ON biofeedback_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own energy recovery"
    ON energy_recovery FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view stress games"
    ON stress_games FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view recovery challenges"
    ON recovery_challenges FOR SELECT
    USING (true);

-- Create indexes
CREATE INDEX idx_emotion_tracking_user ON emotion_tracking(user_id);
CREATE INDEX idx_stress_patterns_user ON stress_patterns(user_id);
CREATE INDEX idx_recovery_protocols_user ON recovery_protocols(user_id);
CREATE INDEX idx_biofeedback_sessions_user ON biofeedback_sessions(user_id);
CREATE INDEX idx_energy_recovery_user ON energy_recovery(user_id);
