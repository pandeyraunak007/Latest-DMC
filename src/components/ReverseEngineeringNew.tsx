'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  Database,
  FileText,
  Key,
  Loader2,
  Check,
  Search,
  Upload,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Warehouse,
  Settings2,
  Filter,
  Shield,
  Info
} from 'lucide-react';
import WizardLayout from './shared/WizardLayout';
import { Step } from './shared/StepIndicator';
import ConnectionCard from './shared/ConnectionCard';
import ProgressBar from './shared/ProgressBar';
import Toast, { ToastType } from './shared/Toast';
import {
  mockDatabaseSources,
  mockDatabaseObjects,
  simulateConnection,
  simulateReverseEngineering,
  simulateSSO,
  DatabaseObject
} from '@/utils/mockApi';

type SourceType = 'database' | 'script';

interface ExtractionOptions {
  // Database Objects
  extractTables: boolean;
  extractViews: boolean;
  extractMaterializedViews: boolean;
  extractStoredProcedures: boolean;
  extractFunctions: boolean;
  extractSystemObjects: boolean;

  // Table Components
  extractColumns: boolean;
  extractDataTypes: boolean;
  extractDefaultValues: boolean;
  extractComputedColumns: boolean;
  extractIdentityColumns: boolean;

  // Constraints
  extractPrimaryKeys: boolean;
  extractForeignKeys: boolean;
  extractUniqueConstraints: boolean;
  extractCheckConstraints: boolean;

  // Indexes
  extractIndexes: boolean;
  extractClusteredIndexes: boolean;
  extractUniqueIndexes: boolean;

  // Triggers
  extractTriggers: boolean;
  extractTriggerDefinitions: boolean;

  // Relationships
  reverseEngineerRelationships: boolean;
  inferRelationshipsFromNames: boolean;
  detectManyToMany: boolean;

  // Documentation
  extractComments: boolean;
  extractDescriptions: boolean;
  extractExtendedProperties: boolean;

  // Security
  extractPermissions: boolean;
  extractRoles: boolean;
  extractOwnership: boolean;

  // Model Generation
  createLogicalModel: boolean;
  createPhysicalModel: boolean;
  inferBusinessNames: boolean;
  normalizationAnalysis: boolean;
}

const DEFAULT_EXTRACTION_SETS: Record<string, ExtractionOptions> = {
  complete: {
    extractTables: true,
    extractViews: true,
    extractMaterializedViews: true,
    extractStoredProcedures: true,
    extractFunctions: true,
    extractSystemObjects: false,
    extractColumns: true,
    extractDataTypes: true,
    extractDefaultValues: true,
    extractComputedColumns: true,
    extractIdentityColumns: true,
    extractPrimaryKeys: true,
    extractForeignKeys: true,
    extractUniqueConstraints: true,
    extractCheckConstraints: true,
    extractIndexes: true,
    extractClusteredIndexes: true,
    extractUniqueIndexes: true,
    extractTriggers: true,
    extractTriggerDefinitions: true,
    reverseEngineerRelationships: true,
    inferRelationshipsFromNames: true,
    detectManyToMany: true,
    extractComments: true,
    extractDescriptions: true,
    extractExtendedProperties: true,
    extractPermissions: true,
    extractRoles: true,
    extractOwnership: true,
    createLogicalModel: true,
    createPhysicalModel: true,
    inferBusinessNames: true,
    normalizationAnalysis: true
  },
  standard: {
    extractTables: true,
    extractViews: true,
    extractMaterializedViews: true,
    extractStoredProcedures: false,
    extractFunctions: false,
    extractSystemObjects: false,
    extractColumns: true,
    extractDataTypes: true,
    extractDefaultValues: true,
    extractComputedColumns: true,
    extractIdentityColumns: true,
    extractPrimaryKeys: true,
    extractForeignKeys: true,
    extractUniqueConstraints: true,
    extractCheckConstraints: true,
    extractIndexes: true,
    extractClusteredIndexes: true,
    extractUniqueIndexes: true,
    extractTriggers: false,
    extractTriggerDefinitions: false,
    reverseEngineerRelationships: true,
    inferRelationshipsFromNames: false,
    detectManyToMany: true,
    extractComments: true,
    extractDescriptions: true,
    extractExtendedProperties: false,
    extractPermissions: false,
    extractRoles: false,
    extractOwnership: false,
    createLogicalModel: true,
    createPhysicalModel: true,
    inferBusinessNames: false,
    normalizationAnalysis: false
  },
  basic: {
    extractTables: true,
    extractViews: false,
    extractMaterializedViews: false,
    extractStoredProcedures: false,
    extractFunctions: false,
    extractSystemObjects: false,
    extractColumns: true,
    extractDataTypes: true,
    extractDefaultValues: false,
    extractComputedColumns: false,
    extractIdentityColumns: true,
    extractPrimaryKeys: true,
    extractForeignKeys: true,
    extractUniqueConstraints: false,
    extractCheckConstraints: false,
    extractIndexes: false,
    extractClusteredIndexes: false,
    extractUniqueIndexes: false,
    extractTriggers: false,
    extractTriggerDefinitions: false,
    reverseEngineerRelationships: true,
    inferRelationshipsFromNames: false,
    detectManyToMany: false,
    extractComments: false,
    extractDescriptions: false,
    extractExtendedProperties: false,
    extractPermissions: false,
    extractRoles: false,
    extractOwnership: false,
    createLogicalModel: false,
    createPhysicalModel: true,
    inferBusinessNames: false,
    normalizationAnalysis: false
  }
};

