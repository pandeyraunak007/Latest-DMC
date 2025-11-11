'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Table,
  FileText,
  Key,
  List,
  Eye,
  GitBranch,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Download,
  Play,
  CheckSquare,
  Square,
  Code,
  ArrowRight,
  AlertCircle,
  Plus,
  Minus,
  Edit3,
  Copy,
  FileCode,
  Zap,
  Shield,
  RefreshCw,
  Check,
  X,
  FolderOpen,
  HardDrive,
  Warehouse,
  Loader2
} from 'lucide-react';

// Type definitions
type DifferenceType = 'added' | 'deleted' | 'modified' | 'equal';
type ObjectType = 'table' | 'column' | 'index' | 'relationship' | 'view' | 'procedure' | 'constraint' | 'trigger';
type SourceType = 'local-model' | 'mart' | 'database';
type ComparisonStep = 'source-selection' | 'comparing' | 'results';

interface ComparisonObject {
  id: string;
  name: string;
  type: ObjectType;
  difference: DifferenceType;
  sourceValue?: any;
  targetValue?: any;
  details?: string;
  children?: ComparisonObject[];
  expanded?: boolean;
  selected?: boolean;
}

interface ModelSource {
  type: SourceType;
  name: string;
  description?: string;
}

const QuickCompare = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Comparison workflow state
  const [currentStep, setCurrentStep] = useState<ComparisonStep>('source-selection');
  const [sourceModel, setSourceModel] = useState<ModelSource | null>(null);
  const [targetModel, setTargetModel] = useState<ModelSource | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Results state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | ObjectType>('all');
  const [showSqlPreview, setShowSqlPreview] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<ComparisonObject[]>([]);

  const toggleExpand = (id: string) => {
    const updateExpanded = (items: ComparisonObject[]): ComparisonObject[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, expanded: !item.expanded };
        }
        if (item.children) {
          return { ...item, children: updateExpanded(item.children) };
        }
        return item;
      });
    };
    setComparisonResults(updateExpanded(comparisonResults));
  };

  const toggleSelect = (id: string) => {
    const updateSelected = (items: ComparisonObject[]): ComparisonObject[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, selected: !item.selected };
        }
        if (item.children) {
          return { ...item, children: updateSelected(item.children) };
        }
        return item;
      });
    };
    setComparisonResults(updateSelected(comparisonResults));
  };

  const getObjectIcon = (type: ObjectType) => {
    const iconClass = "w-3.5 h-3.5";
    switch (type) {
      case 'table':
        return <Table className={`${iconClass} text-emerald-600 dark:text-emerald-400`} />;
      case 'column':
        return <FileText className={`${iconClass} text-gray-500 dark:text-zinc-500`} />;
      case 'index':
        return <List className={`${iconClass} text-cyan-600 dark:text-cyan-400`} />;
      case 'relationship':
        return <GitBranch className={`${iconClass} text-purple-600 dark:text-purple-400`} />;
      case 'view':
        return <Eye className={`${iconClass} text-indigo-600 dark:text-indigo-400`} />;
      case 'procedure':
        return <Code className={`${iconClass} text-pink-600 dark:text-pink-400`} />;
      case 'constraint':
        return <Shield className={`${iconClass} text-red-600 dark:text-red-400`} />;
      case 'trigger':
        return <Zap className={`${iconClass} text-yellow-600 dark:text-yellow-400`} />;
      default:
        return <Database className={`${iconClass} text-gray-500 dark:text-zinc-500`} />;
    }
  };

  const getDifferenceColor = (difference: DifferenceType) => {
    switch (difference) {
      case 'added':
        return 'bg-emerald-50 dark:bg-emerald-950/20 border-l-2 border-emerald-500';
      case 'deleted':
        return 'bg-red-50 dark:bg-red-950/20 border-l-2 border-red-500';
      case 'modified':
        return 'bg-amber-50 dark:bg-amber-950/20 border-l-2 border-amber-500';
      default:
        return '';
    }
  };

  const getDifferenceBadge = (difference: DifferenceType) => {
    switch (difference) {
      case 'added':
        return <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded flex items-center gap-1"><Plus className="w-3 h-3" /> ADDED</span>;
      case 'deleted':
        return <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-[10px] font-bold rounded flex items-center gap-1"><Minus className="w-3 h-3" /> DELETED</span>;
      case 'modified':
        return <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded flex items-center gap-1"><Edit3 className="w-3 h-3" /> MODIFIED</span>;
      case 'equal':
        return <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-[10px] font-bold rounded flex items-center gap-1"><Check className="w-3 h-3" /> EQUAL</span>;
    }
  };

  const renderComparisonRow = (obj: ComparisonObject, depth: number = 0) => {
    if (selectedFilter !== 'all' && obj.type !== selectedFilter && obj.difference !== 'equal') {
      return null;
    }

    return (
      <React.Fragment key={obj.id}>
        <div className={`grid grid-cols-12 border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors ${getDifferenceColor(obj.difference)}`}>
          {/* Select Checkbox + Name */}
          <div className="col-span-4 px-4 py-3 flex items-center gap-2" style={{ paddingLeft: `${depth * 24 + 16}px` }}>
            <button
              onClick={() => toggleSelect(obj.id)}
              className="flex-shrink-0"
            >
              {obj.selected ? (
                <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <Square className="w-4 h-4 text-gray-400 dark:text-zinc-600" />
              )}
            </button>

            {obj.children && obj.children.length > 0 && (
              <button
                onClick={() => toggleExpand(obj.id)}
                className="flex-shrink-0 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded p-0.5"
              >
                {obj.expanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                )}
              </button>
            )}

            {getObjectIcon(obj.type)}

            <span className="text-sm font-medium text-gray-900 dark:text-zinc-100">{obj.name}</span>
          </div>

          {/* Object Type */}
          <div className="col-span-2 px-4 py-3 flex items-center">
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded uppercase font-semibold">
              {obj.type}
            </span>
          </div>

          {/* Difference Type */}
          <div className="col-span-2 px-4 py-3 flex items-center">
            {getDifferenceBadge(obj.difference)}
          </div>

          {/* Details / Diff Description */}
          <div className="col-span-4 px-4 py-3">
            {obj.details ? (
              <div className="text-xs text-gray-600 dark:text-zinc-400">
                {obj.sourceValue && (
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 dark:text-red-400 line-through">{obj.sourceValue}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="text-emerald-600 dark:text-emerald-400">{obj.targetValue}</span>
                  </div>
                )}
                {!obj.sourceValue && obj.targetValue && (
                  <span className="text-emerald-600 dark:text-emerald-400">{obj.targetValue}</span>
                )}
                {obj.sourceValue && !obj.targetValue && (
                  <span className="text-red-600 dark:text-red-400">{obj.sourceValue}</span>
                )}
                <div className="mt-1 text-[11px] text-gray-500 dark:text-zinc-500">{obj.details}</div>
              </div>
            ) : (
              <span className="text-xs text-gray-400 dark:text-zinc-600 italic">No changes</span>
            )}
          </div>
        </div>

        {/* Render children */}
        {obj.expanded && obj.children && obj.children.map(child => renderComparisonRow(child, depth + 1))}
      </React.Fragment>
    );
  };

  // Run comparison function
  const runComparison = async () => {
    if (!sourceModel || !targetModel) return;

    setCurrentStep('comparing');
    setIsComparing(true);

    // Simulate comparison process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Load mock data for demonstration
    setComparisonResults(mockComparisonData);
    setIsComparing(false);
    setCurrentStep('results');
  };

  const selectedCount = comparisonResults.filter(obj => obj.selected || obj.children?.some(c => c.selected)).length;
  const totalChanges = comparisonResults.filter(obj => obj.difference !== 'equal').length;

  // Source Selection View
  if (currentStep === 'source-selection') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Quick Compare</h1>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Select source and target models to compare
            </p>
          </div>

          {/* Source Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Source Model */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-purple-600 rounded-full" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100">Source Model</h2>
              </div>

              {[
                {
                  type: 'local-model' as SourceType,
                  icon: <FolderOpen className="w-8 h-8" />,
                  title: 'Local Model',
                  description: 'Select from your local model files',
                  color: 'blue'
                },
                {
                  type: 'mart' as SourceType,
                  icon: <Warehouse className="w-8 h-8" />,
                  title: 'Mart Catalog',
                  description: 'Compare from enterprise data mart',
                  color: 'emerald'
                },
                {
                  type: 'database' as SourceType,
                  icon: <HardDrive className="w-8 h-8" />,
                  title: 'Database',
                  description: 'Connect to live database schema',
                  color: 'amber'
                }
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => setSourceModel({ type: option.type, name: option.title })}
                  className={`w-full p-6 border-2 rounded-lg transition-all text-left ${
                    sourceModel?.type === option.type
                      ? `border-${option.color}-600 bg-${option.color}-50 dark:bg-${option.color}-950/20 shadow-lg`
                      : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      sourceModel?.type === option.type
                        ? `bg-${option.color}-100 dark:bg-${option.color}-900/30 text-${option.color}-600 dark:text-${option.color}-400`
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400'
                    }`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-zinc-100 mb-1">{option.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-zinc-400">{option.description}</p>
                      {sourceModel?.type === option.type && (
                        <div className="mt-3">
                          <input
                            type="text"
                            placeholder={`Enter ${option.title.toLowerCase()} name...`}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            onChange={(e) => setSourceModel({ ...sourceModel, name: e.target.value || option.title })}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Target Model */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100">Target Model</h2>
              </div>

              {[
                {
                  type: 'local-model' as SourceType,
                  icon: <FolderOpen className="w-8 h-8" />,
                  title: 'Local Model',
                  description: 'Select from your local model files',
                  color: 'blue'
                },
                {
                  type: 'mart' as SourceType,
                  icon: <Warehouse className="w-8 h-8" />,
                  title: 'Mart Catalog',
                  description: 'Compare from enterprise data mart',
                  color: 'emerald'
                },
                {
                  type: 'database' as SourceType,
                  icon: <HardDrive className="w-8 h-8" />,
                  title: 'Database',
                  description: 'Connect to live database schema',
                  color: 'amber'
                }
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => setTargetModel({ type: option.type, name: option.title })}
                  className={`w-full p-6 border-2 rounded-lg transition-all text-left ${
                    targetModel?.type === option.type
                      ? `border-${option.color}-600 bg-${option.color}-50 dark:bg-${option.color}-950/20 shadow-lg`
                      : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      targetModel?.type === option.type
                        ? `bg-${option.color}-100 dark:bg-${option.color}-900/30 text-${option.color}-600 dark:text-${option.color}-400`
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400'
                    }`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-zinc-100 mb-1">{option.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-zinc-400">{option.description}</p>
                      {targetModel?.type === option.type && (
                        <div className="mt-3">
                          <input
                            type="text"
                            placeholder={`Enter ${option.title.toLowerCase()} name...`}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            onChange={(e) => setTargetModel({ ...targetModel, name: e.target.value || option.title })}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={runComparison}
              disabled={!sourceModel || !targetModel}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Run Comparison
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Comparing View (Loading State)
  if (currentStep === 'comparing') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Comparing Models...</h2>
          <p className="text-gray-600 dark:text-zinc-400 mb-4">
            Analyzing {sourceModel?.name} vs {targetModel?.name}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-zinc-500">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span>Detecting differences</span>
          </div>
        </div>
      </div>
    );
  }

  // Results View
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Quick Compare Results</h1>
          <button
            onClick={() => {
              setCurrentStep('source-selection');
              setComparisonResults([]);
            }}
            className="px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            New Comparison
          </button>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <div className="w-2 h-2 bg-purple-600 rounded-full" />
            <span className="font-medium text-purple-700 dark:text-purple-400">Source:</span>
            <span className="text-gray-700 dark:text-zinc-300">{sourceModel?.name}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
            <div className="w-2 h-2 bg-emerald-600 rounded-full" />
            <span className="font-medium text-emerald-700 dark:text-emerald-400">Target:</span>
            <span className="text-gray-700 dark:text-zinc-300">{targetModel?.name}</span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-180px)]">
        {/* Left Panel - Filters */}
        <div className="col-span-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
            <h3 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-zinc-300">Filter by Object Type</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {[
              { type: 'all', label: 'All Objects', icon: <Database className="w-4 h-4" />, count: totalChanges },
              { type: 'table', label: 'Tables', icon: <Table className="w-4 h-4" />, count: 2 },
              { type: 'column', label: 'Columns', icon: <FileText className="w-4 h-4" />, count: 5 },
              { type: 'index', label: 'Indexes', icon: <List className="w-4 h-4" />, count: 1 },
              { type: 'relationship', label: 'Relationships', icon: <GitBranch className="w-4 h-4" />, count: 1 },
              { type: 'view', label: 'Views', icon: <Eye className="w-4 h-4" />, count: 1 },
              { type: 'procedure', label: 'Procedures', icon: <Code className="w-4 h-4" />, count: 0 },
              { type: 'constraint', label: 'Constraints', icon: <Shield className="w-4 h-4" />, count: 1 },
              { type: 'trigger', label: 'Triggers', icon: <Zap className="w-4 h-4" />, count: 0 }
            ].map(filter => (
              <button
                key={filter.type}
                onClick={() => setSelectedFilter(filter.type as any)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors ${
                  selectedFilter === filter.type
                    ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-medium'
                    : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {filter.icon}
                  <span>{filter.label}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedFilter === filter.type
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
            <h4 className="text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:text-zinc-400 mb-2">Color Legend</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-emerald-500 rounded" />
                <span className="text-gray-700 dark:text-zinc-300">Added (new in source)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span className="text-gray-700 dark:text-zinc-300">Deleted (removed)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-amber-500 rounded" />
                <span className="text-gray-700 dark:text-zinc-300">Modified (changed)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table Area */}
        <div className="col-span-9 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search objects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded pl-8 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-600 dark:text-zinc-400">Showing</span>
                <span className="font-bold text-gray-900 dark:text-zinc-100">{totalChanges}</span>
                <span className="text-gray-600 dark:text-zinc-400">differences</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                Export HTML
              </button>
              <button
                onClick={() => setShowSqlPreview(!showSqlPreview)}
                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5" />
                Generate SQL ({selectedCount})
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 bg-gray-100 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 text-xs font-semibold text-gray-700 dark:text-zinc-300 sticky top-0 z-10">
            <div className="col-span-4 px-4 py-3">Object Name</div>
            <div className="col-span-2 px-4 py-3">Type</div>
            <div className="col-span-2 px-4 py-3">Status</div>
            <div className="col-span-4 px-4 py-3">Details</div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto">
            {comparisonResults.map(obj => renderComparisonRow(obj, 0))}
          </div>
        </div>
      </div>

      {/* SQL Preview Modal */}
      <AnimatePresence>
        {showSqlPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setShowSqlPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-4xl max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">Synchronization Script Preview</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
                    {selectedCount} changes selected • Review and apply
                  </p>
                </div>
                <button
                  onClick={() => setShowSqlPreview(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SQL Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <pre className="bg-gray-900 dark:bg-black text-emerald-400 p-4 rounded-lg text-xs font-mono overflow-x-auto">
{`-- Synchronization Script
-- Generated: ${new Date().toLocaleString()}
-- Selected changes: ${selectedCount}

-- Add new columns
ALTER TABLE Customers ADD COLUMN email_address VARCHAR(255);

-- Modify existing columns
ALTER TABLE Customers ALTER COLUMN customer_id TYPE BIGINT;

-- Drop columns
ALTER TABLE Customers DROP COLUMN phone_number;

-- Add indexes
CREATE INDEX idx_customers_email ON Customers(email_address);

-- Update constraints
ALTER TABLE Orders ADD CONSTRAINT fk_customer_id
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id);`}
                </pre>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Copy to Clipboard
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSqlPreview(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Apply Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mock comparison data
const mockComparisonData: ComparisonObject[] = [
  {
    id: 't1',
    name: 'Customers',
    type: 'table',
    difference: 'modified',
    details: '3 columns modified, 1 added, 1 deleted',
    selected: false,
    expanded: true,
    children: [
      {
        id: 't1-c1',
        name: 'customer_id',
        type: 'column',
        difference: 'modified',
        sourceValue: 'INT',
        targetValue: 'BIGINT',
        details: 'Data type changed',
        selected: true
      },
      {
        id: 't1-c2',
        name: 'email_address',
        type: 'column',
        difference: 'added',
        targetValue: 'VARCHAR(255)',
        details: 'New column',
        selected: true
      },
      {
        id: 't1-c3',
        name: 'phone_number',
        type: 'column',
        difference: 'deleted',
        sourceValue: 'VARCHAR(20)',
        details: 'Column removed',
        selected: false
      },
      {
        id: 't1-i1',
        name: 'idx_customers_email',
        type: 'index',
        difference: 'added',
        targetValue: 'BTREE (email_address)',
        details: 'New index on email_address',
        selected: true
      }
    ]
  },
  {
    id: 't2',
    name: 'Orders',
    type: 'table',
    difference: 'modified',
    details: '1 constraint added',
    selected: false,
    expanded: true,
    children: [
      {
        id: 't2-fk1',
        name: 'fk_customer_id',
        type: 'relationship',
        difference: 'added',
        targetValue: 'References Customers(customer_id)',
        details: 'Foreign key relationship',
        selected: true
      }
    ]
  },
  {
    id: 'v1',
    name: 'vw_customer_orders',
    type: 'view',
    difference: 'modified',
    details: 'View definition changed',
    sourceValue: 'SELECT * FROM orders',
    targetValue: 'SELECT o.*, c.email_address FROM orders o JOIN customers c',
    selected: false
  }
];

export default QuickCompare;
