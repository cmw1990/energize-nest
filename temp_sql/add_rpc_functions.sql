-- Add RPC functions to properly handle membership queries without recursion issues

-- Drop problematic policies if they still exist
DROP POLICY IF EXISTS "Join public groups" ON public.care_group_members;

-- Add policy for joining public groups - using correct syntax with WITH CHECK
CREATE POLICY "Join public groups" ON public.care_group_members
    FOR INSERT 
    WITH CHECK (
        user_id = auth.uid() AND
        group_id IN (
            SELECT id FROM care_groups
            WHERE is_public = true
        )
    );

-- Fix and simplify care_tasks policies to avoid recursion
DROP POLICY IF EXISTS "Group members can see tasks in their group" ON care_tasks;
DROP POLICY IF EXISTS "Assigned tasks are visible to assignee" ON care_tasks;
DROP POLICY IF EXISTS "Group owners and admins can manage tasks" ON care_tasks;
DROP POLICY IF EXISTS "Task creators can manage tasks" ON care_tasks;
DROP POLICY IF EXISTS "Assigned users can update task status" ON care_tasks;

-- Create simpler policies for tasks
CREATE POLICY "View tasks if member of group" ON care_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM care_group_members 
      WHERE care_group_members.group_id = care_tasks.group_id
      AND care_group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "View tasks if assigned to me" ON care_tasks
  FOR SELECT USING (assigned_to = auth.uid());

CREATE POLICY "Manage tasks if created by me" ON care_tasks
  FOR ALL USING (created_by = auth.uid());

-- Function to get group tasks safely - FIXED column reference ambiguity
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
    SELECT 1 FROM care_group_members 
    WHERE care_group_members.group_id = group_id_param 
    AND care_group_members.user_id = auth.uid()
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

-- Function to get group members safely - FIXED column reference ambiguity
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
    SELECT 1 FROM care_group_members 
    WHERE care_group_members.group_id = group_id_param 
    AND care_group_members.user_id = auth.uid()
  ) THEN
    -- Check if the group is public
    IF NOT EXISTS (
      SELECT 1 FROM care_groups 
      WHERE care_groups.id = group_id_param 
      AND care_groups.is_public = true
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

-- Function to get user memberships safely
CREATE OR REPLACE FUNCTION get_user_memberships(user_id_param UUID)
RETURNS SETOF care_group_members
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Security check
  IF auth.uid() <> user_id_param THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  
  RETURN QUERY
  SELECT * FROM care_group_members WHERE user_id = user_id_param;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_user_memberships(UUID) TO authenticated;

-- Function that combines group data with membership data for more efficient queries
CREATE OR REPLACE FUNCTION get_user_group_data(user_id_param UUID)
RETURNS TABLE (
  membership_id UUID,
  group_id UUID,
  user_id UUID,
  role TEXT,
  group_name TEXT,
  group_description TEXT,
  is_public BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Security check
  IF auth.uid() <> user_id_param THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  
  RETURN QUERY
  SELECT 
    m.id as membership_id,
    m.group_id,
    m.user_id,
    m.role,
    g.name as group_name,
    g.description as group_description,
    g.is_public
  FROM care_group_members m
  JOIN care_groups g ON m.group_id = g.id
  WHERE m.user_id = user_id_param;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_user_group_data(UUID) TO authenticated; 