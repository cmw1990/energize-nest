-- Enhanced Meditation Sessions
ALTER TABLE mindfulness_sessions
ADD COLUMN IF NOT EXISTS environment_rating INTEGER CHECK (environment_rating BETWEEN 1 AND 10),
ADD COLUMN IF NOT EXISTS distractions TEXT[],
ADD COLUMN IF NOT EXISTS techniques_used TEXT[],
ADD COLUMN IF NOT EXISTS intentions TEXT[],
ADD COLUMN IF NOT EXISTS insights TEXT;

-- Guided Programs
CREATE TABLE IF NOT EXISTS mindfulness_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('meditation', 'breathing', 'stress_relief', 'sleep', 'focus')),
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration_days INTEGER,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Program Sessions
CREATE TABLE IF NOT EXISTS program_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES mindfulness_programs(id),
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    order_in_program INTEGER,
    audio_url TEXT,
    transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- User Progress
CREATE TABLE IF NOT EXISTS mindfulness_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES mindfulness_programs(id),
    session_id UUID REFERENCES program_sessions(id),
    completed_at TIMESTAMPTZ,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Mood Tracking
CREATE TABLE IF NOT EXISTS mood_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 10),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    anxiety_level INTEGER CHECK (anxiety_level BETWEEN 1 AND 10),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    emotions TEXT[],
    activities TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Gratitude Journal
CREATE TABLE IF NOT EXISTS gratitude_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    entries TEXT[],
    category TEXT CHECK (category IN ('people', 'experiences', 'things', 'personal', 'other')),
    mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 10),
    mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 10),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Breathing Exercises
CREATE TABLE IF NOT EXISTS breathing_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    pattern TEXT NOT NULL,
    duration_minutes INTEGER,
    benefits TEXT[],
    contraindications TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- User Breathing Sessions
CREATE TABLE IF NOT EXISTS breathing_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES breathing_exercises(id),
    duration_minutes INTEGER,
    completed_cycles INTEGER,
    heart_rate_before INTEGER,
    heart_rate_after INTEGER,
    stress_level_before INTEGER CHECK (stress_level_before BETWEEN 1 AND 10),
    stress_level_after INTEGER CHECK (stress_level_after BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Focus Sessions
CREATE TABLE IF NOT EXISTS focus_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    task_description TEXT,
    planned_duration_minutes INTEGER,
    actual_duration_minutes INTEGER,
    focus_score INTEGER CHECK (focus_score BETWEEN 1 AND 10),
    distractions_count INTEGER DEFAULT 0,
    environment TEXT,
    techniques_used TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE mindfulness_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mindfulness_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gratitude_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE breathing_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE breathing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view mindfulness programs"
    ON mindfulness_programs FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view program sessions"
    ON program_sessions FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own mindfulness progress"
    ON mindfulness_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own mood entries"
    ON mood_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own gratitude entries"
    ON gratitude_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view breathing exercises"
    ON breathing_exercises FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own breathing sessions"
    ON breathing_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own focus sessions"
    ON focus_sessions FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_mindfulness_progress_user ON mindfulness_progress(user_id);
CREATE INDEX idx_mood_entries_user ON mood_entries(user_id);
CREATE INDEX idx_gratitude_entries_user ON gratitude_entries(user_id);
CREATE INDEX idx_breathing_sessions_user ON breathing_sessions(user_id);
CREATE INDEX idx_focus_sessions_user ON focus_sessions(user_id);
