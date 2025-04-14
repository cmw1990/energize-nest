-- Migration script for creating the weight_logs table

CREATE TABLE public.weight_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    log_date date NOT NULL DEFAULT CURRENT_DATE, -- The date the weight was recorded for
    weight_kg numeric(5,2) NOT NULL, -- Weight in kilograms, allowing up to 999.99
    notes text NULL -- Optional notes for the entry
);

-- Add indexes for faster querying
CREATE INDEX idx_weight_logs_user_id_log_date ON public.weight_logs(user_id, log_date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;

-- Policies for RLS
-- Allow users to insert their own weight logs
CREATE POLICY "Allow users to insert their own weight logs"
ON public.weight_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to select their own weight logs
CREATE POLICY "Allow users to select their own weight logs"
ON public.weight_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to update their own weight logs
CREATE POLICY "Allow users to update their own weight logs"
ON public.weight_logs
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own weight logs
CREATE POLICY "Allow users to delete their own weight logs"
ON public.weight_logs
FOR DELETE
USING (auth.uid() = user_id);

-- Add comments to the table and columns
COMMENT ON TABLE public.weight_logs IS 'Stores user weight entries over time.';
COMMENT ON COLUMN public.weight_logs.log_date IS 'The specific date the weight measurement corresponds to.';
COMMENT ON COLUMN public.weight_logs.weight_kg IS 'User''s weight recorded in kilograms.';

-- Grant usage permissions
GRANT ALL ON TABLE public.weight_logs TO supabase_admin; -- Or your specific roles
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.weight_logs TO authenticated; 
-- Grant usage on the sequence if using serial instead of uuid
-- GRANT USAGE, SELECT ON SEQUENCE weight_logs_id_seq TO authenticated;