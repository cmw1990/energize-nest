-- Care Connector Comprehensive Optimization Migration (20250430)
-- This migration optimizes all care-connector related tables and functions to improve performance,
-- security, and prevent potential loading issues.

-- ===== PART 1: DATABASE INDEXES =====
-- Create indexes on all frequently queried columns for better performance

-- Care Groups table
CREATE INDEX IF NOT EXISTS idx_care_groups_created_by ON care_groups(created_by);
CREATE INDEX IF NOT EXISTS idx_care_groups_is_public ON care_groups(is_public);

-- Care Group Members table
CREATE INDEX IF NOT EXISTS idx_care_group_members_group_id ON care_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_care_group_members_user_id ON care_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_care_group_members_role ON care_group_members(role);
CREATE INDEX IF NOT EXISTS idx_care_group_members_composite ON care_group_members(group_id, user_id);

-- Care Tasks table
CREATE INDEX IF NOT EXISTS idx_care_tasks_group_id ON care_tasks(group_id);
CREATE INDEX IF NOT EXISTS idx_care_tasks_created_by ON care_tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_care_tasks_assigned_to ON care_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_care_tasks_status ON care_tasks(status);
CREATE INDEX IF NOT EXISTS idx_care_tasks_due_date ON care_tasks(due_date);

-- Care Group Events table
CREATE INDEX IF NOT EXISTS idx_care_group_events_group_id ON care_group_events(group_id);
CREATE INDEX IF NOT EXISTS idx_care_group_events_created_by ON care_group_events(created_by);
CREATE INDEX IF NOT EXISTS idx_care_group_events_start_time ON care_group_events(start_time);

-- Care Group Posts table
CREATE INDEX IF NOT EXISTS idx_care_group_posts_group_id ON care_group_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_care_group_posts_created_by ON care_group_posts(created_by);
CREATE INDEX IF NOT EXISTS idx_care_group_posts_created_at ON care_group_posts(created_at);

-- Check if care_group_comments table exists, create it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'care_group_comments') THEN
        CREATE TABLE public.care_group_comments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            post_id UUID NOT NULL REFERENCES care_group_posts(id) ON DELETE CASCADE,
            created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ
        );
        
        -- Enable RLS
        ALTER TABLE public.care_group_comments ENABLE ROW LEVEL SECURITY;
        
        -- Add policies
        CREATE POLICY "Users can view comments if they can view the post"
            ON public.care_group_comments
            FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM care_group_posts p
                    JOIN care_group_members m ON p.group_id = m.group_id
                    WHERE p.id = care_group_comments.post_id
                    AND m.user_id = auth.uid()
                    LIMIT 1
                )
            );
            
        CREATE POLICY "Users can insert their own comments"
            ON public.care_group_comments
            FOR INSERT
            WITH CHECK (
                created_by = auth.uid() AND
                EXISTS (
                    SELECT 1 FROM care_group_posts p
                    JOIN care_group_members m ON p.group_id = m.group_id
                    WHERE p.id = care_group_comments.post_id
                    AND m.user_id = auth.uid()
                    LIMIT 1
                )
            );
            
        CREATE POLICY "Users can update their own comments"
            ON public.care_group_comments
            FOR UPDATE
            USING (created_by = auth.uid())
            WITH CHECK (created_by = auth.uid());
            
        CREATE POLICY "Users can delete their own comments"
            ON public.care_group_comments
            FOR DELETE
            USING (created_by = auth.uid());
        
        -- Grant permissions
        GRANT ALL ON public.care_group_comments TO authenticated;
    END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_care_group_comments_post_id ON care_group_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_care_group_comments_created_by ON care_group_comments(created_by);

-- ===== PART 2: PERMISSIONS AND ROW LEVEL SECURITY =====
-- Enable RLS on all tables
ALTER TABLE care_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_posts ENABLE ROW LEVEL SECURITY;

