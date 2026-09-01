import React from 'react';
import { useToast } from '../context/ToastContext';
import type { ToastType } from '../types';

const toastStyles: Record<ToastType, string> = {
  success: 'border-success/30 bg-success/5',
  error: 'border-danger/30 bg-danger/5',
  info: 'border-accent-primary/30 bg-accent-primary/5',
};

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: (
    <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-danger flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-accent-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

interface ToastItemProps {
  toast: {
    id: string;
    type: ToastType;
    message: string;
  };
  onDismiss: (id: string) => void;
  style?: React.CSSProperties;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 animate-slide-up ${toastStyles[toast.type]}`}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{toastIcons[toast.type]}</div>
      <p className="text-text-primary text-sm leading-relaxed flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-text-muted hover:text-text-primary transition-colors p-1 flex-shrink-0"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function Toaster() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm sm:max-w-md pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={dismissToast}
          style={{ pointerEvents: 'auto' }}
        />
      ))}
    </div>
  );
}