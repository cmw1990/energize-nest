-- Update step_points table with new fields
ALTER TABLE step_points 
ADD COLUMN IF NOT EXISTS bonus_multiplier decimal(3,2) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS challenge_id uuid REFERENCES challenges(id),
ADD COLUMN IF NOT EXISTS streak_bonus boolean DEFAULT false;

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    description text,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    required_steps integer NOT NULL,
    reward_points integer NOT NULL,
    bonus_multiplier decimal(3,2) DEFAULT 1.0,
    max_participants integer,
    current_participants integer DEFAULT 0,
    status text CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create challenge_participants table
CREATE TABLE IF NOT EXISTS challenge_participants (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    challenge_id uuid REFERENCES challenges(id),
    user_id uuid REFERENCES auth.users(id),
    current_steps integer DEFAULT 0,
    status text CHECK (status IN ('joined', 'completed', 'failed')) DEFAULT 'joined',
    joined_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    UNIQUE(challenge_id, user_id)
);

-- Create subscription_rewards table
CREATE TABLE IF NOT EXISTS subscription_rewards (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    description text,
    required_steps integer NOT NULL,
    reward_type text CHECK (type IN ('discount', 'free_trial', 'free_month')) NOT NULL,
    reward_value integer NOT NULL, -- percentage or days
    min_subscription_tier text,
    valid_from timestamp with time zone DEFAULT now(),
    valid_until timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- Create user_rewards table
CREATE TABLE IF NOT EXISTS user_rewards (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    reward_id uuid REFERENCES subscription_rewards(id),
    claimed_at timestamp with time zone DEFAULT now(),
    used_at timestamp with time zone,
    expires_at timestamp with time zone NOT NULL,
    UNIQUE(user_id, reward_id)
);

-- Add streaks tracking to user_points
ALTER TABLE user_points
ADD COLUMN IF NOT EXISTS current_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_date date,
ADD COLUMN IF NOT EXISTS streak_multiplier decimal(3,2) DEFAULT 1.0;

-- Function to update user streaks
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS trigger AS $$
BEGIN
    -- Check if this is the first activity or a new day
    IF OLD.last_activity_date IS NULL OR OLD.last_activity_date < CURRENT_DATE THEN
        -- If the last activity was yesterday, increment streak
        IF OLD.last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN
            NEW.current_streak := OLD.current_streak + 1;
            -- Update longest streak if current is higher
            IF NEW.current_streak > OLD.longest_streak THEN
                NEW.longest_streak := NEW.current_streak;
            END IF;
            -- Update multiplier based on streak
            NEW.streak_multiplier := CASE
                WHEN NEW.current_streak >= 30 THEN 2.0
                WHEN NEW.current_streak >= 20 THEN 1.75
                WHEN NEW.current_streak >= 10 THEN 1.5
                WHEN NEW.current_streak >= 5 THEN 1.25
                ELSE 1.0
            END;
        -- If activity was missed, reset streak
        ELSE
            NEW.current_streak := 1;
            NEW.streak_multiplier := 1.0;
        END IF;
        NEW.last_activity_date := CURRENT_DATE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for streak updates
CREATE TRIGGER update_streak_trigger
    BEFORE UPDATE ON user_points
    FOR EACH ROW
    EXECUTE FUNCTION update_user_streak();

-- Function to process step points with bonuses
CREATE OR REPLACE FUNCTION process_step_points(
    p_user_id uuid,
    p_steps integer,
    p_source text
)
RETURNS void AS $$
DECLARE
    v_points integer;
    v_multiplier decimal(3,2);
    v_user_points record;
BEGIN
    -- Get user's current streak multiplier
    SELECT streak_multiplier INTO v_multiplier
    FROM user_points
    WHERE user_id = p_user_id;

    -- Calculate base points (1 point per 1000 steps)
    v_points := floor(p_steps / 1000);
    
    -- Apply streak multiplier
    v_points := floor(v_points * v_multiplier);

    -- Record step points
    INSERT INTO step_points (
        user_id,
        steps,
        points_earned,
        date,
        source,
        verified,
        bonus_multiplier
    ) VALUES (
        p_user_id,
        p_steps,
        v_points,
        CURRENT_TIMESTAMP,
        p_source,
        p_source != 'manual',
        v_multiplier
    );

    -- Update user points
    UPDATE user_points
    SET 
        total_points = total_points + v_points,
        lifetime_points = lifetime_points + v_points
    WHERE user_id = p_user_id;

    -- Check and update challenges
    UPDATE challenge_participants
    SET current_steps = current_steps + p_steps
    WHERE user_id = p_user_id
    AND status = 'joined';
END;
$$ LANGUAGE plpgsql;