const wizardSteps: Step[] = [
  { id: 1, title: 'Select Source', description: 'Choose your data source' },
  { id: 2, title: 'Extraction Options', description: 'Configure what to extract' },
  { id: 3, title: 'Select Objects', description: 'Pick tables and views' }
];

export default function ReverseEngineeringNew() {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Source Selection
  const [sourceType, setSourceType] = useState<SourceType>('database');
  const [selectedSource, setSelectedSource] = useState<string>('ms-fabric'); // Auto-select MS Fabric
  const [scriptFile, setScriptFile] = useState<string>('');
  const [connectionConfig, setConnectionConfig] = useState({
    server: '',
    database: '',
    username: '',
    password: ''
  });
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [ssoInProgress, setSsoInProgress] = useState(false);

  // MS Fabric specific - Environment Type
  const [environmentType, setEnvironmentType] = useState<'lakehouse' | 'warehouse' | ''>('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [modelType, setModelType] = useState<'conceptual' | 'logical' | 'physical' | 'logical-physical' | ''>('');

  // Mock data for warehouses/lakehouses
  const mockWarehouses = [
    { id: 'wh-1', name: 'Sales Data Warehouse', type: 'warehouse' },
    { id: 'wh-2', name: 'Analytics Warehouse', type: 'warehouse' },
    { id: 'lh-1', name: 'Customer Lakehouse', type: 'lakehouse' },
    { id: 'lh-2', name: 'Product Lakehouse', type: 'lakehouse' },
  ];

  // Step 2: Extraction Options
  const [selectedExtractionSet, setSelectedExtractionSet] = useState<string>('');
  const [extractionOptions, setExtractionOptions] = useState<ExtractionOptions>(DEFAULT_EXTRACTION_SETS.standard);
  const [showExtractionAdvanced, setShowExtractionAdvanced] = useState(false);
  const [extractionConfirmed, setExtractionConfirmed] = useState(false);

  // Step 3: Object Selection
  const [selectedSchemas, setSelectedSchemas] = useState<Set<string>>(new Set());
  const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(new Set());
  const [selectedObjects, setSelectedObjects] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [objectTypeFilter, setObjectTypeFilter] = useState<'all' | 'table' | 'view'>('all');

  // Advanced Options
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState({
    includeSystemObjects: false,
    includeIndexes: true,
    includeConstraints: true,
    includeTriggers: false,
    includeStoredProcedures: false,
    reverseEngineerRelationships: true,
    inferRelationshipsFromNames: false,
    createLogicalModel: true
  });

  // Step 3: Reverse Engineering
  const [reverseEngineeringProgress, setReverseEngineeringProgress] = useState(0);
  const [reverseEngineeringMessage, setReverseEngineeringMessage] = useState('');
  const [reverseEngineeringStatus, setReverseEngineeringStatus] = useState<'idle' | 'processing' | 'complete'>('idle');
  const [entitiesCreated, setEntitiesCreated] = useState(0);

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

  // Handle extraction option set change
  const handleExtractionSetChange = (optionSetName: string) => {
    setSelectedExtractionSet(optionSetName);
    setExtractionOptions(DEFAULT_EXTRACTION_SETS[optionSetName]);
  };

  // Toggle individual extraction option
  const toggleExtractionOption = (optionKey: keyof ExtractionOptions) => {
    setExtractionOptions(prev => ({
      ...prev,
      [optionKey]: !prev[optionKey]
    }));
    setSelectedExtractionSet('custom');
  };

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    try {
      const result = await simulateConnection();
      setConnectionStatus('success');
      showToast('success', 'Connection Successful', result.message);
    } catch (error) {
      setConnectionStatus('error');
      showToast('error', 'Connection Failed', 'Please check your credentials');
    }
  };

  const handleSSOLogin = async () => {
    setSsoInProgress(true);
    try {
      const result = await simulateSSO('microsoft');
      showToast('success', 'SSO Authentication Successful', `Signed in as ${result.user}`);
      setConnectionConfig(prev => ({ ...prev, username: result.user }));
      setConnectionStatus('success');
    } catch (error) {
      showToast('error', 'SSO Failed', 'Unable to authenticate');
    } finally {
      setSsoInProgress(false);
    }
  };

  const toggleObjectSelection = (objectId: string) => {
    setSelectedObjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(objectId)) {
        newSet.delete(objectId);
      } else {
        newSet.add(objectId);
      }
      return newSet;
    });
  };

  const selectAllObjects = () => {
    const allIds = mockDatabaseObjects.map(obj => obj.id);
    setSelectedObjects(new Set(allIds));
  };

  const deselectAllObjects = () => {
    setSelectedObjects(new Set());
  };

  const handleStartReverseEngineering = async () => {
    setReverseEngineeringStatus('processing');

    try {
      const result = await simulateReverseEngineering((progress, message) => {
        setReverseEngineeringProgress(progress);
        setReverseEngineeringMessage(message);
      });

      setReverseEngineeringStatus('complete');
      setEntitiesCreated(result.entitiesCreated);
      showToast('success', 'Reverse Engineering Complete!', `Successfully created ${result.entitiesCreated} entities`);
    } catch (error) {
      showToast('error', 'Reverse Engineering Failed', 'An error occurred during processing');
      setReverseEngineeringStatus('idle');
    }
  };

  const canProceedToStep2 =
    (sourceType === 'database' && modelType && environmentType && connectionStatus === 'success' && selectedWarehouse) ||
    (sourceType === 'script' && modelType && scriptFile);

  const canProceedToStep3 = extractionConfirmed;

  const canProceedToStep4 = selectedObjects.size > 0;

  // Get unique schemas
  const availableSchemas = Array.from(new Set(mockDatabaseObjects.map(obj => obj.schema)));

  // Group objects by schema
  const objectsBySchema = availableSchemas.reduce((acc, schema) => {
    acc[schema] = mockDatabaseObjects.filter(obj => obj.schema === schema);
    return acc;
  }, {} as Record<string, typeof mockDatabaseObjects>);

  // Filter objects within each schema
  const getFilteredObjectsForSchema = (schema: string) => {
    return objectsBySchema[schema].filter(obj => {
      // Filter by object type
      if (objectTypeFilter !== 'all' && obj.type.toLowerCase() !== objectTypeFilter) return false;

      // Filter by search query
      if (searchQuery && !obj.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      return true;
    });
  };

  // Toggle schema selection
  const toggleSchema = (schema: string) => {
    setExpandedSchemas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(schema)) {
        newSet.delete(schema);
      } else {
        newSet.add(schema);
      }
      return newSet;
    });
  };

  // Select all objects in a schema
  const toggleSchemaObjects = (schema: string) => {
    const schemaObjects = getFilteredObjectsForSchema(schema);
    const schemaObjectIds = schemaObjects.map(obj => obj.id);
    const allSelected = schemaObjectIds.every(id => selectedObjects.has(id));

    setSelectedObjects(prev => {
      const newSet = new Set(prev);
      if (allSelected) {
        schemaObjectIds.forEach(id => newSet.delete(id));
      } else {
        schemaObjectIds.forEach(id => newSet.add(id));
      }
      return newSet;
    });
  };

  const renderStep1Content = () => {
    return (
      <div className="space-y-5">
      {/* Source Type Selection */}
      <div>
        <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
          Source Type
        </label>
        <div className="inline-flex bg-gray-100 dark:bg-zinc-900 rounded p-0.5 gap-0.5">
          <button
            onClick={() => {
              setSourceType('database');
              setModelType('');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
              sourceType === 'database'
                ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Database
          </button>
          <button
            onClick={() => {
              setSourceType('script');
              setModelType('');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
              sourceType === 'script'
                ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Script File
          </button>
        </div>
      </div>

      {/* Model Type Selection - Show after source type selected */}
      {sourceType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4 border-t border-gray-200 dark:border-zinc-800"
        >
          <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
            Model Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'conceptual', label: 'Conceptual' },
              { value: 'logical', label: 'Logical' },
              { value: 'physical', label: 'Physical' },
              { value: 'logical-physical', label: 'Logical & Physical' }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setModelType(type.value as any)}
                className={`px-3 py-2 rounded text-xs font-medium transition-all ${
                  modelType === type.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Database Source Configuration */}
      {sourceType === 'database' && modelType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pt-4 border-t border-gray-200 dark:border-zinc-800"
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

          {/* Environment Type Selection */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
              Environment Type
            </label>
            <div className="inline-flex bg-gray-100 dark:bg-zinc-900 rounded p-0.5 gap-0.5">
              <button
                onClick={() => {
                  setEnvironmentType('lakehouse');
                  setSelectedWarehouse('');
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  environmentType === 'lakehouse'
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Lakehouse
              </button>
              <button
                onClick={() => {
                  setEnvironmentType('warehouse');
                  setSelectedWarehouse('');
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  environmentType === 'warehouse'
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                }`}
              >
                <Warehouse className="w-3.5 h-3.5" />
                Warehouse
              </button>
            </div>
          </div>

          {/* Connection - Only show after environment type selected */}
          {environmentType && connectionStatus !== 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                Connection
              </label>

              <div className="space-y-2">
                <input
                  type="text"
                  className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Workspace URL"
                  value={connectionConfig.server}
                  onChange={(e) => setConnectionConfig({ ...connectionConfig, server: e.target.value })}
                />
                <input
                  type="text"
                  className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Username"
                  value={connectionConfig.username}
                  onChange={(e) => setConnectionConfig({ ...connectionConfig, username: e.target.value })}
                />
                <input
                  type="password"
                  className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Password"
                  value={connectionConfig.password}
                  onChange={(e) => setConnectionConfig({ ...connectionConfig, password: e.target.value })}
                />
              </div>

              {/* Actions Row - Compact */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestConnection}
                  disabled={connectionStatus === 'testing' || !connectionConfig.server}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded text-xs font-medium transition-colors"
                >
                  {connectionStatus === 'testing' ? (
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

                <button
                  onClick={handleSSOLogin}
                  disabled={ssoInProgress}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-zinc-300 rounded text-xs font-medium transition-colors"
                >
                  {ssoInProgress ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Key className="w-3.5 h-3.5" />
                  )}
                  SSO
                </button>
              </div>
            </motion.div>
          )}

          {/* Connected Status */}
          {environmentType && connectionStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                Connected to workspace
              </span>
            </motion.div>
          )}

          {/* Warehouse/Lakehouse Dropdown - Only show after successful connection */}
          {environmentType && connectionStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                Select {environmentType === 'lakehouse' ? 'Lakehouse' : 'Warehouse'}
              </label>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Choose {environmentType === 'lakehouse' ? 'a lakehouse' : 'a warehouse'}...</option>
                {mockWarehouses
                  .filter(w => w.type === environmentType)
                  .map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
              </select>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Script File Selection */}
      {sourceType === 'script' && modelType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4 border-t border-gray-200 dark:border-zinc-800"
        >
          <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
            DDL Script
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded p-6 text-center hover:border-blue-500 transition-colors">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-zinc-500" />
            <p className="text-xs text-gray-600 dark:text-zinc-400 mb-3">
              Drop .sql or .ddl file (max 10MB)
            </p>
            <input
              type="text"
              className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none mb-2"
              placeholder="File path..."
              value={scriptFile}
              onChange={(e) => setScriptFile(e.target.value)}
            />
            <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium">
              Browse
            </button>
          </div>
        </motion.div>
      )}
      </div>
    );
  };

  const renderStep2Content = () => {
    return (
      <div className="space-y-5">
            {/* Option Set Selection */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                Extraction Profile
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    value: 'complete',
                    label: 'Complete Extraction',
                    description: 'Extract all database objects, metadata, and relationships',
                    icon: <Database className="w-4 h-4" />
                  },
                  {
                    value: 'standard',
                    label: 'Standard',
                    description: 'Tables, views, constraints, and core relationships',
                    icon: <FileText className="w-4 h-4" />
                  },
                  {
                    value: 'basic',
                    label: 'Basic Tables',
                    description: 'Tables with primary and foreign keys only',
                    icon: <Filter className="w-4 h-4" />
                  }
                ].map(optionSet => (
                  <motion.button
                    key={optionSet.value}
                    onClick={() => handleExtractionSetChange(optionSet.value)}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded border-2 text-left transition-all ${
                      selectedExtractionSet === optionSet.value
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20'
                        : 'border-gray-300 dark:border-zinc-700 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={selectedExtractionSet === optionSet.value ? 'text-blue-600' : 'text-gray-600 dark:text-zinc-400'}>
                        {optionSet.icon}
                      </div>
                      <span className={`font-semibold text-xs ${
                        selectedExtractionSet === optionSet.value
                          ? 'text-blue-600'
                          : 'text-gray-900 dark:text-zinc-100'
                      }`}>
                        {optionSet.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-600 dark:text-zinc-400">
                      {optionSet.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="border border-gray-300 dark:border-zinc-700 rounded overflow-hidden">
              <button
                onClick={() => setShowExtractionAdvanced(!showExtractionAdvanced)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-zinc-900/50 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="w-3.5 h-3.5 text-gray-600 dark:text-zinc-400" />
                  <span className="text-xs font-semibold text-gray-900 dark:text-zinc-100">
                    Advanced Extraction Options {selectedExtractionSet === 'custom' && '(Customized)'}
                  </span>
                </div>
                {showExtractionAdvanced ? (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-400" />
                )}
              </button>

              {showExtractionAdvanced && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 space-y-3 border-t border-gray-200 dark:border-zinc-800 max-h-[400px] overflow-y-auto"
                  >
                    {/* Database Objects */}
                    <div>
                      <h4 className="text-[10px] font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <Database className="w-3 h-3" />
                        Database Objects
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5 ml-4">
                        {[
                          { key: 'extractTables', label: 'Tables' },
                          { key: 'extractViews', label: 'Views' },
                          { key: 'extractMaterializedViews', label: 'Materialized Views' },
                          { key: 'extractStoredProcedures', label: 'Stored Procedures' },
                          { key: 'extractFunctions', label: 'Functions' },
                          { key: 'extractSystemObjects', label: 'System Objects' }
                        ].map(opt => (
                          <label key={opt.key} className="flex items-center gap-1.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={extractionOptions[opt.key as keyof ExtractionOptions] as boolean}
                              onChange={() => toggleExtractionOption(opt.key as keyof ExtractionOptions)}
                              className="w-3 h-3 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                            />
                            <span className="text-[11px] text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Table Components */}
                    <div>
                      <h4 className="text-[10px] font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <FileText className="w-3 h-3" />
                        Table Components
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5 ml-4">
                        {[
                          { key: 'extractColumns', label: 'Columns' },
                          { key: 'extractDataTypes', label: 'Data Types' },
                          { key: 'extractDefaultValues', label: 'Default Values' },
                          { key: 'extractComputedColumns', label: 'Computed Columns' },
                          { key: 'extractIdentityColumns', label: 'Identity Columns' }
                        ].map(opt => (
                          <label key={opt.key} className="flex items-center gap-1.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={extractionOptions[opt.key as keyof ExtractionOptions] as boolean}
                              onChange={() => toggleExtractionOption(opt.key as keyof ExtractionOptions)}
                              className="w-3 h-3 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                            />
                            <span className="text-[11px] text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Constraints */}
                    <div>
                      <h4 className="text-[10px] font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <Key className="w-3 h-3" />
                        Constraints
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5 ml-4">
                        {[
                          { key: 'extractPrimaryKeys', label: 'Primary Keys' },
                          { key: 'extractForeignKeys', label: 'Foreign Keys' },
                          { key: 'extractUniqueConstraints', label: 'Unique Constraints' },
                          { key: 'extractCheckConstraints', label: 'Check Constraints' }
                        ].map(opt => (
                          <label key={opt.key} className="flex items-center gap-1.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={extractionOptions[opt.key as keyof ExtractionOptions] as boolean}
                              onChange={() => toggleExtractionOption(opt.key as keyof ExtractionOptions)}
                              className="w-3 h-3 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                            />
                            <span className="text-[11px] text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Indexes */}
                    <div>
                      <h4 className="text-[10px] font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-2">
                        Indexes
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5 ml-4">
                        {[
                          { key: 'extractIndexes', label: 'Indexes' },
                          { key: 'extractClusteredIndexes', label: 'Clustered Indexes' },
                          { key: 'extractUniqueIndexes', label: 'Unique Indexes' }
                        ].map(opt => (
                          <label key={opt.key} className="flex items-center gap-1.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={extractionOptions[opt.key as keyof ExtractionOptions] as boolean}
                              onChange={() => toggleExtractionOption(opt.key as keyof ExtractionOptions)}
                              className="w-3 h-3 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                            />
                            <span className="text-[11px] text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Triggers */}
                    <div>
                      <h4 className="text-[10px] font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-2">
                        Triggers
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5 ml-4">
                        {[
                          { key: 'extractTriggers', label: 'Triggers' },
                          { key: 'extractTriggerDefinitions', label: 'Trigger Definitions' }
                        ].map(opt => (
                          <label key={opt.key} className="flex items-center gap-1.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={extractionOptions[opt.key as keyof ExtractionOptions] as boolean}
                              onChange={() => toggleExtractionOption(opt.key as keyof ExtractionOptions)}
                              className="w-3 h-3 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                            />
                            <span className="text-[11px] text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Relationships */}
                    <div>
                      <h4 className="text-[10px] font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <Shield className="w-3 h-3" />
                        Relationships
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5 ml-4">
                        {[
                          { key: 'reverseEngineerRelationships', label: 'Reverse Engineer Relationships' },
                          { key: 'inferRelationshipsFromNames', label: 'Infer from Column Names' },
                          { key: 'detectManyToMany', label: 'Detect Many-to-Many' }
                        ].map(opt => (
                          <label key={opt.key} className="flex items-center gap-1.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={extractionOptions[opt.key as keyof ExtractionOptions] as boolean}
                              onChange={() => toggleExtractionOption(opt.key as keyof ExtractionOptions)}
                              className="w-3 h-3 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                            />
                            <span className="text-[11px] text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Documentation */}
                    <div>
                      <h4 className="text-[10px] font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <Info className="w-3 h-3" />
                        Documentation
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5 ml-4">
                        {[
                          { key: 'extractComments', label: 'Comments' },
                          { key: 'extractDescriptions', label: 'Descriptions' },
                          { key: 'extractExtendedProperties', label: 'Extended Properties' }
                        ].map(opt => (
                          <label key={opt.key} className="flex items-center gap-1.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={extractionOptions[opt.key as keyof ExtractionOptions] as boolean}
                              onChange={() => toggleExtractionOption(opt.key as keyof ExtractionOptions)}
                              className="w-3 h-3 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                            />
                            <span className="text-[11px] text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Security */}
                    <div>
                      <h4 className="text-[10px] font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <Shield className="w-3 h-3" />
                        Security
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5 ml-4">
                        {[
                          { key: 'extractPermissions', label: 'Permissions' },
                          { key: 'extractRoles', label: 'Roles' },
                          { key: 'extractOwnership', label: 'Ownership' }
                        ].map(opt => (
                          <label key={opt.key} className="flex items-center gap-1.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={extractionOptions[opt.key as keyof ExtractionOptions] as boolean}
                              onChange={() => toggleExtractionOption(opt.key as keyof ExtractionOptions)}
                              className="w-3 h-3 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                            />
                            <span className="text-[11px] text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Model Generation */}
                    <div>
                      <h4 className="text-[10px] font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-2">
                        Model Generation
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5 ml-4">
                        {[
                          { key: 'createLogicalModel', label: 'Create Logical Model' },
                          { key: 'createPhysicalModel', label: 'Create Physical Model' },
                          { key: 'inferBusinessNames', label: 'Infer Business Names' },
                          { key: 'normalizationAnalysis', label: 'Normalization Analysis' }
                        ].map(opt => (
                          <label key={opt.key} className="flex items-center gap-1.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={extractionOptions[opt.key as keyof ExtractionOptions] as boolean}
                              onChange={() => toggleExtractionOption(opt.key as keyof ExtractionOptions)}
                              className="w-3 h-3 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                            />
                            <span className="text-[11px] text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Continue Button */}
            {selectedExtractionSet && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => {
                    setExtractionConfirmed(true);
                    setCurrentStep(3);
                    showToast('success', 'Extraction Options Configured', `Using ${selectedExtractionSet === 'custom' ? 'custom' : selectedExtractionSet} profile`);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs flex items-center gap-1.5"
                >
                  Continue to Object Selection
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
    );
  };

  const renderStep3Content = () => {
    return (
      <div className="space-y-4">
            {reverseEngineeringStatus === 'idle' && (
              <>

                {/* Object Type Filter */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                    Object Type
                  </label>
                  <div className="inline-flex bg-gray-100 dark:bg-zinc-900 rounded p-0.5 gap-0.5">
                    <button
                      onClick={() => setObjectTypeFilter('all')}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                        objectTypeFilter === 'all'
                          ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                          : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setObjectTypeFilter('table')}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                        objectTypeFilter === 'table'
                          ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                          : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      Tables
                    </button>
                    <button
                      onClick={() => setObjectTypeFilter('view')}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                        objectTypeFilter === 'view'
                          ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                          : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      Views
                    </button>
                  </div>
                </div>

                {/* Search and Actions - Compact */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Filter by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded text-xs text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={selectAllObjects}
                    className="px-2.5 py-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    All
                  </button>
                  <button
                    onClick={deselectAllObjects}
                    className="px-2.5 py-2 text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 font-medium"
                  >
                    None
                  </button>
                </div>

                {/* Schema Tree - Hierarchical compact style */}
                <div className="border border-gray-300 dark:border-zinc-700 rounded overflow-hidden">
                  <div className="max-h-[400px] overflow-y-auto">
                    {availableSchemas.map((schema) => {
                      const schemaObjects = getFilteredObjectsForSchema(schema);
                      if (schemaObjects.length === 0) return null;

                      const isExpanded = expandedSchemas.has(schema);
                      const schemaObjectIds = schemaObjects.map(obj => obj.id);
                      const selectedCount = schemaObjectIds.filter(id => selectedObjects.has(id)).length;
                      const allSelected = schemaObjectIds.length > 0 && selectedCount === schemaObjectIds.length;
                      const partiallySelected = selectedCount > 0 && selectedCount < schemaObjectIds.length;

                      return (
                        <div key={schema} className="border-b border-gray-200 dark:border-zinc-800 last:border-b-0">
                          {/* Schema Header */}
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-zinc-900/50 hover:bg-gray-100 dark:hover:bg-zinc-900">
                            <button
                              onClick={() => toggleSchema(schema)}
                              className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-400 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-400 flex-shrink-0" />
                              )}
                              <span className="text-xs font-semibold text-gray-900 dark:text-zinc-100">
                                {schema}
                              </span>
                              <span className="text-[10px] text-gray-500 dark:text-zinc-500">
                                ({schemaObjects.length} {schemaObjects.length === 1 ? 'object' : 'objects'})
                              </span>
                            </button>
                            <input
                              type="checkbox"
                              checked={allSelected}
                              ref={(el) => {
                                if (el) el.indeterminate = partiallySelected;
                              }}
                              onChange={() => toggleSchemaObjects(schema)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-3.5 h-3.5 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                            />
                          </div>

                          {/* Schema Objects (when expanded) */}
                          {isExpanded && (
                            <AnimatePresence>
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {schemaObjects.map((obj) => (
                                  <motion.label
                                    key={obj.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`flex items-center gap-2.5 px-3 py-2 pl-9 border-t border-gray-200 dark:border-zinc-800 cursor-pointer transition-colors ${
                                      selectedObjects.has(obj.id)
                                        ? 'bg-blue-50 dark:bg-blue-950/20'
                                        : 'hover:bg-gray-50 dark:hover:bg-zinc-900'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedObjects.has(obj.id)}
                                      onChange={() => toggleObjectSelection(obj.id)}
                                      className="w-3.5 h-3.5 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-medium text-gray-900 dark:text-zinc-100">
                                          {obj.name}
                                        </span>
                                        <span className="text-[9px] px-1 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 rounded uppercase font-semibold">
                                          {obj.type}
                                        </span>
                                        {obj.hasForeignKeys && (
                                          <span className="text-[9px] px-1 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded uppercase font-semibold">FK</span>
                                        )}
                                      </div>
                                      <p className="text-[10px] text-gray-500 dark:text-zinc-500 mt-0.5">
                                        {obj.columnCount} cols · {obj.rowCount} rows
                                      </p>
                                    </div>
                                  </motion.label>
                                ))}
                              </motion.div>
                            </AnimatePresence>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="border border-gray-300 dark:border-zinc-700 rounded overflow-hidden">
                  <button
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-zinc-900/50 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Settings2 className="w-3.5 h-3.5 text-gray-600 dark:text-zinc-400" />
                      <span className="text-xs font-semibold text-gray-900 dark:text-zinc-100">
                        Advanced Options
                      </span>
                    </div>
                    {showAdvancedOptions ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-400" />
                    )}
                  </button>

                  {showAdvancedOptions && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-3 space-y-2 border-t border-gray-200 dark:border-zinc-800"
                      >
                        {/* Include System Objects */}
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={advancedOptions.includeSystemObjects}
                            onChange={(e) => setAdvancedOptions({ ...advancedOptions, includeSystemObjects: e.target.checked })}
                            className="w-3.5 h-3.5 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                          />
                          <span className="text-xs text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                            Include system objects
                          </span>
                        </label>

                        {/* Include Indexes */}
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={advancedOptions.includeIndexes}
                            onChange={(e) => setAdvancedOptions({ ...advancedOptions, includeIndexes: e.target.checked })}
                            className="w-3.5 h-3.5 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                          />
                          <span className="text-xs text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                            Include indexes
                          </span>
                        </label>

                        {/* Include Constraints */}
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={advancedOptions.includeConstraints}
                            onChange={(e) => setAdvancedOptions({ ...advancedOptions, includeConstraints: e.target.checked })}
                            className="w-3.5 h-3.5 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                          />
                          <span className="text-xs text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                            Include constraints (PK, FK, unique)
                          </span>
                        </label>

                        {/* Include Triggers */}
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={advancedOptions.includeTriggers}
                            onChange={(e) => setAdvancedOptions({ ...advancedOptions, includeTriggers: e.target.checked })}
                            className="w-3.5 h-3.5 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                          />
                          <span className="text-xs text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                            Include triggers
                          </span>
                        </label>

                        {/* Include Stored Procedures */}
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={advancedOptions.includeStoredProcedures}
                            onChange={(e) => setAdvancedOptions({ ...advancedOptions, includeStoredProcedures: e.target.checked })}
                            className="w-3.5 h-3.5 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                          />
                          <span className="text-xs text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                            Include stored procedures
                          </span>
                        </label>

                        <div className="border-t border-gray-200 dark:border-zinc-800 my-2 pt-2">
                          <p className="text-[10px] font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-2">
                            Relationship Detection
                          </p>
                        </div>

                        {/* Reverse Engineer Relationships */}
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={advancedOptions.reverseEngineerRelationships}
                            onChange={(e) => setAdvancedOptions({ ...advancedOptions, reverseEngineerRelationships: e.target.checked })}
                            className="w-3.5 h-3.5 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                          />
                          <span className="text-xs text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                            Reverse engineer existing relationships
                          </span>
                        </label>

                        {/* Infer Relationships */}
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={advancedOptions.inferRelationshipsFromNames}
                            onChange={(e) => setAdvancedOptions({ ...advancedOptions, inferRelationshipsFromNames: e.target.checked })}
                            className="w-3.5 h-3.5 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                          />
                          <span className="text-xs text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                            Infer relationships from column names
                          </span>
                        </label>

                        <div className="border-t border-gray-200 dark:border-zinc-800 my-2 pt-2">
                          <p className="text-[10px] font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-2">
                            Model Options
                          </p>
                        </div>

                        {/* Create Logical Model */}
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={advancedOptions.createLogicalModel}
                            onChange={(e) => setAdvancedOptions({ ...advancedOptions, createLogicalModel: e.target.checked })}
                            className="w-3.5 h-3.5 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                          />
                          <span className="text-xs text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-zinc-100">
                            Create logical model view
                          </span>
                        </label>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>

                {/* Selection Summary and Action Button */}
                {selectedObjects.size > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded">
                      <span className="text-xs text-gray-700 dark:text-zinc-300">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedObjects.size}</span> objects selected
                      </span>
                    </div>
                    <button
                      onClick={handleStartReverseEngineering}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      Start Reverse Engineering
                    </button>
                  </div>
                )}
              </>
            )}

            {reverseEngineeringStatus === 'processing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-6"
              >
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded">
                  <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-500 animate-spin flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-zinc-100 mb-1">
                      Processing schema...
                    </p>
                    <p className="text-[10px] text-gray-600 dark:text-zinc-400 truncate">
                      {reverseEngineeringMessage}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {reverseEngineeringProgress}%
                  </span>
                </div>
              </motion.div>
            )}

            {reverseEngineeringStatus === 'complete' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                </motion.div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100 mb-1">
                  Complete
                </h3>
                <p className="text-xs text-gray-600 dark:text-zinc-400 mb-6">
                  Created {entitiesCreated} entities with relationships
                </p>

                <div className="flex items-center justify-center gap-2">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs">
                    View Model
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded font-medium text-xs">
                    Export
                  </button>
                </div>
              </motion.div>
            )}
          </div>
    );
  };

  const renderStepContent = () => {
    if (currentStep === 1) return renderStep1Content();
    if (currentStep === 2) return renderStep2Content();
    if (currentStep === 3) return renderStep3Content();
    return null;
  };

  return (
    <>
      <WizardLayout
        title="Reverse Engineering"
        description="Import existing database schemas and automatically generate visual data models"
        steps={wizardSteps}
        currentStep={currentStep}
        icon={<RefreshCw className="w-8 h-8" />}
        onNext={() => setCurrentStep(prev => prev + 1)}
        onBack={() => setCurrentStep(prev => prev - 1)}
        nextLabel={currentStep === 3 ? 'Finish' : 'Next Step'}
        nextDisabled={
          (currentStep === 1 && !canProceedToStep2) ||
          (currentStep === 2 && !canProceedToStep3) ||
          (currentStep === 3 && (selectedObjects.size === 0 || reverseEngineeringStatus !== 'complete'))
        }
        hideNavigation={(currentStep === 2 && !selectedExtractionSet) || (currentStep === 3 && reverseEngineeringStatus !== 'idle')}
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
