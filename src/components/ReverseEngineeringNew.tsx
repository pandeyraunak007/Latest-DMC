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
  Sparkles
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

const wizardSteps: Step[] = [
  { id: 1, title: 'Select Source', description: 'Choose your data source' },
  { id: 2, title: 'Select Objects', description: 'Pick tables and views' },
  { id: 3, title: 'Configure & Execute', description: 'Reverse engineer' }
];

export default function ReverseEngineeringNew() {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Source Selection
  const [sourceType, setSourceType] = useState<SourceType>('database');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [scriptFile, setScriptFile] = useState<string>('');
  const [connectionConfig, setConnectionConfig] = useState({
    server: '',
    database: '',
    username: '',
    password: ''
  });
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [ssoInProgress, setSsoInProgress] = useState(false);

  // Step 2: Object Selection
  const [selectedObjects, setSelectedObjects] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

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
    (sourceType === 'database' && selectedSource && connectionStatus === 'success') ||
    (sourceType === 'script' && scriptFile);

  const canProceedToStep3 = selectedObjects.size > 0;

  const filteredObjects = mockDatabaseObjects.filter(obj =>
    obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obj.schema.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Source Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-zinc-100 mb-4">
                Choose Source Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <ConnectionCard
                  id="database"
                  icon={<Database className="w-6 h-6" />}
                  title="Database"
                  description="Connect to live database"
                  selected={sourceType === 'database'}
                  onClick={() => setSourceType('database')}
                />
                <ConnectionCard
                  id="script"
                  icon={<FileText className="w-6 h-6" />}
                  title="Script File"
                  description="Import from DDL script"
                  selected={sourceType === 'script'}
                  onClick={() => setSourceType('script')}
                />
              </div>
            </div>

            {/* Database Source Selection */}
            {sourceType === 'database' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <label className="block text-sm font-medium text-gray-900 dark:text-zinc-100">
                  Select Database Source
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mockDatabaseSources.map((source) => (
                    <ConnectionCard
                      key={source.id}
                      id={source.id}
                      icon={source.icon}
                      title={source.name}
                      description={source.description}
                      selected={selectedSource === source.id}
                      disabled={source.status === 'coming-soon'}
                      badge={source.status === 'coming-soon' ? 'Soon' : undefined}
                      onClick={() => setSelectedSource(source.id)}
                    />
                  ))}
                </div>

                {/* Connection Configuration */}
                {selectedSource && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-6 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                        Connection Configuration
                      </h3>
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        {mockDatabaseSources.find(s => s.id === selectedSource)?.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-2">
                          Server/Host *
                        </label>
                        <input
                          type="text"
                          className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-zinc-100 focus:border-violet-500 focus:outline-none"
                          placeholder="localhost:1433"
                          value={connectionConfig.server}
                          onChange={(e) => setConnectionConfig({ ...connectionConfig, server: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-2">
                          Database Name *
                        </label>
                        <input
                          type="text"
                          className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-zinc-100 focus:border-violet-500 focus:outline-none"
                          placeholder="my_database"
                          value={connectionConfig.database}
                          onChange={(e) => setConnectionConfig({ ...connectionConfig, database: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-zinc-100 focus:border-violet-500 focus:outline-none"
                          placeholder="your_username"
                          value={connectionConfig.username}
                          onChange={(e) => setConnectionConfig({ ...connectionConfig, username: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-zinc-100 focus:border-violet-500 focus:outline-none"
                          placeholder="••••••••"
                          value={connectionConfig.password}
                          onChange={(e) => setConnectionConfig({ ...connectionConfig, password: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* SSO Option */}
                    <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
                      <p className="text-xs text-gray-600 dark:text-zinc-400 mb-3">
                        Or use Single Sign-On (SSO)
                      </p>
                      <button
                        onClick={handleSSOLogin}
                        disabled={ssoInProgress}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 text-white rounded-lg text-sm transition-colors"
                      >
                        {ssoInProgress ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Authenticating...
                          </>
                        ) : (
                          <>
                            <Key className="w-4 h-4" />
                            Sign in with SSO
                          </>
                        )}
                      </button>
                    </div>

                    {/* Test Connection Button */}
                    <div className="flex items-center justify-between pt-4">
                      <button
                        onClick={handleTestConnection}
                        disabled={connectionStatus === 'testing' || !connectionConfig.server || !connectionConfig.database}
                        className="flex items-center gap-2 px-6 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        {connectionStatus === 'testing' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Testing Connection...
                          </>
                        ) : (
                          <>
                            <Database className="w-4 h-4" />
                            Test Connection
                          </>
                        )}
                      </button>

                      {connectionStatus === 'success' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-2 text-emerald-500 text-sm font-medium"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          Connection verified
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Script File Selection */}
            {sourceType === 'script' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <label className="block text-sm font-medium text-gray-900 dark:text-zinc-100">
                  Upload DDL Script File
                </label>
                <div className="border-2 border-dashed border-zinc-700 dark:border-zinc-700 light:border-gray-300 rounded-xl p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
                  <p className="text-sm text-gray-700 dark:text-zinc-300 mb-2">
                    Drag and drop your SQL file here, or click to browse
                  </p>
                  <p className="text-xs text-zinc-500 mb-4">
                    Supported formats: .sql, .ddl (max 10MB)
                  </p>
                  <input
                    type="text"
                    className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-zinc-100 mb-3"
                    placeholder="Or paste file path..."
                    value={scriptFile}
                    onChange={(e) => setScriptFile(e.target.value)}
                  />
                  <button className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm">
                    Choose File
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-2">
                Select Database Objects
              </h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                Choose the tables, views, and other objects you want to reverse engineer
              </p>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search objects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-zinc-100 focus:border-violet-500 focus:outline-none"
                />
              </div>
              <button
                onClick={selectAllObjects}
                className="px-4 py-2 text-sm text-violet-400 hover:text-violet-300 border border-zinc-700 dark:border-zinc-700 light:border-gray-300 rounded-lg"
              >
                Select All
              </button>
              <button
                onClick={deselectAllObjects}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-300 border border-zinc-700 dark:border-zinc-700 light:border-gray-300 rounded-lg"
              >
                Clear
              </button>
            </div>

            {/* Objects List */}
            <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {filteredObjects.map((obj) => (
                  <motion.div
                    key={obj.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex items-center gap-4 p-4 hover:bg-zinc-700/50 dark:hover:bg-zinc-700/50 light:hover:bg-gray-100 border-b border-gray-200 dark:border-zinc-700 last:border-b-0 cursor-pointer transition-colors ${
                      selectedObjects.has(obj.id) ? 'bg-violet-600/10' : ''
                    }`}
                    onClick={() => toggleObjectSelection(obj.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedObjects.has(obj.id)}
                      onChange={() => toggleObjectSelection(obj.id)}
                      className="w-4 h-4 rounded border-zinc-600 text-violet-600 focus:ring-violet-500"
                    />
                    <Database className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-zinc-100">
                          {obj.name}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-zinc-700 dark:bg-zinc-700 light:bg-gray-200 text-gray-700 dark:text-zinc-300 rounded">
                          {obj.type}
                        </span>
                        {obj.hasForeignKeys && (
                          <span className="text-xs px-2 py-0.5 bg-purple-600 text-white rounded">FK</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-gray-500">
                        {obj.schema} • {obj.columnCount} columns • {obj.rowCount} rows • {obj.size}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Selection Summary */}
            <div className="flex items-center justify-between p-4 bg-violet-600/10 border border-violet-600 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-violet-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                  {selectedObjects.size} objects selected
                </span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {reverseEngineeringStatus === 'idle' && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-2">
                    Ready to Reverse Engineer
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">
                    Review your selections and start the reverse engineering process
                  </p>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
                      {selectedObjects.size}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                      Objects Selected
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
                      {mockDatabaseObjects.filter(o => selectedObjects.has(o.id) && o.hasForeignKeys).length}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                      Relationships
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
                      ~2m
                    </p>
                    <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                      Est. Time
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleStartReverseEngineering}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Reverse Engineering
                </button>
              </>
            )}

            {reverseEngineeringStatus === 'processing' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8"
              >
                <div className="text-center mb-8">
                  <Loader2 className="w-16 h-16 text-violet-500 animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-2">
                    Processing Your Database
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">
                    Please wait while we reverse engineer your database schema
                  </p>
                </div>

                <ProgressBar
                  progress={reverseEngineeringProgress}
                  message={reverseEngineeringMessage}
                  animated
                />
              </motion.div>
            )}

            {reverseEngineeringStatus === 'complete' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                >
                  <CheckCircle2 className="w-24 h-24 text-emerald-500 mx-auto mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-3">
                  Reverse Engineering Complete!
                </h3>
                <p className="text-gray-600 dark:text-zinc-400 mb-6">
                  Successfully created {entitiesCreated} entities with all relationships and constraints
                </p>

                <div className="flex items-center justify-center gap-4">
                  <button className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium">
                    View Model
                  </button>
                  <button className="px-6 py-3 border border-zinc-700 dark:border-zinc-700 light:border-gray-300 text-gray-700 dark:text-zinc-300 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-gray-50 rounded-lg font-medium">
                    Export
                  </button>
                </div>
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
          (currentStep === 3 && reverseEngineeringStatus !== 'complete')
        }
        hideNavigation={currentStep === 3 && reverseEngineeringStatus !== 'idle'}
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
