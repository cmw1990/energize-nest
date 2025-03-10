import React, { useEffect } from 'react';
import { Settings } from './components/Settings';
import { CareConnectorLayout } from './components/CareConnectorLayout';
import { useAuth } from '@/components/AuthProvider';

// This is a direct access component that forces the settings to render
export default function DirectSettingsPage() {
  const { session } = useAuth();
  
  useEffect(() => {
    console.log("Direct settings access - bypassing all redirects");
    // Set the document title
    document.title = "Care Connector Settings";
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <CareConnectorLayout session={session}>
        <Settings session={session} />
      </CareConnectorLayout>
    </div>
  );
} 