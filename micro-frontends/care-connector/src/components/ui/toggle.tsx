import React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onChange?: (pressed: boolean) => void;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  value?: string;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className,
      children,
      pressed,
      defaultPressed = false,
      onChange,
      variant = 'default',
      size = 'md',
      ...props
    },
    ref
  ) => {
    const [internalPressed, setInternalPressed] = React.useState(defaultPressed);
    const isControlled = pressed !== undefined;
    const isPressed = isControlled ? pressed : internalPressed;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isControlled) {
        setInternalPressed(!internalPressed);
      }
      
      onChange?.(!isPressed);
      props.onClick?.(event);
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isPressed}
        data-state={isPressed ? 'on' : 'off'}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variant === 'default' && [
            'bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700',
            isPressed && 'bg-gray-200 dark:bg-gray-700',
          ],
          variant === 'outline' && [
            'border border-gray-200 bg-transparent hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800',
            isPressed && 'bg-gray-100 dark:bg-gray-800',
          ],
          size === 'sm' && 'h-8 px-2',
          size === 'md' && 'h-10 px-3',
          size === 'lg' && 'h-12 px-4',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Toggle.displayName = 'Toggle';

export interface ToggleGroupProps {
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  type = 'multiple',
  value,
  defaultValue,
  onChange,
  disabled = false,
  className,
  children,
}) => {
  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    defaultValue || (type === 'single' ? '' : [])
  );
  
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleToggleChange = (itemValue: string, pressed: boolean) => {
    if (type === 'single') {
      const newValue = pressed ? itemValue : '';
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    } else {
      const currentValueArray = Array.isArray(currentValue) ? currentValue : [];
      const newValue = pressed
        ? [...currentValueArray, itemValue]
        : currentValueArray.filter((v) => v !== itemValue);
      
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center gap-1 rounded-md',
        className
      )}
      role={type === 'single' ? 'radiogroup' : 'group'}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<ToggleProps>(child)) return child;
        
        const childValue = child.props.value;
        if (!childValue) return child;
        
        const isPressed = type === 'single'
          ? currentValue === childValue
          : Array.isArray(currentValue) && currentValue.includes(childValue);
        
        return React.cloneElement(child, {
          ...child.props,
          pressed: isPressed,
          disabled: disabled || child.props.disabled,
          onChange: (pressed: boolean) => handleToggleChange(childValue, pressed),
        });
      })}
    </div>
  );
};

export interface ToggleGroupItemProps extends Omit<ToggleProps, 'onChange'> {
  value: string;
  onChange?: (pressed: boolean) => void;
}

export const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ value, ...props }, ref) => {
    return <Toggle ref={ref} value={value} {...props} />;
  }
);

ToggleGroupItem.displayName = 'ToggleGroupItem'; 