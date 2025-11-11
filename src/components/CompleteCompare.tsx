'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  FileCode,
  Server,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Download,
  Upload,
  GitBranch,
  Link,
  Eye,
  Settings,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Plus,
  Zap,
  FileText,
  Clock,
  Table,
  Layers,
  GitMerge,
  RefreshCw,
  Play,
  ChevronLeft,
  Warehouse,
  BarChart3,
  Key,
  Loader2,
  CheckCircle2
} from 'lucide-react';

// Type definitions
type CompareStep = 1 | 2 | 3 | 4 | 5;
type SourceType = 'library' | 'file' | 'database';
type CompareType = 'complete' | 'schema' | 'logical' | 'custom';
type Direction = 'bidirectional' | 'baseline-to-target' | 'target-to-baseline';
type ConflictResolution = 'favor-baseline' | 'favor-target' | 'manual' | 'best-match';

interface Model {
  id: string;
  name: string;
  entities: number;
  relationships: number;
  views: number;
  domains: number;
  lastModified: string;
  version: string;
  author: string;
  compatibility?: 'high' | 'medium' | 'low';
}

interface ComparisonResult {
  type: 'entity' | 'relationship' | 'view' | 'domain';
  name: string;
  status: 'match' | 'modified' | 'new' | 'missing' | 'conflict';
  details?: string;
  children?: ComparisonResult[];
}

