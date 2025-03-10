import { SUPABASE_URL, SUPABASE_KEY } from './db-client';

// Helper to get session token from localStorage
const getSessionToken = () => {
  const storedSession = localStorage.getItem('supabase.auth.token');
  if (!storedSession) return null;
  try {
    const { currentSession } = JSON.parse(storedSession);
    return currentSession?.access_token;
  } catch {
    return null;
  }
};

/**
 * Test function to verify Supabase connection and database access
 * This can be called from anywhere to test the connection
 */
export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}> => {
  try {
    // Test SELECT query to a simple table
    const response = await fetch(`${SUPABASE_URL}/rest/v1/distraction_blocking?select=count`, {
      method: 'HEAD',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'count=exact'
      }
    });

    if (!response.ok) {
      console.error('Supabase connection test failed:', response.status);
      
      // Try to get more specific error information
      let errorMessage = 'Database connection failed';
      
      if (response.status === 404) {
        errorMessage = 'Table does not exist. Schema may need initialization.';
      } else if (response.status === 401) {
        errorMessage = 'Invalid authentication credentials.';
      } else if (response.status === 403) {
        errorMessage = 'JWT verification failed. User may not be authenticated.';
      } else {
        try {
          const error = await response.json();
          if (error.message) {
            errorMessage = error.message;
          }
        } catch {}
      }
      
      return { 
        success: false, 
        message: errorMessage,
        error: { status: response.status } 
      };
    }

    const count = response.headers.get('content-range')?.split('/')[1] || '0';
    console.log('Supabase connection successful:', { count });
    
    // If we get here, the connection is working
    return { 
      success: true, 
      message: 'Successfully connected to Supabase database',
      data: { count: parseInt(count, 10) }
    };
  } catch (err) {
    console.error('Unexpected error testing Supabase connection:', err);
    return { 
      success: false, 
      message: err instanceof Error ? err.message : 'Unknown error occurred',
      error: err 
    };
  }
};

/**
 * Initialize the distraction_blocking table if it doesn't exist
 * This should be called during app initialization
 */
export const initializeBlockingTables = async (): Promise<{
  success: boolean;
  message: string;
  tablesModified?: boolean;
}> => {
  try {
    const token = getSessionToken();
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/create_blocking_tables_if_not_exist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to initialize blocking tables:', errorData);
      return {
        success: false,
        message: `Table initialization failed: ${JSON.stringify(errorData)}`
      };
    }
    
    const data = await response.json();
    const tablesModified = data?.tables_modified === true;
    
    return {
      success: true,
      message: data?.message || 'Blocking tables initialized successfully',
      tablesModified
    };
  } catch (err) {
    console.error('Error initializing blocking tables:', err);
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Unknown error occurred'
    };
  }
};

// Add default function to run the initialization
// This won't actually execute until called elsewhere
export const checkAndCreateTables = async () => {
  const { success, message } = await testSupabaseConnection();
  
  if (!success) {
    console.error('Database connection test failed:', message);
    return { success, message };
  }
  
  // Initialize tables
  return await initializeBlockingTables();
}; 