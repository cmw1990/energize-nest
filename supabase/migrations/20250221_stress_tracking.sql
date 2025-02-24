-- Create stress entries table
CREATE TABLE stress_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stress_level INTEGER NOT NULL CHECK (stress_level >= 1 AND stress_level <= 10),
    physical_symptoms TEXT[] NOT NULL DEFAULT '{}',
    emotional_state TEXT[] NOT NULL DEFAULT '{}',
    stressors TEXT[] NOT NULL DEFAULT '{}',
    coping_methods TEXT[] NOT NULL DEFAULT '{}',
    effectiveness INTEGER NOT NULL CHECK (effectiveness >= 1 AND effectiveness <= 10),
    energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON stress_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_stress_entries_user_id ON stress_entries(user_id);
CREATE INDEX idx_stress_entries_created_at ON stress_entries(created_at);

-- Enable Row Level Security
ALTER TABLE stress_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own stress entries"
    ON stress_entries
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own stress entries"
    ON stress_entries
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stress entries"
    ON stress_entries
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stress entries"
    ON stress_entries
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create view for stress insights
CREATE VIEW stress_insights AS
SELECT 
    user_id,
    AVG(stress_level) as avg_stress_level,
    AVG(energy_level) as avg_energy_level,
    AVG(effectiveness) as avg_coping_effectiveness,
    COUNT(*) as total_entries,
    ARRAY_AGG(DISTINCT unnest(physical_symptoms)) as all_symptoms,
    ARRAY_AGG(DISTINCT unnest(emotional_state)) as all_emotions,
    ARRAY_AGG(DISTINCT unnest(stressors)) as all_stressors,
    ARRAY_AGG(DISTINCT unnest(coping_methods)) as all_methods
FROM stress_entries
GROUP BY user_id;

-- Enable RLS on the view
ALTER VIEW stress_insights SECURITY INVOKER;

-- Create policy for the view
CREATE POLICY "Users can view their own stress insights"
    ON stress_insights
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create materialized view for trend analysis
CREATE MATERIALIZED VIEW stress_trends AS
SELECT 
    user_id,
    date_trunc('week', created_at) as week,
    AVG(stress_level) as avg_stress_level,
    AVG(energy_level) as avg_energy_level,
    AVG(effectiveness) as avg_coping_effectiveness,
    COUNT(*) as entries_count
FROM stress_entries
GROUP BY user_id, date_trunc('week', created_at);

-- Create index on materialized view
CREATE INDEX idx_stress_trends_user_week ON stress_trends(user_id, week);

-- Enable RLS on materialized view
ALTER MATERIALIZED VIEW stress_trends SECURITY INVOKER;

-- Create policy for materialized view
CREATE POLICY "Users can view their own stress trends"
    ON stress_trends
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
