'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  Database,
  FileCode,
  Server,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
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
  ArrowRight,
  ArrowLeft,
  Zap,
  FileText,
  Users,
  Clock,
  Star,
  FolderOpen,
  BarChart3,
  Hash,
  Key,
  Table,
  Layers,
  GitMerge,
  RefreshCw,
  Save,
  Play,
  Pause,
  SkipForward,
  ChevronLeft
} from 'lucide-react';

// Type definitions
type CompareStep = 'source' | 'options' | 'objects' | 'advanced' | 'results';
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

  const [currentStep, setCurrentStep] = useState<CompareStep>('source');
  const [baselineSourceType, setBaselineSourceType] = useState<SourceType>('library');
  const [targetSourceType, setTargetSourceType] = useState<SourceType>('library');
  const [selectedBaseline, setSelectedBaseline] = useState<Model | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<Model | null>(null);
  const [compareType, setCompareType] = useState<CompareType>('complete');
  const [direction, setDirection] = useState<Direction>('bidirectional');
  const [conflictResolution, setConflictResolution] = useState<ConflictResolution>('favor-baseline');
  const [showModelBrowser, setShowModelBrowser] = useState<'baseline' | 'target' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

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
    { key: 'source', label: 'Source Selection', icon: <Database className="w-4 h-4" /> },
    { key: 'options', label: 'Compare Options', icon: <Settings className="w-4 h-4" /> },
    { key: 'objects', label: 'Object Selection', icon: <CheckCircle className="w-4 h-4" /> },
    { key: 'advanced', label: 'Advanced', icon: <Zap className="w-4 h-4" /> },
    { key: 'results', label: 'Results', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const getStepIndex = (step: CompareStep) => steps.findIndex(s => s.key === step);

  const canProceed = () => {
    switch (currentStep) {
      case 'source':
        return selectedBaseline && selectedTarget;
      case 'options':
        return true;
      case 'objects':
        return true;
      case 'advanced':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].key as CompareStep);
    }
    if (currentStep === 'advanced') {
      handleRunComparison();
    }
  };

  const handleBack = () => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].key as CompareStep);
    }
  };

  const handleStepClick = (step: CompareStep) => {
    const targetIndex = getStepIndex(step);
    const currentIndex = getStepIndex(currentStep);
    if (targetIndex <= currentIndex) {
      setCurrentStep(step);
    }
  };

  const handleRunComparison = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setShowResults(true);
      setCurrentStep('results');
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

  const ModelPreview = ({ model, onSelect }: { model: Model | null; onSelect: () => void }) => (
    <div className="bg-zinc-800/50 rounded-lg p-4 h-64">
      {model ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{model.name}</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-300">{model.entities} Entities</span>
            </div>
            <div className="flex items-center gap-2">
              <Link className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-300">{model.relationships} Relationships</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-300">{model.views} Views</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-300">{model.domains} Domains</span>
            </div>
          </div>
          <div className="pt-2 border-t border-zinc-700 space-y-1 text-xs text-zinc-400">
            <div>Last Modified: {model.lastModified}</div>
            <div>Version: {model.version}</div>
            <div>Author: {model.author}</div>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-zinc-500">
          <div className="text-center">
            <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Please select a model</p>
          </div>
        </div>
      )}
      <button
        onClick={onSelect}
        className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors"
      >
        {model ? 'Change Selection' : 'Browse Models'}
      </button>
    </div>
  );

  const ModelBrowser = ({ onSelect, onClose }: { onSelect: (model: Model) => void; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-3xl border border-gray-200 dark:border-zinc-800">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-lg font-medium">Select Model from Library</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-400" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-xs bg-zinc-700 px-2 py-1 rounded">v{model.version}</span>
                    </div>
                    <div className="text-sm text-zinc-400">
                      {model.entities} entities • {model.relationships} relationships • Updated {model.lastModified}
                    </div>
                    {model.compatibility && (
                      <div className="flex items-center gap-2 mt-2">
                        {getCompatibilityIcon(model.compatibility)}
                        <span className="text-xs text-zinc-400">
                          {model.compatibility === 'high' && 'Compatible with baseline'}
                          {model.compatibility === 'medium' && 'Partial compatibility'}
                          {model.compatibility === 'low' && 'Low compatibility'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="p-4 border-t border-zinc-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Complete Compare</h1>
        <p className="text-gray-600 dark:text-zinc-400">Compare and merge data models with intelligent conflict resolution</p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepIndex = getStepIndex(step.key as CompareStep);
            const currentIndex = getStepIndex(currentStep);
            const isActive = step.key === currentStep;
            const isCompleted = stepIndex < currentIndex;
            const isClickable = stepIndex <= currentIndex;

            return (
              <React.Fragment key={step.key}>
                <button
                  onClick={() => isClickable && handleStepClick(step.key as CompareStep)}
                  disabled={!isClickable}
                  className={`flex items-center gap-2 ${
                    isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                >
                  <div className={`flex items-center gap-2 ${
                    isActive ? 'text-purple-400' :
                    isCompleted ? 'text-emerald-500' :
                    'text-gray-500 dark:text-zinc-500'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      isActive ? 'border-purple-400 bg-purple-400/20' :
                      isCompleted ? 'border-emerald-500 bg-emerald-500/20' :
                      'border-gray-300 dark:border-zinc-600 bg-gray-100 dark:bg-zinc-800'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    stepIndex < currentIndex ? 'bg-emerald-500' : 'bg-zinc-700'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
        {/* Source Selection Step */}
        {currentStep === 'source' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Select models to compare</h2>
              <p className="text-gray-600 dark:text-zinc-400">Choose your baseline and target models from any source</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Baseline Model */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-purple-400">Baseline Model (Left)</h3>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700 dark:text-zinc-300">Source Type</div>
                  <div className="space-y-2">
                    {[
                      { value: 'library', label: 'Model Library', icon: <Database className="w-4 h-4" /> },
                      { value: 'file', label: 'Script File (.sql, .ddl)', icon: <FileCode className="w-4 h-4" /> },
                      { value: 'database', label: 'Database Connection', icon: <Server className="w-4 h-4" /> }
                    ].map(option => (
                      <label key={option.value} className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
                        <input
                          type="radio"
                          name="baseline-source"
                          value={option.value}
                          checked={baselineSourceType === option.value}
                          onChange={(e) => setBaselineSourceType(e.target.value as SourceType)}
                          className="text-purple-500"
                        />
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span>{option.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {baselineSourceType === 'library' && (
                  <div className="space-y-3">
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <select
                        className="w-full bg-transparent text-zinc-100 focus:outline-none"
                        value={selectedBaseline?.id || ''}
                        onChange={(e) => {
                          const model = modelLibrary.find(m => m.id === e.target.value);
                          setSelectedBaseline(model || null);
                        }}
                      >
                        <option value="">Select baseline model</option>
                        {modelLibrary.map(model => (
                          <option key={model.id} value={model.id}>{model.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="text-sm font-medium text-zinc-300">Model Preview</div>
                    <ModelPreview
                      model={selectedBaseline}
                      onSelect={() => setShowModelBrowser('baseline')}
                    />
                  </div>
                )}
              </div>

              {/* Target Model */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-emerald-400">Target Model (Right)</h3>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-zinc-300">Source Type</div>
                  <div className="space-y-2">
                    {[
                      { value: 'library', label: 'Model Library', icon: <Database className="w-4 h-4" /> },
                      { value: 'file', label: 'Script File (.sql, .ddl)', icon: <FileCode className="w-4 h-4" /> },
                      { value: 'database', label: 'Database Connection', icon: <Server className="w-4 h-4" /> }
                    ].map(option => (
                      <label key={option.value} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors">
                        <input
                          type="radio"
                          name="target-source"
                          value={option.value}
                          checked={targetSourceType === option.value}
                          onChange={(e) => setTargetSourceType(e.target.value as SourceType)}
                          className="text-emerald-500"
                        />
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span>{option.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {targetSourceType === 'library' && (
                  <div className="space-y-3">
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <select
                        className="w-full bg-transparent text-zinc-100 focus:outline-none"
                        value={selectedTarget?.id || ''}
                        onChange={(e) => {
                          const model = modelLibrary.find(m => m.id === e.target.value);
                          setSelectedTarget(model || null);
                        }}
                      >
                        <option value="">Select target model</option>
                        {modelLibrary.map(model => (
                          <option key={model.id} value={model.id}>{model.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="text-sm font-medium text-zinc-300">Model Preview</div>
                    <ModelPreview
                      model={selectedTarget}
                      onSelect={() => setShowModelBrowser('target')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Compare Options Step */}
        {currentStep === 'options' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Configure Comparison</h2>
              <p className="text-zinc-400">Define how models should be compared and what results to generate</p>
            </div>

            <div className="space-y-6">
              {/* Compare Type */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Compare Type</h3>
                <div className="space-y-2">
                  {[
                    {
                      value: 'complete',
                      label: 'Complete Compare',
                      description: 'Compare all aspects: structure, properties, and relationships',
                      badge: 'Recommended'
                    },
                    {
                      value: 'schema',
                      label: 'Schema Compare',
                      description: 'Compare physical database schema elements only',
                      badge: 'Fastest'
                    },
                    {
                      value: 'logical',
                      label: 'Logical Compare',
                      description: 'Compare conceptual model elements and business rules',
                      badge: null
                    },
                    {
                      value: 'custom',
                      label: 'Custom Compare',
                      description: 'Choose specific comparison criteria and object types',
                      badge: 'Advanced'
                    }
                  ].map(option => (
                    <label key={option.value} className="block p-4 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="compare-type"
                          value={option.value}
                          checked={compareType === option.value}
                          onChange={(e) => setCompareType(e.target.value as CompareType)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{option.label}</span>
                            {option.badge && (
                              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                                {option.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-zinc-400 mt-1">{option.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Comparison Scope */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Comparison Scope</h3>
                <div className="space-y-2">
                  {[
                    {
                      value: 'bidirectional',
                      label: 'Bidirectional',
                      description: 'Show all differences between both models'
                    },
                    {
                      value: 'baseline-to-target',
                      label: 'Baseline to Target',
                      description: 'Show what target model is missing or has different'
                    },
                    {
                      value: 'target-to-baseline',
                      label: 'Target to Baseline',
                      description: 'Show what baseline model is missing or has different'
                    }
                  ].map(option => (
                    <label key={option.value} className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors">
                      <input
                        type="radio"
                        name="direction"
                        value={option.value}
                        checked={direction === option.value}
                        onChange={(e) => setDirection(e.target.value as Direction)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <p className="text-sm text-zinc-400">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Output Generation */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Output Generation</h3>
                <div className="space-y-2">
                  {[
                    { id: 'report', label: 'Generate Comparison Report', description: 'Detailed HTML/PDF report with all differences', checked: true },
                    { id: 'delta', label: 'Create Delta Model (Union Model)', description: 'Generate merged model containing all objects from both models', checked: true, badge: 'New!' },
                    { id: 'sync', label: 'Generate Synchronization Script', description: 'Create SQL script to align target model with baseline', checked: false },
                    { id: 'mart', label: 'Export to Model Mart', description: 'Save comparison results to shared model repository', checked: false }
                  ].map(option => (
                    <label key={option.id} className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors">
                      <input type="checkbox" defaultChecked={option.checked} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{option.label}</span>
                          {option.badge && (
                            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                              {option.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-400">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Object Selection Step */}
        {currentStep === 'objects' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Select Objects to Compare</h2>
              <p className="text-zinc-400">Choose which objects to include in the comparison analysis</p>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-400">Selection Mode:</span>
                  <select className="bg-zinc-800 text-zinc-100 rounded px-3 py-1 text-sm">
                    <option>Smart Selection</option>
                    <option>All Objects</option>
                    <option>Changed Only</option>
                    <option>Conflicts Only</option>
                  </select>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search objects..."
                    className="bg-zinc-800 text-zinc-100 rounded pl-10 pr-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Baseline Objects */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Baseline Model Objects</h4>
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-purple-400 hover:text-purple-300">Select All</button>
                      <button className="text-xs text-zinc-400 hover:text-zinc-300">Clear All</button>
                    </div>
                  </div>

                  <div className="bg-zinc-900 rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
                    {['Entities', 'Relationships', 'Views', 'Domains'].map(category => (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                          <ChevronDown className="w-4 h-4" />
                          <Table className="w-4 h-4" />
                          <span>{category} (8 total)</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          {['Customer', 'Order', 'Product', 'Category'].map(item => (
                            <label key={item} className="flex items-center gap-2 text-sm">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>{item}</span>
                              <CheckCircle className="w-3 h-3 text-emerald-500" />
                              <span className="text-xs text-zinc-500">Match</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Objects */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Target Model Objects</h4>
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-emerald-400 hover:text-emerald-300">Select All</button>
                      <button className="text-xs text-zinc-400 hover:text-zinc-300">Clear All</button>
                    </div>
                  </div>

                  <div className="bg-zinc-900 rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
                    {['Entities', 'Relationships', 'Views', 'Domains'].map(category => (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                          <ChevronDown className="w-4 h-4" />
                          <Table className="w-4 h-4" />
                          <span>{category} (15 total)</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          {['Customer', 'Order', 'Product', 'Supplier', 'Invoice'].map(item => (
                            <label key={item} className="flex items-center gap-2 text-sm">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>{item}</span>
                              {item === 'Supplier' || item === 'Invoice' ? (
                                <>
                                  <Plus className="w-3 h-3 text-emerald-500" />
                                  <span className="text-xs text-zinc-500">New</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                                  <span className="text-xs text-zinc-500">Match</span>
                                </>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selection Impact */}
              <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-400">Objects selected:</span>
                    <span className="ml-2 font-medium">24 baseline, 35 target</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Expected differences:</span>
                    <span className="ml-2 font-medium">~15</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Comparison time:</span>
                    <span className="ml-2 font-medium">~45 seconds</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Delta model size:</span>
                    <span className="ml-2 font-medium">~27 entities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Options Step */}
        {currentStep === 'advanced' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Advanced Comparison Settings</h2>
              <p className="text-zinc-400">Fine-tune comparison behavior and conflict resolution</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Comparison Sensitivity */}
              <div className="space-y-3">
                <h3 className="font-medium">Comparison Sensitivity</h3>
                <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                  <div>
                    <div className="text-sm font-medium text-zinc-300 mb-2">Structure Changes</div>
                    <div className="space-y-2">
                      {['Object names', 'Data types', 'Key constraints', 'Relationships'].map(item => (
                        <label key={item} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-300 mb-2">Property Changes</div>
                    <div className="space-y-2">
                      {['Column properties', 'Constraints', 'Comments', 'Physical properties'].map((item, idx) => (
                        <label key={item} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" defaultChecked={idx < 2} className="rounded" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Naming & Matching */}
              <div className="space-y-3">
                <h3 className="font-medium">Naming & Matching</h3>
                <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                  <div>
                    <div className="text-sm font-medium text-zinc-300 mb-2">Name Matching</div>
                    <div className="space-y-2">
                      {['Case sensitive', 'Ignore spaces', 'Fuzzy matching'].map((item, idx) => (
                        <label key={item} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" defaultChecked={idx === 0} className="rounded" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-300 mb-2">Name Transformations</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Remove:</span>
                        <input type="text" placeholder="TBL_" className="bg-zinc-800 text-zinc-100 rounded px-2 py-1 text-sm flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Replace:</span>
                        <input type="text" placeholder="_" className="bg-zinc-800 text-zinc-100 rounded px-2 py-1 text-sm w-16" />
                        <span className="text-sm">→</span>
                        <input type="text" placeholder=" " className="bg-zinc-800 text-zinc-100 rounded px-2 py-1 text-sm w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delta Model Configuration */}
            <div className="space-y-3">
              <h3 className="font-medium">Delta Model Configuration</h3>
              <div className="bg-zinc-800/50 rounded-lg p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-300">Model Name</label>
                  <input
                    type="text"
                    defaultValue="Customer_Order_Enhanced_Delta"
                    className="mt-1 w-full bg-zinc-800 text-zinc-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <div className="text-sm font-medium text-zinc-300 mb-2">Conflict Resolution Strategy</div>
                  <div className="space-y-2">
                    {[
                      { value: 'favor-baseline', label: 'Favor Baseline', description: 'left model wins conflicts' },
                      { value: 'favor-target', label: 'Favor Target', description: 'right model wins conflicts' },
                      { value: 'manual', label: 'Manual Resolution', description: 'prompt for each conflict' },
                      { value: 'best-match', label: 'Best Match', description: 'automatic intelligent resolution' }
                    ].map(option => (
                      <label key={option.value} className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="conflict-resolution"
                          value={option.value}
                          checked={conflictResolution === option.value}
                          onChange={(e) => setConflictResolution(e.target.value as ConflictResolution)}
                          className="mt-1"
                        />
                        <div>
                          <span className="text-sm font-medium">{option.label}</span>
                          <span className="text-xs text-zinc-400 ml-1">({option.description})</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-zinc-300 mb-2">Union Options</div>
                  <div className="space-y-2">
                    {[
                      'Include all objects from both models',
                      'Merge compatible objects and properties',
                      'Preserve all relationships (create new if needed)',
                      'Add merge metadata (track source of objects)',
                      'Create subject areas for each source model'
                    ].map((item, idx) => (
                      <label key={item} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked={idx < 4} className="rounded" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Step */}
        {currentStep === 'results' && showResults && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Comparison Results</h2>
              <p className="text-zinc-400">
                {selectedBaseline?.name} ↔ {selectedTarget?.name}
              </p>
            </div>

            {/* Executive Summary */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Executive Summary
                </h3>
                <button className="text-sm text-purple-400 hover:text-purple-300">Export</button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-bold text-purple-400">58</div>
                  <div className="text-sm text-zinc-400">Total Objects Compared</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-400">23</div>
                  <div className="text-sm text-zinc-400">Differences Found</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">35</div>
                  <div className="text-sm text-zinc-400">Matches</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">78%</div>
                  <div className="text-sm text-zinc-400">Compatibility Score</div>
                </div>
              </div>
            </div>

            {/* Action Center */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" />
                View Full Report
              </button>
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2">
                <GitMerge className="w-4 h-4" />
                Create Delta Model
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Generate Sync Script
              </button>
            </div>

            {/* Comparison Details */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Baseline Model</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Customer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-amber-500" />
                    <span>Order</span>
                    <span className="text-xs text-zinc-500">(Modified)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>Payment</span>
                    <span className="text-xs text-zinc-500">(Missing)</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Target Model</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Customer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-amber-500" />
                    <span>Order</span>
                    <span className="text-xs text-zinc-500">(Modified)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-500" />
                    <span>Payment</span>
                    <span className="text-xs text-zinc-500">(New)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-800">
          <button
            onClick={handleBack}
            disabled={currentStep === 'source'}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              currentStep === 'source'
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            {isRunning && (
              <div className="flex items-center gap-2 text-purple-400">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-400 border-t-transparent" />
                <span className="text-sm">Running comparison...</span>
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={!canProceed() || isRunning}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                !canProceed() || isRunning
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              {currentStep === 'advanced' ? (
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
          </div>
        </div>
      </div>

      {/* Model Browser Modal */}
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
    </div>
  );
};

export default CompleteCompare;