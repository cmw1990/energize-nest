-- =====================================================
-- DATA MIGRATION SCRIPT
-- Moves data from old care tables to new care8 tables
-- =====================================================

-- =====================================================
-- STEP 1: MIGRATE GROUPS
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'care_groups') THEN
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
      care_groups;
    
    RAISE NOTICE 'Migrated % rows from care_groups to care8_groups', 
      (SELECT count(*) FROM care8_groups);
  ELSE
    RAISE NOTICE 'Table care_groups does not exist, skipping migration.';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error migrating care_groups: %', SQLERRM;
END $$;

-- =====================================================
-- STEP 2: MIGRATE GROUP MEMBERS
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'care_group_members') THEN
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
      care_group_members;
    
    RAISE NOTICE 'Migrated % rows from care_group_members to care8_group_members', 
      (SELECT count(*) FROM care8_group_members);
  ELSE
    RAISE NOTICE 'Table care_group_members does not exist, skipping migration.';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error migrating care_group_members: %', SQLERRM;
END $$;

-- =====================================================
-- STEP 3: MIGRATE GROUP INVITATIONS
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'care_group_invitations') THEN
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
      care_group_invitations;
    
    RAISE NOTICE 'Migrated % rows from care_group_invitations to care8_group_invitations', 
      (SELECT count(*) FROM care8_group_invitations);
  ELSE
    RAISE NOTICE 'Table care_group_invitations does not exist, skipping migration.';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error migrating care_group_invitations: %', SQLERRM;
END $$;

-- =====================================================
-- STEP 4: MIGRATE GROUP EVENTS (IF EXIST)
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'care_group_events') THEN
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
      care_group_events;
    
    RAISE NOTICE 'Migrated % rows from care_group_events to care8_group_events', 
      (SELECT count(*) FROM care8_group_events);
  ELSE
    RAISE NOTICE 'Table care_group_events does not exist, skipping migration.';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error migrating care_group_events: %', SQLERRM;
END $$;

-- =====================================================
-- STEP 5: MIGRATE GROUP TASKS (IF EXIST)
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'care_group_tasks') THEN
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
      care_group_tasks;
    
    RAISE NOTICE 'Migrated % rows from care_group_tasks to care8_group_tasks', 
      (SELECT count(*) FROM care8_group_tasks);
  ELSE
    RAISE NOTICE 'Table care_group_tasks does not exist, skipping migration.';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error migrating care_group_tasks: %', SQLERRM;
END $$;

-- =====================================================
-- STEP 6: MIGRATE GROUP NOTES (IF EXIST)
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'care_group_notes') THEN
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
      care_group_notes;
    
    RAISE NOTICE 'Migrated % rows from care_group_notes to care8_group_notes', 
      (SELECT count(*) FROM care8_group_notes);
  ELSE
    RAISE NOTICE 'Table care_group_notes does not exist, skipping migration.';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error migrating care_group_notes: %', SQLERRM;
END $$;

-- =====================================================
-- STEP 7: MIGRATE GROUP RESOURCES (IF EXIST)
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'care_group_resources') THEN
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
      care_group_resources;
    
    RAISE NOTICE 'Migrated % rows from care_group_resources to care8_group_resources', 
      (SELECT count(*) FROM care8_group_resources);
  ELSE
    RAISE NOTICE 'Table care_group_resources does not exist, skipping migration.';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error migrating care_group_resources: %', SQLERRM;
END $$;

-- =====================================================
-- STEP 8: MIGRATE GROUP VOLUNTEERS (IF EXIST)
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'care_group_volunteers') THEN
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
      care_group_volunteers;
    
    RAISE NOTICE 'Migrated % rows from care_group_volunteers to care8_group_volunteers', 
      (SELECT count(*) FROM care8_group_volunteers);
  ELSE
    RAISE NOTICE 'Table care_group_volunteers does not exist, skipping migration.';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error migrating care_group_volunteers: %', SQLERRM;
END $$; 