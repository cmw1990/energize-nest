-- Function to create the distraction_blocking table and set up RLS
CREATE OR REPLACE FUNCTION create_distraction_blocking_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  ALTER TABLE public.distraction_blocking ENABLE ROW LEVEL SECURITY;
  
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view own distraction settings" ON public.distraction_blocking;
  DROP POLICY IF EXISTS "Users can insert own distraction settings" ON public.distraction_blocking;
  DROP POLICY IF EXISTS "Users can update own distraction settings" ON public.distraction_blocking;
  DROP POLICY IF EXISTS "Users can delete own distraction settings" ON public.distraction_blocking;
  
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
END;
$$;

-- Function to create the productivity_metrics table and set up RLS
CREATE OR REPLACE FUNCTION create_productivity_metrics_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.productivity_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    focus_duration INTEGER DEFAULT 0,
    distractions_blocked INTEGER DEFAULT 0,
    productivity_score INTEGER DEFAULT 0,
    focus_sessions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
  );
  
  ALTER TABLE public.productivity_metrics ENABLE ROW LEVEL SECURITY;
  
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view own productivity metrics" ON public.productivity_metrics;
  DROP POLICY IF EXISTS "Users can insert own productivity metrics" ON public.productivity_metrics;
  DROP POLICY IF EXISTS "Users can update own productivity metrics" ON public.productivity_metrics;
  
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
END;
$$;

-- Function to create the distraction_block_logs table and set up RLS
CREATE OR REPLACE FUNCTION create_distraction_block_logs_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.distraction_block_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    blocked_url TEXT,
    blocked_app TEXT,
    blocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    block_type TEXT NOT NULL
  );
  
  ALTER TABLE public.distraction_block_logs ENABLE ROW LEVEL SECURITY;
  
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view own distraction logs" ON public.distraction_block_logs;
  DROP POLICY IF EXISTS "Users can insert own distraction logs" ON public.distraction_block_logs;
  
  -- Create policies
  CREATE POLICY "Users can view own distraction logs"
    ON public.distraction_block_logs FOR SELECT
    USING (auth.uid() = user_id);
    
  CREATE POLICY "Users can insert own distraction logs"
    ON public.distraction_block_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);
END;
$$;

-- General function to set up all tables needed for the distraction blocker feature
CREATE OR REPLACE FUNCTION setup_distraction_blocker()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM create_distraction_blocking_table();
  PERFORM create_productivity_metrics_table();
  PERFORM create_distraction_block_logs_table();
END;
$$;

-- Function to execute arbitrary SQL (with security restrictions)
-- This needs to be created in Supabase SQL Editor and should be used cautiously
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
    EXECUTE sql_query;
    result := '{"success": true, "message": "SQL executed successfully"}'::JSONB;
  ELSE
    result := '{"success": false, "message": "Operation not permitted for security reasons"}'::JSONB;
  END IF;
  
  RETURN result;
END;
$$;

-- Function to create tables if they don't exist using a single RPC call
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
    PERFORM create_distraction_blocking_table();
    tables_created := TRUE;
  END IF;
  
  -- Check if productivity_metrics table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'productivity_metrics'
  ) THEN
    PERFORM create_productivity_metrics_table();
    tables_created := TRUE;
  END IF;
  
  -- Check if distraction_block_logs table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'distraction_block_logs'
  ) THEN
    PERFORM create_distraction_block_logs_table();
    tables_created := TRUE;
  END IF;
  
  -- Add version8 field to tables if not exists
  -- This follows the SSOT requirement to include "8" in data structures
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'distraction_blocking'
    AND column_name = 'version8'
  ) THEN
    ALTER TABLE IF EXISTS public.distraction_blocking 
    ADD COLUMN version8 INTEGER DEFAULT 8;
    tables_created := TRUE;
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'productivity_metrics'
    AND column_name = 'version8'
  ) THEN
    ALTER TABLE IF EXISTS public.productivity_metrics 
    ADD COLUMN version8 INTEGER DEFAULT 8;
    tables_created := TRUE;
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'distraction_block_logs'
    AND column_name = 'version8'
  ) THEN
    ALTER TABLE IF EXISTS public.distraction_block_logs 
    ADD COLUMN version8 INTEGER DEFAULT 8;
    tables_created := TRUE;
  END IF;
  
  IF tables_created THEN
    result := '{"success": true, "message": "Tables created or updated successfully", "tables_modified": true}'::JSONB;
  ELSE
    result := '{"success": true, "message": "All tables already exist with correct structure", "tables_modified": false}'::JSONB;
  END IF;
  
  RETURN result;
END;
$$; 