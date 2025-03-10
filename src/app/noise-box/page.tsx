import React from 'react';
import { NoiseBoxApp } from './NoiseBoxApp';
import { useAuth } from '@/components/AuthProvider';

export default function NoiseBoxPage() {
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <NoiseBoxApp session={session} />
    </div>
  );
}
