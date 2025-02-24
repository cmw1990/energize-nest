-- Create depression entries table
CREATE TABLE depression_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mood_level INTEGER NOT NULL CHECK (mood_level >= 1 AND mood_level <= 10),
    energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 10),
    sleep_quality INTEGER NOT NULL CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    appetite_level INTEGER NOT NULL CHECK (appetite_level >= 1 AND appetite_level <= 10),
    interest_level INTEGER NOT NULL CHECK (interest_level >= 1 AND interest_level <= 10),
    concentration_level INTEGER NOT NULL CHECK (concentration_level >= 1 AND concentration_level <= 10),
    thoughts TEXT,
    activities TEXT[] NOT NULL DEFAULT '{}',
    support_received TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON depression_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_depression_entries_user_id ON depression_entries(user_id);
CREATE INDEX idx_depression_entries_created_at ON depression_entries(created_at);

-- Enable Row Level Security
ALTER TABLE depression_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own depression entries"
    ON depression_entries
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own depression entries"
    ON depression_entries
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own depression entries"
    ON depression_entries
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own depression entries"
    ON depression_entries
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create view for depression insights
CREATE VIEW depression_insights AS
SELECT 
    user_id,
    AVG(mood_level) as avg_mood_level,
    AVG(energy_level) as avg_energy_level,
    AVG(sleep_quality) as avg_sleep_quality,
    AVG(appetite_level) as avg_appetite_level,
    AVG(interest_level) as avg_interest_level,
    AVG(concentration_level) as avg_concentration_level,
    COUNT(*) as total_entries,
    ARRAY_AGG(DISTINCT unnest(activities)) as all_activities,
    ARRAY_AGG(DISTINCT unnest(support_received)) as all_support_types
FROM depression_entries
GROUP BY user_id;

-- Enable RLS on the view
ALTER VIEW depression_insights SECURITY INVOKER;

-- Create policy for the view
CREATE POLICY "Users can view their own depression insights"
    ON depression_insights
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
