-- =====================================================
-- CARE CONNECTOR MIGRATION SCRIPT TO SINGLE SOURCE OF TRUTH
-- This script replaces all care-related tables with new ones
-- that have "8" in their names and implements simplified RLS
-- =====================================================

-- =====================================================
-- STEP 1: DROP ALL EXISTING POLICIES FOR CARE TABLES
-- =====================================================

-- This DO block handles policy drops more safely
DO $$
DECLARE
  policy_list text[];
  table_list text[];
  i text;
  j text;
BEGIN
  -- List of policies to drop
  policy_list := ARRAY[
    'Users can view public groups',
    'Users can view their own groups',
    'Users can create groups',
    'view_public_groups',
    'view_own_groups',
    'create_groups',
    'update_own_groups',
    'delete_own_groups',
    'Allow all operations on care_groups',
    'groups_public_read',
    'groups_member_read',
    'groups_insert',
    'groups_update',
    'groups_delete',
    'simple_groups_read',
    'simple_groups_insert',
    'simple_groups_update',
    'simple_groups_delete',
    'allow_all_care_groups',
    'Allow access to own memberships',
    'Allow viewing members if user is also a member',
    'Allow viewing all members of public groups',
    'Users can view their own memberships',
    'Group owners can view all members of their groups',
    'Anyone can view members of public groups',
    'Users can add themselves to groups',
    'Group owners can add members',
    'view_own_memberships',
    'view_group_members',
    'view_public_group_members',
    'add_self_to_groups',
    'owners_add_members',
    'remove_self_from_groups',
    'owners_remove_members',
    'Allow all operations on care_group_members',
    'members_self_read',
    'members_same_group_read',
    'members_insert',
    'members_update',
    'members_delete',
    'simple_members_read',
    'simple_members_insert',
    'simple_members_update',
    'simple_members_delete',
    'allow_all_care_group_members',
    'view_own_invitations',
    'view_sent_invitations',
    'create_invitations',
    'delete_own_invitations',
    'owners_delete_invitations',
    'Allow all operations on care_group_invitations',
    'invitations_recipient_read',
    'invitations_insert',
    'invitations_update',
    'invitations_delete',
    'simple_invitations_read',
    'simple_invitations_insert',
    'simple_invitations_update',
    'simple_invitations_delete',
    'allow_all_care_group_invitations',
    'allow_all_care_group_events',
    'allow_all_care_group_tasks',
    'allow_all_care_group_notes',
    'allow_all_care_group_resources',
    'allow_all_care_group_volunteers'
  ];
  
  -- List of tables to check
  table_list := ARRAY[
    'care_groups', 
    'care_group_members', 
    'care_group_invitations', 
    'care_group_events', 
    'care_group_tasks', 
    'care_group_notes', 
    'care_group_resources', 
    'care_group_volunteers'
  ];
  
  -- Drop policies for each table if it exists
  FOREACH i IN ARRAY table_list LOOP
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = i) THEN
      -- Use EXECUTE with FORMAT to dynamically construct the drop policy statements
      EXECUTE FORMAT('DROP POLICY IF EXISTS "Users can view public groups" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "Users can view their own groups" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "Users can create groups" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "view_public_groups" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "view_own_groups" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "create_groups" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "update_own_groups" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "delete_own_groups" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "Allow all operations on care_groups" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "groups_public_read" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "groups_member_read" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "groups_insert" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "groups_update" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "groups_delete" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "simple_groups_read" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "simple_groups_insert" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "simple_groups_update" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "simple_groups_delete" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "allow_all_care_groups" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "Allow access to own memberships" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "Allow viewing members if user is also a member" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "Allow viewing all members of public groups" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "Users can view their own memberships" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "Group owners can view all members of their groups" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "Anyone can view members of public groups" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "Users can add themselves to groups" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "Group owners can add members" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "view_own_memberships" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "view_group_members" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "view_public_group_members" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "add_self_to_groups" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "owners_add_members" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "remove_self_from_groups" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "owners_remove_members" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "Allow all operations on care_group_members" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "members_self_read" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "members_same_group_read" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "members_insert" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "members_update" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "members_delete" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "simple_members_read" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "simple_members_insert" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "simple_members_update" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "simple_members_delete" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "allow_all_care_group_members" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "view_own_invitations" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "view_sent_invitations" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "create_invitations" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "delete_own_invitations" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "owners_delete_invitations" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "Allow all operations on care_group_invitations" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "invitations_recipient_read" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "invitations_insert" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "invitations_update" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "invitations_delete" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "simple_invitations_read" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "simple_invitations_insert" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "simple_invitations_update" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "simple_invitations_delete" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "allow_all_care_group_invitations" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "allow_all_care_group_events" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "allow_all_care_group_tasks" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "allow_all_care_group_notes" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "allow_all_care_group_resources" ON %I', i);
      EXECUTE FORMAT('DROP POLICY IF EXISTS "allow_all_care_group_volunteers" ON %I', i);
    END IF;
  END LOOP;
END $$;

