-- Create the RPC function needed by the frontend
-- This function is designed to be used directly through the REST API

-- First drop existing versions
DROP FUNCTION IF EXISTS public.create_care_group_direct;

-- Create the RPC function with simplified approach
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
  
  -- Insert the group directly, bypassing RLS
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
  
  -- Make the user an owner, also bypassing RLS
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

-- Create simplified policies
-- First drop problematic policies
DROP POLICY IF EXISTS "Creators can manage group memberships" ON public.care_group_members;
DROP POLICY IF EXISTS "Group creators can manage memberships" ON public.care_group_members;
DROP POLICY IF EXISTS "Group owners can manage memberships" ON public.care_group_members;

-- Create a simplified policy for group membership management
CREATE POLICY "Members can manage their own memberships" ON public.care_group_members
    FOR ALL USING (user_id = auth.uid());

-- Make sure service role can do anything
CREATE POLICY "Service role can do anything to care_group_members" ON public.care_group_members
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything to care_groups" ON public.care_groups
    FOR ALL USING (auth.role() = 'service_role');
