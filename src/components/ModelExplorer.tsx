'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  Database,
  Table,
  Key,
  Link,
  Box,
  Grid,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Move,
  MousePointer,
  Square,
  Circle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  Edit3,
  Save,
  Folder,
  FolderOpen,
  Target,
  Map,
  Activity,
  Zap,
  Filter,
  SortAsc,
  MoreHorizontal,
  X,
  Download,
  Upload,
  Share2,
  Printer,
  RefreshCw,
  Undo2,
  Redo2,
  Scissors,
  ClipboardCopy,
  ClipboardPaste,
  AlignLeft,
  AlignCenter,
  Type,
  Layers,
  BookOpen,
  HelpCircle,
  Info,
  ClipboardList,
  Palette,
  BarChart3,
  Link2,
  FileText,
  Settings,
  ChevronUp,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  CheckSquare,
  Radio,
  Hash,
  Bell,
  Sun,
  Moon,
  User,
  FolderPlus,
  FilePlus,
  GitBranch,
  PenTool,
  Users,
  GitMerge,
  LayoutGrid,
  AlignJustify,
  FileCode,
  Import,
  MessageCircle,
  Shield,
  FileCode2,
  Workflow,
  Component,
  Archive,
  Network,
  TreePine,
  Globe,
  Server,
  Command,
  CreditCard,
  Crown,
  UserPlus,
  KeyRound,
  ToggleLeft,
  ToggleRight,
  Cpu,
  Monitor
} from 'lucide-react';

// Linear.app-inspired Premium UI Color Theme
const theme = {
  light: {
    pageBackground: '#F9FAFB',
    panelBackground: '#FFFFFF',
    headerBackground: '#FFFFFF',
    accent: '#6366F1',
    primaryText: '#111827',
    secondaryText: '#6B7280',
    borders: '#E5E7EB',
    floatingToolbar: '#FFFFFF',
    hoverBackground: '#F3F4F6',
    activeBackground: '#EEF2FF'
  },
  dark: {
    pageBackground: '#181818',
    panelBackground: '#242424',
    headerBackground: '#1F1F1F',
    accent: '#818CF8',
    primaryText: '#E4E4E4',
    secondaryText: '#A1A1AA',
    borders: '#3A3A3A',
    floatingToolbar: '#2C2C2C',
    hoverBackground: '#2F2F2F',
    activeBackground: '#374151'
  }
};

// Types for Model Explorer
interface Entity {
  id: string;
  name: string;
  type: 'table' | 'view' | 'procedure';
  attributes: Attribute[];
  relationships: string[];
  position: { x: number; y: number };
}

interface Attribute {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isNullable: boolean;
  defaultValue?: string;
}

interface Diagram {
  id: string;
  name: string;
  entities: Entity[];
  created: string;
  modified: string;
}

interface Model {
  id: string;
  name: string;
  description: string;
  diagrams: Diagram[];
  created: string;
  modified: string;
  status: 'active' | 'locked' | 'readonly';
  targetDatabase: 'sqlserver' | 'oracle' | 'mysql' | 'postgresql' | 'db2' | 'sqlite';
}

// Database type icons mapping
const getDatabaseIcon = (dbType: string) => {
  const iconProps = { className: "w-4 h-4" };
  switch (dbType) {
    case 'sqlserver':
      return <Monitor {...iconProps} style={{ color: '#00BCF2' }} />;
    case 'oracle':
      return <Server {...iconProps} style={{ color: '#F80000' }} />;
    case 'mysql':
      return <Server {...iconProps} style={{ color: '#00758F' }} />;
    case 'postgresql':
      return <Cpu {...iconProps} style={{ color: '#336791' }} />;
    case 'db2':
      return <Database {...iconProps} style={{ color: '#1F70C1' }} />;
    case 'sqlite':
      return <Server {...iconProps} style={{ color: '#7DD3FC' }} />;
    default:
      return <Database {...iconProps} />;
  }
};

