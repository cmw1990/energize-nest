import React from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ExtensionLayoutProps {
  className?: string;
}

export const ExtensionLayout: React.FC<ExtensionLayoutProps> = ({ className }) => {
  return (
    <div className={cn('flex h-[600px] w-[400px] flex-col', className)}>
      {/* Compact header */}
      <header className="h-12 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Add compact header content */}
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4">
        <Outlet />
      </main>

      {/* Quick actions */}
      <div className="border-t bg-muted/40 p-2">
        {/* Add quick actions content */}
      </div>
    </div>
  );
};
