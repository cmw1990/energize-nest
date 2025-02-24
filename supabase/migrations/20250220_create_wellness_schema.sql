-- Create wellness schema
CREATE SCHEMA IF NOT EXISTS wellness;

-- Enable Row Level Security
ALTER TABLE wellness.user_wellness_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness.user_wellness_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness.meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness.energy_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness.stress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness.anxiety_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness.sleep_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness.relationship_notes ENABLE ROW LEVEL SECURITY;

-- User Wellness Metrics
CREATE TABLE wellness.user_wellness_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    meditation_minutes INTEGER DEFAULT 0,
    mood_score INTEGER CHECK (mood_score BETWEEN 0 AND 100),
    energy_level INTEGER CHECK (energy_level BETWEEN 0 AND 100),
    focus_score INTEGER CHECK (focus_score BETWEEN 0 AND 100),
    stress_level INTEGER CHECK (stress_level BETWEEN 0 AND 100),
    anxiety_level INTEGER CHECK (anxiety_level BETWEEN 0 AND 100),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 0 AND 100),
    relationship_satisfaction INTEGER CHECK (relationship_satisfaction BETWEEN 0 AND 100),
    daily_achievements TEXT[],
    emotional_triggers TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Wellness Goals
CREATE TABLE wellness.user_wellness_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    meditation_target INTEGER DEFAULT 20,
    mood_target INTEGER CHECK (mood_target BETWEEN 0 AND 100),
    energy_target INTEGER CHECK (energy_target BETWEEN 0 AND 100),
    focus_target INTEGER CHECK (focus_target BETWEEN 0 AND 100),
    stress_reduction INTEGER CHECK (stress_reduction BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meditation Sessions
CREATE TABLE wellness.meditation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    duration_minutes INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    focus_level INTEGER CHECK (focus_level BETWEEN 0 AND 100),
    completed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mood Entries
CREATE TABLE wellness.mood_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mood_score INTEGER CHECK (mood_score BETWEEN 0 AND 100),
    energy_level INTEGER CHECK (energy_level BETWEEN 0 AND 100),
    activities TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Energy Logs
CREATE TABLE wellness.energy_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    energy_level INTEGER CHECK (energy_level BETWEEN 0 AND 100),
    mental_fatigue INTEGER CHECK (mental_fatigue BETWEEN 0 AND 100),
    physical_fatigue INTEGER CHECK (physical_fatigue BETWEEN 0 AND 100),
    activities TEXT[],
    recovery_actions TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Focus Sessions
CREATE TABLE wellness.focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    duration_minutes INTEGER NOT NULL,
    focus_score INTEGER CHECK (focus_score BETWEEN 0 AND 100),
    interruptions INTEGER DEFAULT 0,
    task_completed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stress Logs
CREATE TABLE wellness.stress_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stress_level INTEGER CHECK (stress_level BETWEEN 0 AND 100),
    triggers TEXT[],
    coping_strategies TEXT[],
    effectiveness INTEGER CHECK (effectiveness BETWEEN 0 AND 100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anxiety Entries
CREATE TABLE wellness.anxiety_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    anxiety_level INTEGER CHECK (anxiety_level BETWEEN 0 AND 100),
    physical_symptoms TEXT[],
    triggers TEXT[],
    coping_methods TEXT[],
    effectiveness INTEGER CHECK (effectiveness BETWEEN 0 AND 100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sleep Records
CREATE TABLE wellness.sleep_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sleep_duration_minutes INTEGER NOT NULL,
    quality_score INTEGER CHECK (quality_score BETWEEN 0 AND 100),
    deep_sleep_minutes INTEGER,
    rem_sleep_minutes INTEGER,
    interruptions INTEGER DEFAULT 0,
    pre_sleep_activities TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relationship Notes
CREATE TABLE wellness.relationship_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    satisfaction_score INTEGER CHECK (satisfaction_score BETWEEN 0 AND 100),
    challenges TEXT[],
    improvements TEXT[],
    goals TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS Policies
CREATE POLICY "Users can view their own wellness metrics"
    ON wellness.user_wellness_metrics
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wellness metrics"
    ON wellness.user_wellness_metrics
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Repeat similar policies for other tables...

-- Create indexes for better performance
CREATE INDEX idx_user_wellness_metrics_user_id ON wellness.user_wellness_metrics(user_id);
CREATE INDEX idx_user_wellness_goals_user_id ON wellness.user_wellness_goals(user_id);
CREATE INDEX idx_meditation_sessions_user_id ON wellness.meditation_sessions(user_id);
CREATE INDEX idx_mood_entries_user_id ON wellness.mood_entries(user_id);
CREATE INDEX idx_energy_logs_user_id ON wellness.energy_logs(user_id);
CREATE INDEX idx_focus_sessions_user_id ON wellness.focus_sessions(user_id);
CREATE INDEX idx_stress_logs_user_id ON wellness.stress_logs(user_id);
CREATE INDEX idx_anxiety_entries_user_id ON wellness.anxiety_entries(user_id);
CREATE INDEX idx_sleep_records_user_id ON wellness.sleep_records(user_id);
CREATE INDEX idx_relationship_notes_user_id ON wellness.relationship_notes(user_id);

-- Create timestamp update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_user_wellness_metrics_updated_at
    BEFORE UPDATE ON wellness.user_wellness_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_wellness_goals_updated_at
    BEFORE UPDATE ON wellness.user_wellness_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
