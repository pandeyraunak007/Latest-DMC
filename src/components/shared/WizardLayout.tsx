'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator, { Step } from './StepIndicator';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardLayoutProps {
  title: string;
  description: string;
  steps: Step[];
  currentStep: number;
  onNext?: () => void;
  onBack?: () => void;
  onStepChange?: (step: number) => void;
  children: React.ReactNode;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  hideNavigation?: boolean;
  icon?: React.ReactNode;
}

export default function WizardLayout({
  title,
  description,
  steps,
  currentStep,
  onNext,
  onBack,
  children,
  nextLabel = 'Next',
  backLabel = 'Back',
  nextDisabled = false,
  hideNavigation = false,
  icon
}: WizardLayoutProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            {icon && <div className="text-blue-500">{icon}</div>}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100">
              {title}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-zinc-400 text-lg">
            {description}
          </p>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <StepIndicator steps={steps} currentStep={currentStep} />
        </motion.div>

        {/* Content Area with Animation */}
        <div className="mt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        {!hideNavigation && (
          <motion.div
            className="flex items-center justify-between mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={onBack}
              disabled={isFirstStep}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                isFirstStep
                  ? 'opacity-0 pointer-events-none'
                  : 'border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </button>

            <button
              onClick={onNext}
              disabled={nextDisabled}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                nextDisabled
                  ? 'bg-gray-300 dark:bg-zinc-700 text-gray-500 dark:text-zinc-500 cursor-not-allowed'
                  : 'bg-violet-600 text-white hover:bg-violet-700'
              }`}
            >
              {nextLabel}
              {!isLastStep && <ArrowRight className="w-4 h-4" />}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
