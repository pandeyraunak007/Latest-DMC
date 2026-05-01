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
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Copy,
  Trash2,
  MoreVertical,
  Save,
  FolderOpen,
  Package,
  List,
  Shield,
  Code,
  Hash,
  BookOpen,
  Box,
  Workflow,
  FileDown,
  FileSpreadsheet,
  FileType,
  ChevronDown as ChevronDownIcon
} from 'lucide-react';

// Type definitions
type SourceType = 'file' | 'database' | 'mart';
type ComparisonType = 'complete' | 'table-only' | 'column-only' | 'key-only' | 'index-only' | 'relationship-only' | 'custom';
type FilterType = 'all' | 'conflicts' | 'different' | 'equals' | 'left-only' | 'right-only';
type ObjectStatus = 'equal' | 'different' | 'left-only' | 'right-only' | 'conflict';

interface Model {
  id: string;
  name: string;
  source: SourceType;
  path?: string;
  entities: number;
  relationships: number;
}

interface ComparisonObject {
  id: string;
  name: string;
  type: 'model' | 'subject-area' | 'entity' | 'attribute' | 'relationship' | 'key' | 'index' |
        'trigger' | 'view' | 'procedure' | 'function' | 'constraint' | 'domain' | 'udt' |
        'annotation' | 'diagram' | 'sequence' | 'synonym' | 'package' | 'type' | 'schema';
  status: ObjectStatus;
  leftValue?: any;
  rightValue?: any;
  mergeValue?: any;
  children?: ComparisonObject[];
  expanded?: boolean;
}