-- ===== PART 3: RLS POLICIES =====
-- First, drop any existing policies to create clean ones
DROP POLICY IF EXISTS "Users can view public groups" ON care_groups;
DROP POLICY IF EXISTS "Users can view groups they are members of" ON care_groups;
DROP POLICY IF EXISTS "Users can create groups" ON care_groups;
DROP POLICY IF EXISTS "Users can update their own groups" ON care_groups;
DROP POLICY IF EXISTS "Owners can delete their groups" ON care_groups;

DROP POLICY IF EXISTS "Users can view their own membership" ON care_group_members;
DROP POLICY IF EXISTS "Users can view members of groups they belong to" ON care_group_members;
DROP POLICY IF EXISTS "Group owners can insert members" ON care_group_members;
DROP POLICY IF EXISTS "Group owners can update members" ON care_group_members;
DROP POLICY IF EXISTS "Users can leave groups" ON care_group_members;
DROP POLICY IF EXISTS "Group owners can remove members" ON care_group_members;

DROP POLICY IF EXISTS "Group members can view tasks" ON care_tasks;
DROP POLICY IF EXISTS "Group members can create tasks" ON care_tasks;
DROP POLICY IF EXISTS "Created by or assigned to can update tasks" ON care_tasks;
DROP POLICY IF EXISTS "Created by can delete tasks" ON care_tasks;

DROP POLICY IF EXISTS "Group members can view events" ON care_group_events;
DROP POLICY IF EXISTS "Group members can create events" ON care_group_events;
DROP POLICY IF EXISTS "Created by can update events" ON care_group_events;
DROP POLICY IF EXISTS "Created by can delete events" ON care_group_events;

DROP POLICY IF EXISTS "Group members can view posts" ON care_group_posts;
DROP POLICY IF EXISTS "Group members can create posts" ON care_group_posts;
DROP POLICY IF EXISTS "Created by can update posts" ON care_group_posts;
DROP POLICY IF EXISTS "Created by can delete posts" ON care_group_posts;

-- Only drop comments policies if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'care_group_comments') THEN
    DROP POLICY IF EXISTS "Group members can view comments" ON care_group_comments;
    DROP POLICY IF EXISTS "Group members can create comments" ON care_group_comments;
    DROP POLICY IF EXISTS "Created by can update comments" ON care_group_comments;
    DROP POLICY IF EXISTS "Created by can delete comments" ON care_group_comments;
    -- Drop new policy names too
    DROP POLICY IF EXISTS "Users can view comments if they can view the post" ON care_group_comments;
    DROP POLICY IF EXISTS "Users can insert their own comments" ON care_group_comments;
    DROP POLICY IF EXISTS "Users can update their own comments" ON care_group_comments;
    DROP POLICY IF EXISTS "Users can delete their own comments" ON care_group_comments;
  END IF;
END
$$;

-- Create policies for care_groups
CREATE POLICY "View public groups" ON care_groups
    FOR SELECT
    USING (is_public = true);

CREATE POLICY "Creators can manage their groups" ON care_groups
    FOR ALL
    USING (created_by = auth.uid());

CREATE POLICY "Members can view their groups" ON care_groups
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM care_group_members
            WHERE care_group_members.group_id = care_groups.id
            AND care_group_members.user_id = auth.uid()
            LIMIT 1
        )
    );

-- Create policies for care_group_members
CREATE POLICY "Group owners can manage members" ON care_group_members
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM care_group_members m
            WHERE m.group_id = care_group_members.group_id
            AND m.user_id = auth.uid()
            AND m.role = 'owner'
            LIMIT 1
        )
    );

CREATE POLICY "Users can view their own memberships" ON care_group_members
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Join public groups" ON care_group_members
    FOR INSERT 
    WITH CHECK (
        user_id = auth.uid() AND
        group_id IN (
            SELECT id FROM care_groups
            WHERE is_public = true
        )
    );

