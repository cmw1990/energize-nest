import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const iconMap = {
      default: <Info className="h-4 w-4" />,
      destructive: <XCircle className="h-4 w-4" />,
      success: <CheckCircle className="h-4 w-4" />,
      warning: <AlertTriangle className="h-4 w-4" />,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full rounded-lg border p-4 mb-4 text-sm',
          variant === 'default' && 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300',
          variant === 'destructive' && 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
          variant === 'success' && 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
          variant === 'warning' && 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
          className
        )}
        {...props}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            {iconMap[variant]}
          </div>
          <div className="ml-3">{children}</div>
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 font-medium', className)}
      {...props}
    >
      {children}
    </h5>
  )
);

AlertTitle.displayName = 'AlertTitle';

export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-sm opacity-90', className)}
      {...props}
    >
      {children}
    </div>
  )
);

AlertDescription.displayName = 'AlertDescription'; 