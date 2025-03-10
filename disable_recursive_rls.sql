-- =====================================================
-- EMERGENCY RLS FIX FOR CARE CONNECTOR
-- WARNING: This completely disables RLS for development
-- DO NOT USE IN PRODUCTION
-- =====================================================

-- =====================================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- =====================================================
-- care_groups policies
DROP POLICY IF EXISTS "Users can view public groups" ON care_groups;
DROP POLICY IF EXISTS "Users can view their own groups" ON care_groups;
DROP POLICY IF EXISTS "Users can create groups" ON care_groups;
DROP POLICY IF EXISTS "view_public_groups" ON care_groups;
DROP POLICY IF EXISTS "view_own_groups" ON care_groups;
DROP POLICY IF EXISTS "create_groups" ON care_groups;
DROP POLICY IF EXISTS "update_own_groups" ON care_groups;
DROP POLICY IF EXISTS "delete_own_groups" ON care_groups;
DROP POLICY IF EXISTS "Allow all operations on care_groups" ON care_groups;
DROP POLICY IF EXISTS "groups_public_read" ON care_groups;
DROP POLICY IF EXISTS "groups_member_read" ON care_groups;
DROP POLICY IF EXISTS "groups_insert" ON care_groups;
DROP POLICY IF EXISTS "groups_update" ON care_groups;
DROP POLICY IF EXISTS "groups_delete" ON care_groups;

-- care_group_members policies
DROP POLICY IF EXISTS "Allow access to own memberships" ON care_group_members;
DROP POLICY IF EXISTS "Allow viewing members if user is also a member" ON care_group_members;
DROP POLICY IF EXISTS "Allow viewing all members of public groups" ON care_group_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON care_group_members;
DROP POLICY IF EXISTS "Group owners can view all members of their groups" ON care_group_members;
DROP POLICY IF EXISTS "Anyone can view members of public groups" ON care_group_members;
DROP POLICY IF EXISTS "Users can add themselves to groups" ON care_group_members;
DROP POLICY IF EXISTS "Group owners can add members" ON care_group_members;
DROP POLICY IF EXISTS "view_own_memberships" ON care_group_members;
DROP POLICY IF EXISTS "view_group_members" ON care_group_members;
DROP POLICY IF EXISTS "view_public_group_members" ON care_group_members;
DROP POLICY IF EXISTS "add_self_to_groups" ON care_group_members;
DROP POLICY IF EXISTS "owners_add_members" ON care_group_members;
DROP POLICY IF EXISTS "remove_self_from_groups" ON care_group_members;
DROP POLICY IF EXISTS "owners_remove_members" ON care_group_members;
DROP POLICY IF EXISTS "Allow all operations on care_group_members" ON care_group_members;
DROP POLICY IF EXISTS "members_self_read" ON care_group_members;
DROP POLICY IF EXISTS "members_same_group_read" ON care_group_members;
DROP POLICY IF EXISTS "members_insert" ON care_group_members;
DROP POLICY IF EXISTS "members_update" ON care_group_members;
DROP POLICY IF EXISTS "members_delete" ON care_group_members;

-- care_group_invitations policies
DROP POLICY IF EXISTS "view_own_invitations" ON care_group_invitations;
DROP POLICY IF EXISTS "view_sent_invitations" ON care_group_invitations;
DROP POLICY IF EXISTS "create_invitations" ON care_group_invitations;
DROP POLICY IF EXISTS "delete_own_invitations" ON care_group_invitations;
DROP POLICY IF EXISTS "owners_delete_invitations" ON care_group_invitations;
DROP POLICY IF EXISTS "Allow all operations on care_group_invitations" ON care_group_invitations;
DROP POLICY IF EXISTS "invitations_recipient_read" ON care_group_invitations;
DROP POLICY IF EXISTS "invitations_insert" ON care_group_invitations;
DROP POLICY IF EXISTS "invitations_update" ON care_group_invitations;
DROP POLICY IF EXISTS "invitations_delete" ON care_group_invitations;

-- =====================================================
-- STEP 2: COMPLETELY DISABLE RLS ON ALL TABLES
-- =====================================================
ALTER TABLE care_groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_invitations DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 3: ENSURE PROPER ACCESS RIGHTS
-- =====================================================
GRANT ALL ON care_groups TO authenticated;
GRANT ALL ON care_group_members TO authenticated;
GRANT ALL ON care_group_invitations TO authenticated;
