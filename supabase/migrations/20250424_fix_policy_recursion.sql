-- Fix infinite recursion in RLS policies for care_group_members table

-- First, drop all policies that might be causing the recursion
DROP POLICY IF EXISTS "Creators can manage group memberships" ON public.care_group_members;
DROP POLICY IF EXISTS "Members can view their groups" ON public.care_groups;
DROP POLICY IF EXISTS "Group creators can manage their groups" ON public.care_groups;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.care_group_members;
DROP POLICY IF EXISTS "Group owners can manage memberships" ON public.care_group_members;
DROP POLICY IF EXISTS "Anyone can view public groups" ON public.care_groups;

-- Make sure RLS is enabled on the tables
ALTER TABLE IF EXISTS public.care_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.care_group_members ENABLE ROW LEVEL SECURITY;

-- Create simplified policies for care_groups table that avoid circular references
CREATE POLICY "Anyone can view public groups" ON public.care_groups
    FOR SELECT USING (is_public = true);

CREATE POLICY "Group creators can view and manage their groups" ON public.care_groups
    FOR ALL USING (created_by = auth.uid());

-- Create a policy for members to view their groups
CREATE POLICY "Members can view their groups" ON public.care_groups
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM care_group_members 
            WHERE care_group_members.group_id = care_groups.id 
            AND care_group_members.user_id = auth.uid()
        )
    );

-- Create policies for care_group_members that don't reference RLS on care_groups

-- Members can view their own memberships
CREATE POLICY "Users can view their own memberships" ON public.care_group_members
    FOR SELECT USING (user_id = auth.uid());

-- Group creators can manage all memberships in their groups
-- Change to avoid circular reference by making the subquery NOT dependent on RLS
CREATE POLICY "Group creators can manage all memberships" ON public.care_group_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.care_groups
            WHERE care_groups.id = care_group_members.group_id
            AND care_groups.created_by = auth.uid()
        )
    );

-- Group owners can manage memberships for their groups
CREATE POLICY "Owners can manage group memberships" ON public.care_group_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.care_group_members AS owners
            WHERE owners.group_id = care_group_members.group_id
            AND owners.user_id = auth.uid()
            AND owners.role = 'owner'
        )
    );

-- Allow service role to manage all memberships (for admin functions)
CREATE POLICY "Service role can manage all memberships" ON public.care_group_members
    FOR ALL USING (auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'service_role');

-- Allow service role to manage all groups (for admin functions)
CREATE POLICY "Service role can manage all groups" ON public.care_groups
    FOR ALL USING (auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'service_role');

-- Create helper functions that don't rely on RLS
CREATE OR REPLACE FUNCTION public.get_user_care_group_memberships(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    group_id UUID,
    user_id UUID,
    role TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    invited_by UUID
)
LANGUAGE SQL SECURITY DEFINER SET search_path = public
AS $$
    SELECT m.*
    FROM care_group_members m
    WHERE m.user_id = COALESCE(p_user_id, auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.get_public_care_groups()
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    is_public BOOLEAN,
    created_at TIMESTAMPTZ,
    created_by UUID,
    updated_at TIMESTAMPTZ,
    image_url TEXT
)
LANGUAGE SQL SECURITY DEFINER SET search_path = public
AS $$
    SELECT g.*
    FROM care_groups g
    WHERE g.is_public = true;
$$;
