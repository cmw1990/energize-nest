import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options?: { value: string; label: string }[];
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options = [], onChange, placeholder, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm',
            'ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-900 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400',
            'appearance-none',
            className
          )}
          onChange={handleChange}
          value={value}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
      </div>
    );
  }
);

Select.displayName = 'Select';

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  placeholder?: string;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, placeholder, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm',
        'ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-900 dark:placeholder:text-gray-400 dark:focus:ring-blue-400',
        className
      )}
      {...props}
    >
      {children || <span className="text-gray-500">{placeholder}</span>}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
);

SelectTrigger.displayName = 'SelectTrigger';

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'popper' | 'item-aligned';
}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, position = 'popper', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-900 shadow-md',
        'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
        position === 'popper' && 'mt-1',
        className
      )}
      {...props}
    >
      <div className="max-h-[var(--radix-select-content-available-height)] overflow-auto">
        {children}
      </div>
    </div>
  )
);

SelectContent.displayName = 'SelectContent';

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
        'hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'dark:hover:bg-gray-700 dark:focus:bg-gray-700',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {/* Checkmark would go here for selected item */}
      </span>
      <span className="truncate">{children}</span>
    </div>
  )
);

SelectItem.displayName = 'SelectItem';

export interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder, children }) => {
  return <>{children || <span className="text-gray-500">{placeholder}</span>}</>;
}; 