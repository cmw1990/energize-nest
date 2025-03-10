-- =====================================================
-- SIMPLIFIED DATA MIGRATION SCRIPT
-- Moves data from old care tables to new care8 tables
-- =====================================================

-- =====================================================
-- STEP 1: MIGRATE GROUPS
-- =====================================================
INSERT INTO care8_groups (
  id, 
  name, 
  description, 
  is_public, 
  created_at, 
  created_by, 
  updated_at, 
  image_url
)
SELECT 
  id, 
  name, 
  description, 
  is_public, 
  created_at, 
  created_by, 
  updated_at, 
  image_url
FROM 
  care_groups
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'care_groups');

-- =====================================================
-- STEP 2: MIGRATE GROUP MEMBERS
-- =====================================================
INSERT INTO care8_group_members (
  id,
  group_id,
  user_id,
  role,
  joined_at
)
SELECT 
  id,
  group_id,
  user_id,
  role,
  joined_at
FROM 
  care_group_members
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'care_group_members');

-- =====================================================
-- STEP 3: MIGRATE GROUP INVITATIONS
-- =====================================================
INSERT INTO care8_group_invitations (
  id,
  group_id,
  invited_email,
  invited_by,
  status,
  created_at,
  expires_at
)
SELECT 
  id,
  group_id,
  invited_email,
  invited_by,
  status,
  created_at,
  COALESCE(expires_at, created_at + interval '7 days')
FROM 
  care_group_invitations
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'care_group_invitations');

-- =====================================================
-- STEP 4: MIGRATE GROUP EVENTS (IF EXIST)
-- =====================================================
INSERT INTO care8_group_events (
  id,
  group_id,
  title,
  description,
  start_time,
  end_time,
  location,
  created_by,
  created_at,
  updated_at
)
SELECT 
  id,
  group_id,
  title,
  description,
  start_time,
  end_time,
  location,
  created_by,
  created_at,
  updated_at
FROM 
  care_group_events
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'care_group_events');

-- =====================================================
-- STEP 5: MIGRATE GROUP TASKS (IF EXIST)
-- =====================================================
INSERT INTO care8_group_tasks (
  id,
  group_id,
  title,
  description,
  due_date,
  assigned_to,
  status,
  created_by,
  created_at,
  updated_at
)
SELECT 
  id,
  group_id,
  title,
  description,
  due_date,
  assigned_to,
  status,
  created_by,
  created_at,
  updated_at
FROM 
  care_group_tasks
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'care_group_tasks');

-- =====================================================
-- STEP 6: MIGRATE GROUP NOTES (IF EXIST)
-- =====================================================
INSERT INTO care8_group_notes (
  id,
  group_id,
  title,
  content,
  created_by,
  created_at,
  updated_at
)
SELECT 
  id,
  group_id,
  title,
  content,
  created_by,
  created_at,
  updated_at
FROM 
  care_group_notes
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'care_group_notes');

-- =====================================================
-- STEP 7: MIGRATE GROUP RESOURCES (IF EXIST)
-- =====================================================
INSERT INTO care8_group_resources (
  id,
  group_id,
  title,
  description,
  resource_url,
  resource_type,
  created_by,
  created_at
)
SELECT 
  id,
  group_id,
  title,
  description,
  resource_url,
  resource_type,
  created_by,
  created_at
FROM 
  care_group_resources
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'care_group_resources');

-- =====================================================
-- STEP 8: MIGRATE GROUP VOLUNTEERS (IF EXIST)
-- =====================================================
INSERT INTO care8_group_volunteers (
  id,
  group_id,
  title,
  description,
  start_time,
  end_time,
  location,
  max_volunteers,
  created_by,
  created_at,
  updated_at
)
SELECT 
  id,
  group_id,
  title,
  description,
  start_time,
  end_time,
  location,
  max_volunteers,
  created_by,
  created_at,
  updated_at
FROM 
  care_group_volunteers
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'care_group_volunteers'); 