-- Create a custom function to safely get care group members
-- This function runs with security definer privileges to bypass RLS
-- but implements its own security checks
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

-- Create another function to get members of a specific group
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