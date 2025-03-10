import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({ 
  defaultValue, 
  value: controlledValue, 
  onValueChange, 
  className, 
  children 
}: TabsProps) {
  const [value, setValue] = useState(controlledValue || defaultValue || '');
  
  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);
  
  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setValue(newValue);
    }
    
    onValueChange?.(newValue);
  };
  
  return (
    <div className={cn('tabs', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            currentValue: value,
            onValueChange: handleValueChange,
          });
        }
        return child;
      })}
    </div>
  );
}

export interface TabsListProps {
  className?: string;
  children: React.ReactNode;
  currentValue?: string;
  onValueChange?: (value: string) => void;
}

export function TabsList({ className, children, currentValue, onValueChange }: TabsListProps) {
  return (
    <div className={cn('inline-flex items-center justify-center rounded-md bg-gray-100 p-1 dark:bg-gray-800', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            currentValue,
            onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  currentValue?: string;
}

export function TabsTrigger({ 
  value: triggerValue, 
  disabled, 
  className, 
  children, 
  onValueChange,
  currentValue,
  ...props
}: TabsTriggerProps & Omit<React.HTMLAttributes<HTMLButtonElement>, 'value' | 'onValueChange'>) {
  const isSelected = currentValue === triggerValue;
  
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        isSelected
          ? 'bg-white text-blue-700 shadow-sm dark:bg-gray-700 dark:text-blue-400'
          : 'text-gray-700 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-400',
        className
      )}
      onClick={() => onValueChange?.(triggerValue)}
      disabled={disabled}
      role="tab"
      aria-selected={isSelected}
      data-state={isSelected ? 'active' : 'inactive'}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  currentValue?: string;
}

export function TabsContent({ 
  value: contentValue, 
  className, 
  children,
  currentValue,
  ...props
}: TabsContentProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'value'>) {
  const isSelected = currentValue === contentValue;
  
  if (!isSelected) return null;
  
  return (
    <div
      className={cn(
        'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        className
      )}
      role="tabpanel"
      data-state={isSelected ? 'active' : 'inactive'}
      {...props}
    >
      {children}
    </div>
  );
} 
