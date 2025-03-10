import React from 'react';
import { EasierFocusApp } from './EasierFocusApp';
import { useAuth } from '@/components/AuthProvider';

export default function EasierFocusPage() {
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <EasierFocusApp session={session} />
    </div>
  );
}
