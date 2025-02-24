-- Smart Alarm
CREATE TABLE IF NOT EXISTS smart_alarms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_wake_time TIME NOT NULL,
    wake_window_minutes INTEGER DEFAULT 30,
    days_active TEXT[] CHECK (days_active <@ ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    smart_features JSONB,
    backup_alarm_time TIME,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sleep Sounds
CREATE TABLE IF NOT EXISTS sleep_sounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('nature', 'white_noise', 'meditation', 'music', 'story')),
    duration_minutes INTEGER,
    volume_profile JSONB,
    fade_out_minutes INTEGER,
    popularity_score INTEGER CHECK (popularity_score BETWEEN 1 AND 100),
    audio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Sleep Stories
CREATE TABLE IF NOT EXISTS sleep_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    narrator TEXT,
    duration_minutes INTEGER,
    category TEXT CHECK (category IN ('fiction', 'meditation', 'nature', 'science', 'travel')),
    recommended_age_group TEXT CHECK (recommended_age_group IN ('children', 'teens', 'adults', 'all')),
    language TEXT,
    audio_url TEXT,
    transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Chronotype Analysis
CREATE TABLE IF NOT EXISTS chronotype_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    chronotype TEXT CHECK (chronotype IN ('lion', 'bear', 'wolf', 'dolphin')),
    energy_peak_times JSONB,
    recommended_sleep_schedule JSONB,
    lifestyle_recommendations TEXT[],
    assessment_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Sleep Hygiene
CREATE TABLE IF NOT EXISTS sleep_hygiene_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date_recorded DATE NOT NULL,
    caffeine_cutoff_time TIME,
    last_meal_time TIME,
    exercise_time TIME,
    screen_time_end TIME,
    bedroom_temperature DECIMAL(4,1),
    bedroom_humidity INTEGER CHECK (bedroom_humidity BETWEEN 0 AND 100),
    light_exposure_morning_minutes INTEGER,
    relaxation_routine_completed BOOLEAN,
    sleep_quality_impact INTEGER CHECK (sleep_quality_impact BETWEEN -5 AND 5),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Dream Journal
CREATE TABLE IF NOT EXISTS dream_journal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date_recorded DATE NOT NULL,
    dream_description TEXT,
    emotions TEXT[],
    themes TEXT[],
    clarity INTEGER CHECK (clarity BETWEEN 1 AND 10),
    lucidity BOOLEAN,
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Sleep Debt Calculator
CREATE TABLE IF NOT EXISTS sleep_debt (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    week_starting DATE NOT NULL,
    optimal_sleep_hours INTEGER,
    actual_sleep_hours INTEGER,
    debt_hours INTEGER,
    recovery_plan TEXT,
    impact_on_energy INTEGER CHECK (impact_on_energy BETWEEN -5 AND 5),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sleep Optimization Tips
CREATE TABLE IF NOT EXISTS sleep_tips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT CHECK (category IN ('routine', 'environment', 'nutrition', 'exercise', 'mindfulness')),
    description TEXT,
    scientific_evidence TEXT,
    difficulty TEXT CHECK (difficulty IN ('easy', 'moderate', 'challenging')),
    implementation_steps JSONB,
    expected_benefits TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Sleep Quality Predictions
CREATE TABLE IF NOT EXISTS sleep_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    predicted_quality INTEGER CHECK (predicted_quality BETWEEN 1 AND 100),
    factors_considered JSONB,
    recommendations TEXT[],
    accuracy_score INTEGER CHECK (accuracy_score BETWEEN 1 AND 100),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Sleep Achievements
CREATE TABLE IF NOT EXISTS sleep_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type TEXT CHECK (achievement_type IN ('streak', 'quality', 'routine', 'improvement')),
    title TEXT NOT NULL,
    description TEXT,
    earned_at TIMESTAMPTZ,
    progress JSONB,
    rewards JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE smart_alarms ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_sounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chronotype_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_hygiene_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE dream_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_debt ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own smart alarms"
    ON smart_alarms FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view sleep sounds"
    ON sleep_sounds FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view sleep stories"
    ON sleep_stories FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own chronotype assessments"
    ON chronotype_assessments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sleep hygiene tracking"
    ON sleep_hygiene_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own dream journal"
    ON dream_journal FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sleep debt"
    ON sleep_debt FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view sleep tips"
    ON sleep_tips FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own sleep predictions"
    ON sleep_predictions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sleep achievements"
    ON sleep_achievements FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_smart_alarms_user ON smart_alarms(user_id);
CREATE INDEX idx_chronotype_assessments_user ON chronotype_assessments(user_id);
CREATE INDEX idx_sleep_hygiene_tracking_user ON sleep_hygiene_tracking(user_id);
CREATE INDEX idx_dream_journal_user ON dream_journal(user_id);
CREATE INDEX idx_sleep_debt_user ON sleep_debt(user_id);
CREATE INDEX idx_sleep_predictions_user ON sleep_predictions(user_id);
CREATE INDEX idx_sleep_achievements_user ON sleep_achievements(user_id);
