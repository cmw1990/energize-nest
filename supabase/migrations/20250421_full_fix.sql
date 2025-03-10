-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can view public groups" ON care_groups;
DROP POLICY IF EXISTS "Group members can view their groups" ON care_groups;
DROP POLICY IF EXISTS "Group creators can view their created groups" ON care_groups;
DROP POLICY IF EXISTS "Group members can view their memberships" ON care_group_members;
DROP POLICY IF EXISTS "Group creators can view all memberships in their groups" ON care_group_members;
DROP POLICY IF EXISTS "Group creators can manage memberships" ON care_group_members;

-- Fix user_settings table and function issues
DO $$
BEGIN
    -- Check if theme column exists in user_settings, if not add it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_settings' 
        AND column_name = 'theme'
    ) THEN
        ALTER TABLE public.user_settings ADD COLUMN theme TEXT DEFAULT 'light';
    END IF;
    
    -- Check if notifications_enabled column exists in user_settings, if not add it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_settings' 
        AND column_name = 'notifications_enabled'
    ) THEN
        ALTER TABLE public.user_settings ADD COLUMN notifications_enabled BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Re-create get_user_settings function with proper schema
CREATE OR REPLACE FUNCTION public.get_user_settings(user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_settings_record JSONB;
BEGIN
    -- Check if session is authenticated
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- User can only get their own settings
    IF auth.uid() <> get_user_settings.user_id THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    SELECT 
        jsonb_build_object(
            'id', us.id,
            'user_id', us.user_id,
            'theme', us.theme,
            'notifications_enabled', us.notifications_enabled,
            'created_at', us.created_at,
            'updated_at', us.updated_at
        ) INTO user_settings_record
    FROM 
        public.user_settings us
    WHERE 
        us.user_id = get_user_settings.user_id;

    IF user_settings_record IS NULL THEN
        RETURN jsonb_build_object('exists', false);
    ELSE
        RETURN jsonb_build_object('exists', true, 'settings', user_settings_record);
    END IF;
END;
$$;

-- Re-create initialize_user_settings function with proper schema
CREATE OR REPLACE FUNCTION public.initialize_user_settings(
    user_id UUID,
    theme TEXT DEFAULT 'light',
    notifications_enabled BOOLEAN DEFAULT true
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_settings_id UUID;
    result JSONB;
BEGIN
    -- Check if session is authenticated
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- User can only initialize their own settings
    IF auth.uid() <> initialize_user_settings.user_id THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- Check if user settings already exist
    IF EXISTS (SELECT 1 FROM public.user_settings us WHERE us.user_id = initialize_user_settings.user_id) THEN
        -- Update existing settings
        UPDATE public.user_settings us
        SET 
            theme = initialize_user_settings.theme,
            notifications_enabled = initialize_user_settings.notifications_enabled,
            updated_at = NOW()
        WHERE 
            us.user_id = initialize_user_settings.user_id
        RETURNING id INTO user_settings_id;
        
        SELECT jsonb_build_object(
            'id', us.id,
            'user_id', us.user_id,
            'theme', us.theme,
            'notifications_enabled', us.notifications_enabled,
            'created_at', us.created_at,
            'updated_at', us.updated_at
        ) INTO result
        FROM public.user_settings us
        WHERE us.id = user_settings_id;
        
        RETURN jsonb_build_object('created', false, 'settings', result);
    ELSE
        -- Insert new settings
        INSERT INTO public.user_settings (
            user_id,
            theme,
            notifications_enabled
        )
        VALUES (
            initialize_user_settings.user_id,
            initialize_user_settings.theme,
            initialize_user_settings.notifications_enabled
        )
        RETURNING id INTO user_settings_id;
        
        SELECT jsonb_build_object(
            'id', us.id,
            'user_id', us.user_id,
            'theme', us.theme,
            'notifications_enabled', us.notifications_enabled,
            'created_at', us.created_at,
            'updated_at', us.updated_at
        ) INTO result
        FROM public.user_settings us
        WHERE us.id = user_settings_id;
        
        RETURN jsonb_build_object('created', true, 'settings', result);
    END IF;
END;
$$;

-- Create get_user_role function since it's being called by the frontend
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if session is authenticated
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- User can only get their own role
    IF auth.uid() <> get_user_role.user_id THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- Default role for now - you can enhance this based on your actual role logic
    RETURN 'user';
END;
$$;

-- Enable RLS on tables
ALTER TABLE care_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_group_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for care_groups
CREATE POLICY "Users can view public groups" 
ON care_groups 
FOR SELECT
USING (is_public = true);

CREATE POLICY "Group members can view their groups" 
ON care_groups 
FOR SELECT
USING (id IN (
    SELECT group_id 
    FROM care_group_members 
    WHERE user_id = auth.uid()
));

CREATE POLICY "Group creators can view their created groups" 
ON care_groups 
FOR ALL
USING (creator_id = auth.uid());

-- Create RLS policies for care_group_members
CREATE POLICY "Group members can view their memberships" 
ON care_group_members 
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Group creators can view all memberships in their groups" 
ON care_group_members 
FOR SELECT
USING (group_id IN (
    SELECT id 
    FROM care_groups 
    WHERE creator_id = auth.uid()
));

CREATE POLICY "Group creators can manage memberships" 
ON care_group_members 
FOR ALL
USING (group_id IN (
    SELECT id 
    FROM care_groups 
    WHERE creator_id = auth.uid()
));
