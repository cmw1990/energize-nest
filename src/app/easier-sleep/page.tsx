import React from 'react';
import { EasierSleepApp } from './EasierSleepApp';
import { useAuth } from '@/components/AuthProvider';

export default function EasierSleepPage() {
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <EasierSleepApp session={session} />
    </div>
  );
}
