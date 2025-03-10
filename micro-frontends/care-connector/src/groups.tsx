import React, { useEffect } from 'react';
import CareGroups from './components/CareGroups';
import { CareConnectorLayout } from './components/CareConnectorLayout';
import { useAuth } from '@/components/AuthProvider';

// This is a direct access component that forces the groups page to render
export default function DirectGroupsPage() {
  const { session } = useAuth();
  
  useEffect(() => {
    console.log("Direct groups access - bypassing all redirects");
    // Set the document title
    document.title = "Care Connector Groups";
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <CareConnectorLayout session={session}>
        <CareGroups session={session} />
      </CareConnectorLayout>
    </div>
  );
} 