-- Comprehensive fix for Group Detail page

-- Add RLS policies for care_group_events and care_group_posts
ALTER TABLE care_group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for events
DROP POLICY IF EXISTS "Group members can view events" ON care_group_events;
CREATE POLICY "Group members can view events" ON care_group_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE care_group_members.group_id = care_group_events.group_id
      AND care_group_members.user_id = auth.uid()
    )
  );

-- Create policies for posts
DROP POLICY IF EXISTS "Group members can view posts" ON care_group_posts;
CREATE POLICY "Group members can view posts" ON care_group_posts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE care_group_members.group_id = care_group_posts.group_id
      AND care_group_members.user_id = auth.uid()
    )
  );

-- Fix get_group_tasks function (with proper aliases)
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

-- Fix get_group_members function (with proper aliases)
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

-- Create RPC functions for events and posts to simplify frontend code
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
  -- Check if user is a member of the group
  IF NOT EXISTS (
    SELECT 1 FROM care_group_members m 
    WHERE m.group_id = group_id_param 
    AND m.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized to view events for this group';
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_group_events(UUID) TO authenticated;

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
  -- Check if user is a member of the group
  IF NOT EXISTS (
    SELECT 1 FROM care_group_members m 
    WHERE m.group_id = group_id_param 
    AND m.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized to view posts for this group';
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_group_posts(UUID) TO authenticated; 