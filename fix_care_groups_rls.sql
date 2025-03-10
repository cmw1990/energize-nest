-- First, drop any existing policies causing recursion issues
DROP POLICY IF EXISTS "Users can view public groups" ON care_groups;
DROP POLICY IF EXISTS "Users can view their own groups" ON care_groups;
DROP POLICY IF EXISTS "Users can create groups" ON care_groups;

-- Add policy for viewing public groups
CREATE POLICY "Users can view public groups"
ON care_groups FOR SELECT
USING (is_public = true);

-- Add policy for viewing groups the user is a member of
CREATE POLICY "Users can view their own groups"
ON care_groups FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM care_group_members
    WHERE care_group_members.group_id = care_groups.id
    AND care_group_members.user_id = auth.uid()
  )
);

-- Add policy for creating groups
CREATE POLICY "Users can create groups"
ON care_groups FOR INSERT
WITH CHECK (created_by = auth.uid());
