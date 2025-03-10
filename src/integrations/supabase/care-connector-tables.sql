-- Care Connector Database Schema with RLS Policies
-- This script sets up all necessary tables for the Care Connector app
-- with appropriate Row Level Security policies

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-----------------------------------------------------------
-- CARE GROUPS TABLES
-----------------------------------------------------------

-- Care Groups Table
CREATE TABLE IF NOT EXISTS care_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE,
  image_url TEXT
);

-- RLS for care_groups table
ALTER TABLE care_groups ENABLE ROW LEVEL SECURITY;

-- Group creator can do everything
CREATE POLICY "Group creators have full access" ON care_groups
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Public groups can be read by anyone
CREATE POLICY "Public groups are viewable by everyone" ON care_groups
  FOR SELECT USING (is_public = TRUE);

-- Care Group Members Table (with roles)
CREATE TABLE IF NOT EXISTS care_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE (group_id, user_id)
);

-- RLS for care_group_members table
ALTER TABLE care_group_members ENABLE ROW LEVEL SECURITY;

-- Group members can see other members in their groups
CREATE POLICY "Group members can see other members in their groups" ON care_group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE group_id = care_group_members.group_id
      AND user_id = auth.uid()
    )
  );

-- Group owners/admins can add/update/delete members
CREATE POLICY "Group owners and admins can manage members" ON care_group_members
  USING (
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE group_id = care_group_members.group_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE group_id = care_group_members.group_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Users can see groups they're invited to
CREATE POLICY "Users can see their own memberships" ON care_group_members
  FOR SELECT USING (user_id = auth.uid());

-- Group Invitations Table
CREATE TABLE IF NOT EXISTS care_group_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care_groups(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  UNIQUE (group_id, invited_email)
);

-- RLS for care_group_invitations table
ALTER TABLE care_group_invitations ENABLE ROW LEVEL SECURITY;

-- Users can see their own invitations
CREATE POLICY "Users can see invitations to their email" ON care_group_invitations
  FOR SELECT USING (
    invited_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

-- Group owners/admins can manage invitations
CREATE POLICY "Group owners and admins can manage invitations" ON care_group_invitations
  USING (
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE group_id = care_group_invitations.group_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE group_id = care_group_invitations.group_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-----------------------------------------------------------
-- CARE TASKS TABLES
-----------------------------------------------------------

-- Care Tasks Table
CREATE TABLE IF NOT EXISTS care_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- RLS for care_tasks table
ALTER TABLE care_tasks ENABLE ROW LEVEL SECURITY;

-- Group members can see tasks in their group
CREATE POLICY "Group members can see tasks in their group" ON care_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE group_id = care_tasks.group_id
      AND user_id = auth.uid()
    )
  );

-- Tasks assigned to me are visible to me
CREATE POLICY "Assigned tasks are visible to assignee" ON care_tasks
  FOR SELECT USING (assigned_to = auth.uid());

-- Group owners/admins can manage tasks
CREATE POLICY "Group owners and admins can manage tasks" ON care_tasks
  USING (
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE group_id = care_tasks.group_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE group_id = care_tasks.group_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Assigned users can update task status
CREATE POLICY "Assigned users can update task status" ON care_tasks
  FOR UPDATE USING (assigned_to = auth.uid())
  WITH CHECK (assigned_to = auth.uid() AND (
    -- Only allow updating status and completed fields, not other fields
    NEW.group_id = OLD.group_id AND
    NEW.title = OLD.title AND
    NEW.description = OLD.description AND
    NEW.created_by = OLD.created_by AND
    NEW.assigned_to = OLD.assigned_to AND
    NEW.due_date = OLD.due_date AND
    NEW.priority = OLD.priority
  ));

-----------------------------------------------------------
-- HEALTH MONITORING TABLES
-----------------------------------------------------------

-- Health Records Table
CREATE TABLE IF NOT EXISTS care_health_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id UUID REFERENCES care_groups(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL,
  record_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data JSONB NOT NULL,
  notes TEXT,
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'group', 'public')),
  shared_with UUID[] DEFAULT '{}'::UUID[]
);

