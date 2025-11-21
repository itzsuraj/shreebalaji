'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: ToastType;
  duration?: number;
}

export default function Toast({ 
  message, 
  isVisible, 
  onClose, 
  type = 'success',
  duration = 3000 
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
      <div className={`${typeStyles[type]} px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px] max-w-md`}>
        {icons[type]}
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="hover:opacity-80 transition-opacity"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 