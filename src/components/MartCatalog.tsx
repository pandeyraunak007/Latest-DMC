'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderTree,
  Star,
  Clock,
  Search,
  ChevronDown,
  ChevronRight,
  Folder,
  FileText,
  Calendar,
  User,
  Package,
  Download,
  Upload,
  MoreHorizontal,
  CheckCircle,
  Lock,
  AlertCircle,
  Archive,
  Filter,
  RefreshCw,
  FolderOpen,
  ExternalLink,
  Copy,
  Trash2,
  Edit3,
  Eye,
  Heart,
  Tag,
  GitBranch,
  LayoutGrid,
  List,
  Home,
  FolderPlus,
  Plus,
  ArrowLeft,
  ArrowRight,
  MoreVertical,
  X
} from 'lucide-react';
import {
  mockMartModels,
  mockFolderStructure,
  getFavoriteModels,
  getRecentlyOpenedModels,
  MartModel,
  FolderStructure,
  ModelStatus
} from '../utils/martMockData';

type ViewMode = 'folder' | 'favorites' | 'recent';
type DisplayMode = 'grid' | 'list';

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface ModelCardProps {
  model: MartModel;
  onOpen: (model: MartModel) => void;
  onToggleFavorite: (modelId: string) => void;
  displayMode: DisplayMode;
  depth?: number;
  onAction?: (action: string, modelId: string) => void;
  activeActionMenu?: string | null;
  setActiveActionMenu?: (id: string | null) => void;
}

