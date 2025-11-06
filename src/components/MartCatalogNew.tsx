'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  FolderTree,
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Edit3,
  Copy,
  Eye,
  MoreHorizontal,
  Settings,
  GitBranch,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Package,
  Table2,
  Box,
  Key,
  Link2,
  Filter,
  X,
  Save,
  Share2,
  FileDown,
  FileUp,
  Archive,
  Layers,
  Cpu
} from 'lucide-react';

// Types
type NodeType = 'repository' | 'catalog' | 'library' | 'model';
type ModelType = 'logical' | 'physical' | 'dimensional';
type DatabaseType = 'SQL Server' | 'Oracle' | 'PostgreSQL' | 'MySQL' | 'MongoDB';
type ModelStatus = 'checked-in' | 'checked-out' | 'locked';

interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  children?: TreeNode[];
  metadata?: ModelMetadata;
}

interface ModelMetadata {
  modelType?: ModelType;
  databaseType?: DatabaseType;
  version?: string;
  lastModified?: string;
  lastModifiedBy?: string;
  status?: ModelStatus;
  checkedOutBy?: string;
  tableCount?: number;
  viewCount?: number;
  relationshipCount?: number;
  columnCount?: number;
  description?: string;
  createdBy?: string;
  createdDate?: string;
  location?: string;
  tags?: string[];
}

// Mock Data
const mockCatalogTree: TreeNode[] = [
  {
    id: 'repo-1',
    name: 'Mart Repository',
    type: 'repository',
    children: [
      {
        id: 'cat-1',
        name: 'Enterprise Data Catalog',
        type: 'catalog',
        children: [
          {
            id: 'lib-1',
            name: 'Customer Domain',
            type: 'library',
            children: [
              {
                id: 'model-1',
                name: 'Customer360 Model',
                type: 'model',
                metadata: {
                  modelType: 'logical',
                  databaseType: 'SQL Server',
                  version: 'v2.1.0',
                  lastModified: '2024-01-15 10:30 AM',
                  lastModifiedBy: 'John Doe',
                  status: 'checked-in',
                  tableCount: 45,
                  viewCount: 12,
                  relationshipCount: 67,
                  columnCount: 389,
                  description: 'Comprehensive customer data model covering all customer touchpoints',
                  createdBy: 'Sarah Johnson',
                  createdDate: '2023-06-10',
                  location: '/mart/enterprise/customer',
                  tags: ['customer', 'crm', 'master-data']
                }
              },
              {
                id: 'model-2',
                name: 'Customer Segmentation',
                type: 'model',
                metadata: {
                  modelType: 'dimensional',
                  databaseType: 'SQL Server',
                  version: 'v1.5.0',
                  lastModified: '2024-01-10 14:20 PM',
                  lastModifiedBy: 'Mike Chen',
                  status: 'checked-out',
                  checkedOutBy: 'Mike Chen',
                  tableCount: 18,
                  viewCount: 5,
                  relationshipCount: 22,
                  columnCount: 145,
                  description: 'Customer segmentation dimensional model for analytics',
                  createdBy: 'Mike Chen',
                  createdDate: '2023-09-22',
                  location: '/mart/enterprise/customer',
                  tags: ['analytics', 'segmentation', 'dimensional']
                }
              }
            ]
          },
          {
            id: 'lib-2',
            name: 'Financial Domain',
            type: 'library',
            children: [
              {
                id: 'model-3',
                name: 'General Ledger Model',
                type: 'model',
                metadata: {
                  modelType: 'physical',
                  databaseType: 'Oracle',
                  version: 'v3.0.1',
                  lastModified: '2024-01-20 09:15 AM',
                  lastModifiedBy: 'Alice Williams',
                  status: 'locked',
                  tableCount: 62,
                  viewCount: 18,
                  relationshipCount: 84,
                  columnCount: 512,
                  description: 'Complete general ledger physical implementation',
                  createdBy: 'Alice Williams',
                  createdDate: '2023-03-15',
                  location: '/mart/enterprise/financial',
                  tags: ['finance', 'gl', 'accounting']
                }
              },
              {
                id: 'model-4',
                name: 'Accounts Payable',
                type: 'model',
                metadata: {
                  modelType: 'logical',
                  databaseType: 'SQL Server',
                  version: 'v1.8.0',
                  lastModified: '2024-01-18 11:45 AM',
                  lastModifiedBy: 'Bob Smith',
                  status: 'checked-in',
                  tableCount: 28,
                  viewCount: 8,
                  relationshipCount: 35,
                  columnCount: 201,
                  description: 'Accounts payable logical data model',
                  createdBy: 'Bob Smith',
                  createdDate: '2023-07-08',
                  location: '/mart/enterprise/financial',
                  tags: ['finance', 'ap', 'vendors']
                }
              }
            ]
          }
        ]
      },
      {
        id: 'cat-2',
        name: 'Analytics Catalog',
        type: 'catalog',
        children: [
          {
            id: 'lib-3',
            name: 'Sales Analytics',
            type: 'library',
            children: [
              {
                id: 'model-5',
                name: 'Sales Fact Model',
                type: 'model',
                metadata: {
                  modelType: 'dimensional',
                  databaseType: 'PostgreSQL',
                  version: 'v2.3.0',
                  lastModified: '2024-01-22 16:30 PM',
                  lastModifiedBy: 'Emma Davis',
                  status: 'checked-in',
                  tableCount: 12,
                  viewCount: 4,
                  relationshipCount: 15,
                  columnCount: 98,
                  description: 'Sales fact table with dimensional attributes',
                  createdBy: 'Emma Davis',
                  createdDate: '2023-10-12',
                  location: '/mart/analytics/sales',
                  tags: ['sales', 'fact', 'star-schema']
                }
              }
            ]
          }
        ]
      }
    ]
  }
];

