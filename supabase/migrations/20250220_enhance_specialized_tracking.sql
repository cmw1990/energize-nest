-- Specialized Female Health Tracking
CREATE TABLE IF NOT EXISTS menstrual_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    cycle_start_date DATE NOT NULL,
    cycle_end_date DATE,
    flow_intensity INTEGER CHECK (flow_intensity BETWEEN 1 AND 5),
    symptoms TEXT[],
    mood TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fertility_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    basal_temperature DECIMAL(4,2),
    cervical_fluid_type TEXT CHECK (cervical_fluid_type IN ('dry', 'sticky', 'creamy', 'watery', 'egg_white')),
    ovulation_test_result BOOLEAN,
    cervical_position TEXT CHECK (cervical_position IN ('low', 'medium', 'high')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Pregnancy Tracking
CREATE TABLE IF NOT EXISTS pregnancy_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    current_week INTEGER CHECK (current_week BETWEEN 1 AND 42),
    weight_kg DECIMAL(5,2),
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    symptoms TEXT[],
    mood TEXT[],
    baby_movement_count INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced Sleep Tracking
CREATE TABLE IF NOT EXISTS sleep_environment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sleep_metric_id UUID REFERENCES sleep_metrics(id) ON DELETE CASCADE,
    temperature_celsius DECIMAL(4,1),
    humidity_percent INTEGER CHECK (humidity_percent BETWEEN 0 AND 100),
    noise_level_db DECIMAL(4,1),
    light_level_lux INTEGER,
    air_quality_index INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sleep_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sleep_metric_id UUID REFERENCES sleep_metrics(id) ON DELETE CASCADE,
    stage TEXT CHECK (stage IN ('light', 'deep', 'rem', 'awake')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced Nutrition Tracking
CREATE TABLE IF NOT EXISTS meal_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nutrition_log_id UUID REFERENCES nutrition_logs(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    ai_analysis JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS nutrition_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('calories', 'protein', 'carbs', 'fats', 'water', 'custom')),
    target_value DECIMAL(8,2),
    current_value DECIMAL(8,2),
    frequency TEXT CHECK (frequency IN ('daily', 'weekly')),
    start_date DATE,
    end_date DATE,
    status TEXT CHECK (status IN ('active', 'completed', 'abandoned')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Recovery & Sobriety Tracking
CREATE TABLE IF NOT EXISTS recovery_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('alcohol', 'nicotine', 'other_substance', 'custom')),
    start_date DATE NOT NULL,
    days_sober INTEGER DEFAULT 0,
    trigger_situations TEXT[],
    coping_strategies TEXT[],
    support_contacts TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recovery_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recovery_tracking_id UUID REFERENCES recovery_tracking(id) ON DELETE CASCADE,
    milestone_date DATE NOT NULL,
    days_achieved INTEGER,
    description TEXT,
    reward TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Mental Health Tracking
CREATE TABLE IF NOT EXISTS therapy_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    therapist_id UUID,
    session_date TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER,
    topics_discussed TEXT[],
    mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 10),
    mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 10),
    notes TEXT,
    next_session_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cbt_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    situation TEXT NOT NULL,
    thoughts TEXT[],
    emotions TEXT[],
    behaviors TEXT[],
    alternative_thoughts TEXT[],
    outcome TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Eye Health Tracking
CREATE TABLE IF NOT EXISTS eye_strain_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    screen_time_minutes INTEGER,
    break_count INTEGER,
    exercise_completed BOOLEAN,
    symptoms TEXT[],
    eye_drops_used BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced Activity Tracking
CREATE TABLE IF NOT EXISTS exercise_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    exercise_type TEXT,
    sets INTEGER,
    reps INTEGER,
    weight_kg DECIMAL(6,2),
    distance_km DECIMAL(6,2),
    speed_kmh DECIMAL(4,1),
    heart_rate_avg INTEGER,
    heart_rate_max INTEGER,
    calories_burned INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Insurance Claims Enhancement
CREATE TABLE IF NOT EXISTS insurance_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    claim_type TEXT CHECK (claim_type IN ('medical', 'wellness', 'therapy', 'medication', 'other')),
    amount DECIMAL(10,2),
    date_of_service DATE,
    status TEXT CHECK (status IN ('draft', 'submitted', 'in_review', 'approved', 'rejected')),
    documents TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE menstrual_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fertility_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE pregnancy_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_environment ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cbt_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE eye_strain_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claims ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
CREATE POLICY "Users can view their own data"
    ON menstrual_cycles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own data"
    ON fertility_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own data"
    ON pregnancy_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view related sleep environment data"
    ON sleep_environment FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM sleep_metrics
        WHERE sleep_metrics.id = sleep_metric_id
        AND sleep_metrics.user_id = auth.uid()
    ));

CREATE POLICY "Users can view related sleep stages data"
    ON sleep_stages FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM sleep_metrics
        WHERE sleep_metrics.id = sleep_metric_id
        AND sleep_metrics.user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own data"
    ON meal_photos FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM nutrition_logs
        WHERE nutrition_logs.id = nutrition_log_id
        AND nutrition_logs.user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own data"
    ON nutrition_goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own data"
    ON recovery_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own data"
    ON recovery_milestones FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM recovery_tracking
        WHERE recovery_tracking.id = recovery_tracking_id
        AND recovery_tracking.user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own data"
    ON therapy_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own data"
    ON cbt_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own data"
    ON eye_strain_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own data"
    ON exercise_details FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM activities
        WHERE activities.id = activity_id
        AND activities.user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own data"
    ON insurance_claims FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_menstrual_cycles_user_date ON menstrual_cycles(user_id, cycle_start_date);
CREATE INDEX idx_fertility_tracking_user_date ON fertility_tracking(user_id, date);
CREATE INDEX idx_pregnancy_tracking_user_date ON pregnancy_tracking(user_id, due_date);
CREATE INDEX idx_sleep_environment_metric ON sleep_environment(sleep_metric_id);
CREATE INDEX idx_sleep_stages_metric ON sleep_stages(sleep_metric_id);
CREATE INDEX idx_meal_photos_log ON meal_photos(nutrition_log_id);
CREATE INDEX idx_nutrition_goals_user ON nutrition_goals(user_id);
CREATE INDEX idx_recovery_tracking_user ON recovery_tracking(user_id);
CREATE INDEX idx_recovery_milestones_tracking ON recovery_milestones(recovery_tracking_id);
CREATE INDEX idx_therapy_sessions_user ON therapy_sessions(user_id);
CREATE INDEX idx_cbt_entries_user ON cbt_entries(user_id);
CREATE INDEX idx_eye_strain_user ON eye_strain_tracking(user_id);
CREATE INDEX idx_exercise_details_activity ON exercise_details(activity_id);
CREATE INDEX idx_insurance_claims_user ON insurance_claims(user_id);
