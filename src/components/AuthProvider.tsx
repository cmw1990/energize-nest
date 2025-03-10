import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/integrations/supabase/rest-api";
import { rpc } from "@/lib/db";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  loading: true,
  userRole: null,
  signIn: async () => {},
  signOut: async () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  // Fetch user role
  const { data: roleData } = useQuery({
    queryKey: ['user-role', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      try {
        const { data, error } = await rpc('get_user_role', {
          user_id: session.user.id
        });

        if (error) {
          console.log('Error fetching user role:', error);
          // Return a default role if the endpoint is missing
          return { role: 'user' };
        }
        return data;
      } catch (error) {
        console.log('Exception fetching user role:', error);
        // Return a default role if the endpoint is missing
        return { role: 'user' };
      }
    },
    enabled: !!session?.user?.id
  });

  // Create or update user settings on authentication
  const initializeUserSettings = async (userId: string) => {
    try {
      // Try to get user settings, but don't throw if 404
      try {
        const { data: existingSettings, error: fetchError } = await rpc('get_user_settings', {
          user_id: userId
        });

        if (fetchError) {
          console.log('Error fetching user settings:', fetchError);
          return; // Exit early, don't try to initialize if endpoint is missing
        }

        if (!existingSettings) {
          try {
            const { error: insertError } = await rpc('initialize_user_settings', {
              user_id: userId,
              settings: {
                theme: 'light',
                notifications_enabled: true,
                updated_at: new Date().toISOString()
              }
            });

            if (insertError) {
              console.log('Error initializing user settings:', insertError);
              // Don't show error toast for 404 errors
              if (insertError.code !== '404') {
                toast({
                  title: "Settings Error",
                  description: "Could not initialize user settings. Some features may be limited.",
                  variant: "destructive",
                });
              }
            }
          } catch (insertErr) {
            console.log('Exception initializing user settings:', insertErr);
            // Silently handle this error
          }
        }
      } catch (fetchErr) {
        console.log('Exception fetching user settings:', fetchErr);
        // Silently handle this error
      }
    } catch (error) {
      console.log('Top-level exception in initializeUserSettings:', error);
      // Silently handle this error
    }
  };

  useEffect(() => {
    if (roleData) {
      setUserRole(roleData.role);
    }
  }, [roleData]);

  useEffect(() => {
    // Get initial session
    const token = getSessionToken();
    if (token) {
      auth.getUser(token).then(({ data }) => {
        if (data) {
          setSession({ user: data, access_token: token } as Session);
          initializeUserSettings(data.id);
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    // Set up interval to check token validity
    const interval = setInterval(async () => {
      const token = getSessionToken();
      if (token) {
        const { data } = await auth.getUser(token);
        if (!data) {
          // Token is invalid, sign out
          localStorage.removeItem('supabase.auth.token');
          setSession(null);
        }
      }
    }, 60000); // Check every minute

    return () => {
      clearInterval(interval);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await auth.signIn(email, password);

      if (error) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: error.message,
        });
        throw error;
      }

      if (data?.access_token) {
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          currentSession: data
        }));
        const { data: userData } = await auth.getUser(data.access_token);
        if (userData) {
          setSession({ user: userData, access_token: data.access_token } as Session);
          await initializeUserSettings(userData.id);
          navigate("/webapp/dashboard");
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const token = getSessionToken();
      if (token) {
        const { error } = await auth.signOut(token);
        if (error) throw error;
      }
      localStorage.removeItem('supabase.auth.token');
      setSession(null);
      navigate("/");
    } catch (error) {
      throw error;
    }
  };

  const contextValue = {
    session,
    loading,
    userRole,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      <Toaster />
    </AuthContext.Provider>
  );
};
