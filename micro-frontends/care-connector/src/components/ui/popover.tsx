import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
  contentClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  position = 'bottom',
  align = 'center',
  className,
  contentClassName,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handleToggle = () => {
    const newOpen = !isOpen;
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };
  
  const handleClickOutside = (event: MouseEvent) => {
    if (
      isOpen &&
      triggerRef.current &&
      contentRef.current &&
      !triggerRef.current.contains(event.target as Node) &&
      !contentRef.current.contains(event.target as Node)
    ) {
      if (!isControlled) {
        setInternalOpen(false);
      }
      onOpenChange?.(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        if (!isControlled) {
          setInternalOpen(false);
        }
        onOpenChange?.(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isControlled, onOpenChange]);
  
  const getPositionStyles = () => {
    if (!triggerRef.current || !contentRef.current) return {};
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    
    let top = 0;
    let left = 0;
    
    switch (position) {
      case 'top':
        top = triggerRect.top - contentRect.height - 8;
        break;
      case 'right':
        left = triggerRect.right + 8;
        top = triggerRect.top;
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        break;
      case 'left':
        left = triggerRect.left - contentRect.width - 8;
        top = triggerRect.top;
        break;
    }
    
    if (position === 'top' || position === 'bottom') {
      switch (align) {
        case 'start':
          left = triggerRect.left;
          break;
        case 'center':
          left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);
          break;
        case 'end':
          left = triggerRect.right - contentRect.width;
          break;
      }
    } else if (position === 'left' || position === 'right') {
      switch (align) {
        case 'start':
          top = triggerRect.top;
          break;
        case 'center':
          top = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2);
          break;
        case 'end':
          top = triggerRect.bottom - contentRect.height;
          break;
      }
    }
    
    // Ensure the popover stays within the viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (left < 8) left = 8;
    if (top < 8) top = 8;
    if (left + contentRect.width > viewportWidth - 8) {
      left = viewportWidth - contentRect.width - 8;
    }
    if (top + contentRect.height > viewportHeight - 8) {
      top = viewportHeight - contentRect.height - 8;
    }
    
    return { top, left };
  };
  
  return (
    <div className={cn('relative inline-block', className)}>
      <div ref={triggerRef} onClick={handleToggle}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          ref={contentRef}
          className={cn(
            'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-2 text-gray-900 shadow-md',
            'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
            contentClassName
          )}
          style={{
            position: 'fixed',
            ...getPositionStyles(),
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export interface PopoverTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({
  children,
  asChild = false,
  ...props
}) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { ...props });
  }
  
  return <div {...props}>{children}</div>;
};

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-2 text-gray-900 shadow-md',
        'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}; 