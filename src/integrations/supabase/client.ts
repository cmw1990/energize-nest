
import { createClient } from '@supabase/supabase-js';

// Add environment variable validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase URL or Anon Key. Make sure you have the environment variables set.");
}

// Create the client with improved error handling
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Test connection to verify configuration
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('user_settings').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (e) {
    console.error('Supabase connection error:', e);
    return { success: false, error: e };
  }
};
