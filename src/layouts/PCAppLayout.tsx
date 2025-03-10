import React from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PCAppLayoutProps {
  className?: string;
}

export const PCAppLayout: React.FC<PCAppLayoutProps> = ({ className }) => {
  return (
    <div className={cn('flex h-screen flex-col', className)}>
      {/* System menu bar */}
      <div className="h-8 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Add system menu content */}
      </div>

      {/* Main content with multi-window support */}
      <main className="flex-1 overflow-hidden p-4">
        <div className="h-full rounded-lg border bg-card">
          <Outlet />
        </div>
      </main>

      {/* Status bar */}
      <div className="h-6 border-t bg-muted/40 px-4 text-sm">
        {/* Add status bar content */}
      </div>
    </div>
  );
};