-- Create policies for care_tasks
CREATE POLICY "View tasks if member of group" ON care_tasks
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM care_group_members 
            WHERE care_group_members.group_id = care_tasks.group_id
            AND care_group_members.user_id = auth.uid()
            LIMIT 1
        )
    );

CREATE POLICY "View tasks if assigned to me" ON care_tasks
    FOR SELECT
    USING (assigned_to = auth.uid());

CREATE POLICY "Manage tasks if created by me" ON care_tasks
    FOR ALL
    USING (created_by = auth.uid());

-- Create policies for care_group_events
CREATE POLICY "Group members can view events" ON care_group_events
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM care_group_members
            WHERE care_group_members.group_id = care_group_events.group_id
            AND care_group_members.user_id = auth.uid()
            LIMIT 1
        )
    );

-- Create policies for care_group_posts
CREATE POLICY "Group members can view posts" ON care_group_posts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM care_group_members
            WHERE care_group_members.group_id = care_group_posts.group_id
            AND care_group_members.user_id = auth.uid()
            LIMIT 1
        )
    );

-- Create policies for care_group_comments
-- Only create policies if the table exists and doesn't have policies already
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'care_group_comments') 
     AND NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'care_group_comments' AND policyname = 'Group members can view comments') THEN
    
    CREATE POLICY "Group members can view comments" ON care_group_comments
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM care_group_members m
          JOIN care_group_posts ON care_group_posts.group_id = m.group_id
          WHERE care_group_posts.id = care_group_comments.post_id
          AND m.user_id = auth.uid()
          LIMIT 1
        )
      );
    
    CREATE POLICY "Group members can create comments" ON care_group_comments
      FOR INSERT
      WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (
          SELECT 1 FROM care_group_members m
          JOIN care_group_posts ON care_group_posts.group_id = m.group_id
          WHERE care_group_posts.id = care_group_comments.post_id
          AND m.user_id = auth.uid()
          LIMIT 1
        )
      );
    
    CREATE POLICY "Created by can update comments" ON care_group_comments
      FOR UPDATE
      USING (created_by = auth.uid())
      WITH CHECK (created_by = auth.uid());
    
    CREATE POLICY "Created by can delete comments" ON care_group_comments
      FOR DELETE
      USING (created_by = auth.uid());
  END IF;
END
$$;