const CompleteCompare = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [currentStep, setCurrentStep] = useState<CompareStep>(1);

  // Step 1: Source Selection
  const [baselineSourceType, setBaselineSourceType] = useState<SourceType>('library');
  const [targetSourceType, setTargetSourceType] = useState<SourceType>('library');
  const [selectedBaseline, setSelectedBaseline] = useState<Model | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<Model | null>(null);

  // Step 2: Compare Options
  const [compareType, setCompareType] = useState<CompareType>('complete');
  const [direction, setDirection] = useState<Direction>('bidirectional');
  const [outputOptions, setOutputOptions] = useState({
    report: true,
    delta: true,
    sync: false,
    mart: false
  });

  // Step 3: Object Selection
  const [selectionMode, setSelectionMode] = useState('smart');
  const [searchTerm, setSearchTerm] = useState('');

  // Step 4: Advanced Options
  const [conflictResolution, setConflictResolution] = useState<ConflictResolution>('favor-baseline');
  const [deltaModelName, setDeltaModelName] = useState('Customer_Order_Enhanced_Delta');

  // Step 5: Results
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [showModelBrowser, setShowModelBrowser] = useState<'baseline' | 'target' | null>(null);

  // Sample models for the library
  const modelLibrary: Model[] = [
    {
      id: '1',
      name: 'Customer_Order_Model',
      entities: 8,
      relationships: 12,
      views: 3,
      domains: 4,
      lastModified: '2 hours ago',
      version: '1.2',
      author: 'John Smith',
      compatibility: 'high'
    },
    {
      id: '2',
      name: 'E_Commerce_Enhanced',
      entities: 15,
      relationships: 23,
      views: 8,
      domains: 6,
      lastModified: 'Yesterday',
      version: '2.1',
      author: 'Jane Doe',
      compatibility: 'high'
    },
    {
      id: '3',
      name: 'Product_Catalog_v3',
      entities: 12,
      relationships: 18,
      views: 5,
      domains: 4,
      lastModified: 'Last week',
      version: '3.0',
      author: 'Mike Johnson',
      compatibility: 'medium'
    },
    {
      id: '4',
      name: 'User_Management_System',
      entities: 6,
      relationships: 8,
      views: 2,
      domains: 3,
      lastModified: '2 weeks ago',
      version: '1.5',
      author: 'Sarah Wilson',
      compatibility: 'low'
    }
  ];

  const steps = [
    { id: 1, title: 'Source Selection', description: 'Choose models to compare' },
    { id: 2, title: 'Compare Options', description: 'Configure comparison settings' },
    { id: 3, title: 'Object Selection', description: 'Select objects to compare' },
    { id: 4, title: 'Advanced', description: 'Fine-tune comparison' },
    { id: 5, title: 'Results', description: 'Review comparison results' }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedBaseline && selectedTarget;
      case 2:
      case 3:
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      if (currentStep === 4) {
        handleRunComparison();
      } else {
        setCurrentStep((currentStep + 1) as CompareStep);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as CompareStep);
    }
  };

  const handleRunComparison = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setShowResults(true);
      setCurrentStep(5);
    }, 2000);
  };

  const getCompatibilityIcon = (compatibility?: 'high' | 'medium' | 'low') => {
    switch (compatibility) {
      case 'high':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'low':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const ModelPreview = ({ model, type }: { model: Model | null; type: 'baseline' | 'target' }) => {
    const accentColor = type === 'baseline' ? 'purple' : 'emerald';

    return (
      <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4">
        {model ? (
          <div className="space-y-3">
            <div className={`flex items-center gap-2 text-${accentColor}-500`}>
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-medium text-sm">{model.name}</span>
              <span className="text-xs bg-gray-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-gray-600 dark:text-zinc-400">
                v{model.version}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-zinc-400">
                <Table className="w-3.5 h-3.5" />
                <span>{model.entities} Entities</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-zinc-400">
                <Link className="w-3.5 h-3.5" />
                <span>{model.relationships} Relations</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-zinc-400">
                <Eye className="w-3.5 h-3.5" />
                <span>{model.views} Views</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-zinc-400">
                <Layers className="w-3.5 h-3.5" />
                <span>{model.domains} Domains</span>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-zinc-800 space-y-0.5 text-[10px] text-gray-500 dark:text-zinc-500">
              <div>Modified: {model.lastModified}</div>
              <div>Author: {model.author}</div>
            </div>
            <button
              onClick={() => setShowModelBrowser(type)}
              className={`text-xs text-${accentColor}-600 dark:text-${accentColor}-400 hover:text-${accentColor}-700 dark:hover:text-${accentColor}-300`}
            >
              Change Selection
            </button>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-gray-400 dark:text-zinc-600">
            <div className="text-center">
              <Database className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No model selected</p>
              <button
                onClick={() => setShowModelBrowser(type)}
                className={`mt-2 text-xs text-${accentColor}-600 dark:text-${accentColor}-400 hover:text-${accentColor}-700 dark:hover:text-${accentColor}-300`}
              >
                Browse Models
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ModelBrowser = ({ onSelect, onClose }: { onSelect: (model: Model) => void; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl"
      >
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Select Model from Library</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto space-y-2">
          {modelLibrary
            .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(model => (
              <div
                key={model.id}
                onClick={() => {
                  onSelect(model);
                  onClose();
                }}
                className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{model.name}</span>
                      <span className="text-xs bg-gray-200 dark:bg-zinc-700 px-2 py-0.5 rounded">v{model.version}</span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-zinc-400">
                      {model.entities} entities • {model.relationships} relationships • Updated {model.lastModified}
                    </div>
                    {model.compatibility && (
                      <div className="flex items-center gap-2 mt-2">
                        {getCompatibilityIcon(model.compatibility)}
                        <span className="text-xs text-gray-500 dark:text-zinc-500">
                          {model.compatibility === 'high' && 'High compatibility'}
                          {model.compatibility === 'medium' && 'Medium compatibility'}
                          {model.compatibility === 'low' && 'Low compatibility'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Baseline Model */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-3">
              Baseline Model (Left)
            </h3>

            {/* Source Type */}
            <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
              Source Type
            </label>
            <div className="inline-flex bg-gray-100 dark:bg-zinc-900 rounded p-0.5 gap-0.5">
              <button
                onClick={() => setBaselineSourceType('library')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  baselineSourceType === 'library'
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Library
              </button>
              <button
                onClick={() => setBaselineSourceType('file')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  baselineSourceType === 'file'
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                File
              </button>
              <button
                onClick={() => setBaselineSourceType('database')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  baselineSourceType === 'database'
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                Database
              </button>
            </div>
          </div>

          {/* Model Selection */}
          {baselineSourceType === 'library' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                Select Model
              </label>
              <select
                className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                value={selectedBaseline?.id || ''}
                onChange={(e) => {
                  const model = modelLibrary.find(m => m.id === e.target.value);
                  setSelectedBaseline(model || null);
                }}
              >
                <option value="">Choose baseline model...</option>
                {modelLibrary.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>

              {selectedBaseline && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ModelPreview model={selectedBaseline} type="baseline" />
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* Target Model */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
              Target Model (Right)
            </h3>

            {/* Source Type */}
            <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
              Source Type
            </label>
            <div className="inline-flex bg-gray-100 dark:bg-zinc-900 rounded p-0.5 gap-0.5">
              <button
                onClick={() => setTargetSourceType('library')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  targetSourceType === 'library'
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Library
              </button>
              <button
                onClick={() => setTargetSourceType('file')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  targetSourceType === 'file'
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                File
              </button>
              <button
                onClick={() => setTargetSourceType('database')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  targetSourceType === 'database'
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                Database
              </button>
            </div>
          </div>

          {/* Model Selection */}
          {targetSourceType === 'library' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                Select Model
              </label>
              <select
                className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                value={selectedTarget?.id || ''}
                onChange={(e) => {
                  const model = modelLibrary.find(m => m.id === e.target.value);
                  setSelectedTarget(model || null);
                }}
              >
                <option value="">Choose target model...</option>
                {modelLibrary.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>

              {selectedTarget && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ModelPreview model={selectedTarget} type="target" />
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      {/* Compare Type */}
      <div>
        <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
          Compare Type
        </label>
        <div className="space-y-2">
          {[
            { value: 'complete', label: 'Complete Compare', description: 'Compare all aspects: structure, properties, and relationships', badge: 'Recommended' },
            { value: 'schema', label: 'Schema Compare', description: 'Compare physical database schema elements only', badge: 'Fastest' },
            { value: 'logical', label: 'Logical Compare', description: 'Compare conceptual model elements and business rules' },
            { value: 'custom', label: 'Custom Compare', description: 'Choose specific comparison criteria and object types', badge: 'Advanced' }
          ].map(option => (
            <label
              key={option.value}
              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
            >
              <input
                type="radio"
                name="compare-type"
                value={option.value}
                checked={compareType === option.value}
                onChange={(e) => setCompareType(e.target.value as CompareType)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{option.label}</span>
                  {option.badge && (
                    <span className="text-[10px] bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded uppercase tracking-wide">
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Comparison Scope */}
      <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
        <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
          Comparison Scope
        </label>
        <div className="space-y-2">
          {[
            { value: 'bidirectional', label: 'Bidirectional', description: 'Show all differences between both models' },
            { value: 'baseline-to-target', label: 'Baseline to Target', description: 'Show what target model is missing or has different' },
            { value: 'target-to-baseline', label: 'Target to Baseline', description: 'Show what baseline model is missing or has different' }
          ].map(option => (
            <label
              key={option.value}
              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
            >
              <input
                type="radio"
                name="direction"
                value={option.value}
                checked={direction === option.value}
                onChange={(e) => setDirection(e.target.value as Direction)}
                className="mt-0.5"
              />
              <div>
                <div className="text-sm font-medium">{option.label}</div>
                <p className="text-xs text-gray-600 dark:text-zinc-400">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Output Generation */}
      <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
        <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
          Output Generation
        </label>
        <div className="space-y-2">
          {[
            { id: 'report', label: 'Generate Comparison Report', description: 'Detailed HTML/PDF report with all differences', checked: outputOptions.report },
            { id: 'delta', label: 'Create Delta Model (Union Model)', description: 'Generate merged model containing all objects from both models', checked: outputOptions.delta, badge: 'New!' },
            { id: 'sync', label: 'Generate Synchronization Script', description: 'Create SQL script to align target model with baseline', checked: outputOptions.sync },
            { id: 'mart', label: 'Export to Model Mart', description: 'Save comparison results to shared model repository', checked: outputOptions.mart }
          ].map(option => (
            <label
              key={option.id}
              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
            >
              <input
                type="checkbox"
                checked={option.checked}
                onChange={(e) => setOutputOptions(prev => ({ ...prev, [option.id]: e.target.checked }))}
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{option.label}</span>
                  {option.badge && (
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded uppercase tracking-wide">
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-zinc-400">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      {/* Object Selection Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <label className="text-[11px] font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide">
            Selection Mode:
          </label>
          <select
            value={selectionMode}
            onChange={(e) => setSelectionMode(e.target.value)}
            className="bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 border border-gray-300 dark:border-zinc-700 rounded px-3 py-1 text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
          >
            <option value="smart">Smart Selection</option>
            <option value="all">All Objects</option>
            <option value="changed">Changed Only</option>
            <option value="conflicts">Conflicts Only</option>
          </select>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search objects..."
            className="bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 border border-gray-300 dark:border-zinc-700 rounded pl-8 pr-3 py-1 text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Object Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Baseline Objects */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400">Baseline Objects</h4>
            <div className="flex items-center gap-2">
              <button className="text-[10px] text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 uppercase tracking-wide">Select All</button>
              <button className="text-[10px] text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 uppercase tracking-wide">Clear</button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 max-h-64 overflow-y-auto space-y-2">
            {['Entities', 'Relationships', 'Views', 'Domains'].map(category => (
              <div key={category} className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-zinc-300">
                  <ChevronDown className="w-3.5 h-3.5" />
                  <Table className="w-3.5 h-3.5" />
                  <span>{category} (8)</span>
                </div>
                <div className="ml-5 space-y-1">
                  {['Customer', 'Order', 'Product', 'Category'].map(item => (
                    <label key={item} className="flex items-center gap-1.5 text-xs cursor-pointer hover:text-gray-900 dark:hover:text-zinc-100">
                      <input type="checkbox" defaultChecked className="rounded w-3 h-3" />
                      <span>{item}</span>
                      <CheckCircle className="w-2.5 h-2.5 text-emerald-500 ml-auto" />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Target Objects */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Target Objects</h4>
            <div className="flex items-center gap-2">
              <button className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 uppercase tracking-wide">Select All</button>
              <button className="text-[10px] text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 uppercase tracking-wide">Clear</button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 max-h-64 overflow-y-auto space-y-2">
            {['Entities', 'Relationships', 'Views', 'Domains'].map(category => (
              <div key={category} className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-zinc-300">
                  <ChevronDown className="w-3.5 h-3.5" />
                  <Table className="w-3.5 h-3.5" />
                  <span>{category} (15)</span>
                </div>
                <div className="ml-5 space-y-1">
                  {['Customer', 'Order', 'Product', 'Supplier', 'Invoice'].map(item => (
                    <label key={item} className="flex items-center gap-1.5 text-xs cursor-pointer hover:text-gray-900 dark:hover:text-zinc-100">
                      <input type="checkbox" defaultChecked className="rounded w-3 h-3" />
                      <span>{item}</span>
                      {item === 'Supplier' || item === 'Invoice' ? (
                        <Plus className="w-2.5 h-2.5 text-emerald-500 ml-auto" />
                      ) : (
                        <CheckCircle className="w-2.5 h-2.5 text-emerald-500 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selection Summary */}
      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-lg">
        <div className="grid grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-gray-600 dark:text-zinc-400">Selected:</span>
            <span className="ml-1.5 font-medium">24 / 35</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-zinc-400">Differences:</span>
            <span className="ml-1.5 font-medium">~15</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-zinc-400">Est. time:</span>
            <span className="ml-1.5 font-medium">~45s</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-zinc-400">Delta size:</span>
            <span className="ml-1.5 font-medium">~27</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      {/* Conflict Resolution */}
      <div>
        <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
          Conflict Resolution Strategy
        </label>
        <div className="space-y-2">
          {[
            { value: 'favor-baseline', label: 'Favor Baseline', description: 'Left model wins conflicts' },
            { value: 'favor-target', label: 'Favor Target', description: 'Right model wins conflicts' },
            { value: 'manual', label: 'Manual Resolution', description: 'Prompt for each conflict' },
            { value: 'best-match', label: 'Best Match', description: 'Automatic intelligent resolution' }
          ].map(option => (
            <label
              key={option.value}
              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
            >
              <input
                type="radio"
                name="conflict-resolution"
                value={option.value}
                checked={conflictResolution === option.value}
                onChange={(e) => setConflictResolution(e.target.value as ConflictResolution)}
                className="mt-0.5"
              />
              <div>
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-gray-600 dark:text-zinc-400 ml-1.5">({option.description})</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Delta Model Name */}
      <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
        <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
          Delta Model Name
        </label>
        <input
          type="text"
          value={deltaModelName}
          onChange={(e) => setDeltaModelName(e.target.value)}
          className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
          placeholder="Enter delta model name..."
        />
      </div>

      {/* Advanced Options */}
      <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
        <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
          Union Options
        </label>
        <div className="space-y-2">
          {[
            'Include all objects from both models',
            'Merge compatible objects and properties',
            'Preserve all relationships (create new if needed)',
            'Add merge metadata (track source of objects)',
            'Create subject areas for each source model'
          ].map((item, idx) => (
            <label
              key={item}
              className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
            >
              <input type="checkbox" defaultChecked={idx < 4} className="rounded w-3.5 h-3.5" />
              <span className="text-xs">{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-5">
      {showResults ? (
        <>
          {/* Executive Summary */}
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Comparison Complete
              </h3>
              <button className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                Export Report
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">58</div>
                <div className="text-[10px] text-gray-600 dark:text-zinc-400 uppercase tracking-wide">Objects Compared</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">23</div>
                <div className="text-[10px] text-gray-600 dark:text-zinc-400 uppercase tracking-wide">Differences Found</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">35</div>
                <div className="text-[10px] text-gray-600 dark:text-zinc-400 uppercase tracking-wide">Matches</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">78%</div>
                <div className="text-[10px] text-gray-600 dark:text-zinc-400 uppercase tracking-wide">Compatibility</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4" />
              View Full Report
            </button>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm">
              <GitMerge className="w-4 h-4" />
              Create Delta Model
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4" />
              Generate Sync Script
            </button>
          </div>

          {/* Comparison Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-3">Baseline Model</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Customer</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                  <span>Order</span>
                  <span className="text-[10px] text-gray-500 dark:text-zinc-500">(Modified)</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                  <span>Payment</span>
                  <span className="text-[10px] text-gray-500 dark:text-zinc-500">(Missing)</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-3">Target Model</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Customer</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                  <span>Order</span>
                  <span className="text-[10px] text-gray-500 dark:text-zinc-500">(Modified)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Payment</span>
                  <span className="text-[10px] text-gray-500 dark:text-zinc-500">(New)</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4" />
            <p className="text-sm text-gray-600 dark:text-zinc-400">Running comparison...</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Complete Compare</h1>
        <p className="text-sm text-gray-600 dark:text-zinc-400">Compare and merge data models with intelligent conflict resolution</p>
      </div>

      {/* Step Indicator */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const isClickable = step.id <= currentStep;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => isClickable && setCurrentStep(step.id)}
                  disabled={!isClickable}
                  className={`flex items-center gap-2 ${
                    isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className={`flex flex-col items-center gap-1 ${
                    isActive ? 'text-purple-600 dark:text-purple-400' :
                    isCompleted ? 'text-emerald-600 dark:text-emerald-400' :
                    'text-gray-400 dark:text-zinc-600'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${
                      isActive ? 'border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-950/20' :
                      isCompleted ? 'border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20' :
                      'border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                    </div>
                    <span className="text-xs font-medium hidden sm:inline">{step.title}</span>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    step.id < currentStep ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-zinc-800'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-1">{steps[currentStep - 1].title}</h2>
          <p className="text-xs text-gray-600 dark:text-zinc-400">{steps[currentStep - 1].description}</p>
        </div>

        {renderStepContent()}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            {isRunning && (
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Running comparison...</span>
              </div>
            )}

            {currentStep < 5 && (
              <button
                onClick={handleNext}
                disabled={!canProceed() || isRunning}
                className={`px-6 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
                  !canProceed() || isRunning
                    ? 'bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {currentStep === 4 ? (
                  <>
                    <Play className="w-4 h-4" />
                    Run Comparison
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Model Browser Modal */}
      <AnimatePresence>
        {showModelBrowser && (
          <ModelBrowser
            onSelect={(model) => {
              if (showModelBrowser === 'baseline') {
                setSelectedBaseline(model);
              } else {
                setSelectedTarget(model);
              }
            }}
            onClose={() => setShowModelBrowser(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompleteCompare;
