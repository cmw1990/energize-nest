-- Sleep Sessions
CREATE TABLE IF NOT EXISTS sleep_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    total_duration_minutes INTEGER,
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    energy_level_next_day INTEGER CHECK (energy_level_next_day BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Sleep Stages
CREATE TABLE IF NOT EXISTS sleep_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sleep_sessions(id) ON DELETE CASCADE,
    stage_type TEXT CHECK (stage_type IN ('light', 'deep', 'rem', 'awake')),
    start_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Sleep Environment
CREATE TABLE IF NOT EXISTS sleep_environment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sleep_sessions(id) ON DELETE CASCADE,
    temperature_celsius DECIMAL(4,1),
    humidity_percent INTEGER CHECK (humidity_percent BETWEEN 0 AND 100),
    noise_level TEXT CHECK (noise_level IN ('silent', 'quiet', 'moderate', 'loud')),
    light_level TEXT CHECK (light_level IN ('dark', 'dim', 'moderate', 'bright')),
    bed_comfort INTEGER CHECK (bed_comfort BETWEEN 1 AND 10),
    air_quality TEXT CHECK (air_quality IN ('poor', 'moderate', 'good', 'excellent')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Sleep Factors
CREATE TABLE IF NOT EXISTS sleep_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sleep_sessions(id) ON DELETE CASCADE,
    caffeine_intake_mg INTEGER,
    last_meal_time TIMESTAMPTZ,
    exercise_before_bed BOOLEAN,
    screen_time_before_bed_minutes INTEGER,
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    alcohol_consumed BOOLEAN,
    medication_taken TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Sleep Goals
CREATE TABLE IF NOT EXISTS sleep_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_bedtime TIME,
    target_wake_time TIME,
    target_duration_minutes INTEGER,
    target_quality INTEGER CHECK (target_quality BETWEEN 1 AND 10),
    start_date DATE,
    end_date DATE,
    status TEXT CHECK (status IN ('active', 'completed', 'abandoned')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sleep Routines
CREATE TABLE IF NOT EXISTS sleep_routines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    routine_type TEXT CHECK (routine_type IN ('morning', 'evening')),
    activities JSONB,
    duration_minutes INTEGER,
    effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 10),
    energy_impact INTEGER CHECK (energy_impact BETWEEN -5 AND 5),
    mood_impact INTEGER CHECK (mood_impact BETWEEN -5 AND 5),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sleep Analytics
CREATE TABLE IF NOT EXISTS sleep_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date_recorded DATE NOT NULL,
    average_duration_minutes INTEGER,
    average_quality DECIMAL(3,1),
    deep_sleep_percentage DECIMAL(4,1),
    rem_sleep_percentage DECIMAL(4,1),
    interruptions_count INTEGER,
    sleep_debt_minutes INTEGER,
    recovery_score INTEGER CHECK (recovery_score BETWEEN 1 AND 100),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE sleep_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_environment ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own sleep sessions"
    ON sleep_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view sleep stages for their sessions"
    ON sleep_stages FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM sleep_sessions
        WHERE sleep_sessions.id = sleep_stages.session_id
        AND sleep_sessions.user_id = auth.uid()
    ));

CREATE POLICY "Users can view sleep environment for their sessions"
    ON sleep_environment FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM sleep_sessions
        WHERE sleep_sessions.id = sleep_environment.session_id
        AND sleep_sessions.user_id = auth.uid()
    ));

CREATE POLICY "Users can view sleep factors for their sessions"
    ON sleep_factors FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM sleep_sessions
        WHERE sleep_sessions.id = sleep_factors.session_id
        AND sleep_sessions.user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own sleep goals"
    ON sleep_goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sleep routines"
    ON sleep_routines FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sleep analytics"
    ON sleep_analytics FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_sleep_sessions_user ON sleep_sessions(user_id);
CREATE INDEX idx_sleep_stages_session ON sleep_stages(session_id);
CREATE INDEX idx_sleep_environment_session ON sleep_environment(session_id);
CREATE INDEX idx_sleep_factors_session ON sleep_factors(session_id);
CREATE INDEX idx_sleep_goals_user ON sleep_goals(user_id);
CREATE INDEX idx_sleep_routines_user ON sleep_routines(user_id);
CREATE INDEX idx_sleep_analytics_user ON sleep_analytics(user_id);
