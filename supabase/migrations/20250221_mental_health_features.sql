-- Enable Row Level Security
ALTER TABLE mental_health.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health.journal_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health.crisis_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health.crisis_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health.trauma_recovery_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health.guided_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health.trauma_recovery_progress ENABLE ROW LEVEL SECURITY;

-- Journal Entries
CREATE TABLE mental_health.journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    mood INTEGER CHECK (mood BETWEEN 1 AND 10),
    emotions TEXT[],
    insights TEXT[],
    prompt_id UUID REFERENCES mental_health.journal_prompts(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal Prompts
CREATE TABLE mental_health.journal_prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT CHECK (category IN ('reflection', 'gratitude', 'growth', 'healing')),
    prompt TEXT NOT NULL,
    follow_up_questions TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crisis Resources
CREATE TABLE mental_health.crisis_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    phone TEXT,
    website TEXT,
    available_hours TEXT,
    type TEXT CHECK (type IN ('hotline', 'chat', 'resource')),
    categories TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crisis Interactions
CREATE TABLE mental_health.crisis_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES mental_health.crisis_resources(id),
    interaction_type TEXT CHECK (interaction_type IN ('view', 'call', 'chat', 'website')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trauma Recovery Plans
CREATE TABLE mental_health.trauma_recovery_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    triggers TEXT[],
    coping_strategies TEXT[],
    safety_plan JSONB NOT NULL DEFAULT '{
        "warning_signs": [],
        "grounding_techniques": [],
        "safe_places": [],
        "support_network": []
    }',
    progress_log JSONB[] DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guided Exercises
CREATE TABLE mental_health.guided_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,
    category TEXT NOT NULL,
    type TEXT CHECK (type IN ('grounding', 'breathing', 'mindfulness', 'exposure')),
    steps JSONB[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trauma Recovery Progress
CREATE TABLE mental_health.trauma_recovery_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES mental_health.trauma_recovery_plans(id),
    symptoms TEXT[],
    intensity INTEGER CHECK (intensity BETWEEN 0 AND 10),
    coping_success INTEGER CHECK (coping_success BETWEEN 0 AND 10),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_journal_entries_user_id ON mental_health.journal_entries(user_id);
CREATE INDEX idx_crisis_interactions_user_id ON mental_health.crisis_interactions(user_id);
CREATE INDEX idx_trauma_recovery_plans_user_id ON mental_health.trauma_recovery_plans(user_id);
CREATE INDEX idx_trauma_recovery_progress_user_id ON mental_health.trauma_recovery_progress(user_id);
CREATE INDEX idx_trauma_recovery_progress_plan_id ON mental_health.trauma_recovery_progress(plan_id);

-- Create RLS Policies
CREATE POLICY "Users can view their own journal entries"
    ON mental_health.journal_entries
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries"
    ON mental_health.journal_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
    ON mental_health.journal_entries
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
    ON mental_health.journal_entries
    FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view journal prompts"
    ON mental_health.journal_prompts
    FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view crisis resources"
    ON mental_health.crisis_resources
    FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own crisis interactions"
    ON mental_health.crisis_interactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own crisis interactions"
    ON mental_health.crisis_interactions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own trauma recovery plans"
    ON mental_health.trauma_recovery_plans
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trauma recovery plans"
    ON mental_health.trauma_recovery_plans
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trauma recovery plans"
    ON mental_health.trauma_recovery_plans
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view guided exercises"
    ON mental_health.guided_exercises
    FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own trauma recovery progress"
    ON mental_health.trauma_recovery_progress
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trauma recovery progress"
    ON mental_health.trauma_recovery_progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Insert some initial data
INSERT INTO mental_health.journal_prompts 
(category, prompt, follow_up_questions) VALUES
('reflection', 'How are you feeling today, and what might be influencing these feelings?',
 ARRAY['What physical sensations are you experiencing?', 'Can you identify any triggers?', 'How does this compare to yesterday?']),
('gratitude', 'What are three things you're grateful for today?',
 ARRAY['Why is each one meaningful to you?', 'How do these things impact your daily life?', 'Who could you share your gratitude with?']),
('growth', 'What challenge have you faced recently, and what have you learned from it?',
 ARRAY['What strengths did you discover?', 'How might this learning help you in the future?', 'What support helped you through this?']),
('healing', 'What makes you feel safe and supported?',
 ARRAY['Where do you feel most at peace?', 'Who helps you feel secure?', 'What activities help you feel grounded?']);

INSERT INTO mental_health.guided_exercises 
(title, description, duration, category, type, steps) VALUES
('5-4-3-2-1 Grounding', 'A simple technique to ground yourself in the present moment',
 300, 'trauma_recovery', 'grounding',
 ARRAY[
   '{"instruction": "Name 5 things you can see", "duration": 60000}',
   '{"instruction": "Name 4 things you can touch", "duration": 45000}',
   '{"instruction": "Name 3 things you can hear", "duration": 30000}',
   '{"instruction": "Name 2 things you can smell", "duration": 30000}',
   '{"instruction": "Name 1 thing you can taste", "duration": 15000}'
 ]::jsonb[]),
('Square Breathing', 'A calming breathing exercise to reduce anxiety',
 240, 'trauma_recovery', 'breathing',
 ARRAY[
   '{"instruction": "Breathe in slowly", "duration": 4000}',
   '{"instruction": "Hold your breath", "duration": 4000}',
   '{"instruction": "Exhale slowly", "duration": 4000}',
   '{"instruction": "Hold", "duration": 4000}'
 ]::jsonb[]);

INSERT INTO mental_health.crisis_resources 
(name, description, phone, website, available_hours, type, categories) VALUES
('National Crisis Line', 'Immediate support for mental health crisis',
 '988', 'https://988lifeline.org', '24/7',
 'hotline', ARRAY['crisis', 'suicide_prevention', 'mental_health']),
('Crisis Text Line', 'Text HOME to connect with a Crisis Counselor',
 '741741', 'https://www.crisistextline.org', '24/7',
 'chat', ARRAY['crisis', 'anxiety', 'depression', 'suicide_prevention']);
