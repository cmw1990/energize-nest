-- Care Connector Database Repair Script
-- This script creates missing tables, adds necessary indexes,
-- and ensures all RPC functions work properly.

BEGIN;

-- ======== TABLE EXISTENCE CHECKS & CREATION ========

-- Check for care_groups
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'care_groups') THEN
        CREATE TABLE public.care_groups (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            description TEXT,
            created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ,
            is_public BOOLEAN DEFAULT false
        );
        
        -- Enable RLS
        ALTER TABLE public.care_groups ENABLE ROW LEVEL SECURITY;
        
        -- Grant permissions
        GRANT ALL ON public.care_groups TO authenticated;
    END IF;
END
$$;

-- Check for care_group_members
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'care_group_members') THEN
        CREATE TABLE public.care_group_members (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            group_id UUID NOT NULL REFERENCES care_groups(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            role TEXT NOT NULL DEFAULT 'member',
            joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            UNIQUE(group_id, user_id)
        );
        
        -- Enable RLS
        ALTER TABLE public.care_group_members ENABLE ROW LEVEL SECURITY;
        
        -- Grant permissions
        GRANT ALL ON public.care_group_members TO authenticated;
    END IF;
END
$$;

-- Check for care_tasks
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'care_tasks') THEN
        CREATE TABLE public.care_tasks (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            group_id UUID NOT NULL REFERENCES care_groups(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'open',
            priority TEXT NOT NULL DEFAULT 'medium',
            due_date TIMESTAMPTZ,
            created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ
        );
        
        -- Enable RLS
        ALTER TABLE public.care_tasks ENABLE ROW LEVEL SECURITY;
        
        -- Grant permissions
        GRANT ALL ON public.care_tasks TO authenticated;
    END IF;
END
$$;

-- Check for care_group_events
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'care_group_events') THEN
        CREATE TABLE public.care_group_events (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            group_id UUID NOT NULL REFERENCES care_groups(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            location TEXT,
            start_time TIMESTAMPTZ NOT NULL,
            end_time TIMESTAMPTZ,
            created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ
        );
        
        -- Enable RLS
        ALTER TABLE public.care_group_events ENABLE ROW LEVEL SECURITY;
        
        -- Grant permissions
        GRANT ALL ON public.care_group_events TO authenticated;
    END IF;
END
$$;

-- Check for care_group_posts
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'care_group_posts') THEN
        CREATE TABLE public.care_group_posts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            group_id UUID NOT NULL REFERENCES care_groups(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ
        );
        
        -- Enable RLS
        ALTER TABLE public.care_group_posts ENABLE ROW LEVEL SECURITY;
        
        -- Grant permissions
        GRANT ALL ON public.care_group_posts TO authenticated;
    END IF;
END
$$;

-- Check for care_group_comments
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
        
        -- Grant permissions
        GRANT ALL ON public.care_group_comments TO authenticated;
    END IF;
END
$$;

-- ======== INDEXES ========

-- Indexes for care_groups
CREATE INDEX IF NOT EXISTS idx_care_groups_created_by ON care_groups(created_by);
CREATE INDEX IF NOT EXISTS idx_care_groups_is_public ON care_groups(is_public);

-- Indexes for care_group_members
CREATE INDEX IF NOT EXISTS idx_care_group_members_group_id ON care_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_care_group_members_user_id ON care_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_care_group_members_role ON care_group_members(role);
CREATE INDEX IF NOT EXISTS idx_care_group_members_composite ON care_group_members(group_id, user_id);

-- Indexes for care_tasks
CREATE INDEX IF NOT EXISTS idx_care_tasks_group_id ON care_tasks(group_id);
CREATE INDEX IF NOT EXISTS idx_care_tasks_created_by ON care_tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_care_tasks_assigned_to ON care_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_care_tasks_status ON care_tasks(status);
CREATE INDEX IF NOT EXISTS idx_care_tasks_due_date ON care_tasks(due_date);

-- Indexes for care_group_events
CREATE INDEX IF NOT EXISTS idx_care_group_events_group_id ON care_group_events(group_id);
CREATE INDEX IF NOT EXISTS idx_care_group_events_created_by ON care_group_events(created_by);
CREATE INDEX IF NOT EXISTS idx_care_group_events_start_time ON care_group_events(start_time);

-- Indexes for care_group_posts
CREATE INDEX IF NOT EXISTS idx_care_group_posts_group_id ON care_group_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_care_group_posts_created_by ON care_group_posts(created_by);
CREATE INDEX IF NOT EXISTS idx_care_group_posts_created_at ON care_group_posts(created_at);