-- =====================================================
-- STEP 2: DROP ALL EXISTING CARE-RELATED TABLES
-- =====================================================
DO $$
BEGIN
  -- Drop tables if they exist
  DROP TABLE IF EXISTS care_group_invitations CASCADE;
  DROP TABLE IF EXISTS care_group_members CASCADE;
  DROP TABLE IF EXISTS care_groups CASCADE;
  DROP TABLE IF EXISTS care_group_events CASCADE;
  DROP TABLE IF EXISTS care_group_tasks CASCADE;
  DROP TABLE IF EXISTS care_group_notes CASCADE;
  DROP TABLE IF EXISTS care_group_resources CASCADE;
  DROP TABLE IF EXISTS care_group_volunteers CASCADE;
  
  -- Catch and handle any errors
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error while dropping tables: %', SQLERRM;
END $$;

-- =====================================================
-- STEP 3: CREATE NEW CARE8 TABLES
-- =====================================================

-- Create care8_groups table
CREATE TABLE care8_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  image_url TEXT
);

-- Create care8_group_members table
CREATE TABLE care8_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care8_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create care8_group_invitations table
CREATE TABLE care8_group_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care8_groups(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days')
);

-- Create care8_group_events table
CREATE TABLE care8_group_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care8_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create care8_group_tasks table
CREATE TABLE care8_group_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care8_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES auth.users(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create care8_group_notes table
CREATE TABLE care8_group_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care8_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create care8_group_resources table
CREATE TABLE care8_group_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care8_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_url TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('link', 'document', 'image', 'video', 'other')),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create care8_group_volunteers table
CREATE TABLE care8_group_volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care8_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  max_volunteers INTEGER NOT NULL DEFAULT 1,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =====================================================
ALTER TABLE care8_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE care8_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE care8_group_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE care8_group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE care8_group_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE care8_group_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE care8_group_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE care8_group_volunteers ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 5: CREATE SIMPLIFIED RLS POLICIES
-- =====================================================

-- Single policy for care8_groups - allows all operations
CREATE POLICY "allow_all_care8_groups" 
ON care8_groups
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Single policy for care8_group_members - allows all operations
CREATE POLICY "allow_all_care8_group_members" 
ON care8_group_members
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Single policy for care8_group_invitations - allows all operations
CREATE POLICY "allow_all_care8_group_invitations" 
ON care8_group_invitations
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Single policy for care8_group_events - allows all operations
CREATE POLICY "allow_all_care8_group_events" 
ON care8_group_events
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Single policy for care8_group_tasks - allows all operations
CREATE POLICY "allow_all_care8_group_tasks" 
ON care8_group_tasks
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Single policy for care8_group_notes - allows all operations
CREATE POLICY "allow_all_care8_group_notes" 
ON care8_group_notes
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Single policy for care8_group_resources - allows all operations
CREATE POLICY "allow_all_care8_group_resources" 
ON care8_group_resources
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Single policy for care8_group_volunteers - allows all operations
CREATE POLICY "allow_all_care8_group_volunteers" 
ON care8_group_volunteers
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================
-- STEP 6: ENSURE PROPER ACCESS RIGHTS
-- =====================================================
GRANT ALL ON care8_groups TO authenticated;
GRANT ALL ON care8_group_members TO authenticated;
GRANT ALL ON care8_group_invitations TO authenticated;
GRANT ALL ON care8_group_events TO authenticated;
GRANT ALL ON care8_group_tasks TO authenticated;
GRANT ALL ON care8_group_notes TO authenticated;
GRANT ALL ON care8_group_resources TO authenticated;
GRANT ALL ON care8_group_volunteers TO authenticated;

-- =====================================================
-- STEP 7: CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX idx_care8_groups_created_by ON care8_groups(created_by);
CREATE INDEX idx_care8_groups_is_public ON care8_groups(is_public);

CREATE INDEX idx_care8_group_members_group_id ON care8_group_members(group_id);
CREATE INDEX idx_care8_group_members_user_id ON care8_group_members(user_id);
CREATE INDEX idx_care8_group_members_role ON care8_group_members(role);

CREATE INDEX idx_care8_group_invitations_group_id ON care8_group_invitations(group_id);
CREATE INDEX idx_care8_group_invitations_invited_email ON care8_group_invitations(invited_email);
CREATE INDEX idx_care8_group_invitations_status ON care8_group_invitations(status);

CREATE INDEX idx_care8_group_events_group_id ON care8_group_events(group_id);
CREATE INDEX idx_care8_group_events_start_time ON care8_group_events(start_time);

CREATE INDEX idx_care8_group_tasks_group_id ON care8_group_tasks(group_id);
CREATE INDEX idx_care8_group_tasks_assigned_to ON care8_group_tasks(assigned_to);
CREATE INDEX idx_care8_group_tasks_status ON care8_group_tasks(status);

CREATE INDEX idx_care8_group_notes_group_id ON care8_group_notes(group_id);
CREATE INDEX idx_care8_group_resources_group_id ON care8_group_resources(group_id);
CREATE INDEX idx_care8_group_volunteers_group_id ON care8_group_volunteers(group_id); 