import React from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileAppLayoutProps {
  className?: string;
}

export const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({ className }) => {
  return (
    <div className={cn('flex h-screen flex-col', className)}>
      {/* Mobile-specific header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <h1 className="text-2xl font-bold">Mobile App</h1>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4">
        <Outlet />
      </main>

      {/* Mobile navigation bar */}
      <nav className="border-t bg-background p-4">
        {/* Add mobile navigation content */}
      </nav>
    </div>
  );
};