-- Indexes for care_group_comments
CREATE INDEX IF NOT EXISTS idx_care_group_comments_post_id ON care_group_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_care_group_comments_created_by ON care_group_comments(created_by);

-- ======== ROW LEVEL SECURITY POLICIES ========

-- First, check and set RLS on all tables
ALTER TABLE care_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Users can view public groups" ON care_groups;
DROP POLICY IF EXISTS "Users can view groups they are members of" ON care_groups;
DROP POLICY IF EXISTS "Users can create groups" ON care_groups;
DROP POLICY IF EXISTS "Users can update their own groups" ON care_groups;
DROP POLICY IF EXISTS "Owners can delete their groups" ON care_groups;
DROP POLICY IF EXISTS "View public groups" ON care_groups;
DROP POLICY IF EXISTS "Creators can manage their groups" ON care_groups;
DROP POLICY IF EXISTS "Members can view their groups" ON care_groups;

DROP POLICY IF EXISTS "Users can view their own membership" ON care_group_members;
DROP POLICY IF EXISTS "Users can view members of groups they belong to" ON care_group_members;
DROP POLICY IF EXISTS "Group owners can insert members" ON care_group_members;
DROP POLICY IF EXISTS "Group owners can update members" ON care_group_members;
DROP POLICY IF EXISTS "Users can leave groups" ON care_group_members;
DROP POLICY IF EXISTS "Group owners can remove members" ON care_group_members;
DROP POLICY IF EXISTS "Group owners can manage members" ON care_group_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON care_group_members;
DROP POLICY IF EXISTS "Join public groups" ON care_group_members;

DROP POLICY IF EXISTS "Group members can view tasks" ON care_tasks;
DROP POLICY IF EXISTS "Group members can create tasks" ON care_tasks;
DROP POLICY IF EXISTS "Created by or assigned to can update tasks" ON care_tasks;
DROP POLICY IF EXISTS "Created by can delete tasks" ON care_tasks;
DROP POLICY IF EXISTS "View tasks if member of group" ON care_tasks;
DROP POLICY IF EXISTS "View tasks if assigned to me" ON care_tasks;
DROP POLICY IF EXISTS "Manage tasks if created by me" ON care_tasks;

DROP POLICY IF EXISTS "Group members can view events" ON care_group_events;
DROP POLICY IF EXISTS "Group members can create events" ON care_group_events;
DROP POLICY IF EXISTS "Created by can update events" ON care_group_events;
DROP POLICY IF EXISTS "Created by can delete events" ON care_group_events;

DROP POLICY IF EXISTS "Group members can view posts" ON care_group_posts;
DROP POLICY IF EXISTS "Group members can create posts" ON care_group_posts;
DROP POLICY IF EXISTS "Created by can update posts" ON care_group_posts;
DROP POLICY IF EXISTS "Created by can delete posts" ON care_group_posts;

DROP POLICY IF EXISTS "Group members can view comments" ON care_group_comments;
DROP POLICY IF EXISTS "Group members can create comments" ON care_group_comments;
DROP POLICY IF EXISTS "Created by can update comments" ON care_group_comments;
DROP POLICY IF EXISTS "Created by can delete comments" ON care_group_comments;
DROP POLICY IF EXISTS "Users can view comments if they can view the post" ON care_group_comments;
DROP POLICY IF EXISTS "Users can insert their own comments" ON care_group_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON care_group_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON care_group_comments;

-- Create policies for care_groups
CREATE POLICY "View public groups" ON care_groups
    FOR SELECT
    USING (is_public = true);

CREATE POLICY "Members can view their groups" ON care_groups
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM care_group_members 
            WHERE group_id = care_groups.id AND user_id = auth.uid()
            LIMIT 1
        )
    );

CREATE POLICY "Creators can manage their groups" ON care_groups
    FOR ALL
    USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

-- Create policies for care_group_members
CREATE POLICY "Users can view their own memberships" ON care_group_members
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Group owners can manage members" ON care_group_members
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM care_groups
            WHERE id = care_group_members.group_id
            AND created_by = auth.uid()
            LIMIT 1
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM care_groups
            WHERE id = care_group_members.group_id
            AND created_by = auth.uid()
            LIMIT 1
        )
    );

CREATE POLICY "Join public groups" ON care_group_members
    FOR INSERT
    WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM care_groups
            WHERE id = care_group_members.group_id
            AND is_public = true
            LIMIT 1
        )
    );

