import React from 'react';
import { EasierMoodApp } from './EasierMoodApp';
import { useAuth } from '@/components/AuthProvider';

export default function EasierMoodPage() {
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <EasierMoodApp session={session} />
    </div>
  );
}
