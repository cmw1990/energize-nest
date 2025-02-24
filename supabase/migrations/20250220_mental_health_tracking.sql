-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Mental Health Base Table (for shared fields)
CREATE TABLE mental_health_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    log_type TEXT NOT NULL CHECK (log_type IN ('anxiety', 'mood', 'depression')),
    intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
    notes TEXT,
    location TEXT,
    accompanied_by TEXT[],
    CONSTRAINT valid_intensity CHECK (intensity >= 1 AND intensity <= 10)
);

-- Anxiety specific tracking
CREATE TABLE anxiety_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    base_log_id UUID NOT NULL REFERENCES mental_health_logs(id) ON DELETE CASCADE,
    physical_symptoms TEXT[],
    triggers TEXT[],
    coping_strategies TEXT[],
    duration_minutes INTEGER CHECK (duration_minutes > 0),
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 10)
);

-- Mood specific tracking
CREATE TABLE mood_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    base_log_id UUID NOT NULL REFERENCES mental_health_logs(id) ON DELETE CASCADE,
    mood_type TEXT NOT NULL,
    activities TEXT[],
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10)
);

-- Depression specific tracking
CREATE TABLE depression_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    base_log_id UUID NOT NULL REFERENCES mental_health_logs(id) ON DELETE CASCADE,
    symptoms TEXT[],
    sleep_hours NUMERIC CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    appetite_level INTEGER CHECK (appetite_level >= 1 AND appetite_level <= 10),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    social_interaction INTEGER CHECK (social_interaction >= 1 AND social_interaction <= 10),
    positive_activities TEXT[],
    suicidal_thoughts BOOLEAN NOT NULL DEFAULT FALSE
);

-- Add indexes for better query performance
CREATE INDEX idx_mental_health_logs_user_id ON mental_health_logs(user_id);
CREATE INDEX idx_mental_health_logs_created_at ON mental_health_logs(created_at);
CREATE INDEX idx_mental_health_logs_log_type ON mental_health_logs(log_type);
CREATE INDEX idx_anxiety_logs_base_log_id ON anxiety_logs(base_log_id);
CREATE INDEX idx_mood_logs_base_log_id ON mood_logs(base_log_id);
CREATE INDEX idx_depression_logs_base_log_id ON depression_logs(base_log_id);

-- Add RLS policies
ALTER TABLE mental_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE anxiety_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE depression_logs ENABLE ROW LEVEL SECURITY;

-- Policies for mental_health_logs
CREATE POLICY "Users can view their own logs"
    ON mental_health_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
    ON mental_health_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs"
    ON mental_health_logs FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs"
    ON mental_health_logs FOR DELETE
    USING (auth.uid() = user_id);

-- Similar policies for anxiety_logs
CREATE POLICY "Users can view their own anxiety logs"
    ON anxiety_logs FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM mental_health_logs
        WHERE mental_health_logs.id = anxiety_logs.base_log_id
        AND mental_health_logs.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own anxiety logs"
    ON anxiety_logs FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM mental_health_logs
        WHERE mental_health_logs.id = anxiety_logs.base_log_id
        AND mental_health_logs.user_id = auth.uid()
    ));

-- Similar policies for mood_logs
CREATE POLICY "Users can view their own mood logs"
    ON mood_logs FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM mental_health_logs
        WHERE mental_health_logs.id = mood_logs.base_log_id
        AND mental_health_logs.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own mood logs"
    ON mood_logs FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM mental_health_logs
        WHERE mental_health_logs.id = mood_logs.base_log_id
        AND mental_health_logs.user_id = auth.uid()
    ));

-- Similar policies for depression_logs
CREATE POLICY "Users can view their own depression logs"
    ON depression_logs FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM mental_health_logs
        WHERE mental_health_logs.id = depression_logs.base_log_id
        AND mental_health_logs.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own depression logs"
    ON depression_logs FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM mental_health_logs
        WHERE mental_health_logs.id = depression_logs.base_log_id
        AND mental_health_logs.user_id = auth.uid()
    ));

-- Functions for analytics
CREATE OR REPLACE FUNCTION get_mental_health_summary(
    p_user_id UUID,
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ
) RETURNS TABLE (
    log_type TEXT,
    avg_intensity NUMERIC,
    total_logs INTEGER,
    most_common_symptoms TEXT[],
    most_effective_strategies TEXT[]
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    WITH base_stats AS (
        SELECT 
            mhl.log_type,
            AVG(mhl.intensity)::NUMERIC(10,2) as avg_intensity,
            COUNT(*) as total_logs
        FROM mental_health_logs mhl
        WHERE mhl.user_id = p_user_id
        AND mhl.created_at BETWEEN p_start_date AND p_end_date
        GROUP BY mhl.log_type
    ),
    anxiety_stats AS (
        SELECT 
            ARRAY_AGG(DISTINCT unnest(al.physical_symptoms)) FILTER (WHERE al.physical_symptoms IS NOT NULL) as symptoms,
            ARRAY_AGG(DISTINCT unnest(al.coping_strategies)) FILTER (WHERE al.effectiveness_rating >= 7) as strategies
        FROM mental_health_logs mhl
        JOIN anxiety_logs al ON al.base_log_id = mhl.id
        WHERE mhl.user_id = p_user_id
        AND mhl.created_at BETWEEN p_start_date AND p_end_date
    ),
    depression_stats AS (
        SELECT 
            ARRAY_AGG(DISTINCT unnest(dl.symptoms)) FILTER (WHERE dl.symptoms IS NOT NULL) as symptoms,
            ARRAY_AGG(DISTINCT unnest(dl.positive_activities)) FILTER (WHERE dl.energy_level >= 7) as strategies
        FROM mental_health_logs mhl
        JOIN depression_logs dl ON dl.base_log_id = mhl.id
        WHERE mhl.user_id = p_user_id
        AND mhl.created_at BETWEEN p_start_date AND p_end_date
    )
    SELECT 
        bs.log_type,
        bs.avg_intensity,
        bs.total_logs,
        CASE 
            WHEN bs.log_type = 'anxiety' THEN (SELECT symptoms FROM anxiety_stats)
            WHEN bs.log_type = 'depression' THEN (SELECT symptoms FROM depression_stats)
            ELSE NULL
        END as most_common_symptoms,
        CASE 
            WHEN bs.log_type = 'anxiety' THEN (SELECT strategies FROM anxiety_stats)
            WHEN bs.log_type = 'depression' THEN (SELECT strategies FROM depression_stats)
            ELSE NULL
        END as most_effective_strategies
    FROM base_stats bs;
END;
$$;
