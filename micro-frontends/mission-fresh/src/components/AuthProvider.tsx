import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: any | null;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
  user: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a micro-frontend, the session would typically be provided by the host application
    // This is a simplified implementation for standalone use
    const checkSession = async () => {
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Implementation would connect to host app's auth system
    console.log('Sign in with', email, password);
  };

  const signOut = async () => {
    // Implementation would connect to host app's auth system
    console.log('Sign out');
  };

  const value = {
    session,
    isLoading,
    signIn,
    signOut,
    user: session?.user || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 