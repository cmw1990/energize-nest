-- Final fix for the RLS recursion and group creation issues
-- This migration takes a minimal approach focusing only on the critical issues

-- Step 1: Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can view public groups" ON public.care_groups;
DROP POLICY IF EXISTS "Group creators can manage their groups" ON public.care_groups;
DROP POLICY IF EXISTS "Members can view their groups" ON public.care_groups;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.care_group_members;
DROP POLICY IF EXISTS "Group creators can manage memberships" ON public.care_group_members;
DROP POLICY IF EXISTS "Service role can manage all" ON public.care_group_members;
DROP POLICY IF EXISTS "Service role can manage all groups" ON public.care_groups;
DROP POLICY IF EXISTS "Group creators can view and manage their groups" ON public.care_groups;
DROP POLICY IF EXISTS "Group creators can manage all memberships" ON public.care_group_members;
DROP POLICY IF EXISTS "Members can manage their own memberships" ON public.care_group_members;
DROP POLICY IF EXISTS "Service role can do anything to care_group_members" ON public.care_group_members;
DROP POLICY IF EXISTS "Service role can do anything to care_groups" ON public.care_groups;
DROP POLICY IF EXISTS "Owners can manage group memberships" ON public.care_group_members;
DROP POLICY IF EXISTS "Creators can manage group memberships" ON public.care_group_members;

-- Step 2: Create extremely simplified policies that avoid any recursion

-- Everyone can see public groups
CREATE POLICY "Anyone can view public groups" ON public.care_groups
    FOR SELECT USING (is_public = true);

-- Group creators can do anything with their groups
CREATE POLICY "Creators can manage their groups" ON public.care_groups
    FOR ALL USING (created_by = auth.uid());

-- Group members can view their groups (no recursion)
CREATE POLICY "Members can view their groups" ON public.care_groups
    FOR SELECT USING (
        id IN (
            SELECT group_id FROM care_group_members 
            WHERE user_id = auth.uid()
        )
    );

-- Users can view their own memberships (no recursion)
CREATE POLICY "Users can view own memberships" ON public.care_group_members
    FOR SELECT USING (user_id = auth.uid());

-- Users can manage memberships in groups they own
CREATE POLICY "Group owners manage memberships" ON public.care_group_members
    FOR ALL USING (
        group_id IN (
            SELECT id FROM care_groups 
            WHERE created_by = auth.uid()
        )
    );

-- Step 3: Create a clean, simple create_group function
DROP FUNCTION IF EXISTS public.create_group_simple;

CREATE OR REPLACE FUNCTION public.create_group_simple(
  name_param TEXT,
  description_param TEXT,
  is_public_param BOOLEAN,
  user_id_param UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  group_id UUID;
BEGIN
  -- Validate input
  IF user_id_param IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;

  -- Insert group record
  INSERT INTO care_groups (
    name, 
    description, 
    is_public, 
    created_by
  ) VALUES (
    name_param, 
    description_param, 
    is_public_param, 
    user_id_param
  ) 
  RETURNING id INTO group_id;
  
  -- Add user as owner
  INSERT INTO care_group_members (
    group_id,
    user_id,
    role
  ) VALUES (
    group_id,
    user_id_param,
    'owner'
  );
  
  RETURN group_id;
END;
$$;
