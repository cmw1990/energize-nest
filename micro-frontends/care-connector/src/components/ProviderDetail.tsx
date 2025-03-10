import React from 'react';
import { Session } from '@supabase/supabase-js';
import { useParams } from 'react-router-dom';

interface ProviderDetailProps {
  session: Session | null;
}

export const ProviderDetail: React.FC<ProviderDetailProps> = ({ session }) => {
  const { providerId } = useParams();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Provider Details</h1>
      <p className="text-gray-600">Viewing details for provider {providerId}...</p>
    </div>
  );
}; 