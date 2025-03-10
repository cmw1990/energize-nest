-- SQL for sleep tables with '8' suffix

-- Create sleep_entries8 table
CREATE TABLE IF NOT EXISTS public.sleep_entries8 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bed_time TIME NOT NULL,
  wake_time TIME NOT NULL,
  sleep_quality INTEGER NOT NULL CHECK (sleep_quality BETWEEN 1 AND 10),
  sleep_duration DECIMAL NOT NULL,
  factors JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sleep_goals8 table
CREATE TABLE IF NOT EXISTS public.sleep_goals8 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_duration DECIMAL NOT NULL,
  target_quality INTEGER NOT NULL CHECK (target_quality BETWEEN 1 AND 10),
  bedtime_target TIME NOT NULL,
  wake_time_target TIME NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sleep_environment_settings8 table
CREATE TABLE IF NOT EXISTS public.sleep_environment_settings8 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  temperature INTEGER NOT NULL DEFAULT 68,
  humidity INTEGER NOT NULL DEFAULT 40,
  noise_level INTEGER NOT NULL DEFAULT 20,
  light_level INTEGER NOT NULL DEFAULT 10,
  aromatherapy_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  white_noise_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  white_noise_type TEXT NOT NULL DEFAULT 'rain',
  light_color TEXT NOT NULL DEFAULT '#FFA07A',
  bedtime_reminder_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  bedtime_reminder_time TIME NOT NULL DEFAULT '22:00',
  caffeine_cutoff_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  caffeine_cutoff_time TIME NOT NULL DEFAULT '14:00',
  bedtime_routine TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Row Level Security policies
ALTER TABLE public.sleep_entries8 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_goals8 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_environment_settings8 ENABLE ROW LEVEL SECURITY;

-- Policy for sleep_entries8
CREATE POLICY "Users can view their own sleep entries"
  ON public.sleep_entries8 FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep entries"
  ON public.sleep_entries8 FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep entries"
  ON public.sleep_entries8 FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep entries"
  ON public.sleep_entries8 FOR DELETE
  USING (auth.uid() = user_id);

-- Policy for sleep_goals8
CREATE POLICY "Users can view their own sleep goals"
  ON public.sleep_goals8 FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep goals"
  ON public.sleep_goals8 FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep goals"
  ON public.sleep_goals8 FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep goals"
  ON public.sleep_goals8 FOR DELETE
  USING (auth.uid() = user_id);

-- Policy for sleep_environment_settings8
CREATE POLICY "Users can view their own sleep environment settings"
  ON public.sleep_environment_settings8 FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep environment settings"
  ON public.sleep_environment_settings8 FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep environment settings"
  ON public.sleep_environment_settings8 FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep environment settings"
  ON public.sleep_environment_settings8 FOR DELETE
  USING (auth.uid() = user_id);
