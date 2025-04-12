
import { createClient } from '@supabase/supabase-js';

// Add environment variable validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase URL or Anon Key. Make sure you have the environment variables set.");
}

// Create the client
export const supabase = createClient(
  supabaseUrl || "https://example.supabase.co",
  supabaseAnonKey || "fallback-key-for-development-only"
);
