import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ToastProps, useToast } from './use-toast';
import { cn } from '@/lib/utils';

export interface ToasterProps {
  className?: string;
}

export function Toaster({ className }: ToasterProps) {
  const { toasts, dismiss } = useToast();

  return (
    <div className={cn('fixed top-0 z-[100] flex flex-col items-end gap-2 w-full px-4 pt-4 sm:max-w-[420px] sm:right-0', className)}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onDismiss={() => dismiss(toast.id)}
        />
      ))}
    </div>
  );
}

interface ToastComponentProps extends ToastProps {
  id: string;
  onDismiss: () => void;
}

function Toast({
  id,
  title,
  description,
  variant = 'default',
  onDismiss,
}: ToastComponentProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Animation handling
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for animation before removing
  };

  return (
    <div
      className={cn(
        'pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-lg p-4 shadow-lg transition-all duration-300 ease-in-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        variant === 'default' && 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        variant === 'destructive' && 'bg-red-600 text-white dark:bg-red-700',
        variant === 'success' && 'bg-green-600 text-white dark:bg-green-700'
      )}
    >
      <div className="flex items-start">
        <div className="flex-1">
          {title && (
            <h3 className={cn(
              'font-medium text-sm',
              variant === 'default' && 'text-gray-900 dark:text-gray-100',
              (variant === 'destructive' || variant === 'success') && 'text-white'
            )}>
              {title}
            </h3>
          )}
          {description && (
            <p className={cn(
              'mt-1 text-sm',
              variant === 'default' && 'text-gray-500 dark:text-gray-400',
              (variant === 'destructive' || variant === 'success') && 'text-white text-opacity-90'
            )}>
              {description}
            </p>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className={cn(
            'ml-4 inline-flex shrink-0 rounded-md p-1',
            variant === 'default' && 'text-gray-400 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-500',
            (variant === 'destructive' || variant === 'success') && 'text-white text-opacity-70 hover:text-opacity-100'
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 