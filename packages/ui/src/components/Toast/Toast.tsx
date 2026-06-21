import React, { createContext, useCallback, useContext, useState } from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import styles from './Toast.module.css';

type ToastVariant = 'default' | 'positive' | 'negative' | 'warning' | 'info';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((item: Omit<ToastItem, 'id'>) => {
    setToasts(prev => [...prev, { ...item, id: Math.random().toString(36).slice(2) }]);
  }, []);

  function dismiss(id: string) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        {toasts.map(t => (
          <RadixToast.Root
            key={t.id}
            className={[styles.root, t.variant ? styles[`root-${t.variant}`] : ''].filter(Boolean).join(' ')}
            duration={t.duration ?? 4000}
            onOpenChange={open => { if (!open) dismiss(t.id); }}
          >
            <div className={styles.body}>
              <RadixToast.Title className={styles.title}>{t.title}</RadixToast.Title>
              {t.description && (
                <RadixToast.Description className={styles.description}>{t.description}</RadixToast.Description>
              )}
            </div>
            <RadixToast.Close className={styles.close} aria-label="Dismiss">
              <X size={12} />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className={styles.viewport} />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
