import { SUPABASE_URL, SUPABASE_KEY } from './db-client';

// Helper for making Supabase REST API calls
const supabaseRestCall = async (endpoint: string, options: RequestInit = {}, session?: { access_token: string } | null) => {
  const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${session?.access_token || SUPABASE_KEY}`,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || response.statusText);
  }

  return await response.json();
};

// Create a supabase client-like interface that actually uses REST API
export const supabase = {
  auth: {
    getSession: async () => {
      try {
        const token = localStorage.getItem('supabase.auth.token');
        
        // Try to use token from localStorage if available
        if (token) {
          const parsedToken = JSON.parse(token);
          const accessToken = parsedToken?.currentSession?.access_token;
          
          if (accessToken) {
            const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
              headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${accessToken}`
              }
            });
            
            if (response.ok) {
              const user = await response.json();
              return { 
                data: { 
                  session: { 
                    user,
                    access_token: accessToken,
                    expires_at: parsedToken?.currentSession?.expires_at,
                    refresh_token: parsedToken?.currentSession?.refresh_token
                  } 
                }, 
                error: null 
              };
            }
          }
        }
        
        // Fallback to direct API call
        console.log('No stored token found, returning null session');
        return { data: { session: null }, error: null };
      } catch (error) {
        console.error('Error getting session:', error);
        return { data: { session: null }, error };
      }
    },
    // Add auth state change method to provide compatibility with existing components
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Since we're using REST API, we can't use real-time subscriptions
      // Instead, we'll create a mock subscription object that can be unsubscribed
      console.log('Auth state change subscription created (REST API compatibility mode)');
      
      // Check the initial session immediately
      (async () => {
        try {
          const { data } = await supabase.auth.getSession();
          callback('INITIAL', data.session);
        } catch (error) {
          console.error('Error in initial auth check:', error);
        }
      })();
      
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              console.log('Auth state subscription unsubscribed');
            }
          }
        }
      };
    },
    signOut: async () => {
      try {
        await signOut();
        // Clear local storage auth data
        localStorage.removeItem('supabase.auth.token');
        return { error: null };
      } catch (error) {
        return { error };
      }
    }
  }
};

// Helper to get user ID from response
const getUserId = (user: { id: string } | null): string => {
  if (!user) throw new Error('User not authenticated');
  return user.id;
};

// Helper to get session token
const getSessionToken = async (): Promise<string | null> => {
  try {
    const token = localStorage.getItem('supabase.auth.token');
    if (token) {
      const parsedToken = JSON.parse(token);
      return parsedToken?.currentSession?.access_token || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting session token:', error);
    return null;
  }
};

// Helper to sign in with email
const signInWithEmail = async (email: string, password: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    const data = await response.json();
    
    // Store the session in localStorage for later use
    if (data.access_token) {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: new Date().getTime() + (data.expires_in * 1000)
        }
      }));
    }

    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Helper to sign up with email
const signUpWithEmail = async (email: string, password: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Helper to sign out
const signOut = async () => {
  try {
    const token = await getSessionToken();
    
    if (!token) {
      localStorage.removeItem('supabase.auth.token');
      return true;
    }
    
    const response = await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${token}`
      }
    });

    // Clear localStorage even if response is not ok
    localStorage.removeItem('supabase.auth.token');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    // Clear localStorage even if there's an error
    localStorage.removeItem('supabase.auth.token');
    throw error;
  }
};

// Helper to reset password
const resetPassword = async (email: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Helper to update user
const updateUser = async (user: { id: string }, updates: any, session?: { access_token: string } | null) => {
  try {
    const token = session?.access_token || await getSessionToken();
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Helper to get user
const getUser = async (session?: { access_token: string } | null) => {
  try {
    const token = session?.access_token || await getSessionToken();
    
    if (!token) {
      return null;
    }
    
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export {
  supabaseRestCall,
  getUserId,
  getSessionToken,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  resetPassword,
  updateUser,
  getUser
}; 