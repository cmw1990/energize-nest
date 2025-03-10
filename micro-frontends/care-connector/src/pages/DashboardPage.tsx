import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { CareConnectorLayout } from '../components/CareConnectorLayout';
import { Dashboard } from '../components/Dashboard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { SUPABASE_URL, SUPABASE_KEY } from '@/integrations/supabase/db-client';

const DashboardPage: React.FC = () => {
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

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle unauthenticated users
  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="mb-6">You need to be logged in to access this dashboard.</p>
          <Button 
            onClick={() => navigate('/care-connector')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // Render dashboard for authenticated users with the layout including sidebar
  return (
    <CareConnectorLayout session={session}>
      <Dashboard session={session} />
    </CareConnectorLayout>
  );
};

export default DashboardPage; 