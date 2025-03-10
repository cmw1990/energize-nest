import React, { useEffect } from 'react';
import { CareConnectorApp } from './CareConnectorApp';
import { useAuth } from '@/components/AuthProvider';

export default function CareConnectorPage() {
  // Get session from the main auth provider
  const { session } = useAuth();
  
  // Add debug logging
  useEffect(() => {
    console.log("CareConnectorPage rendered with session:", session);
  }, [session]);

  // For debugging: check URL on component load
  useEffect(() => {
    console.log("Current location:", window.location.pathname);
    
    // Special handling for dashboard URL
    if (window.location.pathname.includes('/care-connector/webapp/dashboard')) {
      console.log("Dashboard path detected!");
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Added debug info */}
      {window.location.pathname.includes('/care-connector/webapp/dashboard') && (
        <div className="hidden">Dashboard URL detected in page.tsx</div>
      )}
      <CareConnectorApp session={session} />
    </div>
  );
} 