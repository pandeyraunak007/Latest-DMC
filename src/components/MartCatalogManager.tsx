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
  FileCode
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
        return <Database className="w-4 h-4 text-purple-400" />;
      case 'library':
        if (node.name === 'Templates') {
          return <Archive className="w-4 h-4 text-amber-400" />;
        }
        return isExpanded ? <FolderOpen className="w-4 h-4 text-blue-400" /> : <Folder className="w-4 h-4 text-blue-400" />;
      case 'model':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'version':
        return node.versionType === 'named' ? <Star className="w-4 h-4 text-amber-400" /> : <GitBranch className="w-4 h-4 text-gray-400" />;
      case 'template':
        return <FileCode className="w-4 h-4 text-violet-400" />;
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
          className={`flex items-center gap-1 px-2 py-1.5 hover:bg-zinc-800/50 cursor-pointer group transition-colors relative ${
            isSelected ? 'bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500' : 'text-zinc-300'
          } ${node.isHidden ? 'opacity-50' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
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
          <div className="flex items-center gap-1 flex-1">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(node.id);
                }}
                className="p-0.5 hover:bg-zinc-700 rounded flex-shrink-0"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                )}
              </button>
            ) : (
              <div className="w-4 flex-shrink-0" />
            )}

            {getNodeIcon(node, isExpanded)}

            <span className="text-sm flex-1 truncate">{node.name}</span>

            {node.isHidden && <EyeOff className="w-3 h-3 text-zinc-500 flex-shrink-0" />}
            {node.versionType === 'named' && <Tag className="w-3 h-3 text-amber-400 flex-shrink-0" />}
          </div>

          <button
            className="p-0.5 opacity-0 group-hover:opacity-100 hover:bg-zinc-700 rounded flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setContextMenu({ visible: true, x: e.clientX, y: e.clientY, node });
            }}
          >
            <MoreVertical className="w-3.5 h-3.5 text-zinc-400" />
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
    <div className="h-full flex bg-zinc-950" onClick={() => setContextMenu({ visible: false, x: 0, y: 0, node: null })}>
      {/* Left Column - Tree View */}
      <div className="w-96 border-r border-zinc-800 flex flex-col bg-zinc-900/50">
        {/* Tree Header */}
        <div className="p-3 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-indigo-400" />
              Catalog Hierarchy
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowHiddenVersions(!showHiddenVersions)}
                className={`p-1.5 rounded transition-colors ${
                  showHiddenVersions ? 'bg-indigo-600 text-white' : 'hover:bg-zinc-800 text-zinc-400'
                }`}
                title={showHiddenVersions ? 'Hide hidden versions' : 'Show hidden versions'}
              >
                {showHiddenVersions ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-zinc-400">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-xs text-zinc-500">Right-click for context menu</p>
        </div>

        {/* Tree View */}
        <div className="flex-1 overflow-auto">
          {renderTreeNode(catalogData)}
        </div>
      </div>

      {/* Right Column - Details Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => selectedNode && handleCreateLibrary()}
              disabled={isCreateLibraryDisabled()}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Library
            </button>
            <button
              onClick={() => selectedNode && handleMarkAsNamed()}
              disabled={isMarkVersionDisabled()}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Tag className="w-3.5 h-3.5" />
              Mark as Named
            </button>
            <button
              onClick={() => selectedNode && handleHideVersion()}
              disabled={isHideVersionDisabled()}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <EyeOff className="w-3.5 h-3.5" />
              Hide Version
            </button>
            <button
              onClick={() => selectedNode && handleUnhideVersion()}
              disabled={isUnhideVersionDisabled()}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Eye className="w-3.5 h-3.5" />
              Unhide Version
            </button>
            <div className="flex-1" />
            <button
              onClick={() => selectedNode && handleDelete()}
              disabled={isDeleteDisabled()}
              className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
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
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-zinc-800 rounded-lg">
                    {getNodeIcon(selectedNode, false)}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-100">{selectedNode.name}</h2>
                    <p className="text-xs text-zinc-500 capitalize">{selectedNode.type}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                    placeholder="Enter name..."
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
                    placeholder="Enter description..."
                  />
                </div>

                {/* Additional Info */}
                {selectedNode.type === 'version' && (
                  <div className="p-4 bg-zinc-800 rounded-lg space-y-3">
                    <h4 className="text-xs font-semibold text-zinc-400 uppercase">Version Information</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-zinc-500">Type:</span>
                        <div className="mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                            selectedNode.versionType === 'named'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-gray-500/10 text-gray-400'
                          }`}>
                            {selectedNode.versionType === 'named' ? <Star className="w-3 h-3" /> : <GitBranch className="w-3 h-3" />}
                            {selectedNode.versionType === 'named' ? 'Named Version' : 'Delta Version'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-zinc-500">Status:</span>
                        <div className="mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                            selectedNode.isHidden
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-green-500/10 text-green-400'
                          }`}>
                            {selectedNode.isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {selectedNode.isHidden ? 'Hidden' : 'Visible'}
                          </span>
                        </div>
                      </div>
                      {selectedNode.createdDate && (
                        <div>
                          <span className="text-zinc-500">Created:</span>
                          <p className="text-zinc-300">{selectedNode.createdDate}</p>
                        </div>
                      )}
                      {selectedNode.author && (
                        <div>
                          <span className="text-zinc-500">Author:</span>
                          <p className="text-zinc-300">{selectedNode.author}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Submit
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
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
                <div className="inline-flex p-4 bg-zinc-800 rounded-full mb-3">
                  <FolderTree className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-sm font-medium text-zinc-300 mb-1">No Item Selected</h3>
                <p className="text-xs text-zinc-500">
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ position: 'fixed', left: contextMenu.x, top: contextMenu.y }}
            className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl z-50 min-w-[200px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {(contextMenu.node.type === 'mart' || contextMenu.node.type === 'library') && (
              <button
                onClick={handleCreateLibrary}
                className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 flex items-center gap-2 text-zinc-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Library
              </button>
            )}
            {contextMenu.node.type === 'model' && (
              <>
                <button
                  onClick={handleCreateNamedVersion}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 flex items-center gap-2 text-zinc-300 transition-colors"
                >
                  <Star className="w-3.5 h-3.5" />
                  Create Named Version
                </button>
                <button
                  onClick={handleCreateDeltaVersion}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 flex items-center gap-2 text-zinc-300 transition-colors"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  Create Delta Version
                </button>
              </>
            )}
            {contextMenu.node.type === 'version' && (
              <>
                {contextMenu.node.versionType === 'delta' && (
                  <button
                    onClick={handleMarkAsNamed}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 flex items-center gap-2 text-zinc-300 transition-colors"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    Mark as Named Version
                  </button>
                )}
                {!contextMenu.node.isHidden ? (
                  <button
                    onClick={handleHideVersion}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 flex items-center gap-2 text-zinc-300 transition-colors"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    Hide Version
                  </button>
                ) : (
                  <button
                    onClick={handleUnhideVersion}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 flex items-center gap-2 text-zinc-300 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Unhide Version
                  </button>
                )}
              </>
            )}
            {contextMenu.node.type !== 'mart' && contextMenu.node.type !== 'template' && (
              <>
                <div className="border-t border-zinc-800 my-1" />
                <button
                  onClick={() => handleEdit(contextMenu.node!)}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 flex items-center gap-2 text-zinc-300 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 flex items-center gap-2 text-zinc-300 transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </button>
                <button className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 flex items-center gap-2 text-zinc-300 transition-colors">
                  <Move className="w-3.5 h-3.5" />
                  Move
                </button>
              </>
            )}
            {contextMenu.node.type !== 'mart' && (
              <>
                <div className="border-t border-zinc-800 my-1" />
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 flex items-center gap-2 text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
