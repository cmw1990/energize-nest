-- Stress Tracking
CREATE TABLE IF NOT EXISTS stress_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    energy_impact INTEGER CHECK (energy_impact BETWEEN -5 AND 5),
    physical_symptoms TEXT[],
    emotional_state TEXT[],
    triggers TEXT[],
    recorded_at TIMESTAMPTZ NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Relaxation Sessions
CREATE TABLE IF NOT EXISTS relaxation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type TEXT CHECK (session_type IN ('meditation', 'breathing', 'yoga', 'nature', 'music', 'reading', 'other')),
    start_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER,
    technique_used TEXT,
    guided_by TEXT,
    location TEXT,
    environment_quality INTEGER CHECK (environment_quality BETWEEN 1 AND 10),
    effectiveness INTEGER CHECK (effectiveness BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Breathing Exercises
CREATE TABLE IF NOT EXISTS breathing_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    inhale_seconds INTEGER,
    hold_seconds INTEGER,
    exhale_seconds INTEGER,
    repetitions INTEGER,
    benefits TEXT[],
    contraindications TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Breathing Sessions
CREATE TABLE IF NOT EXISTS breathing_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pattern_id UUID REFERENCES breathing_patterns(id),
    start_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER,
    completed_cycles INTEGER,
    stress_level_before INTEGER CHECK (stress_level_before BETWEEN 1 AND 10),
    stress_level_after INTEGER CHECK (stress_level_after BETWEEN 1 AND 10),
    energy_level_before INTEGER CHECK (energy_level_before BETWEEN 1 AND 10),
    energy_level_after INTEGER CHECK (energy_level_after BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Stress Management Techniques
CREATE TABLE IF NOT EXISTS stress_management_techniques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    technique_name TEXT NOT NULL,
    category TEXT CHECK (category IN ('physical', 'mental', 'emotional', 'social', 'environmental')),
    effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 10),
    energy_impact INTEGER CHECK (energy_impact BETWEEN -5 AND 5),
    situation_triggers TEXT[],
    implementation_steps TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Biometric Measurements
CREATE TABLE IF NOT EXISTS stress_biometrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    heart_rate INTEGER,
    heart_rate_variability INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    respiratory_rate INTEGER,
    skin_conductance DECIMAL(6,2),
    recorded_at TIMESTAMPTZ NOT NULL,
    stress_indication TEXT CHECK (stress_indication IN ('low', 'moderate', 'high')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Recovery Activities
CREATE TABLE IF NOT EXISTS recovery_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT CHECK (activity_type IN ('massage', 'sauna', 'cold_therapy', 'stretching', 'nap', 'other')),
    start_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER,
    intensity TEXT CHECK (intensity IN ('light', 'moderate', 'intense')),
    effectiveness INTEGER CHECK (effectiveness BETWEEN 1 AND 10),
    energy_impact INTEGER CHECK (energy_impact BETWEEN -5 AND 5),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Stress Analytics
CREATE TABLE IF NOT EXISTS stress_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date_recorded DATE NOT NULL,
    average_stress_level DECIMAL(3,1),
    stress_triggers_frequency JSONB,
    coping_techniques_used TEXT[],
    recovery_time_minutes INTEGER,
    relaxation_sessions_count INTEGER,
    breathing_sessions_count INTEGER,
    biometric_stress_indicators JSONB,
    energy_impact_avg DECIMAL(3,1),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE stress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE relaxation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE breathing_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE breathing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stress_management_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE stress_biometrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE stress_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own stress tracking"
    ON stress_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own relaxation sessions"
    ON relaxation_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view breathing patterns"
    ON breathing_patterns FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own breathing sessions"
    ON breathing_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own stress management techniques"
    ON stress_management_techniques FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own stress biometrics"
    ON stress_biometrics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own recovery activities"
    ON recovery_activities FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own stress analytics"
    ON stress_analytics FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_stress_tracking_user ON stress_tracking(user_id);
CREATE INDEX idx_relaxation_sessions_user ON relaxation_sessions(user_id);
CREATE INDEX idx_breathing_sessions_user ON breathing_sessions(user_id);
CREATE INDEX idx_stress_management_techniques_user ON stress_management_techniques(user_id);
CREATE INDEX idx_stress_biometrics_user ON stress_biometrics(user_id);
CREATE INDEX idx_recovery_activities_user ON recovery_activities(user_id);
CREATE INDEX idx_stress_analytics_user ON stress_analytics(user_id);
