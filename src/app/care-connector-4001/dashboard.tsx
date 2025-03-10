import React, { useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { CareConnectorLayout } from './components/CareConnectorLayout';
import { useAuth } from '@/components/AuthProvider';

// This is a direct access component that forces the dashboard to render
export default function DirectDashboardPage() {
  const { session } = useAuth();
  
  useEffect(() => {
    console.log("Direct dashboard access - bypassing all redirects");
    // Set the document title
    document.title = "Care Connector Dashboard";
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <CareConnectorLayout session={session}>
        <Dashboard session={session} />
      </CareConnectorLayout>
    </div>
  );
} 