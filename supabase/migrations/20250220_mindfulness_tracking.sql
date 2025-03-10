-- Create meditation_sessions table
CREATE TABLE meditation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    duration INTEGER NOT NULL CHECK (duration > 0),
    type TEXT NOT NULL,
    mood_before INTEGER NOT NULL CHECK (mood_before BETWEEN 1 AND 10),
    mood_after INTEGER NOT NULL CHECK (mood_after BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own meditation sessions"
    ON meditation_sessions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meditation sessions"
    ON meditation_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meditation sessions"
    ON meditation_sessions
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meditation sessions"
    ON meditation_sessions
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_meditation_sessions_user_id ON meditation_sessions(user_id);
CREATE INDEX idx_meditation_sessions_created_at ON meditation_sessions(created_at);
CREATE INDEX idx_meditation_sessions_type ON meditation_sessions(type);

-- Create view for meditation insights
CREATE OR REPLACE VIEW meditation_insights AS
SELECT 
    user_id,
    COUNT(*) as total_sessions,
    SUM(duration) as total_minutes,
    AVG(duration) as avg_duration,
    AVG(mood_after - mood_before) as avg_mood_improvement,
    COUNT(DISTINCT type) as practice_variety,
    mode() WITHIN GROUP (ORDER BY type) as favorite_type,
    AVG(CASE WHEN mood_after > mood_before THEN 1 ELSE 0 END) as improvement_rate
FROM meditation_sessions
GROUP BY user_id;

-- Add RLS to the view
ALTER VIEW meditation_insights SECURITY DEFINER;

CREATE POLICY "Users can view their own meditation insights"
    ON meditation_insights
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create function to get meditation trends
CREATE OR REPLACE FUNCTION get_meditation_trends(
    p_user_id UUID,
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    date DATE,
    total_minutes INTEGER,
    avg_duration NUMERIC,
    avg_mood_change NUMERIC,
    session_count INTEGER
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(created_at) as date,
        SUM(duration)::INTEGER as total_minutes,
        AVG(duration)::NUMERIC as avg_duration,
        AVG(mood_after - mood_before)::NUMERIC as avg_mood_change,
        COUNT(*)::INTEGER as session_count
    FROM meditation_sessions
    WHERE 
        user_id = p_user_id
        AND created_at >= NOW() - (p_days || ' days')::INTERVAL
    GROUP BY DATE(created_at)
    ORDER BY date DESC;
END;
$$;

-- Create materialized view for weekly meditation stats
CREATE MATERIALIZED VIEW weekly_meditation_stats AS
SELECT 
    user_id,
    DATE_TRUNC('week', created_at) as week_start,
    COUNT(*) as sessions_count,
    SUM(duration) as total_minutes,
    AVG(duration) as avg_duration,
    AVG(mood_after - mood_before) as avg_mood_improvement,
    array_agg(DISTINCT type) as practice_types
FROM meditation_sessions
GROUP BY user_id, DATE_TRUNC('week', created_at);

-- Create index on materialized view
CREATE UNIQUE INDEX idx_weekly_meditation_stats_user_week 
ON weekly_meditation_stats(user_id, week_start);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_weekly_meditation_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY weekly_meditation_stats;
    RETURN NULL;
END;
$$;

-- Create trigger to refresh materialized view
CREATE TRIGGER refresh_weekly_meditation_stats_trigger
AFTER INSERT OR UPDATE OR DELETE
ON meditation_sessions
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_weekly_meditation_stats();
