-- Create goals table
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    target_value INTEGER NOT NULL,
    current_value INTEGER NOT NULL DEFAULT 0,
    frequency TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    reminders BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create habit_entries table
CREATE TABLE habit_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    completed BOOLEAN NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies for goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goals"
    ON goals
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
    ON goals
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
    ON goals
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
    ON goals
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add RLS policies for habit_entries
ALTER TABLE habit_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own habit entries"
    ON habit_entries
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit entries"
    ON habit_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit entries"
    ON habit_entries
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit entries"
    ON habit_entries
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_category ON goals(category);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_habit_entries_user_id ON habit_entries(user_id);
CREATE INDEX idx_habit_entries_goal_id ON habit_entries(goal_id);
CREATE INDEX idx_habit_entries_date ON habit_entries(date);

-- Create view for goal insights
CREATE OR REPLACE VIEW goal_insights AS
SELECT 
    g.user_id,
    g.category,
    COUNT(*) as total_goals,
    COUNT(CASE WHEN g.status = 'completed' THEN 1 END) as completed_goals,
    COUNT(CASE WHEN g.status = 'active' THEN 1 END) as active_goals,
    AVG(CASE 
        WHEN g.status = 'active' THEN 
            LEAST(100, (h.completed_count::float / NULLIF(g.target_value, 0)) * 100)
        ELSE NULL 
    END) as avg_progress
FROM goals g
LEFT JOIN (
    SELECT 
        goal_id,
        COUNT(CASE WHEN completed THEN 1 END) as completed_count
    FROM habit_entries
    GROUP BY goal_id
) h ON h.goal_id = g.id
GROUP BY g.user_id, g.category;

-- Add RLS to the view
ALTER VIEW goal_insights SECURITY DEFINER;

CREATE POLICY "Users can view their own goal insights"
    ON goal_insights
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create function to get habit streaks
CREATE OR REPLACE FUNCTION get_habit_streaks(
    p_user_id UUID,
    p_goal_id UUID = NULL
)
RETURNS TABLE (
    goal_id UUID,
    goal_title TEXT,
    current_streak INTEGER,
    longest_streak INTEGER
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH streak_data AS (
        SELECT 
            g.id as goal_id,
            g.title as goal_title,
            h.date,
            h.completed,
            date_trunc('day', h.date - 
                row_number() OVER (
                    PARTITION BY g.id, h.completed 
                    ORDER BY h.date
                )::integer * interval '1 day'
            ) as streak_group
        FROM goals g
        LEFT JOIN habit_entries h ON h.goal_id = g.id
        WHERE 
            g.user_id = p_user_id
            AND (p_goal_id IS NULL OR g.id = p_goal_id)
            AND g.status = 'active'
    )
    SELECT 
        sd.goal_id,
        sd.goal_title,
        COALESCE(
            (SELECT count(*)::integer
            FROM streak_data sd2
            WHERE 
                sd2.goal_id = sd.goal_id
                AND sd2.completed = true
                AND sd2.date >= current_date - interval '30 days'
            GROUP BY sd2.goal_id, sd2.streak_group
            ORDER BY count(*) DESC
            LIMIT 1),
            0
        ) as current_streak,
        COALESCE(
            (SELECT count(*)::integer
            FROM streak_data sd3
            WHERE 
                sd3.goal_id = sd.goal_id
                AND sd3.completed = true
            GROUP BY sd3.goal_id, sd3.streak_group
            ORDER BY count(*) DESC
            LIMIT 1),
            0
        ) as longest_streak
    FROM streak_data sd
    GROUP BY sd.goal_id, sd.goal_title;
END;
$$;

-- Create materialized view for weekly goal stats
CREATE MATERIALIZED VIEW weekly_goal_stats AS
SELECT 
    g.user_id,
    g.category,
    date_trunc('week', h.date) as week_start,
    COUNT(DISTINCT g.id) as active_goals,
    COUNT(DISTINCT CASE WHEN h.completed THEN h.goal_id END) as completed_goals,
    COUNT(CASE WHEN h.completed THEN 1 END)::float / NULLIF(COUNT(*), 0) * 100 as completion_rate
FROM goals g
LEFT JOIN habit_entries h ON h.goal_id = g.id
WHERE g.status = 'active'
GROUP BY g.user_id, g.category, date_trunc('week', h.date);

-- Create index on materialized view
CREATE UNIQUE INDEX idx_weekly_goal_stats_user_cat_week 
ON weekly_goal_stats(user_id, category, week_start);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_weekly_goal_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY weekly_goal_stats;
    RETURN NULL;
END;
$$;

-- Create triggers to refresh materialized view
CREATE TRIGGER refresh_weekly_goal_stats_goals_trigger
AFTER INSERT OR UPDATE OR DELETE
ON goals
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_weekly_goal_stats();

CREATE TRIGGER refresh_weekly_goal_stats_habits_trigger
AFTER INSERT OR UPDATE OR DELETE
ON habit_entries
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_weekly_goal_stats();
