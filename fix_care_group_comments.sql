-- Care Connector Database Repair Script (Manual Copy-Paste Version)
-- This script fixes the care_group_comments table issue

-- Check for care_group_comments table and create it if it doesn't exist
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
        
        -- Create indexes
        CREATE INDEX idx_care_group_comments_post_id ON care_group_comments(post_id);
        CREATE INDEX idx_care_group_comments_created_by ON care_group_comments(created_by);
        
        -- Create policies
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
    END IF;
END
$$;

-- Drop existing functions first to avoid return type errors
DROP FUNCTION IF EXISTS get_group_tasks(UUID);
DROP FUNCTION IF EXISTS get_group_posts(UUID);
DROP FUNCTION IF EXISTS get_post_with_comments(UUID);

-- Update functions to handle care_group_comments properly

-- Function to get group tasks (unchanged but included to ensure latest version)
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

-- Function to get group posts with comment count
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

-- Grant execute permissions to all functions
GRANT EXECUTE ON FUNCTION get_group_tasks(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_group_posts(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_post_with_comments(UUID) TO authenticated; 