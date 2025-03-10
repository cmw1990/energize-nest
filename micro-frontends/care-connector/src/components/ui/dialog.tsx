import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  className,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={dialogRef}
        className={cn(
          'relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto',
          'dark:bg-gray-800',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  className,
  showCloseButton = true,
  onClose,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 border-b border-gray-200',
        'dark:border-gray-700',
        className
      )}
    >
      <div className="text-lg font-medium">{children}</div>
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-4',
        className
      )}
    >
      {children}
    </div>
  );
};

export interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-end p-4 border-t border-gray-200 gap-2',
        'dark:border-gray-700',
        className
      )}
    >
      {children}
    </div>
  );
};

export interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  className,
}) => {
  return (
    <h2
      className={cn(
        'text-lg font-medium text-gray-900',
        'dark:text-gray-100',
        className
      )}
    >
      {children}
    </h2>
  );
};

export interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogDescription: React.FC<DialogDescriptionProps> = ({
  children,
  className,
}) => {
  return (
    <p
      className={cn(
        'mt-2 text-sm text-gray-500',
        'dark:text-gray-400',
        className
      )}
    >
      {children}
    </p>
  );
}; 