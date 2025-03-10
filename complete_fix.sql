-- ------------------------------
-- FIX ALL RLS POLICIES
-- ------------------------------

-- Drop all existing policies on care_group_members first
DO $$
BEGIN
    -- Get all policies for this table
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'care_group_members' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON care_group_members';
    END LOOP;
END
$$;

-- Enable RLS on the care_group_members table (in case it's not enabled)
ALTER TABLE care_group_members ENABLE ROW LEVEL SECURITY;

-- Create non-recursive policies for care_group_members
-- Policy for SELECT: Allow users to see records where they are the user_id
CREATE POLICY "Users can view their own memberships" 
ON care_group_members FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Policy for SELECT: Allow users to see members in groups they belong to
CREATE POLICY "Users can view other members in their groups" 
ON care_group_members FOR SELECT 
TO authenticated 
USING (
  group_id IN (
    SELECT group_id FROM care_group_members WHERE user_id = auth.uid()
  )
);

-- Policy for INSERT: Allow users to insert their own membership
CREATE POLICY "Users can insert their own membership" 
ON care_group_members FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Policy for DELETE: Allow users to delete their own membership
CREATE POLICY "Users can delete their own membership" 
ON care_group_members FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- ------------------------------
-- CREATE HELPER FUNCTIONS
-- ------------------------------

-- Create a custom function to safely get care group members
CREATE OR REPLACE FUNCTION get_user_group_memberships(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  group_id UUID,
  user_id UUID,
  role TEXT,
  joined_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Security check: only allow users to get their own memberships
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Return the memberships for this user
  RETURN QUERY
  SELECT cgm.id, cgm.group_id, cgm.user_id, cgm.role, cgm.joined_at
  FROM care_group_members cgm
  WHERE cgm.user_id = p_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_group_memberships(UUID) TO authenticated;

-- Create function to get members of a specific group
CREATE OR REPLACE FUNCTION get_group_members(p_group_id UUID)
RETURNS TABLE (
  id UUID,
  group_id UUID,
  user_id UUID,
  role TEXT,
  joined_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Security check: only allow if the current user is a member of this group
  IF NOT EXISTS (
    SELECT 1 FROM care_group_members 
    WHERE group_id = p_group_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Return all members of the specified group
  RETURN QUERY
  SELECT cgm.id, cgm.group_id, cgm.user_id, cgm.role, cgm.joined_at
  FROM care_group_members cgm
  WHERE cgm.group_id = p_group_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_group_members(UUID) TO authenticated;

-- Create a function to safely join a group
CREATE OR REPLACE FUNCTION join_group(p_group_id UUID, p_user_id UUID, p_role TEXT DEFAULT 'member')
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_public BOOLEAN;
BEGIN
  -- Security check: only allow users to join as themselves
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Not authorized to join group on behalf of another user';
  END IF;
  
  -- Check if user is already a member
  IF EXISTS (
    SELECT 1 FROM care_group_members 
    WHERE group_id = p_group_id AND user_id = p_user_id
  ) THEN
    RETURN TRUE; -- Already a member, consider it success
  END IF;
  
  -- Check if the group is public (users can only join public groups directly)
  SELECT is_public INTO v_is_public 
  FROM care_groups 
  WHERE id = p_group_id;
  
  IF v_is_public IS NULL THEN
    RAISE EXCEPTION 'Group not found';
  END IF;
  
  IF NOT v_is_public THEN
    RAISE EXCEPTION 'Cannot directly join a private group';
  END IF;
  
  -- Add the user as a member
  INSERT INTO care_group_members (group_id, user_id, role)
  VALUES (p_group_id, p_user_id, p_role);
  
  RETURN TRUE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION join_group(UUID, UUID, TEXT) TO authenticated;

-- Create a function to safely create a group
CREATE OR REPLACE FUNCTION create_group_simple(
  name_param TEXT,
  description_param TEXT,
  is_public_param BOOLEAN,
  user_id_param UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_group_id UUID;
BEGIN
  -- Security check: only allow users to create as themselves
  IF auth.uid() != user_id_param THEN
    RAISE EXCEPTION 'Not authorized to create group on behalf of another user';
  END IF;
  
  -- Insert the new group
  INSERT INTO care_groups (
    name,
    description,
    is_public,
    created_by
  )
  VALUES (
    name_param,
    description_param,
    is_public_param,
    user_id_param
  )
  RETURNING id INTO new_group_id;
  
  -- Add the user as an owner of the group
  INSERT INTO care_group_members (
    group_id,
    user_id,
    role
  )
  VALUES (
    new_group_id,
    user_id_param,
    'owner'
  );
  
  RETURN new_group_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_group_simple(TEXT, TEXT, BOOLEAN, UUID) TO authenticated; 