'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReverseEngineeringNew from './ReverseEngineeringNew';
import FabricForwardEngineering from './FabricForwardEngineering';
import ModelExplorer from './ModelExplorer';
import CompleteCompare from './CompleteCompare';
import Settings from './Settings';
import Diagram from './Diagram';
import Diagrammer from './Diagrammer';
import MartCatalog from './MartCatalogManager';
import PropertyEditor from './PropertyEditor';
import ThemeToggle from './shared/ThemeToggle';
import {
  LayoutDashboard,
  Database,
  Boxes,
  GitBranch,
  Globe,
  BarChart3,
  Settings as SettingsIcon,
  UserPlus,
  ArrowRightLeft,
  Upload,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users as UsersIcon,
  Activity,
  TrendingUp,
  CheckCircle2,
  FileText,
  FolderOpen,
  RefreshCw,
  Scale,
  Clock,
  Star,
  ChevronDown,
  Search,
  MoreHorizontal,
  ArrowRight,
  Folder,
  Calendar,
  Lock,
  CheckCircle,
  AlertCircle,
  Bot,
  Zap,
  Target,
  PieChart,
  Brain,
  Sparkles,
  Layers
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

const SidebarItem = ({ icon, label, active = false, onClick, collapsed = false }: SidebarItemProps) => (
  <div
    className={`flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer ${
      active ? 'text-gray-900 dark:text-zinc-100 bg-gray-100 dark:bg-zinc-800' : ''
    } ${collapsed ? 'justify-center' : 'gap-3'}`}
    onClick={onClick}
    title={collapsed ? label : undefined}
  >
    {icon}
    {!collapsed && <span>{label}</span>}
  </div>
);

interface NavTabProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavTab = ({ label, active = false, onClick }: NavTabProps) => (
  <div
    className={`nav-tab ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    {label}
  </div>
);

// Linear-style Toolbar for Quick Actions
const LinearToolbar = () => {
  const [showTemplates, setShowTemplates] = useState(false);

  const handleAction = (action: string) => {
    console.log(`Quick Action: ${action}`);
  };

  const templates = [
    { name: 'E-Commerce Starter', description: 'Products, Orders, Customers', entities: 8 },
    { name: 'CRM Foundation', description: 'Contacts, Accounts, Opportunities', entities: 12 },
    { name: 'Blog System', description: 'Posts, Authors, Categories', entities: 6 },
    { name: 'User Management', description: 'Users, Roles, Permissions', entities: 5 },
    { name: 'Inventory System', description: 'Products, Suppliers, Warehouses', entities: 10 }
  ];

  return (
    <div className="flex items-center gap-2 p-3 border-b border-border">
      <div className="relative">
        <button
          className="toolbar-btn primary"
          onClick={() => setShowTemplates(!showTemplates)}
        >
          <Plus className="w-4 h-4" />
          New Model
          <ChevronDown className="w-3 h-3" />
        </button>

        {showTemplates && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-xl z-50">
            <div className="p-3 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Quick Start Templates</h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">Get started with pre-built model templates</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <button
                className="w-full p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-left border-b border-gray-200 dark:border-zinc-800"
                onClick={() => {
                  handleAction('Create Blank Model');
                  setShowTemplates(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-zinc-100">Blank Model</div>
                    <div className="text-xs text-gray-600 dark:text-zinc-400">Start from scratch</div>
                  </div>
                </div>
              </button>

              {templates.map((template, index) => (
                <button
                  key={index}
                  className="w-full p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-left"
                  onClick={() => {
                    handleAction(`Create from template: ${template.name}`);
                    setShowTemplates(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center">
                      <Database className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-zinc-100">{template.name}</div>
                      <div className="text-xs text-gray-600 dark:text-zinc-400">{template.description}</div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-zinc-500">{template.entities} entities</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-border mx-2" />

      <button className="toolbar-btn secondary" onClick={() => handleAction('Open Model')}>
        <FolderOpen className="w-4 h-4" />
        Open
      </button>
    </div>
  );
};

// Model Status Types (from PRD)
type ModelStatus = 'active' | 'locked' | 'checked-out';

// Linear-style Model Row Component
interface ModelRowProps {
  name: string;
  path: string;
  lastModified: string;
  entityCount: number;
  status: ModelStatus;
  onClick?: () => void;
}

const ModelRow = ({ name, path, lastModified, entityCount, status, onClick }: ModelRowProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3 h-3 text-emerald-500" />;
      case 'locked':
        return <Lock className="w-3 h-3 text-amber-500" />;
      case 'checked-out':
        return <AlertCircle className="w-3 h-3 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'text-emerald-500';
      case 'locked':
        return 'text-amber-500';
      case 'checked-out':
        return 'text-blue-500';
    }
  };

  return (
    <div className="model-row" onClick={onClick}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Folder className="w-4 h-4 text-gray-500 dark:text-zinc-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-zinc-100 truncate">{name}</span>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              <span className={`text-xs capitalize ${getStatusColor()}`}>{status}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-zinc-500 truncate">{path}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-zinc-500">
        <span className="badge">{entityCount} entities</span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {lastModified}
        </span>
        <div className="model-actions">
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded">
            <MoreHorizontal className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Linear-style Search Input
interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchInput = ({ placeholder, value, onChange }: SearchInputProps) => (
  <div className="relative mb-3">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
    <input
      type="text"
      className="search-input pl-10"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// System Insights Panel (PRD Requirement)
const SystemInsightsPanel = () => {
  const insights = [
    { label: 'Models Created Today', value: '8', trend: '+12%', icon: <Database className="w-4 h-4" /> },
    { label: 'Active Users', value: '24', trend: '+8%', icon: <UsersIcon className="w-4 h-4" /> },
    { label: 'AI Suggestions Accepted', value: '73%', trend: '+5%', icon: <Brain className="w-4 h-4" /> },
    { label: 'System Health', value: '99.8%', trend: 'Stable', icon: <Activity className="w-4 h-4" /> }
  ];

  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-violet-500" />
          System Insights
        </h3>
        <button className="text-xs text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100">View Details</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-zinc-400">
              {insight.icon}
              <span>{insight.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{insight.value}</span>
              <span className="text-xs text-emerald-500">{insight.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// AI Assistant Preview (PRD Requirement)
const AIAssistantPreview = () => {
  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-500" />
          AI Assistant
        </h3>
        <span className="text-xs bg-violet-600 text-white px-2 py-1 rounded-full">Coming Soon</span>
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-zinc-100">Smart Suggestions</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-zinc-400">
            AI will analyze your models and suggest optimizations, naming conventions, and relationships.
          </p>
        </div>

        <div className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-zinc-100">Natural Language</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-zinc-400">
            Create models using plain English: "Add a Customer table with email and phone fields"
          </p>
        </div>

        <button className="w-full text-sm text-violet-400 hover:text-violet-300 py-2">
          Learn more about AI features →
        </button>
      </div>
    </div>
  );
};

// Combined Models Panel with Tabs
const ModelsPanel = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites'>('recent');
  const [searchTerm, setSearchTerm] = useState('');

  const favoriteModels = [
    { name: 'Core Business Model', path: '/models/core-business', lastModified: '2d ago', entityCount: 24, status: 'active' as ModelStatus },
    { name: 'User Management Schema', path: '/models/user-mgmt', lastModified: '3d ago', entityCount: 8, status: 'locked' as ModelStatus },
    { name: 'Payment Processing Model', path: '/models/payments', lastModified: '1w ago', entityCount: 15, status: 'active' as ModelStatus },
    { name: 'Reporting Data Structure', path: '/models/reports', lastModified: '2w ago', entityCount: 32, status: 'checked-out' as ModelStatus }
  ];

  const recentModels = [
    { name: 'E-Commerce Platform', path: '/models/ecommerce', lastModified: '2h ago', entityCount: 42, status: 'active' as ModelStatus },
    { name: 'Customer Management System', path: '/models/cms', lastModified: '1d ago', entityCount: 18, status: 'checked-out' as ModelStatus },
    { name: 'Inventory Database', path: '/models/inventory', lastModified: '3d ago', entityCount: 27, status: 'locked' as ModelStatus },
    { name: 'Analytics Pipeline', path: '/models/analytics', lastModified: '1w ago', entityCount: 35, status: 'active' as ModelStatus },
    { name: 'User Authentication Service', path: '/models/auth', lastModified: '2w ago', entityCount: 6, status: 'active' as ModelStatus }
  ];

  const getCurrentModels = () => {
    const models = activeTab === 'recent' ? recentModels : favoriteModels;
    const filtered = models.filter(model =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return activeTab === 'recent' ? filtered.slice(0, 5) : filtered;
  };

  const filteredModels = getCurrentModels();

  return (
    <div className="panel">
      {/* Tab Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'recent'
                ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100'
                : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Recent
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'favorites'
                ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100'
                : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Star className="w-4 h-4 inline mr-2" />
            Favorites
          </button>
        </div>

        {activeTab === 'recent' && (
          <button className="text-xs text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 flex items-center gap-1">
            View All
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <SearchInput
        placeholder={`Search ${activeTab}...`}
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <div className="space-y-1">
        {filteredModels.map((model, index) => (
          <ModelRow
            key={index}
            name={model.name}
            path={model.path}
            lastModified={model.lastModified}
            entityCount={model.entityCount}
            status={model.status}
            onClick={() => console.log('Navigate to:', model.name)}
          />
        ))}
      </div>
    </div>
  );
};

// Reverse Engineering Quick Action Card
const ReverseEngineeringCard = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-blue-500" />
          Reverse Engineering
        </h3>
        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">New</span>
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-zinc-100">Import Database Schema</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-zinc-400 mb-3">
            Connect to databases and automatically generate visual data models with full entity relationships.
          </p>
          <div className="flex gap-2">
            <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded">MS Fabric</div>
            <div className="text-xs bg-gray-300 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300 px-2 py-1 rounded opacity-50">MySQL</div>
            <div className="text-xs bg-gray-300 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300 px-2 py-1 rounded opacity-50">PostgreSQL</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-gray-600 dark:text-zinc-400 mb-2">Quick Actions</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded text-center">
              <Database className="w-4 h-4 mx-auto mb-1 text-blue-500" />
              <div className="text-gray-700 dark:text-zinc-300">Connect DB</div>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded text-center">
              <Upload className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
              <div className="text-gray-700 dark:text-zinc-300">Upload SQL</div>
            </div>
          </div>
        </div>

        <button
          onClick={onClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm transition-colors"
        >
          Start Reverse Engineering
        </button>
      </div>
    </div>
  );
};

// Complete Compare Card
const CompleteCompareCard = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-500" />
          Model Compare
        </h3>
        <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-full">Pro</span>
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-zinc-100">Visual Diff</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-zinc-400 mb-3">
            Compare models side-by-side and identify structural differences, changes, and conflicts.
          </p>
          <div className="flex gap-2">
            <div className="text-xs bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-zinc-200 px-2 py-1 rounded">Model vs Model</div>
            <div className="text-xs bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-zinc-200 px-2 py-1 rounded">DB vs Model</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-gray-600 dark:text-zinc-400 mb-2">Recent Comparisons</div>
          <div className="space-y-1">
            <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-zinc-100">E-Commerce v2.1 vs v2.0</span>
                <span className="text-emerald-400">+3 entities</span>
              </div>
              <div className="text-gray-600 dark:text-zinc-400 mt-1">2 hours ago</div>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-zinc-100">CRM vs Production DB</span>
                <span className="text-amber-400">5 conflicts</span>
              </div>
              <div className="text-gray-600 dark:text-zinc-400 mt-1">1 day ago</div>
            </div>
          </div>
        </div>

        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
          Start New Compare
        </button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'mart-catalog' | 'model-explorer' | 'reverse-engineering' | 'forward-engineering' | 'complete-compare' | 'settings' | 'diagram' | 'diagrammer' | 'property-editor'>('dashboard');

  const sidebarItems = [
    {
      icon: <LayoutDashboard className="w-4 h-4" />,
      label: 'Dashboard',
      page: 'dashboard' as const,
      active: currentPage === 'dashboard'
    },
    {
      icon: <FolderOpen className="w-4 h-4" />,
      label: 'Mart Catalog',
      page: 'mart-catalog' as const,
      active: currentPage === 'mart-catalog'
    },
    {
      icon: <Database className="w-4 h-4" />,
      label: 'Model Explorer',
      page: 'model-explorer' as const,
      active: currentPage === 'model-explorer'
    },
    {
      icon: <RefreshCw className="w-4 h-4" />,
      label: 'Reverse Engineering',
      page: 'reverse-engineering' as const,
      active: currentPage === 'reverse-engineering'
    },
    {
      icon: <ArrowRightLeft className="w-4 h-4" />,
      label: 'Forward Engineering',
      page: 'forward-engineering' as const,
      active: currentPage === 'forward-engineering'
    },
    {
      icon: <Scale className="w-4 h-4" />,
      label: 'Complete Compare',
      page: 'complete-compare' as const,
      active: currentPage === 'complete-compare'
    },
    {
      icon: <SettingsIcon className="w-4 h-4" />,
      label: 'Settings',
      page: 'settings' as const,
      active: currentPage === 'settings'
    },
    {
      icon: <Layers className="w-4 h-4" />,
      label: 'Diagram',
      page: 'diagram' as const,
      active: currentPage === 'diagram'
    },
    {
      icon: <Boxes className="w-4 h-4" />,
      label: 'Diagrammer',
      page: 'diagrammer' as const,
      active: currentPage === 'diagrammer'
    }
  ];

  const bottomLinks = [
    { icon: <UserPlus className="w-4 h-4" />, label: 'Invite Team' },
    { icon: <Upload className="w-4 h-4" />, label: 'Import Models' },
    { icon: <HelpCircle className="w-4 h-4" />, label: 'Help' }
  ];

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-all duration-200`}>
        {/* Logo & Workspace */}
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">DMPro</h1>
                <p className="text-xs text-gray-500 dark:text-zinc-400">Data Modeling Studio</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors"
            >
              {sidebarCollapsed ?
                <ChevronRight className="w-4 h-4" /> :
                <ChevronLeft className="w-4 h-4" />
              }
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              label={item.label}
              active={item.active}
              collapsed={sidebarCollapsed}
              onClick={() => setCurrentPage(item.page)}
            />
          ))}
        </div>

        {/* Bottom Links */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-gray-200 dark:border-zinc-800 space-y-1">
            {bottomLinks.map((link, index) => (
              <SidebarItem
                key={index}
                icon={link.icon}
                label={link.label}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Header with Theme Toggle - Hidden for Diagrammer */}
        {currentPage !== 'diagrammer' && (
          <div className="flex items-center justify-end p-4 border-b border-gray-200 dark:border-zinc-800">
            <ThemeToggle />
          </div>
        )}

        {/* Page Content with Transitions */}
        <div className="flex-1 overflow-auto">
          {currentPage === 'dashboard' && (
            <div className="p-6">
              {/* Welcome Section */}
              <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-4">
                  Welcome to DMPro
                </h1>
                <p className="text-lg text-gray-600 dark:text-zinc-400 mb-8">
                  Your comprehensive data modeling workspace
                </p>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
                  <button
                    onClick={() => setCurrentPage('model-explorer')}
                    className="group p-6 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-purple-500/50 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all duration-200"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                        <FolderOpen className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-zinc-100">Open Model</h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Browse and edit existing models</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentPage('model-explorer')}
                    className="group p-6 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-emerald-500/50 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all duration-200"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                        <Plus className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-zinc-100">New Model</h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Create a new data model</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentPage('reverse-engineering')}
                    className="group p-6 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-blue-500/50 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all duration-200"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                        <RefreshCw className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-zinc-100">Reverse Engineer</h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Import from database</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentPage('complete-compare')}
                    className="group p-6 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-amber-500/50 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all duration-200"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 bg-amber-500/20 rounded-lg group-hover:bg-amber-500/30 transition-colors">
                        <Scale className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-zinc-100">Compare Models</h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Compare and merge models</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Stats Overview Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-gray-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-zinc-400 text-sm">Total Models</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-zinc-100">24</p>
                    </div>
                    <Database className="w-8 h-8 text-violet-500" />
                  </div>
                  <div className="text-xs text-emerald-400 mt-2">+3 this week</div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-gray-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-zinc-400 text-sm">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-zinc-100">12</p>
                    </div>
                    <UsersIcon className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="text-xs text-emerald-400 mt-2">+2 today</div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-gray-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-zinc-400 text-sm">Entities</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-zinc-100">158</p>
                    </div>
                    <Boxes className="w-8 h-8 text-amber-500" />
                  </div>
                  <div className="text-xs text-emerald-400 mt-2">+15 this week</div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-gray-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-zinc-400 text-sm">AI Suggestions</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-zinc-100">73%</p>
                    </div>
                    <Brain className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div className="text-xs text-emerald-400 mt-2">Accepted rate</div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Left Column - Models */}
                <div className="xl:col-span-2 space-y-6">
                  <ModelsPanel />

                  {/* Tools Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ReverseEngineeringCard onClick={() => setCurrentPage('reverse-engineering')} />
                    <CompleteCompareCard onClick={() => setCurrentPage('complete-compare')} />
                  </div>
                </div>

                {/* Right Column - Insights & AI */}
                <div className="space-y-6">
                  <SystemInsightsPanel />
                  <AIAssistantPreview />
                </div>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {currentPage === 'mart-catalog' && <MartCatalog />}
              {currentPage === 'model-explorer' && <ModelExplorer />}
              {currentPage === 'reverse-engineering' && <ReverseEngineeringNew />}
              {currentPage === 'forward-engineering' && <FabricForwardEngineering />}
              {currentPage === 'complete-compare' && <CompleteCompare />}
              {currentPage === 'settings' && <Settings />}
              {currentPage === 'diagram' && <Diagram />}
              {currentPage === 'diagrammer' && <Diagrammer />}
              {currentPage === 'property-editor' && <PropertyEditor onClose={() => setCurrentPage('dashboard')} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};