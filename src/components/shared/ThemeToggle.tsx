'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-11 h-6 bg-zinc-800 dark:bg-zinc-800 light:bg-gray-200 rounded-full p-0.5 transition-colors"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="w-5 h-5 bg-white dark:bg-zinc-100 light:bg-gray-800 rounded-full flex items-center justify-center shadow-lg"
        animate={{
          x: isDark ? 0 : 20
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon className="w-2.5 h-2.5 text-zinc-800" />
        ) : (
          <Sun className="w-2.5 h-2.5 text-amber-500" />
        )}
      </motion.div>
    </motion.button>
  );
}
