import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked,
      defaultChecked,
      onChange,
      disabled,
      label,
      description,
      error,
      id,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;
    const checkboxId = id || React.useId();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;
      
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      
      onChange?.(newChecked);
    };

    return (
      <div className={cn('flex items-start space-x-2', className)}>
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              'flex items-center justify-center w-4 h-4 rounded border transition-colors',
              'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
              isChecked
                ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                : 'border-gray-300 dark:border-gray-600',
              disabled && 'opacity-50 cursor-not-allowed',
              error && 'border-red-500 dark:border-red-500'
            )}
          >
            {isChecked && (
              <Check className="w-3 h-3 text-white" />
            )}
          </div>
        </div>
        {(label || description) && (
          <div className="text-sm">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  'font-medium text-gray-900 dark:text-gray-100',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className={cn(
                'text-gray-500 dark:text-gray-400',
                disabled && 'opacity-50'
              )}>
                {description}
              </p>
            )}
            {error && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export interface CheckboxGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  children,
  className,
  orientation = 'vertical',
}) => {
  return (
    <div
      className={cn(
        'space-y-2',
        orientation === 'horizontal' && 'flex flex-row space-y-0 space-x-4',
        className
      )}
    >
      {children}
    </div>
  );
}; 