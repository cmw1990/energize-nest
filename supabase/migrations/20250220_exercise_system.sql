-- Create exercise_categories table
CREATE TABLE IF NOT EXISTS exercise_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    target_audience TEXT[],
    benefits TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create exercise_types table
CREATE TABLE IF NOT EXISTS exercise_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES exercise_categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20),
    duration_range INT4RANGE,
    equipment_needed TEXT[],
    space_required VARCHAR(50),
    is_outdoor BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(category_id, slug)
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type_id UUID REFERENCES exercise_types(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20),
    duration_minutes INTEGER,
    calories_burned INTEGER,
    equipment_needed TEXT[],
    space_required VARCHAR(50),
    target_muscles TEXT[],
    benefits TEXT[],
    contraindications TEXT[],
    preparation_steps TEXT[],
    execution_steps TEXT[],
    common_mistakes TEXT[],
    safety_tips TEXT[],
    variations TEXT[],
    progression_path TEXT[],
    animation_url TEXT,
    video_url TEXT,
    image_urls TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(type_id, slug)
);

-- Create exercise_guides table
CREATE TABLE IF NOT EXISTS exercise_guides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    difficulty_level VARCHAR(20),
    estimated_reading_time INTEGER,
    media_urls TEXT[],
    tags TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create exercise_programs table
CREATE TABLE IF NOT EXISTS exercise_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    target_audience TEXT[],
    duration_weeks INTEGER,
    difficulty_level VARCHAR(20),
    goals TEXT[],
    prerequisites TEXT[],
    equipment_needed TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create program_exercises table (junction table)
CREATE TABLE IF NOT EXISTS program_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES exercise_programs(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
    week_number INTEGER,
    day_number INTEGER,
    sets INTEGER,
    reps INTEGER,
    duration_minutes INTEGER,
    rest_between_sets INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(program_id, exercise_id, week_number, day_number)
);

-- Create user_exercise_logs table
CREATE TABLE IF NOT EXISTS user_exercise_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
    program_id UUID REFERENCES exercise_programs(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    sets_completed INTEGER,
    reps_completed INTEGER,
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 10),
    energy_level_before INTEGER CHECK (energy_level_before BETWEEN 1 AND 10),
    energy_level_after INTEGER CHECK (energy_level_after BETWEEN 1 AND 10),
    mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 10),
    mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create exercise_achievements table
CREATE TABLE IF NOT EXISTS exercise_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    criteria JSONB,
    icon_url TEXT,
    unlocked_at TIMESTAMPTZ,
    progress INTEGER CHECK (progress BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create exercise_preferences table
CREATE TABLE IF NOT EXISTS exercise_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    preferred_duration_range INT4RANGE,
    preferred_difficulty_levels TEXT[],
    preferred_exercise_types TEXT[],
    equipment_available TEXT[],
    space_available VARCHAR(50),
    health_conditions TEXT[],
    goals TEXT[],
    reminder_frequency VARCHAR(50),
    reminder_times TIME[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create exercise_analytics view
CREATE OR REPLACE VIEW exercise_analytics AS
SELECT 
    user_id,
    exercise_id,
    DATE_TRUNC('week', start_time) as week_start,
    COUNT(*) as total_sessions,
    SUM(duration_minutes) as total_minutes,
    AVG(difficulty_rating) as avg_difficulty,
    AVG(energy_level_after - energy_level_before) as energy_impact,
    AVG(mood_after - mood_before) as mood_impact
FROM user_exercise_logs
GROUP BY user_id, exercise_id, DATE_TRUNC('week', start_time);

-- Create exercise_recommendations view
CREATE OR REPLACE VIEW exercise_recommendations AS
WITH user_stats AS (
    SELECT 
        user_id,
        exercise_id,
        AVG(difficulty_rating) as avg_difficulty,
        AVG(energy_level_after - energy_level_before) as avg_energy_impact,
        AVG(mood_after - mood_before) as avg_mood_impact,
        COUNT(*) as completion_count
    FROM user_exercise_logs
    GROUP BY user_id, exercise_id
)
SELECT 
    us.user_id,
    e.id as exercise_id,
    e.name,
    e.difficulty_level,
    e.duration_minutes,
    us.avg_difficulty,
    us.avg_energy_impact,
    us.avg_mood_impact,
    us.completion_count,
    ep.preferred_difficulty_levels,
    ep.preferred_duration_range,
    ep.goals
FROM exercises e
CROSS JOIN exercise_preferences ep
LEFT JOIN user_stats us ON e.id = us.exercise_id AND ep.user_id = us.user_id
WHERE ep.user_id IS NOT NULL;

-- Add RLS policies
ALTER TABLE exercise_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public categories are viewable by everyone"
    ON exercise_categories FOR SELECT
    USING (true);

CREATE POLICY "Public types are viewable by everyone"
    ON exercise_types FOR SELECT
    USING (true);

CREATE POLICY "Public exercises are viewable by everyone"
    ON exercises FOR SELECT
    USING (true);

CREATE POLICY "Public guides are viewable by everyone"
    ON exercise_guides FOR SELECT
    USING (true);

CREATE POLICY "Public programs are viewable by everyone"
    ON exercise_programs FOR SELECT
    USING (true);

CREATE POLICY "Public program exercises are viewable by everyone"
    ON program_exercises FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own exercise logs"
    ON user_exercise_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercise logs"
    ON user_exercise_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise logs"
    ON user_exercise_logs FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own achievements"
    ON exercise_achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own preferences"
    ON exercise_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON exercise_preferences FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_exercise_categories_slug ON exercise_categories(slug);
CREATE INDEX idx_exercise_types_category ON exercise_types(category_id);
CREATE INDEX idx_exercises_type ON exercises(type_id);
CREATE INDEX idx_program_exercises_program ON program_exercises(program_id);
CREATE INDEX idx_user_exercise_logs_user ON user_exercise_logs(user_id);
CREATE INDEX idx_user_exercise_logs_exercise ON user_exercise_logs(exercise_id);
CREATE INDEX idx_exercise_achievements_user ON exercise_achievements(user_id);
CREATE INDEX idx_exercise_preferences_user ON exercise_preferences(user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_exercise_categories_updated_at
    BEFORE UPDATE ON exercise_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercise_types_updated_at
    BEFORE UPDATE ON exercise_types
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at
    BEFORE UPDATE ON exercises
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercise_guides_updated_at
    BEFORE UPDATE ON exercise_guides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercise_programs_updated_at
    BEFORE UPDATE ON exercise_programs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_program_exercises_updated_at
    BEFORE UPDATE ON program_exercises
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_exercise_logs_updated_at
    BEFORE UPDATE ON user_exercise_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercise_achievements_updated_at
    BEFORE UPDATE ON exercise_achievements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercise_preferences_updated_at
    BEFORE UPDATE ON exercise_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
