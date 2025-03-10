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
    try {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    } catch (e) {
      throw new Error(`API Error: ${response.statusText}`);
    }
  }

  return await response.json();
};

// Sign in with email
export const signInWithEmail = async (email: string, password: string) => {
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
      try {
        const error = await response.json();
        throw new Error(error.message || response.statusText);
      } catch (e) {
        throw new Error(`API Error: ${response.statusText}`);
      }
    }

    const data = await response.json();
    
    // Store auth data in localStorage
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

// Sign up with email
export const signUpWithEmail = async (email: string, password: string) => {
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
      try {
        const error = await response.json();
        throw new Error(error.message || response.statusText);
      } catch (e) {
        throw new Error(`API Error: ${response.statusText}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
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

    // Clear localStorage even if there's an error
    localStorage.removeItem('supabase.auth.token');

    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.message || response.statusText);
      } catch (e) {
        throw new Error(`API Error: ${response.statusText}`);
      }
    }

    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    // Ensure localStorage is cleared even on error
    localStorage.removeItem('supabase.auth.token');
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
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
      try {
        const error = await response.json();
        throw new Error(error.message || response.statusText);
      } catch (e) {
        throw new Error(`API Error: ${response.statusText}`);
      }
    }

    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Update user
export const updateUser = async (user: { id: string }, updates: any, session?: { access_token: string } | null) => {
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
      try {
        const error = await response.json();
        throw new Error(error.message || response.statusText);
      } catch (e) {
        throw new Error(`API Error: ${response.statusText}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Get user
export const getUser = async (session?: { access_token: string } | null) => {
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
      try {
        const error = await response.json();
        throw new Error(error.message || response.statusText);
      } catch (e) {
        throw new Error(`API Error: ${response.statusText}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Get session
export const getSession = async () => {
  try {
    const token = localStorage.getItem('supabase.auth.token');
    
    if (token) {
      const parsedToken = JSON.parse(token);
      const accessToken = parsedToken?.currentSession?.access_token;
      
      if (accessToken) {
        // Get user data
        const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          return {
            access_token: accessToken,
            refresh_token: parsedToken?.currentSession?.refresh_token,
            expires_at: parsedToken?.currentSession?.expires_at,
            user: userData
          };
        }
      }
    }
    
    console.log('No valid session found');
    return null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Helper to get session token
export const getSessionToken = async (): Promise<string | null> => {
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

// Refresh session
export const refreshSession = async (refreshToken: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.message || response.statusText);
      } catch (e) {
        throw new Error(`API Error: ${response.statusText}`);
      }
    }

    const data = await response.json();
    
    // Update stored session
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
    console.error('Error refreshing session:', error);
    throw error;
  }
};

// Set session
export const setSession = async (access_token: string, refresh_token: string) => {
  try {
    // Store session in localStorage
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      currentSession: {
        access_token,
        refresh_token,
        expires_at: new Date().getTime() + (3600 * 1000) // default 1 hour expiry
      }
    }));
    
    // Validate the token by getting user data
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${access_token}`
      }
    });

    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.message || response.statusText);
      } catch (e) {
        throw new Error(`API Error: ${response.statusText}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Error setting session:', error);
    throw error;
  }
}; 