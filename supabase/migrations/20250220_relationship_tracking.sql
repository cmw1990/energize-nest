-- Create relationship_entries table
CREATE TABLE relationship_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL,
    connection_quality INTEGER NOT NULL CHECK (connection_quality BETWEEN 1 AND 10),
    communication_quality INTEGER NOT NULL CHECK (communication_quality BETWEEN 1 AND 10),
    trust_level INTEGER NOT NULL CHECK (trust_level BETWEEN 1 AND 10),
    support_level INTEGER NOT NULL CHECK (support_level BETWEEN 1 AND 10),
    conflict_resolution INTEGER NOT NULL CHECK (conflict_resolution BETWEEN 1 AND 10),
    shared_activities TEXT[] NOT NULL DEFAULT '{}',
    challenges TEXT[] NOT NULL DEFAULT '{}',
    positive_moments TEXT,
    goals TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE relationship_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own relationship entries"
    ON relationship_entries
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own relationship entries"
    ON relationship_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own relationship entries"
    ON relationship_entries
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own relationship entries"
    ON relationship_entries
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_relationship_entries_user_id ON relationship_entries(user_id);
CREATE INDEX idx_relationship_entries_created_at ON relationship_entries(created_at);
CREATE INDEX idx_relationship_entries_type ON relationship_entries(relationship_type);

-- Create view for relationship insights
CREATE OR REPLACE VIEW relationship_insights AS
SELECT 
    user_id,
    relationship_type,
    COUNT(*) as entry_count,
    AVG(connection_quality) as avg_connection,
    AVG(communication_quality) as avg_communication,
    AVG(trust_level) as avg_trust,
    AVG(support_level) as avg_support,
    AVG(conflict_resolution) as avg_conflict_resolution,
    array_agg(DISTINCT unnest(shared_activities)) as all_activities,
    array_agg(DISTINCT unnest(challenges)) as all_challenges,
    array_agg(DISTINCT unnest(goals)) as all_goals
FROM relationship_entries
GROUP BY user_id, relationship_type;

-- Add RLS to the view
ALTER VIEW relationship_insights SECURITY DEFINER;

CREATE POLICY "Users can view their own relationship insights"
    ON relationship_insights
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create function to get relationship trends
CREATE OR REPLACE FUNCTION get_relationship_trends(
    p_user_id UUID,
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    date DATE,
    relationship_type TEXT,
    connection_quality NUMERIC,
    communication_quality NUMERIC,
    trust_level NUMERIC
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(created_at) as date,
        relationship_type,
        AVG(connection_quality)::NUMERIC as connection_quality,
        AVG(communication_quality)::NUMERIC as communication_quality,
        AVG(trust_level)::NUMERIC as trust_level
    FROM relationship_entries
    WHERE 
        user_id = p_user_id
        AND created_at >= NOW() - (p_days || ' days')::INTERVAL
    GROUP BY DATE(created_at), relationship_type
    ORDER BY date DESC;
END;
$$;