// Header Bar Component
const HeaderBar = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hasNotifications, setHasNotifications] = useState(true);

  // Mock model data
  const currentModel = {
    name: 'E-Commerce Platform',
    targetDatabase: 'sqlserver' as const
  };

  return (
    <div className={`h-10 px-4 flex items-center justify-between border-b ${
      isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
    } shadow-sm transition-colors`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Left: Logo and Model Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center shadow-sm">
            <Database className="w-4 h-4 text-white" />
          </div>
          <span className={`font-semibold text-sm tracking-tight ${isDark ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontWeight: 600 }}>
            DMPro
          </span>
        </div>
        <div className={`h-4 w-px ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />
        <div className="flex items-center gap-1.5">
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Model:</span>
          <div className="flex items-center gap-1">
            {getDatabaseIcon(currentModel.targetDatabase)}
            <span className={`text-xs font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              {currentModel.name}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex items-center justify-center max-w-md mx-auto">
        <div className="relative w-full">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search models, entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-8 pr-3 py-1 w-full text-xs rounded-md border ${
              isDark
                ? 'bg-zinc-800 border-zinc-700 text-gray-100 placeholder-gray-400 focus:bg-zinc-750'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white'
            } focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200`}
          />
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Notification Button */}
        <button
          className={`relative p-1.5 rounded-lg transition-all duration-200 ${
            isDark ? 'hover:bg-zinc-800 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {hasNotifications && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-1.5 rounded-lg transition-all duration-200 ${
            isDark ? 'hover:bg-zinc-800 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Profile Button */}
        <button
          className={`p-1.5 rounded-lg transition-all duration-200 ${
            isDark ? 'hover:bg-zinc-800 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title="Profile"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Main Tabs Component
const MainTabs = ({ isDark, activeTab, setActiveTab }: { isDark: boolean; activeTab: string; setActiveTab: (tab: string) => void }) => {

  const tabs = [
    { id: 'file', label: 'File' },
    { id: 'home', label: 'Home' },
    { id: 'view', label: 'View' },
    { id: 'diagram', label: 'Diagram' },
    { id: 'actions', label: 'Actions' },
    { id: 'tools', label: 'Tools' },
    { id: 'help', label: 'Help' }
  ];

  return (
    <div className={`h-10 px-4 flex items-center border-b ${
      isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
    } transition-colors`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="flex items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-all duration-200 ${
              activeTab === tab.id
                ? `${isDark ? 'bg-zinc-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`
                : `${isDark ? 'text-gray-400 hover:text-gray-100 hover:bg-zinc-800/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'}`
            }`}
            style={{ fontWeight: activeTab === tab.id ? 600 : 500 }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Contextual Toolbar Component
const ContextualToolbar = ({ isDark, activeTab, isPhysicalView, setIsPhysicalView }: {
  isDark: boolean;
  activeTab: string;
  isPhysicalView: boolean;
  setIsPhysicalView: (value: boolean) => void;
}) => {
  const menuItems = {
    file: [
      { icon: <FolderOpen className="w-4 h-4" />, label: 'Open', shortcut: 'Ctrl+O' },
      { icon: <Save className="w-4 h-4" />, label: 'Save', shortcut: 'Ctrl+S' },
      { icon: <Download className="w-4 h-4" />, label: 'Save As', shortcut: 'Ctrl+Shift+S' },
      { icon: <FilePlus className="w-4 h-4" />, label: 'New Model', shortcut: 'Ctrl+N' }
    ],
    home: [
      { icon: <Plus className="w-4 h-4" />, label: 'Add Entity' },
      { icon: <FolderPlus className="w-4 h-4" />, label: 'Add Sub Category' },
      { icon: <GitBranch className="w-4 h-4" />, label: 'Identifying Relationship' },
      { icon: <Link className="w-4 h-4" />, label: 'Non-Identifying Relationship' },
      { icon: <GitMerge className="w-4 h-4" />, label: 'Many to Many' },
      { icon: <PenTool className="w-4 h-4" />, label: 'Annotations' },
      { icon: <Square className="w-4 h-4" />, label: 'Rectangle' },
      { icon: <Circle className="w-4 h-4" />, label: 'Circle' }
    ],
    view: [
      { icon: <Table className="w-4 h-4" />, label: 'Entity View' },
      { icon: <Layers className="w-4 h-4" />, label: 'Attribute View' },
      { icon: <Key className="w-4 h-4" />, label: 'PK View' },
      { icon: <Lock className="w-4 h-4" />, label: 'Key View' },
      { icon: <FileText className="w-4 h-4" />, label: 'Definition View' },
      { icon: <LayoutGrid className="w-4 h-4" />, label: 'Icons View' },
      { icon: <ZoomIn className="w-4 h-4" />, label: 'Zoom In' },
      { icon: <ZoomOut className="w-4 h-4" />, label: 'Zoom Out' },
      { icon: <Maximize2 className="w-4 h-4" />, label: 'Fit to Screen' }
    ],
    diagram: [
      { icon: <Plus className="w-4 h-4" />, label: 'New Diagram' },
      { icon: <Trash2 className="w-4 h-4" />, label: 'Delete Diagram' },
      { icon: <AlignLeft className="w-4 h-4" />, label: 'Align Left' },
      { icon: <AlignJustify className="w-4 h-4" />, label: 'Align Right' },
      { icon: <AlignCenter className="w-4 h-4" />, label: 'Align Center' },
      { icon: <Box className="w-4 h-4" />, label: 'Align Top' },
      { icon: <LayoutGrid className="w-4 h-4" />, label: 'Align Middle' },
      { icon: <AlignJustify className="w-4 h-4" />, label: 'Align Bottom' },
      { icon: <Layers className="w-4 h-4" />, label: 'Group' },
      { icon: <Layers className="w-4 h-4" />, label: 'Ungroup' },
      { icon: <Layers className="w-4 h-4" />, label: 'Layout' },
      { icon: <EyeOff className="w-4 h-4" />, label: 'Hide' },
      { icon: <Users className="w-4 h-4" />, label: 'Hide Neighborhood' },
      { icon: <Eye className="w-4 h-4" />, label: 'Unhide' }
    ],
    actions: [
      { icon: <RefreshCw className="w-4 h-4" />, label: 'Complete Compare' },
      { icon: <Upload className="w-4 h-4" />, label: 'Reverse Engineering' },
      { icon: <Download className="w-4 h-4" />, label: 'Forward Engineering' }
    ],
    tools: [
      { icon: <Type className="w-4 h-4" />, label: 'Naming Standards' },
      { icon: <Database className="w-4 h-4" />, label: 'Datatype Standards' },
      { icon: <FileCode className="w-4 h-4" />, label: 'Report' },
      { icon: <Import className="w-4 h-4" />, label: 'Import' }
    ],
    help: [
      { icon: <BookOpen className="w-4 h-4" />, label: 'Help Topics' },
      { icon: <Zap className="w-4 h-4" />, label: "What's New" },
      { icon: <MessageCircle className="w-4 h-4" />, label: 'Support' },
      { icon: <BookOpen className="w-4 h-4" />, label: 'Training' },
      { icon: <Users className="w-4 h-4" />, label: 'Community' },
      { icon: <Shield className="w-4 h-4" />, label: 'License' },
      { icon: <Info className="w-4 h-4" />, label: 'About' }
    ]
  };

  const toolbarItems = menuItems[activeTab as keyof typeof menuItems] || [];

  return (
    <div className={`h-12 px-4 flex items-center gap-1 border-b ${
      isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-50 border-gray-200'
    } transition-colors`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {toolbarItems.map((item, index) => (
        <button
          key={index}
          className={`group relative p-2 rounded-lg transition-all duration-200 ${
            isDark
              ? 'hover:bg-zinc-800 text-gray-400 hover:text-gray-200'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title={item.label}
        >
          {item.icon}
          <span className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 ${
            isDark ? 'bg-zinc-700 text-gray-200' : 'bg-gray-800 text-white'
          }`}>
            {item.label}
            {(item as any).shortcut && <span className="ml-2 opacity-60">{(item as any).shortcut}</span>}
          </span>
        </button>
      ))}

      {/* Physical/Logical Toggle - Right Side */}
      <div className="ml-auto flex items-center">
        <div className={`flex items-center rounded-lg p-1 ${
          isDark ? 'bg-zinc-800' : 'bg-gray-200'
        }`}>
          <button
            onClick={() => setIsPhysicalView(false)}
            className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-all ${
              !isPhysicalView
                ? isDark
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'bg-white text-gray-900 shadow-sm'
                : isDark
                  ? 'text-zinc-400 hover:text-zinc-200'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-3 h-3" />
            Logical
          </button>
          <button
            onClick={() => setIsPhysicalView(true)}
            className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-all ${
              isPhysicalView
                ? isDark
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'bg-white text-gray-900 shadow-sm'
                : isDark
                  ? 'text-zinc-400 hover:text-zinc-200'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Server className="w-3 h-3" />
            Physical
          </button>
        </div>
      </div>
    </div>
  );
};

// Model Tree Component
const ModelTree = ({ isDark, isCollapsed, onToggle, isPhysicalView }: {
  isDark: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  isPhysicalView: boolean;
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['model-root', 'model-properties', 'entities-tables', 'relationships']));
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuType, setContextMenuType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleAddNew = (type: string, parentId: string) => {
    setAddModalType(type);
    setShowAddModal(true);
  };

  const handleShowMenu = (e: React.MouseEvent, type: string, id: string) => {
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuType(type);
    setShowContextMenu(true);
  };

  const treeData = [
    {
      id: 'model-root',
      label: 'E-Commerce Platform',
      icon: <Database className="w-4 h-4 text-blue-500" />,
      type: 'model',
      canAddNew: true,
      hasMenu: true,
      children: [
        {
          id: 'model-properties',
          label: 'Model Properties',
          icon: <Settings className="w-4 h-4 text-gray-500" />,
          type: 'folder',
          hasMenu: true
        },
        {
          id: 'subject-areas',
          label: 'Subject Areas',
          icon: <Component className="w-4 h-4 text-purple-500" />,
          type: 'folder',
          canAddNew: true,
          children: [
            {
              id: 'sa-customer-mgmt',
              label: 'Customer Management',
              icon: <Box className="w-4 h-4 text-purple-400" />,
              type: 'subject-area',
              hasMenu: true
            },
            {
              id: 'sa-order-processing',
              label: 'Order Processing',
              icon: <Box className="w-4 h-4 text-purple-400" />,
              type: 'subject-area',
              hasMenu: true
            }
          ]
        },
        {
          id: 'diagrams-root',
          label: 'Diagrams',
          icon: <Workflow className="w-4 h-4 text-blue-500" />,
          type: 'folder',
          canAddNew: true,
          children: [
            {
              id: 'logical-diagrams',
              label: 'Logical Diagram(s)',
              icon: <FileText className="w-4 h-4 text-green-500" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'diagram-logical-main',
                  label: 'Main Logical Model',
                  icon: <FileText className="w-4 h-4 text-green-400" />,
                  type: 'diagram',
                  hasMenu: true
                }
              ]
            },
            {
              id: 'physical-diagrams',
              label: 'Physical Diagram(s)',
              icon: <FileText className="w-4 h-4 text-orange-500" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'diagram-physical-main',
                  label: 'Main Physical Model',
                  icon: <FileText className="w-4 h-4 text-orange-400" />,
                  type: 'diagram',
                  hasMenu: true
                }
              ]
            }
          ]
        },
        {
          id: 'domains',
          label: 'Domains',
          icon: <Type className="w-4 h-4 text-blue-500" />,
          type: 'folder',
          canAddNew: true,
          children: [
            {
              id: 'domain-email',
              label: 'EmailAddress',
              icon: <Type className="w-4 h-4 text-blue-400" />,
              type: 'domain',
              hasMenu: true
            },
            {
              id: 'domain-currency',
              label: 'Currency',
              icon: <Type className="w-4 h-4 text-blue-400" />,
              type: 'domain',
              hasMenu: true
            }
          ]
        },
        {
          id: 'entities-tables',
          label: isPhysicalView ? 'Tables' : 'Entities',
          icon: <Database className="w-4 h-4 text-purple-500" />,
          type: 'folder',
          canAddNew: true,
          children: [
            {
              id: 'entity-table-list',
              label: isPhysicalView ? 'Table list' : 'Entity list',
              icon: <LayoutGrid className="w-4 h-4 text-purple-400" />,
              type: 'folder',
              children: [
                {
                  id: 'entity-customer',
                  label: 'Customer',
                  icon: <Box className="w-4 h-4 text-purple-500" />,
                  type: 'entity',
                  hasMenu: true,
                  children: [
                    {
                      id: 'customer-attributes',
                      label: isPhysicalView ? 'Columns' : 'Attributes',
                      icon: <Hash className="w-4 h-4 text-gray-500" />,
                      type: 'folder',
                      children: [
                        {
                          id: 'customer-pk',
                          label: 'Primary Keys (PK)',
                          icon: <Key className="w-4 h-4 text-yellow-500" />,
                          type: 'folder',
                          children: [
                            {
                              id: 'attr-customer-id',
                              label: 'customer_id',
                              icon: <Key className="w-3.5 h-3.5 text-yellow-500" />,
                              type: 'attribute',
                              hasMenu: true
                            }
                          ]
                        },
                        {
                          id: 'customer-fk',
                          label: 'Foreign Keys (FK)',
                          icon: <Link className="w-4 h-4 text-blue-500" />,
                          type: 'folder',
                          children: []
                        },
                        {
                          id: 'customer-other',
                          label: 'Other attributes',
                          icon: <Hash className="w-4 h-4 text-gray-500" />,
                          type: 'folder',
                          children: [
                            {
                              id: 'attr-first-name',
                              label: 'first_name',
                              icon: <Hash className="w-3.5 h-3.5 text-gray-500" />,
                              type: 'attribute',
                              hasMenu: true
                            },
                            {
                              id: 'attr-email',
                              label: 'email',
                              icon: <Hash className="w-3.5 h-3.5 text-gray-500" />,
                              type: 'attribute',
                              hasMenu: true
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 'entity-order',
                  label: 'Order',
                  icon: <Box className="w-4 h-4 text-purple-500" />,
                  type: 'entity',
                  hasMenu: true,
                  children: [
                    {
                      id: 'order-attributes',
                      label: isPhysicalView ? 'Columns' : 'Attributes',
                      icon: <Hash className="w-4 h-4 text-gray-500" />,
                      type: 'folder',
                      children: [
                        {
                          id: 'order-pk',
                          label: 'Primary Keys (PK)',
                          icon: <Key className="w-4 h-4 text-yellow-500" />,
                          type: 'folder',
                          children: [
                            {
                              id: 'attr-order-id',
                              label: 'order_id',
                              icon: <Key className="w-3.5 h-3.5 text-yellow-500" />,
                              type: 'attribute',
                              hasMenu: true
                            }
                          ]
                        },
                        {
                          id: 'order-fk',
                          label: 'Foreign Keys (FK)',
                          icon: <Link className="w-4 h-4 text-blue-500" />,
                          type: 'folder',
                          children: [
                            {
                              id: 'attr-customer-fk',
                              label: 'customer_id',
                              icon: <Link className="w-3.5 h-3.5 text-blue-500" />,
                              type: 'attribute',
                              hasMenu: true
                            }
                          ]
                        },
                        {
                          id: 'order-other',
                          label: 'Other attributes',
                          icon: <Hash className="w-4 h-4 text-gray-500" />,
                          type: 'folder',
                          children: [
                            {
                              id: 'attr-order-date',
                              label: 'order_date',
                              icon: <Hash className="w-3.5 h-3.5 text-gray-500" />,
                              type: 'attribute',
                              hasMenu: true
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'relationships',
          label: 'Relationships',
          icon: <GitBranch className="w-4 h-4 text-green-500" />,
          type: 'folder',
          canAddNew: true,
          children: [
            {
              id: 'identifying-rel',
              label: 'Identifying',
              icon: <GitBranch className="w-4 h-4 text-green-600" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'rel-customer-order',
                  label: 'Customer_Order',
                  icon: <GitBranch className="w-4 h-4 text-green-500" />,
                  type: 'relationship',
                  hasMenu: true
                }
              ]
            },
            {
              id: 'non-identifying-rel',
              label: 'Non-identifying',
              icon: <GitMerge className="w-4 h-4 text-green-600" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'rel-order-product',
                  label: 'Order_Product',
                  icon: <GitMerge className="w-4 h-4 text-green-500" />,
                  type: 'relationship',
                  hasMenu: true
                }
              ]
            },
            {
              id: 'many-to-many-rel',
              label: 'Many-to-Many',
              icon: <Network className="w-4 h-4 text-green-600" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'rel-product-category',
                  label: 'Product_Category',
                  icon: <Network className="w-4 h-4 text-green-500" />,
                  type: 'relationship',
                  hasMenu: true
                }
              ]
            }
          ]
        },
        {
          id: 'views',
          label: 'Views',
          icon: <Eye className="w-4 h-4 text-cyan-500" />,
          type: 'folder',
          canAddNew: true,
          children: [
            {
              id: 'logical-views',
              label: 'Logical views',
              icon: <Eye className="w-4 h-4 text-cyan-600" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'view-customer-summary',
                  label: 'CustomerSummary',
                  icon: <Eye className="w-4 h-4 text-cyan-500" />,
                  type: 'view',
                  hasMenu: true
                }
              ]
            },
            {
              id: 'physical-views',
              label: 'Physical views (SQL)',
              icon: <FileCode className="w-4 h-4 text-cyan-600" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'view-customer-orders',
                  label: 'VW_CUSTOMER_ORDERS',
                  icon: <FileCode className="w-4 h-4 text-cyan-500" />,
                  type: 'view',
                  hasMenu: true
                }
              ]
            }
          ]
        },
        {
          id: 'sequences-procedures-triggers',
          label: 'Sequences / Procedures / Triggers',
          icon: <Zap className="w-4 h-4 text-red-500" />,
          type: 'folder',
          canAddNew: true,
          children: [
            {
              id: 'sequences',
              label: 'Sequences',
              icon: <Hash className="w-4 h-4 text-purple-600" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'seq-customer-id',
                  label: 'SEQ_CUSTOMER_ID',
                  icon: <Hash className="w-4 h-4 text-purple-500" />,
                  type: 'sequence',
                  hasMenu: true
                }
              ]
            },
            {
              id: 'stored-procedures',
              label: 'Stored Procedures',
              icon: <Command className="w-4 h-4 text-red-600" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'proc-get-orders',
                  label: 'SP_GET_CUSTOMER_ORDERS',
                  icon: <Command className="w-4 h-4 text-red-500" />,
                  type: 'procedure',
                  hasMenu: true
                }
              ]
            },
            {
              id: 'triggers',
              label: 'Triggers',
              icon: <Zap className="w-4 h-4 text-yellow-600" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'trigger-audit',
                  label: 'TRG_CUSTOMER_AUDIT',
                  icon: <Zap className="w-4 h-4 text-yellow-500" />,
                  type: 'trigger',
                  hasMenu: true
                }
              ]
            }
          ]
        },
        {
          id: 'users-roles',
          label: 'Users / Roles',
          icon: <Users className="w-4 h-4 text-indigo-500" />,
          type: 'folder',
          canAddNew: true,
          children: [
            {
              id: 'users',
              label: 'Users',
              icon: <User className="w-4 h-4 text-indigo-600" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'user-admin',
                  label: 'db_admin',
                  icon: <Crown className="w-4 h-4 text-indigo-500" />,
                  type: 'user',
                  hasMenu: true
                },
                {
                  id: 'user-app',
                  label: 'app_user',
                  icon: <User className="w-4 h-4 text-indigo-500" />,
                  type: 'user',
                  hasMenu: true
                }
              ]
            },
            {
              id: 'roles',
              label: 'Roles',
              icon: <UserPlus className="w-4 h-4 text-indigo-600" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'role-admin',
                  label: 'ADMIN_ROLE',
                  icon: <Crown className="w-4 h-4 text-indigo-500" />,
                  type: 'role',
                  hasMenu: true
                },
                {
                  id: 'role-read',
                  label: 'READ_ONLY_ROLE',
                  icon: <Eye className="w-4 h-4 text-indigo-500" />,
                  type: 'role',
                  hasMenu: true
                }
              ]
            },
            {
              id: 'permissions',
              label: 'Permissions',
              icon: <KeyRound className="w-4 h-4 text-indigo-600" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'perm-select',
                  label: 'SELECT_PERMISSION',
                  icon: <Eye className="w-4 h-4 text-indigo-500" />,
                  type: 'permission',
                  hasMenu: true
                },
                {
                  id: 'perm-insert',
                  label: 'INSERT_PERMISSION',
                  icon: <Plus className="w-4 h-4 text-indigo-500" />,
                  type: 'permission',
                  hasMenu: true
                }
              ]
            }
          ]
        },
        {
          id: 'other-objects',
          label: 'Other Objects (depending on DBMS)',
          icon: <Server className="w-4 h-4 text-gray-500" />,
          type: 'folder',
          canAddNew: true,
          children: [
            {
              id: 'indexes',
              label: 'Indexes',
              icon: <Search className="w-4 h-4 text-yellow-600" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'idx-customer-email',
                  label: 'IDX_CUSTOMER_EMAIL',
                  icon: <Search className="w-4 h-4 text-yellow-500" />,
                  type: 'index',
                  hasMenu: true
                }
              ]
            },
            {
              id: 'constraints',
              label: 'Constraints',
              icon: <Lock className="w-4 h-4 text-red-600" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'chk-email-format',
                  label: 'CHK_EMAIL_FORMAT',
                  icon: <Lock className="w-4 h-4 text-red-500" />,
                  type: 'constraint',
                  hasMenu: true
                }
              ]
            },
            {
              id: 'synonyms',
              label: 'Synonyms',
              icon: <Link2 className="w-4 h-4 text-purple-600" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'syn-customer',
                  label: 'SYN_CUSTOMER',
                  icon: <Link2 className="w-4 h-4 text-purple-500" />,
                  type: 'synonym',
                  hasMenu: true
                }
              ]
            },
            {
              id: 'schemas',
              label: 'Schemas',
              icon: <Folder className="w-4 h-4 text-blue-600" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'schema-public',
                  label: 'PUBLIC',
                  icon: <Globe className="w-4 h-4 text-blue-500" />,
                  type: 'schema',
                  hasMenu: true
                },
                {
                  id: 'schema-app',
                  label: 'APP_SCHEMA',
                  icon: <Folder className="w-4 h-4 text-blue-500" />,
                  type: 'schema',
                  hasMenu: true
                }
              ]
            },
            {
              id: 'tablespaces-storage',
              label: 'Tablespaces / Storage',
              icon: <Server className="w-4 h-4 text-gray-600" />,
              type: 'folder',
              canAddNew: true,
              children: [
                {
                  id: 'ts-data',
                  label: 'DATA_TABLESPACE',
                  icon: <Server className="w-4 h-4 text-gray-500" />,
                  type: 'tablespace',
                  hasMenu: true
                },
                {
                  id: 'ts-index',
                  label: 'INDEX_TABLESPACE',
                  icon: <Archive className="w-4 h-4 text-gray-500" />,
                  type: 'tablespace',
                  hasMenu: true
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  // Filter tree items based on search term
  const filterTreeItems = (items: any[], searchTerm: string): any[] => {
    if (!searchTerm) return items;

    const filtered: any[] = [];

    for (const item of items) {
      const matchesSearch = item.label.toLowerCase().includes(searchTerm.toLowerCase());
      const filteredChildren = item.children ? filterTreeItems(item.children, searchTerm) : [];

      if (matchesSearch || filteredChildren.length > 0) {
        filtered.push({
          ...item,
          children: filteredChildren
        });
      }
    }

    return filtered;
  };

  // Auto-expand items when searching
  const getExpandedItemsForSearch = (items: any[], searchTerm: string, expandedSet: Set<string>): Set<string> => {
    if (!searchTerm) return expandedSet;

    const newExpanded = new Set(expandedSet);

    const addExpandedItems = (treeItems: any[]) => {
      for (const item of treeItems) {
        if (item.children && item.children.length > 0) {
          const hasMatchingChild = item.children.some((child: any) =>
            child.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (child.children && child.children.length > 0)
          );

          if (hasMatchingChild || item.label.toLowerCase().includes(searchTerm.toLowerCase())) {
            newExpanded.add(item.id);
          }

          addExpandedItems(item.children);
        }
      }
    };

    addExpandedItems(items);
    return newExpanded;
  };

  const filteredTreeData = filterTreeItems(treeData, searchTerm);

  // Update expanded items when searching
  const effectiveExpandedItems = searchTerm
    ? getExpandedItemsForSearch(treeData, searchTerm, expandedItems)
    : expandedItems;

  const TreeItem = ({
    id,
    label,
    icon,
    children,
    level = 0,
    type = 'folder',
    canAddNew = false,
    hasMenu = false
  }: {
    id: string;
    label: string;
    icon: React.ReactNode;
    children?: any[];
    level?: number;
    type?: 'folder' | 'model' | 'entity' | 'attribute' | 'relationship' | 'domain' | 'table' | 'view' | 'procedure';
    canAddNew?: boolean;
    hasMenu?: boolean;
  }) => {
    const isExpanded = effectiveExpandedItems.has(id);
    const hasChildren = children && children.length > 0;
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div>
        <div
          className={`group flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer transition-all duration-200 ${
            isDark
              ? 'text-gray-300 hover:text-gray-100 hover:bg-zinc-800/70'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'
          }`}
          style={{ paddingLeft: `${8 + level * 16}px`, fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 400 }}
          onClick={() => hasChildren && toggleExpanded(id)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            )
          ) : (
            <div className="w-3.5 h-3.5 flex-shrink-0" />
          )}
          <div className="flex-shrink-0">{icon}</div>
          <span className="flex-1 truncate">{label}</span>

          {/* Hover Controls */}
          {(isHovered || canAddNew || hasMenu) && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {canAddNew && (
                <button
                  className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                    isDark ? 'hover:bg-white' : 'hover:bg-black'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddNew(type, id);
                  }}
                  title="Add New"
                >
                  <Plus className="w-3 h-3" />
                </button>
              )}
              {hasMenu && (
                <button
                  className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                    isDark ? 'hover:bg-white' : 'hover:bg-black'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowMenu(e, type, id);
                  }}
                  title="Options"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {children.map((child) => (
              <TreeItem key={child.id} {...child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${isCollapsed ? 'w-12' : 'w-80'} h-full border-r overflow-y-auto transition-all duration-300 ${
      isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
    }`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontWeight: 600 }}>
              Model Tree
            </h3>
          )}
          <button
            onClick={onToggle}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              isDark ? 'hover:bg-zinc-800 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            title={isCollapsed ? 'Expand Tree' : 'Collapse Tree'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronUp className="w-4 h-4 rotate-90" />}
          </button>
        </div>
        {!isCollapsed && (
          <>
            {/* Search Box */}
            <div className="mb-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search tree..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg border transition-all duration-200 ${
                    isDark
                      ? 'bg-zinc-800 border-zinc-700 text-gray-100 placeholder-gray-500 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                />
              </div>
            </div>

            {/* Tree Items */}
            <div className="space-y-1">
              {filteredTreeData.map((item) => (
                <TreeItem key={item.id} {...item} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowContextMenu(false)}
          />
          <div
            className={`fixed z-50 min-w-48 py-2 rounded-lg shadow-xl border ${
              isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'
            }`}
            style={{
              left: contextMenuPosition.x,
              top: contextMenuPosition.y,
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
            <div className={`px-3 py-1.5 text-xs font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {contextMenuType.charAt(0).toUpperCase() + contextMenuType.slice(1)} Options
            </div>
            <div className="border-t border-zinc-700 my-1" />
            <button className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-opacity-10 transition-colors ${
              isDark ? 'text-gray-300 hover:bg-white' : 'text-gray-700 hover:bg-black'
            }`}>
              <Edit3 className="w-4 h-4" />
              Edit Properties
            </button>
            <button className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-opacity-10 transition-colors ${
              isDark ? 'text-gray-300 hover:bg-white' : 'text-gray-700 hover:bg-black'
            }`}>
              <Copy className="w-4 h-4" />
              Duplicate
            </button>
            <button className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-opacity-10 transition-colors ${
              isDark ? 'text-gray-300 hover:bg-white' : 'text-gray-700 hover:bg-black'
            }`}>
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </>
      )}

      {/* Add New Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowAddModal(false)}
          />
          <div className={`relative w-96 p-6 rounded-lg shadow-xl ${
            isDark ? 'bg-zinc-900' : 'bg-white'
          }`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Add New {addModalType.charAt(0).toUpperCase() + addModalType.slice(1)}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className={`p-1 rounded-lg hover:bg-opacity-10 transition-colors ${
                  isDark ? 'hover:bg-white text-gray-400' : 'hover:bg-black text-gray-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Name
                </label>
                <input
                  type="text"
                  placeholder={`Enter ${addModalType} name`}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark ? 'bg-zinc-800 border-zinc-700 text-gray-100 placeholder-gray-500'
                           : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    isDark ? 'border-zinc-600 text-gray-300 hover:bg-zinc-800'
                           : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Floating Toolbar Component
const FloatingToolbar = ({ isDark }: { isDark: boolean }) => {
  return (
    <div className={`absolute top-6 left-6 flex items-center gap-1 p-1.5 rounded-xl shadow-lg backdrop-blur-sm border ${
      isDark ? 'bg-zinc-800/90 border-zinc-700' : 'bg-white/90 border-gray-200'
    }`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <button className={`p-2.5 rounded-lg hover:scale-105 transition-all duration-200 ${
        isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
      }`}>
        <MousePointer className="w-4 h-4" />
      </button>
      <button className={`p-2.5 rounded-lg hover:scale-105 transition-all duration-200 ${
        isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
      }`}>
        <Move className="w-4 h-4" />
      </button>
      <button className={`p-2.5 rounded-lg hover:scale-105 transition-all duration-200 ${
        isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
      }`}>
        <Square className="w-4 h-4" />
      </button>
      <button className={`p-2.5 rounded-lg hover:scale-105 transition-all duration-200 ${
        isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
      }`}>
        <ArrowRight className="w-4 h-4" />
      </button>
      <div className={`w-px h-6 mx-1 ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />
      <button className={`p-2.5 rounded-lg hover:scale-105 transition-all duration-200 ${
        isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
      }`}>
        <ZoomIn className="w-4 h-4" />
      </button>
      <button className={`p-2.5 rounded-lg hover:scale-105 transition-all duration-200 ${
        isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
      }`}>
        <ZoomOut className="w-4 h-4" />
      </button>
      <button className={`p-2.5 rounded-lg hover:scale-105 transition-all duration-200 ${
        isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
      }`}>
        <Maximize2 className="w-4 h-4" />
      </button>
    </div>
  );
};

// Mini Map Component
const MiniMap = ({ isDark }: { isDark: boolean }) => {
  return (
    <div className={`absolute bottom-6 right-6 w-52 h-36 rounded-xl border shadow-xl backdrop-blur-sm ${
      isDark ? 'bg-zinc-800/90 border-zinc-700' : 'bg-white/90 border-gray-200'
    }`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>
            Mini Map
          </span>
          <button className={`p-1.5 rounded-lg hover:scale-105 transition-all duration-200 ${
            isDark ? 'hover:bg-zinc-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          }`}>
            <X className="w-3 h-3" />
          </button>
        </div>
        <div className={`w-full h-24 rounded-lg border-2 border-dashed relative transition-colors ${
          isDark ? 'border-zinc-600 bg-zinc-900/50' : 'border-gray-300 bg-gray-50/50'
        }`}>
          {/* Viewport indicator */}
          <div className="absolute top-2 left-2 w-10 h-7 border-2 border-indigo-500 bg-indigo-500/20 rounded-md shadow-sm"></div>
          {/* Mock entities with improved styling */}
          <div className={`absolute top-1 right-1 w-4 h-3 rounded-md shadow-sm ${isDark ? 'bg-purple-400' : 'bg-purple-500'}`}></div>
          <div className={`absolute bottom-1 left-1 w-5 h-3 rounded-md shadow-sm ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
          <div className={`absolute bottom-1 right-2 w-4 h-3 rounded-md shadow-sm ${isDark ? 'bg-green-400' : 'bg-green-500'}`}></div>
        </div>
      </div>
    </div>
  );
};

// Diagram Canvas Component
const DiagramCanvas = ({ isDark }: { isDark: boolean }) => {
  const [activeModel, setActiveModel] = useState('model-1');
  const [activeDiagram, setActiveDiagram] = useState('diagram-1');

  const models = [
    { id: 'model-1', name: 'E-Commerce Platform' },
    { id: 'model-2', name: 'Customer Management' }
  ];

  const diagrams = [
    { id: 'diagram-1', name: 'Logical Model', modelId: 'model-1' },
    { id: 'diagram-2', name: 'Physical Model', modelId: 'model-1' },
    { id: 'diagram-3', name: 'Overview', modelId: 'model-2' }
  ];

  const activeModelDiagrams = diagrams.filter(d => d.modelId === activeModel);

  return (
    <div className="flex-1 flex flex-col">
      {/* Model Tabs */}
      <div className={`flex items-center gap-1 px-3 py-2 border-b transition-colors ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-50 border-gray-200'
      }`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => setActiveModel(model.id)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-all duration-200 shadow-sm ${
              activeModel === model.id
                ? `${isDark ? 'bg-zinc-800 text-indigo-400 border border-zinc-700' : 'bg-white text-indigo-600 shadow-md border border-indigo-200'}`
                : `${isDark ? 'text-gray-400 hover:text-gray-100 border border-transparent' : 'text-gray-600 hover:text-gray-900 border border-transparent'}`
            }`}
            style={{ fontWeight: activeModel === model.id ? 600 : 500 }}
          >
            <Database className="w-4 h-4" />
            {model.name}
            {activeModel === model.id && (
              <X className="w-3 h-3 ml-1 hover:bg-gray-200 rounded" />
            )}
          </button>
        ))}
        <button className={`p-1.5 rounded-lg hover:${isDark ? 'bg-zinc-800' : 'bg-gray-200'} transition-colors`}>
          <Plus className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Diagram Tabs */}
      <div className={`flex items-center gap-1 px-3 py-2 border-b transition-colors ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-50 border-gray-200'
      }`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {activeModelDiagrams.map((diagram) => (
          <button
            key={diagram.id}
            onClick={() => setActiveDiagram(diagram.id)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-all duration-200 shadow-sm ${
              activeDiagram === diagram.id
                ? `${isDark ? 'bg-zinc-700 text-gray-100 border border-zinc-600' : 'bg-white text-gray-900 shadow-md border border-gray-200'}`
                : `${isDark ? 'text-gray-400 hover:text-gray-100 border border-transparent' : 'text-gray-600 hover:text-gray-900 border border-transparent'}`
            }`}
            style={{ fontWeight: activeDiagram === diagram.id ? 600 : 500 }}
          >
            <Grid className="w-4 h-4" />
            {diagram.name}
            {activeDiagram === diagram.id && (
              <X className="w-3 h-3 ml-1 hover:bg-gray-200 rounded" />
            )}
          </button>
        ))}
        <button className={`p-1.5 rounded-lg hover:${isDark ? 'bg-zinc-800' : 'bg-gray-200'} transition-colors`}>
          <Plus className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Canvas */}
      <div className={`flex-1 relative overflow-hidden transition-colors ${
        isDark ? 'bg-zinc-950' : 'bg-gray-50'
      }`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Premium Grid background */}
        <div
          className={`absolute inset-0 opacity-40`}
          style={{
            backgroundImage: `
              linear-gradient(${isDark ? '#3A3A3A' : '#E5E7EB'} 1px, transparent 1px),
              linear-gradient(90deg, ${isDark ? '#3A3A3A' : '#E5E7EB'} 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Sample entities */}
        <div className="absolute top-20 left-20">
          <div className={`w-48 rounded-lg border shadow-lg ${
            isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-300'
          }`}>
            <div className={`px-3 py-2 border-b font-medium ${
              isDark ? 'border-zinc-700 text-gray-100' : 'border-gray-200 text-gray-900'
            }`}>
              Customer
            </div>
            <div className="p-3 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Key className="w-3 h-3 text-yellow-500" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>customer_id</span>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>INT</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>first_name</span>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>VARCHAR</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>email</span>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>VARCHAR</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 right-20">
          <div className={`w-48 rounded-lg border shadow-lg ${
            isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-300'
          }`}>
            <div className={`px-3 py-2 border-b font-medium ${
              isDark ? 'border-zinc-700 text-gray-100' : 'border-gray-200 text-gray-900'
            }`}>
              Order
            </div>
            <div className="p-3 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Key className="w-3 h-3 text-yellow-500" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>order_id</span>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>INT</span>
              </div>
              <div className="flex items-center gap-2">
                <Link className="w-3 h-3 text-blue-500" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>customer_id</span>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>INT</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>order_date</span>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>DATE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Relationship line */}
        <svg className="absolute inset-0 pointer-events-none">
          <line
            x1="268"
            y1="140"
            x2="400"
            y2="140"
            stroke={isDark ? '#6366f1' : '#4f46e5'}
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill={isDark ? '#6366f1' : '#4f46e5'}
              />
            </marker>
          </defs>
        </svg>

        <FloatingToolbar isDark={isDark} />
        <MiniMap isDark={isDark} />
      </div>
    </div>
  );
};

// Enhanced Property Pane Component with Linear.app Premium Design
const PropertyPane = ({ isDark, isCollapsed, onToggle }: { isDark: boolean; isCollapsed: boolean; onToggle: () => void }) => {
  const [selectedObject, setSelectedObject] = useState<'entity' | 'attribute'>('entity');
  const [selectedEntity] = useState('Customer');
  const [selectedAttribute] = useState('Email');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const propertyTabs = [
    { id: 'general', icon: <ClipboardList className="w-4 h-4" />, label: 'General' },
    { id: 'display', icon: <Palette className="w-4 h-4" />, label: 'Display' },
    { id: 'keys', icon: <Key className="w-4 h-4" />, label: 'Keys' },
    { id: 'data', icon: <BarChart3 className="w-4 h-4" />, label: 'Data' },
    { id: 'relations', icon: <Link2 className="w-4 h-4" />, label: 'Relations' },
    { id: 'rules', icon: <FileText className="w-4 h-4" />, label: 'Rules' },
    { id: 'advanced', icon: <Settings className="w-4 h-4" />, label: 'Advanced' }
  ];

  const AccordionSection = ({ id, title, children, defaultExpanded = false }: {
    id: string;
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
  }) => {
    const isExpanded = expandedSections.has(id);

    return (
      <div className={`border-b transition-colors ${
        isDark ? 'border-zinc-800' : 'border-gray-200'
      }`}>
        <button
          onClick={() => toggleSection(id)}
          className={`w-full flex items-center justify-between p-4 text-left transition-all duration-200 ${
            isDark
              ? 'hover:bg-zinc-800/50 text-gray-100'
              : 'hover:bg-indigo-50/50 text-gray-900'
          }`}
          style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 500 }}
        >
          <span className="text-sm">{title}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            } ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-4 pt-0">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const PremiumInput = ({ label, value, type = 'text', placeholder = '', rows }: {
    label: string;
    value: string;
    type?: string;
    placeholder?: string;
    rows?: number;
  }) => (
    <div className="mb-4">
      <label className={`block text-xs font-medium mb-2 ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`} style={{ fontWeight: 500 }}>
        {label}
      </label>
      {rows ? (
        <textarea
          value={value}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-4 py-3 text-sm border rounded-lg resize-none transition-all duration-200 ${
            isDark
              ? 'bg-zinc-800 border-zinc-700 text-gray-100 focus:border-indigo-500 focus:bg-zinc-750'
              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:bg-gray-50'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm hover:border-gray-400`}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          className={`w-full px-4 py-3 text-sm border rounded-lg transition-all duration-200 ${
            isDark
              ? 'bg-zinc-800 border-zinc-700 text-gray-100 focus:border-indigo-500 focus:bg-zinc-750'
              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:bg-gray-50'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm hover:border-gray-400`}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        />
      )}
    </div>
  );

  const PremiumSelect = ({ label, value, options }: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
  }) => (
    <div className="mb-4">
      <label className={`block text-xs font-medium mb-2 ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`} style={{ fontWeight: 500 }}>
        {label}
      </label>
      <select
        value={value}
        className={`w-full px-4 py-3 text-sm border rounded-lg transition-all duration-200 ${
          isDark
            ? 'bg-zinc-800 border-zinc-700 text-gray-100 focus:border-indigo-500'
            : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
        } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm hover:border-gray-400`}
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  const PremiumCheckbox = ({ label, checked = false }: {
    label: string;
    checked?: boolean;
  }) => (
    <label className={`flex items-center gap-3 text-sm cursor-pointer py-2 ${
      isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'
    } transition-colors`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <input
        type="checkbox"
        checked={checked}
        className={`w-4 h-4 rounded border-2 transition-colors ${
          isDark
            ? 'border-zinc-600 bg-zinc-800 checked:bg-indigo-500 checked:border-indigo-500'
            : 'border-gray-300 bg-white checked:bg-indigo-600 checked:border-indigo-600'
        }`}
        style={{ accentColor: isDark ? '#818CF8' : '#6366F1' }}
      />
      {label}
    </label>
  );

  return (
    <div className={`${isCollapsed ? 'w-12' : 'w-96'} border-l transition-all duration-300 ${
      isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
    }`}>
      {/* Collapse Toggle Button */}
      <div className={`h-12 border-b flex items-center justify-center ${
        isDark ? 'border-zinc-800' : 'border-gray-200'
      }`}>
        <button
          onClick={onToggle}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isDark ? 'hover:bg-zinc-800 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title={isCollapsed ? 'Expand Properties' : 'Collapse Properties'}
        >
          {isCollapsed ? <ChevronUp className="w-4 h-4 -rotate-90" /> : <ChevronUp className="w-4 h-4 rotate-90" />}
        </button>
      </div>
      {!isCollapsed && (
        <div className="flex h-full">
          {/* Left Icon Strip */}
          <div className={`w-6 border-r transition-colors flex flex-col ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
          }`}>
        {propertyTabs.map((tab, index) => (
          <div
            key={tab.id}
            className={`h-10 flex items-center justify-center cursor-pointer transition-all duration-200 ${
              index === 0
                ? `${isDark ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white'} shadow-sm`
                : `${isDark ? 'text-gray-400 hover:text-gray-100 hover:bg-zinc-800/50' : 'text-gray-600 hover:text-gray-900 hover:bg-indigo-50/50'}`
            }`}
            title={tab.label}
            style={{ marginBottom: '2px' }}
          >
            {tab.icon}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 overflow-y-auto transition-colors ${
        isDark ? 'bg-zinc-900' : 'bg-white'
      }`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Context Header */}
        <div className={`p-4 border-b transition-colors ${
          isDark ? 'border-zinc-800 bg-zinc-900' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <ClipboardList className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h2 className={`text-lg font-semibold ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`} style={{ fontWeight: 600 }}>
              {selectedObject === 'entity' ? selectedEntity : selectedAttribute}
            </h2>
          </div>
          <p className={`text-xs mt-1 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {selectedObject === 'entity' ? 'Entity Properties' : 'Attribute Properties'}
          </p>
        </div>

        {/* Property Sections */}
        <div>
          {selectedObject === 'entity' ? (
            <>
              <AccordionSection id="general" title="▼ Entity Properties" defaultExpanded>
                <PremiumInput label="Name" value="Customer" />
                <PremiumInput label="Physical Name" value="CUSTOMER" />
                <PremiumInput
                  label="Definition"
                  value="Core customer entity storing customer information and contact details for business operations"
                  rows={4}
                />
                <PremiumSelect
                  label="Owner"
                  value="dbo"
                  options={[
                    { value: 'dbo', label: 'dbo' },
                    { value: 'admin', label: 'admin' },
                    { value: 'app_user', label: 'app_user' }
                  ]}
                />
                <PremiumCheckbox label="Complete" checked />
                <PremiumCheckbox label="Conceptual Only" />
              </AccordionSection>

              <AccordionSection id="naming" title="▼ Naming Standards">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <PremiumInput label="Prefix" value="CUST_" />
                  <PremiumInput label="Suffix" value="_TBL" />
                </div>
                <PremiumInput label="Abbreviation" value="CUST" />
                <PremiumCheckbox label="Apply naming rules" checked />
              </AccordionSection>

              <AccordionSection id="display" title="▶ Display Options">
                <PremiumSelect
                  label="Color"
                  value="blue"
                  options={[
                    { value: 'blue', label: '🔵 Blue' },
                    { value: 'green', label: '🟢 Green' },
                    { value: 'red', label: '🔴 Red' },
                    { value: 'purple', label: '🟣 Purple' }
                  ]}
                />
                <PremiumSelect
                  label="Font Size"
                  value="medium"
                  options={[
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' }
                  ]}
                />
                <PremiumCheckbox label="Show in diagram" checked />
                <PremiumCheckbox label="Show entity name" checked />
                <PremiumCheckbox label="Show definition" />
                <PremiumCheckbox label="Show attributes" checked />
              </AccordionSection>

              <AccordionSection id="keys" title="▶ Keys & Indexes">
                <div className={`p-4 rounded-lg border mb-4 ${
                  isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <h4 className={`text-sm font-medium mb-3 ${
                    isDark ? 'text-gray-100' : 'text-gray-900'
                  }`}>Primary Key</h4>
                  <PremiumInput label="Key Name" value="PK_Customer" />
                  <div className={`flex items-center gap-2 p-2 rounded border ${
                    isDark ? 'bg-zinc-700 border-zinc-600' : 'bg-white border-gray-300'
                  }`}>
                    <Key className="w-4 h-4 text-yellow-500" />
                    <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>CustomerID</span>
                  </div>
                  <div className="mt-3">
                    <PremiumCheckbox label="Generate constraint" checked />
                    <PremiumCheckbox label="Create index" checked />
                  </div>
                </div>
              </AccordionSection>
            </>
          ) : (
            <>
              <AccordionSection id="general" title="▼ Attribute Properties" defaultExpanded>
                <PremiumInput label="Name" value="Email" />
                <PremiumInput label="Physical Name" value="EMAIL" />
                <PremiumInput
                  label="Definition"
                  value="Customer email address for communication purposes"
                  rows={3}
                />
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  Parent Entity: Customer
                </div>
                <PremiumCheckbox label="Complete" checked />
              </AccordionSection>

              <AccordionSection id="datatype" title="▼ Data Type">
                <PremiumSelect
                  label="Domain"
                  value="emailaddress"
                  options={[
                    { value: 'emailaddress', label: 'EmailAddress' },
                    { value: 'string', label: 'String' },
                    { value: 'text', label: 'Text' }
                  ]}
                />
                <div className="grid grid-cols-3 gap-4">
                  <PremiumInput label="Length" value="255" />
                  <PremiumInput label="Precision" value="" />
                  <PremiumInput label="Scale" value="" />
                </div>
                <PremiumCheckbox label="Use domain settings" checked />

                <div className="mt-6">
                  <h4 className={`text-sm font-medium mb-3 ${
                    isDark ? 'text-gray-100' : 'text-gray-900'
                  }`}>Null Options</h4>
                  <div className="space-y-2">
                    <label className={`flex items-center gap-3 text-sm cursor-pointer ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <input type="radio" name="nullability" value="null" className={`${
                        isDark ? 'accent-indigo-400' : 'accent-indigo-600'
                      }`} />
                      Null
                    </label>
                    <label className={`flex items-center gap-3 text-sm cursor-pointer ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <input type="radio" name="nullability" value="not-null" checked className={`${
                        isDark ? 'accent-indigo-400' : 'accent-indigo-600'
                      }`} />
                      Not Null
                    </label>
                    <label className={`flex items-center gap-3 text-sm cursor-pointer ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <input type="radio" name="nullability" value="default-null" className={`${
                        isDark ? 'accent-indigo-400' : 'accent-indigo-600'
                      }`} />
                      Default Null
                    </label>
                  </div>
                </div>

                <div className="mt-4">
                  <PremiumInput label="Default Value" value="" />
                </div>
              </AccordionSection>
            </>
          )}
        </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Model Explorer Component
const ModelExplorer = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('home');
  const [isTreeCollapsed, setIsTreeCollapsed] = useState(false);
  const [isPropertyCollapsed, setIsPropertyCollapsed] = useState(false);
  const [isPhysicalView, setIsPhysicalView] = useState(true);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuType, setContextMenuType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState('');

  return (
    <div className={`h-full flex flex-col transition-colors ${
      isDark ? 'bg-zinc-950 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header Bar */}
      <HeaderBar isDark={isDark} toggleTheme={toggleTheme} />

      {/* Main Tabs */}
      <MainTabs isDark={isDark} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Contextual Toolbar */}
      <ContextualToolbar isDark={isDark} activeTab={activeTab} isPhysicalView={isPhysicalView} setIsPhysicalView={setIsPhysicalView} />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Model Tree */}
        <ModelTree isDark={isDark} isCollapsed={isTreeCollapsed} onToggle={() => setIsTreeCollapsed(!isTreeCollapsed)} isPhysicalView={isPhysicalView} />

        {/* Diagram Canvas */}
        <DiagramCanvas isDark={isDark} />

        {/* Property Pane */}
        <PropertyPane isDark={isDark} isCollapsed={isPropertyCollapsed} onToggle={() => setIsPropertyCollapsed(!isPropertyCollapsed)} />
      </div>
    </div>
  );
};

export default ModelExplorer;