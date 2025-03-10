import React from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  error?: string;
  name?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
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
      name,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;
    const radioId = id || React.useId();

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
            type="radio"
            id={radioId}
            ref={ref}
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            name={name}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              'flex items-center justify-center w-4 h-4 rounded-full border transition-colors',
              'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
              isChecked
                ? 'border-blue-600 dark:border-blue-500'
                : 'border-gray-300 dark:border-gray-600',
              disabled && 'opacity-50 cursor-not-allowed',
              error && 'border-red-500 dark:border-red-500'
            )}
          >
            {isChecked && (
              <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500" />
            )}
          </div>
        </div>
        {(label || description) && (
          <div className="text-sm">
            {label && (
              <label
                htmlFor={radioId}
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

Radio.displayName = 'Radio';

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  children: React.ReactNode;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  defaultValue,
  onChange,
  name,
  className,
  orientation = 'vertical',
  disabled = false,
  children,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleRadioChange = (radioValue: string) => {
    if (!isControlled) {
      setInternalValue(radioValue);
    }
    onChange?.(radioValue);
  };

  // Create a context value to pass down to RadioGroupItem
  const contextValue = {
    name,
    value: currentValue,
    onChange: handleRadioChange,
    disabled,
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        className={cn(
          'space-y-2',
          orientation === 'horizontal' && 'flex flex-row space-y-0 space-x-4',
          className
        )}
        role="radiogroup"
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

// Create a context for the RadioGroup
interface RadioGroupContextType {
  name: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextType | undefined>(undefined);

export interface RadioGroupItemProps extends Omit<RadioProps, 'onChange' | 'name' | 'checked'> {
  value: string;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value, disabled, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    
    if (!context) {
      throw new Error('RadioGroupItem must be used within a RadioGroup');
    }
    
    const { name, value: groupValue, onChange, disabled: groupDisabled } = context;
    
    const handleChange = (checked: boolean) => {
      if (checked) {
        onChange(value);
      }
    };
    
    return (
      <Radio
        ref={ref}
        name={name}
        value={value}
        checked={groupValue === value}
        onChange={handleChange}
        disabled={disabled || groupDisabled}
        {...props}
      />
    );
  }
);

RadioGroupItem.displayName = 'RadioGroupItem'; 