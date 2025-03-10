import React from 'react';

export * from './button';
export * from './card';
export * from './badge';
export * from './calendar';

// Types for the component props
type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'destructive';

// Label component with appropriate props
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = (props) => null;

// Input component with all HTML input attributes
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => null;

// Textarea component with all HTML textarea attributes
export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => null;

// Tabs and related components
export const Tabs: React.FC<{
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  [key: string]: any;
}> = (props) => null;

export const TabsContent: React.FC<{
  children: React.ReactNode;
  value?: string;
  className?: string;
  [key: string]: any;
}> = (props) => null;

export const TabsList: React.FC<{
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}> = (props) => null;

export const TabsTrigger: React.FC<{
  children: React.ReactNode;
  value?: string;
  [key: string]: any;
}> = (props) => null;

// Slider component
export const Slider: React.FC<{
  value?: number[];
  onValueChange?: (value: any) => void;
  min?: number;
  max?: number;
  step?: number;
  id?: string;
  [key: string]: any;
}> = (props) => null;

// Select and related components
export const Select: React.FC<{
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: any) => void;
  [key: string]: any;
}> = (props) => null;

export const SelectContent: React.FC<{
  children: React.ReactNode;
  [key: string]: any;
}> = (props) => null;

export const SelectItem: React.FC<{
  children: React.ReactNode;
  value?: string;
  [key: string]: any;
}> = (props) => null;

export const SelectTrigger: React.FC<{
  children: React.ReactNode;
  id?: string;
  [key: string]: any;
}> = (props) => null;

export const SelectValue: React.FC<{
  placeholder?: string;
  [key: string]: any;
}> = (props) => null;

// Additional UI components
export const Avatar: React.FC<{
  children?: React.ReactNode;
  [key: string]: any;
}> = (props) => null;

export const AvatarImage: React.FC<{
  src?: string;
  alt?: string;
  [key: string]: any;
}> = (props) => null;

export const AvatarFallback: React.FC<{
  children?: React.ReactNode;
  [key: string]: any;
}> = (props) => null;

export const Separator: React.FC<{
  className?: string;
  [key: string]: any;
}> = (props) => null;

export const Progress: React.FC<{
  value?: number;
  max?: number;
  className?: string;
  [key: string]: any;
}> = (props) => null;

// Switch component
export const Switch: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => null;

// Radio group components
export const RadioGroup: React.FC<{
  children?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  [key: string]: any;
}> = (props) => null;

export const RadioGroupItem: React.FC<{
  value?: string;
  id?: string;
  [key: string]: any;
}> = (props) => null;

// Checkbox component
export const Checkbox: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => null;

// Export ToastVariant type for use in other components
export type { ToastVariant }; 