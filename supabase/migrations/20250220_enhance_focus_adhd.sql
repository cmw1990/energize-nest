-- Task Management
CREATE TABLE IF NOT EXISTS task_management (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
    energy_required INTEGER CHECK (energy_required BETWEEN 1 AND 10),
    best_time_of_day TEXT CHECK (best_time_of_day IN ('morning', 'afternoon', 'evening', 'night')),
    estimated_duration_minutes INTEGER,
    actual_duration_minutes INTEGER,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'deferred')),
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Focus Sessions
CREATE TABLE IF NOT EXISTS focus_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type TEXT CHECK (session_type IN ('pomodoro', 'flow', 'timeblock', 'custom')),
    task_id UUID REFERENCES task_management(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    planned_duration_minutes INTEGER,
    actual_duration_minutes INTEGER,
    interruptions_count INTEGER DEFAULT 0,
    interruption_reasons TEXT[],
    environment_factors JSONB,
    energy_level_before INTEGER CHECK (energy_level_before BETWEEN 1 AND 10),
    energy_level_after INTEGER CHECK (energy_level_after BETWEEN 1 AND 10),
    focus_quality INTEGER CHECK (focus_quality BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ADHD Management Strategies
CREATE TABLE IF NOT EXISTS adhd_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    strategy_name TEXT NOT NULL,
    category TEXT CHECK (category IN ('organization', 'time_management', 'focus', 'emotional_regulation', 'impulse_control')),
    effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 10),
    triggers TEXT[],
    coping_mechanisms TEXT[],
    success_factors TEXT[],
    challenges TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Environment Optimization
CREATE TABLE IF NOT EXISTS environment_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    location TEXT NOT NULL,
    noise_level TEXT CHECK (noise_level IN ('silent', 'ambient', 'moderate', 'loud')),
    lighting TEXT CHECK (lighting IN ('dark', 'dim', 'moderate', 'bright', 'natural')),
    temperature INTEGER,
    air_quality TEXT CHECK (air_quality IN ('poor', 'moderate', 'good', 'excellent')),
    comfort_level INTEGER CHECK (comfort_level BETWEEN 1 AND 10),
    distractions TEXT[],
    productivity_score INTEGER CHECK (productivity_score BETWEEN 1 AND 10),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Medication Tracking
CREATE TABLE IF NOT EXISTS medication_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    medication_name TEXT NOT NULL,
    dosage TEXT,
    time_taken TIMESTAMPTZ,
    effectiveness INTEGER CHECK (effectiveness BETWEEN 1 AND 10),
    side_effects TEXT[],
    mood_impact INTEGER CHECK (mood_impact BETWEEN -5 AND 5),
    energy_impact INTEGER CHECK (energy_impact BETWEEN -5 AND 5),
    focus_impact INTEGER CHECK (focus_impact BETWEEN -5 AND 5),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Productivity Analytics
CREATE TABLE IF NOT EXISTS productivity_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date_recorded DATE NOT NULL,
    tasks_completed INTEGER DEFAULT 0,
    focus_minutes INTEGER DEFAULT 0,
    interruptions INTEGER DEFAULT 0,
    productivity_score INTEGER CHECK (productivity_score BETWEEN 1 AND 100),
    energy_level_avg DECIMAL(3,1),
    focus_quality_avg DECIMAL(3,1),
    stress_level_avg DECIMAL(3,1),
    peak_performance_time TIME,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE task_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE adhd_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE environment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE productivity_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own tasks"
    ON task_management FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own focus sessions"
    ON focus_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own ADHD strategies"
    ON adhd_strategies FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own environment settings"
    ON environment_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own medication tracking"
    ON medication_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own productivity metrics"
    ON productivity_metrics FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_task_management_user ON task_management(user_id);
CREATE INDEX idx_focus_tracking_user ON focus_tracking(user_id);
CREATE INDEX idx_adhd_strategies_user ON adhd_strategies(user_id);
CREATE INDEX idx_environment_settings_user ON environment_settings(user_id);
CREATE INDEX idx_medication_tracking_user ON medication_tracking(user_id);
CREATE INDEX idx_productivity_metrics_user ON productivity_metrics(user_id);
