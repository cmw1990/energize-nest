-- Fix for missing get_user_settings function and care_groups RLS
-- This script addresses:
-- 1. Missing get_user_settings function
-- 2. Ensuring proper RLS for care_groups table

-- Create the missing get_user_settings function
CREATE OR REPLACE FUNCTION get_user_settings(user_id UUID)
RETURNS JSONB 
LANGUAGE plpgsql SECURITY DEFINER
AS $$
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
$$;

-- Create the initialize_user_settings function if it doesn't exist yet
CREATE OR REPLACE FUNCTION initialize_user_settings(user_id UUID, settings JSONB DEFAULT '{}'::JSONB)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
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
$$;

-- Verify the care_groups table exists and enable RLS
DO $$
BEGIN
  -- Make sure RLS is enabled for care_groups
  EXECUTE 'ALTER TABLE IF EXISTS care_groups ENABLE ROW LEVEL SECURITY;';
  
  -- Verify public access policy for care_groups
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'care_groups' 
    AND policyname = 'Public groups can be viewed by anyone'
  ) THEN
    EXECUTE 'CREATE POLICY "Public groups can be viewed by anyone" ON care_groups FOR SELECT USING (is_public = true);';
  END IF;
  
  -- Fix the Group members policy if it exists but has issues
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'care_groups' 
    AND policyname = 'Group members can view their groups'
  ) THEN
    EXECUTE 'DROP POLICY "Group members can view their groups" ON care_groups;';
    EXECUTE 'CREATE POLICY "Group members can view their groups" ON care_groups FOR SELECT USING (id IN (SELECT group_id FROM care_group_members WHERE user_id = auth.uid()));';
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error fixing care_groups policies: %', SQLERRM;
END;
$$;

-- Grant required permissions
GRANT EXECUTE ON FUNCTION get_user_settings(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_settings(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_user_settings(UUID) TO service_role;

GRANT EXECUTE ON FUNCTION initialize_user_settings(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION initialize_user_settings(UUID, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION initialize_user_settings(UUID, JSONB) TO service_role;

-- Ensure the get_auth_user function also exists as a fallback
-- In the error message, it was hinted to use this function instead
-- We'll keep both functions to maintain compatibility
CREATE OR REPLACE FUNCTION get_auth_user() 
RETURNS JSONB 
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  user_data JSONB;
BEGIN
  SELECT 
    jsonb_build_object(
      'id', id,
      'email', email,
      'role', (SELECT role FROM user_roles WHERE user_id = auth.uid())
    ) INTO user_data
  FROM 
    auth.users
  WHERE 
    id = auth.uid();
    
  RETURN user_data;
END;
$$;

GRANT EXECUTE ON FUNCTION get_auth_user() TO authenticated;
GRANT EXECUTE ON FUNCTION get_auth_user() TO anon;
GRANT EXECUTE ON FUNCTION get_auth_user() TO service_role;
