import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleCreateGroup from '../components/SimpleCreateGroup';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { SUPABASE_URL, SUPABASE_KEY } from '@/integrations/supabase/db-client';

const SimpleCreateGroupPage: React.FC = () => {
  const navigate = useNavigate();
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

  const handleSuccess = () => {
    // Navigate back to groups page after successful creation
    setTimeout(() => {
      navigate('/app/care-connector/app/groups');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="mb-6">You need to be logged in to create a care group.</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/app/care-connector/app/groups')}
          className="mb-4"
        >
          Back to Groups
        </Button>
        <h1 className="text-2xl font-bold">Create New Care Group</h1>
        <p className="text-gray-600">
          Create a group to coordinate care with family, friends, and caregivers.
        </p>
      </div>
      
      <SimpleCreateGroup 
        session={session} 
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default SimpleCreateGroupPage; 