-- Create energy_metrics table
CREATE TABLE IF NOT EXISTS energy_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('physical', 'mental', 'focus', 'sleep')),
    value INTEGER CHECK (value >= 0 AND value <= 100),
    timestamp TIMESTAMPTZ DEFAULT now(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    duration INTEGER CHECK (duration > 0),
    intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5),
    timestamp TIMESTAMPTZ DEFAULT now(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    ingredients TEXT[] NOT NULL,
    instructions TEXT[] NOT NULL,
    energy_impact INTEGER CHECK (energy_impact >= 0 AND energy_impact <= 100),
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    notifications BOOLEAN DEFAULT true,
    email_frequency TEXT DEFAULT 'weekly' CHECK (email_frequency IN ('daily', 'weekly', 'never')),
    custom_settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create consultation_requests table
CREATE TABLE IF NOT EXISTS consultation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('energy', 'nutrition', 'sleep', 'focus')),
    preferred_date TIMESTAMPTZ NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE energy_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;

-- Energy metrics policies
CREATE POLICY "Users can view their own energy metrics"
    ON energy_metrics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own energy metrics"
    ON energy_metrics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Activities policies
CREATE POLICY "Users can view their own activities"
    ON activities FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
    ON activities FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Recipes policies
CREATE POLICY "Anyone can view recipes"
    ON recipes FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create recipes"
    ON recipes FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- User preferences policies
CREATE POLICY "Users can view their own preferences"
    ON user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON user_preferences FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
    ON user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Consultation requests policies
CREATE POLICY "Users can view their own consultation requests"
    ON consultation_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consultation requests"
    ON consultation_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_energy_metrics_user_timestamp 
    ON energy_metrics(user_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_activities_user_timestamp 
    ON activities(user_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_recipes_title_gin 
    ON recipes USING gin(to_tsvector('english', title));

CREATE INDEX IF NOT EXISTS idx_consultation_requests_user_date 
    ON consultation_requests(user_id, preferred_date DESC);
