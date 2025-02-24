-- Create achievements table
CREATE TABLE public.wellness_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    points INTEGER DEFAULT 0,
    achieved_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.wellness_achievements ENABLE ROW LEVEL SECURITY;

-- Users can only read their own achievements
CREATE POLICY "Users can view own achievements" ON public.wellness_achievements
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can only insert their own achievements
CREATE POLICY "Users can insert own achievements" ON public.wellness_achievements
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can only update their own achievements
CREATE POLICY "Users can update own achievements" ON public.wellness_achievements
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create function to award achievement
CREATE OR REPLACE FUNCTION award_achievement(
    p_user_id UUID,
    p_title VARCHAR,
    p_description TEXT,
    p_category VARCHAR,
    p_points INTEGER
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_achievement_id UUID;
BEGIN
    -- Insert the achievement
    INSERT INTO wellness_achievements (
        user_id,
        title,
        description,
        category,
        points
    ) VALUES (
        p_user_id,
        p_title,
        p_description,
        p_category,
        p_points
    )
    RETURNING id INTO v_achievement_id;

    RETURN v_achievement_id;
END;
$$;
