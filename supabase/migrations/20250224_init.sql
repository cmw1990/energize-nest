-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS energy_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type TEXT CHECK (type IN ('physical', 'mental', 'focus', 'sleep')),
    value INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type TEXT NOT NULL,
    duration INTEGER NOT NULL,
    intensity INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT[] NOT NULL,
    instructions TEXT[] NOT NULL,
    energy_impact INTEGER NOT NULL,
    tags TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY,
    theme TEXT CHECK (theme IN ('light', 'dark')),
    notifications BOOLEAN DEFAULT true,
    email_frequency TEXT CHECK (email_frequency IN ('daily', 'weekly', 'never')),
    custom_settings JSONB,
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS consultation_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type TEXT CHECK (type IN ('energy', 'nutrition', 'sleep', 'focus')),
    preferred_date TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'scheduled', 'completed')) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_energy_metrics_user_id ON energy_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_energy_metrics_timestamp ON energy_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp);
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_user_id ON consultation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON consultation_requests(status);

-- Set up Row Level Security (RLS)
ALTER TABLE energy_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own energy metrics"
    ON energy_metrics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own energy metrics"
    ON energy_metrics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own energy metrics"
    ON energy_metrics FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own energy metrics"
    ON energy_metrics FOR DELETE
    USING (auth.uid() = user_id);

-- Similar policies for other tables
CREATE POLICY "Users can view their own activities"
    ON activities FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own activities"
    ON activities FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view recipes"
    ON recipes FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Users can view their own preferences"
    ON user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own preferences"
    ON user_preferences FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own consultation requests"
    ON consultation_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own consultation requests"
    ON consultation_requests FOR ALL
    USING (auth.uid() = user_id);
