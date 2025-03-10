-- Create exercise categories table
CREATE TABLE exercise_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES exercise_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration INTEGER NOT NULL, -- in minutes
  calories INTEGER NOT NULL,
  target_muscles TEXT[] NOT NULL,
  benefits TEXT[] NOT NULL,
  animation_url TEXT,
  video_url TEXT,
  image_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exercise steps table
CREATE TABLE exercise_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exercise_id, step_number)
);

-- Create user exercise progress table
CREATE TABLE user_exercise_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_seconds INTEGER NOT NULL,
  calories_burned INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user exercise favorites table
CREATE TABLE user_exercise_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, exercise_id)
);

-- Add RLS policies
ALTER TABLE exercise_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercise_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercise_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for exercise_categories
CREATE POLICY "Public categories are viewable by everyone" ON exercise_categories
  FOR SELECT USING (true);

-- Create policies for exercises
CREATE POLICY "Public exercises are viewable by everyone" ON exercises
  FOR SELECT USING (true);

-- Create policies for exercise_steps
CREATE POLICY "Public exercise steps are viewable by everyone" ON exercise_steps
  FOR SELECT USING (true);

-- Create policies for user_exercise_progress
CREATE POLICY "Users can view their own progress" ON user_exercise_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON user_exercise_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON user_exercise_progress
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own progress" ON user_exercise_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for user_exercise_favorites
CREATE POLICY "Users can view their own favorites" ON user_exercise_favorites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites" ON user_exercise_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON user_exercise_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Create functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_exercise_categories_updated_at
  BEFORE UPDATE ON exercise_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercise_steps_updated_at
  BEFORE UPDATE ON exercise_steps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_exercise_progress_updated_at
  BEFORE UPDATE ON user_exercise_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
