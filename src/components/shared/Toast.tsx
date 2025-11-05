'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  title: string;
  message?: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

const colorMap = {
  success: {
    bg: 'bg-emerald-900/90 dark:bg-emerald-900/90 light:bg-emerald-50',
    border: 'border-emerald-600 dark:border-emerald-600 light:border-emerald-300',
    icon: 'text-emerald-500',
    title: 'text-emerald-100 dark:text-emerald-100 light:text-emerald-900',
    message: 'text-emerald-200 dark:text-emerald-200 light:text-emerald-700'
  },
  error: {
    bg: 'bg-red-900/90 dark:bg-red-900/90 light:bg-red-50',
    border: 'border-red-600 dark:border-red-600 light:border-red-300',
    icon: 'text-red-500',
    title: 'text-red-100 dark:text-red-100 light:text-red-900',
    message: 'text-red-200 dark:text-red-200 light:text-red-700'
  },
  warning: {
    bg: 'bg-amber-900/90 dark:bg-amber-900/90 light:bg-amber-50',
    border: 'border-amber-600 dark:border-amber-600 light:border-amber-300',
    icon: 'text-amber-500',
    title: 'text-amber-100 dark:text-amber-100 light:text-amber-900',
    message: 'text-amber-200 dark:text-amber-200 light:text-amber-700'
  },
  info: {
    bg: 'bg-blue-900/90 dark:bg-blue-900/90 light:bg-blue-50',
    border: 'border-blue-600 dark:border-blue-600 light:border-blue-300',
    icon: 'text-blue-500',
    title: 'text-blue-100 dark:text-blue-100 light:text-blue-900',
    message: 'text-blue-200 dark:text-blue-200 light:text-blue-700'
  }
};

export default function Toast({
  type,
  title,
  message,
  visible,
  onClose,
  duration = 5000
}: ToastProps) {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`fixed top-4 right-4 z-50 max-w-md backdrop-blur-sm ${colors.bg} ${colors.border} border rounded-lg shadow-2xl p-4`}
        >
          <div className="flex items-start gap-3">
            <Icon className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />

            <div className="flex-1 min-w-0">
              <h4 className={`font-semibold ${colors.title} mb-1`}>{title}</h4>
              {message && (
                <p className={`text-sm ${colors.message}`}>{message}</p>
              )}
            </div>

            <button
              onClick={onClose}
              className={`flex-shrink-0 ${colors.title} hover:opacity-70 transition-opacity`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