-- Create policies for care_tasks
CREATE POLICY "View tasks if member of group" ON care_tasks
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM care_group_members
            WHERE group_id = care_tasks.group_id
            AND user_id = auth.uid()
            LIMIT 1
        )
    );

CREATE POLICY "View tasks if assigned to me" ON care_tasks
    FOR SELECT
    USING (assigned_to = auth.uid());

CREATE POLICY "Manage tasks if created by me" ON care_tasks
    FOR ALL
    USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

-- Create policies for care_group_events
CREATE POLICY "Group members can view events" ON care_group_events
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM care_group_members
            WHERE group_id = care_group_events.group_id
            AND user_id = auth.uid()
            LIMIT 1
        )
    );

CREATE POLICY "Group members can create events" ON care_group_events
    FOR INSERT
    WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM care_group_members
            WHERE group_id = care_group_events.group_id
            AND user_id = auth.uid()
            LIMIT 1
        )
    );

CREATE POLICY "Created by can update events" ON care_group_events
    FOR UPDATE
    USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "Created by can delete events" ON care_group_events
    FOR DELETE
    USING (created_by = auth.uid());

-- Create policies for care_group_posts
CREATE POLICY "Group members can view posts" ON care_group_posts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM care_group_members
            WHERE group_id = care_group_posts.group_id
            AND user_id = auth.uid()
            LIMIT 1
        )
    );

CREATE POLICY "Group members can create posts" ON care_group_posts
    FOR INSERT
    WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM care_group_members
            WHERE group_id = care_group_posts.group_id
            AND user_id = auth.uid()
            LIMIT 1
        )
    );

CREATE POLICY "Created by can update posts" ON care_group_posts
    FOR UPDATE
    USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "Created by can delete posts" ON care_group_posts
    FOR DELETE
    USING (created_by = auth.uid());

-- Create policies for care_group_comments
CREATE POLICY "Group members can view comments" ON care_group_comments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM care_group_members m
            JOIN care_group_posts p ON p.group_id = m.group_id
            WHERE p.id = care_group_comments.post_id
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
            JOIN care_group_posts p ON p.group_id = m.group_id
            WHERE p.id = care_group_comments.post_id
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

-- ======== RPC FUNCTIONS ========

-- Drop existing functions first to avoid return type errors
DROP FUNCTION IF EXISTS get_group_details(UUID);
DROP FUNCTION IF EXISTS get_group_tasks(UUID);  
DROP FUNCTION IF EXISTS get_group_members(UUID);
DROP FUNCTION IF EXISTS get_group_events(UUID);
DROP FUNCTION IF EXISTS get_group_posts(UUID);
DROP FUNCTION IF EXISTS get_post_with_comments(UUID);
DROP FUNCTION IF EXISTS get_user_groups(UUID);
DROP FUNCTION IF EXISTS create_group_with_owner(TEXT, TEXT, BOOLEAN);

