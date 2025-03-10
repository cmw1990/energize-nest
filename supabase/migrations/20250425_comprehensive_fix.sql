-- Comprehensive fix for both infinite recursion in policies AND create_care_group function

-- Step 1: Drop all problematic policies that might be causing the recursion
DROP POLICY IF EXISTS "Creators can manage group memberships" ON public.care_group_members;
DROP POLICY IF EXISTS "Members can view their groups" ON public.care_groups;
DROP POLICY IF EXISTS "Group creators can manage their groups" ON public.care_groups;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.care_group_members;
DROP POLICY IF EXISTS "Group owners can manage memberships" ON public.care_group_members;
DROP POLICY IF EXISTS "Anyone can view public groups" ON public.care_groups;
DROP POLICY IF EXISTS "Group creators can view and manage their groups" ON public.care_groups;
DROP POLICY IF EXISTS "Group creators can manage all memberships" ON public.care_group_members;
DROP POLICY IF EXISTS "Owners can manage group memberships" ON public.care_group_members;
DROP POLICY IF EXISTS "Service role can manage all memberships" ON public.care_group_members;
DROP POLICY IF EXISTS "Service role can manage all groups" ON public.care_groups;

-- Step 2: Make sure RLS is enabled on the tables
ALTER TABLE IF EXISTS public.care_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.care_group_members ENABLE ROW LEVEL SECURITY;

-- Step 3: Create simplified policies for care_groups table that avoid circular references
CREATE POLICY "Anyone can view public groups" ON public.care_groups
    FOR SELECT USING (is_public = true);

CREATE POLICY "Group creators can manage their groups" ON public.care_groups
    FOR ALL USING (created_by = auth.uid());

-- Step 4: Create a policy for members to view their groups
CREATE POLICY "Members can view their groups" ON public.care_groups
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM care_group_members 
            WHERE care_group_members.group_id = care_groups.id 
            AND care_group_members.user_id = auth.uid()
        )
    );

-- Step 5: Create policies for care_group_members that don't reference RLS on care_groups
CREATE POLICY "Users can view their own memberships" ON public.care_group_members
    FOR SELECT USING (user_id = auth.uid());

-- Group creators can manage memberships in their groups
CREATE POLICY "Group creators can manage memberships" ON public.care_group_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM care_groups
            WHERE id = care_group_members.group_id
            AND created_by = auth.uid()
        )
    );

-- Service role can manage everything
CREATE POLICY "Service role can manage all" ON public.care_group_members
    FOR ALL USING (
        -- This is true for service role auth
        auth.role() = 'service_role'
    );

CREATE POLICY "Service role can manage all groups" ON public.care_groups
    FOR ALL USING (
        auth.role() = 'service_role'
    );

-- Step 6: Fix the create_care_group function
DROP FUNCTION IF EXISTS public.create_care_group;

CREATE OR REPLACE FUNCTION public.create_care_group(
  p_name TEXT,
  p_description TEXT,
  p_is_public BOOLEAN DEFAULT FALSE,
  p_creator_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_group_id UUID;
  v_creator_id UUID;
BEGIN
  -- Get the creator ID, either from parameter or authenticated user
  v_creator_id := COALESCE(p_creator_id, auth.uid());
  
  -- Validate creator ID
  IF v_creator_id IS NULL THEN
    RAISE EXCEPTION 'Creator ID cannot be null';
  END IF;

  -- Insert the new group
  INSERT INTO care_groups (
    name,
    description,
    is_public,
    created_by
  ) VALUES (
    p_name,
    p_description,
    p_is_public,
    v_creator_id
  )
  RETURNING id INTO v_group_id;
  
  -- Add the creator as the owner
  INSERT INTO care_group_members (
    group_id,
    user_id,
    role
  ) VALUES (
    v_group_id,
    v_creator_id,
    'owner'
  );
  
  RETURN v_group_id;
END;
$$;

-- Step 7: Create helper functions that work directly with tables
-- Function to get user's group memberships
CREATE OR REPLACE FUNCTION public.get_user_group_memberships(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  group_id UUID,
  user_id UUID,
  role TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, group_id, user_id, role
  FROM care_group_members
  WHERE user_id = COALESCE(p_user_id, auth.uid());
$$;

-- Function to get all public groups
CREATE OR REPLACE FUNCTION public.get_public_groups()
RETURNS SETOF care_groups
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM care_groups
  WHERE is_public = true;
$$;

-- Function to create a group and immediately make the user a member
CREATE OR REPLACE FUNCTION public.create_care_group_direct(
  p_name TEXT,
  p_description TEXT DEFAULT NULL,
  p_is_public BOOLEAN DEFAULT FALSE,
  p_user_id UUID DEFAULT NULL
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
  -- Use provided user ID or current user
  v_user_id := COALESCE(p_user_id, auth.uid());
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID is required';
  END IF;
  
  -- Insert the group
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
  
  -- Make the user an owner
  INSERT INTO care_group_members (
    group_id,
    user_id,
    role
  ) VALUES (
    v_group_id,
    v_user_id,
    'owner'
  );
  
  RETURN v_group_id;
END;
$$;