-- RLS for care_health_records table
ALTER TABLE care_health_records ENABLE ROW LEVEL SECURITY;

-- Users can manage their own health records
CREATE POLICY "Users can manage their own health records" ON care_health_records
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Group members can see health records shared with the group
CREATE POLICY "Group members can see health records shared with the group" ON care_health_records
  FOR SELECT USING (
    visibility = 'group' AND
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE group_id = care_health_records.group_id
      AND user_id = auth.uid()
    )
  );

-- Public health records are visible to everyone
CREATE POLICY "Public health records are visible to everyone" ON care_health_records
  FOR SELECT USING (visibility = 'public');

-- Health records shared with specific users are visible to them
CREATE POLICY "Shared health records are visible to shared users" ON care_health_records
  FOR SELECT USING (auth.uid() = ANY(shared_with));

-----------------------------------------------------------
-- MARKETPLACE TABLES
-----------------------------------------------------------

-- Care Providers Table
CREATE TABLE IF NOT EXISTS care_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('caregiver', 'companion', 'facility')),
  description TEXT,
  image_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  location TEXT,
  services JSONB,
  rates JSONB,
  availability JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT FALSE,
  average_rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0
);

-- RLS for care_providers table
ALTER TABLE care_providers ENABLE ROW LEVEL SECURITY;

-- Providers are publicly viewable
CREATE POLICY "Providers are publicly viewable" ON care_providers
  FOR SELECT USING (true);

-- Providers can edit their own listings
CREATE POLICY "Providers can edit their own listings" ON care_providers
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Provider Reviews Table
CREATE TABLE IF NOT EXISTS care_provider_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES care_providers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (provider_id, user_id)
);

-- RLS for care_provider_reviews table
ALTER TABLE care_provider_reviews ENABLE ROW LEVEL SECURITY;

-- Reviews are publicly viewable
CREATE POLICY "Reviews are publicly viewable" ON care_provider_reviews
  FOR SELECT USING (true);

-- Users can manage their own reviews
CREATE POLICY "Users can manage their own reviews" ON care_provider_reviews
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-----------------------------------------------------------
-- ACTIVITY TRACKING
-----------------------------------------------------------

-- Activity Log Table
CREATE TABLE IF NOT EXISTS care_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES care_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for care_activity_log table
ALTER TABLE care_activity_log ENABLE ROW LEVEL SECURITY;

-- Group members can see activities in their group
CREATE POLICY "Group members can see activities in their group" ON care_activity_log
  FOR SELECT USING (
    group_id IS NULL OR
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE group_id = care_activity_log.group_id
      AND user_id = auth.uid()
    )
  );

-- Users can create activity logs
CREATE POLICY "Users can create activity logs" ON care_activity_log
  FOR INSERT WITH CHECK (user_id = auth.uid());

-----------------------------------------------------------
-- EVENTS & CALENDAR TABLES
-----------------------------------------------------------

-- Group Events Table
CREATE TABLE IF NOT EXISTS care_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for care_events table
ALTER TABLE care_events ENABLE ROW LEVEL SECURITY;

-- Group members can see events in their group
CREATE POLICY "Group members can see events in their group" ON care_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE group_id = care_events.group_id
      AND user_id = auth.uid()
    )
  );

-- Group owners/admins can manage events
CREATE POLICY "Group owners and admins can manage events" ON care_events
  USING (
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE group_id = care_events.group_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE group_id = care_events.group_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Event Reminders Table
CREATE TABLE IF NOT EXISTS care_event_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES care_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (event_id, user_id)
);

-- RLS for care_event_reminders table
ALTER TABLE care_event_reminders ENABLE ROW LEVEL SECURITY;

-- Users can manage their own reminders
CREATE POLICY "Users can manage their own reminders" ON care_event_reminders
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-----------------------------------------------------------
-- COMMUNITY & POSTS TABLES
-----------------------------------------------------------

-- Group Posts Table
CREATE TABLE IF NOT EXISTS care_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for care_posts table
ALTER TABLE care_posts ENABLE ROW LEVEL SECURITY;

