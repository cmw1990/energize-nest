import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'default' | 'circle' | 'rounded';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'default',
  width,
  height,
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        variant === 'default' && 'rounded-md',
        variant === 'circle' && 'rounded-full',
        variant === 'rounded' && 'rounded-lg',
        className
      )}
      style={{
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
      {...props}
    />
  );
};

export const SkeletonText: React.FC<SkeletonProps> = ({
  className,
  width = '100%',
  height = 16,
  ...props
}) => {
  return (
    <Skeleton
      className={cn('w-full h-4', className)}
      width={width}
      height={height}
      {...props}
    />
  );
};

export const SkeletonCircle: React.FC<SkeletonProps> = ({
  className,
  width = 40,
  height = 40,
  ...props
}) => {
  return (
    <Skeleton
      variant="circle"
      className={cn('w-10 h-10', className)}
      width={width}
      height={height}
      {...props}
    />
  );
};

export const SkeletonAvatar: React.FC<SkeletonProps> = ({
  className,
  width = 40,
  height = 40,
  ...props
}) => {
  return (
    <Skeleton
      variant="circle"
      className={cn('w-10 h-10', className)}
      width={width}
      height={height}
      {...props}
    />
  );
};

export const SkeletonButton: React.FC<SkeletonProps> = ({
  className,
  width = 100,
  height = 40,
  ...props
}) => {
  return (
    <Skeleton
      variant="rounded"
      className={cn('w-24 h-10', className)}
      width={width}
      height={height}
      {...props}
    />
  );
};

export const SkeletonCard: React.FC<SkeletonProps> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
};

export const SkeletonTable: React.FC<SkeletonProps & { rows?: number; columns?: number }> = ({
  className,
  rows = 5,
  columns = 4,
  ...props
}) => {
  return (
    <div className={cn('w-full', className)} {...props}>
      <div className="flex gap-4 mb-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-8 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 mb-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}; 