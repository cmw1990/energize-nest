import React, { useEffect, useState } from 'react';
import { getSession } from '@/integrations/supabase/auth-client';

// Define a simplified session type that's compatible with what we receive
interface SimpleSession {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user: {
    id: string;
    email?: string;
    [key: string]: any;
  };
}

interface AuthStateManagerProps {
  children: React.ReactNode;
}

/**
 * AuthStateManager is a component that handles authentication state for sub-apps
 * It provides a consistent authentication state across all sub-apps
 */
export const AuthStateManager: React.FC<AuthStateManagerProps> = ({ children }) => {
  const [session, setSession] = useState<SimpleSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const checkAuth = async () => {
      try {
        const storedSession = localStorage.getItem('supabase.auth.token');
        if (storedSession) {
          try {
            const { currentSession } = JSON.parse(storedSession);
            
            // Validate the token by getting the session
            const sessionData = await getSession();
            if (sessionData) {
              console.log('Auth state manager: Valid session found');
              setSession(sessionData as SimpleSession);
            } else {
              console.log('Auth state manager: Invalid session token');
              setSession(null);
            }
          } catch (e) {
            console.error('Auth state manager: Error parsing token:', e);
            localStorage.removeItem('supabase.auth.token');
            setSession(null);
          }
        } else {
          console.log('Auth state manager: No session token found');
          setSession(null);
        }
      } catch (err) {
        console.error('Auth state manager: Error checking auth:', err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up an event listener for auth state changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'supabase.auth.token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Clone children with session prop
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Use type assertion to bypass the TypeScript error
      return React.cloneElement(child as any, { session });
    }
    return child;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        <span className="ml-2">Loading authentication...</span>
      </div>
    );
  }

  return <>{childrenWithProps}</>;
}; 