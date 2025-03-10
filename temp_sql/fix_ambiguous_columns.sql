-- Fix for ambiguous column references in RPC functions

-- Function to get group tasks safely with explicit column references
CREATE OR REPLACE FUNCTION get_group_tasks(group_id_param UUID)
RETURNS TABLE (
  id UUID,
  group_id UUID,
  title TEXT,
  description TEXT,
  status TEXT,
  priority TEXT,
  due_date TIMESTAMPTZ,
  assigned_to UUID,
  created_by UUID,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is a member of the group
  IF NOT EXISTS (
    SELECT 1 FROM care_group_members m 
    WHERE m.group_id = group_id_param 
    AND m.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized to view tasks for this group';
  END IF;
  
  RETURN QUERY
  SELECT 
    t.id,
    t.group_id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.due_date,
    t.assigned_to,
    t.created_by,
    t.created_at
  FROM care_tasks t
  WHERE t.group_id = group_id_param;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_group_tasks(UUID) TO authenticated;

-- Function to get group members safely with explicit column references
CREATE OR REPLACE FUNCTION get_group_members(group_id_param UUID)
RETURNS TABLE (
  id UUID,
  group_id UUID,
  user_id UUID,
  role TEXT,
  joined_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is a member of the group
  IF NOT EXISTS (
    SELECT 1 FROM care_group_members m 
    WHERE m.group_id = group_id_param 
    AND m.user_id = auth.uid()
  ) THEN
    -- Check if the group is public
    IF NOT EXISTS (
      SELECT 1 FROM care_groups g 
      WHERE g.id = group_id_param 
      AND g.is_public = true
    ) THEN
      RAISE EXCEPTION 'Not authorized to view this group''s members';
    END IF;
  END IF;
  
  RETURN QUERY
  SELECT 
    m.id,
    m.group_id,
    m.user_id,
    m.role,
    m.joined_at
  FROM care_group_members m
  WHERE m.group_id = group_id_param;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_group_members(UUID) TO authenticated; 