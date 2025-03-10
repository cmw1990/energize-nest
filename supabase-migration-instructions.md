# Supabase Migration Instructions

It seems we can connect to Supabase, but executing SQL statements through the API is failing. Let's use the Supabase UI to migrate our database schema.

## Care Connector Migration Steps

1. Open the Supabase Dashboard: https://supabase.com/dashboard
2. Sign in with your credentials
3. Select the "zoubqdwxemivxrjruvam" project
4. Navigate to the "SQL Editor" tab in the left sidebar
5. Create a new query by clicking the "+" button
6. Copy the entire contents of the `care-connector-functions.sql` file and paste it into the SQL editor
7. Execute the query by clicking the "Run" button

## Contents to Copy (care-connector-functions.sql)

```sql
-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the care_groups table if it doesn't exist
CREATE TABLE IF NOT EXISTS care_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_url TEXT
);

-- Create the care_group_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS care_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES care_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Create the care_group_invitations table if it doesn't exist
CREATE TABLE IF NOT EXISTS care_group_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES care_groups(id) ON DELETE CASCADE NOT NULL,
  invited_email TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + interval '7 days'),
  UNIQUE(group_id, invited_email)
);

-- Create the care_group_tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS care_group_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES care_groups(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to_user_id UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the care_group_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS care_group_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES care_groups(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the care_group_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS care_group_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES care_groups(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the care_group_post_reactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS care_group_post_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES care_group_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create the care_group_post_comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS care_group_post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES care_group_posts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the care_activity_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS care_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES care_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE care_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_activity_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for care_groups
CREATE POLICY "Users can view public groups" 
  ON care_groups FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Group members can view their groups" 
  ON care_groups FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM care_group_members 
      WHERE group_id = care_groups.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create groups" 
  ON care_groups FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group owners can update their groups" 
  ON care_groups FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM care_group_members 
      WHERE group_id = care_groups.id AND user_id = auth.uid() AND role = 'owner'
    )
  );

-- Create RLS policies for care_group_members
CREATE POLICY "Users can view group members" 
  ON care_group_members FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM care_group_members 
      WHERE group_id = care_group_members.group_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Group owners and admins can add members" 
  ON care_group_members FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM care_group_members 
      WHERE group_id = care_group_members.group_id AND user_id = auth.uid() AND (role = 'owner' OR role = 'admin')
    ) OR 
    auth.uid() = user_id -- Users can add themselves to public groups
  );

-- Create the create_care_group function
CREATE OR REPLACE FUNCTION create_care_group(
  p_name TEXT,
  p_description TEXT DEFAULT NULL,
  p_is_public BOOLEAN DEFAULT false
) RETURNS UUID AS $$
DECLARE
  v_group_id UUID;
BEGIN
  -- Insert the new group
  INSERT INTO care_groups (name, description, is_public, created_by)
  VALUES (p_name, p_description, p_is_public, auth.uid())
  RETURNING id INTO v_group_id;
  
  -- Add the creator as an owner
  INSERT INTO care_group_members (group_id, user_id, role)
  VALUES (v_group_id, auth.uid(), 'owner');
  
  -- Log the activity
  INSERT INTO care_activity_log (group_id, user_id, activity_type, activity_data)
  VALUES (v_group_id, auth.uid(), 'group_created', json_build_object('group_name', p_name));
  
  RETURN v_group_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Verification

After executing the SQL:

1. Navigate to the "Table Editor" tab
2. Verify that all the Care Connector tables have been created:
   - care_groups
   - care_group_members
   - care_group_invitations
   - care_group_tasks
   - care_group_events
   - care_group_posts
   - care_group_post_reactions
   - care_group_post_comments
   - care_activity_log

3. Navigate to the "Database Functions" section
4. Verify that the `create_care_group` function is listed

## Next Steps

After migrating the database schema:

1. Generate the TypeScript types for the database schema:
   ```
   node generate-types.js
   ```

2. Restart the application to apply the changes:
   ```
   npx vite --port 8001
   ``` 