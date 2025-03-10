import { SUPABASE_URL, SUPABASE_KEY } from './db-client';

interface SupabaseHeaders {
  apikey: string;
  Authorization?: string;
  'Content-Type': string;
  Prefer?: string;
}

export interface SupabaseError {
  message: string;
  code?: string;
  details?: string;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
}

// Helper to get base headers
const getBaseHeaders = (token?: string): HeadersInit => {
  const headers: Record<string, string> = {
    apikey: SUPABASE_KEY,
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// Auth API
export const auth = {
  signUp: async (email: string, password: string): Promise<SupabaseResponse<any>> => {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: getBaseHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      return { data: response.ok ? data : null, error: response.ok ? null : data };
    } catch (error) {
      return { data: null, error: { message: String(error) } };
    }
  },

  signIn: async (email: string, password: string): Promise<SupabaseResponse<any>> => {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: getBaseHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        // Provide more specific error messages based on the response
        let errorMessage = 'Authentication failed';
        if (data?.error_description) {
          errorMessage = data.error_description;
        } else if (data?.msg) {
          errorMessage = data.msg;
        } else if (data?.message) {
          errorMessage = data.message;
        }
        
        return { 
          data: null, 
          error: { 
            message: errorMessage,
            code: response.status.toString(),
            details: JSON.stringify(data)
          } 
        };
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: String(error) } };
    }
  },

  signOut: async (token: string): Promise<SupabaseResponse<null>> => {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: getBaseHeaders(token),
      });
      return { data: null, error: response.ok ? null : await response.json() };
    } catch (error) {
      return { data: null, error: { message: String(error) } };
    }
  },

  getUser: async (token: string): Promise<SupabaseResponse<any>> => {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: getBaseHeaders(token),
      });
      const data = await response.json();
      return { data: response.ok ? data : null, error: response.ok ? null : data };
    } catch (error) {
      return { data: null, error: { message: String(error) } };
    }
  },

  resetPassword: async (email: string): Promise<SupabaseResponse<null>> => {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
        method: 'POST',
        headers: getBaseHeaders(),
        body: JSON.stringify({ email }),
      });
      return { data: null, error: response.ok ? null : await response.json() };
    } catch (error) {
      return { data: null, error: { message: String(error) } };
    }
  },

  updatePassword: async (token: string, password: string): Promise<SupabaseResponse<any>> => {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: 'PUT',
        headers: getBaseHeaders(token),
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      return { data: response.ok ? data : null, error: response.ok ? null : data };
    } catch (error) {
      return { data: null, error: { message: String(error) } };
    }
  },
};

// Database API
export const db = {
  from: (table: string) => ({
    select: async (columns: string = '*', token?: string): Promise<SupabaseResponse<any[]>> => {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${columns}`, {
          headers: getBaseHeaders(token),
        });
        const data = await response.json();
        return { data: response.ok ? data : null, error: response.ok ? null : data };
      } catch (error) {
        return { data: null, error: { message: String(error) } };
      }
    },

    insert: async (data: any, token?: string): Promise<SupabaseResponse<any>> => {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
          method: 'POST',
          headers: { ...getBaseHeaders(token), Prefer: 'return=representation' },
          body: JSON.stringify(data),
        });
        const responseData = await response.json();
        return { data: response.ok ? responseData : null, error: response.ok ? null : responseData };
      } catch (error) {
        return { data: null, error: { message: String(error) } };
      }
    },

    update: async (data: any, match: Record<string, any>, token?: string): Promise<SupabaseResponse<any>> => {
      try {
        const conditions = Object.entries(match)
          .map(([key, value]) => `${key}=eq.${value}`)
          .join(',');
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${conditions}`, {
          method: 'PATCH',
          headers: { ...getBaseHeaders(token), Prefer: 'return=representation' },
          body: JSON.stringify(data),
        });
        const responseData = await response.json();
        return { data: response.ok ? responseData : null, error: response.ok ? null : responseData };
      } catch (error) {
        return { data: null, error: { message: String(error) } };
      }
    },

    delete: async (match: Record<string, any>, token?: string): Promise<SupabaseResponse<any>> => {
      try {
        const conditions = Object.entries(match)
          .map(([key, value]) => `${key}=eq.${value}`)
          .join(',');
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${conditions}`, {
          method: 'DELETE',
          headers: { ...getBaseHeaders(token), Prefer: 'return=representation' },
        });
        const data = await response.json();
        return { data: response.ok ? data : null, error: response.ok ? null : data };
      } catch (error) {
        return { data: null, error: { message: String(error) } };
      }
    },
  }),

  rpc: async (functionName: string, params: any = {}, token?: string): Promise<SupabaseResponse<any>> => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
        method: 'POST',
        headers: getBaseHeaders(token),
        body: JSON.stringify(params),
      });
      const data = await response.json();
      return { data: response.ok ? data : null, error: response.ok ? null : data };
    } catch (error) {
      return { data: null, error: { message: String(error) } };
    }
  },
}; 