const ModelCard = ({
  model,
  onOpen,
  onToggleFavorite,
  displayMode,
  depth = 0,
  onAction,
  activeActionMenu,
  setActiveActionMenu
}: ModelCardProps) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusIcon = () => {
    switch (model.status) {
      case 'active':
        return <CheckCircle className="w-3 h-3 text-emerald-500" />;
      case 'locked':
        return <Lock className="w-3 h-3 text-amber-500" />;
      case 'checked-out':
        return <AlertCircle className="w-3 h-3 text-blue-500" />;
      case 'archived':
        return <Archive className="w-3 h-3 text-zinc-500" />;
    }
  };

  const getStatusColor = () => {
    switch (model.status) {
      case 'active':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'locked':
        return 'text-amber-500 bg-amber-500/10';
      case 'checked-out':
        return 'text-blue-500 bg-blue-500/10';
      case 'archived':
        return 'text-zinc-500 bg-zinc-500/10';
    }
  };

  if (displayMode === 'list') {
    return (
      <div
        className="group flex items-center px-3 py-2 hover:bg-zinc-800 border-b border-zinc-800/50 cursor-pointer text-sm relative"
        onClick={() => onOpen(model)}
      >
        <div className="w-8" style={{ marginLeft: `${depth * 20}px` }}></div>
        <div className="w-8 flex items-center justify-center">
          <FileText className="w-4 h-4 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0 px-3">
          <div className="flex items-center gap-2">
            <span className="text-zinc-100 truncate">{model.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(model.id);
              }}
            >
              <Heart
                className={`w-3 h-3 ${
                  model.isFavorite
                    ? 'fill-red-500 text-red-500'
                    : 'text-zinc-600 hover:text-red-500'
                }`}
              />
            </button>
          </div>
        </div>
        <div className="w-32 px-3 text-zinc-400 truncate">{model.lastModified}</div>
        <div className="w-24 px-3">
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="capitalize">{model.status}</span>
          </div>
        </div>
        <div className="w-24 px-3 text-zinc-400">{model.size}</div>
        <div className="w-32 px-3 text-zinc-400 truncate">{model.author}</div>
        <div className="w-20 px-3 text-zinc-400 text-center">{model.entityCount}</div>
        <div className="w-10 flex items-center justify-center relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveActionMenu?.(activeActionMenu === model.id ? null : model.id);
            }}
            className="p-1 hover:bg-zinc-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4 text-zinc-400" />
          </button>
          <AnimatePresence>
            {activeActionMenu === model.id && onAction && (
              <ActionMenu
                itemId={model.id}
                itemType="model"
                isOpen={true}
                onAction={onAction}
                isLocked={model.status === 'locked'}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all cursor-pointer relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="p-1.5 bg-violet-500/20 rounded-lg flex-shrink-0">
            <FileText className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3
                className="text-xs font-semibold text-zinc-100 truncate group-hover:text-violet-400 transition-colors"
                onClick={() => onOpen(model)}
              >
                {model.name}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(model.id);
                }}
                className="flex-shrink-0"
              >
                <Heart
                  className={`w-3 h-3 transition-colors ${
                    model.isFavorite
                      ? 'fill-red-500 text-red-500'
                      : 'text-zinc-500 hover:text-red-500'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-zinc-400 truncate leading-tight">{model.description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="capitalize">{model.status}</span>
        </div>
        <div className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded flex items-center gap-1">
          <Package className="w-3 h-3 text-zinc-400" />
          <span className="text-zinc-300">{model.entityCount}</span>
        </div>
        <div className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded">
          <span className="text-zinc-400">{model.version}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
        <div className="flex items-center gap-2 truncate">
          <span className="flex items-center gap-0.5 truncate">
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{model.author}</span>
          </span>
          <span className="flex items-center gap-0.5">
            <Calendar className="w-3 h-3" />
            {model.lastModified}
          </span>
        </div>
        <span className="text-zinc-400 ml-2">{model.size}</span>
      </div>

      <div className="flex gap-1 flex-wrap">
        {model.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="text-xs bg-violet-500/10 text-violet-400 px-1.5 py-0.5 rounded"
          >
            #{tag}
          </span>
        ))}
        {model.tags.length > 3 && (
          <span className="text-xs text-zinc-500 px-1">+{model.tags.length - 3}</span>
        )}
      </div>

      {/* Action Menu */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-2 right-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-10 overflow-hidden"
          >
            <button className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 flex items-center gap-2 text-zinc-300">
              <Eye className="w-3 h-3" />
              View Details
            </button>
            <button className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 flex items-center gap-2 text-zinc-300">
              <Edit3 className="w-3 h-3" />
              Edit
            </button>
            <button className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 flex items-center gap-2 text-zinc-300">
              <Copy className="w-3 h-3" />
              Duplicate
            </button>
            <button className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 flex items-center gap-2 text-zinc-300">
              <Download className="w-3 h-3" />
              Export
            </button>
            <div className="border-t border-zinc-800"></div>
            <button className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 flex items-center gap-2 text-red-400">
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface FolderCardProps {
  folder: FolderStructure;
  onOpen: (folder: FolderStructure) => void;
  displayMode: DisplayMode;
  depth?: number;
  isExpanded?: boolean;
  onToggleExpand?: (folderId: string) => void;
  onAction?: (action: string, folderId: string) => void;
  activeActionMenu?: string | null;
  setActiveActionMenu?: (id: string | null) => void;
  onAddSubfolder?: (parentFolder: FolderStructure) => void;
  onAddModel?: (parentFolder: FolderStructure) => void;
}

const FolderCard = ({
  folder,
  onOpen,
  displayMode,
  depth = 0,
  isExpanded = false,
  onToggleExpand,
  onAction,
  activeActionMenu,
  setActiveActionMenu,
  onAddSubfolder,
  onAddModel
}: FolderCardProps) => {
  if (displayMode === 'list') {
    const hasChildren = folder.children && folder.children.length > 0;

    return (
      <div
        className="group flex items-center px-3 py-2 hover:bg-zinc-800 border-b border-zinc-800/50 cursor-pointer text-sm relative"
      >
        <div className="w-8 flex items-center justify-center" style={{ marginLeft: `${depth * 20}px` }}>
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand?.(folder.id);
              }}
              className="p-0.5 hover:bg-zinc-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              )}
            </button>
          ) : (
            <div className="w-4 h-4" />
          )}
        </div>
        <div className="w-8 flex items-center justify-center" onClick={() => onOpen(folder)}>
          <Folder className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0 px-3" onClick={() => onOpen(folder)}>
          <span className="text-zinc-100">{folder.name}</span>
        </div>
        <div className="w-32 px-3 text-zinc-400">--</div>
        <div className="w-24 px-3 text-zinc-400">Folder</div>
        <div className="w-24 px-3 text-zinc-400">--</div>
        <div className="w-32 px-3 text-zinc-400">--</div>
        <div className="w-20 px-3 text-zinc-400 text-center">
          {folder.children?.length || 0}
        </div>
        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onAddSubfolder && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddSubfolder(folder);
              }}
              className="p-1 hover:bg-violet-600 hover:text-white bg-zinc-700 text-zinc-400 rounded transition-colors"
              title="Add subfolder"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          )}
          {onAddModel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddModel(folder);
              }}
              className="p-1 hover:bg-emerald-600 hover:text-white bg-zinc-700 text-zinc-400 rounded transition-colors"
              title="Add new model"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="w-10 flex items-center justify-center relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveActionMenu?.(activeActionMenu === folder.id ? null : folder.id);
            }}
            className="p-1 hover:bg-zinc-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4 text-zinc-400" />
          </button>
          <AnimatePresence>
            {activeActionMenu === folder.id && onAction && (
              <ActionMenu
                itemId={folder.id}
                itemType="folder"
                isOpen={true}
                onAction={onAction}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all cursor-pointer"
      onClick={() => onOpen(folder)}
    >
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Folder className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-semibold text-zinc-100 truncate group-hover:text-blue-400 transition-colors">
            {folder.name}
          </h3>
          <p className="text-xs text-zinc-500">{folder.children?.length || 0} items</p>
        </div>
      </div>
    </motion.div>
  );
};

interface ActionMenuProps {
  itemId: string;
  itemType: 'folder' | 'model';
  isOpen: boolean;
  onAction: (action: string, itemId: string) => void;
  isLocked?: boolean;
}

const ActionMenu = ({ itemId, itemType, isOpen, onAction, isLocked }: ActionMenuProps) => {
  if (!isOpen) return null;

  const folderActions = [
    { id: 'rename', label: 'Rename', icon: <Edit3 className="w-3 h-3" /> },
    { id: 'move', label: 'Move', icon: <ArrowRight className="w-3 h-3" /> },
    { id: 'delete', label: 'Delete', icon: <Trash2 className="w-3 h-3" />, danger: true },
  ];

  const modelActions = [
    { id: 'open', label: 'Open', icon: <Eye className="w-3 h-3" /> },
    { id: 'rename', label: 'Rename', icon: <Edit3 className="w-3 h-3" /> },
    { id: 'duplicate', label: 'Duplicate', icon: <Copy className="w-3 h-3" /> },
    { id: 'move', label: 'Move to...', icon: <ArrowRight className="w-3 h-3" /> },
    { id: isLocked ? 'unlock' : 'lock', label: isLocked ? 'Unlock' : 'Lock', icon: <Lock className="w-3 h-3" /> },
    { id: 'download', label: 'Download', icon: <Download className="w-3 h-3" /> },
    { id: 'delete', label: 'Delete', icon: <Trash2 className="w-3 h-3" />, danger: true },
  ];

  const actions = itemType === 'folder' ? folderActions : modelActions;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.1 }}
      className="absolute right-0 top-8 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 min-w-[160px] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {actions.map((action, index) => (
        <button
          key={action.id}
          onClick={(e) => {
            e.stopPropagation();
            onAction(action.id, itemId);
          }}
          className={`w-full px-3 py-2 text-left text-xs hover:bg-zinc-800 flex items-center gap-2 transition-colors ${
            action.danger ? 'text-red-400 hover:text-red-300' : 'text-zinc-300 hover:text-zinc-100'
          } ${index !== actions.length - 1 && action.danger ? 'border-t border-zinc-800' : ''}`}
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </motion.div>
  );
};

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (folderName: string) => void;
  parentFolderName?: string;
}

const NewFolderModal = ({ isOpen, onClose, onConfirm, parentFolderName }: NewFolderModalProps) => {
  const [folderName, setFolderName] = useState('');

  const handleSubmit = () => {
    if (folderName.trim()) {
      onConfirm(folderName.trim());
      setFolderName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Create New Folder</h3>
            {parentFolderName && (
              <p className="text-xs text-zinc-400 mt-1">in "{parentFolderName}"</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 rounded transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-zinc-400 mb-2">Folder Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500"
            placeholder="Enter folder name..."
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
              if (e.key === 'Escape') onClose();
            }}
            autoFocus
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm transition-colors"
            disabled={!folderName.trim()}
          >
            Create Folder
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function MartCatalog() {
  const [viewMode, setViewMode] = useState<ViewMode>('folder');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [models, setModels] = useState<MartModel[]>(mockMartModels);
  const [selectedStatus, setSelectedStatus] = useState<ModelStatus | 'all'>('all');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ name: 'Mart', path: '/' }]);
  const [currentFolder, setCurrentFolder] = useState<FolderStructure | null>(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [folders, setFolders] = useState<FolderStructure[]>(mockFolderStructure);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [selectedParentFolder, setSelectedParentFolder] = useState<FolderStructure | null>(null);

  const handleOpenModel = (model: MartModel) => {
    console.log('Opening model:', model.name);
  };

  const handleToggleFavorite = (modelId: string) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === modelId ? { ...model, isFavorite: !model.isFavorite } : model
      )
    );
  };

  const toggleFolderExpansion = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleModelAction = (action: string, modelId: string) => {
    console.log(`Action: ${action} on model: ${modelId}`);
    setActiveActionMenu(null);

    if (action === 'delete') {
      if (confirm('Are you sure you want to delete this model?')) {
        setModels((prev) => prev.filter((m) => m.id !== modelId));
      }
    } else if (action === 'lock' || action === 'unlock') {
      setModels((prev) =>
        prev.map((model) =>
          model.id === modelId
            ? { ...model, status: action === 'lock' ? 'locked' : 'active' }
            : model
        )
      );
    }
  };

  const handleFolderAction = (action: string, folderId: string) => {
    console.log(`Action: ${action} on folder: ${folderId}`);
    setActiveActionMenu(null);

    if (action === 'delete') {
      if (confirm('Are you sure you want to delete this folder and all its contents?')) {
        setFolders((prev) => {
          const removeFolder = (items: FolderStructure[]): FolderStructure[] => {
            return items.filter((item) => item.id !== folderId).map((item) => {
              if (item.children) {
                return { ...item, children: removeFolder(item.children) };
              }
              return item;
            });
          };
          return removeFolder(prev);
        });
      }
    }
  };

  const handleOpenFolder = (folder: FolderStructure) => {
    setCurrentFolder(folder);
    setBreadcrumbs((prev) => [...prev, { name: folder.name, path: folder.path }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
    if (index === 0) {
      setCurrentFolder(null);
    } else {
      // Navigate to the folder at this breadcrumb
      const targetPath = breadcrumbs[index].path;
      const findFolder = (items: FolderStructure[], path: string): FolderStructure | null => {
        for (const item of items) {
          if (item.path === path) return item;
          if (item.children) {
            const found = findFolder(item.children, path);
            if (found) return found;
          }
        }
        return null;
      };
      setCurrentFolder(findFolder(folders, targetPath));
    }
  };

  const handleCreateFolder = (folderName: string) => {
    const parentFolder = selectedParentFolder || currentFolder;
    const newFolder: FolderStructure = {
      id: `folder-${Date.now()}`,
      name: folderName,
      path: parentFolder ? `${parentFolder.path}/${folderName.toLowerCase()}` : `/mart/${folderName.toLowerCase()}`,
      type: 'folder',
      children: []
    };

    if (parentFolder) {
      // Add to parent folder
      setFolders((prev) => {
        const updateFolders = (items: FolderStructure[]): FolderStructure[] => {
          return items.map((item) => {
            if (item.id === parentFolder.id) {
              return {
                ...item,
                children: [...(item.children || []), newFolder]
              };
            }
            if (item.children) {
              return { ...item, children: updateFolders(item.children) };
            }
            return item;
          });
        };
        return updateFolders(prev);
      });
      // Auto-expand the parent folder
      setExpandedFolders((prev) => new Set([...prev, parentFolder.id]));
    } else {
      // Add to root
      setFolders((prev) => [...prev, newFolder]);
    }
    setSelectedParentFolder(null);
  };

  const handleAddSubfolder = (parentFolder: FolderStructure) => {
    setSelectedParentFolder(parentFolder);
    setShowNewFolderModal(true);
  };

  const handleAddModel = (parentFolder: FolderStructure) => {
    const modelName = prompt(`Enter model name for folder "${parentFolder.name}":`);
    if (!modelName) return;

    const newModel: MartModel = {
      id: `model-${Date.now()}`,
      name: modelName,
      path: `${parentFolder.path}/${modelName.toLowerCase().replace(/\s+/g, '-')}`,
      folder: parentFolder.name,
      description: 'New model',
      entityCount: 0,
      lastModified: 'Just now',
      status: 'active',
      version: 'v1.0.0',
      author: 'Current User',
      size: '0 KB',
      tags: ['new'],
      isFavorite: false
    };

    // Add model to models list
    setModels((prev) => [...prev, newModel]);

    // Add model to folder structure
    setFolders((prev) => {
      const updateFolders = (items: FolderStructure[]): FolderStructure[] => {
        return items.map((item) => {
          if (item.id === parentFolder.id) {
            return {
              ...item,
              children: [
                ...(item.children || []),
                {
                  id: newModel.id,
                  name: newModel.name,
                  path: newModel.path,
                  type: 'model',
                  modelData: newModel
                }
              ]
            };
          }
          if (item.children) {
            return { ...item, children: updateFolders(item.children) };
          }
          return item;
        });
      };
      return updateFolders(prev);
    });

    // Auto-expand the parent folder
    setExpandedFolders((prev) => new Set([...prev, parentFolder.id]));
  };

  const handleGoBack = () => {
    if (breadcrumbs.length > 1) {
      handleBreadcrumbClick(breadcrumbs.length - 2);
    }
  };

  const getFilteredModels = (): MartModel[] => {
    let filtered = models;

    if (searchTerm) {
      filtered = filtered.filter(
        (model) =>
          model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((model) => model.status === selectedStatus);
    }

    if (viewMode === 'favorites') {
      filtered = filtered.filter((model) => model.isFavorite);
    } else if (viewMode === 'recent') {
      filtered = filtered.filter((model) => model.lastOpened);
    } else if (viewMode === 'folder' && currentFolder) {
      // Filter models by current folder
      filtered = filtered.filter((model) => model.folder === currentFolder.name);
    }

    return filtered;
  };

  const getCurrentFolders = (): FolderStructure[] => {
    if (viewMode !== 'folder') return [];
    if (currentFolder) {
      return currentFolder.children?.filter((item) => item.type === 'folder') || [];
    }
    return folders;
  };

  const getCurrentModels = (): MartModel[] => {
    if (viewMode === 'folder' && currentFolder) {
      const modelIds = currentFolder.children
        ?.filter((item) => item.type === 'model')
        .map((item) => item.id) || [];
      return getFilteredModels().filter((model) => modelIds.includes(model.id));
    }
    return getFilteredModels();
  };

  const filteredModels = getCurrentModels();
  const currentFolders = getCurrentFolders();

  // Recursive tree rendering for list view
  const renderTreeItem = (item: FolderStructure, depth: number = 0): JSX.Element[] => {
    const results: JSX.Element[] = [];

    if (item.type === 'folder') {
      const isExpanded = expandedFolders.has(item.id);

      results.push(
        <FolderCard
          key={item.id}
          folder={item}
          onOpen={handleOpenFolder}
          displayMode="list"
          depth={depth}
          isExpanded={isExpanded}
          onToggleExpand={toggleFolderExpansion}
          onAction={handleFolderAction}
          activeActionMenu={activeActionMenu}
          setActiveActionMenu={setActiveActionMenu}
          onAddSubfolder={handleAddSubfolder}
          onAddModel={handleAddModel}
        />
      );

      // Render children if expanded
      if (isExpanded && item.children) {
        item.children.forEach((child) => {
          results.push(...renderTreeItem(child, depth + 1));
        });
      }
    } else if (item.type === 'model') {
      // Find the model data
      const modelData = models.find((m) => m.id === item.id);
      if (modelData) {
        results.push(
          <ModelCard
            key={item.id}
            model={modelData}
            onOpen={handleOpenModel}
            onToggleFavorite={handleToggleFavorite}
            displayMode="list"
            depth={depth}
            onAction={handleModelAction}
            activeActionMenu={activeActionMenu}
            setActiveActionMenu={setActiveActionMenu}
          />
        );
      }
    }

    return results;
  };

  const renderTreeView = () => {
    const items: JSX.Element[] = [];

    folders.forEach((folder) => {
      items.push(...renderTreeItem(folder, 0));
    });

    return items;
  };

  return (
    <div
      className="h-full flex flex-col bg-zinc-950"
      onClick={() => setActiveActionMenu(null)}
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <div className="p-1.5 bg-violet-500/20 rounded-lg">
                <FolderTree className="w-5 h-5 text-violet-400" />
              </div>
              Mart Catalog
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Browse and manage all models in the mart repository
            </p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setViewMode('folder')}
            className={`px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors ${
              viewMode === 'folder'
                ? 'bg-violet-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            Folder Structure
          </button>
          <button
            onClick={() => setViewMode('favorites')}
            className={`px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors ${
              viewMode === 'favorites'
                ? 'bg-violet-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Favorites
          </button>
          <button
            onClick={() => setViewMode('recent')}
            className={`px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors ${
              viewMode === 'recent'
                ? 'bg-violet-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Recently Opened
          </button>
        </div>

        {/* Toolbar - Windows Explorer Style */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {viewMode === 'folder' && (
              <>
                <button
                  onClick={handleGoBack}
                  disabled={breadcrumbs.length === 1}
                  className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Back"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-100 transition-colors disabled:opacity-30"
                  disabled
                  title="Forward"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-5 bg-zinc-700 mx-1" />
              </>
            )}
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-md text-xs flex items-center gap-1.5 transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              New Folder
            </button>
            <button className="px-2.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-xs flex items-center gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Upload Model
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <select
              className="px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-md text-xs text-zinc-100 focus:outline-none focus:border-violet-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ModelStatus | 'all')}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="locked">Locked</option>
              <option value="checked-out">Checked Out</option>
              <option value="archived">Archived</option>
            </select>
            <button
              className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-100 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-5 bg-zinc-700 mx-0.5" />
            <button
              onClick={() => setDisplayMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                displayMode === 'grid'
                  ? 'bg-violet-600 text-white'
                  : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDisplayMode('list')}
              className={`p-1.5 rounded transition-colors ${
                displayMode === 'list'
                  ? 'bg-violet-600 text-white'
                  : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        {viewMode === 'folder' && (
          <div className="flex items-center gap-2 mb-3 text-xs">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="w-3 h-3 text-zinc-600" />}
                <button
                  onClick={() => handleBreadcrumbClick(index)}
                  className={`px-1.5 py-0.5 rounded hover:bg-zinc-800 transition-colors ${
                    index === breadcrumbs.length - 1
                      ? 'text-zinc-100 font-medium'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {index === 0 && <Home className="w-3 h-3 inline mr-1" />}
                  {crumb.name}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
            placeholder="Search models by name, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {displayMode === 'list' && (
          <div className="bg-zinc-900">
            {/* List Header */}
            <div className="flex items-center px-3 py-2 bg-zinc-800 border-b border-zinc-700 text-xs font-semibold text-zinc-400 sticky top-0 z-10">
              <div className="w-16"></div>
              <div className="flex-1 px-3">Name</div>
              <div className="w-32 px-3">Date Modified</div>
              <div className="w-24 px-3">Status</div>
              <div className="w-24 px-3">Size</div>
              <div className="w-32 px-3">Author</div>
              <div className="w-20 px-3 text-center">Entities</div>
              <div className="w-10"></div>
            </div>

            {/* List Items */}
            {viewMode === 'folder' ? (
              <>
                {renderTreeView()}
                {folders.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-zinc-500">No items to display</div>
                  </div>
                )}
              </>
            ) : (
              <>
                {filteredModels.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    onOpen={handleOpenModel}
                    onToggleFavorite={handleToggleFavorite}
                    displayMode={displayMode}
                    depth={0}
                    onAction={handleModelAction}
                    activeActionMenu={activeActionMenu}
                    setActiveActionMenu={setActiveActionMenu}
                  />
                ))}
                {filteredModels.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-zinc-500">No items to display</div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {displayMode === 'grid' && (
          <div className="p-4">
            {filteredModels.length === 0 && currentFolders.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex p-3 bg-zinc-800 rounded-full mb-3">
                  {viewMode === 'favorites' ? (
                    <Star className="w-6 h-6 text-zinc-600" />
                  ) : viewMode === 'recent' ? (
                    <Clock className="w-6 h-6 text-zinc-600" />
                  ) : (
                    <FolderOpen className="w-6 h-6 text-zinc-600" />
                  )}
                </div>
                <h3 className="text-sm font-semibold text-zinc-300 mb-1">
                  {viewMode === 'favorites'
                    ? 'No Favorites Yet'
                    : viewMode === 'recent'
                    ? 'No Recent Models'
                    : 'No Items'}
                </h3>
                <p className="text-xs text-zinc-500">
                  {viewMode === 'favorites'
                    ? 'Mark models as favorites to quickly access them here'
                    : viewMode === 'recent'
                    ? 'Models you open will appear here for quick access'
                    : 'This folder is empty'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                {currentFolders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    onOpen={handleOpenFolder}
                    displayMode={displayMode}
                  />
                ))}
                {filteredModels.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    onOpen={handleOpenModel}
                    onToggleFavorite={handleToggleFavorite}
                    displayMode={displayMode}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span>Total: {models.length}</span>
            <span>Favorites: {models.filter((m) => m.isFavorite).length}</span>
            <span>Active: {models.filter((m) => m.status === 'active').length}</span>
          </div>
          <div className="text-zinc-400">
            {currentFolders.length + filteredModels.length} item
            {currentFolders.length + filteredModels.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* New Folder Modal */}
      <NewFolderModal
        isOpen={showNewFolderModal}
        onClose={() => {
          setShowNewFolderModal(false);
          setSelectedParentFolder(null);
        }}
        onConfirm={handleCreateFolder}
        parentFolderName={selectedParentFolder?.name || currentFolder?.name}
      />
    </div>
  );
}
