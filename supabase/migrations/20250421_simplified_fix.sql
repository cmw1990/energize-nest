-- First check if the user_settings table has the required columns
DO $$
BEGIN
    -- Add theme column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_settings' AND column_name = 'theme'
    ) THEN
        ALTER TABLE public.user_settings ADD COLUMN theme TEXT DEFAULT 'light';
    END IF;

    -- Add notifications_enabled column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_settings' AND column_name = 'notifications_enabled'
    ) THEN
        ALTER TABLE public.user_settings ADD COLUMN notifications_enabled BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Make sure RLS is enabled on relevant tables
ALTER TABLE IF EXISTS public.care_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.care_group_members ENABLE ROW LEVEL SECURITY;

-- Safely drop policies if they exist
DO $$
DECLARE
    policy_exists boolean;
BEGIN
    -- Check and drop care_groups policies
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'care_groups' AND policyname = 'Members can view their groups'
    ) INTO policy_exists;
    
    IF policy_exists THEN
        EXECUTE 'DROP POLICY "Members can view their groups" ON public.care_groups';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'care_groups' AND policyname = 'Anyone can view public groups'
    ) INTO policy_exists;
    
    IF policy_exists THEN
        EXECUTE 'DROP POLICY "Anyone can view public groups" ON public.care_groups';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'care_groups' AND policyname = 'Creators can manage their groups'
    ) INTO policy_exists;
    
    IF policy_exists THEN
        EXECUTE 'DROP POLICY "Creators can manage their groups" ON public.care_groups';
    END IF;

    -- Check and drop care_group_members policies
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'care_group_members' AND policyname = 'Users can view their own memberships'
    ) INTO policy_exists;
    
    IF policy_exists THEN
        EXECUTE 'DROP POLICY "Users can view their own memberships" ON public.care_group_members';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'care_group_members' AND policyname = 'Creators can manage group memberships'
    ) INTO policy_exists;
    
    IF policy_exists THEN
        EXECUTE 'DROP POLICY "Creators can manage group memberships" ON public.care_group_members';
    END IF;
END $$;

-- Create policies
CREATE POLICY "Anyone can view public groups" ON public.care_groups
    FOR SELECT USING (is_public = true);

CREATE POLICY "Members can view their groups" ON public.care_groups
    FOR SELECT USING (
        id IN (
            SELECT group_id FROM public.care_group_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Creators can manage their groups" ON public.care_groups
    FOR ALL USING (creator_id = auth.uid());

CREATE POLICY "Users can view their own memberships" ON public.care_group_members
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Creators can manage group memberships" ON public.care_group_members
    FOR ALL USING (
        group_id IN (
            SELECT id FROM public.care_groups
            WHERE creator_id = auth.uid()
        )
    );

-- Create or replace functions - this will overwrite existing ones
CREATE OR REPLACE FUNCTION public.get_user_settings(user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_settings_record JSONB;
BEGIN
    -- Check if the user is authenticated
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Users can only get their own settings
    IF auth.uid() <> get_user_settings.user_id THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- Query user settings with proper column qualification
    SELECT 
        jsonb_build_object(
            'id', settings.id,
            'user_id', settings.user_id,
            'theme', settings.theme,
            'notifications_enabled', settings.notifications_enabled,
            'created_at', settings.created_at,
            'updated_at', settings.updated_at
        ) INTO user_settings_record
    FROM 
        public.user_settings settings
    WHERE 
        settings.user_id = get_user_settings.user_id;

    IF user_settings_record IS NULL THEN
        RETURN jsonb_build_object('exists', false);
    ELSE
        RETURN jsonb_build_object('exists', true, 'settings', user_settings_record);
    END IF;
END;
$$;

-- Create or replace the initialize_user_settings function
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
    -- Check if the user is authenticated
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Users can only initialize their own settings
    IF auth.uid() <> initialize_user_settings.user_id THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- Check if user settings already exist
    IF EXISTS (SELECT 1 FROM public.user_settings settings WHERE settings.user_id = initialize_user_settings.user_id) THEN
        -- Update existing settings
        UPDATE public.user_settings settings
        SET 
            theme = initialize_user_settings.theme,
            notifications_enabled = initialize_user_settings.notifications_enabled,
            updated_at = NOW()
        WHERE 
            settings.user_id = initialize_user_settings.user_id
        RETURNING id INTO user_settings_id;
        
        SELECT jsonb_build_object(
            'id', settings.id,
            'user_id', settings.user_id,
            'theme', settings.theme,
            'notifications_enabled', settings.notifications_enabled,
            'created_at', settings.created_at,
            'updated_at', settings.updated_at
        ) INTO result
        FROM public.user_settings settings
        WHERE settings.id = user_settings_id;
        
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
            'id', settings.id,
            'user_id', settings.user_id,
            'theme', settings.theme,
            'notifications_enabled', settings.notifications_enabled,
            'created_at', settings.created_at,
            'updated_at', settings.updated_at
        ) INTO result
        FROM public.user_settings settings
        WHERE settings.id = user_settings_id;
        
        RETURN jsonb_build_object('created', true, 'settings', result);
    END IF;
END;
$$;

-- Create get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if the user is authenticated
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Users can only get their own role
    IF auth.uid() <> get_user_role.user_id THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- Return a simple role for now
    RETURN jsonb_build_object('role', 'user');
END;
$$;
