-- Create focus_sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    duration INTEGER NOT NULL, -- Duration in seconds
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create focus_stats table
CREATE TABLE IF NOT EXISTS focus_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    total_time INTEGER DEFAULT 0, -- Total focus time in minutes
    sessions_completed INTEGER DEFAULT 0,
    average_duration INTEGER DEFAULT 0, -- Average session duration in minutes
    streak_days INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update focus stats
CREATE OR REPLACE FUNCTION update_focus_stats()
RETURNS TRIGGER AS $$
DECLARE
    total_focus_time INTEGER;
    total_sessions INTEGER;
    avg_duration INTEGER;
    current_streak INTEGER;
    last_session_date DATE;
BEGIN
    -- Calculate total focus time and sessions
    SELECT 
        COALESCE(SUM(duration) / 60, 0),
        COUNT(*)
    INTO total_focus_time, total_sessions
    FROM focus_sessions
    WHERE user_id = NEW.user_id AND completed = TRUE;

    -- Calculate average duration
    avg_duration := CASE WHEN total_sessions > 0 
        THEN total_focus_time / total_sessions 
        ELSE 0 
    END;

    -- Calculate streak
    SELECT 
        MAX(date_trunc('day', started_at)) 
    INTO last_session_date
    FROM focus_sessions 
    WHERE user_id = NEW.user_id 
        AND completed = TRUE 
        AND started_at < date_trunc('day', NOW());

    current_streak := CASE 
        WHEN last_session_date = date_trunc('day', NOW() - INTERVAL '1 day') THEN
            COALESCE((
                SELECT streak_days + 1 
                FROM focus_stats 
                WHERE user_id = NEW.user_id
            ), 1)
        ELSE 1
    END;

    -- Insert or update stats
    INSERT INTO focus_stats (
        user_id,
        total_time,
        sessions_completed,
        average_duration,
        streak_days
    ) VALUES (
        NEW.user_id,
        total_focus_time,
        total_sessions,
        avg_duration,
        current_streak
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_time = EXCLUDED.total_time,
        sessions_completed = EXCLUDED.sessions_completed,
        average_duration = EXCLUDED.average_duration,
        streak_days = EXCLUDED.streak_days,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for focus stats
CREATE OR REPLACE TRIGGER focus_sessions_stats_trigger
    AFTER INSERT OR UPDATE
    ON focus_sessions
    FOR EACH ROW
    WHEN (NEW.completed = TRUE)
    EXECUTE FUNCTION update_focus_stats();

-- Create RLS policies
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_stats ENABLE ROW LEVEL SECURITY;

-- Policies for focus_sessions
CREATE POLICY "Users can view their own focus sessions"
    ON focus_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own focus sessions"
    ON focus_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own focus sessions"
    ON focus_sessions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policies for focus_stats
CREATE POLICY "Users can view their own focus stats"
    ON focus_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can manage focus stats"
    ON focus_stats FOR ALL
    USING (true)
    WITH CHECK (true);
