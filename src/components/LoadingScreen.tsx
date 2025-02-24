import React from 'react';
import { Progress } from './ui/progress';

export const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-[300px] space-y-4">
      <Progress value={33} className="w-full" />
      <p className="text-center text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);
