-- Create sleep entries table
CREATE TABLE sleep_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bedtime TIME NOT NULL,
    wake_time TIME NOT NULL,
    sleep_quality INTEGER NOT NULL CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    sleep_duration DECIMAL(4,2) NOT NULL,
    factors TEXT[] NOT NULL DEFAULT '{}',
    mood_on_waking INTEGER NOT NULL CHECK (mood_on_waking >= 1 AND mood_on_waking <= 10),
    energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 10),
    dreams TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON sleep_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_sleep_entries_user_id ON sleep_entries(user_id);
CREATE INDEX idx_sleep_entries_created_at ON sleep_entries(created_at);
CREATE INDEX idx_sleep_entries_bedtime ON sleep_entries(bedtime);
CREATE INDEX idx_sleep_entries_wake_time ON sleep_entries(wake_time);

-- Enable Row Level Security
ALTER TABLE sleep_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own sleep entries"
    ON sleep_entries
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own sleep entries"
    ON sleep_entries
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep entries"
    ON sleep_entries
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep entries"
    ON sleep_entries
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create view for sleep insights
CREATE VIEW sleep_insights AS
SELECT 
    user_id,
    AVG(sleep_duration) as avg_sleep_duration,
    AVG(sleep_quality) as avg_sleep_quality,
    AVG(mood_on_waking) as avg_mood_on_waking,
    AVG(energy_level) as avg_energy_level,
    MODE() WITHIN GROUP (ORDER BY bedtime) as typical_bedtime,
    MODE() WITHIN GROUP (ORDER BY wake_time) as typical_wake_time,
    COUNT(*) as total_entries,
    ARRAY_AGG(DISTINCT unnest(factors)) as all_factors
FROM sleep_entries
GROUP BY user_id;

-- Enable RLS on the view
ALTER VIEW sleep_insights SECURITY INVOKER;

-- Create policy for the view
CREATE POLICY "Users can view their own sleep insights"
    ON sleep_insights
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create materialized view for sleep trends
CREATE MATERIALIZED VIEW sleep_trends AS
SELECT 
    user_id,
    date_trunc('week', created_at) as week,
    AVG(sleep_duration) as avg_sleep_duration,
    AVG(sleep_quality) as avg_sleep_quality,
    AVG(mood_on_waking) as avg_mood_on_waking,
    AVG(energy_level) as avg_energy_level,
    MODE() WITHIN GROUP (ORDER BY bedtime) as typical_bedtime,
    MODE() WITHIN GROUP (ORDER BY wake_time) as typical_wake_time,
    COUNT(*) as entries_count
FROM sleep_entries
GROUP BY user_id, date_trunc('week', created_at);

-- Create index on materialized view
CREATE INDEX idx_sleep_trends_user_week ON sleep_trends(user_id, week);

-- Enable RLS on materialized view
ALTER MATERIALIZED VIEW sleep_trends SECURITY INVOKER;

-- Create policy for materialized view
CREATE POLICY "Users can view their own sleep trends"
    ON sleep_trends
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create function to refresh sleep trends
CREATE OR REPLACE FUNCTION refresh_sleep_trends()
RETURNS trigger AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY sleep_trends;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh sleep trends
CREATE TRIGGER refresh_sleep_trends_trigger
    AFTER INSERT OR UPDATE OR DELETE ON sleep_entries
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_sleep_trends();
