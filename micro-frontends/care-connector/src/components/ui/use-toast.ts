import { useState, useEffect, useCallback } from 'react';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

interface Toast extends ToastProps {
  id: string;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (props: ToastProps) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export function useToast(): ToastContextValue {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const toast = useCallback(
    ({ title, description, variant = 'default', duration = 5000 }: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = {
        id,
        title,
        description,
        variant,
        duration,
      };
      
      setToasts((prev) => [...prev, newToast]);
      
      // Auto-dismiss toast after duration
      if (duration !== Infinity) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
      
      return id;
    },
    []
  );
  
  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  
  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);
  
  return {
    toasts,
    toast,
    dismiss,
    dismissAll,
  };
} 