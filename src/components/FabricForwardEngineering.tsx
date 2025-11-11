'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Warehouse,
  Cloud,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Play,
  Download,
  FileText,
  Key,
  Filter,
  Shield,
  ChevronRight,
  ChevronDown,
  Info,
  Search,
  X
} from 'lucide-react';
import {
  mockWorkspaces,
  mockModels,
  mockFabricObjects,
  simulateSSOConnection,
  simulateValidation,
  simulateDeployment,
  mockValidationResults
} from '@/utils/fabricMockData';
import Toast, { ToastType } from './shared/Toast';
import ProgressBar from './shared/ProgressBar';

type TargetEnvironment = 'lakehouse' | 'warehouse';
type ExecutionMode = 'ddl' | 'deploy';

interface SchemaGenerationOptions {
  // Database & Schema
  createDatabase: boolean;
  dropDatabase: boolean;
  createSchema: boolean;
  dropSchema: boolean;

  // Table Options
  createTable: boolean;
  dropTable: boolean;
  entityIntegrity: boolean;
  tableCheck: boolean;
  tableValidation: boolean;
  physicalStorage: boolean;
  preScript: boolean;
  postScript: boolean;

  // Column Options
  identityColumns: boolean;
  defaultValues: boolean;
  computedColumns: boolean;

  // Index Options
  createPrimaryKeyIndex: boolean;
  createAlternateKeyIndex: boolean;
  createForeignKeyIndex: boolean;
  dropIndex: boolean;
  clusteredIndex: boolean;

  // View Options
  createView: boolean;
  dropView: boolean;
  materializedView: boolean;

  // Referential Integrity
  foreignKeyConstraints: boolean;
  dropForeignKey: boolean;
  checkConstraints: boolean;
  uniqueConstraints: boolean;

  // Triggers
  createTriggers: boolean;
  dropTriggers: boolean;
  relationshipOverrideTriggers: boolean;

  // Security
  grantPermissions: boolean;
  revokePermissions: boolean;
  createRoles: boolean;
  createUsers: boolean;

  // Other Options
  constraintNames: boolean;
  comments: boolean;
  quoteNames: boolean;
  ownerNames: boolean;
  qualifyNames: boolean;
}

const DEFAULT_OPTION_SETS: Record<string, SchemaGenerationOptions> = {
  complete: {
    createDatabase: true,
    dropDatabase: false,
    createSchema: true,
    dropSchema: false,
    createTable: true,
    dropTable: false,
    entityIntegrity: true,
    tableCheck: true,
    tableValidation: true,
    physicalStorage: true,
    preScript: true,
    postScript: true,
    identityColumns: true,
    defaultValues: true,
    computedColumns: true,
    createPrimaryKeyIndex: true,
    createAlternateKeyIndex: true,
    createForeignKeyIndex: true,
    dropIndex: false,
    clusteredIndex: true,
    createView: true,
    dropView: false,
    materializedView: true,
    foreignKeyConstraints: true,
    dropForeignKey: false,
    checkConstraints: true,
    uniqueConstraints: true,
    createTriggers: true,
    dropTriggers: false,
    relationshipOverrideTriggers: true,
    grantPermissions: true,
    revokePermissions: false,
    createRoles: true,
    createUsers: false,
    constraintNames: true,
    comments: true,
    quoteNames: true,
    ownerNames: true,
    qualifyNames: true
  },
  tablesOnly: {
    createDatabase: false,
    dropDatabase: false,
    createSchema: false,
    dropSchema: false,
    createTable: true,
    dropTable: false,
    entityIntegrity: true,
    tableCheck: true,
    tableValidation: false,
    physicalStorage: true,
    preScript: false,
    postScript: false,
    identityColumns: true,
    defaultValues: true,
    computedColumns: true,
    createPrimaryKeyIndex: true,
    createAlternateKeyIndex: false,
    createForeignKeyIndex: false,
    dropIndex: false,
    clusteredIndex: true,
    createView: false,
    dropView: false,
    materializedView: false,
    foreignKeyConstraints: true,
    dropForeignKey: false,
    checkConstraints: true,
    uniqueConstraints: true,
    createTriggers: false,
    dropTriggers: false,
    relationshipOverrideTriggers: false,
    grantPermissions: false,
    revokePermissions: false,
    createRoles: false,
    createUsers: false,
    constraintNames: true,
    comments: true,
    quoteNames: false,
    ownerNames: false,
    qualifyNames: false
  },
  minimal: {
    createDatabase: false,
    dropDatabase: false,
    createSchema: false,
    dropSchema: false,
    createTable: true,
    dropTable: false,
    entityIntegrity: false,
    tableCheck: false,
    tableValidation: false,
    physicalStorage: false,
    preScript: false,
    postScript: false,
    identityColumns: true,
    defaultValues: true,
    computedColumns: false,
    createPrimaryKeyIndex: true,
    createAlternateKeyIndex: false,
    createForeignKeyIndex: false,
    dropIndex: false,
    clusteredIndex: false,
    createView: false,
    dropView: false,
    materializedView: false,
    foreignKeyConstraints: false,
    dropForeignKey: false,
    checkConstraints: false,
    uniqueConstraints: false,
    createTriggers: false,
    dropTriggers: false,
    relationshipOverrideTriggers: false,
    grantPermissions: false,
    revokePermissions: false,
    createRoles: false,
    createUsers: false,
    constraintNames: false,
    comments: false,
    quoteNames: false,
    ownerNames: false,
    qualifyNames: false
  }
};

