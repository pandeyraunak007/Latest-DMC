'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightLeft,
  Database,
  FileText,
  Cloud,
  Loader2,
  Check,
  Download,
  CheckCircle2,
  Sparkles,
  Send,
  Settings
} from 'lucide-react';
import WizardLayout from './shared/WizardLayout';
import { Step } from './shared/StepIndicator';
import ConnectionCard from './shared/ConnectionCard';
import ProgressBar from './shared/ProgressBar';
import Toast, { ToastType } from './shared/Toast';
import {
  mockTargets,
  mockOutputFormats,
  mockModels,
  simulateForwardEngineering
} from '@/utils/mockApi';

const wizardSteps: Step[] = [
  { id: 1, title: 'Select Target', description: 'Choose output destination' },
  { id: 2, title: 'Configure Options', description: 'Set generation options' },
  { id: 3, title: 'Generate Output', description: 'Create and export' }
];

type TargetType = 'database' | 'file' | 'cloud';

export default function ForwardEngineeringNew() {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Target Selection
  const [targetType, setTargetType] = useState<TargetType>('file');
  const [selectedTarget, setSelectedTarget] = useState<string>('');

  // Step 2: Configuration
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('ddl');
  const [options, setOptions] = useState({
    includeDrop: false,
    includeComments: true,
    includeIndexes: true,
    includeConstraints: true,
    generateIfNotExists: true,
    schemaPrefix: '',
    namingConvention: 'preserve'
  });

  // Step 3: Generation
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState('');
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'processing' | 'complete'>('idle');
  const [generatedFile, setGeneratedFile] = useState<{ name: string; size: string } | null>(null);

  // Toast
  const [toast, setToast] = useState<{
    visible: boolean;
    type: ToastType;
    title: string;
    message?: string;
  }>({ visible: false, type: 'info', title: '' });

  const showToast = (type: ToastType, title: string, message?: string) => {
    setToast({ visible: true, type, title, message });
  };

  const handleStartGeneration = async () => {
    setGenerationStatus('processing');

    try {
      const result = await simulateForwardEngineering(selectedFormat, (progress, message) => {
        setGenerationProgress(progress);
        setGenerationMessage(message);
      });

      setGenerationStatus('complete');
      setGeneratedFile({ name: result.fileName, size: result.size });
      showToast('success', 'Generation Complete!', `Successfully generated ${result.fileName}`);
    } catch (error) {
      showToast('error', 'Generation Failed', 'An error occurred during processing');
      setGenerationStatus('idle');
    }
  };

  const handleDownload = () => {
    showToast('info', 'Download Started', `Downloading ${generatedFile?.name}...`);
    // Simulate download
    setTimeout(() => {
      showToast('success', 'Download Complete', 'File saved to your downloads folder');
    }, 1500);
  };

  const canProceedToStep2 = selectedTarget !== '';
  const canProceedToStep3 = selectedModel !== '' && selectedFormat !== '';

  // Get targets by type
  const getTargetsByType = (type: TargetType) => {
    return mockTargets.filter(t => t.type === type);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Target Type Selection */}
            <div>
              <label className="block text-sm font-medium text-zinc-100 dark:text-zinc-100 light:text-gray-900 mb-4">
                Choose Target Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                <ConnectionCard
                  id="database"
                  icon={<Database className="w-6 h-6" />}
                  title="Database"
                  description="Deploy directly to database"
                  selected={targetType === 'database'}
                  onClick={() => {
                    setTargetType('database');
                    setSelectedTarget('');
                  }}
                />
                <ConnectionCard
                  id="file"
                  icon={<FileText className="w-6 h-6" />}
                  title="Script File"
                  description="Generate DDL or export file"
                  selected={targetType === 'file'}
                  onClick={() => {
                    setTargetType('file');
                    setSelectedTarget('');
                  }}
                />
                <ConnectionCard
                  id="cloud"
                  icon={<Cloud className="w-6 h-6" />}
                  title="Cloud Service"
                  description="Deploy to cloud database"
                  selected={targetType === 'cloud'}
                  onClick={() => {
                    setTargetType('cloud');
                    setSelectedTarget('');
                  }}
                />
              </div>
            </div>

            {/* Target Selection */}
            <motion.div
              key={targetType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <label className="block text-sm font-medium text-zinc-100 dark:text-zinc-100 light:text-gray-900">
                Select {targetType === 'database' ? 'Database' : targetType === 'file' ? 'Output Format' : 'Cloud Service'}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getTargetsByType(targetType).map((target) => (
                  <ConnectionCard
                    key={target.id}
                    id={target.id}
                    icon={target.icon}
                    title={target.name}
                    description={target.description}
                    selected={selectedTarget === target.id}
                    onClick={() => setSelectedTarget(target.id)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Connection Configuration for Database/Cloud */}
            {(targetType === 'database' || targetType === 'cloud') && selectedTarget && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-zinc-800 dark:bg-zinc-800 light:bg-gray-50 rounded-xl border border-zinc-700 dark:border-zinc-700 light:border-gray-200 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-100 dark:text-zinc-100 light:text-gray-900">
                    Deployment Configuration
                  </h3>
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    {mockTargets.find(t => t.id === selectedTarget)?.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-gray-700 mb-2">
                      Server/Host *
                    </label>
                    <input
                      type="text"
                      className="w-full bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-600 dark:border-zinc-600 light:border-gray-300 rounded-lg px-4 py-2 text-sm text-zinc-100 dark:text-zinc-100 light:text-gray-900 focus:border-violet-500 focus:outline-none"
                      placeholder="localhost:1433"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-gray-700 mb-2">
                      Database Name *
                    </label>
                    <input
                      type="text"
                      className="w-full bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-600 dark:border-zinc-600 light:border-gray-300 rounded-lg px-4 py-2 text-sm text-zinc-100 dark:text-zinc-100 light:text-gray-900 focus:border-violet-500 focus:outline-none"
                      placeholder="target_database"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-zinc-100 dark:text-zinc-100 light:text-gray-900 mb-2">
                Configure Generation Options
              </h3>
              <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-gray-600">
                Select the model and customize output settings
              </p>
            </div>

            {/* Model Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-100 dark:text-zinc-100 light:text-gray-900">
                Select Model
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockModels.map((model) => (
                  <motion.button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedModel === model.id
                        ? 'bg-violet-600/10 border-violet-500'
                        : 'bg-zinc-800 dark:bg-zinc-800 light:bg-white border-zinc-700 dark:border-zinc-700 light:border-gray-200 hover:border-violet-500/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-semibold ${
                        selectedModel === model.id
                          ? 'text-zinc-100 dark:text-zinc-100 light:text-gray-900'
                          : 'text-zinc-200 dark:text-zinc-200 light:text-gray-800'
                      }`}>
                        {model.name}
                      </h4>
                      {selectedModel === model.id && (
                        <Check className="w-5 h-5 text-violet-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-400 light:text-gray-500">
                      <span>{model.entityCount} entities</span>
                      <span>•</span>
                      <span>{model.version}</span>
                      <span>•</span>
                      <span>{model.lastModified}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Output Format Selection */}
            {targetType === 'file' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-zinc-100 dark:text-zinc-100 light:text-gray-900">
                  Output Format
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mockOutputFormats.map((format) => (
                    <motion.button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        selectedFormat === format.id
                          ? 'bg-violet-600/10 border-violet-500'
                          : 'bg-zinc-800 dark:bg-zinc-800 light:bg-white border-zinc-700 dark:border-zinc-700 light:border-gray-200 hover:border-violet-500/50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FileText className={`w-6 h-6 mx-auto mb-2 ${
                        selectedFormat === format.id ? 'text-violet-500' : 'text-zinc-400'
                      }`} />
                      <p className={`text-sm font-medium ${
                        selectedFormat === format.id
                          ? 'text-zinc-100 dark:text-zinc-100 light:text-gray-900'
                          : 'text-zinc-300 dark:text-zinc-300 light:text-gray-700'
                      }`}>
                        {format.name}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">{format.extension}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Generation Options */}
            <div className="space-y-4 p-6 bg-zinc-800 dark:bg-zinc-800 light:bg-gray-50 rounded-xl border border-zinc-700 dark:border-zinc-700 light:border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-violet-500" />
                <h4 className="text-sm font-semibold text-zinc-100 dark:text-zinc-100 light:text-gray-900">
                  Generation Settings
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h5 className="text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-gray-700 uppercase tracking-wide">
                    Include Options
                  </h5>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={options.includeDrop}
                      onChange={(e) => setOptions({ ...options, includeDrop: e.target.checked })}
                      className="rounded border-zinc-600 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-sm text-zinc-100 dark:text-zinc-100 light:text-gray-900">
                      Include DROP statements
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={options.includeComments}
                      onChange={(e) => setOptions({ ...options, includeComments: e.target.checked })}
                      className="rounded border-zinc-600 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-sm text-zinc-100 dark:text-zinc-100 light:text-gray-900">
                      Include comments
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={options.includeIndexes}
                      onChange={(e) => setOptions({ ...options, includeIndexes: e.target.checked })}
                      className="rounded border-zinc-600 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-sm text-zinc-100 dark:text-zinc-100 light:text-gray-900">
                      Include indexes
                    </span>
                  </label>
                </div>

                <div className="space-y-3">
                  <h5 className="text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-gray-700 uppercase tracking-wide">
                    Advanced Options
                  </h5>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={options.includeConstraints}
                      onChange={(e) => setOptions({ ...options, includeConstraints: e.target.checked })}
                      className="rounded border-zinc-600 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-sm text-zinc-100 dark:text-zinc-100 light:text-gray-900">
                      Include constraints
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={options.generateIfNotExists}
                      onChange={(e) => setOptions({ ...options, generateIfNotExists: e.target.checked })}
                      className="rounded border-zinc-600 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-sm text-zinc-100 dark:text-zinc-100 light:text-gray-900">
                      Use IF NOT EXISTS
                    </span>
                  </label>
                </div>
              </div>

              {/* Naming Convention */}
              <div className="pt-4 border-t border-zinc-700 dark:border-zinc-700 light:border-gray-200">
                <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-gray-700 mb-2">
                  Naming Convention
                </label>
                <select
                  value={options.namingConvention}
                  onChange={(e) => setOptions({ ...options, namingConvention: e.target.value })}
                  className="w-full bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-600 dark:border-zinc-600 light:border-gray-300 rounded-lg px-4 py-2 text-sm text-zinc-100 dark:text-zinc-100 light:text-gray-900 focus:border-violet-500 focus:outline-none"
                >
                  <option value="preserve">Preserve Original</option>
                  <option value="lowercase">lowercase</option>
                  <option value="uppercase">UPPERCASE</option>
                  <option value="camelCase">camelCase</option>
                  <option value="snake_case">snake_case</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {generationStatus === 'idle' && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100 dark:text-zinc-100 light:text-gray-900 mb-2">
                    Ready to Generate
                  </h3>
                  <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-gray-600">
                    Review your configuration and start the generation process
                  </p>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-zinc-800 dark:bg-zinc-800 light:bg-gray-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-zinc-100 dark:text-zinc-100 light:text-gray-900">
                      {mockModels.find(m => m.id === selectedModel)?.name || 'N/A'}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-gray-600 mt-1">
                      Model Selected
                    </p>
                  </div>
                  <div className="p-4 bg-zinc-800 dark:bg-zinc-800 light:bg-gray-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-zinc-100 dark:text-zinc-100 light:text-gray-900">
                      {mockOutputFormats.find(f => f.id === selectedFormat)?.name || mockTargets.find(t => t.id === selectedTarget)?.name}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-gray-600 mt-1">
                      Output Format
                    </p>
                  </div>
                  <div className="p-4 bg-zinc-800 dark:bg-zinc-800 light:bg-gray-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-zinc-100 dark:text-zinc-100 light:text-gray-900">
                      ~1m
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-gray-600 mt-1">
                      Est. Time
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleStartGeneration}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  {targetType === 'database' || targetType === 'cloud' ? 'Deploy to Database' : 'Generate Output'}
                </button>
              </>
            )}

            {generationStatus === 'processing' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8"
              >
                <div className="text-center mb-8">
                  <Loader2 className="w-16 h-16 text-violet-500 animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-zinc-100 dark:text-zinc-100 light:text-gray-900 mb-2">
                    {targetType === 'database' || targetType === 'cloud' ? 'Deploying to Database' : 'Generating Output'}
                  </h3>
                  <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-gray-600">
                    Please wait while we process your model
                  </p>
                </div>

                <ProgressBar
                  progress={generationProgress}
                  message={generationMessage}
                  animated
                />
              </motion.div>
            )}

            {generationStatus === 'complete' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  className="text-center"
                >
                  <CheckCircle2 className="w-24 h-24 text-emerald-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-zinc-100 dark:text-zinc-100 light:text-gray-900 mb-3">
                    Generation Complete!
                  </h3>
                  <p className="text-zinc-400 dark:text-zinc-400 light:text-gray-600 mb-6">
                    {targetType === 'database' || targetType === 'cloud'
                      ? 'Successfully deployed your model to the database'
                      : `Generated ${generatedFile?.name} (${generatedFile?.size})`}
                  </p>

                  <div className="flex items-center justify-center gap-4">
                    {(targetType === 'file') && (
                      <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium"
                      >
                        <Download className="w-5 h-5" />
                        Download File
                      </button>
                    )}
                    {(targetType === 'database' || targetType === 'cloud') && (
                      <button className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium">
                        <Send className="w-5 h-5" />
                        Open Database
                      </button>
                    )}
                    <button className="px-6 py-3 border border-zinc-700 dark:border-zinc-700 light:border-gray-300 text-zinc-300 dark:text-zinc-300 light:text-gray-700 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-gray-50 rounded-lg font-medium">
                      View Summary
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <WizardLayout
        title="Forward Engineering"
        description="Generate database scripts and deploy models to target databases"
        steps={wizardSteps}
        currentStep={currentStep}
        icon={<ArrowRightLeft className="w-8 h-8" />}
        onNext={() => setCurrentStep(prev => prev + 1)}
        onBack={() => setCurrentStep(prev => prev - 1)}
        nextLabel={currentStep === 3 ? 'Finish' : 'Next Step'}
        nextDisabled={
          (currentStep === 1 && !canProceedToStep2) ||
          (currentStep === 2 && !canProceedToStep3) ||
          (currentStep === 3 && generationStatus !== 'complete')
        }
        hideNavigation={currentStep === 3 && generationStatus !== 'idle'}
      >
        {renderStepContent()}
      </WizardLayout>

      <Toast
        {...toast}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </>
  );
}