export default function MartCatalogNew() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['repo-1', 'cat-1']));
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  const [catalogTree] = useState<TreeNode[]>(mockCatalogTree);

  // Toggle tree node expansion
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

  // Get icon for node type
  const getNodeIcon = (node: TreeNode, isExpanded: boolean) => {
    switch (node.type) {
      case 'repository':
        return <Database className="w-4 h-4 text-purple-400" />;
      case 'catalog':
        return <FolderTree className="w-4 h-4 text-blue-400" />;
      case 'library':
        return isExpanded ? <FolderOpen className="w-4 h-4 text-amber-400" /> : <Folder className="w-4 h-4 text-amber-400" />;
      case 'model':
        return <FileText className="w-4 h-4 text-emerald-400" />;
    }
  };

  // Get models from selected node
  const getModelsFromNode = (node: TreeNode | null): TreeNode[] => {
    if (!node) return [];

    if (node.type === 'model') return [node];

    const models: TreeNode[] = [];
    const collectModels = (n: TreeNode) => {
      if (n.type === 'model') {
        models.push(n);
      } else if (n.children) {
        n.children.forEach(collectModels);
      }
    };

    if (node.children) {
      node.children.forEach(collectModels);
    }

    return models;
  };

  const models = getModelsFromNode(selectedNode);

  // Render tree node
  const renderTreeNode = (node: TreeNode, depth: number = 0): JSX.Element => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-1 px-2 py-1.5 hover:bg-zinc-800/50 cursor-pointer group transition-colors ${
            isSelected ? 'bg-indigo-600/20 text-indigo-300' : 'text-zinc-300'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => setSelectedNode(node)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="p-0.5 hover:bg-zinc-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}

          {getNodeIcon(node, isExpanded)}

          <span className="text-sm flex-1 truncate">{node.name}</span>

          {node.type === 'model' && node.metadata && (
            <span className="text-xs text-zinc-500 opacity-0 group-hover:opacity-100">
              {node.metadata.status === 'checked-out' && <Lock className="w-3 h-3 text-amber-400" />}
              {node.metadata.status === 'locked' && <Lock className="w-3 h-3 text-red-400" />}
            </span>
          )}

          <button
            className="p-0.5 opacity-0 group-hover:opacity-100 hover:bg-zinc-700 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>

        {isExpanded && hasChildren && (
          <div>
            {node.children!.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Get status badge
  const getStatusBadge = (status: ModelStatus) => {
    switch (status) {
      case 'checked-in':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400">
          <CheckCircle className="w-3 h-3" />
          Checked In
        </span>;
      case 'checked-out':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-400">
          <Lock className="w-3 h-3" />
          Checked Out
        </span>;
      case 'locked':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-red-500/10 text-red-400">
          <Lock className="w-3 h-3" />
          Locked
        </span>;
    }
  };

  return (
    <div className="h-full flex bg-zinc-950">
      {/* Left Sidebar - Catalog Hierarchy */}
      <div className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-900/50">
        {/* Left Panel Header */}
        <div className="p-3 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-indigo-400" />
              Catalog Navigator
            </h3>
            <button className="p-1 hover:bg-zinc-800 rounded transition-colors">
              <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>

          {/* Search in tree */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search catalog..."
              className="w-full pl-8 pr-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tree View */}
        <div className="flex-1 overflow-auto">
          {catalogTree.map(node => renderTreeNode(node))}
        </div>

        {/* Left Panel Footer */}
        <div className="p-2 border-t border-zinc-800">
          <button className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-2">
            <Plus className="w-3.5 h-3.5" />
            New Catalog
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Toolbar */}
        <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/30">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">
                {selectedNode ? selectedNode.name : 'Mart Catalog Manager'}
              </h2>
              <p className="text-xs text-zinc-400">
                {selectedNode
                  ? `${models.length} model${models.length !== 1 ? 's' : ''} • ${selectedNode.type}`
                  : 'Select a catalog, library, or model from the navigator'}
              </p>
            </div>

            <button
              onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium transition-colors flex items-center gap-2"
            >
              <Eye className="w-3.5 h-3.5" />
              {showPropertiesPanel ? 'Hide' : 'Show'} Properties
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium transition-colors flex items-center gap-2">
              <Plus className="w-3.5 h-3.5" />
              New Library
            </button>
            <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium transition-colors flex items-center gap-2">
              <Upload className="w-3.5 h-3.5" />
              Import Model
            </button>
            <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium transition-colors flex items-center gap-2">
              <GitBranch className="w-3.5 h-3.5" />
              Harvest
            </button>
            <div className="flex-1" />
            <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium transition-colors flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium transition-colors flex items-center gap-2">
              <Settings className="w-3.5 h-3.5" />
              Properties
            </button>
            <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium transition-colors flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <button className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded text-xs font-medium transition-colors flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>

        {/* Content Grid/Table */}
        <div className="flex-1 overflow-auto">
          {models.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-flex p-4 bg-zinc-800 rounded-full mb-3">
                  <FolderTree className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-sm font-medium text-zinc-300 mb-1">No Models Selected</h3>
                <p className="text-xs text-zinc-500">
                  Select a catalog or library from the navigator to view models
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {/* Table Header */}
              <div className="mb-3 text-xs text-zinc-400">
                Showing {models.length} model{models.length !== 1 ? 's' : ''}
              </div>

              {/* Models Table */}
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-900 border-b border-zinc-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Model Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Database</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Version</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Last Modified</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Modified By</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {models.map((model, index) => (
                      <tr
                        key={model.id}
                        className="border-b border-zinc-800 hover:bg-zinc-800/30 cursor-pointer transition-colors"
                        onClick={() => setSelectedNode(model)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span className="text-zinc-100 font-medium">{model.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded capitalize">
                            {model.metadata?.modelType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-300 text-xs">{model.metadata?.databaseType}</td>
                        <td className="px-4 py-3 text-zinc-300 text-xs">{model.metadata?.version}</td>
                        <td className="px-4 py-3 text-zinc-300 text-xs">{model.metadata?.lastModified}</td>
                        <td className="px-4 py-3 text-zinc-300 text-xs">{model.metadata?.lastModifiedBy}</td>
                        <td className="px-4 py-3">{getStatusBadge(model.metadata?.status!)}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            className="p-1 hover:bg-zinc-700 rounded transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Properties & Preview */}
      <AnimatePresence>
        {showPropertiesPanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-zinc-800 bg-zinc-900/50 overflow-hidden"
          >
            <div className="w-[360px] h-full flex flex-col">
              {/* Properties Header */}
              <div className="p-3 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-100">Properties</h3>
                  <button
                    onClick={() => setShowPropertiesPanel(false)}
                    className="p-1 hover:bg-zinc-800 rounded transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                </div>
              </div>

              {/* Properties Content */}
              <div className="flex-1 overflow-auto p-4">
                {selectedNode && selectedNode.type === 'model' && selectedNode.metadata ? (
                  <div className="space-y-4">
                    {/* Model Preview Thumbnail */}
                    <div className="aspect-video bg-zinc-800 rounded-lg border border-zinc-700 flex items-center justify-center">
                      <div className="text-center">
                        <Layers className="w-12 h-12 text-zinc-600 mx-auto mb-2" />
                        <p className="text-xs text-zinc-500">Model Preview</p>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-2">Basic Information</h4>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-zinc-500">Name</label>
                          <p className="text-sm text-zinc-100">{selectedNode.name}</p>
                        </div>
                        <div>
                          <label className="text-xs text-zinc-500">Description</label>
                          <p className="text-sm text-zinc-300">{selectedNode.metadata.description}</p>
                        </div>
                        <div>
                          <label className="text-xs text-zinc-500">Location</label>
                          <p className="text-xs text-zinc-400 font-mono">{selectedNode.metadata.location}</p>
                        </div>
                      </div>
                    </div>

                    {/* Model Details */}
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-2">Model Details</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 bg-zinc-800 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <Table2 className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs text-zinc-400">Tables</span>
                          </div>
                          <p className="text-lg font-semibold text-zinc-100">{selectedNode.metadata.tableCount}</p>
                        </div>
                        <div className="p-2 bg-zinc-800 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <Eye className="w-3.5 h-3.5 text-purple-400" />
                            <span className="text-xs text-zinc-400">Views</span>
                          </div>
                          <p className="text-lg font-semibold text-zinc-100">{selectedNode.metadata.viewCount}</p>
                        </div>
                        <div className="p-2 bg-zinc-800 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <Link2 className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-xs text-zinc-400">Relationships</span>
                          </div>
                          <p className="text-lg font-semibold text-zinc-100">{selectedNode.metadata.relationshipCount}</p>
                        </div>
                        <div className="p-2 bg-zinc-800 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <Key className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs text-zinc-400">Columns</span>
                          </div>
                          <p className="text-lg font-semibold text-zinc-100">{selectedNode.metadata.columnCount}</p>
                        </div>
                      </div>
                    </div>

                    {/* Version Info */}
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-2">Version Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-zinc-500">Version</span>
                          <span className="text-xs text-zinc-300 font-mono">{selectedNode.metadata.version}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-zinc-500">Status</span>
                          {getStatusBadge(selectedNode.metadata.status!)}
                        </div>
                        {selectedNode.metadata.checkedOutBy && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-zinc-500">Checked Out By</span>
                            <span className="text-xs text-zinc-300">{selectedNode.metadata.checkedOutBy}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-2">Metadata</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <User className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="text-zinc-500">Created by:</span>
                          <span className="text-zinc-300">{selectedNode.metadata.createdBy}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="text-zinc-500">Created:</span>
                          <span className="text-zinc-300">{selectedNode.metadata.createdDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="text-zinc-500">Modified:</span>
                          <span className="text-zinc-300">{selectedNode.metadata.lastModified}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <User className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="text-zinc-500">Modified by:</span>
                          <span className="text-zinc-300">{selectedNode.metadata.lastModifiedBy}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {selectedNode.metadata.tags && selectedNode.metadata.tags.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedNode.metadata.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-4 border-t border-zinc-800 space-y-2">
                      <button className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-2">
                        <FileDown className="w-3.5 h-3.5" />
                        Import to Editor
                      </button>
                      <button className="w-full px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium transition-colors flex items-center justify-center gap-2">
                        <Download className="w-3.5 h-3.5" />
                        Download Model
                      </button>
                    </div>
                  </div>
                ) : selectedNode ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-2">Information</h4>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-zinc-500">Name</label>
                          <p className="text-sm text-zinc-100">{selectedNode.name}</p>
                        </div>
                        <div>
                          <label className="text-xs text-zinc-500">Type</label>
                          <p className="text-sm text-zinc-300 capitalize">{selectedNode.type}</p>
                        </div>
                        <div>
                          <label className="text-xs text-zinc-500">Items</label>
                          <p className="text-sm text-zinc-300">{selectedNode.children?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Box className="w-12 h-12 text-zinc-700 mx-auto mb-2" />
                    <p className="text-xs text-zinc-500">Select an item to view properties</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
