-- Create anxiety tracking table
CREATE TABLE IF NOT EXISTS anxiety_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    anxiety_level INTEGER CHECK (anxiety_level >= 0 AND anxiety_level <= 10),
    triggers TEXT[] DEFAULT '{}',
    symptoms TEXT[] DEFAULT '{}',
    coping_strategies TEXT[] DEFAULT '{}',
    effectiveness INTEGER CHECK (effectiveness >= 0 AND effectiveness <= 100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exposure tasks table
CREATE TABLE IF NOT EXISTS exposure_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    task TEXT NOT NULL,
    description TEXT,
    difficulty INTEGER CHECK (difficulty >= 0 AND difficulty <= 10),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    completed BOOLEAN DEFAULT FALSE,
    completed_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create anxiety symptoms table
CREATE TABLE IF NOT EXISTS anxiety_symptoms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('physical', 'emotional', 'cognitive', 'behavioral')),
    description TEXT,
    common_triggers TEXT[] DEFAULT '{}',
    coping_strategies TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create anxiety triggers table
CREATE TABLE IF NOT EXISTS anxiety_triggers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('social', 'environmental', 'health', 'work', 'personal')),
    description TEXT,
    impact_level INTEGER CHECK (impact_level >= 0 AND impact_level <= 10),
    prevention_strategies TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE anxiety_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE exposure_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE anxiety_symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE anxiety_triggers ENABLE ROW LEVEL SECURITY;

-- Create policies for anxiety tracking
CREATE POLICY "Users can view their own anxiety tracking data"
    ON anxiety_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own anxiety tracking data"
    ON anxiety_tracking FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own anxiety tracking data"
    ON anxiety_tracking FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policies for exposure tasks
CREATE POLICY "Users can view their own exposure tasks"
    ON exposure_tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exposure tasks"
    ON exposure_tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exposure tasks"
    ON exposure_tasks FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policies for anxiety symptoms
CREATE POLICY "Anyone can view anxiety symptoms"
    ON anxiety_symptoms FOR SELECT
    USING (true);

-- Create policies for anxiety triggers
CREATE POLICY "Anyone can view anxiety triggers"
    ON anxiety_triggers FOR SELECT
    USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_anxiety_tracking_user_date 
    ON anxiety_tracking(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exposure_tasks_user_date 
    ON exposure_tasks(user_id, scheduled_date DESC);
CREATE INDEX IF NOT EXISTS idx_anxiety_tracking_level 
    ON anxiety_tracking(anxiety_level);
CREATE INDEX IF NOT EXISTS idx_exposure_tasks_difficulty 
    ON exposure_tasks(difficulty);

-- Insert some common anxiety symptoms
INSERT INTO anxiety_symptoms (name, category, description, common_triggers, coping_strategies) 
VALUES 
    (
        'Rapid Heart Rate',
        'physical',
        'Increased heart rate or palpitations',
        ARRAY['stress', 'caffeine', 'exercise', 'panic'],
        ARRAY['deep breathing', 'progressive muscle relaxation', 'limiting caffeine']
    ),
    (
        'Racing Thoughts',
        'cognitive',
        'Difficulty controlling worried thoughts',
        ARRAY['uncertainty', 'deadlines', 'social situations'],
        ARRAY['mindfulness', 'thought recording', 'cognitive restructuring']
    ),
    (
        'Social Withdrawal',
        'behavioral',
        'Avoiding social interactions or situations',
        ARRAY['social events', 'public speaking', 'crowds'],
        ARRAY['gradual exposure', 'social skills training', 'assertiveness practice']
    );

-- Insert common anxiety triggers
INSERT INTO anxiety_triggers (name, category, description, impact_level, prevention_strategies)
VALUES
    (
        'Public Speaking',
        'social',
        'Speaking in front of groups or audiences',
        8,
        ARRAY['preparation', 'breathing exercises', 'visualization']
    ),
    (
        'Work Deadlines',
        'work',
        'Approaching work or project deadlines',
        7,
        ARRAY['time management', 'breaking tasks down', 'setting realistic goals']
    ),
    (
        'Health Concerns',
        'health',
        'Worries about personal health or illness',
        6,
        ARRAY['regular check-ups', 'healthy lifestyle', 'fact-checking health information']
    );
