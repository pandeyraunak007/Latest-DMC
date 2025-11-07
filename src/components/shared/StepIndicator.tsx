'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-zinc-800">
          <motion.div
            className="h-full bg-violet-600"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          const isUpcoming = currentStep < stepNumber;

          return (
            <div key={step.id} className="relative flex flex-col items-center z-10">
              {/* Step Circle */}
              <motion.div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  isCompleted
                    ? 'bg-violet-600 border-violet-600'
                    : isCurrent
                    ? 'bg-violet-600 border-violet-600'
                    : 'bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700'
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-5 h-5 text-white" />
                  </motion.div>
                ) : (
                  <span
                    className={`text-sm font-semibold ${
                      isCurrent ? 'text-white' : 'text-gray-500 dark:text-zinc-400'
                    }`}
                  >
                    {stepNumber}
                  </span>
                )}
              </motion.div>

              {/* Step Label */}
              <div className="absolute top-12 w-32 text-center">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <p
                    className={`text-sm font-medium mb-1 ${
                      isCurrent
                        ? 'text-gray-900 dark:text-zinc-100'
                        : isCompleted
                        ? 'text-gray-700 dark:text-zinc-300'
                        : 'text-gray-400 dark:text-zinc-500'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500">
                    {step.description}
                  </p>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
