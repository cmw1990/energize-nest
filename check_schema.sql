-- Check schema of all tables
SELECT 
  table_name, 
  column_name, 
  data_type
FROM 
  information_schema.columns
WHERE 
  table_schema = 'public' 
  AND table_name IN ('care_groups', 'care_group_members', 'care_group_invitations')
ORDER BY 
  table_name, 
  ordinal_position; 