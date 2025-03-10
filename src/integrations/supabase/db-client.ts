// Constants for Supabase configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Re-export the REST API client
export * from './rest-api';

// Export types
export * from './types';
export * from './care-connector-types';

// Helper for making Supabase REST API calls
export const supabaseRestCall = async (endpoint: string, options: RequestInit = {}, session?: { access_token: string } | null) => {
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

// Helper to get user ID from response
export const getUserId = (user: { id: string } | null): string => {
  if (!user) throw new Error('User not authenticated');
  return user.id;
};

// Helper to get session token
export const getSessionToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/session`, {
      headers: {
        'apikey': SUPABASE_KEY
      }
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.access_token || null;
  } catch (error) {
    console.error('Error getting session token:', error);
    return null;
  }
};

// Helper to sign in with email
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
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Helper to sign up with email
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
export const signOut = async () => {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Helper to reset password
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
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Export executeSql function
export const executeSql = async (query: string, params: any[] = [], session?: { access_token: string } | null) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${session?.access_token || SUPABASE_KEY}`
      },
      body: JSON.stringify({
        query,
        params
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error executing SQL:', error);
    throw error;
  }
};

// Export dbClient and careConnector interfaces to maintain compatibility
export const dbClient = {
  // Generic function to query any table
  getFromTable: async (tableName: string, options: { 
    columns?: string, 
    filters?: Record<string, any>,
    orderBy?: { column: string, ascending?: boolean },
    limit?: number,
    session?: { access_token: string } | null
  } = {}) => {
    const { columns = '*', filters = {}, orderBy, limit, session } = options;
    let url = `/rest/v1/${tableName}?select=${columns}`;
    
    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      url += `&${key}=eq.${value}`;
    });
    
    // Add ordering
    if (orderBy) {
      url += `&order=${orderBy.column}.${orderBy.ascending ? 'asc' : 'desc'}`;
    }
    
    // Add limit
    if (limit) {
      url += `&limit=${limit}`;
    }
    
    return await supabaseRestCall(url, {}, session);
  },
  
  // Insert data into a table
  insertIntoTable: async (tableName: string, data: any, session?: { access_token: string } | null) => {
    return await supabaseRestCall(`/rest/v1/${tableName}`, {
      method: 'POST',
      body: JSON.stringify(data)
    }, session);
  },
  
  // Update data in a table
  updateInTable: async (tableName: string, data: any, filters: Record<string, any>, session?: { access_token: string } | null) => {
    let url = `/rest/v1/${tableName}`;
    
    // Add filters
    const filterParams = Object.entries(filters).map(([key, value]) => `${key}=eq.${value}`).join('&');
    if (filterParams) {
      url += `?${filterParams}`;
    }
    
    return await supabaseRestCall(url, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }, session);
  },
  
  // Delete data from a table
  deleteFromTable: async (tableName: string, filters: Record<string, any>, session?: { access_token: string } | null) => {
    let url = `/rest/v1/${tableName}`;
    
    // Add filters
    const filterParams = Object.entries(filters).map(([key, value]) => `${key}=eq.${value}`).join('&');
    if (filterParams) {
      url += `?${filterParams}`;
    }
    
    return await supabaseRestCall(url, {
      method: 'DELETE'
    }, session);
  }
};

// Care connector specific functions
export const careConnector = {
  // Get groups for a user
  getGroups: async (userId: string, session?: { access_token: string } | null) => {
    return await supabaseRestCall(
      `/rest/v1/care_groups?or=(is_public.eq.true,id.in.(select group_id from care_group_members where user_id=eq.${userId}))`,
      {},
      session
    );
  },
  
  // Get group by ID
  getGroupById: async (groupId: string, session?: { access_token: string } | null) => {
    return await supabaseRestCall(
      `/rest/v1/care_groups?id=eq.${groupId}`,
      {},
      session
    );
  },
  
  // Create a new group
  createGroup: async (data: any, session?: { access_token: string } | null) => {
    return await supabaseRestCall(
      `/rest/v1/care_groups`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      },
      session
    );
  },
  
  // Join a group
  joinGroup: async (groupId: string, userId: string, role: string = 'member', session?: { access_token: string } | null) => {
    return await supabaseRestCall(
      `/rest/v1/care_group_members`,
      {
        method: 'POST',
        body: JSON.stringify({
          group_id: groupId,
          user_id: userId,
          role
        })
      },
      session
    );
  },
  
  // Get invitations for a user
  getInvitations: async (email: string, session?: { access_token: string } | null) => {
    return await supabaseRestCall(
      `/rest/v1/care_group_invitations?invited_email=eq.${email}&status=eq.pending`,
      {},
      session
    );
  }
};

// Helper to update user
export const updateUser = async (user: { id: string }, updates: any, session?: { access_token: string } | null) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${session?.access_token || SUPABASE_KEY}`
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
export const getUser = async (session?: { access_token: string } | null) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${session?.access_token || SUPABASE_KEY}`
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
