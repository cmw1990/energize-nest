-- Create enum types
CREATE TYPE game_category AS ENUM (
  'memory', 'attention', 'processing', 'problem_solving', 'visual_spatial',
  'language', 'math', 'mindfulness', 'relaxation', 'emotion', 'stress_relief',
  'meditation', 'energy_boost', 'focus_restore', 'wind_down', 'morning_boost'
);

CREATE TYPE game_type AS ENUM (
  -- Memory Games
  'sequence_recall', 'pattern_match', 'spatial_memory', 'working_memory', 'associative_memory',
  -- Attention Games
  'sustained_attention', 'divided_attention', 'selective_attention', 'attention_switch',
  -- Processing Games
  'reaction_time', 'processing_speed', 'visual_search',
  -- Problem Solving
  'logic_puzzle', 'pattern_completion', 'strategic_planning', 'rule_discovery',
  -- Visual Spatial
  'mental_rotation', 'spatial_navigation', 'pattern_recognition', 'block_construction',
  -- Language Games
  'word_association', 'vocabulary_builder', 'sentence_completion', 'verbal_fluency',
  -- Math Games
  'mental_arithmetic', 'number_patterns', 'estimation', 'math_logic',
  -- Mindfulness Games
  'breath_awareness', 'body_scan', 'mindful_observation', 'thought_bubbles',
  -- Relaxation Games
  'color_flow', 'sound_journey', 'nature_walk', 'bubble_pop',
  -- Emotion Games
  'emotion_recognition', 'mood_tracker', 'empathy_builder', 'emotional_regulation',
  -- Stress Relief
  'stress_buster', 'calm_breather', 'tension_release', 'worry_noter',
  -- Meditation
  'guided_meditation', 'open_awareness', 'loving_kindness', 'body_meditation',
  -- Energy Management
  'energy_breather', 'power_posing', 'quick_activator', 'focus_charger'
);

CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE energy_impact AS ENUM ('low', 'medium', 'high');
CREATE TYPE mood_impact AS ENUM ('calming', 'neutral', 'energizing');

-- Game configurations table
CREATE TABLE game_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type game_type NOT NULL,
    category game_category NOT NULL,
    difficulty difficulty_level NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    energy_impact energy_impact NOT NULL,
    mood_impact mood_impact NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Game progress tracking
CREATE TABLE game_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES game_configs(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    accuracy DECIMAL CHECK (accuracy >= 0 AND accuracy <= 100),
    time_spent INTEGER NOT NULL, -- in seconds
    difficulty difficulty_level NOT NULL,
    metrics JSONB NOT NULL DEFAULT '{
        "reactionTime": null,
        "correctAnswers": 0,
        "wrongAnswers": 0,
        "streaks": 0,
        "focusScore": null
    }',
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Game achievements
CREATE TABLE game_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES game_configs(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    criteria JSONB NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Game statistics
CREATE TABLE game_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_type game_type NOT NULL,
    total_time_played INTEGER DEFAULT 0,
    games_completed INTEGER DEFAULT 0,
    average_score DECIMAL DEFAULT 0,
    high_score INTEGER DEFAULT 0,
    skill_level INTEGER DEFAULT 1,
    improvement DECIMAL DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_played TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Adaptive difficulty settings
CREATE TABLE adaptive_difficulty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES game_configs(id) ON DELETE CASCADE,
    base_level INTEGER NOT NULL DEFAULT 1,
    current_level INTEGER NOT NULL DEFAULT 1,
    progression_rate DECIMAL NOT NULL DEFAULT 1.0,
    adaptation_speed DECIMAL NOT NULL DEFAULT 1.0,
    performance_history INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Game sessions
CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES game_configs(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    initial_energy INTEGER CHECK (initial_energy >= 0 AND initial_energy <= 100),
    final_energy INTEGER CHECK (final_energy >= 0 AND final_energy <= 100),
    mood_before VARCHAR(50),
    mood_after VARCHAR(50),
    focus_level INTEGER CHECK (focus_level >= 0 AND focus_level <= 100),
    stress_level INTEGER CHECK (stress_level >= 0 AND stress_level <= 100),
    notes TEXT
);

-- Indexes
CREATE INDEX idx_game_progress_user ON game_progress(user_id);
CREATE INDEX idx_game_progress_game ON game_progress(game_id);
CREATE INDEX idx_game_achievements_user ON game_achievements(user_id);
CREATE INDEX idx_game_stats_user ON game_stats(user_id);
CREATE INDEX idx_game_stats_type ON game_stats(game_type);
CREATE INDEX idx_adaptive_difficulty_user ON adaptive_difficulty(user_id);
CREATE INDEX idx_game_sessions_user ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_start ON game_sessions(start_time);

-- RLS Policies
ALTER TABLE game_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_difficulty ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Everyone can view game configurations
CREATE POLICY "Game configs are viewable by all users"
    ON game_configs FOR SELECT
    USING (true);

-- Users can only view and modify their own game data
CREATE POLICY "Users can view their own game progress"
    ON game_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game progress"
    ON game_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own achievements"
    ON game_achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own game stats"
    ON game_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own adaptive difficulty"
    ON adaptive_difficulty FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own game sessions"
    ON game_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game sessions"
    ON game_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Update timestamps
CREATE TRIGGER update_game_configs_updated_at
    BEFORE UPDATE ON game_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_stats_updated_at
    BEFORE UPDATE ON game_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
