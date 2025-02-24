-- Sound Environments
CREATE TABLE IF NOT EXISTS sound_environments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('nature', 'white_noise', 'binaural_beats', 'music', 'ambient')),
    frequency_hz INTEGER,
    recommended_duration_minutes INTEGER,
    energy_boost_rating INTEGER CHECK (energy_boost_rating BETWEEN 1 AND 10),
    focus_enhancement_rating INTEGER CHECK (focus_enhancement_rating BETWEEN 1 AND 10),
    audio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Visual Focus Tools
CREATE TABLE IF NOT EXISTS visual_focus_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('timer', 'progress_bar', 'growing_tree', 'particle_system')),
    visual_settings JSONB,
    animation_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Focus Rewards
CREATE TABLE IF NOT EXISTS focus_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_type TEXT CHECK (reward_type IN ('tree_planted', 'points_earned', 'badge_unlocked', 'streak_milestone')),
    value INTEGER,
    earned_at TIMESTAMPTZ NOT NULL,
    session_id UUID REFERENCES focus_tracking(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Task Templates
CREATE TABLE IF NOT EXISTS task_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('work', 'study', 'creative', 'routine', 'exercise')),
    estimated_energy_required INTEGER CHECK (estimated_energy_required BETWEEN 1 AND 10),
    recommended_time_of_day TEXT CHECK (recommended_time_of_day IN ('morning', 'afternoon', 'evening', 'night')),
    typical_duration_minutes INTEGER,
    steps JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Focus Zones
CREATE TABLE IF NOT EXISTS focus_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT,
    environment_settings JSONB,
    productivity_rating INTEGER CHECK (productivity_rating BETWEEN 1 AND 10),
    energy_impact INTEGER CHECK (energy_impact BETWEEN -5 AND 5),
    preferred_tasks TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Time Blocking
CREATE TABLE IF NOT EXISTS time_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    category TEXT CHECK (category IN ('deep_work', 'shallow_work', 'break', 'exercise', 'social')),
    energy_level_required INTEGER CHECK (energy_level_required BETWEEN 1 AND 10),
    recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSONB,
    tasks JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Focus Insights
CREATE TABLE IF NOT EXISTS focus_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date_recorded DATE NOT NULL,
    peak_focus_times JSONB,
    energy_patterns JSONB,
    productivity_score INTEGER CHECK (productivity_score BETWEEN 1 AND 100),
    focus_duration_minutes INTEGER,
    distractions_analysis JSONB,
    recommendations TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Smart Breaks
CREATE TABLE IF NOT EXISTS smart_breaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER,
    break_type TEXT CHECK (break_type IN ('movement', 'meditation', 'social', 'nature', 'power_nap')),
    energy_impact INTEGER CHECK (energy_impact BETWEEN -5 AND 5),
    effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 10),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Focus Streaks
CREATE TABLE IF NOT EXISTS focus_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    streak_type TEXT CHECK (streak_type IN ('daily_focus', 'task_completion', 'productivity_score')),
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_tracked_date DATE,
    rewards_earned JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Distraction Blockers
CREATE TABLE IF NOT EXISTS distraction_blockers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    blocker_type TEXT CHECK (blocker_type IN ('website', 'app', 'notification', 'custom')),
    rules JSONB,
    schedule JSONB,
    effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 10),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE sound_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE visual_focus_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE distraction_blockers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view sound environments"
    ON sound_environments FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view visual focus tools"
    ON visual_focus_tools FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own focus rewards"
    ON focus_rewards FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view task templates"
    ON task_templates FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own focus zones"
    ON focus_zones FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own time blocks"
    ON time_blocks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own focus insights"
    ON focus_insights FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own smart breaks"
    ON smart_breaks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own focus streaks"
    ON focus_streaks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own distraction blockers"
    ON distraction_blockers FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_focus_rewards_user ON focus_rewards(user_id);
CREATE INDEX idx_focus_zones_user ON focus_zones(user_id);
CREATE INDEX idx_time_blocks_user ON time_blocks(user_id);
CREATE INDEX idx_focus_insights_user ON focus_insights(user_id);
CREATE INDEX idx_smart_breaks_user ON smart_breaks(user_id);
CREATE INDEX idx_focus_streaks_user ON focus_streaks(user_id);
CREATE INDEX idx_distraction_blockers_user ON distraction_blockers(user_id);