-- Group members can see posts in their group
CREATE POLICY "Group members can see posts in their group" ON care_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE group_id = care_posts.group_id
      AND user_id = auth.uid()
    )
  );

-- Users can manage their own posts
CREATE POLICY "Users can manage their own posts" ON care_posts
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Post Comments Table
CREATE TABLE IF NOT EXISTS care_post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES care_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for care_post_comments table
ALTER TABLE care_post_comments ENABLE ROW LEVEL SECURITY;

-- Comments are visible to group members
CREATE POLICY "Comments are visible to group members" ON care_post_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM care_posts p
      JOIN care_group_members m ON p.group_id = m.group_id
      WHERE p.id = care_post_comments.post_id
      AND m.user_id = auth.uid()
    )
  );

-- Users can manage their own comments
CREATE POLICY "Users can manage their own comments" ON care_post_comments
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Post Likes Table
CREATE TABLE IF NOT EXISTS care_post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES care_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (post_id, user_id)
);

-- RLS for care_post_likes table
ALTER TABLE care_post_likes ENABLE ROW LEVEL SECURITY;

-- Likes are visible to group members
CREATE POLICY "Likes are visible to group members" ON care_post_likes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM care_posts p
      JOIN care_group_members m ON p.group_id = m.group_id
      WHERE p.id = care_post_likes.post_id
      AND m.user_id = auth.uid()
    )
  );

