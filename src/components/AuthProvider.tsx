import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useQuery } from "@tanstack/react-query";

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
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch user role
  const { data: roleData } = useQuery({
    queryKey: ['user-role', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  // Create or update user settings on authentication
  const initializeUserSettings = async (userId: string) => {
    try {
      // First check if user settings exist
      const { data: existingSettings, error: fetchError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user settings:', fetchError);
        return;
      }

      if (!existingSettings) {
        // Create new settings if they don't exist
        const { error: insertError } = await supabase
          .from('user_settings')
          .insert({
            user_id: userId,
            theme: 'light',
            notifications_enabled: true,
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error creating user settings:', insertError);
          toast({
            title: "Settings Error",
            description: "Could not initialize user settings. Some features may be limited.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error in initializeUserSettings:', error);
    }
  };

  useEffect(() => {
    if (roleData) {
      setUserRole(roleData.role);
    }
  }, [roleData]);

  useEffect(() => {
    console.log('AuthProvider: Starting session initialization');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Got initial session', { hasSession: !!session });
      if (session?.user) {
        setSession(session);
        initializeUserSettings(session.user.id);
      }
      setLoading(false);
    }).catch(error => {
      console.error('AuthProvider: Error getting session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('AuthProvider: Auth state changed', { event: _event, hasSession: !!session });
      if (session?.user) {
        setSession(session);
        await initializeUserSettings(session.user.id);
      } else {
        setSession(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: error.message,
        });
        throw error;
      }

      if (data?.user) {
        navigate("/webapp/dashboard");
      }
    } catch (error) {
      console.error("SignIn error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error("SignOut error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, userRole, signIn, signOut }}>
      {children}
      <Toaster />
    </AuthContext.Provider>
  );
};
