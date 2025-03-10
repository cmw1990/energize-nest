-- Enhanced Workout Planning
CREATE TABLE IF NOT EXISTS workout_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration_weeks INTEGER,
    category TEXT CHECK (category IN ('strength', 'cardio', 'flexibility', 'hybrid')),
    tags TEXT[],
    equipment_needed TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workout_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES workout_programs(id),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    planned_date TIMESTAMPTZ,
    completed_date TIMESTAMPTZ,
    duration_minutes INTEGER,
    calories_burned INTEGER,
    average_heart_rate INTEGER,
    max_heart_rate INTEGER,
    perceived_effort INTEGER CHECK (perceived_effort BETWEEN 1 AND 10),
    notes TEXT,
    mood_before TEXT,
    mood_after TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Exercise Library
CREATE TABLE IF NOT EXISTS exercise_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('strength', 'cardio', 'flexibility', 'balance', 'sport_specific')),
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    muscle_groups TEXT[],
    equipment_needed TEXT[],
    video_url TEXT,
    form_cues TEXT[],
    common_mistakes TEXT[],
    modifications TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Workout Exercises
CREATE TABLE IF NOT EXISTS workout_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercise_library(id),
    order_in_workout INTEGER,
    sets INTEGER,
    reps INTEGER,
    weight_kg DECIMAL(6,2),
    distance_km DECIMAL(6,2),
    duration_seconds INTEGER,
    rest_seconds INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Progress Photos
CREATE TABLE IF NOT EXISTS progress_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    category TEXT CHECK (category IN ('front', 'back', 'side', 'custom')),
    weight_kg DECIMAL(6,2),
    measurements JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Body Measurements
CREATE TABLE IF NOT EXISTS body_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    weight_kg DECIMAL(6,2),
    height_cm DECIMAL(6,2),
    body_fat_percentage DECIMAL(4,1),
    chest_cm DECIMAL(6,2),
    waist_cm DECIMAL(6,2),
    hips_cm DECIMAL(6,2),
    biceps_cm DECIMAL(6,2),
    thighs_cm DECIMAL(6,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Movement Analysis
CREATE TABLE IF NOT EXISTS movement_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercise_library(id),
    video_url TEXT,
    ai_analysis JSONB,
    form_score INTEGER CHECK (form_score BETWEEN 0 AND 100),
    recommendations TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Fitness Goals
CREATE TABLE IF NOT EXISTS fitness_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('strength', 'endurance', 'flexibility', 'weight', 'custom')),
    target_value DECIMAL(8,2),
    current_value DECIMAL(8,2),
    unit TEXT,
    start_date DATE,
    target_date DATE,
    status TEXT CHECK (status IN ('active', 'completed', 'abandoned')) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view workout programs"
    ON workout_programs FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own workout sessions"
    ON workout_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view exercise library"
    ON exercise_library FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own workout exercises"
    ON workout_exercises FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM workout_sessions
        WHERE workout_sessions.id = session_id
        AND workout_sessions.user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own progress photos"
    ON progress_photos FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own body measurements"
    ON body_measurements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own movement analysis"
    ON movement_analysis FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own fitness goals"
    ON fitness_goals FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_workout_sessions_user ON workout_sessions(user_id);
CREATE INDEX idx_workout_exercises_session ON workout_exercises(session_id);
CREATE INDEX idx_progress_photos_user ON progress_photos(user_id);
CREATE INDEX idx_body_measurements_user ON body_measurements(user_id);
CREATE INDEX idx_movement_analysis_user ON movement_analysis(user_id);
CREATE INDEX idx_fitness_goals_user ON fitness_goals(user_id);
