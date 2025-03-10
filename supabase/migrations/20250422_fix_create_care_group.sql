-- Fix the create_care_group function to prevent NULL values in created_by column

-- Drop the existing function first
DROP FUNCTION IF EXISTS public.create_care_group;

-- Recreate the function with proper NULL checking
CREATE OR REPLACE FUNCTION public.create_care_group(
  p_name TEXT,
  p_description TEXT,
  p_is_public BOOLEAN DEFAULT FALSE
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
  -- Get the current user ID
  v_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to create a care group';
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
  
  -- Log the activity
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
  
  RETURN v_group_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;

-- Also refresh policies to ensure they use created_by correctly
DROP POLICY IF EXISTS "Group creators can manage their groups" ON public.care_groups;
CREATE POLICY "Group creators can manage their groups" ON public.care_groups
  FOR ALL USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Creators can manage group memberships" ON public.care_group_members;
CREATE POLICY "Creators can manage group memberships" ON public.care_group_members
  FOR ALL USING (
    group_id IN (
      SELECT id FROM public.care_groups
      WHERE created_by = auth.uid()
    )
  );

-- Add a function to get care groups for the current user
CREATE OR REPLACE FUNCTION public.get_user_care_groups()
RETURNS SETOF care_groups
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT g.*
  FROM care_groups g
  WHERE 
    g.created_by = auth.uid() 
    OR 
    EXISTS (
      SELECT 1 
      FROM care_group_members m 
      WHERE m.group_id = g.id AND m.user_id = auth.uid()
    )
    OR
    g.is_public = true;
$$;

-- Add a function to get care group memberships for the current user
CREATE OR REPLACE FUNCTION public.get_user_care_group_memberships()
RETURNS SETOF care_group_members
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.*
  FROM care_group_members m
  WHERE m.user_id = auth.uid();
$$;