export default function FabricForwardEngineering() {
  // Step 1: Model Selection
  const [selectedModel, setSelectedModel] = useState<string>('');

  // Step 2: Execution Type
  const [executionMode, setExecutionMode] = useState<ExecutionMode | null>(null);

  // Step 3: Schema Generation Options
  const [selectedOptionSet, setSelectedOptionSet] = useState<string>('');
  const [schemaOptions, setSchemaOptions] = useState<SchemaGenerationOptions>(DEFAULT_OPTION_SETS.complete);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [optionsConfirmed, setOptionsConfirmed] = useState(false);

  // Step 4: Connection (only for MS Fabric deployment)
  const [targetEnvironment, setTargetEnvironment] = useState<TargetEnvironment>('warehouse');
  const [targetWorkspace, setTargetWorkspace] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [connectedUser, setConnectedUser] = useState('');

  // Step 4: Schema/Table Selection
  const [selectedObjects, setSelectedObjects] = useState<Set<string>>(new Set());
  const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(new Set(['dbo', 'sales']));
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'table' | 'view'>('all');

  // Step 5: Validation
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'complete'>('idle');
  const [validationProgress, setValidationProgress] = useState(0);
  const [validationMessage, setValidationMessage] = useState('');

  // Step 6: DDL Preview
  const [showDDLPreview, setShowDDLPreview] = useState(false);
  const [ddlContent, setDdlContent] = useState('');

  // Deployment
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'complete'>('idle');
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentMessage, setDeploymentMessage] = useState('');

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

  // Handle option set change
  const handleOptionSetChange = (optionSetName: string) => {
    setSelectedOptionSet(optionSetName);
    setSchemaOptions(DEFAULT_OPTION_SETS[optionSetName]);
  };

  // Toggle individual option
  const toggleSchemaOption = (optionKey: keyof SchemaGenerationOptions) => {
    setSchemaOptions(prev => ({
      ...prev,
      [optionKey]: !prev[optionKey]
    }));
    setSelectedOptionSet('custom');
  };

  // Auto-validate when objects are selected
  useEffect(() => {
    if (selectedObjects.size > 0 && validationStatus === 'idle') {
      handleValidate();
    }
  }, [selectedObjects]);

  const handleSSOConnect = async () => {
    setConnectionStatus('connecting');
    try {
      const result = await simulateSSOConnection(targetWorkspace);
      setConnectionStatus('connected');
      setConnectedUser(result.user);
      showToast('success', 'Connected Successfully', `Authenticated as ${result.user}`);
    } catch (error) {
      setConnectionStatus('error');
      showToast('error', 'Connection Failed', 'Unable to authenticate with Fabric');
    }
  };

  const handleValidate = async () => {
    setValidationStatus('validating');
    try {
      await simulateValidation((progress, message) => {
        setValidationProgress(progress);
        setValidationMessage(message);
      });
      setValidationStatus('complete');

      // Generate mock DDL
      const mockDDL = `-- Forward Engineering DDL Script
-- Generated: ${new Date().toLocaleString()}
-- Target: Microsoft Fabric ${targetEnvironment === 'warehouse' ? 'Warehouse' : 'Lakehouse'}
-- Objects: ${selectedObjects.size} selected

${Array.from(selectedObjects).map(objId => {
  const obj = Object.values(mockFabricObjects).flat().find(o => o.id === objId);
  if (!obj) return '';

  if (obj.type === 'table') {
    return `-- Table: ${obj.name}
CREATE TABLE [${obj.name}] (
    [ID] INT PRIMARY KEY,
    [Name] NVARCHAR(255),
    [CreatedDate] DATETIME DEFAULT GETDATE()
);
GO\n`;
  } else if (obj.type === 'view') {
    return `-- View: ${obj.name}
CREATE VIEW [${obj.name}] AS
SELECT * FROM [dbo].[BaseTable];
GO\n`;
  }
  return '';
}).join('\n')}

-- End of script`;

      setDdlContent(mockDDL);
      showToast('success', 'Validation Complete', 'Found 2 errors and 2 warnings');
    } catch (error) {
      showToast('error', 'Validation Failed', 'An error occurred during validation');
    }
  };

  const handleDeploy = async () => {
    setDeploymentStatus('deploying');
    try {
      const result = await simulateDeployment(executionMode!, (progress, message) => {
        setDeploymentProgress(progress);
        setDeploymentMessage(message);
      });
      setDeploymentStatus('complete');
      showToast('success', executionMode === 'deploy' ? 'Deployment Complete!' : 'DDL Generated!', result.details);
    } catch (error) {
      showToast('error', 'Deployment Failed', 'An error occurred');
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

  const toggleSchemaExpanded = (schema: string) => {
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

  const selectAllObjects = () => {
    const allIds = Object.values(mockFabricObjects).flat().map(obj => obj.id);
    setSelectedObjects(new Set(allIds));
  };

  const clearAllObjects = () => {
    setSelectedObjects(new Set());
    setValidationStatus('idle');
    setShowDDLPreview(false);
  };

  const filterObjects = (objects: any[]) => {
    return objects.filter(obj => {
      const matchesSearch = obj.name.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesType = typeFilter === 'all' || obj.type === typeFilter;
      return matchesSearch && matchesType;
    });
  };

  const canProceedToConnection = selectedModel && executionMode && optionsConfirmed;
  const canProceedToObjects = optionsConfirmed && (executionMode === 'ddl' || (executionMode === 'deploy' && connectionStatus === 'connected'));
  const canShowValidation = selectedObjects.size > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Forward Engineering to Microsoft Fabric
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generate DDL or deploy your data models to Microsoft Fabric
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Step 1: Model Selection */}
          <AnimatePresence mode="wait">
            {!selectedModel && (
              <motion.div
                key="model-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    1
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Select Model
                  </h2>
                </div>

                <div className="space-y-2">
                  {mockModels.filter(m => m.type === 'physical').map(model => (
                    <motion.div
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 rounded-lg cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{model.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {model.entityCount} entities • {model.lastModified}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 2: Execution Type */}
          <AnimatePresence mode="wait">
            {selectedModel && !executionMode && (
              <motion.div
                key="execution-type"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    2
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Select Execution Type
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    onClick={() => setExecutionMode('ddl')}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 text-left transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        Generate DDL File
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Create a SQL script file for manual deployment
                    </p>
                  </motion.button>

                  <motion.button
                    onClick={() => setExecutionMode('deploy')}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 text-left transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Cloud className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        Deploy to MS Fabric
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Deploy directly to Microsoft Fabric
                    </p>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3: Schema Generation Options */}
          <AnimatePresence mode="wait">
            {executionMode && !optionsConfirmed && (
              <motion.div
                key="schema-options"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    3
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Schema Generation Options
                  </h2>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Select a predefined option set or customize individual options for your schema generation
                </p>

                {/* Option Set Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Option Set
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          value: 'complete',
                          label: 'Complete Schema',
                          description: 'All database objects including security, triggers, and views',
                          icon: <Database className="w-5 h-5" />
                        },
                        {
                          value: 'tablesOnly',
                          label: 'Tables & Constraints',
                          description: 'Tables with primary keys, foreign keys, and basic constraints',
                          icon: <FileText className="w-5 h-5" />
                        },
                        {
                          value: 'minimal',
                          label: 'Minimal',
                          description: 'Basic table structures with primary keys only',
                          icon: <Filter className="w-5 h-5" />
                        }
                      ].map(optionSet => (
                        <motion.button
                          key={optionSet.value}
                          onClick={() => handleOptionSetChange(optionSet.value)}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            selectedOptionSet === optionSet.value
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={selectedOptionSet === optionSet.value ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}>
                              {optionSet.icon}
                            </div>
                            <span className={`font-semibold text-sm ${
                              selectedOptionSet === optionSet.value
                                ? 'text-blue-600'
                                : 'text-gray-900 dark:text-gray-100'
                            }`}>
                              {optionSet.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {optionSet.description}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Options Toggle */}
                  <button
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Advanced Options {selectedOptionSet === 'custom' && '(Customized)'}
                    </span>
                    {showAdvancedOptions ? (
                      <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>

                  {/* Advanced Options Panel */}
                  <AnimatePresence>
                    {showAdvancedOptions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4 max-h-96 overflow-y-auto">
                          {/* Database & Schema */}
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                              <Database className="w-4 h-4" />
                              Database & Schema
                            </h4>
                            <div className="grid grid-cols-2 gap-2 ml-6">
                              {[
                                { key: 'createDatabase', label: 'Create Database' },
                                { key: 'dropDatabase', label: 'Drop Database' },
                                { key: 'createSchema', label: 'Create Schema' },
                                { key: 'dropSchema', label: 'Drop Schema' }
                              ].map(opt => (
                                <label key={opt.key} className="flex items-center gap-2 text-sm cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={schemaOptions[opt.key as keyof SchemaGenerationOptions] as boolean}
                                    onChange={() => toggleSchemaOption(opt.key as keyof SchemaGenerationOptions)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Table Options */}
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Tables
                            </h4>
                            <div className="grid grid-cols-2 gap-2 ml-6">
                              {[
                                { key: 'createTable', label: 'Create Table' },
                                { key: 'dropTable', label: 'Drop Table' },
                                { key: 'entityIntegrity', label: 'Entity Integrity' },
                                { key: 'tableCheck', label: 'Table Check Constraints' },
                                { key: 'tableValidation', label: 'Table Validation' },
                                { key: 'physicalStorage', label: 'Physical Storage' },
                                { key: 'preScript', label: 'Pre-Scripts' },
                                { key: 'postScript', label: 'Post-Scripts' }
                              ].map(opt => (
                                <label key={opt.key} className="flex items-center gap-2 text-sm cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={schemaOptions[opt.key as keyof SchemaGenerationOptions] as boolean}
                                    onChange={() => toggleSchemaOption(opt.key as keyof SchemaGenerationOptions)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Column Options */}
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Columns</h4>
                            <div className="grid grid-cols-2 gap-2 ml-6">
                              {[
                                { key: 'identityColumns', label: 'Identity Columns' },
                                { key: 'defaultValues', label: 'Default Values' },
                                { key: 'computedColumns', label: 'Computed Columns' }
                              ].map(opt => (
                                <label key={opt.key} className="flex items-center gap-2 text-sm cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={schemaOptions[opt.key as keyof SchemaGenerationOptions] as boolean}
                                    onChange={() => toggleSchemaOption(opt.key as keyof SchemaGenerationOptions)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Index Options */}
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                              <Key className="w-4 h-4" />
                              Indexes
                            </h4>
                            <div className="grid grid-cols-2 gap-2 ml-6">
                              {[
                                { key: 'createPrimaryKeyIndex', label: 'Primary Key Index' },
                                { key: 'createAlternateKeyIndex', label: 'Alternate Key Index' },
                                { key: 'createForeignKeyIndex', label: 'Foreign Key Index' },
                                { key: 'dropIndex', label: 'Drop Index' },
                                { key: 'clusteredIndex', label: 'Clustered Index' }
                              ].map(opt => (
                                <label key={opt.key} className="flex items-center gap-2 text-sm cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={schemaOptions[opt.key as keyof SchemaGenerationOptions] as boolean}
                                    onChange={() => toggleSchemaOption(opt.key as keyof SchemaGenerationOptions)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* View Options */}
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Views</h4>
                            <div className="grid grid-cols-2 gap-2 ml-6">
                              {[
                                { key: 'createView', label: 'Create View' },
                                { key: 'dropView', label: 'Drop View' },
                                { key: 'materializedView', label: 'Materialized View' }
                              ].map(opt => (
                                <label key={opt.key} className="flex items-center gap-2 text-sm cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={schemaOptions[opt.key as keyof SchemaGenerationOptions] as boolean}
                                    onChange={() => toggleSchemaOption(opt.key as keyof SchemaGenerationOptions)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Referential Integrity */}
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Referential Integrity
                            </h4>
                            <div className="grid grid-cols-2 gap-2 ml-6">
                              {[
                                { key: 'foreignKeyConstraints', label: 'Foreign Key Constraints' },
                                { key: 'dropForeignKey', label: 'Drop Foreign Key' },
                                { key: 'checkConstraints', label: 'Check Constraints' },
                                { key: 'uniqueConstraints', label: 'Unique Constraints' }
                              ].map(opt => (
                                <label key={opt.key} className="flex items-center gap-2 text-sm cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={schemaOptions[opt.key as keyof SchemaGenerationOptions] as boolean}
                                    onChange={() => toggleSchemaOption(opt.key as keyof SchemaGenerationOptions)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Triggers */}
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Triggers</h4>
                            <div className="grid grid-cols-2 gap-2 ml-6">
                              {[
                                { key: 'createTriggers', label: 'Create Triggers' },
                                { key: 'dropTriggers', label: 'Drop Triggers' },
                                { key: 'relationshipOverrideTriggers', label: 'Relationship Override Triggers' }
                              ].map(opt => (
                                <label key={opt.key} className="flex items-center gap-2 text-sm cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={schemaOptions[opt.key as keyof SchemaGenerationOptions] as boolean}
                                    onChange={() => toggleSchemaOption(opt.key as keyof SchemaGenerationOptions)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Security */}
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Security
                            </h4>
                            <div className="grid grid-cols-2 gap-2 ml-6">
                              {[
                                { key: 'grantPermissions', label: 'Grant Permissions' },
                                { key: 'revokePermissions', label: 'Revoke Permissions' },
                                { key: 'createRoles', label: 'Create Roles' },
                                { key: 'createUsers', label: 'Create Users' }
                              ].map(opt => (
                                <label key={opt.key} className="flex items-center gap-2 text-sm cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={schemaOptions[opt.key as keyof SchemaGenerationOptions] as boolean}
                                    onChange={() => toggleSchemaOption(opt.key as keyof SchemaGenerationOptions)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Other Options */}
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                              <Info className="w-4 h-4" />
                              Other Options
                            </h4>
                            <div className="grid grid-cols-2 gap-2 ml-6">
                              {[
                                { key: 'constraintNames', label: 'Constraint Names' },
                                { key: 'comments', label: 'Comments' },
                                { key: 'quoteNames', label: 'Quote Names' },
                                { key: 'ownerNames', label: 'Owner Names' },
                                { key: 'qualifyNames', label: 'Qualify Names' }
                              ].map(opt => (
                                <label key={opt.key} className="flex items-center gap-2 text-sm cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={schemaOptions[opt.key as keyof SchemaGenerationOptions] as boolean}
                                    onChange={() => toggleSchemaOption(opt.key as keyof SchemaGenerationOptions)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Continue Button */}
                  <div className="flex justify-center pt-4">
                    <motion.button
                      onClick={() => {
                        setOptionsConfirmed(true);
                        showToast('success', 'Options Selected', `Using ${selectedOptionSet === 'custom' ? 'custom' : selectedOptionSet} option set`);
                      }}
                      disabled={!selectedOptionSet}
                      whileHover={{ scale: selectedOptionSet ? 1.05 : 1 }}
                      className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${
                        selectedOptionSet
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 4: Connection Settings (Only for MS Fabric deployment) */}
          <AnimatePresence mode="wait">
            {executionMode === 'deploy' && optionsConfirmed && connectionStatus !== 'connected' && (
              <motion.div
                key="connection-settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    4
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Connection Settings
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Target Environment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Environment
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'lakehouse', label: 'Lakehouse', icon: <Database className="w-5 h-5" /> },
                        { value: 'warehouse', label: 'Warehouse', icon: <Warehouse className="w-5 h-5" /> }
                      ].map(target => (
                        <button
                          key={target.value}
                          onClick={() => setTargetEnvironment(target.value as TargetEnvironment)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            targetEnvironment === target.value
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <div className={targetEnvironment === target.value ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}>
                              {target.icon}
                            </div>
                            <span className={`text-sm font-medium ${
                              targetEnvironment === target.value
                                ? 'text-blue-600'
                                : 'text-gray-900 dark:text-gray-100'
                            }`}>
                              {target.label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Workspace */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Workspace
                    </label>
                    <select
                      value={targetWorkspace}
                      onChange={(e) => setTargetWorkspace(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select target workspace...</option>
                      {mockWorkspaces.map(ws => (
                        <option key={ws.id} value={ws.id}>{ws.name} ({ws.region})</option>
                      ))}
                    </select>
                  </div>

                  {/* SSO Connection */}
                  {targetWorkspace && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Key className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              Connect using SSO
                            </p>
                            {connectedUser && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Authenticated as {connectedUser}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={handleSSOConnect}
                          disabled={connectionStatus === 'connecting'}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                        >
                          {connectionStatus === 'connecting' ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            <>
                              <Key className="w-5 h-5" />
                              Connect
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 5: Schema/Table Selection */}
          <AnimatePresence mode="wait">
            {canProceedToObjects && selectedObjects.size === 0 && (
              <motion.div
                key="object-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {executionMode === 'deploy' ? '5' : '4'}
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Select Objects
                </h2>
              </div>

              {/* Filters */}
              <div className="mb-4 space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search objects..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {searchFilter && (
                      <button
                        onClick={() => setSearchFilter('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as 'all' | 'table' | 'view')}
                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="table">Tables Only</option>
                    <option value="view">Views Only</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {selectedObjects.size} objects selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={selectAllObjects}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearAllObjects}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Objects List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Object.entries(mockFabricObjects).map(([schema, objects]) => {
                  const filteredObjects = filterObjects(objects);
                  if (filteredObjects.length === 0) return null;

                  return (
                    <div key={schema} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      {/* Schema Header */}
                      <button
                        onClick={() => toggleSchemaExpanded(schema)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Database className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">{schema}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            ({filteredObjects.filter(obj => selectedObjects.has(obj.id)).length}/{filteredObjects.length})
                          </span>
                        </div>
                        {expandedSchemas.has(schema) ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>

                      {/* Objects List */}
                      {expandedSchemas.has(schema) && (
                        <div className="p-2 space-y-1">
                          {filteredObjects.map(obj => (
                            <label
                              key={obj.id}
                              className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-750 rounded cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedObjects.has(obj.id)}
                                onChange={() => toggleObjectSelection(obj.id)}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-900 dark:text-gray-100 flex-1">{obj.name}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                obj.type === 'table'
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                  : obj.type === 'view'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}>
                                {obj.type}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 6: Validation Summary */}
          <AnimatePresence mode="wait">
            {canShowValidation && validationStatus !== 'idle' && validationStatus !== 'complete' && (
              <motion.div
                key="validation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {executionMode === 'deploy' ? '6' : '5'}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Validating...
                  </h2>
                </div>

                {validationStatus === 'validating' && (
                  <div className="py-8">
                    <ProgressBar
                      progress={validationProgress}
                      message={validationMessage}
                      animated
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 7: DDL Preview & Deploy */}
          {canShowValidation && validationStatus === 'complete' && (
            <motion.div
              key="ddl-preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {executionMode === 'deploy' ? '7' : '6'}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    DDL Preview
                  </h2>
                </div>
                <button
                  onClick={() => setShowDDLPreview(!showDDLPreview)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  {showDDLPreview ? 'Hide' : 'Show'} Preview
                </button>
              </div>

              <AnimatePresence>
                {showDDLPreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <pre className="p-4 bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg text-xs overflow-x-auto max-h-96 overflow-y-auto">
                      {ddlContent}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-center gap-4">
                {deploymentStatus === 'idle' && (
                  <button
                    onClick={handleDeploy}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 text-lg"
                  >
                    {executionMode === 'deploy' ? (
                      <>
                        <Play className="w-5 h-5" />
                        Deploy to Fabric
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download DDL Script
                      </>
                    )}
                  </button>
                )}

                {deploymentStatus === 'deploying' && (
                  <div className="text-center py-8">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      {executionMode === 'deploy' ? 'Deploying to Fabric...' : 'Generating DDL...'}
                    </p>
                    <ProgressBar
                      progress={deploymentProgress}
                      message={deploymentMessage}
                      animated
                    />
                  </div>
                )}

                {deploymentStatus === 'complete' && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {executionMode === 'deploy' ? 'Deployment Successful!' : 'DDL Generated!'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {selectedObjects.size} objects {executionMode === 'deploy' ? 'deployed successfully' : 'ready for deployment'}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Toast
        {...toast}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
