-- EMERGENCY FIX: COMPLETELY DISABLE RLS TO UNBLOCK DEVELOPMENT
-- WARNING: This should only be used in development environments

-- Disable RLS on all tables
ALTER TABLE care_groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_invitations DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view public groups" ON care_groups;
DROP POLICY IF EXISTS "Users can view their own groups" ON care_groups;
DROP POLICY IF EXISTS "Users can create groups" ON care_groups;

DROP POLICY IF EXISTS "Allow access to own memberships" ON care_group_members;
DROP POLICY IF EXISTS "Allow viewing members if user is also a member" ON care_group_members;
DROP POLICY IF EXISTS "Allow viewing all members of public groups" ON care_group_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON care_group_members;
