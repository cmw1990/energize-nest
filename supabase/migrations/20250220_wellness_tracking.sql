-- Create wellness_scores table
CREATE TABLE IF NOT EXISTS wellness_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    anxiety NUMERIC(3,1) CHECK (anxiety >= 0 AND anxiety <= 10),
    depression NUMERIC(3,1) CHECK (depression >= 0 AND depression <= 10),
    stress NUMERIC(3,1) CHECK (stress >= 0 AND stress <= 10),
    sleep NUMERIC(3,1) CHECK (sleep >= 0 AND sleep <= 10),
    relationships NUMERIC(3,1) CHECK (relationships >= 0 AND relationships <= 10),
    mindfulness NUMERIC(3,1) CHECK (mindfulness >= 0 AND mindfulness <= 10),
    gratitude NUMERIC(3,1) CHECK (gratitude >= 0 AND gratitude <= 10),
    goals NUMERIC(3,1) CHECK (goals >= 0 AND goals <= 10),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    progress INTEGER CHECK (progress >= 0 AND progress <= 100),
    unlocked BOOLEAN DEFAULT FALSE,
    date_unlocked TIMESTAMPTZ,
    requirements JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create wellness_insights view
CREATE OR REPLACE VIEW wellness_insights AS
SELECT 
    user_id,
    date_trunc('week', date) as week_start,
    AVG(anxiety) as avg_anxiety,
    AVG(depression) as avg_depression,
    AVG(stress) as avg_stress,
    AVG(sleep) as avg_sleep,
    AVG(relationships) as avg_relationships,
    AVG(mindfulness) as avg_mindfulness,
    AVG(gratitude) as avg_gratitude,
    AVG(goals) as avg_goals,
    (
        AVG(anxiety) + AVG(depression) + AVG(stress) + 
        AVG(sleep) + AVG(relationships) + AVG(mindfulness) + 
        AVG(gratitude) + AVG(goals)
    ) / 8 as overall_score
FROM wellness_scores
GROUP BY user_id, date_trunc('week', date);

-- Create achievement_progress view
CREATE OR REPLACE VIEW achievement_progress AS
SELECT 
    user_id,
    category,
    COUNT(*) as total_achievements,
    COUNT(*) FILTER (WHERE unlocked) as unlocked_achievements,
    ROUND((COUNT(*) FILTER (WHERE unlocked)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2) as completion_percentage
FROM achievements
GROUP BY user_id, category;

-- Create function to calculate streaks
CREATE OR REPLACE FUNCTION calculate_wellness_streak(p_user_id UUID)
RETURNS TABLE (
    streak_type VARCHAR(50),
    current_streak INTEGER,
    longest_streak INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH daily_scores AS (
        SELECT 
            date,
            CASE 
                WHEN (anxiety + depression + stress + sleep + relationships + 
                      mindfulness + gratitude + goals) / 8 >= 7 THEN TRUE
                ELSE FALSE
            END as good_day,
            LAG(date) OVER (ORDER BY date) as prev_date
        FROM wellness_scores
        WHERE user_id = p_user_id
        ORDER BY date
    ),
    streaks AS (
        SELECT
            date,
            good_day,
            CASE
                WHEN date - prev_date = 1 AND good_day THEN 1
                ELSE 0
            END as continues_streak
        FROM daily_scores
    ),
    streak_groups AS (
        SELECT
            good_day,
            SUM(continues_streak) OVER (ORDER BY date) as streak_group,
            COUNT(*) OVER (PARTITION BY SUM(continues_streak) OVER (ORDER BY date)) as streak_length
        FROM streaks
        WHERE good_day
    )
    SELECT 
        'Wellness'::VARCHAR(50) as streak_type,
        COALESCE(MAX(streak_length) FILTER (WHERE streak_group = (SELECT MAX(streak_group) FROM streak_groups)), 0) as current_streak,
        COALESCE(MAX(streak_length), 0) as longest_streak
    FROM streak_groups;
END;
$$;

-- Add RLS policies
ALTER TABLE wellness_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wellness scores"
    ON wellness_scores FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wellness scores"
    ON wellness_scores FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wellness scores"
    ON wellness_scores FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own achievements"
    ON achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
    ON achievements FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_wellness_scores_user_date ON wellness_scores(user_id, date);
CREATE INDEX idx_achievements_user_category ON achievements(user_id, category);
CREATE INDEX idx_wellness_scores_date ON wellness_scores(date);
CREATE INDEX idx_achievements_unlocked ON achievements(unlocked);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wellness_scores_updated_at
    BEFORE UPDATE ON wellness_scores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at
    BEFORE UPDATE ON achievements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
