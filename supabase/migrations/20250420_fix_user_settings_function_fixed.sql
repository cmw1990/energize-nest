-- Fix for missing get_user_settings function and care_groups RLS
-- This script addresses:
-- 1. Missing get_user_settings function
-- 2. Ensuring proper RLS for care_groups table

-- Create the get_user_settings function if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'get_user_settings'
    AND pg_get_function_arguments(oid) = 'user_id uuid'
  ) THEN
    -- Create the function directly (not with dynamic SQL)
    CREATE FUNCTION get_user_settings(user_id UUID)
    RETURNS JSONB 
    LANGUAGE plpgsql SECURITY DEFINER
    AS $func$
    DECLARE
      user_settings_record JSONB;
    BEGIN
      SELECT 
        jsonb_build_object(
          'id', id,
          'user_id', user_id,
          'theme', theme,
          'notifications_enabled', notifications_enabled,
          'created_at', created_at,
          'updated_at', updated_at
        ) INTO user_settings_record
      FROM 
        public.user_settings
      WHERE 
        user_settings.user_id = get_user_settings.user_id;
        
      -- Return empty object if no settings found
      IF user_settings_record IS NULL THEN
        RETURN '{}'::JSONB;
      END IF;
      
      RETURN user_settings_record;
    END;
    $func$;
    
    -- Grant permissions
    GRANT EXECUTE ON FUNCTION get_user_settings(UUID) TO authenticated;
    GRANT EXECUTE ON FUNCTION get_user_settings(UUID) TO anon;
    GRANT EXECUTE ON FUNCTION get_user_settings(UUID) TO service_role;
  END IF;
END;
$$;

-- Create initialize_user_settings if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'initialize_user_settings'
    AND pg_get_function_arguments(oid) LIKE 'user_id uuid%'
  ) THEN
    -- Create the function directly
    CREATE FUNCTION initialize_user_settings(user_id UUID, settings JSONB DEFAULT '{}'::JSONB)
    RETURNS JSONB
    LANGUAGE plpgsql SECURITY DEFINER
    AS $func$
    DECLARE
      result JSONB;
    BEGIN
      -- If user settings already exist, update them
      IF EXISTS (SELECT 1 FROM public.user_settings WHERE user_id = initialize_user_settings.user_id) THEN
        UPDATE public.user_settings 
        SET 
          theme = COALESCE(settings->>'theme', theme),
          notifications_enabled = COALESCE((settings->>'notifications_enabled')::boolean, notifications_enabled),
          updated_at = NOW()
        WHERE user_id = initialize_user_settings.user_id
        RETURNING 
          jsonb_build_object(
            'id', id,
            'user_id', user_id,
            'theme', theme,
            'notifications_enabled', notifications_enabled,
            'created_at', created_at,
            'updated_at', updated_at
          ) INTO result;
      ELSE
        -- Insert new user settings
        INSERT INTO public.user_settings (
          user_id,
          theme,
          notifications_enabled
        ) VALUES (
          initialize_user_settings.user_id,
          COALESCE(settings->>'theme', 'system'),
          COALESCE((settings->>'notifications_enabled')::boolean, true)
        )
        RETURNING 
          jsonb_build_object(
            'id', id,
            'user_id', user_id,
            'theme', theme,
            'notifications_enabled', notifications_enabled,
            'created_at', created_at,
            'updated_at', updated_at
          ) INTO result;
      END IF;
      
      RETURN result;
    END;
    $func$;
    
    -- Grant permissions
    GRANT EXECUTE ON FUNCTION initialize_user_settings(UUID, JSONB) TO authenticated;
    GRANT EXECUTE ON FUNCTION initialize_user_settings(UUID, JSONB) TO anon;
    GRANT EXECUTE ON FUNCTION initialize_user_settings(UUID, JSONB) TO service_role;
  END IF;
END;
$$;

-- Fix care_groups RLS policies
DO $$
BEGIN
  -- Make sure RLS is enabled for care_groups
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'care_groups') THEN
    EXECUTE 'ALTER TABLE care_groups ENABLE ROW LEVEL SECURITY;';
    
    -- Verify public access policy for care_groups
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'care_groups' 
      AND policyname = 'Public groups can be viewed by anyone'
    ) THEN
      CREATE POLICY "Public groups can be viewed by anyone" 
      ON care_groups 
      FOR SELECT 
      USING (is_public = true);
    END IF;
    
    -- Fix the Group members policy if it exists but has issues
    IF EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'care_groups' 
      AND policyname = 'Group members can view their groups'
    ) THEN
      DROP POLICY "Group members can view their groups" ON care_groups;
      CREATE POLICY "Group members can view their groups" 
      ON care_groups 
      FOR SELECT 
      USING (id IN (
        SELECT group_id 
        FROM care_group_members 
        WHERE user_id = auth.uid()
      ));
    END IF;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error fixing care_groups policies: %', SQLERRM;
END;
$$;