-- ===== PART 4: OPTIMIZED RPC FUNCTIONS =====
-- Function to get group details
CREATE OR REPLACE FUNCTION get_group_details(group_id_param UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  is_public BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  created_by UUID,
  image_url TEXT,
  member_count BIGINT,
  user_role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_member BOOLEAN;
  is_public_group BOOLEAN;
BEGIN
  -- Check if user is a member or if group is public
  SELECT EXISTS (
    SELECT 1 FROM care_group_members m
    WHERE m.group_id = group_id_param AND m.user_id = auth.uid()
    LIMIT 1
  ) INTO is_member;
  
  SELECT is_public INTO is_public_group FROM care_groups WHERE id = group_id_param;
  
  IF NOT (is_member OR is_public_group) THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    g.id,
    g.name,
    g.description,
    g.is_public,
    g.created_at,
    g.updated_at,
    g.created_by,
    g.image_url,
    (SELECT COUNT(*) FROM care_group_members m WHERE m.group_id = g.id) AS member_count,
    (SELECT m.role FROM care_group_members m WHERE m.group_id = g.id AND m.user_id = auth.uid()) AS user_role
  FROM care_groups g
  WHERE g.id = group_id_param;
END;
$$;

-- Function to get group tasks with optimized performance
CREATE OR REPLACE FUNCTION get_group_tasks(group_id_param UUID)
RETURNS TABLE (
  id UUID,
  group_id UUID,
  title TEXT,
  description TEXT,
  status TEXT,
  priority TEXT,
  due_date TIMESTAMPTZ,
  assigned_to UUID,
  created_by UUID,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Simple security check without joins
  IF NOT EXISTS (
    SELECT 1 FROM care_group_members m 
    WHERE m.group_id = group_id_param 
    AND m.user_id = auth.uid()
    LIMIT 1
  ) THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    t.id,
    t.group_id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.due_date,
    t.assigned_to,
    t.created_by,
    t.created_at
  FROM care_tasks t
  WHERE t.group_id = group_id_param;
END;
$$;

-- Function to get group members with optimized performance
CREATE OR REPLACE FUNCTION get_group_members(group_id_param UUID)
RETURNS TABLE (
  id UUID,
  group_id UUID,
  user_id UUID,
  role TEXT,
  joined_at TIMESTAMPTZ,
  display_name TEXT,
  avatar_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_member BOOLEAN;
  is_public BOOLEAN;
BEGIN
  -- Efficient check for membership and public status (avoids repeated checks)
  SELECT EXISTS (
    SELECT 1 FROM care_group_members m 
    WHERE m.group_id = group_id_param AND m.user_id = auth.uid()
    LIMIT 1
  ) INTO is_member;
  
  IF NOT is_member THEN
    SELECT is_public INTO is_public FROM care_groups WHERE id = group_id_param;
    IF NOT is_public THEN
      RETURN;
    END IF;
  END IF;
  
  RETURN QUERY
  SELECT 
    m.id,
    m.group_id,
    m.user_id,
    m.role,
    m.joined_at,
    p.display_name,
    p.avatar_url
  FROM care_group_members m
  LEFT JOIN profiles p ON m.user_id = p.id
  WHERE m.group_id = group_id_param;
END;
$$;

-- Function to get group events with optimized performance
CREATE OR REPLACE FUNCTION get_group_events(group_id_param UUID)
RETURNS TABLE (
  id UUID,
  group_id UUID,
  title TEXT,
  description TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  location TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Simple security check (only members can view events)
  IF NOT EXISTS (
    SELECT 1 FROM care_group_members m 
    WHERE m.group_id = group_id_param 
    AND m.user_id = auth.uid()
    LIMIT 1
  ) THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    e.id,
    e.group_id,
    e.title,
    e.description,
    e.start_time,
    e.end_time,
    e.location,
    e.created_by,
    e.created_at
  FROM care_group_events e
  WHERE e.group_id = group_id_param
  ORDER BY e.start_time;
END;
$$;

-- Function to get group posts
CREATE OR REPLACE FUNCTION get_group_posts(group_id_param UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    content TEXT,
    created_at TIMESTAMPTZ,
    created_by UUID,
    author_name TEXT,
    author_avatar TEXT,
    comment_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    comments_exist BOOLEAN;
BEGIN
    -- Check if user is a group member
    IF NOT EXISTS (
        SELECT 1 FROM care_group_members 
        WHERE group_id = group_id_param AND user_id = auth.uid()
        LIMIT 1
    ) THEN
        RETURN;
    END IF;
    
    -- Check if care_group_comments table exists
    SELECT EXISTS (
        SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'care_group_comments'
    ) INTO comments_exist;
    
    -- Return posts with or without comment counts based on table existence
    IF comments_exist THEN
        RETURN QUERY
        SELECT 
            p.id,
            p.title,
            p.content,
            p.created_at,
            p.created_by,
            u.display_name AS author_name,
            u.avatar_url AS author_avatar,
            (SELECT COUNT(*) FROM care_group_comments c WHERE c.post_id = p.id) AS comment_count
        FROM care_group_posts p
        LEFT JOIN auth.users u ON p.created_by = u.id
        WHERE p.group_id = group_id_param
        ORDER BY p.created_at DESC;
    ELSE
        RETURN QUERY
        SELECT 
            p.id,
            p.title,
            p.content,
            p.created_at,
            p.created_by,
            u.display_name AS author_name,
            u.avatar_url AS author_avatar,
            0::BIGINT AS comment_count
        FROM care_group_posts p
        LEFT JOIN auth.users u ON p.created_by = u.id
        WHERE p.group_id = group_id_param
        ORDER BY p.created_at DESC;
    END IF;
END;
$$;

-- Function to get post with comments
CREATE OR REPLACE FUNCTION get_post_with_comments(post_id_param UUID)
RETURNS TABLE (
    post_id UUID,
    post_title TEXT,
    post_content TEXT,
    post_created_at TIMESTAMPTZ,
    post_created_by UUID,
    creator_name TEXT,
    creator_avatar_url TEXT,
    comment_id UUID,
    comment_content TEXT,
    comment_created_at TIMESTAMPTZ,
    comment_created_by UUID,
    commenter_name TEXT,
    commenter_avatar_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    group_id_var UUID;
    table_exists BOOLEAN;
BEGIN
    -- Check if user is authorized to view the post
    SELECT p.group_id INTO group_id_var
    FROM care_group_posts p
    WHERE p.id = post_id_param;
    
    IF group_id_var IS NULL THEN
        RETURN; -- Post doesn't exist
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM care_group_members
        WHERE group_id = group_id_var
        AND user_id = auth.uid()
        LIMIT 1
    ) THEN
        RETURN; -- User is not a member of the group
    END IF;
    
    -- Check if care_group_comments table exists
    SELECT EXISTS (
        SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'care_group_comments'
    ) INTO table_exists;
    
    -- If the comments table doesn't exist, just return post data without comments
    IF NOT table_exists THEN
        RETURN QUERY
        SELECT 
            p.id AS post_id,
            p.title AS post_title,
            p.content AS post_content,
            p.created_at AS post_created_at,
            p.created_by AS post_created_by,
            u.display_name AS creator_name,
            u.avatar_url AS creator_avatar_url,
            NULL::UUID AS comment_id,
            NULL::TEXT AS comment_content,
            NULL::TIMESTAMPTZ AS comment_created_at,
            NULL::UUID AS comment_created_by,
            NULL::TEXT AS commenter_name,
            NULL::TEXT AS commenter_avatar_url
        FROM care_group_posts p
        LEFT JOIN auth.users u ON p.created_by = u.id
        WHERE p.id = post_id_param;
        RETURN;
    END IF;
    
    -- Return post with comments if the comments table exists
    RETURN QUERY
    SELECT 
        p.id AS post_id,
        p.title AS post_title,
        p.content AS post_content,
        p.created_at AS post_created_at,
        p.created_by AS post_created_by,
        creator.display_name AS creator_name,
        creator.avatar_url AS creator_avatar_url,
        c.id AS comment_id,
        c.content AS comment_content,
        c.created_at AS comment_created_at,
        c.created_by AS comment_created_by,
        commenter.display_name AS commenter_name,
        commenter.avatar_url AS commenter_avatar_url
    FROM care_group_posts p
    LEFT JOIN care_group_comments c ON c.post_id = p.id
    LEFT JOIN auth.users creator ON p.created_by = creator.id
    LEFT JOIN auth.users commenter ON c.created_by = commenter.id
    WHERE p.id = post_id_param
    ORDER BY c.created_at ASC;
END;
$$;

-- Function to get user's groups with optimized performance
CREATE OR REPLACE FUNCTION get_user_groups(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  is_public BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  created_by UUID,
  image_url TEXT,
  role TEXT,
  member_count BIGINT,
  recent_activity TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Security check - can only view own groups
  IF auth.uid() <> user_id_param THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    g.id,
    g.name,
    g.description,
    g.is_public,
    g.created_at,
    g.updated_at,
    g.created_by,
    g.image_url,
    m.role,
    (SELECT COUNT(*) FROM care_group_members m2 WHERE m2.group_id = g.id) AS member_count,
    (
      SELECT MAX(t) FROM (
        SELECT MAX(created_at) as t FROM care_group_posts WHERE group_id = g.id
        UNION
        SELECT MAX(created_at) as t FROM care_group_events WHERE group_id = g.id
        UNION
        SELECT MAX(created_at) as t FROM care_tasks WHERE group_id = g.id
      ) as activity
    ) AS recent_activity
  FROM care_groups g
  JOIN care_group_members m ON g.id = m.group_id
  WHERE m.user_id = user_id_param
  ORDER BY recent_activity DESC NULLS LAST;
END;
$$;

-- Function to create a group and add owner in one transaction
CREATE OR REPLACE FUNCTION create_group_with_owner(
  name_param TEXT,
  description_param TEXT,
  is_public_param BOOLEAN,
  user_id_param UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_group_id UUID;
BEGIN
  -- Validate input
  IF name_param IS NULL OR name_param = '' THEN
    RAISE EXCEPTION 'Group name cannot be empty';
  END IF;
  
  IF user_id_param IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;
  
  -- Create the group
  INSERT INTO care_groups (
    name, 
    description, 
    is_public, 
    created_by
  ) VALUES (
    name_param, 
    description_param, 
    is_public_param, 
    user_id_param
  ) RETURNING id INTO new_group_id;
  
  -- Add the creator as an owner member in the same transaction
  INSERT INTO care_group_members (
    group_id, 
    user_id, 
    role
  ) VALUES (
    new_group_id, 
    user_id_param, 
    'owner'
  );
  
  RETURN new_group_id;
END;
$$;

-- Function to remove user from a group
CREATE OR REPLACE FUNCTION leave_group(
  group_id_param UUID,
  user_id_param UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  member_count INTEGER;
  is_owner BOOLEAN;
BEGIN
  -- Validate that the user is operating on themselves or is a group owner
  IF auth.uid() <> user_id_param THEN
    -- Check if requestor is owner
    SELECT EXISTS (
      SELECT 1 FROM care_group_members
      WHERE group_id = group_id_param
      AND user_id = auth.uid()
      AND role = 'owner'
    ) INTO is_owner;
    
    IF NOT is_owner THEN
      RETURN false;
    END IF;
  END IF;
  
  -- Check how many members are in the group
  SELECT COUNT(*) INTO member_count FROM care_group_members
  WHERE group_id = group_id_param;
  
  -- Check if this user is an owner
  SELECT EXISTS (
    SELECT 1 FROM care_group_members
    WHERE group_id = group_id_param
    AND user_id = user_id_param
    AND role = 'owner'
  ) INTO is_owner;
  
  -- If this is the last member or the last owner, delete the group
  IF (member_count = 1) OR (is_owner AND NOT EXISTS (
    SELECT 1 FROM care_group_members
    WHERE group_id = group_id_param
    AND user_id <> user_id_param
    AND role = 'owner'
  )) THEN
    -- Delete all group data
    DELETE FROM care_group_comments 
    WHERE post_id IN (SELECT id FROM care_group_posts WHERE group_id = group_id_param);
    
    DELETE FROM care_post_likes
    WHERE post_id IN (SELECT id FROM care_group_posts WHERE group_id = group_id_param);
    
    DELETE FROM care_group_posts WHERE group_id = group_id_param;
    DELETE FROM care_group_events WHERE group_id = group_id_param;
    DELETE FROM care_tasks WHERE group_id = group_id_param;
    DELETE FROM care_group_members WHERE group_id = group_id_param;
    DELETE FROM care_groups WHERE id = group_id_param;
  ELSE
    -- Just remove the member
    DELETE FROM care_group_members
    WHERE group_id = group_id_param AND user_id = user_id_param;
  END IF;
  
  RETURN true;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_group_details(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_group_tasks(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_group_members(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_group_events(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_group_posts(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_post_with_comments(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_groups(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_group_with_owner(TEXT, TEXT, BOOLEAN, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION leave_group(UUID, UUID) TO authenticated; 