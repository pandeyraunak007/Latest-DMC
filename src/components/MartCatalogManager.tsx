'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  FolderTree,
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Move,
  Eye,
  EyeOff,
  Tag,
  GitBranch,
  Clock,
  Check,
  X,
  Save,
  MoreVertical,
  GripVertical,
  RefreshCw,
  Archive,
  Star,
  StarOff,
  FileCode,
  Moon,
  Sun
} from 'lucide-react';

// Types
type NodeType = 'mart' | 'library' | 'model' | 'version' | 'template';
type VersionType = 'named' | 'delta';

interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  description?: string;
  children?: TreeNode[];
  versionType?: VersionType;
  isHidden?: boolean;
  isNamed?: boolean;
  createdDate?: string;
  modifiedDate?: string;
  author?: string;
  parentId?: string;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  node: TreeNode | null;
}

// Mock Data
const initialCatalogData: TreeNode = {
  id: 'mart-root',
  name: 'Mart',
  type: 'mart',
  description: 'Root catalog repository',
  children: [
    {
      id: 'lib-1',
      name: 'Customer Domain',
      type: 'library',
      description: 'Customer data models and schemas',
      children: [
        {
          id: 'model-1',
          name: 'Customer360',
          type: 'model',
          description: 'Comprehensive customer data model',
          children: [
            {
              id: 'ver-1-1',
              name: 'v2.0.0 - Production',
              type: 'version',
              versionType: 'named',
              isNamed: true,
              description: 'Current production version',
              createdDate: '2024-01-15',
              author: 'John Doe'
            },
            {
              id: 'ver-1-2',
              name: 'v1.5.0 - Stable',
              type: 'version',
              versionType: 'named',
              isNamed: true,
              description: 'Previous stable version',
              createdDate: '2023-12-10',
              author: 'John Doe'
            },
            {
              id: 'ver-1-3',
              name: 'Delta_2024-01-20_15:30',
              type: 'version',
              versionType: 'delta',
              description: 'Latest incremental changes',
              createdDate: '2024-01-20',
              author: 'Mike Chen'
            },
            {
              id: 'ver-1-4',
              name: 'Delta_2024-01-18_10:15',
              type: 'version',
              versionType: 'delta',
              description: 'Schema updates',
              createdDate: '2024-01-18',
              author: 'Sarah Johnson'
            }
          ]
        },
        {
          id: 'lib-1-1',
          name: 'Customer Analytics',
          type: 'library',
          description: 'Analytics models for customer data',
          children: [
            {
              id: 'model-2',
              name: 'Segmentation Model',
              type: 'model',
              description: 'Customer segmentation analysis',
              children: [
                {
                  id: 'ver-2-1',
                  name: 'v1.0.0 - Initial',
                  type: 'version',
                  versionType: 'named',
                  isNamed: true,
                  createdDate: '2024-01-05',
                  author: 'Emma Davis'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'lib-2',
      name: 'Financial Domain',
      type: 'library',
      description: 'Financial data models',
      children: [
        {
          id: 'model-3',
          name: 'General Ledger',
          type: 'model',
          description: 'Core GL model',
          children: [
            {
              id: 'ver-3-1',
              name: 'v3.0.0 - Current',
              type: 'version',
              versionType: 'named',
              isNamed: true,
              createdDate: '2024-01-22',
              author: 'Alice Williams'
            },
            {
              id: 'ver-3-2',
              name: 'Delta_2024-01-21_14:00',
              type: 'version',
              versionType: 'delta',
              isHidden: true,
              description: 'Hidden test version',
              createdDate: '2024-01-21',
              author: 'Alice Williams'
            }
          ]
        }
      ]
    },
    {
      id: 'templates-root',
      name: 'Templates',
      type: 'library',
      description: 'Model templates',
      children: [
        {
          id: 'template-1',
          name: 'Standard Entity Template',
          type: 'template',
          description: 'Base template for entity models'
        },
        {
          id: 'template-2',
          name: 'Dimensional Model Template',
          type: 'template',
          description: 'Star schema template'
        }
      ]
    }
  ]
};

export default function MartCatalogManager() {
  const [catalogData, setCatalogData] = useState<TreeNode>(initialCatalogData);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['mart-root', 'lib-1', 'model-1']));
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, node: null });
  const [draggedNode, setDraggedNode] = useState<TreeNode | null>(null);
  const [editingNode, setEditingNode] = useState<TreeNode | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [showHiddenVersions, setShowHiddenVersions] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Toggle node expansion
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // Sort children according to rules
  const sortChildren = (children: TreeNode[]): TreeNode[] => {
    return [...children].sort((a, b) => {
      // Libraries and models: alphabetical
      if ((a.type === 'library' || a.type === 'model') && (b.type === 'library' || b.type === 'model')) {
        return a.name.localeCompare(b.name);
      }

      // Versions: Named first, then Delta (newest first)
      if (a.type === 'version' && b.type === 'version') {
        if (a.versionType === 'named' && b.versionType === 'delta') return -1;
        if (a.versionType === 'delta' && b.versionType === 'named') return 1;

        if (a.versionType === 'delta' && b.versionType === 'delta') {
          return (b.createdDate || '').localeCompare(a.createdDate || '');
        }

        return a.name.localeCompare(b.name);
      }

      return 0;
    });
  };

  // Find node by ID
  const findNodeById = (node: TreeNode, id: string): TreeNode | null => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Update node in tree
  const updateNode = (tree: TreeNode, nodeId: string, updates: Partial<TreeNode>): TreeNode => {
    if (tree.id === nodeId) {
      return { ...tree, ...updates };
    }
    if (tree.children) {
      return {
        ...tree,
        children: tree.children.map(child => updateNode(child, nodeId, updates))
      };
    }
    return tree;
  };

  // Delete node from tree
  const deleteNode = (tree: TreeNode, nodeId: string): TreeNode => {
    if (tree.children) {
      return {
        ...tree,
        children: tree.children.filter(child => child.id !== nodeId).map(child => deleteNode(child, nodeId))
      };
    }
    return tree;
  };

  // Add child to node
  const addChildToNode = (tree: TreeNode, parentId: string, child: TreeNode): TreeNode => {
    if (tree.id === parentId) {
      return {
        ...tree,
        children: sortChildren([...(tree.children || []), child])
      };
    }
    if (tree.children) {
      return {
        ...tree,
        children: tree.children.map(node => addChildToNode(node, parentId, child))
      };
    }
    return tree;
  };

  // Context menu actions
  const handleCreateLibrary = () => {
    if (!contextMenu.node) return;
    const newLibrary: TreeNode = {
      id: `lib-${Date.now()}`,
      name: 'New Library',
      type: 'library',
      description: '',
      children: []
    };
    setCatalogData(prev => addChildToNode(prev, contextMenu.node!.id, newLibrary));
    setExpandedNodes(prev => new Set([...prev, contextMenu.node!.id]));
    setContextMenu({ visible: false, x: 0, y: 0, node: null });
  };

  const handleCreateNamedVersion = () => {
    if (!contextMenu.node) return;
    const newVersion: TreeNode = {
      id: `ver-${Date.now()}`,
      name: 'v1.0.0 - New Version',
      type: 'version',
      versionType: 'named',
      isNamed: true,
      description: '',
      createdDate: new Date().toISOString().split('T')[0],
      author: 'Current User'
    };
    setCatalogData(prev => addChildToNode(prev, contextMenu.node!.id, newVersion));
    setExpandedNodes(prev => new Set([...prev, contextMenu.node!.id]));
    setContextMenu({ visible: false, x: 0, y: 0, node: null });
  };

  const handleCreateDeltaVersion = () => {
    if (!contextMenu.node) return;
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newVersion: TreeNode = {
      id: `ver-${Date.now()}`,
      name: `Delta_${timestamp}`,
      type: 'version',
      versionType: 'delta',
      description: '',
      createdDate: new Date().toISOString().split('T')[0],
      author: 'Current User'
    };
    setCatalogData(prev => addChildToNode(prev, contextMenu.node!.id, newVersion));
    setExpandedNodes(prev => new Set([...prev, contextMenu.node!.id]));
    setContextMenu({ visible: false, x: 0, y: 0, node: null });
  };

  const handleMarkAsNamed = () => {
    if (!contextMenu.node || contextMenu.node.type !== 'version') return;
    setCatalogData(prev => updateNode(prev, contextMenu.node!.id, {
      versionType: 'named',
      isNamed: true
    }));
    setContextMenu({ visible: false, x: 0, y: 0, node: null });
  };

  const handleHideVersion = () => {
    if (!contextMenu.node || contextMenu.node.type !== 'version') return;
    setCatalogData(prev => updateNode(prev, contextMenu.node!.id, { isHidden: true }));
    setContextMenu({ visible: false, x: 0, y: 0, node: null });
  };

  const handleUnhideVersion = () => {
    if (!contextMenu.node || contextMenu.node.type !== 'version') return;
    setCatalogData(prev => updateNode(prev, contextMenu.node!.id, { isHidden: false }));
    setContextMenu({ visible: false, x: 0, y: 0, node: null });
  };

  const handleDelete = () => {
    if (!contextMenu.node) return;
    if (confirm(`Are you sure you want to delete "${contextMenu.node.name}"?`)) {
      setCatalogData(prev => deleteNode(prev, contextMenu.node!.id));
      if (selectedNode?.id === contextMenu.node.id) {
        setSelectedNode(null);
      }
    }
    setContextMenu({ visible: false, x: 0, y: 0, node: null });
  };

  // Edit handlers
  const handleEdit = (node: TreeNode) => {
    setEditingNode(node);
    setEditForm({ name: node.name, description: node.description || '' });
    setSelectedNode(node);
  };

  const handleSubmit = () => {
    if (!editingNode) return;
    setCatalogData(prev => updateNode(prev, editingNode.id, {
      name: editForm.name,
      description: editForm.description
    }));
    setEditingNode(null);
    setSelectedNode(prev => prev ? { ...prev, name: editForm.name, description: editForm.description } : null);
  };

  const handleCancel = () => {
    setEditingNode(null);
    if (selectedNode) {
      setEditForm({ name: selectedNode.name, description: selectedNode.description || '' });
    }
  };

  // Get icon for node type
  const getNodeIcon = (node: TreeNode, isExpanded: boolean) => {
    switch (node.type) {
      case 'mart':
        return <Database className="w-4 h-4 text-purple-400 drop-shadow-sm" />;
      case 'library':
        if (node.name === 'Templates') {
          return <Archive className="w-4 h-4 text-amber-400 drop-shadow-sm" />;
        }
        return isExpanded ? <FolderOpen className="w-4 h-4 text-sky-400 drop-shadow-sm" /> : <Folder className="w-4 h-4 text-sky-400 drop-shadow-sm" />;
      case 'model':
        return <FileText className="w-4 h-4 text-emerald-400 drop-shadow-sm" />;
      case 'version':
        return node.versionType === 'named' ? <Star className="w-4 h-4 text-amber-400 drop-shadow-sm" /> : <GitBranch className="w-4 h-4 text-slate-400 drop-shadow-sm" />;
      case 'template':
        return <FileCode className="w-4 h-4 text-violet-400 drop-shadow-sm" />;
    }
  };

  // Check if toolbar buttons should be disabled
  const isCreateLibraryDisabled = () => {
    return !selectedNode || (selectedNode.type !== 'mart' && selectedNode.type !== 'library');
  };

  const isMarkVersionDisabled = () => {
    return !selectedNode || selectedNode.type !== 'version' || selectedNode.versionType === 'named';
  };

  const isHideVersionDisabled = () => {
    return !selectedNode || selectedNode.type !== 'version' || selectedNode.isHidden;
  };

  const isUnhideVersionDisabled = () => {
    return !selectedNode || selectedNode.type !== 'version' || !selectedNode.isHidden;
  };

  const isDeleteDisabled = () => {
    return !selectedNode || selectedNode.type === 'mart';
  };

  // Render tree node
  const renderTreeNode = (node: TreeNode, depth: number = 0): JSX.Element | null => {
    // Hide hidden versions unless toggle is on
    if (node.isHidden && !showHiddenVersions) return null;

    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;
    const sortedChildren = node.children ? sortChildren(node.children) : [];

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-2 cursor-pointer group transition-all duration-150 relative ${
            isDark
              ? `hover:bg-zinc-800/60 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600/25 via-indigo-600/20 to-transparent text-indigo-100 border-l-2 border-indigo-500 shadow-lg shadow-indigo-500/10'
                    : 'text-zinc-200 hover:text-zinc-50'
                }`
              : `hover:bg-gray-100 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-100/80 via-indigo-50/60 to-transparent text-indigo-900 border-l-2 border-indigo-500 shadow-lg shadow-indigo-500/10'
                    : 'text-gray-700 hover:text-gray-900'
                }`
          } ${node.isHidden ? 'opacity-50' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 10}px` }}
          onClick={() => {
            setSelectedNode(node);
            setEditForm({ name: node.name, description: node.description || '' });
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            setContextMenu({ visible: true, x: e.clientX, y: e.clientY, node });
          }}
          draggable={node.type !== 'mart'}
          onDragStart={() => setDraggedNode(node)}
          onDragEnd={() => setDraggedNode(null)}
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(node.id);
                }}
                className={`p-0.5 rounded transition-all flex-shrink-0 ${isDark ? 'hover:bg-zinc-700/80' : 'hover:bg-gray-200'}`}
              >
                {isExpanded ? (
                  <ChevronDown className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-300' : 'text-gray-600'}`} />
                ) : (
                  <ChevronRight className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-300' : 'text-gray-600'}`} />
                )}
              </button>
            ) : (
              <div className="w-4 flex-shrink-0" />
            )}

            {getNodeIcon(node, isExpanded)}

            <span className="text-sm flex-1 truncate font-medium">{node.name}</span>

            {node.isHidden && <EyeOff className={`w-3 h-3 ${isDark ? 'text-zinc-400' : 'text-gray-500'} flex-shrink-0`} />}
            {node.versionType === 'named' && <Tag className="w-3 h-3 text-amber-400 flex-shrink-0" />}
          </div>

          <button
            className={`p-0.5 opacity-0 group-hover:opacity-100 rounded transition-all flex-shrink-0 ${isDark ? 'hover:bg-zinc-700/80' : 'hover:bg-gray-200'}`}
            onClick={(e) => {
              e.stopPropagation();
              setContextMenu({ visible: true, x: e.clientX, y: e.clientY, node });
            }}
          >
            <MoreVertical className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-300' : 'text-gray-600'}`} />
          </button>
        </div>

        {isExpanded && hasChildren && (
          <div>
            {sortedChildren.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`h-full flex ${isDark ? 'bg-gradient-to-br from-zinc-950 to-zinc-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`} onClick={() => setContextMenu({ visible: false, x: 0, y: 0, node: null })}>
      {/* Left Column - Tree View */}
      <div className={`w-96 border-r ${isDark ? 'border-zinc-800/60 bg-zinc-900/80' : 'border-gray-200 bg-white/80'} flex flex-col backdrop-blur-sm shadow-2xl`}>
        {/* Tree Header */}
        <div className={`p-4 border-b ${isDark ? 'border-zinc-800/60 bg-gradient-to-b from-zinc-800/40' : 'border-gray-200 bg-gradient-to-b from-gray-100/40'} to-transparent`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-semibold ${isDark ? 'text-zinc-50' : 'text-gray-900'} flex items-center gap-2.5 tracking-tight`}>
              <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-md shadow-lg shadow-indigo-500/20">
                <FolderTree className="w-3.5 h-3.5 text-white" />
              </div>
              Catalog Hierarchy
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  isDark
                    ? 'hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-300'
                    : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                }`}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setShowHiddenVersions(!showHiddenVersions)}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  showHiddenVersions
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : isDark
                    ? 'hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-300'
                    : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                }`}
                title={showHiddenVersions ? 'Hide hidden versions' : 'Show hidden versions'}
              >
                {showHiddenVersions ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button className={`p-1.5 rounded-md transition-all duration-200 ${isDark ? 'hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-300' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}>
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'} font-medium`}>Right-click for context menu</p>
        </div>

        {/* Tree View */}
        <div className="flex-1 overflow-auto">
          {renderTreeNode(catalogData)}
        </div>
      </div>

      {/* Right Column - Details Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className={`px-4 py-3.5 border-b ${isDark ? 'border-zinc-800/60 bg-gradient-to-b from-zinc-800/30' : 'border-gray-200 bg-gradient-to-b from-gray-100/30'} to-transparent backdrop-blur-sm shadow-lg`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => selectedNode && handleCreateLibrary()}
              disabled={isCreateLibraryDisabled()}
              className="px-3.5 py-2 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:from-indigo-500 shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/40"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Library
            </button>
            <button
              onClick={() => selectedNode && handleMarkAsNamed()}
              disabled={isMarkVersionDisabled()}
              className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${
                isDark
                  ? 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700/50 hover:border-zinc-600/50'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              Mark as Named
            </button>
            <button
              onClick={() => selectedNode && handleHideVersion()}
              disabled={isHideVersionDisabled()}
              className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${
                isDark
                  ? 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700/50 hover:border-zinc-600/50'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              Hide Version
            </button>
            <button
              onClick={() => selectedNode && handleUnhideVersion()}
              disabled={isUnhideVersionDisabled()}
              className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${
                isDark
                  ? 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700/50 hover:border-zinc-600/50'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Unhide Version
            </button>
            <div className="flex-1" />
            <button
              onClick={() => selectedNode && handleDelete()}
              disabled={isDeleteDisabled()}
              className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed border border-red-500/20 hover:border-red-500/40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>

        {/* Details Content */}
        <div className="flex-1 overflow-auto p-6">
          {selectedNode ? (
            <div className="max-w-2xl">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`p-3 rounded-xl shadow-lg ${
                    isDark
                      ? 'bg-gradient-to-br from-zinc-800 to-zinc-800/50 border border-zinc-700/50'
                      : 'bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200'
                  }`}>
                    {getNodeIcon(selectedNode, false)}
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-zinc-50' : 'text-gray-900'}`}>{selectedNode.name}</h2>
                    <p className={`text-xs capitalize font-medium mt-1 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>{selectedNode.type}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className={`block text-sm font-semibold mb-2.5 ${isDark ? 'text-zinc-200' : 'text-gray-700'}`}>Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 shadow-sm ${
                      isDark
                        ? 'bg-zinc-800/80 border border-zinc-700/60 text-zinc-50 placeholder-zinc-400 hover:border-zinc-600/60'
                        : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 hover:border-gray-400'
                    }`}
                    placeholder="Enter name..."
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label className={`block text-sm font-semibold mb-2.5 ${isDark ? 'text-zinc-200' : 'text-gray-700'}`}>Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all duration-200 shadow-sm ${
                      isDark
                        ? 'bg-zinc-800/80 border border-zinc-700/60 text-zinc-50 placeholder-zinc-400 hover:border-zinc-600/60'
                        : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 hover:border-gray-400'
                    }`}
                    placeholder="Enter description..."
                  />
                </div>

                {/* Additional Info */}
                {selectedNode.type === 'version' && (
                  <div className={`p-5 rounded-xl space-y-4 shadow-lg ${
                    isDark
                      ? 'bg-gradient-to-br from-zinc-800/80 to-zinc-800/50 border border-zinc-700/50'
                      : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
                  }`}>
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>Version Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className={`text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Type</span>
                        <div className="mt-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm ${
                            selectedNode.versionType === 'named'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : isDark
                              ? 'bg-gray-500/15 text-gray-300 border border-gray-500/30'
                              : 'bg-gray-200 text-gray-700 border border-gray-300'
                          }`}>
                            {selectedNode.versionType === 'named' ? <Star className="w-3 h-3" /> : <GitBranch className="w-3 h-3" />}
                            {selectedNode.versionType === 'named' ? 'Named Version' : 'Delta Version'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className={`text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Status</span>
                        <div className="mt-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm ${
                            selectedNode.isHidden
                              ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                              : 'bg-green-500/15 text-green-300 border border-green-500/30'
                          }`}>
                            {selectedNode.isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {selectedNode.isHidden ? 'Hidden' : 'Visible'}
                          </span>
                        </div>
                      </div>
                      {selectedNode.createdDate && (
                        <div>
                          <span className={`text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Created</span>
                          <p className={`font-medium mt-1.5 ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>{selectedNode.createdDate}</p>
                        </div>
                      )}
                      {selectedNode.author && (
                        <div>
                          <span className={`text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Author</span>
                          <p className={`font-medium mt-1.5 ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>{selectedNode.author}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6">
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
                  >
                    <Save className="w-4 h-4" />
                    Submit
                  </button>
                  <button
                    onClick={handleCancel}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                      isDark
                        ? 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700/50 hover:border-zinc-600/50'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className={`inline-flex p-6 rounded-2xl mb-4 shadow-xl ${
                  isDark
                    ? 'bg-gradient-to-br from-zinc-800/80 to-zinc-800/50 border border-zinc-700/50'
                    : 'bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200'
                }`}>
                  <FolderTree className={`w-10 h-10 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
                </div>
                <h3 className={`text-base font-semibold mb-2 ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>No Item Selected</h3>
                <p className={`text-sm max-w-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                  Select an item from the catalog hierarchy to view and edit its details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu.visible && contextMenu.node && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15 }}
            style={{ position: 'fixed', left: contextMenu.x, top: contextMenu.y }}
            className={`backdrop-blur-xl rounded-lg shadow-2xl z-50 min-w-[220px] overflow-hidden ${
              isDark
                ? 'bg-zinc-900/95 border border-zinc-700/60'
                : 'bg-white/95 border border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              {(contextMenu.node.type === 'mart' || contextMenu.node.type === 'library') && (
                <button
                  onClick={handleCreateLibrary}
                  className={`w-full px-4 py-2.5 text-left text-xs flex items-center gap-2.5 transition-all duration-150 font-medium ${
                    isDark ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                  Create Library
                </button>
              )}
              {contextMenu.node.type === 'model' && (
                <>
                  <button
                    onClick={handleCreateNamedVersion}
                    className={`w-full px-4 py-2.5 text-left text-xs flex items-center gap-2.5 transition-all duration-150 font-medium ${
                      isDark ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    Create Named Version
                  </button>
                  <button
                    onClick={handleCreateDeltaVersion}
                    className={`w-full px-4 py-2.5 text-left text-xs flex items-center gap-2.5 transition-all duration-150 font-medium ${
                      isDark ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <GitBranch className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    Create Delta Version
                  </button>
                </>
              )}
              {contextMenu.node.type === 'version' && (
                <>
                  {contextMenu.node.versionType === 'delta' && (
                    <button
                      onClick={handleMarkAsNamed}
                      className={`w-full px-4 py-2.5 text-left text-xs flex items-center gap-2.5 transition-all duration-150 font-medium ${
                        isDark ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      Mark as Named Version
                    </button>
                  )}
                  {!contextMenu.node.isHidden ? (
                    <button
                      onClick={handleHideVersion}
                      className={`w-full px-4 py-2.5 text-left text-xs flex items-center gap-2.5 transition-all duration-150 font-medium ${
                        isDark ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <EyeOff className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`} />
                      Hide Version
                    </button>
                  ) : (
                    <button
                      onClick={handleUnhideVersion}
                      className={`w-full px-4 py-2.5 text-left text-xs flex items-center gap-2.5 transition-all duration-150 font-medium ${
                        isDark ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-green-400" />
                      Unhide Version
                    </button>
                  )}
                </>
              )}
              {contextMenu.node.type !== 'mart' && contextMenu.node.type !== 'template' && (
                <>
                  <div className={`border-t my-1 ${isDark ? 'border-zinc-800/60' : 'border-gray-200'}`} />
                  <button
                    onClick={() => handleEdit(contextMenu.node!)}
                    className={`w-full px-4 py-2.5 text-left text-xs flex items-center gap-2.5 transition-all duration-150 font-medium ${
                      isDark ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                    Edit
                  </button>
                  <button className={`w-full px-4 py-2.5 text-left text-xs flex items-center gap-2.5 transition-all duration-150 font-medium ${
                    isDark ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-gray-100 text-gray-700'
                  }`}>
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    Copy
                  </button>
                  <button className={`w-full px-4 py-2.5 text-left text-xs flex items-center gap-2.5 transition-all duration-150 font-medium ${
                    isDark ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-gray-100 text-gray-700'
                  }`}>
                    <Move className="w-3.5 h-3.5 text-purple-400" />
                    Move
                  </button>
                </>
              )}
              {contextMenu.node.type !== 'mart' && (
                <>
                  <div className={`border-t my-1 ${isDark ? 'border-zinc-800/60' : 'border-gray-200'}`} />
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2.5 text-left text-xs hover:bg-red-500/10 flex items-center gap-2.5 text-red-400 hover:text-red-300 transition-all duration-150 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
