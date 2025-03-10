-- Care Connector Database Schema Fixes
-- This script fixes the issues with the care groups tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER TABLE care_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Group creators can do anything" ON care_groups;
DROP POLICY IF EXISTS "Public groups can be viewed by anyone" ON care_groups;
DROP POLICY IF EXISTS "Group members can view their groups" ON care_groups;
DROP POLICY IF EXISTS "Group members can see other members" ON care_group_members;
DROP POLICY IF EXISTS "Group owners and admins can manage members" ON care_group_members;
DROP POLICY IF EXISTS "Users can see their own memberships" ON care_group_members;
DROP POLICY IF EXISTS "Members can view their group's content" ON care_tasks;
DROP POLICY IF EXISTS "Users can join public groups" ON care_group_members;
DROP POLICY IF EXISTS "Users can respond to their invitations" ON care_group_invitations;

-- Create care_groups table if it doesn't exist (or recreate it properly)
CREATE TABLE IF NOT EXISTS care_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE,
  image_url TEXT
);

-- Create care_group_members table if it doesn't exist (or recreate it properly)
CREATE TABLE IF NOT EXISTS care_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id),
  UNIQUE (group_id, user_id)
);

-- Create care_group_invitations table if it doesn't exist (or recreate it properly)
CREATE TABLE IF NOT EXISTS care_group_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care_groups(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  UNIQUE (group_id, invited_email)
);

-- Create policies for care_groups
CREATE POLICY "Group creators can do anything"
ON care_groups
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Public groups can be viewed by anyone"
ON care_groups
FOR SELECT
USING (is_public = true);

-- FIX: Simplify group member access policy to avoid recursion
CREATE POLICY "Group members can view their groups"
ON care_groups
FOR SELECT
USING (
  id IN (
    SELECT group_id 
    FROM care_group_members 
    WHERE user_id = auth.uid()
  )
);

-- Create policies for care_group_members
-- FIX: Simplify policy to avoid recursion by using direct role-based access
CREATE POLICY "Group members can see other members"
ON care_group_members
FOR SELECT
USING (
  group_id IN (
    SELECT group_id 
    FROM care_group_members 
    WHERE user_id = auth.uid()
  )
);

-- FIX: Simplify admin policy to avoid recursion
CREATE POLICY "Group owners and admins can manage members"
ON care_group_members
USING (
  EXISTS (
    SELECT 1
    FROM care_group_members AS admin_member
    WHERE admin_member.group_id = care_group_members.group_id
    AND admin_member.user_id = auth.uid()
    AND admin_member.role IN ('owner', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM care_group_members AS admin_member
    WHERE admin_member.group_id = care_group_members.group_id
    AND admin_member.user_id = auth.uid()
    AND admin_member.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Users can see their own memberships"
ON care_group_members
FOR SELECT
USING (user_id = auth.uid());

-- Create policies for care_tasks
CREATE POLICY "Members can view their group's content"
ON care_tasks
FOR SELECT
USING (
  group_id IN (
    SELECT group_id 
    FROM care_group_members 
    WHERE user_id = auth.uid()
  )
);

-- Recreate the public group join policy with simpler logic
CREATE POLICY "Users can join public groups"
ON care_group_members
FOR INSERT
WITH CHECK (
  (
    -- Check if the group is public
    EXISTS (
      SELECT 1
      FROM care_groups
      WHERE id = care_group_members.group_id
      AND is_public = true
    )
  )
  AND
  (
    -- Make sure the user is inserting their own membership
    user_id = auth.uid()
  )
  AND
  (
    -- New member must have role 'member'
    role = 'member'
  )
);

-- Create policies for care_group_invitations
CREATE POLICY "Users can respond to their invitations"
ON care_group_invitations
USING (invited_email = (
  SELECT email FROM auth.users WHERE id = auth.uid()
))
WITH CHECK (invited_email = (
  SELECT email FROM auth.users WHERE id = auth.uid()
)); 