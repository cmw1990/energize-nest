-- Final fix for user_settings functions and RLS policies
-- This script addresses:
-- 1. Fix for the ambiguous user_id column in get_user_settings
-- 2. Fix for care_group_members RLS
-- 3. Fix for care_groups RLS

-- Drop and recreate get_user_settings with proper column references
DROP FUNCTION IF EXISTS get_user_settings(uuid);
CREATE FUNCTION get_user_settings(user_id UUID)
RETURNS JSONB 
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  user_settings_record JSONB;
BEGIN
  SELECT 
    jsonb_build_object(
      'id', us.id,
      'user_id', us.user_id,
      'theme', us.theme,
      'notifications_enabled', us.notifications_enabled,
      'created_at', us.created_at,
      'updated_at', us.updated_at
    ) INTO user_settings_record
  FROM 
    public.user_settings us
  WHERE 
    us.user_id = get_user_settings.user_id;
    
  -- Return empty object if no settings found
  IF user_settings_record IS NULL THEN
    RETURN '{}'::JSONB;
  END IF;
  
  RETURN user_settings_record;
END;
$$;

-- Grant permissions for get_user_settings
GRANT EXECUTE ON FUNCTION get_user_settings(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_settings(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_user_settings(UUID) TO service_role;

-- Drop and recreate initialize_user_settings with proper column references
DROP FUNCTION IF EXISTS initialize_user_settings(uuid, jsonb);
CREATE FUNCTION initialize_user_settings(user_id UUID, settings JSONB DEFAULT '{}'::JSONB)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- If user settings already exist, update them
  IF EXISTS (SELECT 1 FROM public.user_settings us WHERE us.user_id = initialize_user_settings.user_id) THEN
    UPDATE public.user_settings us
    SET 
      theme = COALESCE(settings->>'theme', us.theme),
      notifications_enabled = COALESCE((settings->>'notifications_enabled')::boolean, us.notifications_enabled),
      updated_at = NOW()
    WHERE us.user_id = initialize_user_settings.user_id
    RETURNING 
      jsonb_build_object(
        'id', us.id,
        'user_id', us.user_id,
        'theme', us.theme,
        'notifications_enabled', us.notifications_enabled,
        'created_at', us.created_at,
        'updated_at', us.updated_at
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

-- Grant permissions for initialize_user_settings
GRANT EXECUTE ON FUNCTION initialize_user_settings(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION initialize_user_settings(UUID, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION initialize_user_settings(UUID, JSONB) TO service_role;

-- Fix care_groups RLS policies
DO $$
BEGIN
  -- Make sure RLS is enabled for care_groups
  ALTER TABLE care_groups ENABLE ROW LEVEL SECURITY;
  
  -- Drop any existing RLS policies for care_groups
  DROP POLICY IF EXISTS "Public groups can be viewed by anyone" ON care_groups;
  DROP POLICY IF EXISTS "Group members can view their groups" ON care_groups;
  DROP POLICY IF EXISTS "Group creators can do anything" ON care_groups;
  
  -- Create policies for care_groups
  -- Policy for public groups
  CREATE POLICY "Public groups can be viewed by anyone" 
  ON care_groups 
  FOR SELECT 
  USING (is_public = true);
  
  -- Policy for group creators
  CREATE POLICY "Group creators can do anything" 
  ON care_groups 
  USING (created_by = auth.uid());
  
  -- Policy for group members
  CREATE POLICY "Group members can view their groups" 
  ON care_groups 
  FOR SELECT 
  USING (id IN (
    SELECT cgm.group_id 
    FROM care_group_members cgm
    WHERE cgm.user_id = auth.uid()
  ));
END;
$$;

-- Fix care_group_members RLS policies
DO $$
BEGIN
  -- Make sure RLS is enabled for care_group_members
  ALTER TABLE care_group_members ENABLE ROW LEVEL SECURITY;
  
  -- Drop any existing RLS policies for care_group_members
  DROP POLICY IF EXISTS "Group members can view their own memberships" ON care_group_members;
  DROP POLICY IF EXISTS "Group creators can manage members" ON care_group_members;
  DROP POLICY IF EXISTS "Users can view their own memberships" ON care_group_members;
  
  -- Create policies for care_group_members
  -- Policy for users to see their own memberships
  CREATE POLICY "Users can view their own memberships" 
  ON care_group_members 
  FOR SELECT 
  USING (user_id = auth.uid());
  
  -- Policy for group creators to manage members
  CREATE POLICY "Group creators can manage members" 
  ON care_group_members 
  USING (
    group_id IN (
      SELECT cg.id 
      FROM care_groups cg
      WHERE cg.created_by = auth.uid()
    )
  );
END;
$$;