-- Function to get group details
CREATE OR REPLACE FUNCTION get_group_details(group_id_param UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    is_public BOOLEAN,
    owner_name TEXT,
    owner_avatar TEXT,
    member_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if user can view this group
    IF NOT EXISTS (
        SELECT 1 FROM care_groups g
        LEFT JOIN care_group_members m ON g.id = m.group_id
        WHERE g.id = group_id_param
        AND (g.is_public = true OR m.user_id = auth.uid())
        LIMIT 1
    ) THEN
        RETURN;
    END IF;
    
    RETURN QUERY
    SELECT 
        g.id,
        g.name,
        g.description,
        g.created_by,
        g.created_at,
        g.updated_at,
        g.is_public,
        u.display_name AS owner_name,
        u.avatar_url AS owner_avatar,
        (SELECT COUNT(*) FROM care_group_members WHERE group_id = g.id) AS member_count
    FROM care_groups g
    LEFT JOIN auth.users u ON g.created_by = u.id
    WHERE g.id = group_id_param;
END;
$$;

-- Function to get group tasks
CREATE OR REPLACE FUNCTION get_group_tasks(group_id_param UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    status TEXT,
    priority TEXT,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    assigned_to UUID,
    created_by UUID,
    assignee_name TEXT,
    assignee_avatar TEXT,
    creator_name TEXT,
    creator_avatar TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if user is a group member
    IF NOT EXISTS (
        SELECT 1 FROM care_group_members 
        WHERE group_id = group_id_param AND user_id = auth.uid()
        LIMIT 1
    ) THEN
        RETURN;
    END IF;
    
    RETURN QUERY
    SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.due_date,
        t.created_at,
        t.assigned_to,
        t.created_by,
        assignee.display_name AS assignee_name,
        assignee.avatar_url AS assignee_avatar,
        creator.display_name AS creator_name,
        creator.avatar_url AS creator_avatar
    FROM care_tasks t
    LEFT JOIN auth.users assignee ON t.assigned_to = assignee.id
    LEFT JOIN auth.users creator ON t.created_by = creator.id
    WHERE t.group_id = group_id_param
    ORDER BY 
        CASE 
            WHEN t.status = 'open' THEN 1
            WHEN t.status = 'in_progress' THEN 2
            ELSE 3
        END,
        t.due_date ASC NULLS LAST;
END;
$$;

-- Function to get group members
CREATE OR REPLACE FUNCTION get_group_members(group_id_param UUID)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    role TEXT,
    joined_at TIMESTAMPTZ,
    display_name TEXT,
    email TEXT,
    avatar_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if user is a group member or if group is public
    IF NOT EXISTS (
        SELECT 1 FROM care_groups g
        LEFT JOIN care_group_members m ON g.id = m.group_id
        WHERE g.id = group_id_param
        AND (g.is_public = true OR m.user_id = auth.uid())
        LIMIT 1
    ) THEN
        RETURN;
    END IF;
    
    RETURN QUERY
    SELECT 
        m.id,
        m.user_id,
        m.role,
        m.joined_at,
        u.display_name,
        u.email,
        u.avatar_url
    FROM care_group_members m
    JOIN auth.users u ON m.user_id = u.id
    WHERE m.group_id = group_id_param
    ORDER BY 
        CASE WHEN m.role = 'owner' THEN 1 ELSE 2 END,
        m.joined_at ASC;
END;
$$;

-- Function to get group events
CREATE OR REPLACE FUNCTION get_group_events(group_id_param UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    location TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    created_by UUID,
    created_at TIMESTAMPTZ,
    creator_name TEXT,
    creator_avatar TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if user is a group member
    IF NOT EXISTS (
        SELECT 1 FROM care_group_members 
        WHERE group_id = group_id_param AND user_id = auth.uid()
        LIMIT 1
    ) THEN
        RETURN;
    END IF;
    
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.description,
        e.location,
        e.start_time,
        e.end_time,
        e.created_by,
        e.created_at,
        u.display_name AS creator_name,
        u.avatar_url AS creator_avatar
    FROM care_group_events e
    LEFT JOIN auth.users u ON e.created_by = u.id
    WHERE e.group_id = group_id_param
    ORDER BY e.start_time ASC;
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

-- Function to get user groups
CREATE OR REPLACE FUNCTION get_user_groups(user_id_param UUID DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    is_public BOOLEAN,
    owner_name TEXT,
    owner_avatar TEXT,
    member_count BIGINT,
    role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    uid UUID;
BEGIN
    -- Default to current user if no parameter provided
    uid := COALESCE(user_id_param, auth.uid());
    
    -- Only allow users to see their own groups unless they're the same user
    IF uid != auth.uid() THEN
        RETURN;
    END IF;
    
    RETURN QUERY
    SELECT 
        g.id,
        g.name,
        g.description,
        g.created_by,
        g.created_at,
        g.updated_at,
        g.is_public,
        u.display_name AS owner_name,
        u.avatar_url AS owner_avatar,
        (SELECT COUNT(*) FROM care_group_members WHERE group_id = g.id) AS member_count,
        m.role
    FROM care_groups g
    JOIN care_group_members m ON g.id = m.group_id AND m.user_id = uid
    LEFT JOIN auth.users u ON g.created_by = u.id
    ORDER BY g.created_at DESC;
END;
$$;

-- Function to create group with owner
CREATE OR REPLACE FUNCTION create_group_with_owner(
    name_param TEXT,
    description_param TEXT,
    is_public_param BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    group_id UUID;
BEGIN
    -- Create the group
    INSERT INTO care_groups (name, description, created_by, is_public)
    VALUES (name_param, description_param, auth.uid(), is_public_param)
    RETURNING id INTO group_id;
    
    -- Add the creator as owner
    INSERT INTO care_group_members (group_id, user_id, role)
    VALUES (group_id, auth.uid(), 'owner');
    
    RETURN group_id;
END;
$$;

-- Grant execute permissions to all functions
GRANT EXECUTE ON FUNCTION get_group_details(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_group_tasks(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_group_members(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_group_events(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_group_posts(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_post_with_comments(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_groups(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_group_with_owner(TEXT, TEXT, BOOLEAN) TO authenticated;

COMMIT; 