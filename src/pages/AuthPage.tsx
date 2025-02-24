import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/integrations/supabase/client'
import { Battery, LogIn } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export const AuthPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        console.log('Starting signup process...');
        
        // Step 1: Create the user account
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })

        console.log('Signup response:', { authData, signUpError });

        if (signUpError) {
          console.error('Signup error:', signUpError);
          throw signUpError;
        }

        if (!authData?.user) {
          console.error('No user data returned');
          throw new Error('Failed to create user account');
        }

        toast({
          title: 'Check your email',
          description: 'We sent you a confirmation link to complete your registration.',
        })
      } else {
        console.log('Starting signin process...');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        console.log('Signin response:', { signInData, signInError });

        if (signInError) {
          console.error('Signin error:', signInError);
          throw signInError;
        }

        navigate('/webapp')
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <Battery className="size-6 text-primary" />
            <span className="text-xl font-semibold">The Well-Charged</span>
          </div>
          <CardTitle className="text-2xl">{isSignUp ? 'Create an account' : 'Welcome back'}</CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Enter your email and password to create your account'
              : 'Enter your email and password to access your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                'Loading...'
              ) : (
                <>
                  <LogIn className="size-4 mr-2" />
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
