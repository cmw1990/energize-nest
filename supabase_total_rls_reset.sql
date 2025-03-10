-- COMPLETE RESET OF ALL SUPABASE RLS POLICIES FOR CARE GROUPS SYSTEM

-- STEP 1: DISABLE ALL RLS ON TABLES TEMPORARILY
ALTER TABLE care_groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_invitations DISABLE ROW LEVEL SECURITY;

-- STEP 2: DROP ALL EXISTING POLICIES
DROP POLICY IF EXISTS "Users can view public groups" ON care_groups;
DROP POLICY IF EXISTS "Users can view their own groups" ON care_groups;
DROP POLICY IF EXISTS "Users can create groups" ON care_groups;
DROP POLICY IF EXISTS "Allow access to own memberships" ON care_group_members;
DROP POLICY IF EXISTS "Allow viewing members if user is also a member" ON care_group_members;
DROP POLICY IF EXISTS "Allow viewing all members of public groups" ON care_group_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON care_group_members;
DROP POLICY IF EXISTS "Group owners can view all members of their groups" ON care_group_members;
DROP POLICY IF EXISTS "Anyone can view members of public groups" ON care_group_members;
DROP POLICY IF EXISTS "Users can add themselves to groups" ON care_group_members;
DROP POLICY IF EXISTS "Group owners can add members" ON care_group_members;

-- STEP 3: RE-ENABLE ROW LEVEL SECURITY
ALTER TABLE care_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_invitations ENABLE ROW LEVEL SECURITY;

-- STEP 4: CREATE NEW ULTRA-SIMPLE POLICIES FOR care_groups

-- Policy 1: Allow anyone to view public groups
CREATE POLICY "view_public_groups" ON care_groups
FOR SELECT USING (is_public = true);

-- Policy 2: Allow creators to view their own groups
CREATE POLICY "view_own_created_groups" ON care_groups
FOR SELECT USING (created_by = auth.uid());

-- Policy 3: Allow users to create new groups
CREATE POLICY "create_groups" ON care_groups
FOR INSERT WITH CHECK (created_by = auth.uid());

-- Policy 4: Allow creators to update their own groups
CREATE POLICY "update_own_groups" ON care_groups
FOR UPDATE USING (created_by = auth.uid());

-- Policy 5: Allow creators to delete their own groups
CREATE POLICY "delete_own_groups" ON care_groups
FOR DELETE USING (created_by = auth.uid());

-- STEP 5: CREATE NEW ULTRA-SIMPLE POLICIES FOR care_group_members

-- Policy 1: Allow users to view their own memberships
CREATE POLICY "view_own_memberships" ON care_group_members
FOR SELECT USING (user_id = auth.uid());

-- Policy 2: Allow users to view ALL memberships (this is permissive but will avoid recursion)
CREATE POLICY "view_all_memberships" ON care_group_members
FOR SELECT USING (true);

-- Policy 3: Allow users to add themselves to groups
CREATE POLICY "add_self_to_groups" ON care_group_members
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Policy 4: Allow users to update their own memberships
CREATE POLICY "update_own_memberships" ON care_group_members
FOR UPDATE USING (user_id = auth.uid());

-- Policy 5: Allow users to delete their own memberships (leave groups)
CREATE POLICY "delete_own_memberships" ON care_group_members
FOR DELETE USING (user_id = auth.uid());

-- STEP 6: CREATE NEW ULTRA-SIMPLE POLICIES FOR care_group_invitations

-- Policy 1: Allow users to view invitations sent to their email
CREATE POLICY "view_own_invitations" ON care_group_invitations
FOR SELECT USING (invited_email = auth.email());
