-- Enhanced exercise categories with specialized focus areas
CREATE TYPE occupation_type AS ENUM (
  'office_worker',
  'remote_worker',
  'designer',
  'developer',
  'healthcare_worker',
  'night_shift_worker',
  'creative_professional',
  'general'
);

CREATE TYPE exercise_duration AS ENUM (
  'quick_break',     -- 1-5 minutes
  'short_session',   -- 5-15 minutes
  'medium_session',  -- 15-30 minutes
  'long_session'     -- 30+ minutes
);

CREATE TYPE exercise_intensity AS ENUM (
  'very_light',
  'light',
  'moderate',
  'vigorous',
  'high_intensity'
);

CREATE TYPE exercise_environment AS ENUM (
  'desk_based',
  'indoor_space',
  'outdoor_urban',
  'outdoor_nature',
  'gym_equipment',
  'no_equipment'
);

-- Enhance exercise_categories table
ALTER TABLE exercise_categories
ADD COLUMN occupation_focus occupation_type[] DEFAULT ARRAY['general'],
ADD COLUMN typical_duration exercise_duration NOT NULL DEFAULT 'medium_session',
ADD COLUMN intensity_level exercise_intensity NOT NULL DEFAULT 'moderate',
ADD COLUMN environment_type exercise_environment NOT NULL DEFAULT 'indoor_space',
ADD COLUMN seo_keywords TEXT[] NOT NULL DEFAULT '{}',
ADD COLUMN seo_description TEXT,
ADD COLUMN is_trending BOOLEAN DEFAULT false,
ADD COLUMN trending_score INTEGER DEFAULT 0,
ADD COLUMN web_tool_enabled BOOLEAN DEFAULT false,
ADD COLUMN requires_subscription BOOLEAN DEFAULT false;

-- Create specialized exercise types table
CREATE TABLE exercise_specializations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  target_conditions TEXT[] NOT NULL,
  medical_disclaimer TEXT,
  scientific_references TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exercise guides table for comprehensive instruction
CREATE TABLE exercise_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  difficulty_level TEXT NOT NULL,
  prerequisites TEXT[],
  equipment_needed TEXT[],
  safety_tips TEXT[],
  common_mistakes TEXT[],
  modification_options TEXT[],
  progression_path TEXT[],
  animation_url TEXT,
  video_url TEXT,
  image_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exercise programs table
CREATE TABLE exercise_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_weeks INTEGER NOT NULL,
  target_level TEXT NOT NULL,
  goals TEXT[] NOT NULL,
  schedule JSON NOT NULL,
  prerequisites TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create program_exercises junction table
CREATE TABLE program_exercises (
  program_id UUID REFERENCES exercise_programs(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  day_number INTEGER NOT NULL,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  duration_minutes INTEGER,
  intensity_level exercise_intensity NOT NULL,
  notes TEXT,
  PRIMARY KEY (program_id, exercise_id, week_number, day_number)
);

-- Create exercise achievements table
CREATE TABLE exercise_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT NOT NULL,
  requirements JSON NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user achievements table
CREATE TABLE user_achievements (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES exercise_achievements(id) ON DELETE CASCADE,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Create exercise tips table
CREATE TABLE exercise_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  tip_type TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add specialized exercise categories
INSERT INTO exercise_categories (
  name, description, occupation_focus, typical_duration, intensity_level, 
  environment_type, seo_keywords, seo_description, web_tool_enabled
) VALUES
  (
    'Eye Relief Exercises',
    'Exercises designed to reduce eye strain and improve eye health for digital workers',
    ARRAY['office_worker', 'designer', 'developer'],
    'quick_break',
    'very_light',
    'desk_based',
    ARRAY['eye strain', 'computer vision syndrome', 'digital eye care', '20-20-20 rule'],
    'Prevent eye strain and maintain healthy vision with our scientifically-backed eye exercises for digital workers',
    true
  ),
  (
    'Desk Stretches',
    'Quick and effective stretches that can be done at your desk',
    ARRAY['office_worker', 'remote_worker', 'developer'],
    'quick_break',
    'light',
    'desk_based',
    ARRAY['office stretches', 'desk exercises', 'workplace wellness', 'ergonomic exercises'],
    'Stay active and prevent stiffness with our desk-based stretching routines',
    true
  ),
  (
    'Posture Correction',
    'Exercises focused on improving posture and preventing back pain',
    ARRAY['office_worker', 'designer', 'developer'],
    'short_session',
    'light',
    'desk_based',
    ARRAY['posture exercises', 'back pain relief', 'office ergonomics', 'spine health'],
    'Improve your posture and prevent back pain with our targeted exercise program',
    true
  ),
  (
    'Night Shift Recovery',
    'Exercises designed for recovery and adaptation to night shift work',
    ARRAY['night_shift_worker', 'healthcare_worker'],
    'medium_session',
    'moderate',
    'indoor_space',
    ARRAY['night shift health', 'circadian rhythm', 'shift work exercises', 'recovery'],
    'Specialized exercise routines for night shift workers to maintain health and energy',
    true
  ),
  (
    'Creative Energy Boost',
    'Movement exercises to enhance creativity and mental energy',
    ARRAY['designer', 'creative_professional'],
    'short_session',
    'moderate',
    'indoor_space',
    ARRAY['creativity exercises', 'brain boost', 'mental energy', 'creative wellness'],
    'Boost your creative energy and mental clarity with our specialized movement routines',
    true
  ),
  (
    'Stress Relief Movement',
    'Physical exercises designed to reduce stress and anxiety',
    ARRAY['general'],
    'medium_session',
    'moderate',
    'indoor_space',
    ARRAY['stress relief exercises', 'anxiety reduction', 'movement therapy', 'wellness'],
    'Combat stress and anxiety through mindful movement and exercise',
    true
  ),
  (
    'Decision Fatigue Recovery',
    'Exercises to combat decision fatigue and mental exhaustion',
    ARRAY['general'],
    'short_session',
    'light',
    'indoor_space',
    ARRAY['decision fatigue', 'mental recovery', 'cognitive exercises', 'brain health'],
    'Specialized exercises to combat decision fatigue and restore mental energy',
    true
  ),
  (
    'Circulation Boosters',
    'Exercises to improve circulation, especially for sedentary workers',
    ARRAY['office_worker', 'developer'],
    'quick_break',
    'light',
    'desk_based',
    ARRAY['circulation exercises', 'blood flow', 'office health', 'leg exercises'],
    'Improve circulation and prevent blood pooling with our quick exercise routines',
    true
  );

-- Add RLS policies
ALTER TABLE exercise_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_tips ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public exercise content is viewable by everyone" ON exercise_specializations
  FOR SELECT USING (true);

CREATE POLICY "Public guides are viewable by everyone" ON exercise_guides
  FOR SELECT USING (true);

CREATE POLICY "Public programs are viewable by everyone" ON exercise_programs
  FOR SELECT USING (true);

CREATE POLICY "Public program exercises are viewable by everyone" ON program_exercises
  FOR SELECT USING (true);

CREATE POLICY "Public achievements are viewable by everyone" ON exercise_achievements
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public tips are viewable by everyone" ON exercise_tips
  FOR SELECT USING (true);
