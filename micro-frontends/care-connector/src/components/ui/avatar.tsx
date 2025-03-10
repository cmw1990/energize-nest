import React from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full',
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Avatar.displayName = 'Avatar';

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoadingStatusChange?: (status: 'loading' | 'loaded' | 'error') => void;
}

export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt = '', onLoadingStatusChange, ...props }, ref) => {
    const [status, setStatus] = React.useState<'loading' | 'loaded' | 'error'>(
      src ? 'loading' : 'error'
    );

    React.useEffect(() => {
      if (!src) {
        setStatus('error');
        onLoadingStatusChange?.('error');
        return;
      }

      setStatus('loading');
      onLoadingStatusChange?.('loading');
    }, [src, onLoadingStatusChange]);

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn('aspect-square h-full w-full object-cover', className)}
        onLoad={() => {
          setStatus('loaded');
          onLoadingStatusChange?.('loaded');
        }}
        onError={() => {
          setStatus('error');
          onLoadingStatusChange?.('error');
        }}
        {...props}
      />
    );
  }
);

AvatarImage.displayName = 'AvatarImage';

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700',
          className
        )}
        {...props}
      >
        {children || <User className="h-6 w-6 text-gray-400 dark:text-gray-500" />}
      </div>
    );
  }
);

AvatarFallback.displayName = 'AvatarFallback'; 