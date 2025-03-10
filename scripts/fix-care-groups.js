// Script to completely reset and rebuild the care group tables
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Supabase connection details from SSOT
const host = 'aws-0-us-west-1.pooler.supabase.com';
const port = '5432';
const database = 'postgres';
const user = 'postgres.zoubqdwxemivxrjruvam';
const password = 'Superstrongpasswordfor5527@@@';

// Create SQL statement to drop and recreate tables
const resetSql = `
-- Drop existing tables with CASCADE to handle dependencies
DROP TABLE IF EXISTS care_group_invitations CASCADE;
DROP TABLE IF EXISTS care_group_members CASCADE;
DROP TABLE IF EXISTS care_groups CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create care_groups table
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

-- Create care_group_members table
CREATE TABLE care_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id),
  UNIQUE (group_id, user_id)
);

-- Create care_group_invitations table
CREATE TABLE care_group_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES care_groups(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  UNIQUE (group_id, invited_email)
);

-- Enable Row Level Security
ALTER TABLE care_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for care_groups
CREATE POLICY "Group creators have full access" ON care_groups
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Public groups are viewable by everyone" ON care_groups
  FOR SELECT USING (is_public = TRUE);

-- Create policies for care_group_members
CREATE POLICY "Group members can see other members in their groups" ON care_group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM care_group_members
      WHERE group_id = care_group_members.group_id
      AND user_id = auth.uid()
    )
  );

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

CREATE POLICY "Users can see their own memberships" ON care_group_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can join public groups" ON care_group_members
  FOR INSERT WITH CHECK (
    role = 'member' AND
    EXISTS (
      SELECT 1 FROM care_groups 
      WHERE id = group_id AND is_public = TRUE
    )
  );

-- Create policies for care_group_invitations
CREATE POLICY "Users can see invitations to their email" ON care_group_invitations
  FOR SELECT USING (
    invited_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

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

CREATE POLICY "Users can respond to their invitations" ON care_group_invitations
  FOR UPDATE USING (
    invited_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    invited_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) AND
    (status = 'accepted' OR status = 'declined')
  );
`;

// Write the SQL to a temporary file
const sqlFilePath = path.resolve(__dirname, '../temp-reset-care-groups.sql');
fs.writeFileSync(sqlFilePath, resetSql);

console.log('Generated SQL reset script at:', sqlFilePath);
console.log('Running complete care groups reset...');

// Set environment variable for password
process.env.PGPASSWORD = password;

// Run the migration using psql
const psql = spawn('psql', [
  '-h', host,
  '-p', port,
  '-d', database,
  '-U', user,
  '-f', sqlFilePath
]);

// Handle stdout
psql.stdout.on('data', (data) => {
  console.log(`${data}`);
});

// Handle stderr
psql.stderr.on('data', (data) => {
  console.error(`${data}`);
});

// Handle process completion
psql.on('close', (code) => {
  if (code === 0) {
    console.log('Care groups tables completely reset and rebuilt successfully');
    
    // Clean up temporary file
    fs.unlinkSync(sqlFilePath);
    console.log('Temporary SQL file removed');
  } else {
    console.error(`Reset failed with code: ${code}`);
    console.log('The SQL file is available at:', sqlFilePath);
  }
}); 