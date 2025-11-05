'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Table as Table2,
  Key,
  GitBranch,
  FileText,
  Settings,
  Eye,
  Search,
  ChevronDown,
  ChevronRight,
  Save,
  Undo2,
  Redo2,
  Lock,
  Unlock,
  Edit3,
  X,
  Plus,
  Trash2,
  Copy,
  Tag,
  BookOpen,
  Grid,
  Link2,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  MoreVertical
} from 'lucide-react';

// Types
type ObjectType = 'model' | 'table' | 'column' | 'relationship';

interface PropertyEditorProps {
  isDark: boolean;
  onClose?: () => void;
}

interface TreeNode {
  id: string;
  label: string;
  type: ObjectType;
  icon: any;
  children?: TreeNode[];
}

export default function PropertyEditor({ isDark, onClose }: PropertyEditorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['model', 'tables', 'relationships']));
  const [selectedItem, setSelectedItem] = useState<{ type: ObjectType; id: string; name: string }>({
    type: 'table',
    id: 'table-customer',
    name: 'Customer'
  });
  const [activeTab, setActiveTab] = useState('general');
  const [isLocked, setIsLocked] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Tree data structure
  const treeData: TreeNode[] = [
    {
      id: 'model',
      label: 'E-Commerce Model',
      type: 'model',
      icon: Database,
      children: [
        { id: 'model-general', label: 'General', type: 'model', icon: FileText },
        { id: 'model-settings', label: 'Database Settings', type: 'model', icon: Settings }
      ]
    },
    {
      id: 'tables',
      label: 'Tables',
      type: 'table',
      icon: Table2,
      children: [
        { id: 'table-customer', label: 'Customer', type: 'table', icon: Table2 },
        { id: 'table-orders', label: 'Orders', type: 'table', icon: Table2 },
        { id: 'table-products', label: 'Products', type: 'table', icon: Table2 }
      ]
    },
    {
      id: 'relationships',
      label: 'Relationships',
      type: 'relationship',
      icon: GitBranch,
      children: [
        { id: 'rel-1', label: 'Customer → Orders', type: 'relationship', icon: Link2 },
        { id: 'rel-2', label: 'Orders → Products', type: 'relationship', icon: Link2 }
      ]
    }
  ];

  const TreeItem = ({ item, level = 0 }: { item: TreeNode; level?: number }) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selectedItem.id === item.id;

    return (
      <div>
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
            isSelected
              ? isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
              : isDark ? 'hover:bg-zinc-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
          }`}
          style={{ paddingLeft: `${(level * 12) + 8}px` }}
          onClick={() => {
            if (hasChildren) {
              setExpandedItems(prev => {
                const next = new Set(prev);
                if (next.has(item.id)) {
                  next.delete(item.id);
                } else {
                  next.add(item.id);
                }
                return next;
              });
            }
            if (item.type) {
              setSelectedItem({ type: item.type, id: item.id, name: item.label });
              setActiveTab('general');
            }
          }}
        >
          {hasChildren && (
            isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
          )}
          {!hasChildren && <div className="w-3" />}
          <item.icon className="w-3.5 h-3.5" />
          <span className="text-xs">{item.label}</span>
        </div>
        {hasChildren && isExpanded && item.children && (
          <div>
            {item.children.map((child) => (
              <TreeItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Get tabs based on object type
  const getTabs = () => {
    switch (selectedItem.type) {
      case 'model':
        return [
          { id: 'general', label: 'General', icon: FileText },
          { id: 'settings', label: 'Database Settings', icon: Settings },
          { id: 'standards', label: 'Naming Standards', icon: BookOpen },
          { id: 'statistics', label: 'Statistics', icon: Grid }
        ];
      case 'table':
        return [
          { id: 'general', label: 'General', icon: FileText },
          { id: 'columns', label: 'Columns', icon: Table2 },
          { id: 'indexes', label: 'Indexes', icon: Grid },
          { id: 'constraints', label: 'Constraints', icon: Lock },
          { id: 'metadata', label: 'Business Metadata', icon: Tag }
        ];
      case 'column':
        return [
          { id: 'general', label: 'General', icon: FileText },
          { id: 'constraints', label: 'Constraints', icon: Lock },
          { id: 'metadata', label: 'Business Metadata', icon: Tag }
        ];
      case 'relationship':
        return [
          { id: 'general', label: 'General', icon: FileText },
          { id: 'cardinality', label: 'Cardinality', icon: GitBranch },
          { id: 'constraints', label: 'Constraints', icon: Lock }
        ];
      default:
        return [];
    }
  };

  const tabs = getTabs();

  const renderContent = () => {
    // Table General Tab
    if (selectedItem.type === 'table' && activeTab === 'general') {
      return (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Table Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Table Name *
                </label>
                <input
                  type="text"
                  defaultValue="Customer"
                  onChange={() => setHasUnsavedChanges(true)}
                  disabled={isLocked}
                  className={`w-full px-3 py-2 text-sm rounded-md border ${
                    isDark
                      ? 'bg-zinc-800 border-zinc-600 text-gray-100 focus:border-purple-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                  } focus:outline-none focus:ring-1 focus:ring-purple-500/20 disabled:opacity-50`}
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Schema
                </label>
                <select
                  defaultValue="dbo"
                  onChange={() => setHasUnsavedChanges(true)}
                  disabled={isLocked}
                  className={`w-full px-3 py-2 text-sm rounded-md border ${
                    isDark
                      ? 'bg-zinc-800 border-zinc-600 text-gray-100'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-1 focus:ring-purple-500/20 disabled:opacity-50`}
                >
                  <option value="dbo">dbo</option>
                  <option value="sales">sales</option>
                  <option value="marketing">marketing</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Description
                </label>
                <textarea
                  rows={3}
                  defaultValue="Stores customer account details including contact information and preferences"
                  onChange={() => setHasUnsavedChanges(true)}
                  disabled={isLocked}
                  className={`w-full px-3 py-2 text-sm rounded-md border ${
                    isDark
                      ? 'bg-zinc-800 border-zinc-600 text-gray-100'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-1 focus:ring-purple-500/20 disabled:opacity-50`}
                  placeholder="Enter table description..."
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Owner
                </label>
                <select
                  defaultValue="DataTeam"
                  onChange={() => setHasUnsavedChanges(true)}
                  disabled={isLocked}
                  className={`w-full px-3 py-2 text-sm rounded-md border ${
                    isDark
                      ? 'bg-zinc-800 border-zinc-600 text-gray-100'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-1 focus:ring-purple-500/20 disabled:opacity-50`}
                >
                  <option value="DataTeam">Data Team</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Analytics">Analytics</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Created Date
                </label>
                <div className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md border ${
                  isDark ? 'bg-zinc-800/50 border-zinc-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>2024-01-15</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Table Columns Tab
    if (selectedItem.type === 'table' && activeTab === 'columns') {
      const columns = [
        { id: 1, name: 'customer_id', type: 'INT', length: '', nullable: false, pk: true, default: '' },
        { id: 2, name: 'email', type: 'VARCHAR', length: '255', nullable: false, pk: false, default: '' },
        { id: 3, name: 'first_name', type: 'VARCHAR', length: '100', nullable: false, pk: false, default: '' },
        { id: 4, name: 'last_name', type: 'VARCHAR', length: '100', nullable: false, pk: false, default: '' },
        { id: 5, name: 'created_at', type: 'TIMESTAMP', length: '', nullable: true, pk: false, default: 'CURRENT_TIMESTAMP' }
      ];

      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Columns ({columns.length})
            </h3>
            <button
              disabled={isLocked}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors ${
                isDark
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              } disabled:opacity-50`}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Column
            </button>
          </div>

          <div className={`rounded-lg border overflow-hidden ${isDark ? 'border-zinc-700' : 'border-gray-200'}`}>
            <div className={`overflow-x-auto ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
              <table className="w-full text-xs">
                <thead className={`sticky top-0 ${isDark ? 'bg-zinc-800 border-b border-zinc-700' : 'bg-gray-50 border-b border-gray-200'}`}>
                  <tr>
                    <th className={`px-3 py-2 text-left font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Column Name</th>
                    <th className={`px-3 py-2 text-left font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Data Type</th>
                    <th className={`px-3 py-2 text-left font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Length</th>
                    <th className={`px-3 py-2 text-center font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Nullable</th>
                    <th className={`px-3 py-2 text-center font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>PK</th>
                    <th className={`px-3 py-2 text-left font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Default Value</th>
                    <th className={`px-3 py-2 text-center font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {columns.map((col, idx) => (
                    <tr
                      key={col.id}
                      className={`border-b ${
                        isDark
                          ? 'border-zinc-800 hover:bg-zinc-800/50'
                          : 'border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          defaultValue={col.name}
                          disabled={isLocked}
                          className={`w-full px-2 py-1 text-xs rounded border ${
                            isDark
                              ? 'bg-zinc-800 border-zinc-600 text-gray-100'
                              : 'bg-white border-gray-300 text-gray-900'
                          } disabled:opacity-50`}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          defaultValue={col.type}
                          disabled={isLocked}
                          className={`w-full px-2 py-1 text-xs rounded border ${
                            isDark
                              ? 'bg-zinc-800 border-zinc-600 text-gray-100'
                              : 'bg-white border-gray-300 text-gray-900'
                          } disabled:opacity-50`}
                        >
                          <option value="INT">INT</option>
                          <option value="VARCHAR">VARCHAR</option>
                          <option value="TIMESTAMP">TIMESTAMP</option>
                          <option value="DECIMAL">DECIMAL</option>
                          <option value="BOOLEAN">BOOLEAN</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          defaultValue={col.length}
                          disabled={isLocked}
                          className={`w-20 px-2 py-1 text-xs rounded border ${
                            isDark
                              ? 'bg-zinc-800 border-zinc-600 text-gray-100'
                              : 'bg-white border-gray-300 text-gray-900'
                          } disabled:opacity-50`}
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          defaultChecked={col.nullable}
                          disabled={isLocked}
                          className="rounded disabled:opacity-50"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          defaultChecked={col.pk}
                          disabled={isLocked}
                          className="rounded disabled:opacity-50"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          defaultValue={col.default}
                          disabled={isLocked}
                          className={`w-full px-2 py-1 text-xs rounded border ${
                            isDark
                              ? 'bg-zinc-800 border-zinc-600 text-gray-100'
                              : 'bg-white border-gray-300 text-gray-900'
                          } disabled:opacity-50`}
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          disabled={isLocked}
                          className={`p-1 rounded hover:bg-red-500/20 text-red-500 disabled:opacity-50`}
                          title="Delete column"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // Default empty state
    return (
      <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Select a tab to view properties</p>
      </div>
    );
  };

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-zinc-950' : 'bg-gray-50'}`}>
      {/* Top App Bar */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-4">
          <h1 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            Property Editor
          </h1>

          {/* Breadcrumbs */}
          <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <span>E-Commerce Model</span>
            <ChevronRight className="w-3 h-3" />
            <span>Tables</span>
            <ChevronRight className="w-3 h-3" />
            <span className={isDark ? 'text-purple-400' : 'text-purple-600'}>{selectedItem.name}</span>
          </div>

          {/* Version Info */}
          <div className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
            isDark ? 'bg-zinc-800 text-gray-400' : 'bg-gray-100 text-gray-600'
          }`}>
            <CheckCircle className="w-3 h-3" />
            <span>Version 1.3</span>
            {hasUnsavedChanges && (
              <>
                <span>•</span>
                <span className={isDark ? 'text-amber-400' : 'text-amber-600'}>Unsaved changes</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search properties..."
              className={`pl-8 pr-3 py-1.5 text-xs rounded-md border w-64 ${
                isDark
                  ? 'bg-zinc-800 border-zinc-700 text-gray-100 placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-1 focus:ring-purple-500/20`}
            />
          </div>

          <div className={`w-px h-6 ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />

          {/* Lock/Unlock */}
          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`p-2 rounded-md transition-colors ${
              isLocked
                ? isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                : isDark ? 'hover:bg-zinc-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
            title={isLocked ? 'Unlock' : 'Lock'}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>

          {/* Undo */}
          <button
            disabled
            className={`p-2 rounded-md transition-colors disabled:opacity-50 ${
              isDark ? 'hover:bg-zinc-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Redo */}
          <button
            disabled
            className={`p-2 rounded-md transition-colors disabled:opacity-50 ${
              isDark ? 'hover:bg-zinc-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className={`w-px h-6 ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />

          {/* Save */}
          <button
            disabled={!hasUnsavedChanges || isLocked}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              hasUnsavedChanges && !isLocked
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : isDark ? 'bg-zinc-800 text-gray-500' : 'bg-gray-100 text-gray-400'
            } disabled:opacity-50`}
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
            Save
          </button>

          {/* Close */}
          {onClose && (
            <button
              onClick={onClose}
              className={`p-2 rounded-md transition-colors ${
                isDark ? 'hover:bg-zinc-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Model Tree */}
        <div className={`w-64 border-r overflow-y-auto ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
        }`}>
          <div className="p-3">
            <h3 className={`text-xs font-semibold mb-3 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Model Navigation
            </h3>

            <div className="mb-3">
              <div className="relative">
                <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border ${
                    isDark
                      ? 'bg-zinc-800 border-zinc-700 text-gray-100 placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-1 focus:ring-purple-500/20`}
                />
              </div>
            </div>

            <div className="space-y-0.5">
              {treeData.map((item) => (
                <TreeItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Property Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with Object Info */}
          <div className={`px-6 py-4 border-b ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                  <Table2 className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div>
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {selectedItem.name}
                  </h2>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)} Properties
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className={`p-2 rounded-md transition-colors ${
                    isDark ? 'hover:bg-zinc-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title="Edit Name"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  className={`p-2 rounded-md transition-colors ${
                    isDark ? 'hover:bg-zinc-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title="More options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4 border-b" style={{ borderColor: isDark ? '#27272a' : '#e5e7eb' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? isDark
                        ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-400'
                        : 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
                      : isDark
                      ? 'text-gray-400 hover:text-gray-100 hover:bg-zinc-800/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className={`flex-1 overflow-y-auto p-6 ${isDark ? 'bg-zinc-950' : 'bg-gray-50'}`}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
