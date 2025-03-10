-- Complete fix for user_settings and care_groups table issues
-- This migration fixes:
-- 1. The ambiguous user_id column in get_user_settings function
-- 2. The RLS policies for care_groups and care_group_members

-- Fix get_user_settings function with proper column qualification
CREATE OR REPLACE FUNCTION get_user_settings(user_id UUID)
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

-- Fix initialize_user_settings function with proper column qualification
CREATE OR REPLACE FUNCTION initialize_user_settings(user_id UUID, settings JSONB DEFAULT '{}'::JSONB)
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

-- Grant required permissions
GRANT EXECUTE ON FUNCTION get_user_settings(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_settings(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_user_settings(UUID) TO service_role;

GRANT EXECUTE ON FUNCTION initialize_user_settings(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION initialize_user_settings(UUID, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION initialize_user_settings(UUID, JSONB) TO service_role;

-- Fix care_groups tables and policies
DO $$
BEGIN
  -- First verify tables exist and create them if they don't
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'care_groups') THEN
    CREATE TABLE care_groups (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_by UUID NOT NULL REFERENCES auth.users(id),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      is_public BOOLEAN DEFAULT FALSE,
      image_url TEXT
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'care_group_members') THEN
    CREATE TABLE care_group_members (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      group_id UUID NOT NULL REFERENCES care_groups(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES auth.users(id),
      role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
      joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      invited_by UUID REFERENCES auth.users(id),
      UNIQUE (group_id, user_id)
    );
  END IF;

  -- Enable RLS on tables
  EXECUTE 'ALTER TABLE care_groups ENABLE ROW LEVEL SECURITY;';
  EXECUTE 'ALTER TABLE care_group_members ENABLE ROW LEVEL SECURITY;';
  
  -- Drop conflicting policies
  DROP POLICY IF EXISTS "Group creators can do anything" ON care_groups;
  DROP POLICY IF EXISTS "Public groups can be viewed by anyone" ON care_groups;
  DROP POLICY IF EXISTS "Group members can view their groups" ON care_groups;
  DROP POLICY IF EXISTS "Group members can see other members" ON care_group_members;
  DROP POLICY IF EXISTS "Group owners and admins can manage members" ON care_group_members;
  DROP POLICY IF EXISTS "Users can see their own memberships" ON care_group_members;
  DROP POLICY IF EXISTS "Users can join public groups" ON care_group_members;
  
  -- Create simplified policies with clear table aliases
  -- Care Groups policies
  CREATE POLICY "Group creators can do anything" 
  ON care_groups 
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

  CREATE POLICY "Public groups can be viewed by anyone" 
  ON care_groups 
  FOR SELECT
  USING (is_public = true);

  CREATE POLICY "Group members can view their groups" 
  ON care_groups 
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM care_group_members cgm 
      WHERE cgm.group_id = care_groups.id
      AND cgm.user_id = auth.uid()
    )
  );

  -- Care Group Members policies
  CREATE POLICY "Group members can see other members" 
  ON care_group_members 
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM care_group_members cgm 
      WHERE cgm.group_id = care_group_members.group_id
      AND cgm.user_id = auth.uid()
    )
  );

  CREATE POLICY "Group owners and admins can manage members" 
  ON care_group_members 
  USING (
    EXISTS (
      SELECT 1
      FROM care_group_members cgm
      WHERE cgm.group_id = care_group_members.group_id
      AND cgm.user_id = auth.uid()
      AND cgm.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM care_group_members cgm
      WHERE cgm.group_id = care_group_members.group_id
      AND cgm.user_id = auth.uid()
      AND cgm.role IN ('owner', 'admin')
    )
  );

  CREATE POLICY "Users can see their own memberships" 
  ON care_group_members 
  FOR SELECT
  USING (user_id = auth.uid());

  CREATE POLICY "Users can join public groups" 
  ON care_group_members 
  FOR INSERT
  WITH CHECK (
    -- Check if the group is public
    EXISTS (
      SELECT 1
      FROM care_groups cg
      WHERE cg.id = care_group_members.group_id
      AND cg.is_public = true
    )
    AND
    -- Make sure the user is inserting their own membership
    user_id = auth.uid()
    AND
    -- New member must have role 'member'
    role = 'member'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error fixing care_groups policies: %', SQLERRM;
END;
$$;