-- Users can manage their own likes
CREATE POLICY "Users can manage their own likes" ON care_post_likes
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Function to update post like and comment counts
CREATE OR REPLACE FUNCTION update_post_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- This trigger updates post metrics when likes or comments change
  IF TG_TABLE_NAME = 'care_post_likes' THEN
    -- Update like count
    UPDATE care_posts
    SET 
      like_count = (
        SELECT COUNT(*)
        FROM care_post_likes
        WHERE post_id = COALESCE(NEW.post_id, OLD.post_id)
      )
    WHERE id = COALESCE(NEW.post_id, OLD.post_id);
  ELSIF TG_TABLE_NAME = 'care_post_comments' THEN
    -- Update comment count
    UPDATE care_posts
    SET 
      comment_count = (
        SELECT COUNT(*)
        FROM care_post_comments
        WHERE post_id = COALESCE(NEW.post_id, OLD.post_id)
      )
    WHERE id = COALESCE(NEW.post_id, OLD.post_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Add like_count and comment_count columns to care_posts table
ALTER TABLE care_posts ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;
ALTER TABLE care_posts ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;

-- Triggers to update post metrics
CREATE TRIGGER update_post_likes_count
AFTER INSERT OR DELETE ON care_post_likes
FOR EACH ROW
EXECUTE FUNCTION update_post_metrics();

CREATE TRIGGER update_post_comments_count
AFTER INSERT OR DELETE ON care_post_comments
FOR EACH ROW
EXECUTE FUNCTION update_post_metrics();

-- Function to log community activity
CREATE OR REPLACE FUNCTION log_community_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF TG_TABLE_NAME = 'care_posts' THEN
      INSERT INTO care_activity_log (group_id, user_id, activity_type, activity_data)
      VALUES (
        NEW.group_id,
        NEW.user_id,
        'post_created',
        jsonb_build_object(
          'post_id', NEW.id,
          'post_content', substring(NEW.content, 1, 50) || CASE WHEN length(NEW.content) > 50 THEN '...' ELSE '' END
        )
      );
    ELSIF TG_TABLE_NAME = 'care_post_comments' THEN
      INSERT INTO care_activity_log (
        group_id, 
        user_id, 
        activity_type, 
        activity_data
      )
      SELECT 
        p.group_id,
        NEW.user_id,
        'comment_created',
        jsonb_build_object(
          'post_id', NEW.post_id,
          'comment_id', NEW.id,
          'comment_content', substring(NEW.content, 1, 50) || CASE WHEN length(NEW.content) > 50 THEN '...' ELSE '' END
        )
      FROM care_posts p
      WHERE p.id = NEW.post_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to log community activity
CREATE TRIGGER log_post_activity_trigger
AFTER INSERT ON care_posts
FOR EACH ROW
EXECUTE FUNCTION log_community_activity();

CREATE TRIGGER log_comment_activity_trigger
AFTER INSERT ON care_post_comments
FOR EACH ROW
EXECUTE FUNCTION log_community_activity();

-----------------------------------------------------------
-- TRIGGERS AND FUNCTIONS
-----------------------------------------------------------

-- Function to automatically add creator as owner of a new care group
CREATE OR REPLACE FUNCTION add_group_creator_as_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO care_group_members (group_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to add creator as owner when a group is created
CREATE TRIGGER add_group_creator_as_owner_trigger
AFTER INSERT ON care_groups
FOR EACH ROW
EXECUTE FUNCTION add_group_creator_as_owner();

-- Function to update average rating and review count for providers
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE care_providers
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM care_provider_reviews
      WHERE provider_id = NEW.provider_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM care_provider_reviews
      WHERE provider_id = NEW.provider_id
    )
  WHERE id = NEW.provider_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update provider rating when a review is added/updated/deleted
CREATE TRIGGER update_provider_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON care_provider_reviews
FOR EACH ROW
EXECUTE FUNCTION update_provider_rating();

-- Function to log task activity
CREATE OR REPLACE FUNCTION log_task_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO care_activity_log (group_id, user_id, activity_type, activity_data)
    VALUES (
      NEW.group_id,
      NEW.created_by,
      'task_created',
      jsonb_build_object(
        'task_id', NEW.id,
        'task_title', NEW.title,
        'assigned_to', NEW.assigned_to
      )
    );
  ELSIF (TG_OP = 'UPDATE') THEN
    -- Only log status changes
    IF (OLD.status != NEW.status) THEN
      INSERT INTO care_activity_log (group_id, user_id, activity_type, activity_data)
      VALUES (
        NEW.group_id,
        COALESCE(NEW.completed_by, auth.uid()),
        CASE
          WHEN NEW.status = 'completed' THEN 'task_completed'
          WHEN NEW.status = 'in_progress' THEN 'task_started'
          WHEN NEW.status = 'cancelled' THEN 'task_cancelled'
          ELSE 'task_updated'
        END,
        jsonb_build_object(
          'task_id', NEW.id,
          'task_title', NEW.title,
          'old_status', OLD.status,
          'new_status', NEW.status
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log task activity
CREATE TRIGGER log_task_activity_trigger
AFTER INSERT OR UPDATE ON care_tasks
FOR EACH ROW
EXECUTE FUNCTION log_task_activity();

-- Function to log group membership activity
CREATE OR REPLACE FUNCTION log_group_membership_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO care_activity_log (group_id, user_id, activity_type, activity_data)
    VALUES (
      NEW.group_id,
      COALESCE(NEW.invited_by, NEW.user_id),
      'member_joined',
      jsonb_build_object(
        'member_id', NEW.user_id,
        'role', NEW.role
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log group membership activity
CREATE TRIGGER log_group_membership_activity_trigger
AFTER INSERT ON care_group_members
FOR EACH ROW
EXECUTE FUNCTION log_group_membership_activity();

-----------------------------------------------------------
-- STORED PROCEDURES
-----------------------------------------------------------

-- Stored procedure to create a care group and add the creator as owner
CREATE OR REPLACE FUNCTION create_care_group(
  p_name TEXT,
  p_description TEXT,
  p_is_public BOOLEAN DEFAULT FALSE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_group_id UUID;
BEGIN
  -- Insert the new group and get its ID
  INSERT INTO care_groups (
    name,
    description,
    is_public,
    created_by
  ) VALUES (
    p_name,
    p_description,
    p_is_public,
    auth.uid()
  )
  RETURNING id INTO v_group_id;
  
  -- The trigger will automatically add the creator as owner
  
  -- Log the activity
  INSERT INTO care_activity_log (
    group_id,
    user_id,
    activity_type,
    activity_data
  ) VALUES (
    v_group_id,
    auth.uid(),
    'group_created',
    jsonb_build_object(
      'group_id', v_group_id,
      'group_name', p_name
    )
  );
  
  RETURN v_group_id;
END;
$$; 