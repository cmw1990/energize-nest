-- Function to create focus_sessions8 table with RLS policies
CREATE OR REPLACE FUNCTION create_focus_sessions8_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.focus_sessions8 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    focus_type TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    task_description TEXT,
    productivity_score INTEGER,
    notes TEXT,
    version8 INTEGER DEFAULT 8, -- Following SSOT requirement to include "8"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  ALTER TABLE public.focus_sessions8 ENABLE ROW LEVEL SECURITY;
  
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view own focus sessions" ON public.focus_sessions8;
  DROP POLICY IF EXISTS "Users can insert own focus sessions" ON public.focus_sessions8;
  DROP POLICY IF EXISTS "Users can update own focus sessions" ON public.focus_sessions8;
  DROP POLICY IF EXISTS "Users can delete own focus sessions" ON public.focus_sessions8;
  
  -- Create policies
  CREATE POLICY "Users can view own focus sessions"
    ON public.focus_sessions8 FOR SELECT
    USING (auth.uid() = user_id);
    
  CREATE POLICY "Users can insert own focus sessions"
    ON public.focus_sessions8 FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    
  CREATE POLICY "Users can update own focus sessions"
    ON public.focus_sessions8 FOR UPDATE
    USING (auth.uid() = user_id);
    
  CREATE POLICY "Users can delete own focus sessions"
    ON public.focus_sessions8 FOR DELETE
    USING (auth.uid() = user_id);
END;
$$;

-- Function to create noise_sessions8 table with RLS policies
CREATE OR REPLACE FUNCTION create_noise_sessions8_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.noise_sessions8 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    sound_type TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    volume INTEGER NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    version8 INTEGER DEFAULT 8, -- Following SSOT requirement to include "8"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  ALTER TABLE public.noise_sessions8 ENABLE ROW LEVEL SECURITY;
  
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view own noise sessions" ON public.noise_sessions8;
  DROP POLICY IF EXISTS "Users can insert own noise sessions" ON public.noise_sessions8;
  DROP POLICY IF EXISTS "Users can update own noise sessions" ON public.noise_sessions8;
  DROP POLICY IF EXISTS "Users can delete own noise sessions" ON public.noise_sessions8;
  
  -- Create policies
  CREATE POLICY "Users can view own noise sessions"
    ON public.noise_sessions8 FOR SELECT
    USING (auth.uid() = user_id);
    
  CREATE POLICY "Users can insert own noise sessions"
    ON public.noise_sessions8 FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    
  CREATE POLICY "Users can update own noise sessions"
    ON public.noise_sessions8 FOR UPDATE
    USING (auth.uid() = user_id);
    
  CREATE POLICY "Users can delete own noise sessions"
    ON public.noise_sessions8 FOR DELETE
    USING (auth.uid() = user_id);
END;
$$;

-- General function to create all focus-related tables
CREATE OR REPLACE FUNCTION create_focus_tables8()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  tables_created BOOLEAN := FALSE;
  result JSONB;
BEGIN
  -- Check if focus_sessions8 table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'focus_sessions8'
  ) THEN
    PERFORM create_focus_sessions8_table();
    tables_created := TRUE;
  END IF;
  
  -- Check if noise_sessions8 table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'noise_sessions8'
  ) THEN
    PERFORM create_noise_sessions8_table();
    tables_created := TRUE;
  END IF;
  
  IF tables_created THEN
    result := '{"success": true, "message": "Focus tables created successfully", "tables_modified": true}'::JSONB;
  ELSE
    result := '{"success": true, "message": "All focus tables already exist with correct structure", "tables_modified": false}'::JSONB;
  END IF;
  
  RETURN result;
END;
$$;

-- Grant access to the functions for authenticated users
GRANT EXECUTE ON FUNCTION create_focus_sessions8_table() TO authenticated;
GRANT EXECUTE ON FUNCTION create_noise_sessions8_table() TO authenticated;
GRANT EXECUTE ON FUNCTION create_focus_tables8() TO authenticated; 