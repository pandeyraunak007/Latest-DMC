'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  message?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export default function ProgressBar({
  progress,
  message,
  showPercentage = true,
  animated = true
}: ProgressBarProps) {
  return (
    <div className="w-full space-y-3">
      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-zinc-800 dark:bg-zinc-800 light:bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-600 to-violet-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: 'easeInOut' }}
        >
          {animated && progress < 100 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Progress Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {progress < 100 && animated && (
            <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
          )}
          {message && (
            <span className="text-sm text-zinc-400 dark:text-zinc-400 light:text-gray-600">
              {message}
            </span>
          )}
        </div>

        {showPercentage && (
          <span className="text-sm font-medium text-zinc-300 dark:text-zinc-300 light:text-gray-700">
            {progress}%
          </span>
        )}
      </div>
    </div>
  );
}
