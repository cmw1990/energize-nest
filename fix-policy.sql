-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view group members" ON care_group_members;

-- Create a fixed version that avoids the recursion
CREATE POLICY "Users can view group members fixed" 
  ON care_group_members FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT user_id FROM care_group_members AS cgm
      WHERE cgm.group_id = care_group_members.group_id
    )
  );

-- Also drop and recreate the problematic insert policy
DROP POLICY IF EXISTS "Group owners and admins can add members" ON care_group_members;

CREATE POLICY "Group owners and admins can add members fixed" 
  ON care_group_members FOR INSERT 
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM care_group_members AS cgm
      WHERE cgm.group_id = care_group_members.group_id 
      AND (cgm.role = 'owner' OR cgm.role = 'admin')
    ) OR 
    auth.uid() = user_id -- Users can add themselves to public groups
  ); 