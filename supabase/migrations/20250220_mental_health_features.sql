-- Create meditation tables
CREATE TABLE IF NOT EXISTS meditation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('guided', 'unguided', 'breathing', 'body_scan', 'loving_kindness', 'mindfulness')),
    duration INTEGER CHECK (duration > 0),
    completed BOOLEAN DEFAULT true,
    mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 10),
    mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 10),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meditation_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    duration INTEGER CHECK (duration > 0),
    sessions INTEGER CHECK (sessions > 0),
    category TEXT[] DEFAULT '{}',
    audio_url TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meditation_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES meditation_programs(id) ON DELETE CASCADE,
    completed_sessions INTEGER DEFAULT 0,
    total_minutes INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_session_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mood tracking tables
CREATE TABLE IF NOT EXISTS mood_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mood INTEGER CHECK (mood >= 1 AND mood <= 10),
    energy INTEGER CHECK (energy >= 1 AND energy <= 10),
    activities TEXT[] DEFAULT '{}',
    emotions TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create OCD support tables
CREATE TABLE IF NOT EXISTS ocd_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    trigger TEXT,
    obsession TEXT,
    compulsion TEXT,
    anxiety_level INTEGER CHECK (anxiety_level >= 0 AND anxiety_level <= 10),
    resistance_level INTEGER CHECK (resistance_level >= 0 AND resistance_level <= 10),
    coping_strategy TEXT,
    outcome TEXT,
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    task TEXT NOT NULL,
    description TEXT,
    difficulty INTEGER CHECK (difficulty >= 0 AND difficulty <= 10),
    expected_anxiety INTEGER CHECK (expected_anxiety >= 0 AND expected_anxiety <= 10),
    completed BOOLEAN DEFAULT FALSE,
    completion_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coping_strategies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('cognitive', 'behavioral', 'mindfulness')),
    steps TEXT[] DEFAULT '{}',
    effectiveness INTEGER CHECK (effectiveness >= 0 AND effectiveness <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocd_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE coping_strategies ENABLE ROW LEVEL SECURITY;

-- Meditation sessions policies
CREATE POLICY "Users can view their own meditation sessions"
    ON meditation_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meditation sessions"
    ON meditation_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meditation sessions"
    ON meditation_sessions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Meditation programs policies
CREATE POLICY "Anyone can view meditation programs"
    ON meditation_programs FOR SELECT
    USING (true);

-- Meditation progress policies
CREATE POLICY "Users can view their own meditation progress"
    ON meditation_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own meditation progress"
    ON meditation_progress FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Mood entries policies
CREATE POLICY "Users can view their own mood entries"
    ON mood_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood entries"
    ON mood_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood entries"
    ON mood_entries FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- OCD events policies
CREATE POLICY "Users can view their own OCD events"
    ON ocd_events FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own OCD events"
    ON ocd_events FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own OCD events"
    ON ocd_events FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ERP tasks policies
CREATE POLICY "Users can view their own ERP tasks"
    ON erp_tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ERP tasks"
    ON erp_tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ERP tasks"
    ON erp_tasks FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Coping strategies policies
CREATE POLICY "Anyone can view coping strategies"
    ON coping_strategies FOR SELECT
    USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_user_id ON meditation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_meditation_progress_user_id ON meditation_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_ocd_events_user_id ON ocd_events(user_id);
CREATE INDEX IF NOT EXISTS idx_erp_tasks_user_id ON erp_tasks(user_id);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_user_date ON meditation_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON mood_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ocd_events_user_date ON ocd_events(user_id, created_at DESC);
