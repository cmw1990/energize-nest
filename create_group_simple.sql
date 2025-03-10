CREATE OR REPLACE FUNCTION create_group_simple(
  name_param TEXT,
  description_param TEXT,
  is_public_param BOOLEAN,
  user_id_param UUID
) RETURNS UUID AS $$
DECLARE
  new_group_id UUID;
BEGIN
  -- Insert the new group
  INSERT INTO care_groups (name, description, is_public, created_by)
  VALUES (name_param, description_param, is_public_param, user_id_param)
  RETURNING id INTO new_group_id;
  
  -- Add the creator as an owner
  INSERT INTO care_group_members (group_id, user_id, role)
  VALUES (new_group_id, user_id_param, 'owner');
  
  RETURN new_group_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 