-- Create gratitude_entries table
CREATE TABLE gratitude_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    entries TEXT[] NOT NULL,
    mood INTEGER NOT NULL CHECK (mood BETWEEN 1 AND 10),
    highlights TEXT[] NOT NULL DEFAULT '{}',
    category TEXT NOT NULL,
    reflection TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE gratitude_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own gratitude entries"
    ON gratitude_entries
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gratitude entries"
    ON gratitude_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gratitude entries"
    ON gratitude_entries
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gratitude entries"
    ON gratitude_entries
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_gratitude_entries_user_id ON gratitude_entries(user_id);
CREATE INDEX idx_gratitude_entries_date ON gratitude_entries(date);
CREATE INDEX idx_gratitude_entries_category ON gratitude_entries(category);

-- Create view for gratitude insights
CREATE OR REPLACE VIEW gratitude_insights AS
SELECT 
    user_id,
    COUNT(*) as total_entries,
    AVG(mood) as avg_mood,
    AVG(array_length(entries, 1)) as avg_gratitude_items,
    mode() WITHIN GROUP (ORDER BY category) as most_common_category,
    array_agg(DISTINCT category) as all_categories,
    COUNT(DISTINCT date_trunc('week', date)) as weeks_practiced
FROM gratitude_entries
GROUP BY user_id;

-- Add RLS to the view
ALTER VIEW gratitude_insights SECURITY DEFINER;

CREATE POLICY "Users can view their own gratitude insights"
    ON gratitude_insights
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create function to get gratitude trends
CREATE OR REPLACE FUNCTION get_gratitude_trends(
    p_user_id UUID,
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    date DATE,
    mood_avg NUMERIC,
    items_count INTEGER,
    category TEXT,
    has_reflection BOOLEAN
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g.date,
        AVG(g.mood)::NUMERIC as mood_avg,
        SUM(array_length(g.entries, 1))::INTEGER as items_count,
        mode() WITHIN GROUP (ORDER BY g.category) as category,
        bool_or(g.reflection IS NOT NULL) as has_reflection
    FROM gratitude_entries g
    WHERE 
        g.user_id = p_user_id
        AND g.date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY g.date
    ORDER BY g.date DESC;
END;
$$;

-- Create materialized view for weekly gratitude stats
CREATE MATERIALIZED VIEW weekly_gratitude_stats AS
SELECT 
    user_id,
    date_trunc('week', date) as week_start,
    COUNT(*) as entries_count,
    AVG(mood) as avg_mood,
    SUM(array_length(entries, 1)) as total_gratitude_items,
    array_agg(DISTINCT category) as categories,
    COUNT(DISTINCT date) as days_practiced
FROM gratitude_entries
GROUP BY user_id, date_trunc('week', date);

-- Create index on materialized view
CREATE UNIQUE INDEX idx_weekly_gratitude_stats_user_week 
ON weekly_gratitude_stats(user_id, week_start);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_weekly_gratitude_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY weekly_gratitude_stats;
    RETURN NULL;
END;
$$;

-- Create trigger to refresh materialized view
CREATE TRIGGER refresh_weekly_gratitude_stats_trigger
AFTER INSERT OR UPDATE OR DELETE
ON gratitude_entries
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_weekly_gratitude_stats();
