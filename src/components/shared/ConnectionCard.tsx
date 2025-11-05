'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, LucideIcon } from 'lucide-react';

interface ConnectionCardProps {
  id: string;
  icon: React.ReactNode | string;
  title: string;
  description: string;
  selected: boolean;
  disabled?: boolean;
  badge?: string;
  onClick?: () => void;
}

export default function ConnectionCard({
  icon,
  title,
  description,
  selected,
  disabled = false,
  badge,
  onClick
}: ConnectionCardProps) {
  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`relative w-full p-6 rounded-xl border-2 text-left transition-all ${
        disabled
          ? 'opacity-50 cursor-not-allowed bg-zinc-900 dark:bg-zinc-900 light:bg-gray-50 border-zinc-800 dark:border-zinc-800 light:border-gray-200'
          : selected
          ? 'bg-violet-600/10 border-violet-500 dark:bg-violet-600/10 light:bg-violet-50'
          : 'bg-zinc-900 dark:bg-zinc-900 light:bg-white border-zinc-800 dark:border-zinc-800 light:border-gray-200 hover:border-violet-500/50 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-gray-50'
      }`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg ${
          selected
            ? 'bg-violet-600 text-white'
            : 'bg-zinc-800 dark:bg-zinc-800 light:bg-gray-100 text-zinc-400 dark:text-zinc-400 light:text-gray-600'
        }`}>
          {typeof icon === 'string' ? (
            <span className="text-2xl">{icon}</span>
          ) : (
            icon
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold ${
              selected
                ? 'text-zinc-100 dark:text-zinc-100 light:text-gray-900'
                : 'text-zinc-200 dark:text-zinc-200 light:text-gray-800'
            }`}>
              {title}
            </h3>
            {badge && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                badge === 'Soon' || badge === 'Coming Soon'
                  ? 'bg-amber-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}>
                {badge}
              </span>
            )}
          </div>
          <p className={`text-sm ${
            selected
              ? 'text-zinc-300 dark:text-zinc-300 light:text-gray-600'
              : 'text-zinc-400 dark:text-zinc-400 light:text-gray-500'
          }`}>
            {description}
          </p>
        </div>

        {/* Selected Indicator */}
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="flex-shrink-0"
          >
            <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}
