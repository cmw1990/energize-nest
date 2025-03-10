-- Fix null created_by issue in care_groups table and functions

-- Drop the existing function first
DROP FUNCTION IF EXISTS public.create_care_group;

-- Create an enhanced version that explicitly handles the creator_id
CREATE OR REPLACE FUNCTION public.create_care_group(
  p_name TEXT,
  p_description TEXT,
  p_is_public BOOLEAN DEFAULT FALSE,
  p_creator_id UUID DEFAULT NULL -- Optional parameter for service role calls
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_group_id UUID;
  v_user_id UUID;
BEGIN
  -- Get the current user ID, with fallback to the provided creator_id
  -- This allows the function to work both with normal auth and service role calls
  v_user_id := COALESCE(p_creator_id, auth.uid());
  
  -- Check if we have a valid user ID
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated or creator_id must be provided';
  END IF;

  -- Insert the new group and get its ID
  INSERT INTO care_groups (
    name,
    description,
    is_public,
    created_by
  ) VALUES (
    p_name,
    p_description,
    p_is_public,
    v_user_id
  )
  RETURNING id INTO v_group_id;
  
  -- Add the creator as an owner member
  INSERT INTO care_group_members (
    group_id,
    user_id,
    role
  ) VALUES (
    v_group_id,
    v_user_id,
    'owner'
  );
  
  -- Log the activity if the care_activity_log table exists
  BEGIN
    INSERT INTO care_activity_log (
      group_id,
      user_id,
      activity_type,
      activity_data
    ) VALUES (
      v_group_id,
      v_user_id,
      'group_created',
      jsonb_build_object(
        'group_name', p_name,
        'is_public', p_is_public
      )
    );
  EXCEPTION
    WHEN undefined_table THEN
      -- Table doesn't exist, just skip the logging
      NULL;
    WHEN OTHERS THEN
      -- Log the error but don't fail the group creation
      RAISE WARNING 'Failed to log group creation activity: %', SQLERRM;
  END;
  
  RETURN v_group_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;

-- Create helper functions to fetch groups and memberships
CREATE OR REPLACE FUNCTION public.get_care_groups_for_user(user_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  is_public BOOLEAN,
  created_at TIMESTAMPTZ,
  created_by UUID,
  updated_at TIMESTAMPTZ,
  image_url TEXT,
  role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the user ID, defaulting to the authenticated user if not provided
  v_user_id := COALESCE(user_id, auth.uid());
  
  -- Check if we have a valid user ID
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated or user_id must be provided';
  END IF;
  
  RETURN QUERY
  SELECT 
    g.id,
    g.name,
    g.description,
    g.is_public,
    g.created_at,
    g.created_by,
    g.updated_at,
    g.image_url,
    m.role
  FROM 
    care_groups g
  LEFT JOIN 
    care_group_members m ON g.id = m.group_id AND m.user_id = v_user_id
  WHERE 
    g.created_by = v_user_id 
    OR m.user_id IS NOT NULL 
    OR g.is_public = true;
END;
$$;

-- Make sure RLS is enabled on relevant tables
ALTER TABLE IF EXISTS public.care_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.care_group_members ENABLE ROW LEVEL SECURITY;

-- Refresh policies to ensure they work correctly
DROP POLICY IF EXISTS "Anyone can view public groups" ON public.care_groups;
CREATE POLICY "Anyone can view public groups" ON public.care_groups
    FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Members can view their groups" ON public.care_groups;
CREATE POLICY "Members can view their groups" ON public.care_groups
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM care_group_members 
            WHERE group_id = care_groups.id AND user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Group creators can manage their groups" ON public.care_groups;
CREATE POLICY "Group creators can manage their groups" ON public.care_groups
    FOR ALL USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can view their own memberships" ON public.care_group_members;
CREATE POLICY "Users can view their own memberships" ON public.care_group_members
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Creators can manage group memberships" ON public.care_group_members;
CREATE POLICY "Creators can manage group memberships" ON public.care_group_members
    FOR ALL USING (
        group_id IN (
            SELECT id FROM public.care_groups
            WHERE created_by = auth.uid()
        )
    );
