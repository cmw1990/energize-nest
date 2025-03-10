-- Comprehensive fix for group creation and RLS policies

-- 1. Fix/update the create_group_simple function to ensure it has SECURITY DEFINER
DROP FUNCTION IF EXISTS create_group_simple;

CREATE OR REPLACE FUNCTION create_group_simple(
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
  new_group_id UUID;
BEGIN
  -- Validate input
  IF name_param IS NULL OR name_param = '' THEN
    RAISE EXCEPTION 'Group name cannot be empty';
  END IF;
  
  IF user_id_param IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;
  
  -- Insert the new group
  INSERT INTO care_groups (name, description, is_public, created_by)
  VALUES (name_param, description_param, is_public_param, user_id_param)
  RETURNING id INTO new_group_id;
  
  -- Add the creator as an owner
  INSERT INTO care_group_members (group_id, user_id, role)
  VALUES (new_group_id, user_id_param, 'owner');
  
  RETURN new_group_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_group_simple(TEXT, TEXT, BOOLEAN, UUID) TO authenticated;

-- 2. Fix RLS policy for care_group_members to ensure owners can manage members
DROP POLICY IF EXISTS "Group owners can manage members" ON care_group_members;

CREATE POLICY "Group owners can manage members" ON care_group_members
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM care_group_members m
            WHERE m.group_id = care_group_members.group_id
            AND m.user_id = auth.uid()
            AND m.role = 'owner'
        )
    );

-- 3. Add proper policy for joining public groups with corrected syntax
DROP POLICY IF EXISTS "Join public groups" ON care_group_members;

CREATE POLICY "Join public groups" ON care_group_members
    FOR INSERT 
    WITH CHECK (
        user_id = auth.uid() AND
        group_id IN (
            SELECT id FROM care_groups
            WHERE is_public = true
        )
    );

-- 4. Ensure all tables have enable_row_level_security enabled
ALTER TABLE care_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_tasks ENABLE ROW LEVEL SECURITY; 