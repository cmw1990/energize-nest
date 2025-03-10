-- Create anxiety entries table
CREATE TABLE anxiety_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    anxiety_level INTEGER NOT NULL CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
    triggers TEXT[] NOT NULL DEFAULT '{}',
    physical_symptoms TEXT[] NOT NULL DEFAULT '{}',
    thoughts TEXT,
    coping_strategies TEXT[] NOT NULL DEFAULT '{}',
    effectiveness INTEGER NOT NULL CHECK (effectiveness >= 1 AND effectiveness <= 10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON anxiety_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index on user_id for faster queries
CREATE INDEX idx_anxiety_entries_user_id ON anxiety_entries(user_id);
CREATE INDEX idx_anxiety_entries_created_at ON anxiety_entries(created_at);

-- Enable Row Level Security
ALTER TABLE anxiety_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own anxiety entries"
    ON anxiety_entries
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own anxiety entries"
    ON anxiety_entries
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own anxiety entries"
    ON anxiety_entries
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own anxiety entries"
    ON anxiety_entries
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create view for anxiety insights
CREATE VIEW anxiety_insights AS
SELECT 
    user_id,
    AVG(anxiety_level) as avg_anxiety_level,
    COUNT(*) as total_entries,
    ARRAY_AGG(DISTINCT unnest(triggers)) as all_triggers,
    ARRAY_AGG(DISTINCT unnest(physical_symptoms)) as all_symptoms,
    ARRAY_AGG(DISTINCT unnest(coping_strategies)) as all_strategies,
    AVG(effectiveness) as avg_strategy_effectiveness
FROM anxiety_entries
GROUP BY user_id;

-- Enable RLS on the view
ALTER VIEW anxiety_insights SECURITY INVOKER;

-- Create policy for the view
CREATE POLICY "Users can view their own anxiety insights"
    ON anxiety_insights
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
