/**
 * This file is a compatibility layer for old imports that use './supabase'
 * It ensures all Supabase interactions use direct REST API calls.
 */

// Re-export everything from the REST API client
export * from '@/integrations/supabase/rest-api';
export * from '@/integrations/supabase/db-client';

// Export the supabase compatibility object
import { supabase } from '@/integrations/supabase/client';
export { supabase }; 