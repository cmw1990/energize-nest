import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { useToast } from './ui/use-toast';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

interface AuthProps {
  mode?: 'signin' | 'signup';
  onSuccess?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ mode = 'signin', onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(mode);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if there's a register=true query param to set the tab to signup
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('register') === 'true') {
      setActiveTab('signup');
    }
  }, [location]);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabaseClient.auth.getSession();
      if (data.session) {
        navigate('/care-connector/webapp/dashboard');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/care-connector/webapp/dashboard');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in. Please check your credentials.');
      
      toast({
        title: 'Authentication failed',
        description: err.message || 'Failed to sign in',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Account created!',
        description: 'Please check your email for a confirmation link.',
      });
      
      // Don't navigate away, let the user see the success message
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
      
      toast({
        title: 'Sign up failed',
        description: err.message || 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center">
            <Heart className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-2xl font-bold text-blue-600 dark:text-blue-400">Care Connector</span>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Welcome to Care Connector</CardTitle>
            <CardDescription>
              Connect with caregivers and coordinate care for your loved ones
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password">Password</Label>
                      <Button variant="link" size="sm" className="px-0" onClick={() => navigate('/care-connector/forgot-password')}>
                        Forgot password?
                      </Button>
                    </div>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
            
            <div className="text-center">
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400" onClick={() => navigate('/care-connector')}>
                Back to Home
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth; 