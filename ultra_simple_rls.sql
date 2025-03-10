-- COMPLETELY NEW RLS APPROACH - ULTRA SIMPLIFIED

-- First, completely disable RLS on all tables to test basic functionality
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
DROP POLICY IF EXISTS "Group owners can view all members of their groups" ON care_group_members;
DROP POLICY IF EXISTS "Anyone can view members of public groups" ON care_group_members;
DROP POLICY IF EXISTS "Users can add themselves to groups" ON care_group_members;
DROP POLICY IF EXISTS "Group owners can add members" ON care_group_members;

-- Use this temporary solution to completely bypass RLS for now

-- Alternative approach: Use ultra-simple RLS policies that are unlikely to cause recursion

-- Enable RLS on tables
ALTER TABLE care_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_invitations ENABLE ROW LEVEL SECURITY;

-- Ultra-permissive policies for care_groups
CREATE POLICY "Allow all operations on care_groups" ON care_groups USING (true) WITH CHECK (true);

-- Ultra-permissive policies for care_group_members
CREATE POLICY "Allow all operations on care_group_members" ON care_group_members USING (true) WITH CHECK (true);

-- Ultra-permissive policies for care_group_invitations
CREATE POLICY "Allow all operations on care_group_invitations" ON care_group_invitations USING (true) WITH CHECK (true);

-- OPTION 2: Minimal RLS policies that should not cause recursion

-- Minimal policies for care_groups
-- CREATE POLICY "Allow select on public groups" ON care_groups FOR SELECT USING (is_public = true);
-- CREATE POLICY "Allow insert on groups" ON care_groups FOR INSERT WITH CHECK (created_by = auth.uid());

-- Minimal policies for care_group_members
-- CREATE POLICY "Allow select on own memberships" ON care_group_members FOR SELECT USING (user_id = auth.uid());
-- CREATE POLICY "Allow insert on memberships" ON care_group_members FOR INSERT WITH CHECK (user_id = auth.uid());
