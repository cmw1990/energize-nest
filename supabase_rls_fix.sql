-- Comprehensive RLS fix for care_groups and care_group_members

-- Fix for care_group_members RLS policies
-- First, drop any existing policies causing recursion issues
DROP POLICY IF EXISTS "Allow access to own memberships" ON care_group_members;
DROP POLICY IF EXISTS "Allow viewing members if user is also a member" ON care_group_members;
DROP POLICY IF EXISTS "Allow viewing all members of public groups" ON care_group_members;

-- Enable RLS on the table if not already enabled
ALTER TABLE care_group_members ENABLE ROW LEVEL SECURITY;

-- Simple direct policy to view own memberships
CREATE POLICY "Users can view their own memberships"
ON care_group_members FOR SELECT
USING (user_id = auth.uid());

-- Allow users to insert themselves into groups
CREATE POLICY "Users can add themselves to groups"
ON care_group_members FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Fix for care_groups RLS policies
-- First, drop any existing policies
DROP POLICY IF EXISTS "Users can view public groups" ON care_groups;
DROP POLICY IF EXISTS "Users can view their own groups" ON care_groups;
DROP POLICY IF EXISTS "Users can create groups" ON care_groups;

-- Enable RLS on the table if not already enabled
ALTER TABLE care_groups ENABLE ROW LEVEL SECURITY;

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
