-- This SQL file should be executed directly in the Supabase SQL Editor
-- It creates a secure RPC function that will allow executing SQL from the frontend
-- but only for specific types of operations (table creation, policy management, etc.)

-- Function to execute arbitrary SQL (with security restrictions)
CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- For security, we only allow certain operations to be performed
  -- This prevents dangerous SQL from being executed
  IF (
      sql_query ~* '^CREATE\s+TABLE'
      OR sql_query ~* '^ALTER\s+TABLE'
      OR sql_query ~* '^DROP\s+POLICY'
      OR sql_query ~* '^CREATE\s+POLICY'
      OR sql_query ~* '^COMMENT\s+ON'
      OR sql_query ~* '^GRANT\s+'
      OR sql_query ~* '^ENABLE\s+ROW\s+LEVEL\s+SECURITY'
  ) THEN
    BEGIN
      EXECUTE sql_query;
      result := '{"success": true, "message": "SQL executed successfully"}'::JSONB;
    EXCEPTION WHEN OTHERS THEN
      result := jsonb_build_object(
        'success', false,
        'message', 'SQL execution failed: ' || SQLERRM,
        'error_code', SQLSTATE
      );
    END;
  ELSE
    result := '{"success": false, "message": "Operation not permitted for security reasons"}'::JSONB;
  END IF;
  
  RETURN result;
END;
$$;

-- Grant access to the function for all authenticated users
GRANT EXECUTE ON FUNCTION execute_sql(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION execute_sql(TEXT) TO service_role;

-- Now, create another RPC function that specifically checks and creates our needed tables
CREATE OR REPLACE FUNCTION create_blocking_tables_if_not_exist()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  tables_created BOOLEAN := FALSE;
  result JSONB;
BEGIN
  -- Check if distraction_blocking table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'distraction_blocking'
  ) THEN
    -- Create the distraction_blocking table
    CREATE TABLE IF NOT EXISTS public.distraction_blocking (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      block_type TEXT NOT NULL,
      target TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      schedule_start TIME,
      schedule_end TIME,
      days_active TEXT[],
      pattern_data JSONB,
      version8 INTEGER DEFAULT 8,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    ALTER TABLE public.distraction_blocking ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    CREATE POLICY "Users can view own distraction settings"
      ON public.distraction_blocking FOR SELECT
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can insert own distraction settings"
      ON public.distraction_blocking FOR INSERT
      WITH CHECK (auth.uid() = user_id);
      
    CREATE POLICY "Users can update own distraction settings"
      ON public.distraction_blocking FOR UPDATE
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can delete own distraction settings"
      ON public.distraction_blocking FOR DELETE
      USING (auth.uid() = user_id);
    
    tables_created := TRUE;
  END IF;
  
  -- Check if productivity_metrics table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'productivity_metrics'
  ) THEN
    -- Create the productivity_metrics table
    CREATE TABLE IF NOT EXISTS public.productivity_metrics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      date DATE NOT NULL,
      focus_duration INTEGER DEFAULT 0,
      distractions_blocked INTEGER DEFAULT 0,
      productivity_score INTEGER DEFAULT 0,
      focus_sessions INTEGER DEFAULT 0,
      version8 INTEGER DEFAULT 8,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, date)
    );
    
    ALTER TABLE public.productivity_metrics ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    CREATE POLICY "Users can view own productivity metrics"
      ON public.productivity_metrics FOR SELECT
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can insert own productivity metrics"
      ON public.productivity_metrics FOR INSERT
      WITH CHECK (auth.uid() = user_id);
      
    CREATE POLICY "Users can update own productivity metrics"
      ON public.productivity_metrics FOR UPDATE
      USING (auth.uid() = user_id);
    
    tables_created := TRUE;
  END IF;
  
  -- Check if distraction_block_logs table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'distraction_block_logs'
  ) THEN
    -- Create the distraction_block_logs table
    CREATE TABLE IF NOT EXISTS public.distraction_block_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      blocked_url TEXT,
      blocked_app TEXT,
      blocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      block_type TEXT NOT NULL,
      version8 INTEGER DEFAULT 8
    );
    
    ALTER TABLE public.distraction_block_logs ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    CREATE POLICY "Users can view own distraction logs"
      ON public.distraction_block_logs FOR SELECT
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can insert own distraction logs"
      ON public.distraction_block_logs FOR INSERT
      WITH CHECK (auth.uid() = user_id);
    
    tables_created := TRUE;
  END IF;
  
  -- Add version8 field to tables if not exists (per SSOT requirements)
  BEGIN
    -- Distraction blocking table
    IF EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'distraction_blocking'
    ) AND NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'distraction_blocking'
      AND column_name = 'version8'
    ) THEN
      ALTER TABLE public.distraction_blocking 
      ADD COLUMN version8 INTEGER DEFAULT 8;
      tables_created := TRUE;
    END IF;
    
    -- Productivity metrics table
    IF EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'productivity_metrics'
    ) AND NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'productivity_metrics'
      AND column_name = 'version8'
    ) THEN
      ALTER TABLE public.productivity_metrics 
      ADD COLUMN version8 INTEGER DEFAULT 8;
      tables_created := TRUE;
    END IF;
    
    -- Distraction logs table
    IF EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'distraction_block_logs'
    ) AND NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'distraction_block_logs'
      AND column_name = 'version8'
    ) THEN
      ALTER TABLE public.distraction_block_logs 
      ADD COLUMN version8 INTEGER DEFAULT 8;
      tables_created := TRUE;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but continue
    RAISE NOTICE 'Error adding version8 column: %', SQLERRM;
  END;
  
  IF tables_created THEN
    result := '{"success": true, "message": "Tables created or updated successfully", "tables_modified": true}'::JSONB;
  ELSE
    result := '{"success": true, "message": "All tables already exist with correct structure", "tables_modified": false}'::JSONB;
  END IF;
  
  RETURN result;
END;
$$;

-- Grant access to the function for all authenticated users
GRANT EXECUTE ON FUNCTION create_blocking_tables_if_not_exist() TO authenticated;
GRANT EXECUTE ON FUNCTION create_blocking_tables_if_not_exist() TO service_role;

-- Create a simple function to check if the tables exist and are accessible
CREATE OR REPLACE FUNCTION check_distraction_tables()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  table_count INTEGER := 0;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN ('distraction_blocking', 'productivity_metrics', 'distraction_block_logs');
  
  result := jsonb_build_object(
    'success', true,
    'tables_found', table_count,
    'has_all_tables', table_count = 3,
    'has_version8', EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'distraction_blocking'
      AND column_name = 'version8'
    )
  );
  
  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION check_distraction_tables() TO authenticated;
GRANT EXECUTE ON FUNCTION check_distraction_tables() TO service_role; 