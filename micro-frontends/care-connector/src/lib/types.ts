/**
 * Type definitions for the Care Connector application
 */

/**
 * Session type definition that matches Supabase's Session type
 * This allows us to avoid direct imports from @supabase/supabase-js
 */
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: {
    id: string;
    email?: string;
    phone?: string;
    app_metadata: {
      provider?: string;
      [key: string]: any;
    };
    user_metadata: {
      [key: string]: any;
    };
    aud: string;
    created_at: string;
  };
} 