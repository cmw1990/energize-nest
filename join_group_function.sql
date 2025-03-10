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