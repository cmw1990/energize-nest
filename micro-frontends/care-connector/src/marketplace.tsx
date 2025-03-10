import React, { useEffect } from 'react';
import { Marketplace } from './components/Marketplace';
import { CareConnectorLayout } from './components/CareConnectorLayout';
import { useAuth } from '@/components/AuthProvider';

// This is a direct access component that forces the marketplace to render
export default function DirectMarketplacePage() {
  const { session } = useAuth();
  
  useEffect(() => {
    console.log("Direct marketplace access - bypassing all redirects");
    // Set the document title
    document.title = "Care Connector Marketplace";
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <CareConnectorLayout session={session}>
        <Marketplace session={session} />
      </CareConnectorLayout>
    </div>
  );
} 