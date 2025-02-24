-- User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    timezone TEXT,
    privacy_settings JSONB DEFAULT '{"profile": "public", "activities": "friends", "stats": "private"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Connections/Friends
CREATE TABLE IF NOT EXISTS user_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, friend_id)
);

-- Activity Feed
CREATE TABLE IF NOT EXISTS activity_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT CHECK (activity_type IN (
        'workout_completed', 'goal_achieved', 'streak_milestone',
        'badge_earned', 'meditation_completed', 'mood_logged',
        'gratitude_shared', 'challenge_joined', 'challenge_completed'
    )),
    content JSONB,
    visibility TEXT CHECK (visibility IN ('public', 'friends', 'private')) DEFAULT 'friends',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Comments
CREATE TABLE IF NOT EXISTS activity_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES activity_feed(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Likes
CREATE TABLE IF NOT EXISTS activity_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES activity_feed(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(activity_id, user_id)
);

-- Achievements/Badges
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('fitness', 'mindfulness', 'nutrition', 'sleep', 'social')),
    icon_url TEXT,
    requirements JSONB,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id),
    earned_at TIMESTAMPTZ DEFAULT now(),
    progress JSONB,
    UNIQUE(user_id, achievement_id)
);

-- Challenges
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('fitness', 'mindfulness', 'nutrition', 'sleep', 'social')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    requirements JSONB,
    rewards JSONB,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')) DEFAULT 'upcoming',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Challenge Participants
CREATE TABLE IF NOT EXISTS challenge_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('joined', 'completed', 'dropped')) DEFAULT 'joined',
    progress JSONB DEFAULT '{"completed": 0, "total": 0}'::jsonb,
    joined_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    UNIQUE(challenge_id, user_id)
);

-- Leaderboards
CREATE TABLE IF NOT EXISTS leaderboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT CHECK (category IN ('fitness', 'mindfulness', 'nutrition', 'sleep', 'social')),
    period TEXT CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
    metric TEXT NOT NULL,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Leaderboard Entries
CREATE TABLE IF NOT EXISTS leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leaderboard_id UUID REFERENCES leaderboards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    score DECIMAL(10,2),
    rank INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(leaderboard_id, user_id)
);

-- Add RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view public profiles and their friends' profiles"
    ON user_profiles FOR SELECT
    USING (
        CASE 
            WHEN privacy_settings->>'profile' = 'public' THEN true
            WHEN privacy_settings->>'profile' = 'friends' THEN EXISTS (
                SELECT 1 FROM user_connections
                WHERE (user_id = auth.uid() AND friend_id = user_profiles.id
                    OR friend_id = auth.uid() AND user_id = user_profiles.id)
                AND status = 'accepted'
            )
            ELSE id = auth.uid()
        END
    );

CREATE POLICY "Users can view their connections"
    ON user_connections FOR SELECT
    USING (user_id = auth.uid() OR friend_id = auth.uid());

CREATE POLICY "Users can view visible activity feed items"
    ON activity_feed FOR SELECT
    USING (
        CASE 
            WHEN visibility = 'public' THEN true
            WHEN visibility = 'friends' THEN EXISTS (
                SELECT 1 FROM user_connections
                WHERE (user_id = auth.uid() AND friend_id = activity_feed.user_id
                    OR friend_id = auth.uid() AND user_id = activity_feed.user_id)
                AND status = 'accepted'
            )
            ELSE user_id = auth.uid()
        END
    );

CREATE POLICY "Users can view comments on visible activities"
    ON activity_comments FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM activity_feed
        WHERE activity_feed.id = activity_comments.activity_id
        AND (
            activity_feed.visibility = 'public'
            OR (activity_feed.visibility = 'friends' AND EXISTS (
                SELECT 1 FROM user_connections
                WHERE (user_id = auth.uid() AND friend_id = activity_feed.user_id
                    OR friend_id = auth.uid() AND user_id = activity_feed.user_id)
                AND status = 'accepted'
            ))
            OR activity_feed.user_id = auth.uid()
        )
    ));

CREATE POLICY "Anyone can view achievements"
    ON achievements FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own achievements"
    ON user_achievements FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Anyone can view challenges"
    ON challenges FOR SELECT
    USING (true);

CREATE POLICY "Users can view challenge participants"
    ON challenge_participants FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view leaderboards"
    ON leaderboards FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view leaderboard entries"
    ON leaderboard_entries FOR SELECT
    USING (true);

-- Create indexes
CREATE INDEX idx_user_connections_users ON user_connections(user_id, friend_id);
CREATE INDEX idx_activity_feed_user ON activity_feed(user_id);
CREATE INDEX idx_activity_comments_activity ON activity_comments(activity_id);
CREATE INDEX idx_activity_likes_activity ON activity_likes(activity_id);
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_challenge_participants_challenge ON challenge_participants(challenge_id);
CREATE INDEX idx_leaderboard_entries_board ON leaderboard_entries(leaderboard_id);
