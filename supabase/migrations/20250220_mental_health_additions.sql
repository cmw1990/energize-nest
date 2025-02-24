-- Create grief support tables
CREATE TABLE IF NOT EXISTS grief_journal (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    emotions TEXT[] DEFAULT '{}',
    intensity INTEGER CHECK (intensity >= 0 AND intensity <= 10),
    triggers TEXT[] DEFAULT '{}',
    coping_methods TEXT[] DEFAULT '{}',
    gratitude TEXT[] DEFAULT '{}',
    entry TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS memorial_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE,
    type TEXT CHECK (type IN ('memory', 'photo', 'letter', 'milestone')),
    media_url TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    meeting_time TEXT,
    meeting_link TEXT,
    type TEXT CHECK (type IN ('virtual', 'in_person')),
    category TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create social anxiety tables
CREATE TABLE IF NOT EXISTS anxiety_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    situation TEXT NOT NULL,
    anxiety_level INTEGER CHECK (anxiety_level >= 0 AND anxiety_level <= 10),
    physical_symptoms TEXT[] DEFAULT '{}',
    thoughts TEXT[] DEFAULT '{}',
    coping_strategies TEXT[] DEFAULT '{}',
    outcome TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exposure_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    task TEXT NOT NULL,
    difficulty INTEGER CHECK (difficulty >= 0 AND difficulty <= 10),
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coping_strategies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('cognitive', 'behavioral', 'physical')),
    steps TEXT[] DEFAULT '{}',
    effectiveness INTEGER CHECK (effectiveness >= 0 AND effectiveness <= 100),
    category TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE grief_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorial_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE anxiety_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exposure_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE coping_strategies ENABLE ROW LEVEL SECURITY;

-- Grief journal policies
CREATE POLICY "Users can view their own grief journal entries"
    ON grief_journal FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own grief journal entries"
    ON grief_journal FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grief journal entries"
    ON grief_journal FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own grief journal entries"
    ON grief_journal FOR DELETE
    USING (auth.uid() = user_id);

-- Memorial entries policies
CREATE POLICY "Users can view their own memorial entries"
    ON memorial_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memorial entries"
    ON memorial_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memorial entries"
    ON memorial_entries FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memorial entries"
    ON memorial_entries FOR DELETE
    USING (auth.uid() = user_id);

-- Support groups policies
CREATE POLICY "Anyone can view support groups"
    ON support_groups FOR SELECT
    USING (true);

-- Anxiety logs policies
CREATE POLICY "Users can view their own anxiety logs"
    ON anxiety_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own anxiety logs"
    ON anxiety_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own anxiety logs"
    ON anxiety_logs FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own anxiety logs"
    ON anxiety_logs FOR DELETE
    USING (auth.uid() = user_id);

-- Exposure tasks policies
CREATE POLICY "Users can view their own exposure tasks"
    ON exposure_tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exposure tasks"
    ON exposure_tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exposure tasks"
    ON exposure_tasks FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exposure tasks"
    ON exposure_tasks FOR DELETE
    USING (auth.uid() = user_id);

-- Coping strategies policies
CREATE POLICY "Anyone can view coping strategies"
    ON coping_strategies FOR SELECT
    USING (true);
