'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Warehouse,
  Cloud,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Settings,
  Play,
  Download,
  FileText,
  Key,
  Filter,
  Shield,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Info
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

type TabId = 'source' | 'configure' | 'validate';
type TargetEnvironment = 'lakehouse' | 'warehouse' | 'datamart';
type ExecutionMode = 'ddl' | 'deploy';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'source', label: 'Select Source & Target', icon: <Database className="w-4 h-4" /> },
  { id: 'configure', label: 'Configure & Filter', icon: <Settings className="w-4 h-4" /> },
  { id: 'validate', label: 'Validate & Deploy', icon: <Play className="w-4 h-4" /> }
];

export default function FabricForwardEngineering() {
  const [activeTab, setActiveTab] = useState<TabId>('source');
  const [canProceed, setCanProceed] = useState(false);

  // Tab 1: Source & Target
  const [modelType, setModelType] = useState('physical');
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [targetEnvironment, setTargetEnvironment] = useState<TargetEnvironment>('warehouse');
  const [targetWorkspace, setTargetWorkspace] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [connectedUser, setConnectedUser] = useState('');

  // Tab 2: Configure & Filter
  const [options, setOptions] = useState({
    includeConstraints: true,
    includeIndexes: true,
    includeRelationships: true,
    applyNamingConvention: false,
    validateBeforeDeploy: true
  });
  const [executionMode, setExecutionMode] = useState<ExecutionMode>('deploy');
  const [selectedObjects, setSelectedObjects] = useState<Set<string>>(new Set(['obj-1', 'obj-2', 'obj-3', 'obj-6', 'obj-7']));
  const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(new Set(['dbo', 'sales']));

  // Tab 3: Validate & Deploy
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'complete'>('idle');
  const [validationProgress, setValidationProgress] = useState(0);
  const [validationMessage, setValidationMessage] = useState('');
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

  const handleSSOConnect = async () => {
    setConnectionStatus('connecting');
    try {
      const result = await simulateSSOConnection(targetWorkspace);
      setConnectionStatus('connected');
      setConnectedUser(result.user);
      setCanProceed(true);
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
      showToast('success', 'Validation Complete', 'Found 2 errors and 2 warnings');
    } catch (error) {
      showToast('error', 'Validation Failed', 'An error occurred during validation');
    }
  };

  const handleDeploy = async () => {
    setDeploymentStatus('deploying');
    try {
      const result = await simulateDeployment(executionMode, (progress, message) => {
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

  const canGoToNextTab = () => {
    if (activeTab === 'source') return connectionStatus === 'connected';
    if (activeTab === 'configure') return selectedObjects.size > 0;
    return true;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'source':
        return (
          <motion.div
            key="source"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Select Model */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Select Model
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Model Type
                  </label>
                  <select
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="logical">Logical Model</option>
                    <option value="physical">Physical Model</option>
                    <option value="semantic">Semantic Model</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Workspace
                  </label>
                  <select
                    value={selectedWorkspace}
                    onChange={(e) => setSelectedWorkspace(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select workspace...</option>
                    {mockWorkspaces.map(ws => (
                      <option key={ws.id} value={ws.id}>{ws.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Model List */}
              <div className="mt-4 space-y-2">
                {mockModels.filter(m => m.type === modelType).map(model => (
                  <div
                    key={model.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{model.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {model.entityCount} entities • {model.lastModified}
                        </p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Select Target Environment */}
            <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Cloud className="w-5 h-5 text-blue-600" />
                Select Target Environment
              </h3>

              {/* Target Type */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'lakehouse', label: 'Lakehouse', icon: <Database className="w-5 h-5" /> },
                  { value: 'warehouse', label: 'Warehouse', icon: <Warehouse className="w-5 h-5" /> },
                  { value: 'datamart', label: 'Datamart', icon: <Cloud className="w-5 h-5" /> }
                ].map(target => (
                  <button
                    key={target.value}
                    onClick={() => setTargetEnvironment(target.value as TargetEnvironment)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      targetEnvironment === target.value
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
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

              {/* Target Workspace */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Workspace
                </label>
                <select
                  value={targetWorkspace}
                  onChange={(e) => setTargetWorkspace(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select target workspace...</option>
                  {mockWorkspaces.map(ws => (
                    <option key={ws.id} value={ws.id}>{ws.name} ({ws.region})</option>
                  ))}
                </select>
              </div>

              {/* SSO Connection */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {connectionStatus === 'connected' ? 'Connected' : 'Connect using SSO'}
                      </p>
                      {connectedUser && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Authenticated as {connectedUser}
                        </p>
                      )}
                    </div>
                  </div>

                  {connectionStatus !== 'connected' && (
                    <button
                      onClick={handleSSOConnect}
                      disabled={connectionStatus === 'connecting' || !targetWorkspace}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                    >
                      {connectionStatus === 'connecting' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4" />
                          Connect
                        </>
                      )}
                    </button>
                  )}

                  {connectionStatus === 'connected' && (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'configure':
        return (
          <motion.div
            key="configure"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Option Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Option Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'includeConstraints', label: 'Include Constraints' },
                  { key: 'includeIndexes', label: 'Include Indexes' },
                  { key: 'includeRelationships', label: 'Include Relationships' },
                  { key: 'applyNamingConvention', label: 'Apply Naming Convention' },
                  { key: 'validateBeforeDeploy', label: 'Validate Before Deploy' }
                ].map(option => (
                  <label key={option.key} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                    <input
                      type="checkbox"
                      checked={options[option.key as keyof typeof options]}
                      onChange={(e) => setOptions({ ...options, [option.key]: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-900 dark:text-gray-100">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Execution Mode */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Play className="w-5 h-5 text-blue-600" />
                Execution Mode
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'ddl', label: 'Generate DDL Script', icon: <FileText className="w-5 h-5" />, desc: 'Create SQL script file' },
                  { value: 'deploy', label: 'Deploy to Fabric', icon: <Cloud className="w-5 h-5" />, desc: 'Direct deployment' }
                ].map(mode => (
                  <button
                    key={mode.value}
                    onClick={() => setExecutionMode(mode.value as ExecutionMode)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      executionMode === mode.value
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={executionMode === mode.value ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}>
                        {mode.icon}
                      </div>
                      <span className={`font-medium ${
                        executionMode === mode.value
                          ? 'text-blue-600'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {mode.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{mode.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Objects */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                Filter Objects
              </h3>

              <div className="space-y-2">
                {Object.entries(mockFabricObjects).map(([schema, objects]) => (
                  <div key={schema} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    {/* Schema Header */}
                    <button
                      onClick={() => toggleSchemaExpanded(schema)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">{schema}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ({objects.filter(obj => selectedObjects.has(obj.id)).length}/{objects.length})
                        </span>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform ${expandedSchemas.has(schema) ? 'rotate-90' : ''}`} />
                    </button>

                    {/* Objects List */}
                    {expandedSchemas.has(schema) && (
                      <div className="p-2 space-y-1">
                        {objects.map(obj => (
                          <label
                            key={obj.id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-750 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedObjects.has(obj.id)}
                              onChange={() => toggleObjectSelection(obj.id)}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-900 dark:text-gray-100">{obj.name}</span>
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
                ))}
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {selectedObjects.size} objects selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const allIds = Object.values(mockFabricObjects).flat().map(obj => obj.id);
                      setSelectedObjects(new Set(allIds));
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => setSelectedObjects(new Set())}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'validate':
        return (
          <motion.div
            key="validate"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Validation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Validation
              </h3>

              {validationStatus === 'idle' && (
                <div className="text-center py-8">
                  <button
                    onClick={handleValidate}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 mx-auto"
                  >
                    <Shield className="w-5 h-5" />
                    Run Validation
                  </button>
                </div>
              )}

              {validationStatus === 'validating' && (
                <div className="py-8">
                  <ProgressBar
                    progress={validationProgress}
                    message={validationMessage}
                    animated
                  />
                </div>
              )}

              {validationStatus === 'complete' && (
                <div className="space-y-4">
                  {/* Errors */}
                  {mockValidationResults.errors.length > 0 && (
                    <div className="border border-red-200 dark:border-red-800 rounded-lg overflow-hidden">
                      <div className="bg-red-50 dark:bg-red-900/20 px-4 py-3 border-b border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <span className="font-semibold text-red-900 dark:text-red-100">
                            {mockValidationResults.errors.length} Errors
                          </span>
                        </div>
                      </div>
                      <div className="p-2 space-y-1">
                        {mockValidationResults.errors.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-gray-900 dark:text-gray-100">{item.message}</p>
                              <p className="text-gray-600 dark:text-gray-400 text-xs">Object: {item.object}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Warnings */}
                  {mockValidationResults.warnings.length > 0 && (
                    <div className="border border-amber-200 dark:border-amber-800 rounded-lg overflow-hidden">
                      <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-3 border-b border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                          <span className="font-semibold text-amber-900 dark:text-amber-100">
                            {mockValidationResults.warnings.length} Warnings
                          </span>
                        </div>
                      </div>
                      <div className="p-2 space-y-1">
                        {mockValidationResults.warnings.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-gray-900 dark:text-gray-100">{item.message}</p>
                              <p className="text-gray-600 dark:text-gray-400 text-xs">Object: {item.object}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Info */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden">
                    <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 border-b border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-900 dark:text-blue-100">
                          Summary
                        </span>
                      </div>
                    </div>
                    <div className="p-2 space-y-1">
                      {mockValidationResults.info.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-900 dark:text-gray-100">{item.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Deployment */}
            {validationStatus === 'complete' && (
              <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  {executionMode === 'deploy' ? 'Deployment' : 'DDL Generation'}
                </h3>

                {deploymentStatus === 'idle' && (
                  <div className="text-center py-8">
                    <button
                      onClick={handleDeploy}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 mx-auto text-lg"
                    >
                      {executionMode === 'deploy' ? (
                        <>
                          <Play className="w-5 h-5" />
                          Deploy to Fabric
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Generate DDL Script
                        </>
                      )}
                    </button>
                  </div>
                )}

                {deploymentStatus === 'deploying' && (
                  <div className="py-8">
                    <div className="text-center mb-6">
                      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {executionMode === 'deploy' ? 'Deploying to Fabric...' : 'Generating DDL...'}
                      </p>
                    </div>
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
                      5 tables and 2 views {executionMode === 'deploy' ? 'deployed successfully' : 'ready for deployment'}
                    </p>

                    <div className="flex gap-4 justify-center">
                      {executionMode === 'ddl' && (
                        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2">
                          <Download className="w-5 h-5" />
                          Download Script
                        </button>
                      )}
                      <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Forward Engineering to Microsoft Fabric
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Deploy your data models to Fabric Lakehouse, Warehouse, or Datamart
          </p>
        </div>

        {/* Tabs Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={index > 0 && !canProceed}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all relative ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                } ${index > 0 && !canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 min-h-[600px]">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>

        {/* Navigation Footer */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => {
              const currentIndex = tabs.findIndex(t => t.id === activeTab);
              if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
            }}
            disabled={activeTab === 'source'}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {activeTab !== 'validate' && (
            <button
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.id === activeTab);
                if (currentIndex < tabs.length - 1 && canGoToNextTab()) {
                  setActiveTab(tabs[currentIndex + 1].id);
                }
              }}
              disabled={!canGoToNextTab()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
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
