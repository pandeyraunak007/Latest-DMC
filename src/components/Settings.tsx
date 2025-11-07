'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  Settings as SettingsIcon,
  Database,
  Palette,
  Globe,
  Shield,
  Key,
  Bell,
  Mail,
  Save,
  RefreshCw,
  Monitor,
  Moon,
  Sun,
  Code,
  FileCode,
  GitBranch,
  Server,
  HardDrive,
  Zap,
  Users,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Download,
  Upload,
  FolderOpen,
  Archive,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Layers,
  Link,
  Hash,
  Type,
  Cpu,
  Cloud,
  Workflow,
  Terminal
} from 'lucide-react';

interface SettingsState {
  autoSave: boolean;
  autoSaveInterval: number;
  confirmOnDelete: boolean;
  showWelcomeScreen: boolean;
  defaultView: string;
  defaultDatabase: string;
  connectionTimeout: number;
  maxConnections: number;
  enableSSL: boolean;
  defaultNamingConvention: string;
  generatePrimaryKeys: boolean;
  defaultKeyType: string;
  enforceRelationships: boolean;
  theme: string;
  fontSize: string;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  generateComments: boolean;
  includeIndexes: boolean;
  generateConstraints: boolean;
  scriptFormat: string;
  importViews: boolean;
  importProcedures: boolean;
  importTriggers: boolean;
  preserveCase: boolean;
  ignoreComments: boolean;
  ignoreWhitespace: boolean;
  caseSensitive: boolean;
  compareIndexes: boolean;
  defaultExportFormat: string;
  includeData: boolean;
  compressExport: boolean;
  emailNotifications: boolean;
  desktopNotifications: boolean;
  notifyOnComplete: boolean;
  notifyOnError: boolean;
}

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState<SettingsState>({
    // General Settings
    autoSave: true,
    autoSaveInterval: 5,
    confirmOnDelete: true,
    showWelcomeScreen: false,
    defaultView: 'logical',

    // Database Settings
    defaultDatabase: 'sqlserver',
    connectionTimeout: 30,
    maxConnections: 10,
    enableSSL: true,

    // Model Settings
    defaultNamingConvention: 'pascalCase',
    generatePrimaryKeys: true,
    defaultKeyType: 'integer',
    enforceRelationships: true,

    // Display Settings
    theme: isDark ? 'dark' : 'light',
    fontSize: 'medium',
    showGrid: true,
    snapToGrid: true,
    gridSize: 20,

    // Forward Engineering Settings
    generateComments: true,
    includeIndexes: true,
    generateConstraints: true,
    scriptFormat: 'sql',

    // Reverse Engineering Settings
    importViews: true,
    importProcedures: true,
    importTriggers: true,
    preserveCase: false,

    // Compare Settings
    ignoreComments: false,
    ignoreWhitespace: true,
    caseSensitive: false,
    compareIndexes: true,

    // Export Settings
    defaultExportFormat: 'sql',
    includeData: false,
    compressExport: true,

    // Notification Settings
    emailNotifications: true,
    desktopNotifications: true,
    notifyOnComplete: true,
    notifyOnError: true
  });

  const sections = [
    { id: 'general', label: 'General', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'database', label: 'Database', icon: <Database className="w-4 h-4" /> },
    { id: 'model', label: 'Model Defaults', icon: <Layers className="w-4 h-4" /> },
    { id: 'display', label: 'Display', icon: <Palette className="w-4 h-4" /> },
    { id: 'forward', label: 'Forward Engineering', icon: <Upload className="w-4 h-4" /> },
    { id: 'reverse', label: 'Reverse Engineering', icon: <Download className="w-4 h-4" /> },
    { id: 'compare', label: 'Compare', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'export', label: 'Import/Export', icon: <Archive className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'advanced', label: 'Advanced', icon: <Cpu className="w-4 h-4" /> }
  ];

  const handleToggle = (key: keyof SettingsState) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const ToggleSwitch = ({ enabled, onChange, label }: { enabled: boolean; onChange: () => void; label: string }) => (
    <div className="flex items-center justify-between py-3">
      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-indigo-600' : isDark ? 'bg-zinc-700' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const SelectOption = ({ label, value, options, onChange }: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
  }) => (
    <div className="py-3">
      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-lg border text-sm ${
          isDark
            ? 'bg-zinc-800 border-zinc-700 text-gray-100'
            : 'bg-white border-gray-300 text-gray-900'
        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  const NumberInput = ({ label, value, onChange, min, max, unit }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    unit?: string;
  }) => (
    <div className="py-3">
      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          min={min}
          max={max}
          className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
            isDark
              ? 'bg-zinc-800 border-zinc-700 text-gray-100'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
        {unit && (
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{unit}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className={`h-full flex flex-col ${
      isDark ? 'bg-zinc-950 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className={`h-16 px-6 flex items-center justify-between border-b ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <SettingsIcon className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isDark
              ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}>
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Reset to Defaults
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Save className="w-4 h-4 inline mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`w-64 border-r overflow-y-auto ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
        }`}>
          <div className="p-4">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
                  activeSection === section.id
                    ? isDark
                      ? 'bg-zinc-800 text-indigo-400'
                      : 'bg-indigo-50 text-indigo-600'
                    : isDark
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-zinc-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {section.icon}
                <span>{section.label}</span>
                <ChevronRight className={`w-4 h-4 ml-auto ${
                  activeSection === section.id ? 'opacity-100' : 'opacity-0'
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-4xl">
            {/* General Settings */}
            {activeSection === 'general' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">General Settings</h2>

                <div className={`rounded-lg border p-4 mb-6 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm font-medium mb-4">Application Behavior</h3>
                  <ToggleSwitch
                    enabled={settings.autoSave}
                    onChange={() => handleToggle('autoSave')}
                    label="Enable Auto-Save"
                  />
                  {settings.autoSave && (
                    <NumberInput
                      label="Auto-Save Interval"
                      value={settings.autoSaveInterval}
                      onChange={(value) => handleChange('autoSaveInterval', value)}
                      min={1}
                      max={60}
                      unit="minutes"
                    />
                  )}
                  <ToggleSwitch
                    enabled={settings.confirmOnDelete}
                    onChange={() => handleToggle('confirmOnDelete')}
                    label="Confirm Before Delete"
                  />
                  <ToggleSwitch
                    enabled={settings.showWelcomeScreen}
                    onChange={() => handleToggle('showWelcomeScreen')}
                    label="Show Welcome Screen on Startup"
                  />
                  <SelectOption
                    label="Default View"
                    value={settings.defaultView}
                    options={[
                      { value: 'logical', label: 'Logical View' },
                      { value: 'physical', label: 'Physical View' }
                    ]}
                    onChange={(value) => handleChange('defaultView', value)}
                  />
                </div>
              </div>
            )}

            {/* Database Settings */}
            {activeSection === 'database' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Database Settings</h2>

                <div className={`rounded-lg border p-4 mb-6 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm font-medium mb-4">Default Database Configuration</h3>
                  <SelectOption
                    label="Default Database Type"
                    value={settings.defaultDatabase}
                    options={[
                      { value: 'sqlserver', label: 'SQL Server' },
                      { value: 'oracle', label: 'Oracle' },
                      { value: 'mysql', label: 'MySQL' },
                      { value: 'postgresql', label: 'PostgreSQL' },
                      { value: 'db2', label: 'DB2' },
                      { value: 'sqlite', label: 'SQLite' }
                    ]}
                    onChange={(value) => handleChange('defaultDatabase', value)}
                  />
                  <NumberInput
                    label="Connection Timeout"
                    value={settings.connectionTimeout}
                    onChange={(value) => handleChange('connectionTimeout', value)}
                    min={10}
                    max={300}
                    unit="seconds"
                  />
                  <NumberInput
                    label="Maximum Connections"
                    value={settings.maxConnections}
                    onChange={(value) => handleChange('maxConnections', value)}
                    min={1}
                    max={100}
                  />
                  <ToggleSwitch
                    enabled={settings.enableSSL}
                    onChange={() => handleToggle('enableSSL')}
                    label="Enable SSL/TLS Connection"
                  />
                </div>

                <div className={`rounded-lg border p-4 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm font-medium mb-4">Saved Connections</h3>
                  <div className="space-y-2">
                    <div className={`flex items-center justify-between p-3 rounded-lg ${
                      isDark ? 'bg-zinc-800' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Server className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Production Server</p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            sqlserver://prod.example.com:1433
                          </p>
                        </div>
                      </div>
                      <button className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Model Settings */}
            {activeSection === 'model' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Model Default Settings</h2>

                <div className={`rounded-lg border p-4 mb-6 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm font-medium mb-4">Naming Conventions</h3>
                  <SelectOption
                    label="Default Naming Convention"
                    value={settings.defaultNamingConvention}
                    options={[
                      { value: 'pascalCase', label: 'PascalCase' },
                      { value: 'camelCase', label: 'camelCase' },
                      { value: 'snake_case', label: 'snake_case' },
                      { value: 'UPPER_CASE', label: 'UPPER_CASE' }
                    ]}
                    onChange={(value) => handleChange('defaultNamingConvention', value)}
                  />
                </div>

                <div className={`rounded-lg border p-4 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm font-medium mb-4">Key Generation</h3>
                  <ToggleSwitch
                    enabled={settings.generatePrimaryKeys}
                    onChange={() => handleToggle('generatePrimaryKeys')}
                    label="Auto-Generate Primary Keys"
                  />
                  <SelectOption
                    label="Default Key Type"
                    value={settings.defaultKeyType}
                    options={[
                      { value: 'integer', label: 'Integer' },
                      { value: 'uuid', label: 'UUID' },
                      { value: 'guid', label: 'GUID' },
                      { value: 'bigint', label: 'Big Integer' }
                    ]}
                    onChange={(value) => handleChange('defaultKeyType', value)}
                  />
                  <ToggleSwitch
                    enabled={settings.enforceRelationships}
                    onChange={() => handleToggle('enforceRelationships')}
                    label="Enforce Referential Integrity"
                  />
                </div>
              </div>
            )}

            {/* Display Settings */}
            {activeSection === 'display' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Display Settings</h2>

                <div className={`rounded-lg border p-4 mb-6 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm font-medium mb-4">Appearance</h3>
                  <div className="py-3">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Theme
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => !isDark && toggleTheme()}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                          !isDark
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                            : 'bg-zinc-800 border-zinc-700 text-gray-400'
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        Light
                      </button>
                      <button
                        onClick={() => isDark && toggleTheme()}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                          isDark
                            ? 'bg-indigo-950 border-indigo-800 text-indigo-400'
                            : 'bg-gray-100 border-gray-300 text-gray-600'
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        Dark
                      </button>
                    </div>
                  </div>
                  <SelectOption
                    label="Font Size"
                    value={settings.fontSize}
                    options={[
                      { value: 'small', label: 'Small' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'large', label: 'Large' }
                    ]}
                    onChange={(value) => handleChange('fontSize', value)}
                  />
                </div>

                <div className={`rounded-lg border p-4 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm font-medium mb-4">Canvas Settings</h3>
                  <ToggleSwitch
                    enabled={settings.showGrid}
                    onChange={() => handleToggle('showGrid')}
                    label="Show Grid"
                  />
                  <ToggleSwitch
                    enabled={settings.snapToGrid}
                    onChange={() => handleToggle('snapToGrid')}
                    label="Snap to Grid"
                  />
                  <NumberInput
                    label="Grid Size"
                    value={settings.gridSize}
                    onChange={(value) => handleChange('gridSize', value)}
                    min={10}
                    max={100}
                    unit="pixels"
                  />
                </div>
              </div>
            )}

            {/* Forward Engineering Settings */}
            {activeSection === 'forward' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Forward Engineering Settings</h2>

                <div className={`rounded-lg border p-4 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm font-medium mb-4">Script Generation Options</h3>
                  <ToggleSwitch
                    enabled={settings.generateComments}
                    onChange={() => handleToggle('generateComments')}
                    label="Generate Comments in DDL"
                  />
                  <ToggleSwitch
                    enabled={settings.includeIndexes}
                    onChange={() => handleToggle('includeIndexes')}
                    label="Include Indexes"
                  />
                  <ToggleSwitch
                    enabled={settings.generateConstraints}
                    onChange={() => handleToggle('generateConstraints')}
                    label="Generate Constraints"
                  />
                  <SelectOption
                    label="Script Format"
                    value={settings.scriptFormat}
                    options={[
                      { value: 'sql', label: 'SQL Script' },
                      { value: 'ddl', label: 'DDL Only' },
                      { value: 'migration', label: 'Migration Script' }
                    ]}
                    onChange={(value) => handleChange('scriptFormat', value)}
                  />
                </div>
              </div>
            )}

            {/* Reverse Engineering Settings */}
            {activeSection === 'reverse' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Reverse Engineering Settings</h2>

                <div className={`rounded-lg border p-4 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm font-medium mb-4">Import Options</h3>
                  <ToggleSwitch
                    enabled={settings.importViews}
                    onChange={() => handleToggle('importViews')}
                    label="Import Views"
                  />
                  <ToggleSwitch
                    enabled={settings.importProcedures}
                    onChange={() => handleToggle('importProcedures')}
                    label="Import Stored Procedures"
                  />
                  <ToggleSwitch
                    enabled={settings.importTriggers}
                    onChange={() => handleToggle('importTriggers')}
                    label="Import Triggers"
                  />
                  <ToggleSwitch
                    enabled={settings.preserveCase}
                    onChange={() => handleToggle('preserveCase')}
                    label="Preserve Original Case"
                  />
                </div>
              </div>
            )}

            {/* Compare Settings */}
            {activeSection === 'compare' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Compare Settings</h2>

                <div className={`rounded-lg border p-4 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm font-medium mb-4">Comparison Options</h3>
                  <ToggleSwitch
                    enabled={settings.ignoreComments}
                    onChange={() => handleToggle('ignoreComments')}
                    label="Ignore Comments"
                  />
                  <ToggleSwitch
                    enabled={settings.ignoreWhitespace}
                    onChange={() => handleToggle('ignoreWhitespace')}
                    label="Ignore Whitespace"
                  />
                  <ToggleSwitch
                    enabled={settings.caseSensitive}
                    onChange={() => handleToggle('caseSensitive')}
                    label="Case Sensitive Comparison"
                  />
                  <ToggleSwitch
                    enabled={settings.compareIndexes}
                    onChange={() => handleToggle('compareIndexes')}
                    label="Compare Indexes"
                  />
                </div>
              </div>
            )}

            {/* Export Settings */}
            {activeSection === 'export' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Import/Export Settings</h2>

                <div className={`rounded-lg border p-4 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm font-medium mb-4">Export Options</h3>
                  <SelectOption
                    label="Default Export Format"
                    value={settings.defaultExportFormat}
                    options={[
                      { value: 'sql', label: 'SQL' },
                      { value: 'xml', label: 'XML' },
                      { value: 'json', label: 'JSON' },
                      { value: 'csv', label: 'CSV' },
                      { value: 'excel', label: 'Excel' }
                    ]}
                    onChange={(value) => handleChange('defaultExportFormat', value)}
                  />
                  <ToggleSwitch
                    enabled={settings.includeData}
                    onChange={() => handleToggle('includeData')}
                    label="Include Sample Data"
                  />
                  <ToggleSwitch
                    enabled={settings.compressExport}
                    onChange={() => handleToggle('compressExport')}
                    label="Compress Export Files"
                  />
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Security Settings</h2>

                <div className={`rounded-lg border p-4 mb-6 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm font-medium mb-4">Authentication</h3>
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Two-Factor Authentication</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          isDark ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-700'
                        }`}>
                          Enabled
                        </span>
                      </div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Secure your account with 2FA
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg border p-4 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm font-medium mb-4">Session Management</h3>
                  <NumberInput
                    label="Session Timeout"
                    value={30}
                    onChange={() => {}}
                    min={5}
                    max={120}
                    unit="minutes"
                  />
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Notification Settings</h2>

                <div className={`rounded-lg border p-4 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm font-medium mb-4">Notification Preferences</h3>
                  <ToggleSwitch
                    enabled={settings.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                    label="Email Notifications"
                  />
                  <ToggleSwitch
                    enabled={settings.desktopNotifications}
                    onChange={() => handleToggle('desktopNotifications')}
                    label="Desktop Notifications"
                  />
                  <ToggleSwitch
                    enabled={settings.notifyOnComplete}
                    onChange={() => handleToggle('notifyOnComplete')}
                    label="Notify on Task Completion"
                  />
                  <ToggleSwitch
                    enabled={settings.notifyOnError}
                    onChange={() => handleToggle('notifyOnError')}
                    label="Notify on Errors"
                  />
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            {activeSection === 'advanced' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Advanced Settings</h2>

                <div className={`rounded-lg border p-4 mb-6 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm font-medium mb-4">Performance</h3>
                  <NumberInput
                    label="Maximum Memory Usage"
                    value={2048}
                    onChange={() => {}}
                    min={512}
                    max={8192}
                    unit="MB"
                  />
                  <NumberInput
                    label="Cache Size"
                    value={100}
                    onChange={() => {}}
                    min={10}
                    max={500}
                    unit="MB"
                  />
                </div>

                <div className={`rounded-lg border p-4 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm font-medium mb-4">Developer Options</h3>
                  <ToggleSwitch
                    enabled={false}
                    onChange={() => {}}
                    label="Enable Debug Mode"
                  />
                  <ToggleSwitch
                    enabled={false}
                    onChange={() => {}}
                    label="Show Console Logs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;