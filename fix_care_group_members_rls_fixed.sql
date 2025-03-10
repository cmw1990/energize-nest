-- First, drop any existing policies causing recursion issues
DROP POLICY IF EXISTS "Allow access to own memberships" ON care_group_members;
DROP POLICY IF EXISTS "Allow viewing members if user is also a member" ON care_group_members;
DROP POLICY IF EXISTS "Allow viewing all members of public groups" ON care_group_members;

-- Simple direct policy to view own memberships
CREATE POLICY "Users can view their own memberships"
ON care_group_members FOR SELECT
USING (user_id = auth.uid());

-- Simple policy to allow group owners to see all members in their groups
CREATE POLICY "Group owners can view all members of their groups"
ON care_group_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM care_group_members AS owner_check
    WHERE owner_check.group_id = care_group_members.group_id
    AND owner_check.user_id = auth.uid()
    AND owner_check.role = 'owner'
  )
);

-- Simple policy for public groups
CREATE POLICY "Anyone can view members of public groups"
ON care_group_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM care_groups
    WHERE care_groups.id = care_group_members.group_id
    AND care_groups.is_public = true
  )
);

-- Allow users to insert themselves into groups
CREATE POLICY "Users can add themselves to groups"
ON care_group_members FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Allow group owners to add members (fixed version without NEW reference)
CREATE POLICY "Group owners can add members"
ON care_group_members FOR INSERT
USING (
  EXISTS (
    SELECT 1 FROM care_group_members
    WHERE care_group_members.group_id = care_group_members.group_id
    AND care_group_members.user_id = auth.uid()
    AND care_group_members.role = 'owner'
  )
);
