-- Create sleep entries table
CREATE TABLE IF NOT EXISTS sleep_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    bed_time TIME NOT NULL,
    wake_time TIME NOT NULL,
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    sleep_duration DECIMAL(4,2),
    factors JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sleep goals table
CREATE TABLE IF NOT EXISTS sleep_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_duration DECIMAL(4,2),
    target_bed_time TIME,
    target_wake_time TIME,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sleep recommendations table
CREATE TABLE IF NOT EXISTS sleep_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT CHECK (category IN ('routine', 'environment', 'lifestyle', 'nutrition')),
    impact_level INTEGER CHECK (impact_level >= 1 AND impact_level <= 5),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sleep factor analysis table
CREATE TABLE IF NOT EXISTS sleep_factor_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    factor TEXT NOT NULL,
    impact_score DECIMAL(3,2),
    occurrence_count INTEGER DEFAULT 0,
    analysis_period_start TIMESTAMP WITH TIME ZONE,
    analysis_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE sleep_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_factor_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for sleep entries
CREATE POLICY "Users can view their own sleep entries"
    ON sleep_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep entries"
    ON sleep_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep entries"
    ON sleep_entries FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policies for sleep goals
CREATE POLICY "Users can view their own sleep goals"
    ON sleep_goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep goals"
    ON sleep_goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep goals"
    ON sleep_goals FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policies for sleep recommendations
CREATE POLICY "Anyone can view sleep recommendations"
    ON sleep_recommendations FOR SELECT
    USING (true);

-- Create policies for sleep factor analysis
CREATE POLICY "Users can view their own sleep factor analysis"
    ON sleep_factor_analysis FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep factor analysis"
    ON sleep_factor_analysis FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sleep_entries_user_date 
    ON sleep_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_goals_user 
    ON sleep_goals(user_id, active);
CREATE INDEX IF NOT EXISTS idx_sleep_factor_analysis_user_factor 
    ON sleep_factor_analysis(user_id, factor);
CREATE INDEX IF NOT EXISTS idx_sleep_entries_quality 
    ON sleep_entries(sleep_quality);
CREATE INDEX IF NOT EXISTS idx_sleep_recommendations_category 
    ON sleep_recommendations(category);

-- Insert some default sleep recommendations
INSERT INTO sleep_recommendations (title, description, category, impact_level, tags) 
VALUES 
    (
        'Consistent Sleep Schedule',
        'Maintain a consistent sleep and wake time, even on weekends. This helps regulate your body''s internal clock.',
        'routine',
        5,
        ARRAY['routine', 'circadian rhythm', 'sleep hygiene']
    ),
    (
        'Optimal Sleep Environment',
        'Keep your bedroom cool, dark, and quiet. Use comfortable bedding and consider using blackout curtains.',
        'environment',
        4,
        ARRAY['environment', 'bedroom', 'comfort']
    ),
    (
        'Evening Caffeine Limitation',
        'Avoid consuming caffeine at least 6 hours before bedtime to prevent sleep disruption.',
        'nutrition',
        4,
        ARRAY['caffeine', 'nutrition', 'evening routine']
    ),
    (
        'Digital Device Curfew',
        'Stop using electronic devices 1-2 hours before bedtime to reduce exposure to blue light.',
        'lifestyle',
        4,
        ARRAY['technology', 'blue light', 'evening routine']
    ),
    (
        'Regular Exercise',
        'Engage in regular physical activity, but avoid vigorous exercise close to bedtime.',
        'lifestyle',
        3,
        ARRAY['exercise', 'physical activity', 'timing']
    ),
    (
        'Relaxation Techniques',
        'Practice relaxation techniques like deep breathing, meditation, or gentle stretching before bed.',
        'routine',
        3,
        ARRAY['relaxation', 'stress reduction', 'mindfulness']
    ),
    (
        'Evening Meal Timing',
        'Have your last meal at least 2-3 hours before bedtime to allow proper digestion.',
        'nutrition',
        3,
        ARRAY['nutrition', 'timing', 'digestion']
    ),
    (
        'Bedroom Temperature',
        'Maintain a bedroom temperature between 60-67°F (15-19°C) for optimal sleep.',
        'environment',
        3,
        ARRAY['temperature', 'environment', 'comfort']
    );