const CompleteCompare2 = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Step 1: Model Selection
  const [step, setStep] = useState<'selection' | 'comparison'>('selection');
  const [leftModel, setLeftModel] = useState<Model | null>(null);
  const [rightModel, setRightModel] = useState<Model | null>(null);
  const [leftSourceType, setLeftSourceType] = useState<SourceType>('mart');
  const [rightSourceType, setRightSourceType] = useState<SourceType>('mart');

  // File source state
  const [leftFilePath, setLeftFilePath] = useState('');
  const [rightFilePath, setRightFilePath] = useState('');

  // Database connection state
  const [leftDbConfig, setLeftDbConfig] = useState({
    workspace: '',
    username: '',
    password: '',
    environmentType: '' as 'lakehouse' | 'warehouse' | '',
    selectedEnvironment: ''
  });
  const [rightDbConfig, setRightDbConfig] = useState({
    workspace: '',
    username: '',
    password: '',
    environmentType: '' as 'lakehouse' | 'warehouse' | '',
    selectedEnvironment: ''
  });
  const [leftConnectionStatus, setLeftConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [rightConnectionStatus, setRightConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // Step 2: Comparison Configuration
  const [selectedComparisonProfile, setSelectedComparisonProfile] = useState<string>('');
  const [isComparing, setIsComparing] = useState(false);
  const [showComparisonAdvanced, setShowComparisonAdvanced] = useState(false);

  // Comparison View State
  const [viewMode, setViewMode] = useState<'compare' | 'merge'>('merge');
  const [selectedObject, setSelectedObject] = useState<ComparisonObject | null>(null);

  // Comparison Options
  const [comparisonOptions, setComparisonOptions] = useState({
    // Sensitivity
    ignoreCase: false,
    ignoreWhitespace: false,
    // Structure
    compareTables: true,
    compareColumns: true,
    compareDataTypes: true,
    compareNullability: true,
    compareDefaultValues: true,
    // Keys & Constraints
    comparePrimaryKeys: true,
    compareForeignKeys: true,
    compareUniqueConstraints: true,
    compareCheckConstraints: true,
    // Indexes & Performance
    compareIndexes: true,
    compareTriggers: false,
    // Metadata
    compareComments: true,
    compareDescriptions: true,
    // Relationships
    compareRelationships: true,
    // Procedures & Functions
    compareStoredProcedures: false,
    compareFunctions: false,
    compareViews: false,
    // Smart Detection
    detectRenamedObjects: true,
    detectMovedObjects: true
  });

  // Default Comparison Profiles
  const DEFAULT_COMPARISON_PROFILES = {
    complete: {
      compareTables: true,
      compareColumns: true,
      compareDataTypes: true,
      compareNullability: true,
      compareDefaultValues: true,
      comparePrimaryKeys: true,
      compareForeignKeys: true,
      compareUniqueConstraints: true,
      compareCheckConstraints: true,
      compareIndexes: true,
      compareTriggers: true,
      compareComments: true,
      compareDescriptions: true,
      compareRelationships: true,
      compareStoredProcedures: true,
      compareFunctions: true,
      compareViews: true,
      detectRenamedObjects: true,
      detectMovedObjects: true,
      ignoreCase: false,
      ignoreWhitespace: false
    },
    structure: {
      compareTables: true,
      compareColumns: true,
      compareDataTypes: true,
      compareNullability: true,
      compareDefaultValues: true,
      comparePrimaryKeys: true,
      compareForeignKeys: true,
      compareUniqueConstraints: false,
      compareCheckConstraints: false,
      compareIndexes: false,
      compareTriggers: false,
      compareComments: false,
      compareDescriptions: false,
      compareRelationships: true,
      compareStoredProcedures: false,
      compareFunctions: false,
      compareViews: false,
      detectRenamedObjects: true,
      detectMovedObjects: false,
      ignoreCase: false,
      ignoreWhitespace: false
    },
    basic: {
      compareTables: true,
      compareColumns: true,
      compareDataTypes: false,
      compareNullability: false,
      compareDefaultValues: false,
      comparePrimaryKeys: true,
      compareForeignKeys: true,
      compareUniqueConstraints: false,
      compareCheckConstraints: false,
      compareIndexes: false,
      compareTriggers: false,
      compareComments: false,
      compareDescriptions: false,
      compareRelationships: false,
      compareStoredProcedures: false,
      compareFunctions: false,
      compareViews: false,
      detectRenamedObjects: false,
      detectMovedObjects: false,
      ignoreCase: false,
      ignoreWhitespace: false
    }
  };

  // Connection handlers
  const handleTestLeftConnection = async () => {
    setLeftConnectionStatus('testing');
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLeftConnectionStatus('success');
  };

  const handleTestRightConnection = async () => {
    setRightConnectionStatus('testing');
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRightConnectionStatus('success');
  };

  const handleComparisonProfileChange = (profile: string) => {
    setSelectedComparisonProfile(profile);
    if (profile === 'complete') {
      setComparisonOptions(DEFAULT_COMPARISON_PROFILES.complete);
    } else if (profile === 'structure') {
      setComparisonOptions(DEFAULT_COMPARISON_PROFILES.structure);
    } else if (profile === 'basic') {
      setComparisonOptions(DEFAULT_COMPARISON_PROFILES.basic);
    }
  };

  // Export handlers
  const handleExport = (format: 'pdf' | 'excel' | 'html') => {
    console.log(`Exporting comparison report as ${format.toUpperCase()}...`);
    // Simulate export
    alert(`Exporting comparison report as ${format.toUpperCase()}...`);
    setShowExportMenu(false);
  };

  // Step 3: Comparison View
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [comparisonResults, setComparisonResults] = useState<ComparisonObject[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Resolution semantics:
  // - 'left'  : use the left model's value  (for value differences)
  // - 'right' : use the right model's value (for value differences)
  // - 'add'   : include the missing item in the merged model (for left-only / right-only)
  // - 'skip'  : leave the missing item out of the merged model
  type ResolutionChoice = 'left' | 'right' | 'add' | 'skip';
  const [resolutions, setResolutions] = useState<Record<string, ResolutionChoice>>({});
  // Items the system auto-merged on its own (status='different' with a clear mergeValue).
  // User can override an auto-merge — once they do, the id leaves this set and becomes "manual".
  const [autoResolved, setAutoResolved] = useState<Set<string>>(new Set());

  const setResolution = (id: string, choice: ResolutionChoice) => {
    setResolutions(prev => ({ ...prev, [id]: choice }));
    setAutoResolved(prev => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };
  const clearResolution = (id: string) => {
    setResolutions(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setAutoResolved(prev => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const flattenResolvable = (objs: ComparisonObject[]): ComparisonObject[] => {
    const out: ComparisonObject[] = [];
    const walk = (arr: ComparisonObject[]) => {
      arr.forEach(o => {
        if (o.status !== 'equal') out.push(o);
        if (o.children) walk(o.children);
      });
    };
    walk(objs);
    return out;
  };
  const allResolvable    = flattenResolvable(comparisonResults);
  const resolvedCount    = allResolvable.filter(o => resolutions[o.id]).length;
  const autoCount        = allResolvable.filter(o => autoResolved.has(o.id)).length;
  const manualCount      = resolvedCount - autoCount;
  const unresolvedCount  = allResolvable.length - resolvedCount;
  // "Needs decision" = items the user genuinely needs to act on (conflicts, missing items, manual differents)
  const needsDecisionCount = unresolvedCount;
  const allResolved      = unresolvedCount === 0;

  const bulkAddAllMissing = () => {
    setResolutions(prev => {
      const next = { ...prev };
      allResolvable.forEach(o => {
        if (!next[o.id] && (o.status === 'left-only' || o.status === 'right-only')) {
          next[o.id] = 'add';
        }
      });
      return next;
    });
  };
  const resetAllResolutions = () => {
    setResolutions({});
    setAutoResolved(new Set());
  };

  // Mock data for model library
  const modelMart: Model[] = [
    { id: '1', name: 'Customer_Order_Model_v1', source: 'mart', entities: 8, relationships: 12 },
    { id: '2', name: 'Customer_Order_Model_v2', source: 'mart', entities: 10, relationships: 15 },
    { id: '3', name: 'E_Commerce_Base', source: 'mart', entities: 15, relationships: 23 },
    { id: '4', name: 'Product_Catalog', source: 'mart', entities: 12, relationships: 18 }
  ];

  // Mock data for warehouses/lakehouses
  const mockEnvironments = [
    { id: 'lh-1', name: 'Customer Lakehouse', type: 'lakehouse' },
    { id: 'lh-2', name: 'Product Lakehouse', type: 'lakehouse' },
    { id: 'wh-1', name: 'Sales Warehouse', type: 'warehouse' },
    { id: 'wh-2', name: 'Analytics Warehouse', type: 'warehouse' }
  ];

  // Mock comparison results
  const mockComparisonResults: ComparisonObject[] = [
    // Subject Area: Customer Management
    {
      id: 'sa-1',
      name: 'Customer Management',
      type: 'subject-area',
      status: 'different',
      expanded: true,
      children: [
        // Entity: Customer
        {
          id: 'e-1',
          name: 'Customer',
          type: 'entity',
          status: 'different',
          expanded: true,
          children: [
            // Attributes
            {
              id: 'e-1-attr-1',
              name: 'CustomerID',
              type: 'attribute',
              status: 'equal',
              leftValue: { type: 'INT', nullable: false, pk: true },
              rightValue: { type: 'INT', nullable: false, pk: true },
              mergeValue: { type: 'INT', nullable: false, pk: true }
            },
            {
              id: 'e-1-attr-2',
              name: 'CustomerName',
              type: 'attribute',
              status: 'different',
              leftValue: { type: 'VARCHAR(100)', nullable: false },
              rightValue: { type: 'VARCHAR(255)', nullable: false },
              mergeValue: { type: 'VARCHAR(255)', nullable: false }
            },
            {
              id: 'e-1-attr-3',
              name: 'Email',
              type: 'attribute',
              status: 'conflict',
              leftValue: { type: 'VARCHAR(100)', nullable: true },
              rightValue: { type: 'VARCHAR(255)', nullable: false },
              mergeValue: null
            },
            // Column missing on right — clean "+ Add to Right" example
            {
              id: 'e-1-attr-phone',
              name: 'Phone',
              type: 'attribute',
              status: 'left-only',
              leftValue: { type: 'VARCHAR(20)', nullable: true }
            },
            // Column missing on left — clean "+ Add to Left" example
            {
              id: 'e-1-attr-loyalty',
              name: 'LoyaltyPoints',
              type: 'attribute',
              status: 'right-only',
              rightValue: { type: 'INT', nullable: false, default: 0 }
            },
            // Primary Key
            {
              id: 'e-1-pk-1',
              name: 'PK_Customer',
              type: 'key',
              status: 'equal',
              leftValue: { columns: ['CustomerID'], type: 'PRIMARY KEY' },
              rightValue: { columns: ['CustomerID'], type: 'PRIMARY KEY' },
              mergeValue: { columns: ['CustomerID'], type: 'PRIMARY KEY' }
            },
            // Indexes
            {
              id: 'e-1-idx-1',
              name: 'IDX_Customer_Email',
              type: 'index',
              status: 'different',
              leftValue: { columns: ['Email'], unique: false },
              rightValue: { columns: ['Email'], unique: true },
              mergeValue: { columns: ['Email'], unique: true }
            },
            // Triggers
            {
              id: 'e-1-trg-1',
              name: 'TRG_Customer_Audit',
              type: 'trigger',
              status: 'left-only',
              leftValue: { event: 'AFTER UPDATE', action: 'Log to audit table' }
            },
            // Constraints
            {
              id: 'e-1-chk-1',
              name: 'CHK_Email_Format',
              type: 'constraint',
              status: 'different',
              leftValue: { type: 'CHECK', expression: 'Email LIKE "%@%"' },
              rightValue: { type: 'CHECK', expression: 'Email LIKE "%@%.%"' },
              mergeValue: { type: 'CHECK', expression: 'Email LIKE "%@%.%"' }
            }
          ]
        },
        // Entity: Address
        {
          id: 'e-2',
          name: 'Address',
          type: 'entity',
          status: 'equal',
          expanded: false,
          children: []
        },
        // Entity: Payment — whole TABLE missing on left, clean one-click "+ Add to Left" example
        {
          id: 'e-payment',
          name: 'Payment',
          type: 'entity',
          status: 'right-only',
          rightValue: { columns: 4, primaryKey: 'PaymentID', note: 'Tracks payment transactions per order' }
        },
        // Entity: OrderHistory — whole TABLE missing on right, clean one-click "+ Add to Right" example
        {
          id: 'e-orderhistory',
          name: 'OrderHistory',
          type: 'entity',
          status: 'left-only',
          leftValue: { columns: 5, primaryKey: 'HistoryID', note: 'Audit log of order state changes' }
        }
      ]
    },

    // Relationships
    {
      id: 'rel-1',
      name: 'Customer_Places_Order',
      type: 'relationship',
      status: 'different',
      leftValue: { cardinality: '1:N', from: 'Customer', to: 'Order' },
      rightValue: { cardinality: '1:M', from: 'Customer', to: 'Order' },
      mergeValue: { cardinality: '1:M', from: 'Customer', to: 'Order' }
    },
    {
      id: 'rel-2',
      name: 'Order_Contains_Product',
      type: 'relationship',
      status: 'equal',
      leftValue: { cardinality: 'M:N', from: 'Order', to: 'Product' },
      rightValue: { cardinality: 'M:N', from: 'Order', to: 'Product' },
      mergeValue: { cardinality: 'M:N', from: 'Order', to: 'Product' }
    },

    // Views
    {
      id: 'view-1',
      name: 'VW_CustomerOrders',
      type: 'view',
      status: 'different',
      leftValue: { definition: 'SELECT c.*, o.* FROM Customer c LEFT JOIN Order o ON c.CustomerID = o.CustomerID' },
      rightValue: { definition: 'SELECT c.*, o.*, p.* FROM Customer c LEFT JOIN Order o ON c.CustomerID = o.CustomerID LEFT JOIN Product p ON o.ProductID = p.ProductID' },
      mergeValue: { definition: 'SELECT c.*, o.*, p.* FROM Customer c LEFT JOIN Order o ON c.CustomerID = o.CustomerID LEFT JOIN Product p ON o.ProductID = p.ProductID' }
    },
    {
      id: 'view-2',
      name: 'VW_ProductInventory',
      type: 'view',
      status: 'left-only',
      leftValue: { definition: 'SELECT * FROM Product WHERE Quantity > 0' }
    },

    // Stored Procedures
    {
      id: 'proc-1',
      name: 'SP_GetCustomerOrders',
      type: 'procedure',
      status: 'conflict',
      leftValue: { parameters: ['@CustomerID INT'], returns: 'TABLE' },
      rightValue: { parameters: ['@CustomerID INT', '@StartDate DATE'], returns: 'TABLE' },
      mergeValue: null
    },
    {
      id: 'proc-2',
      name: 'SP_UpdateInventory',
      type: 'procedure',
      status: 'equal',
      leftValue: { parameters: ['@ProductID INT', '@Quantity INT'], returns: 'INT' },
      rightValue: { parameters: ['@ProductID INT', '@Quantity INT'], returns: 'INT' },
      mergeValue: { parameters: ['@ProductID INT', '@Quantity INT'], returns: 'INT' }
    },

    // Functions
    {
      id: 'func-1',
      name: 'FN_CalculateDiscount',
      type: 'function',
      status: 'different',
      leftValue: { parameters: ['@Amount DECIMAL'], returns: 'DECIMAL' },
      rightValue: { parameters: ['@Amount DECIMAL', '@DiscountRate DECIMAL'], returns: 'DECIMAL' },
      mergeValue: { parameters: ['@Amount DECIMAL', '@DiscountRate DECIMAL'], returns: 'DECIMAL' }
    },
    {
      id: 'func-2',
      name: 'FN_GetTaxRate',
      type: 'function',
      status: 'right-only',
      rightValue: { parameters: ['@State VARCHAR(2)'], returns: 'DECIMAL' }
    },

    // Domains / UDT
    {
      id: 'domain-1',
      name: 'EmailAddress',
      type: 'domain',
      status: 'equal',
      leftValue: { baseType: 'VARCHAR(255)', constraint: 'CHECK (value LIKE "%@%")' },
      rightValue: { baseType: 'VARCHAR(255)', constraint: 'CHECK (value LIKE "%@%")' },
      mergeValue: { baseType: 'VARCHAR(255)', constraint: 'CHECK (value LIKE "%@%")' }
    },
    {
      id: 'domain-2',
      name: 'PhoneNumber',
      type: 'domain',
      status: 'different',
      leftValue: { baseType: 'VARCHAR(15)', pattern: '^[0-9]{10}$' },
      rightValue: { baseType: 'VARCHAR(20)', pattern: '^\\+?[0-9]{10,15}$' },
      mergeValue: { baseType: 'VARCHAR(20)', pattern: '^\\+?[0-9]{10,15}$' }
    },

    // Sequences
    {
      id: 'seq-1',
      name: 'SEQ_OrderID',
      type: 'sequence',
      status: 'equal',
      leftValue: { start: 1000, increment: 1, minValue: 1, maxValue: 999999 },
      rightValue: { start: 1000, increment: 1, minValue: 1, maxValue: 999999 },
      mergeValue: { start: 1000, increment: 1, minValue: 1, maxValue: 999999 }
    },

    // Annotations
    {
      id: 'ann-1',
      name: 'Customer Module Documentation',
      type: 'annotation',
      status: 'different',
      leftValue: { text: 'This module handles customer data and authentication' },
      rightValue: { text: 'This module handles customer data, authentication, and profile management' },
      mergeValue: { text: 'This module handles customer data, authentication, and profile management' }
    },

    // ER Diagrams
    {
      id: 'diag-1',
      name: 'Customer Domain Model',
      type: 'diagram',
      status: 'equal',
      leftValue: { entities: 5, relationships: 8 },
      rightValue: { entities: 5, relationships: 8 },
      mergeValue: { entities: 5, relationships: 8 }
    },
    {
      id: 'diag-2',
      name: 'Order Processing Flow',
      type: 'diagram',
      status: 'left-only',
      leftValue: { entities: 3, relationships: 4 }
    }
  ];


  const handleStartComparison = () => {
    setIsComparing(true);
    setTimeout(() => {
      setComparisonResults(mockComparisonResults);

      // Auto-resolve "different" items where the system already proposed a clear mergeValue.
      // These don't need user judgment — the user only sees them if they want to override.
      const initial: Record<string, ResolutionChoice> = {};
      const auto = new Set<string>();
      const walk = (objs: ComparisonObject[]) => {
        objs.forEach(o => {
          if (o.status === 'different' && o.mergeValue !== null && o.mergeValue !== undefined) {
            const matchesLeft  = JSON.stringify(o.leftValue)  === JSON.stringify(o.mergeValue);
            const matchesRight = JSON.stringify(o.rightValue) === JSON.stringify(o.mergeValue);
            if (matchesRight)     { initial[o.id] = 'right'; auto.add(o.id); }
            else if (matchesLeft) { initial[o.id] = 'left';  auto.add(o.id); }
          }
          if (o.children) walk(o.children);
        });
      };
      walk(mockComparisonResults);
      setResolutions(initial);
      setAutoResolved(auto);

      setIsComparing(false);
      setStep('comparison');
    }, 2000);
  };

  const toggleExpand = (id: string) => {
    setComparisonResults(prev =>
      prev.map(obj =>
        obj.id === id ? { ...obj, expanded: !obj.expanded } : obj
      )
    );
  };

  const getStatusColor = (status: ObjectStatus) => {
    switch (status) {
      case 'equal':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'different':
        return 'text-amber-600 dark:text-amber-400';
      case 'conflict':
        return 'text-red-600 dark:text-red-400';
      case 'left-only':
        return 'text-purple-600 dark:text-purple-400';
      case 'right-only':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-zinc-400';
    }
  };

  const getStatusIcon = (status: ObjectStatus) => {
    switch (status) {
      case 'equal':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'different':
        return <AlertCircle className="w-4 h-4" />;
      case 'conflict':
        return <XCircle className="w-4 h-4" />;
      case 'left-only':
        return <ArrowRight className="w-4 h-4" />;
      case 'right-only':
        return <ArrowLeft className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: ObjectStatus) => {
    switch (status) {
      case 'equal':
        return 'Equal';
      case 'different':
        return 'Different';
      case 'conflict':
        return 'Conflict';
      case 'left-only':
        return 'Left Only';
      case 'right-only':
        return 'Right Only';
      default:
        return '';
    }
  };

  const renderValue = (value: any) => {
    if (!value) return <span className="text-gray-400 dark:text-zinc-600 text-xs italic">N/A</span>;

    if (typeof value === 'object') {
      return (
        <div className="text-xs space-y-0.5">
          {Object.entries(value).map(([key, val]) => (
            <div key={key}>
              <span className="text-gray-500 dark:text-zinc-500">{key}:</span>{' '}
              <span className="font-medium">{String(val)}</span>
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-xs">{String(value)}</span>;
  };

  const renderSelectionStep = () => {
    return (
      <div className="space-y-6">
      {/* Model Selection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Model */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-8 bg-purple-600 dark:bg-purple-400 rounded" />
            <h3 className="text-sm font-semibold text-purple-600 dark:text-purple-400">
              Left Model (Baseline)
            </h3>
          </div>

          {/* Source Type */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
              Source Type
            </label>
            <div className="inline-flex bg-gray-100 dark:bg-zinc-900 rounded p-0.5 gap-0.5">
              <button
                onClick={() => setLeftSourceType('mart')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  leftSourceType === 'mart'
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                Model Mart
              </button>
              <button
                onClick={() => setLeftSourceType('file')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  leftSourceType === 'file'
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                File
              </button>
              <button
                onClick={() => setLeftSourceType('database')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  leftSourceType === 'database'
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Database
              </button>
            </div>
          </div>

          {/* Model Selection */}
          {leftSourceType === 'mart' && (
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
                value={leftModel?.id || ''}
                onChange={(e) => {
                  const model = modelMart.find(m => m.id === e.target.value);
                  setLeftModel(model || null);
                }}
              >
                <option value="">Choose left model...</option>
                {modelMart.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>

              {leftModel && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium">{leftModel.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-zinc-400">
                    <div>{leftModel.entities} Entities</div>
                    <div>{leftModel.relationships} Relationships</div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* File Source Selection */}
          {leftSourceType === 'file' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                Model File
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded p-6 text-center hover:border-purple-500 transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-zinc-500" />
                <p className="text-xs text-gray-600 dark:text-zinc-400 mb-3">
                  Drop model file or browse (.dmf, .xml, .json)
                </p>
                <input
                  type="text"
                  className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none mb-2"
                  placeholder="File path..."
                  value={leftFilePath}
                  onChange={(e) => setLeftFilePath(e.target.value)}
                />
                <button
                  onClick={() => {
                    if (leftFilePath) {
                      setLeftModel({
                        id: 'file-left',
                        name: leftFilePath.split('/').pop() || 'Model File',
                        source: 'file',
                        path: leftFilePath,
                        entities: 0,
                        relationships: 0
                      });
                    }
                  }}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium"
                >
                  Load File
                </button>
              </div>

              {leftModel && leftModel.source === 'file' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium">{leftModel.name}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Database Source Selection */}
          {leftSourceType === 'database' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* Platform */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                  Platform
                </label>
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded">
                  <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Microsoft Fabric</span>
                </div>
              </div>

              {/* Environment Type */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                  Environment Type
                </label>
                <div className="inline-flex bg-gray-100 dark:bg-zinc-900 rounded p-0.5 gap-0.5">
                  <button
                    onClick={() => setLeftDbConfig({ ...leftDbConfig, environmentType: 'lakehouse', selectedEnvironment: '' })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      leftDbConfig.environmentType === 'lakehouse'
                        ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                        : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    Lakehouse
                  </button>
                  <button
                    onClick={() => setLeftDbConfig({ ...leftDbConfig, environmentType: 'warehouse', selectedEnvironment: '' })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      leftDbConfig.environmentType === 'warehouse'
                        ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                        : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Warehouse className="w-3.5 h-3.5" />
                    Warehouse
                  </button>
                </div>
              </div>

              {/* Connection Form */}
              {leftDbConfig.environmentType && leftConnectionStatus !== 'success' && (
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                    Connection
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    placeholder="Workspace URL"
                    value={leftDbConfig.workspace}
                    onChange={(e) => setLeftDbConfig({ ...leftDbConfig, workspace: e.target.value })}
                  />
                  <input
                    type="text"
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    placeholder="Username"
                    value={leftDbConfig.username}
                    onChange={(e) => setLeftDbConfig({ ...leftDbConfig, username: e.target.value })}
                  />
                  <input
                    type="password"
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    placeholder="Password"
                    value={leftDbConfig.password}
                    onChange={(e) => setLeftDbConfig({ ...leftDbConfig, password: e.target.value })}
                  />
                  <button
                    onClick={handleTestLeftConnection}
                    disabled={leftConnectionStatus === 'testing' || !leftDbConfig.workspace}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded text-xs font-medium transition-colors"
                  >
                    {leftConnectionStatus === 'testing' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Database className="w-3.5 h-3.5" />
                        Test Connection
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Connected Status */}
              {leftDbConfig.environmentType && leftConnectionStatus === 'success' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                      Connected to workspace
                    </span>
                  </div>

                  {/* Environment Dropdown */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                      Select {leftDbConfig.environmentType === 'lakehouse' ? 'Lakehouse' : 'Warehouse'}
                    </label>
                    <select
                      value={leftDbConfig.selectedEnvironment}
                      onChange={(e) => {
                        setLeftDbConfig({ ...leftDbConfig, selectedEnvironment: e.target.value });
                        const env = mockEnvironments.find(env => env.id === e.target.value);
                        if (env) {
                          setLeftModel({
                            id: env.id,
                            name: env.name,
                            source: 'database',
                            entities: 0,
                            relationships: 0
                          });
                        }
                      }}
                      className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    >
                      <option value="">Choose {leftDbConfig.environmentType === 'lakehouse' ? 'a lakehouse' : 'a warehouse'}...</option>
                      {mockEnvironments
                        .filter(env => env.type === leftDbConfig.environmentType)
                        .map((env) => (
                          <option key={env.id} value={env.id}>
                            {env.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {leftModel && leftModel.source === 'database' && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium">{leftModel.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right Model */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-8 bg-emerald-600 dark:bg-emerald-400 rounded" />
            <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Right Model (Compare To)
            </h3>
          </div>

          {/* Source Type */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
              Source Type
            </label>
            <div className="inline-flex bg-gray-100 dark:bg-zinc-900 rounded p-0.5 gap-0.5">
              <button
                onClick={() => setRightSourceType('mart')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  rightSourceType === 'mart'
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                Model Mart
              </button>
              <button
                onClick={() => setRightSourceType('file')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  rightSourceType === 'file'
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                File
              </button>
              <button
                onClick={() => setRightSourceType('database')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  rightSourceType === 'database'
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Database
              </button>
            </div>
          </div>

          {/* Model Selection */}
          {rightSourceType === 'mart' && (
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
                value={rightModel?.id || ''}
                onChange={(e) => {
                  const model = modelMart.find(m => m.id === e.target.value);
                  setRightModel(model || null);
                }}
              >
                <option value="">Choose right model...</option>
                {modelMart.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>

              {rightModel && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium">{rightModel.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-zinc-400">
                    <div>{rightModel.entities} Entities</div>
                    <div>{rightModel.relationships} Relationships</div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* File Source Selection - Right */}
          {rightSourceType === 'file' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                Model File
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded p-6 text-center hover:border-emerald-500 transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-zinc-500" />
                <p className="text-xs text-gray-600 dark:text-zinc-400 mb-3">
                  Drop model file or browse (.dmf, .xml, .json)
                </p>
                <input
                  type="text"
                  className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none mb-2"
                  placeholder="File path..."
                  value={rightFilePath}
                  onChange={(e) => setRightFilePath(e.target.value)}
                />
                <button
                  onClick={() => {
                    if (rightFilePath) {
                      setRightModel({
                        id: 'file-right',
                        name: rightFilePath.split('/').pop() || 'Model File',
                        source: 'file',
                        path: rightFilePath,
                        entities: 0,
                        relationships: 0
                      });
                    }
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium"
                >
                  Load File
                </button>
              </div>

              {rightModel && rightModel.source === 'file' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium">{rightModel.name}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Database Source Selection - Right */}
          {rightSourceType === 'database' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* Platform */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                  Platform
                </label>
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded">
                  <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Microsoft Fabric</span>
                </div>
              </div>

              {/* Environment Type */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                  Environment Type
                </label>
                <div className="inline-flex bg-gray-100 dark:bg-zinc-900 rounded p-0.5 gap-0.5">
                  <button
                    onClick={() => setRightDbConfig({ ...rightDbConfig, environmentType: 'lakehouse', selectedEnvironment: '' })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      rightDbConfig.environmentType === 'lakehouse'
                        ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                        : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    Lakehouse
                  </button>
                  <button
                    onClick={() => setRightDbConfig({ ...rightDbConfig, environmentType: 'warehouse', selectedEnvironment: '' })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      rightDbConfig.environmentType === 'warehouse'
                        ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                        : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Warehouse className="w-3.5 h-3.5" />
                    Warehouse
                  </button>
                </div>
              </div>

              {/* Connection Form */}
              {rightDbConfig.environmentType && rightConnectionStatus !== 'success' && (
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                    Connection
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Workspace URL"
                    value={rightDbConfig.workspace}
                    onChange={(e) => setRightDbConfig({ ...rightDbConfig, workspace: e.target.value })}
                  />
                  <input
                    type="text"
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Username"
                    value={rightDbConfig.username}
                    onChange={(e) => setRightDbConfig({ ...rightDbConfig, username: e.target.value })}
                  />
                  <input
                    type="password"
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Password"
                    value={rightDbConfig.password}
                    onChange={(e) => setRightDbConfig({ ...rightDbConfig, password: e.target.value })}
                  />
                  <button
                    onClick={handleTestRightConnection}
                    disabled={rightConnectionStatus === 'testing' || !rightDbConfig.workspace}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded text-xs font-medium transition-colors"
                  >
                    {rightConnectionStatus === 'testing' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Database className="w-3.5 h-3.5" />
                        Test Connection
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Connected Status */}
              {rightDbConfig.environmentType && rightConnectionStatus === 'success' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                      Connected to workspace
                    </span>
                  </div>

                  {/* Environment Dropdown */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                      Select {rightDbConfig.environmentType === 'lakehouse' ? 'Lakehouse' : 'Warehouse'}
                    </label>
                    <select
                      value={rightDbConfig.selectedEnvironment}
                      onChange={(e) => {
                        setRightDbConfig({ ...rightDbConfig, selectedEnvironment: e.target.value });
                        const env = mockEnvironments.find(env => env.id === e.target.value);
                        if (env) {
                          setRightModel({
                            id: env.id,
                            name: env.name,
                            source: 'database',
                            entities: 0,
                            relationships: 0
                          });
                        }
                      }}
                      className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="">Choose {rightDbConfig.environmentType === 'lakehouse' ? 'a lakehouse' : 'a warehouse'}...</option>
                      {mockEnvironments
                        .filter(env => env.type === rightDbConfig.environmentType)
                        .map((env) => (
                          <option key={env.id} value={env.id}>
                            {env.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {rightModel && rightModel.source === 'database' && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-medium">{rightModel.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Comparison Profile Selection */}
      {leftModel && rightModel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-6 border-t border-gray-200 dark:border-zinc-800"
        >
          <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-3 uppercase tracking-wide">
            Comparison Profile
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                value: 'complete',
                label: 'Complete Comparison',
                description: 'Compare all model elements including metadata and procedures',
                icon: <Database className="w-4 h-4" />
              },
              {
                value: 'structure',
                label: 'Structure Only',
                description: 'Tables, columns, keys, and relationships',
                icon: <Table className="w-4 h-4" />
              },
              {
                value: 'basic',
                label: 'Basic Compare',
                description: 'Tables, columns, and primary/foreign keys only',
                icon: <Filter className="w-4 h-4" />
              }
            ].map(profile => (
              <motion.button
                key={profile.value}
                onClick={() => handleComparisonProfileChange(profile.value)}
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded border-2 text-left transition-all ${
                  selectedComparisonProfile === profile.value
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20'
                    : 'border-gray-300 dark:border-zinc-700 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={selectedComparisonProfile === profile.value ? 'text-blue-600' : 'text-gray-600 dark:text-zinc-400'}>
                    {profile.icon}
                  </div>
                  <span className={`font-semibold text-xs ${
                    selectedComparisonProfile === profile.value
                      ? 'text-blue-600'
                      : 'text-gray-900 dark:text-zinc-100'
                  }`}>
                    {profile.label}
                  </span>
                </div>
                <p className="text-[10px] text-gray-600 dark:text-zinc-400">
                  {profile.description}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Advanced Comparison Options */}
          <div className="mt-4 border border-gray-300 dark:border-zinc-700 rounded overflow-hidden">
            <button
              onClick={() => setShowComparisonAdvanced(!showComparisonAdvanced)}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-zinc-900/50 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-gray-600 dark:text-zinc-400" />
                <span className="text-xs font-semibold text-gray-900 dark:text-zinc-100">
                  Advanced Comparison Options {selectedComparisonProfile === 'custom' && '(Customized)'}
                </span>
              </div>
              {showComparisonAdvanced ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-400" />
              )}
            </button>

            {showComparisonAdvanced && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 space-y-3 border-t border-gray-200 dark:border-zinc-800 max-h-[400px] overflow-y-auto"
                >
                    {/* Comparison Sensitivity */}
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 mb-2 uppercase tracking-wider">
                        Comparison Sensitivity
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-start gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.ignoreCase}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, ignoreCase: e.target.checked });
                              if (e.target.checked !== DEFAULT_COMPARISON_PROFILES[selectedComparisonProfile as keyof typeof DEFAULT_COMPARISON_PROFILES]?.ignoreCase) {
                                setSelectedComparisonProfile('custom');
                              }
                            }}
                            className="mt-0.5"
                          />
                          <div>
                            <div className="text-gray-900 dark:text-zinc-100">Ignore Case</div>
                            <p className="text-[10px] text-gray-600 dark:text-zinc-400">Ignore case differences</p>
                          </div>
                        </label>

                        <label className="flex items-start gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.ignoreWhitespace}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, ignoreWhitespace: e.target.checked });
                              if (e.target.checked !== DEFAULT_COMPARISON_PROFILES[selectedComparisonProfile as keyof typeof DEFAULT_COMPARISON_PROFILES]?.ignoreWhitespace) {
                                setSelectedComparisonProfile('custom');
                              }
                            }}
                            className="mt-0.5"
                          />
                          <div>
                            <div className="text-gray-900 dark:text-zinc-100">Ignore Whitespace</div>
                            <p className="text-[10px] text-gray-600 dark:text-zinc-400">Ignore spacing</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Structure Elements */}
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 mb-2 uppercase tracking-wider">
                        Structure Elements
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.compareTables}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, compareTables: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Tables</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.compareColumns}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, compareColumns: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Columns</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.compareDataTypes}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, compareDataTypes: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Data Types</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.compareNullability}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, compareNullability: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Nullability</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.compareDefaultValues}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, compareDefaultValues: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Default Values</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.compareRelationships}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, compareRelationships: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Relationships</span>
                        </label>
                      </div>
                    </div>

                    {/* Keys & Constraints */}
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 mb-2 uppercase tracking-wider">
                        Keys & Constraints
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.comparePrimaryKeys}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, comparePrimaryKeys: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Primary Keys</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.compareForeignKeys}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, compareForeignKeys: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Foreign Keys</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.compareUniqueConstraints}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, compareUniqueConstraints: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Unique Constraints</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.compareCheckConstraints}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, compareCheckConstraints: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Check Constraints</span>
                        </label>
                      </div>
                    </div>

                    {/* Indexes & Performance */}
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 mb-2 uppercase tracking-wider">
                        Indexes & Performance
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.compareIndexes}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, compareIndexes: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Indexes</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.compareTriggers}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, compareTriggers: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Triggers</span>
                        </label>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 mb-2 uppercase tracking-wider">
                        Metadata
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.compareComments}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, compareComments: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Comments</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.compareDescriptions}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, compareDescriptions: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Descriptions</span>
                        </label>
                      </div>
                    </div>

                    {/* Procedures & Functions */}
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 mb-2 uppercase tracking-wider">
                        Procedures & Functions
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.compareStoredProcedures}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, compareStoredProcedures: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Stored Procedures</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.compareFunctions}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, compareFunctions: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Functions</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.compareViews}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, compareViews: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0"
                          />
                          <span className="text-gray-900 dark:text-zinc-100">Views</span>
                        </label>
                      </div>
                    </div>

                    {/* Smart Detection */}
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 mb-2 uppercase tracking-wider">
                        Smart Detection
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-start gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.detectRenamedObjects}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, detectRenamedObjects: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0.5"
                          />
                          <div>
                            <div className="text-gray-900 dark:text-zinc-100">Detect Renamed Objects</div>
                            <p className="text-[10px] text-gray-600 dark:text-zinc-400">Identify renamed objects</p>
                          </div>
                        </label>

                        <label className="flex items-start gap-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={comparisonOptions.detectMovedObjects}
                            onChange={(e) => {
                              setComparisonOptions({ ...comparisonOptions, detectMovedObjects: e.target.checked });
                              setSelectedComparisonProfile('custom');
                            }}
                            className="mt-0.5"
                          />
                          <div>
                            <div className="text-gray-900 dark:text-zinc-100">Detect Moved Objects</div>
                            <p className="text-[10px] text-gray-600 dark:text-zinc-400">Identify moved objects</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
              </AnimatePresence>
            )}
          </div>

          {selectedComparisonProfile && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleStartComparison}
                disabled={isComparing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                {isComparing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Comparing Models...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Start Comparison
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
    );
  };

  const getObjectIcon = (type: ComparisonObject['type']) => {
    const iconClass = "w-3.5 h-3.5";
    switch (type) {
      case 'model':
        return <Database className={`${iconClass} text-gray-600 dark:text-zinc-400`} />;
      case 'subject-area':
        return <FolderOpen className={`${iconClass} text-blue-600 dark:text-blue-400`} />;
      case 'entity':
        return <Table className={`${iconClass} text-emerald-600 dark:text-emerald-400`} />;
      case 'attribute':
        return <FileText className={`${iconClass} text-gray-500 dark:text-zinc-500`} />;
      case 'relationship':
        return <GitBranch className={`${iconClass} text-purple-600 dark:text-purple-400`} />;
      case 'key':
        return <Key className={`${iconClass} text-amber-600 dark:text-amber-400`} />;
      case 'index':
        return <List className={`${iconClass} text-cyan-600 dark:text-cyan-400`} />;
      case 'trigger':
        return <Zap className={`${iconClass} text-yellow-600 dark:text-yellow-400`} />;
      case 'view':
        return <Eye className={`${iconClass} text-indigo-600 dark:text-indigo-400`} />;
      case 'procedure':
        return <Code className={`${iconClass} text-pink-600 dark:text-pink-400`} />;
      case 'function':
        return <Settings className={`${iconClass} text-orange-600 dark:text-orange-400`} />;
      case 'constraint':
        return <Shield className={`${iconClass} text-red-600 dark:text-red-400`} />;
      case 'domain':
      case 'udt':
        return <Package className={`${iconClass} text-violet-600 dark:text-violet-400`} />;
      case 'annotation':
        return <BookOpen className={`${iconClass} text-teal-600 dark:text-teal-400`} />;
      case 'diagram':
        return <Workflow className={`${iconClass} text-rose-600 dark:text-rose-400`} />;
      case 'sequence':
        return <Hash className={`${iconClass} text-lime-600 dark:text-lime-400`} />;
      case 'synonym':
      case 'package':
      case 'type':
      case 'schema':
        return <Box className={`${iconClass} text-slate-600 dark:text-slate-400`} />;
      default:
        return <Database className={`${iconClass} text-gray-500 dark:text-zinc-500`} />;
    }
  };

  // pane semantics:
  //   'compare' — single tree (2-Pane Compare view): show inline action buttons
  //   'left'    — left source pane in 3-Pane Merge: read-only view of LEFT model; right-only items are ghosted (not in left)
  //   'merge'   — middle pane in 3-Pane Merge: this is where decisions live, show inline action buttons
  //   'right'   — right source pane in 3-Pane Merge: read-only view of RIGHT model; left-only items are ghosted (not in right)
  const renderObjectRow = (obj: ComparisonObject, depth: number = 0, pane: 'compare' | 'left' | 'merge' | 'right' = 'compare') => {
    const choice = resolutions[obj.id];
    const needsResolution = obj.status === 'conflict' || obj.status === 'different' || obj.status === 'left-only' || obj.status === 'right-only';
    const showActions = pane === 'compare' || pane === 'merge';

    // In source panes (left/right) ghost items that don't exist in this model
    const ghosted =
      (pane === 'left'  && obj.status === 'right-only') ||
      (pane === 'right' && obj.status === 'left-only');

    // Resolved badge styling. Auto-merged items get a quieter, neutral badge so they
    // visually demote themselves and don't compete for the user's attention.
    const isAuto = autoResolved.has(obj.id);
    let resolvedBadge: { label: string; cls: string } | null = null;
    if (isAuto && (choice === 'left' || choice === 'right')) {
      resolvedBadge = {
        label: `Auto-merged · ${choice === 'left' ? 'Left' : 'Right'}`,
        cls: 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700',
      };
    } else if (choice === 'left')  resolvedBadge = { label: 'Using Left',          cls: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300' };
    else if (choice === 'right') resolvedBadge = { label: 'Using Right',         cls: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' };
    else if (choice === 'add')   resolvedBadge = { label: obj.status === 'left-only' ? 'Will add to Right' : 'Will add to Left', cls: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' };
    else if (choice === 'skip')  resolvedBadge = { label: 'Skipped',             cls: 'bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400' };

    // Row tint when unresolved (only highlight in panes that show actions, so left/right stay calm).
    // Auto-resolved items don't get tint — they're not actionable by default.
    const rowBg =
      !showActions || !needsResolution || choice ? '' :
      obj.status === 'conflict'   ? 'bg-red-50/40 dark:bg-red-950/10' :
      obj.status === 'different'  ? 'bg-amber-50/30 dark:bg-amber-950/10' :
      obj.status === 'left-only'  ? 'bg-blue-50/30 dark:bg-blue-950/10' :
      obj.status === 'right-only' ? 'bg-blue-50/30 dark:bg-blue-950/10' : '';

    return (
      <div key={`${pane}-${obj.id}`}>
        <div
          onClick={() => setSelectedObject(obj)}
          className={`w-full flex items-center gap-1.5 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer ${
            selectedObject?.id === obj.id ? 'bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-600' : rowBg
          } ${ghosted ? 'opacity-40' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {/* Expand/Collapse Button */}
          {obj.children && obj.children.length > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(obj.id);
              }}
              className="flex-shrink-0 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded p-0.5"
            >
              {obj.expanded ? (
                <ChevronDown className="w-3 h-3 text-gray-500" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}

          {/* Object Icon */}
          {getObjectIcon(obj.type)}

          {/* Object Name (strikethrough if ghosted — item doesn't exist in this pane's model) */}
          <span className={`text-xs font-medium flex-1 truncate ${
            ghosted ? 'text-gray-400 dark:text-zinc-600 line-through italic' : 'text-gray-900 dark:text-zinc-100'
          }`}>{obj.name}</span>

          {/* Presence Indicators (shown in compare + merge panes; redundant in left/right) */}
          {showActions && (
            <div className="flex items-center gap-0.5 shrink-0">
              {obj.status !== 'right-only' && (
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" title="In left model" />
              )}
              {obj.status !== 'left-only' && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="In right model" />
              )}
            </div>
          )}

          {/* Inline action buttons — only in panes where decisions are made */}
          {showActions && (
            <div className="flex items-center gap-1 shrink-0 ml-1" onClick={(e) => e.stopPropagation()}>
              {!needsResolution && (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Equal
                </span>
              )}

              {needsResolution && resolvedBadge && (
                <>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${resolvedBadge.cls}`}>
                    <CheckCircle className="w-3 h-3" /> {resolvedBadge.label}
                  </span>
                  <button
                    onClick={() => clearResolution(obj.id)}
                    title="Change decision"
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-zinc-300 p-0.5 rounded"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </>
              )}

              {needsResolution && !choice && (obj.status === 'conflict' || obj.status === 'different') && (
                <>
                  <button
                    onClick={() => setResolution(obj.id, 'left')}
                    title="Use Left value"
                    className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-500 hover:text-white hover:border-purple-500"
                  >
                    <ArrowLeft className="w-3 h-3" /> Use Left
                  </button>
                  <button
                    onClick={() => setResolution(obj.id, 'right')}
                    title="Use Right value"
                    className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500 hover:text-white hover:border-emerald-500"
                  >
                    Use Right <ArrowRight className="w-3 h-3" />
                  </button>
                </>
              )}

              {needsResolution && !choice && obj.status === 'left-only' && (
                <button
                  onClick={() => setResolution(obj.id, 'add')}
                  title="Add this to the Right model so both have it"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  <Plus className="w-3 h-3" /> Add to Right <ArrowRight className="w-3 h-3" />
                </button>
              )}

              {needsResolution && !choice && obj.status === 'right-only' && (
                <button
                  onClick={() => setResolution(obj.id, 'add')}
                  title="Add this to the Left model so both have it"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  <ArrowLeft className="w-3 h-3" /> <Plus className="w-3 h-3" /> Add to Left
                </button>
              )}
            </div>
          )}

          {/* In source panes (left/right): show a small read-only status pill instead of buttons */}
          {!showActions && (
            <div className="flex items-center gap-1 shrink-0 ml-1">
              {ghosted ? (
                <span className="text-[10px] text-gray-400 dark:text-zinc-600 italic">missing here</span>
              ) : choice ? (
                <span className="text-[10px] text-blue-600 dark:text-blue-400 inline-flex items-center gap-1" title="Resolved in merge">
                  <CheckCircle className="w-3 h-3" /> resolved
                </span>
              ) : obj.status === 'equal' ? (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">=</span>
              ) : (
                <span className="text-[10px] text-amber-600 dark:text-amber-400">≠</span>
              )}
            </div>
          )}
        </div>

        {/* Render children recursively (preserve pane) */}
        {obj.expanded && obj.children && obj.children.map(child => renderObjectRow(child, depth + 1, pane))}
      </div>
    );
  };

  const getFilteredResults = () => {
    const filterRecursive = (objects: ComparisonObject[]): ComparisonObject[] => {
      return objects.filter(obj => {
        // Check if object matches filter
        const matchesFilter =
          filterType === 'all' ||
          (filterType === 'conflicts' && obj.status === 'conflict') ||
          (filterType === 'different' && obj.status === 'different') ||
          (filterType === 'equals' && obj.status === 'equal') ||
          (filterType === 'left-only' && obj.status === 'left-only') ||
          (filterType === 'right-only' && obj.status === 'right-only');

        // If has children, recursively filter them
        if (obj.children && obj.children.length > 0) {
          const filteredChildren = filterRecursive(obj.children);
          // Include parent if it matches OR if any children match
          if (matchesFilter || filteredChildren.length > 0) {
            return true;
          }
        }

        return matchesFilter;
      }).map(obj => {
        // For objects with children, filter children recursively
        if (obj.children && obj.children.length > 0) {
          return {
            ...obj,
            children: filterRecursive(obj.children)
          };
        }
        return obj;
      });
    };

    return filterRecursive(comparisonResults);
  };

  const renderComparisonView = () => {
    const totalObjects = comparisonResults.length;
    const conflicts = comparisonResults.filter(obj => obj.status === 'conflict').length;
    const modified = comparisonResults.filter(obj => obj.status === 'different').length;

    const missingItems = allResolvable.filter(o => o.status === 'left-only' || o.status === 'right-only');
    const unresolvedMissing = missingItems.filter(o => !resolutions[o.id]).length;

    return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Resolution status banner */}
      {allResolvable.length > 0 && (
        <div className={`mb-3 flex items-center gap-3 px-3 py-2 rounded-lg border ${
          allResolved
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30'
            : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30'
        }`}>
          {allResolved ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          )}
          <div className="text-xs flex-1 min-w-0">
            {allResolved ? (
              <div className="text-emerald-900 dark:text-emerald-200">
                <b>Ready to merge.</b> {autoCount > 0 && <span className="opacity-80">{autoCount} auto-merged · {manualCount} reviewed by you.</span>}
              </div>
            ) : (
              <div className="text-amber-900 dark:text-amber-200">
                <b>{needsDecisionCount} item{needsDecisionCount === 1 ? '' : 's'} need{needsDecisionCount === 1 ? 's' : ''} your decision.</b>
                {' '}
                {autoCount > 0 && <span className="opacity-75">{autoCount} already auto-merged where the system was confident.</span>}
                {unresolvedMissing > 0 && <span className="opacity-75"> Hit <b>Add all missing</b> to one-click {unresolvedMissing} missing table{unresolvedMissing === 1 ? '' : 's'}/column{unresolvedMissing === 1 ? '' : 's'}.</span>}
              </div>
            )}
          </div>
          {/* Progress */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <div className="w-32 h-1.5 bg-white dark:bg-zinc-800 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-700">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${allResolvable.length === 0 ? 100 : (resolvedCount / allResolvable.length) * 100}%` }}
              />
            </div>
          </div>
          {/* Bulk actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {unresolvedMissing > 0 && (
              <button
                onClick={bulkAddAllMissing}
                title="Add every missing table/column to the side it's missing from"
                className="text-[11px] px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-1 font-semibold shadow-sm"
              >
                <Plus className="w-3 h-3" /> Add all missing ({unresolvedMissing})
              </button>
            )}
            {resolvedCount > 0 && (
              <button
                onClick={resetAllResolutions}
                title="Clear all decisions including auto-merges"
                className="text-[11px] px-2 py-1 rounded border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('compare')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                viewMode === 'compare'
                  ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 shadow-sm'
                  : 'text-gray-600 dark:text-zinc-400'
              }`}
            >
              2-Pane Compare
            </button>
            <button
              onClick={() => setViewMode('merge')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                viewMode === 'merge'
                  ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 shadow-sm'
                  : 'text-gray-600 dark:text-zinc-400'
              }`}
            >
              3-Pane Merge
            </button>
          </div>

          <div className="w-px h-5 bg-gray-300 dark:border-zinc-700" />

          {/* Filter Badges */}
          <div className="flex items-center gap-1">
            {[
              { value: 'all', label: 'All', count: totalObjects, color: 'gray' },
              { value: 'conflicts', label: 'Conflicts', count: conflicts, color: 'red' },
              { value: 'different', label: 'Modified', count: modified, color: 'amber' }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setFilterType(filter.value as FilterType)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  filterType === filter.value
                    ? `bg-${filter.color}-100 dark:bg-${filter.color}-950/40 text-${filter.color}-700 dark:text-${filter.color}-400 ring-2 ring-${filter.color}-500`
                    : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-700'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-100 dark:bg-zinc-800 border-0 rounded pl-7 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none w-40"
            />
          </div>
          <button
            onClick={() => setStep('selection')}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors"
          >
            <ChevronLeft className="w-3 h-3 inline mr-1" />
            Back
          </button>

          <div className="flex items-center gap-2">
            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700 rounded transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export Report
                <ChevronDownIcon className="w-3 h-3" />
              </button>

              {/* Export Menu */}
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-1 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden"
                >
                  <div className="py-1">
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
                    >
                      <FileType className="w-4 h-4 text-red-600" />
                      <div className="flex-1">
                        <div className="font-medium">Export as PDF</div>
                        <div className="text-xs text-gray-500 dark:text-zinc-500">Formatted comparison report</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleExport('excel')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <div className="flex-1">
                        <div className="font-medium">Export as Excel</div>
                        <div className="text-xs text-gray-500 dark:text-zinc-500">Detailed data in spreadsheet</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleExport('html')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
                    >
                      <FileDown className="w-4 h-4 text-blue-600" />
                      <div className="flex-1">
                        <div className="font-medium">Export as HTML</div>
                        <div className="text-xs text-gray-500 dark:text-zinc-500">Interactive web report</div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Save Merge Button */}
            <button className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5" />
              Save Merge
            </button>
          </div>
        </div>
      </div>

      {/* Split-Pane Layout */}
      <div className="flex-1 flex flex-col mt-3 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
        {/* Upper Section: Object Hierarchies Side-by-Side */}
        <div className="flex-1 flex overflow-hidden" style={{ height: '60%' }}>
          {/* Left Model Pane — read-only view of LEFT source */}
          <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-zinc-800">
            <div className="px-3 py-2 bg-purple-50 dark:bg-purple-950/20 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full" />
              <span className="text-xs font-bold text-purple-700 dark:text-purple-400">LEFT MODEL</span>
              <span className="text-[10px] text-gray-600 dark:text-zinc-400">({leftModel?.name})</span>
              <span className="text-[10px] text-gray-400 dark:text-zinc-600 ml-auto italic">read-only</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {getFilteredResults().map(obj => renderObjectRow(obj, 0, viewMode === 'merge' ? 'left' : 'compare'))}
            </div>
          </div>

          {viewMode === 'merge' && (
            // Merge Model Pane (only in 3-pane mode) — decisions live here
            <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-zinc-800 bg-blue-50/30 dark:bg-blue-950/10">
              <div className="px-3 py-2 bg-blue-50 dark:bg-blue-950/20 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-2">
                <GitMerge className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400">MERGE MODEL</span>
                <span className="text-[10px] text-gray-600 dark:text-zinc-400">(Result — decide here)</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {getFilteredResults().map(obj => renderObjectRow(obj, 0, 'merge'))}
              </div>
            </div>
          )}

          {/* Right Model Pane — read-only view of RIGHT source */}
          <div className="flex-1 flex flex-col">
            <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/20 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-600 rounded-full" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">RIGHT MODEL</span>
              <span className="text-[10px] text-gray-600 dark:text-zinc-400">({rightModel?.name})</span>
              {viewMode === 'merge' && <span className="text-[10px] text-gray-400 dark:text-zinc-600 ml-auto italic">read-only</span>}
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {getFilteredResults().map(obj => renderObjectRow(obj, 0, viewMode === 'merge' ? 'right' : 'compare'))}
            </div>
          </div>
        </div>

        {/* Lower Section: Properties Detail Panel */}
        <div className="border-t-2 border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50" style={{ height: '40%' }}>
          <div className="px-3 py-2 bg-gray-100 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">PROPERTIES</span>
                {selectedObject && (
                  <>
                    <span className="text-xs text-gray-500 dark:text-zinc-500">-</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-zinc-100">{selectedObject.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400 rounded uppercase font-bold">
                      {selectedObject.type}
                    </span>
                  </>
                )}
              </div>
              {selectedObject && (
                <div className="text-[10px] px-2 py-1 rounded font-semibold ${
                  selectedObject.status === 'conflict' ? 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400' :
                  selectedObject.status === 'different' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' :
                  selectedObject.status === 'left-only' ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400' :
                  selectedObject.status === 'right-only' ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' :
                  'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                }">
                  {selectedObject.status.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="overflow-y-auto p-4" style={{ height: 'calc(100% - 45px)' }}>
            {selectedObject ? (
              <div className="grid grid-cols-3 gap-4">
                {/* Left Value */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase">Left Value</div>
                  <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-gray-200 dark:border-zinc-800">
                    {selectedObject.status !== 'right-only' ? (
                      renderValue(selectedObject.leftValue)
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-zinc-600 italic">Not in left model</span>
                    )}
                  </div>
                </div>

                {/* Merge Value (only in 3-pane mode) */}
                {viewMode === 'merge' && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase">Merge Value</div>
                    <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-900">
                      {(() => {
                        const choice = resolutions[selectedObject.id];
                        const isConflict = selectedObject.status === 'conflict' || selectedObject.status === 'different';
                        const isLeftOnly  = selectedObject.status === 'left-only';
                        const isRightOnly = selectedObject.status === 'right-only';

                        if (choice) {
                          const selIsAuto = autoResolved.has(selectedObject.id);
                          return (
                            <div className="space-y-2">
                              <div className={`text-[10px] font-bold uppercase tracking-wide inline-flex items-center gap-1 px-2 py-0.5 rounded ${
                                selIsAuto && (choice === 'left' || choice === 'right')
                                  ? 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700' :
                                choice === 'left'  ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300' :
                                choice === 'right' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' :
                                choice === 'add'   ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' :
                                'bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400'
                              }`}>
                                <CheckCircle className="w-3 h-3" />
                                {selIsAuto && choice === 'left'  && 'Auto-merged · Using Left'}
                                {selIsAuto && choice === 'right' && 'Auto-merged · Using Right'}
                                {!selIsAuto && choice === 'left'  && 'Using Left value'}
                                {!selIsAuto && choice === 'right' && 'Using Right value'}
                                {choice === 'add'   && (isLeftOnly ? 'Will add to Right model' : 'Will add to Left model')}
                                {choice === 'skip'  && 'Skipped — not added'}
                              </div>
                              {choice !== 'skip' && (
                                renderValue(
                                  choice === 'left'  ? selectedObject.leftValue :
                                  choice === 'right' ? selectedObject.rightValue :
                                  (selectedObject.leftValue || selectedObject.rightValue)
                                )
                              )}
                              <button
                                onClick={() => clearResolution(selectedObject.id)}
                                className="w-full text-[10px] text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 inline-flex items-center justify-center gap-1 py-1 border border-gray-200 dark:border-zinc-700 rounded"
                              >
                                <RefreshCw className="w-3 h-3" /> {selIsAuto ? 'Override auto-merge' : 'Change decision'}
                              </button>
                            </div>
                          );
                        }

                        if (isConflict) {
                          return (
                            <div className="space-y-2">
                              <p className="text-[10px] text-gray-600 dark:text-zinc-400">Pick which side's value to keep:</p>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => setResolution(selectedObject.id, 'left')}
                                  className="flex-1 px-2 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-semibold rounded transition-colors inline-flex items-center justify-center gap-1"
                                >
                                  <ArrowLeft className="w-3 h-3" /> Accept Left
                                </button>
                                <button
                                  onClick={() => setResolution(selectedObject.id, 'right')}
                                  className="flex-1 px-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold rounded transition-colors inline-flex items-center justify-center gap-1"
                                >
                                  Accept Right <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        }

                        if (isLeftOnly || isRightOnly) {
                          const target = isLeftOnly ? 'Right' : 'Left';
                          return (
                            <div className="space-y-2">
                              <p className="text-[10px] text-gray-600 dark:text-zinc-400">
                                This {selectedObject.type} only exists on the {isLeftOnly ? 'left' : 'right'} side.
                              </p>
                              <button
                                onClick={() => setResolution(selectedObject.id, 'add')}
                                className="w-full px-2 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                              >
                                <Plus className="w-4 h-4" /> Add to {target} model
                              </button>
                              <button
                                onClick={() => setResolution(selectedObject.id, 'skip')}
                                className="w-full px-2 py-1 text-[10px] text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 border border-gray-200 dark:border-zinc-700 rounded"
                              >
                                Skip — leave as {isLeftOnly ? 'left' : 'right'}-only
                              </button>
                            </div>
                          );
                        }

                        return renderValue(selectedObject.mergeValue || selectedObject.leftValue || selectedObject.rightValue);
                      })()}
                    </div>
                  </div>
                )}

                {/* Right Value */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Right Value</div>
                  <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-gray-200 dark:border-zinc-800">
                    {selectedObject.status !== 'left-only' ? (
                      renderValue(selectedObject.rightValue)
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-zinc-600 italic">Not in right model</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-zinc-600">
                <div className="text-center">
                  <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select an object above to view properties</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Advanced Model Compare & Merge</h1>
        <p className="text-sm text-gray-600 dark:text-zinc-400">
          Compare models from multiple sources and intelligently merge differences
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        {step === 'selection' ? renderSelectionStep() : renderComparisonView()}
      </div>
    </div>
  );
};

export default CompleteCompare2;

