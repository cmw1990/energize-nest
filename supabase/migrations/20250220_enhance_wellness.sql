-- Create sleep_metrics table
CREATE TABLE IF NOT EXISTS sleep_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    duration_minutes INTEGER CHECK (duration_minutes > 0),
    quality INTEGER CHECK (quality >= 1 AND quality <= 10),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    deep_sleep_minutes INTEGER,
    rem_sleep_minutes INTEGER,
    interruptions INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create nutrition_logs table
CREATE TABLE IF NOT EXISTS nutrition_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    foods TEXT[],
    calories INTEGER,
    protein_grams INTEGER,
    carbs_grams INTEGER,
    fats_grams INTEGER,
    water_ml INTEGER,
    timestamp TIMESTAMPTZ DEFAULT now(),
    energy_impact INTEGER CHECK (energy_impact >= 0 AND energy_impact <= 100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create mindfulness_sessions table
CREATE TABLE IF NOT EXISTS mindfulness_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('meditation', 'breathing', 'yoga', 'journaling', 'gratitude')),
    duration_minutes INTEGER CHECK (duration_minutes > 0),
    focus_level INTEGER CHECK (focus_level >= 1 AND focus_level <= 10),
    mood_before TEXT,
    mood_after TEXT,
    notes TEXT,
    timestamp TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT CHECK (category IN ('energy', 'sleep', 'nutrition', 'mindfulness', 'fitness')),
    target_value INTEGER,
    current_value INTEGER,
    start_date DATE,
    end_date DATE,
    frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    status TEXT CHECK (status IN ('active', 'completed', 'abandoned')) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create social_connections table
CREATE TABLE IF NOT EXISTS social_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    connected_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    connection_type TEXT CHECK (connection_type IN ('friend', 'coach', 'mentor', 'accountability_partner')),
    status TEXT CHECK (status IN ('pending', 'active', 'blocked')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('energy', 'sleep', 'nutrition', 'mindfulness', 'fitness')),
    duration_days INTEGER CHECK (duration_days > 0),
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    points INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_challenges table
CREATE TABLE IF NOT EXISTS user_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('active', 'completed', 'abandoned')) DEFAULT 'active',
    progress INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create wellness_tips table
CREATE TABLE IF NOT EXISTS wellness_tips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT CHECK (category IN ('energy', 'sleep', 'nutrition', 'mindfulness', 'fitness')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('energy', 'sleep', 'nutrition', 'mindfulness', 'fitness')),
    points INTEGER DEFAULT 0,
    achieved_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE sleep_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mindfulness_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own sleep metrics"
    ON sleep_metrics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own nutrition logs"
    ON nutrition_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own mindfulness sessions"
    ON mindfulness_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own goals"
    ON goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own social connections"
    ON social_connections FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

CREATE POLICY "Users can view their own challenges"
    ON user_challenges FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own achievements"
    ON user_achievements FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_sleep_metrics_user_id ON sleep_metrics(user_id);
CREATE INDEX idx_nutrition_logs_user_id ON nutrition_logs(user_id);
CREATE INDEX idx_mindfulness_sessions_user_id ON mindfulness_sessions(user_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_social_connections_user_id ON social_connections(user_id);
CREATE INDEX idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
