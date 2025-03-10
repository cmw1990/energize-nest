import React, { useEffect, useState } from 'react';
import { TestCreateGroup } from '../components/TestCreateGroup';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';

// Use environment variables directly instead of importing from db-client
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const TestCreateGroupPage: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        // Get session from localStorage
        const storedSession = localStorage.getItem('supabase.auth.token');
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          if (parsedSession?.currentSession) {
            // Verify the token is valid with a direct REST API call
            const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
              headers: {
                'Authorization': `Bearer ${parsedSession.currentSession.access_token}`,
                'apikey': SUPABASE_KEY
              }
            });
            
            if (response.ok) {
              setSession(parsedSession.currentSession);
            } else {
              // Token is invalid
              setSession(null);
            }
          }
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Test Create Group</h1>
      <p className="mb-4 text-gray-600">
        This page demonstrates creating a group with direct REST API calls.
      </p>
      <TestCreateGroup session={session} />
      
      <div className="mt-6">
        <Button 
          variant="outline"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default TestCreateGroupPage; 