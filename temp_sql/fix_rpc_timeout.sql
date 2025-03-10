-- Optimized RPC functions with improved performance

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_care_group_members_group_id ON care_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_care_group_members_user_id ON care_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_care_tasks_group_id ON care_tasks(group_id);
CREATE INDEX IF NOT EXISTS idx_care_group_events_group_id ON care_group_events(group_id);
CREATE INDEX IF NOT EXISTS idx_care_group_posts_group_id ON care_group_posts(group_id);

-- Function to get group tasks with optimized performance
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
  -- Simple security check without joins
  IF NOT EXISTS (
    SELECT 1 FROM care_group_members m 
    WHERE m.group_id = group_id_param 
    AND m.user_id = auth.uid()
    LIMIT 1
  ) THEN
    RETURN;
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

-- Function to get group members with optimized performance
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
DECLARE
  is_member BOOLEAN;
  is_public BOOLEAN;
BEGIN
  -- Efficient check for membership and public status (avoids repeated checks)
  SELECT EXISTS (
    SELECT 1 FROM care_group_members m 
    WHERE m.group_id = group_id_param AND m.user_id = auth.uid()
    LIMIT 1
  ) INTO is_member;
  
  IF NOT is_member THEN
    SELECT is_public INTO is_public FROM care_groups WHERE id = group_id_param;
    IF NOT is_public THEN
      RETURN;
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

-- Function to get group events with optimized performance
CREATE OR REPLACE FUNCTION get_group_events(group_id_param UUID)
RETURNS TABLE (
  id UUID,
  group_id UUID,
  title TEXT,
  description TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  location TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Simple security check (only members can view events)
  IF NOT EXISTS (
    SELECT 1 FROM care_group_members m 
    WHERE m.group_id = group_id_param 
    AND m.user_id = auth.uid()
    LIMIT 1
  ) THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    e.id,
    e.group_id,
    e.title,
    e.description,
    e.start_time,
    e.end_time,
    e.location,
    e.created_by,
    e.created_at
  FROM care_group_events e
  WHERE e.group_id = group_id_param;
END;
$$;

-- Function to get group posts with optimized performance
CREATE OR REPLACE FUNCTION get_group_posts(group_id_param UUID)
RETURNS TABLE (
  id UUID,
  group_id UUID,
  content TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Simple security check (only members can view posts)
  IF NOT EXISTS (
    SELECT 1 FROM care_group_members m 
    WHERE m.group_id = group_id_param 
    AND m.user_id = auth.uid()
    LIMIT 1
  ) THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id,
    p.group_id,
    p.content,
    p.created_by,
    p.created_at
  FROM care_group_posts p
  WHERE p.group_id = group_id_param
  ORDER BY p.created_at DESC;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_group_tasks(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_group_members(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_group_events(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_group_posts(UUID) TO authenticated; 