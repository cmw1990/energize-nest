-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Care Groups Table
CREATE TABLE IF NOT EXISTS care_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE,
  image_url TEXT
);

-- Enable RLS on care_groups
ALTER TABLE care_groups ENABLE ROW LEVEL SECURITY;

-- RLS Policies for care_groups
CREATE POLICY "Group creators have full access" ON care_groups
  USING (auth.uid() = created_by);

CREATE POLICY "Public groups are viewable by everyone" ON care_groups
  FOR SELECT USING (is_public = true);

-- Care Group Members Table
CREATE TABLE IF NOT EXISTS care_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(group_id, user_id)
);

-- Enable RLS on care_group_members
ALTER TABLE care_group_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for care_group_members
CREATE POLICY "Group members can see other members in their groups" ON care_group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM care_group_members 
      WHERE user_id = auth.uid() 
      AND group_id = care_group_members.group_id
    )
  );

CREATE POLICY "Group owners and admins can manage members" ON care_group_members
  USING (
    EXISTS (
      SELECT 1 FROM care_group_members 
      WHERE user_id = auth.uid() 
      AND group_id = care_group_members.group_id 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can see their own memberships" ON care_group_members
  FOR SELECT USING (user_id = auth.uid());

-- Create a function to automatically add the creator as an owner
CREATE OR REPLACE FUNCTION add_group_creator_as_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO care_group_members (group_id, user_id, role, invited_by)
  VALUES (NEW.id, NEW.created_by, 'owner', NEW.created_by);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function
CREATE TRIGGER add_group_creator_as_owner_trigger
AFTER INSERT ON care_groups
FOR EACH ROW
EXECUTE FUNCTION add_group_creator_as_owner();

-- Create a simple health check table to verify database availability
CREATE TABLE IF NOT EXISTS care_connector_health_check (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  check_time TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'ok'
);

-- Insert a record into the health check table
INSERT INTO care_connector_health_check (status) VALUES ('ok'); 