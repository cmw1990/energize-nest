import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { supabase } from '@/integrations/supabase/client'
import { getSession, signOut as signOutREST, getUser } from '@/integrations/supabase/auth-client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

// Helper to check if token is stored in localStorage
const hasStoredToken = (): boolean => {
  try {
    const token = localStorage.getItem('supabase.auth.token');
    if (!token) return false;
    
    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken?.currentSession?.access_token;
    
    // We only care if there's a token, not if it's expired
    // Tokens should only be removed on explicit sign out
    return !!accessToken;
  } catch (e) {
    console.error('Error checking token:', e);
    return false;
  }
}

export const AuthButton = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const checkSession = async () => {
      try {
        // First check if there's a token in localStorage
        if (hasStoredToken()) {
          const userData = await getUser();
          if (userData) {
            setUser(userData);
            setLoading(false);
            return;
          }
        }
        
        // No valid token, so log user out
        setUser(null);
        setLoading(false);
      } catch (error) {
        console.error('Error getting session:', error);
        setUser(null);
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Set up event listeners for auth changes
    const handleStorageChange = () => {
      // When localStorage changes (e.g., login/logout in another tab)
      checkSession();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      // Try both methods to ensure sign-out works
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.log('Using REST signOut fallback');
        await signOutREST();
      }
      
      // Directly remove from localStorage to ensure cleanup
      localStorage.removeItem('supabase.auth.token');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Force logout even on error
      localStorage.removeItem('supabase.auth.token');
      setUser(null);
      navigate('/');
    }
  }

  if (loading) {
    return <Button variant="ghost" disabled>Loading...</Button>
  }

  if (!user) {
    return (
      <Button onClick={() => navigate('/auth')} variant="default">
        <LogIn className="size-4 mr-2" />
        Sign In
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <User className="size-4" />
          <span className="hidden md:inline">{user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="size-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
