-- Complete fix for all Row Level Security (RLS) policies

-- First drop all existing policies on care_group_members to prevent duplicate policy errors
DO $$
BEGIN
    -- Get all policies for this table
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'care_group_members' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON care_group_members';
    END LOOP;
END
$$;

-- Make sure RLS is enabled on required tables
ALTER TABLE care_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_posts ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLICY FOR CARE_GROUPS TABLE
-- ========================================

-- Drop existing policies on care_groups
DO $$
BEGIN
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'care_groups' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON care_groups';
    END LOOP;
END
$$;

-- Policies for care_groups
-- 1. Allow users to view public groups
CREATE POLICY "Users can view public groups" 
ON care_groups FOR SELECT 
TO authenticated 
USING (is_public = true);

-- 2. Allow users to view groups they are members of
CREATE POLICY "Users can view groups they belong to" 
ON care_groups FOR SELECT 
TO authenticated 
USING (
  id IN (
    SELECT group_id FROM care_group_members WHERE user_id = auth.uid()
  )
);

-- 3. Allow users to create groups
CREATE POLICY "Users can create groups" 
ON care_groups FOR INSERT 
TO authenticated 
WITH CHECK (created_by = auth.uid());

-- 4. Allow group owners to update their groups
CREATE POLICY "Owners can update their groups" 
ON care_groups FOR UPDATE 
TO authenticated 
USING (
  created_by = auth.uid() OR
  id IN (
    SELECT group_id FROM care_group_members 
    WHERE user_id = auth.uid() AND role = 'owner'
  )
) 
WITH CHECK (
  created_by = auth.uid() OR
  id IN (
    SELECT group_id FROM care_group_members 
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- 5. Allow group owners to delete their groups
CREATE POLICY "Owners can delete their groups" 
ON care_groups FOR DELETE 
TO authenticated 
USING (
  created_by = auth.uid() OR
  id IN (
    SELECT group_id FROM care_group_members 
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- ========================================
-- POLICIES FOR CARE_GROUP_MEMBERS TABLE
-- ========================================

-- 1. Allow users to view their own memberships
CREATE POLICY "Users can view their own memberships" 
ON care_group_members FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- 2. Allow users to view other members in groups they belong to
-- Simplified to avoid recursion
CREATE POLICY "Users can view group members" 
ON care_group_members FOR SELECT 
TO authenticated 
USING (
  group_id IN (
    SELECT group_id FROM care_group_members 
    WHERE user_id = auth.uid()
  )
);

-- 3. Allow users to add themselves to public groups
CREATE POLICY "Users can join public groups" 
ON care_group_members FOR INSERT 
TO authenticated 
WITH CHECK (
  user_id = auth.uid() AND
  group_id IN (
    SELECT id FROM care_groups WHERE is_public = true
  )
);

-- 4. Allow users to accept invitations
CREATE POLICY "Users can accept invitations" 
ON care_group_members FOR INSERT 
TO authenticated 
WITH CHECK (
  user_id = auth.uid() AND
  group_id IN (
    SELECT group_id FROM care_group_invitations 
    WHERE invited_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) AND status = 'accepted'
  )
);

-- 5. Allow users to remove themselves from groups
CREATE POLICY "Users can leave groups" 
ON care_group_members FOR DELETE 
TO authenticated 
USING (user_id = auth.uid());

-- 6. Allow group owners/admins to add members
CREATE POLICY "Admins can add members" 
ON care_group_members FOR INSERT 
TO authenticated 
WITH CHECK (
  group_id IN (
    SELECT group_id FROM care_group_members 
    WHERE user_id = auth.uid() AND 
    (role = 'owner' OR role = 'admin')
  )
);

-- 7. Allow group owners/admins to remove members
CREATE POLICY "Admins can remove members" 
ON care_group_members FOR DELETE 
TO authenticated 
USING (
  group_id IN (
    SELECT group_id FROM care_group_members 
    WHERE user_id = auth.uid() AND 
    (role = 'owner' OR role = 'admin')
  )
);

-- ========================================
-- POLICIES FOR CARE_GROUP_INVITATIONS
-- ========================================

-- Drop existing policies
DO $$
BEGIN
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'care_group_invitations' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON care_group_invitations';
    END LOOP;
END
$$;

-- 1. Allow users to view invitations sent to them
CREATE POLICY "Users can view their invitations" 
ON care_group_invitations FOR SELECT 
TO authenticated 
USING (
  invited_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- 2. Allow users to view invitations they sent
CREATE POLICY "Users can view invitations they sent" 
ON care_group_invitations FOR SELECT 
TO authenticated 
USING (invited_by = auth.uid());

-- 3. Allow group admins to view invitations for their groups
CREATE POLICY "Admins can view group invitations" 
ON care_group_invitations FOR SELECT 
TO authenticated 
USING (
  group_id IN (
    SELECT group_id FROM care_group_members 
    WHERE user_id = auth.uid() AND 
    (role = 'owner' OR role = 'admin')
  )
);

-- 4. Allow users to create invitations for groups they admin
CREATE POLICY "Admins can create invitations" 
ON care_group_invitations FOR INSERT 
TO authenticated 
WITH CHECK (
  group_id IN (
    SELECT group_id FROM care_group_members 
    WHERE user_id = auth.uid() AND 
    (role = 'owner' OR role = 'admin')
  )
);

-- 5. Allow users to update invitations sent to them
CREATE POLICY "Users can respond to their invitations" 
ON care_group_invitations FOR UPDATE 
TO authenticated 
USING (
  invited_email = (SELECT email FROM auth.users WHERE id = auth.uid())
) 
WITH CHECK (
  invited_email = (SELECT email FROM auth.users WHERE id = auth.uid()) AND
  (OLD.status = 'pending') -- Can only update if status was pending
);

-- ========================================
-- HELPER FUNCTIONS TO BYPASS RLS
-- ========================================

-- Create or replace a function to get a user's group memberships
CREATE OR REPLACE FUNCTION get_user_group_memberships(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  group_id UUID,
  user_id UUID,
  role TEXT,
  joined_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Security check: only allow users to get their own memberships
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT cgm.id, cgm.group_id, cgm.user_id, cgm.role, cgm.joined_at
  FROM care_group_members cgm
  WHERE cgm.user_id = p_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_group_memberships(UUID) TO authenticated;

-- Create or replace a function to get members of a group
CREATE OR REPLACE FUNCTION get_group_members(p_group_id UUID)
RETURNS TABLE (
  id UUID,
  group_id UUID,
  user_id UUID,
  role TEXT,
  joined_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Security check: only allow if the current user is a member of this group
  IF NOT EXISTS (
    SELECT 1 FROM care_group_members 
    WHERE group_id = p_group_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT cgm.id, cgm.group_id, cgm.user_id, cgm.role, cgm.joined_at
  FROM care_group_members cgm
  WHERE cgm.group_id = p_group_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_group_members(UUID) TO authenticated;

-- Create or replace a function to join a group
CREATE OR REPLACE FUNCTION join_group(p_group_id UUID, p_user_id UUID, p_role TEXT DEFAULT 'member')
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_public BOOLEAN;
BEGIN
  -- Security check: only allow users to join as themselves
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Not authorized to join group on behalf of another user';
  END IF;
  
  -- Check if user is already a member
  IF EXISTS (
    SELECT 1 FROM care_group_members 
    WHERE group_id = p_group_id AND user_id = p_user_id
  ) THEN
    RETURN TRUE; -- Already a member, consider it success
  END IF;
  
  -- Check if the group is public (users can only join public groups directly)
  SELECT is_public INTO v_is_public 
  FROM care_groups 
  WHERE id = p_group_id;
  
  IF v_is_public IS NULL THEN
    RAISE EXCEPTION 'Group not found';
  END IF;
  
  IF NOT v_is_public THEN
    RAISE EXCEPTION 'Cannot directly join a private group';
  END IF;
  
  -- Add the user as a member
  INSERT INTO care_group_members (group_id, user_id, role)
  VALUES (p_group_id, p_user_id, p_role);
  
  RETURN TRUE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION join_group(UUID, UUID, TEXT) TO authenticated;

-- Create or replace a function to create a group
CREATE OR REPLACE FUNCTION create_group_simple(
  name_param TEXT,
  description_param TEXT,
  is_public_param BOOLEAN,
  user_id_param UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_group_id UUID;
BEGIN
  -- Security check: only allow users to create as themselves
  IF auth.uid() != user_id_param THEN
    RAISE EXCEPTION 'Not authorized to create group on behalf of another user';
  END IF;
  
  -- Insert the new group
  INSERT INTO care_groups (
    name,
    description,
    is_public,
    created_by
  )
  VALUES (
    name_param,
    description_param,
    is_public_param,
    user_id_param
  )
  RETURNING id INTO new_group_id;
  
  -- Add the user as an owner of the group
  INSERT INTO care_group_members (
    group_id,
    user_id,
    role
  )
  VALUES (
    new_group_id,
    user_id_param,
    'owner'
  );
  
  RETURN new_group_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_group_simple(TEXT, TEXT, BOOLEAN, UUID) TO authenticated; 