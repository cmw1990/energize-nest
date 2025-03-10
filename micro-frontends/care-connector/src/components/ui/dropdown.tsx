import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = 'left',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={toggleDropdown}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
            'dark:bg-gray-800 dark:ring-gray-700',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};

export interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  className,
  children,
  disabled = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer',
        'dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownSeparator: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn('h-px my-1 bg-gray-200 dark:bg-gray-700', className)}
      {...props}
    />
  );
};

export const DropdownLabel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'block px-4 py-2 text-sm text-gray-700 font-medium',
        'dark:text-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        'dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
    </button>
  );
}; 