import React from 'react';
import { Session } from '@supabase/supabase-js';

interface HealthMonitoringProps {
  session: Session | null;
}

export const HealthMonitoring: React.FC<HealthMonitoringProps> = ({ session }) => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Health Monitoring</h1>
      <p className="text-gray-600">Health monitoring functionality coming soon...</p>
    </div>
  );
}; 