import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  size?: 'default' | 'sm';
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = 'default', size = 'default', ...props }, ref) => {
    const percentage = Math.min(Math.max(0, value), max) / max * 100;
    
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-full',
          size === 'default' ? 'h-4' : 'h-2',
          'bg-gray-100 dark:bg-gray-800',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'h-full w-full flex-1 transition-all',
            variant === 'default' && 'bg-blue-500 dark:bg-blue-600',
            variant === 'success' && 'bg-green-500 dark:bg-green-600',
            variant === 'warning' && 'bg-yellow-500 dark:bg-yellow-600',
            variant === 'destructive' && 'bg-red-500 dark:bg-red-600'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress'; 