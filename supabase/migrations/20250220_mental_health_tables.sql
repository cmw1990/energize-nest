-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Mental Health Base Tables
CREATE TABLE mood_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 10),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    anxiety_level INTEGER CHECK (anxiety_level BETWEEN 1 AND 10),
    focus_level INTEGER CHECK (focus_level BETWEEN 1 AND 10),
    notes TEXT,
    activities TEXT[],
    triggers TEXT[],
    coping_strategies TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE anxiety_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    intensity_level INTEGER CHECK (intensity_level BETWEEN 1 AND 10),
    physical_symptoms TEXT[],
    thoughts TEXT,
    triggers TEXT[],
    coping_mechanisms TEXT[],
    effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 10),
    duration INTEGER, -- in minutes
    location TEXT,
    accompanied_by TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE depression_check_ins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 10),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    sleep_hours NUMERIC(4,2),
    appetite INTEGER CHECK (appetite BETWEEN 1 AND 10),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    motivation_level INTEGER CHECK (motivation_level BETWEEN 1 AND 10),
    social_interaction INTEGER CHECK (social_interaction BETWEEN 1 AND 10),
    thought_patterns TEXT[],
    activities TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration INTEGER, -- in minutes
    task_type TEXT,
    productivity INTEGER CHECK (productivity BETWEEN 1 AND 10),
    distractions TEXT[],
    environment TEXT,
    techniques TEXT[],
    breaks JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE meditation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration INTEGER, -- in minutes
    type TEXT,
    guided_by TEXT,
    focus_level INTEGER CHECK (focus_level BETWEEN 1 AND 10),
    calmness INTEGER CHECK (calmness BETWEEN 1 AND 10),
    interruptions INTEGER,
    environment TEXT,
    techniques TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE relationship_check_ins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    relationship_type TEXT,
    satisfaction_level INTEGER CHECK (satisfaction_level BETWEEN 1 AND 10),
    communication_quality INTEGER CHECK (communication_quality BETWEEN 1 AND 10),
    concerns TEXT[],
    positive_aspects TEXT[],
    goals TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE work_life_balance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    work_satisfaction INTEGER CHECK (work_satisfaction BETWEEN 1 AND 10),
    work_stress_level INTEGER CHECK (work_stress_level BETWEEN 1 AND 10),
    personal_time_quality INTEGER CHECK (personal_time_quality BETWEEN 1 AND 10),
    hobbies_engagement INTEGER CHECK (hobbies_engagement BETWEEN 1 AND 10),
    boundary_maintenance INTEGER CHECK (boundary_maintenance BETWEEN 1 AND 10),
    work_hours INTEGER,
    breaks_taken INTEGER,
    exercise_minutes INTEGER,
    relaxation_minutes INTEGER,
    goals TEXT[],
    challenges TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE gratitude_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    entries TEXT[],
    mood INTEGER CHECK (mood BETWEEN 1 AND 10),
    category TEXT,
    impact TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    title TEXT,
    content TEXT,
    mood INTEGER CHECK (mood BETWEEN 1 AND 10),
    tags TEXT[],
    is_private BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE habit_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    habit_id UUID,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed BOOLEAN DEFAULT false,
    difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 10),
    notes TEXT,
    mood INTEGER CHECK (mood BETWEEN 1 AND 10),
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE social_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    type TEXT,
    duration INTEGER,
    quality INTEGER CHECK (quality BETWEEN 1 AND 10),
    energy_impact INTEGER CHECK (energy_impact BETWEEN -5 AND 5),
    people TEXT[],
    location TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mental Health Goals and Progress
CREATE TABLE mental_health_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT,
    title TEXT NOT NULL,
    description TEXT,
    target_date TIMESTAMPTZ,
    progress NUMERIC(5,2) DEFAULT 0,
    status TEXT DEFAULT 'active',
    metrics JSONB,
    check_ins JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE mental_health_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT,
    type TEXT,
    title TEXT NOT NULL,
    description TEXT,
    data JSONB,
    priority TEXT,
    actionable BOOLEAN DEFAULT true,
    actions TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE mental_health_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metrics JSONB,
    insights JSONB,
    recommendations TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_mood_logs_user_timestamp ON mood_logs(user_id, timestamp);
CREATE INDEX idx_anxiety_logs_user_timestamp ON anxiety_logs(user_id, timestamp);
CREATE INDEX idx_depression_checkins_user_timestamp ON depression_check_ins(user_id, timestamp);
CREATE INDEX idx_focus_sessions_user_timestamp ON focus_sessions(user_id, timestamp);
CREATE INDEX idx_meditation_sessions_user_timestamp ON meditation_sessions(user_id, timestamp);
CREATE INDEX idx_relationship_checkins_user_timestamp ON relationship_check_ins(user_id, timestamp);
CREATE INDEX idx_work_life_balance_user_timestamp ON work_life_balance(user_id, timestamp);
CREATE INDEX idx_gratitude_entries_user_timestamp ON gratitude_entries(user_id, timestamp);
CREATE INDEX idx_journal_entries_user_timestamp ON journal_entries(user_id, timestamp);
CREATE INDEX idx_habit_tracking_user_timestamp ON habit_tracking(user_id, timestamp);
CREATE INDEX idx_social_interactions_user_timestamp ON social_interactions(user_id, timestamp);
CREATE INDEX idx_mental_health_goals_user ON mental_health_goals(user_id);
CREATE INDEX idx_mental_health_insights_user ON mental_health_insights(user_id);
CREATE INDEX idx_mental_health_progress_user_timestamp ON mental_health_progress(user_id, timestamp);

-- Enable Row Level Security
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE anxiety_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE depression_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_life_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE gratitude_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own mood logs"
    ON mood_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood logs"
    ON mood_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood logs"
    ON mood_logs FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Repeat similar policies for other tables
-- Note: For brevity, not showing all policies, but they follow the same pattern

-- Create functions for analytics
CREATE OR REPLACE FUNCTION get_mental_health_summary(p_user_id UUID, p_days INTEGER)
RETURNS TABLE (
    category TEXT,
    avg_score NUMERIC,
    trend TEXT,
    top_triggers TEXT[],
    effective_strategies TEXT[]
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    WITH recent_logs AS (
        SELECT
            'mood' as category,
            mood_score as score,
            triggers,
            coping_strategies
        FROM mood_logs
        WHERE user_id = p_user_id
        AND timestamp >= NOW() - (p_days || ' days')::INTERVAL
        UNION ALL
        SELECT
            'anxiety' as category,
            intensity_level as score,
            triggers,
            coping_mechanisms
        FROM anxiety_logs
        WHERE user_id = p_user_id
        AND timestamp >= NOW() - (p_days || ' days')::INTERVAL
    )
    SELECT
        l.category,
        ROUND(AVG(l.score)::NUMERIC, 2) as avg_score,
        CASE
            WHEN COALESCE(
                CORR(
                    EXTRACT(EPOCH FROM timestamp),
                    l.score
                ),
                0
            ) > 0.1 THEN 'improving'
            WHEN COALESCE(
                CORR(
                    EXTRACT(EPOCH FROM timestamp),
                    l.score
                ),
                0
            ) < -0.1 THEN 'declining'
            ELSE 'stable'
        END as trend,
        ARRAY(
            SELECT DISTINCT unnest(l.triggers)
            LIMIT 5
        ) as top_triggers,
        ARRAY(
            SELECT DISTINCT unnest(l.coping_strategies)
            LIMIT 5
        ) as effective_strategies
    FROM recent_logs l
    GROUP BY l.category;
END;
$$;
