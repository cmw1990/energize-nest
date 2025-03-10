import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variant === 'default' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        variant === 'secondary' && 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        variant === 'destructive' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        variant === 'success' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        variant === 'outline' && 'border border-gray-200 text-gray-800 dark:border-gray-700 dark:text-gray-300',
        className
      )}
      {...props}
    />
  );
} 