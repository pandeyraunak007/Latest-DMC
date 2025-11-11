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
  Plus,
  Trash2,
  Edit3,
  Copy,
  Eye,
  EyeOff,
  Tag,
  GitBranch,
  Check,
  X,
  Save,
  MoreVertical,
  RefreshCw,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  Star,
  Clock,
  User,
  Calendar,
  Package,
  Layers,
  Grid,
  List,
  SplitSquareVertical
} from 'lucide-react';

// Original custom design for catalog management
// Not affiliated with or based on any specific commercial product

type NodeType = 'root' | 'catalog' | 'schema' | 'dataset' | 'snapshot';
type ViewMode = 'tree' | 'grid' | 'list';

interface CatalogNode {
  id: string;
  name: string;
  type: NodeType;
  description?: string;
  children?: CatalogNode[];
  metadata?: {
    version?: string;
    author?: string;
    created?: string;
    modified?: string;
    status?: 'active' | 'archived' | 'draft';
    tags?: string[];
  };
}

const sampleData: CatalogNode = {
  id: 'root',
  name: 'Data Catalog',
  type: 'root',
  description: 'Enterprise data catalog repository',
  children: [
    {
      id: 'cat-1',
      name: 'Production Catalog',
      type: 'catalog',
      description: 'Production data models',
      metadata: { status: 'active', created: '2024-01-01' },
      children: [
        {
          id: 'schema-1',
          name: 'Sales Schema',
          type: 'schema',
          description: 'Sales data structures',
          metadata: { version: '2.0', author: 'Data Team', status: 'active' },
          children: [
            {
              id: 'dataset-1',
              name: 'Customer Data',
              type: 'dataset',
              description: 'Customer information dataset',
              metadata: {
                version: '1.5',
                author: 'John Smith',
                created: '2024-01-15',
                modified: '2024-01-20',
                status: 'active',
                tags: ['customers', 'pii', 'master-data']
              },
              children: [
                {
                  id: 'snap-1',
                  name: 'Snapshot_2024-01-20',
                  type: 'snapshot',
                  description: 'Latest snapshot',
                  metadata: { created: '2024-01-20', author: 'System' }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default function EnterpriseCatalogManager() {
  const [catalogData, setCatalogData] = useState<CatalogNode>(sampleData);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['root', 'cat-1']));
  const [selected, setSelected] = useState<CatalogNode | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', tags: '' });

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const getIcon = (node: CatalogNode, isExpanded: boolean) => {
    switch (node.type) {
      case 'root': return <Database className="w-4 h-4 text-purple-400" />;
      case 'catalog': return <FolderTree className="w-4 h-4 text-blue-400" />;
      case 'schema': return isExpanded ? <FolderOpen className="w-4 h-4 text-emerald-400" /> : <Folder className="w-4 h-4 text-emerald-400" />;
      case 'dataset': return <FileText className="w-4 h-4 text-amber-400" />;
      case 'snapshot': return <GitBranch className="w-4 h-4 text-gray-400" />;
    }
  };

  const renderTreeNode = (node: CatalogNode, depth: number = 0): JSX.Element => {
    const isExpanded = expanded.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selected?.id === node.id;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 hover:bg-zinc-800/50 cursor-pointer transition-colors ${
            isSelected ? 'bg-blue-600/20 border-l-2 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
          onClick={() => {
            setSelected(node);
            setFormData({
              name: node.name,
              description: node.description || '',
              tags: node.metadata?.tags?.join(', ') || ''
            });
          }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              className="p-0.5 hover:bg-zinc-700 rounded"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}

          {getIcon(node, isExpanded)}

          <span className="flex-1 text-sm text-zinc-200">{node.name}</span>

          {node.metadata?.status && (
            <span className={`px-2 py-0.5 rounded text-xs ${
              node.metadata.status === 'active' ? 'bg-green-500/10 text-green-400' :
              node.metadata.status === 'draft' ? 'bg-yellow-500/10 text-yellow-400' :
              'bg-gray-500/10 text-gray-400'
            }`}>
              {node.metadata.status}
            </span>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div>
            {node.children!.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleSave = () => {
    // Save functionality
    setEditMode(false);
  };

  return (
    <div className="h-full flex bg-zinc-950">
      {/* Left Panel - Tree Navigator */}
      <div className="w-96 border-r border-zinc-800 flex flex-col bg-zinc-900/30">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <FolderTree className="w-4 h-4" />
              Catalog Navigator
            </h2>
            <div className="flex gap-1">
              <button className="p-1.5 hover:bg-zinc-800 rounded">
                <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
              </button>
              <button className="p-1.5 hover:bg-zinc-800 rounded">
                <Settings className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {renderTreeNode(catalogData)}
        </div>

        <div className="p-3 border-t border-zinc-800">
          <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            New Catalog
          </button>
        </div>
      </div>

      {/* Right Panel - Details & Actions */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              {selected ? selected.name : 'Catalog Manager'}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('tree')}
                className={`p-2 rounded ${viewMode === 'tree' ? 'bg-blue-600 text-white' : 'hover:bg-zinc-800 text-zinc-400'}`}
              >
                <SplitSquareVertical className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'hover:bg-zinc-800 text-zinc-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'hover:bg-zinc-800 text-zinc-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs flex items-center gap-2">
              <Plus className="w-3.5 h-3.5" />
              Add Item
            </button>
            <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs flex items-center gap-2">
              <Upload className="w-3.5 h-3.5" />
              Import
            </button>
            <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <div className="flex-1" />
            <button className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded text-xs flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {selected ? (
            <div className="max-w-3xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-zinc-800 rounded-lg">
                  {getIcon(selected, false)}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-zinc-100 mb-1">{selected.name}</h2>
                  <p className="text-sm text-zinc-400 capitalize">{selected.type}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {selected.metadata && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-800 rounded-lg">
                    <div>
                      <label className="text-xs text-zinc-500">Version</label>
                      <p className="text-sm text-zinc-200">{selected.metadata.version || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500">Author</label>
                      <p className="text-sm text-zinc-200">{selected.metadata.author || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500">Created</label>
                      <p className="text-sm text-zinc-200">{selected.metadata.created || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500">Modified</label>
                      <p className="text-sm text-zinc-200">{selected.metadata.modified || 'N/A'}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Comma separated tags..."
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Database className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-zinc-300 mb-2">No Item Selected</h3>
                <p className="text-sm text-zinc-500">Select an item from the catalog to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
