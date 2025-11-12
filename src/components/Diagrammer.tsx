'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuickEditor } from './QuickEditorNew';
import {
  Box,
  Plus,
  Link2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Save,
  Lock,
  Unlock,
  Table2,
  Edit3,
  Eye,
  Settings,
  ChevronRight,
  ChevronDown,
  Database,
  FileText,
  RefreshCw,
  GitCompare,
  ArrowRightLeft,
  Trash2,
  Copy,
  Download,
  Upload,
  Undo2,
  Redo2,
  MousePointer2,
  Move,
  Type,
  Square,
  Circle,
  Component,
  Workflow,
  GitBranch,
  GitMerge,
  Network,
  EyeOff,
  Hash,
  Key,
  Zap,
  Command,
  Users,
  User,
  Crown,
  UserPlus,
  KeyRound,
  Server,
  Search,
  Link as LinkIcon,
  Folder,
  Globe,
  Archive,
  FileCode,
  Code,
  MoreHorizontal,
  Sun,
  Moon,
  MousePointer,
  StickyNote,
  Group,
  Ungroup,
  Shapes,
  ArrowRight,
  Hand,
  Grid,
  Target,
  Sparkles,
  Map,
  Expand,
  Minimize2,
  BookOpen,
  ClipboardList,
  History,
  Shield,
  FileStack,
  Sliders
} from 'lucide-react';

// Types
type ViewMode = 'diagram' | 'quick-editor' | 'properties';
type Tool = 'select' | 'table' | 'relationship' | 'note' | 'move';
type EditorViewMode = 'table-list' | 'table-editor';
type TableEditorTab = 'columns' | 'indexes' | 'foreignKeys' | 'constraints' | 'businessTerms' | 'triggers';
type LockType = 'unlocked' | 'existence' | 'shared' | 'update' | 'exclusive';

interface TableIndex {
  id: string;
  name: string;
  columns: string[];
  isUnique: boolean;
  type: 'CLUSTERED' | 'NONCLUSTERED' | 'HASH';
}

interface ForeignKey {
  id: string;
  name: string;
  column: string;
  referencedTable: string;
  referencedColumn: string;
  onDelete: 'CASCADE' | 'SET NULL' | 'NO ACTION' | 'RESTRICT';
  onUpdate: 'CASCADE' | 'SET NULL' | 'NO ACTION' | 'RESTRICT';
}

interface TableConstraint {
  id: string;
  name: string;
  type: 'CHECK' | 'UNIQUE' | 'DEFAULT';
  expression: string;
  columns?: string[];
}

interface Table {
  id: string;
  name: string;
  x: number;
  y: number;
  columns: Column[];
  schema?: string;
  tableType?: 'Disk Based' | 'Memory Optimized' | 'File Table';
  description?: string;
  filegroup?: string;
  lockEscalation?: 'AUTO' | 'TABLE' | 'DISABLE';
  indexes?: TableIndex[];
  foreignKeys?: ForeignKey[];
  constraints?: TableConstraint[];
  businessTerms?: string[];
  triggers?: string[];
  comments?: string;
}

interface Column {
  id: string;
  name: string;
  dataType: string;
  isPK: boolean;
  isNullable: boolean;
  defaultValue?: string;
  isFK?: boolean;
  description?: string;
  // SQL Server specific properties
  isRowGuid?: boolean;
  isSparse?: boolean;
  isHidden?: boolean;
  collation?: string;
  averageWidth?: number;
  percentNull?: number;
  isPersisted?: boolean;
  columnMaskFunction?: string;
  encryptionType?: string;
}

interface Relationship {
  id: string;
  fromTable: string;
  toTable: string;
  type: '1:1' | '1:N' | 'N:M';
  relationshipType: 'identifying' | 'non-identifying' | 'sub-type' | 'many-to-many';
  fromSide?: 'top' | 'right' | 'bottom' | 'left';
  toSide?: 'top' | 'right' | 'bottom' | 'left';
}

// Mock data
const mockTables: Table[] = [
  {
    id: 'table-1',
    name: 'Users',
    x: 100,
    y: 100,
    columns: [
      { id: 'col-1', name: 'user_id', dataType: 'INTEGER', isPK: true, isNullable: false },
      { id: 'col-2', name: 'username', dataType: 'VARCHAR(50)', isPK: false, isNullable: false },
      { id: 'col-3', name: 'email', dataType: 'VARCHAR(100)', isPK: false, isNullable: false },
      { id: 'col-4', name: 'created_at', dataType: 'TIMESTAMP', isPK: false, isNullable: true }
    ]
  },
  {
    id: 'table-2',
    name: 'Orders',
    x: 400,
    y: 100,
    columns: [
      { id: 'col-5', name: 'order_id', dataType: 'INTEGER', isPK: true, isNullable: false },
      { id: 'col-6', name: 'user_id', dataType: 'INTEGER', isPK: false, isNullable: false },
      { id: 'col-7', name: 'total_amount', dataType: 'DECIMAL(10,2)', isPK: false, isNullable: false },
      { id: 'col-8', name: 'order_date', dataType: 'TIMESTAMP', isPK: false, isNullable: false }
    ]
  }
];

const mockRelationships: Relationship[] = [
  { id: 'rel-1', fromTable: 'table-1', toTable: 'table-2', type: '1:N', relationshipType: 'identifying', fromSide: 'right', toSide: 'left' }
];

export default function Diagrammer() {
  const [viewMode, setViewMode] = useState<ViewMode>('diagram');
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [isLocked, setIsLocked] = useState(false);
  const [lockType, setLockType] = useState<LockType>('unlocked');
  const [isLockDropdownOpen, setIsLockDropdownOpen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [relationships, setRelationships] = useState<Relationship[]>(mockRelationships);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [isPanMode, setIsPanMode] = useState(false);
  const [diagramViewType, setDiagramViewType] = useState<'entity' | 'column' | 'key' | 'icon' | 'definition'>('entity');
  const [modelType, setModelType] = useState<'physical' | 'logical'>('physical');
  const [isViewTypeDropdownOpen, setIsViewTypeDropdownOpen] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleResetZoom = () => setZoom(100);
  const handleFitToScreen = () => {
    // Calculate bounds of all tables and fit zoom to show them all
    if (tables.length === 0) return;
    // For now, just reset to 100%
    setZoom(100);
  };
  const handleAutoLayout = () => {
    // Auto-arrange tables in a grid layout
    const gridCols = Math.ceil(Math.sqrt(tables.length));
    const spacing = 300;
    const layoutTables = tables.map((table, index) => ({
      ...table,
      x: (index % gridCols) * spacing + 100,
      y: Math.floor(index / gridCols) * spacing + 100
    }));
    setTables(layoutTables);
  };

  const handleAddTable = () => {
    const newTable: Table = {
      id: `table-${Date.now()}`,
      name: 'NewTable',
      x: 200,
      y: 200,
      columns: [
        { id: `col-${Date.now()}`, name: 'id', dataType: 'INTEGER', isPK: true, isNullable: false }
      ]
    };
    setTables([...tables, newTable]);
  };

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-zinc-950' : 'bg-gray-50'}`}>
      {/* Top Toolbar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center gap-4">
          {/* View Mode Tabs */}
          <div className={`flex items-center gap-1 rounded-lg p-0.5 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
            <button
              onClick={() => setViewMode('diagram')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'diagram'
                  ? isDark ? 'bg-zinc-700 text-gray-100 shadow-sm' : 'bg-white text-gray-900 shadow-sm'
                  : isDark ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1.5" />
              Diagram View
            </button>
            <button
              onClick={() => setViewMode('quick-editor')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'quick-editor'
                  ? isDark ? 'bg-zinc-700 text-gray-100 shadow-sm' : 'bg-white text-gray-900 shadow-sm'
                  : isDark ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Table2 className="w-3.5 h-3.5 inline mr-1.5" />
              Quick Editor
            </button>
            <button
              onClick={() => setViewMode('properties')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'properties'
                  ? isDark ? 'bg-zinc-700 text-gray-100 shadow-sm' : 'bg-white text-gray-900 shadow-sm'
                  : isDark ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5 inline mr-1.5" />
              Properties
            </button>
          </div>

          <div className={`w-px h-6 ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />

          {/* View Type and Model Type Dropdowns */}
          {viewMode === 'diagram' && (
            <div className="flex items-center gap-2">
              {/* View Type Dropdown with Icons */}
              <div className="relative">
                <button
                  onClick={() => setIsViewTypeDropdownOpen(!isViewTypeDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 pr-8 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 border border-zinc-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  {diagramViewType === 'entity' && <><Table2 className="w-3.5 h-3.5" /> Entity View</>}
                  {diagramViewType === 'column' && <><Hash className="w-3.5 h-3.5" /> Column View</>}
                  {diagramViewType === 'key' && <><Key className="w-3.5 h-3.5" /> Key View</>}
                  {diagramViewType === 'icon' && <><Shapes className="w-3.5 h-3.5" /> Icons View</>}
                  {diagramViewType === 'definition' && <><BookOpen className="w-3.5 h-3.5" /> Definition View</>}
                </button>
                <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />

                {/* Dropdown Menu */}
                {isViewTypeDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsViewTypeDropdownOpen(false)}
                    />
                    <div className={`absolute top-full left-0 mt-1 rounded-md shadow-lg z-20 overflow-hidden min-w-[160px] ${
                      isDark ? 'bg-zinc-800 border border-zinc-700' : 'bg-white border border-gray-200'
                    }`}>
                      <button
                        onClick={() => { setDiagramViewType('entity'); setIsViewTypeDropdownOpen(false); }}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-medium transition-colors ${
                          diagramViewType === 'entity'
                            ? isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                            : isDark ? 'text-gray-300 hover:bg-zinc-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Table2 className="w-3.5 h-3.5" />
                        Entity View
                      </button>
                      <button
                        onClick={() => { setDiagramViewType('column'); setIsViewTypeDropdownOpen(false); }}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-medium transition-colors ${
                          diagramViewType === 'column'
                            ? isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                            : isDark ? 'text-gray-300 hover:bg-zinc-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Hash className="w-3.5 h-3.5" />
                        Column View
                      </button>
                      <button
                        onClick={() => { setDiagramViewType('key'); setIsViewTypeDropdownOpen(false); }}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-medium transition-colors ${
                          diagramViewType === 'key'
                            ? isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                            : isDark ? 'text-gray-300 hover:bg-zinc-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Key className="w-3.5 h-3.5" />
                        Key View
                      </button>
                      <button
                        onClick={() => { setDiagramViewType('icon'); setIsViewTypeDropdownOpen(false); }}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-medium transition-colors ${
                          diagramViewType === 'icon'
                            ? isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                            : isDark ? 'text-gray-300 hover:bg-zinc-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Shapes className="w-3.5 h-3.5" />
                        Icons View
                      </button>
                      <button
                        onClick={() => { setDiagramViewType('definition'); setIsViewTypeDropdownOpen(false); }}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-medium transition-colors ${
                          diagramViewType === 'definition'
                            ? isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                            : isDark ? 'text-gray-300 hover:bg-zinc-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Definition View
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Model Type Dropdown */}
              <div className="relative">
                <select
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value as any)}
                  className={`px-3 py-1.5 pr-8 rounded-md text-xs font-medium appearance-none cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 border border-zinc-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  <option value="physical">🗄️ Physical</option>
                  <option value="logical">💡 Logical</option>
                </select>
                <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Actions */}
          <button
            className={`p-1.5 rounded ${isDark ? 'text-gray-400 hover:bg-zinc-800' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            className={`p-1.5 rounded ${isDark ? 'text-gray-400 hover:bg-zinc-800' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className={`w-px h-6 ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />

          {/* Lock Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLockDropdownOpen(!isLockDropdownOpen)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                lockType !== 'unlocked'
                  ? lockType === 'exclusive'
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : lockType === 'update'
                    ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
                    : lockType === 'shared'
                    ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : isDark ? 'bg-zinc-800 text-gray-400 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {lockType !== 'unlocked' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              {lockType === 'unlocked' ? 'Unlocked' : lockType === 'existence' ? 'Existence' : lockType === 'shared' ? 'Shared' : lockType === 'update' ? 'Update' : 'Exclusive'}
              <ChevronDown className={`w-3 h-3 transition-transform ${isLockDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Lock Dropdown Menu */}
            <AnimatePresence>
              {isLockDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-1 w-56 rounded-md shadow-lg border z-50 ${
                    isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setLockType('unlocked');
                        setIsLocked(false);
                        setIsLockDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-start gap-2 transition-colors ${
                        lockType === 'unlocked'
                          ? isDark ? 'bg-zinc-800 text-gray-100' : 'bg-gray-100 text-gray-900'
                          : isDark ? 'text-gray-300 hover:bg-zinc-800' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Unlock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Unlocked</div>
                        <div className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                          Model is editable by all users
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setLockType('existence');
                        setIsLocked(true);
                        setIsLockDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-start gap-2 transition-colors ${
                        lockType === 'existence'
                          ? isDark ? 'bg-zinc-800 text-gray-100' : 'bg-gray-100 text-gray-900'
                          : isDark ? 'text-gray-300 hover:bg-zinc-800' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-400" />
                      <div>
                        <div className="font-medium">Existence Lock</div>
                        <div className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                          Prevents deletion, allows edits
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setLockType('shared');
                        setIsLocked(true);
                        setIsLockDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-start gap-2 transition-colors ${
                        lockType === 'shared'
                          ? isDark ? 'bg-zinc-800 text-gray-100' : 'bg-gray-100 text-gray-900'
                          : isDark ? 'text-gray-300 hover:bg-zinc-800' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                      <div>
                        <div className="font-medium">Shared Lock</div>
                        <div className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                          Read-only mode, prevents editing
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setLockType('update');
                        setIsLocked(true);
                        setIsLockDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-start gap-2 transition-colors ${
                        lockType === 'update'
                          ? isDark ? 'bg-zinc-800 text-gray-100' : 'bg-gray-100 text-gray-900'
                          : isDark ? 'text-gray-300 hover:bg-zinc-800' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-orange-400" />
                      <div>
                        <div className="font-medium">Update Lock</div>
                        <div className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                          Only lock holder can edit
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setLockType('exclusive');
                        setIsLocked(true);
                        setIsLockDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-start gap-2 transition-colors ${
                        lockType === 'exclusive'
                          ? isDark ? 'bg-zinc-800 text-gray-100' : 'bg-gray-100 text-gray-900'
                          : isDark ? 'text-gray-300 hover:bg-zinc-800' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                      <div>
                        <div className="font-medium">Exclusive Lock</div>
                        <div className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                          Prevents all other locks
                        </div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-gray-400 hover:bg-zinc-800' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors">
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <AnimatePresence>
          {showLeftPanel && viewMode !== 'properties' && viewMode !== 'quick-editor' && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={`border-r overflow-auto ${
                isDark ? 'border-zinc-800 bg-zinc-900' : 'border-gray-200 bg-white'
              }`}
            >
              <LeftPanel isDark={isDark} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {viewMode === 'diagram' && (
              <DiagramView
                tables={tables}
                relationships={relationships}
                zoom={zoom}
                selectedTable={selectedTable}
                onTableSelect={setSelectedTable}
                onAddTable={handleAddTable}
                onTablesUpdate={setTables}
                onRelationshipsUpdate={setRelationships}
                isDark={isDark}
                showGrid={showGrid}
                snapToGrid={snapToGrid}
                isPanMode={isPanMode}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onFitToScreen={handleFitToScreen}
                onAutoLayout={handleAutoLayout}
                onToggleGrid={() => setShowGrid(!showGrid)}
                onToggleSnap={() => setSnapToGrid(!snapToGrid)}
                onToggleMinimap={() => setShowMinimap(!showMinimap)}
                onTogglePan={() => setIsPanMode(!isPanMode)}
                showMinimap={showMinimap}
              />
            )}
            {viewMode === 'quick-editor' && (
              <QuickEditor tables={tables} onTablesUpdate={setTables} isDark={isDark} />
            )}
            {viewMode === 'properties' && (
              <PropertiesView selectedTable={tables.find(t => t.id === selectedTable)} isDark={isDark} />
            )}
          </AnimatePresence>
        </div>

        {/* Right Properties Panel */}
        <AnimatePresence>
          {showPropertiesPanel && viewMode === 'diagram' && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={`border-l overflow-auto ${
                isDark ? 'border-zinc-800 bg-zinc-900' : 'border-gray-200 bg-white'
              }`}
            >
              <RightPropertiesPanel table={tables.find(t => t.id === selectedTable)} isDark={isDark} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Toolbar Button Component
const ToolbarButton = ({
  icon: Icon,
  tooltip,
  isDark,
  isActive = false,
  onClick
}: {
  icon: any;
  tooltip: string;
  isDark: boolean;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        className={`p-2.5 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer ${
          isActive
            ? isDark
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-indigo-500 text-white shadow-md'
            : isDark
            ? 'hover:bg-zinc-700 text-gray-300'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={onClick}
        style={{ pointerEvents: 'auto', zIndex: 10000 }}
      >
        <Icon className="w-4 h-4" />
      </button>
      {showTooltip && (
        <div className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg text-xs whitespace-nowrap z-50 ${
          isDark ? 'bg-zinc-700 text-white' : 'bg-gray-800 text-white'
        }`}>
          {tooltip}
        </div>
      )}
    </div>
  );
};

// Shape Dropdown Component
// Relationship Dropdown Component
const RelationshipDropdown = ({
  isDark,
  isActive,
  onSelectTool,
  onSelectRelationshipType
}: {
  isDark: boolean;
  isActive: boolean;
  onSelectTool: (mode: 'table' | 'annotation' | 'relationship' | null) => void;
  onSelectRelationshipType: (type: 'identifying' | 'non-identifying' | 'sub-type' | 'many-to-many') => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        className={`p-2.5 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer ${
          isActive
            ? isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
            : isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
        }`}
        onMouseEnter={() => !isOpen && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        style={{ pointerEvents: 'auto', zIndex: 10000 }}
      >
        <GitBranch className="w-4 h-4" />
      </button>
      {showTooltip && !isOpen && (
        <div className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg text-xs whitespace-nowrap z-50 ${
          isDark ? 'bg-zinc-700 text-white' : 'bg-gray-800 text-white'
        }`}>
          Add Relationship
        </div>
      )}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute left-full ml-2 top-0 rounded-lg shadow-lg border p-1.5 flex flex-col gap-1 ${
            isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'
          }`} style={{ zIndex: 10001 }}>
            <button
              className={`p-2 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              onClick={() => {
                onSelectRelationshipType('identifying');
                onSelectTool('relationship');
                setIsOpen(false);
              }}
            >
              <KeyRound className="w-4 h-4" />
              <span className="text-xs whitespace-nowrap">Identifying</span>
            </button>
            <button
              className={`p-2 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              onClick={() => {
                onSelectRelationshipType('non-identifying');
                onSelectTool('relationship');
                setIsOpen(false);
              }}
            >
              <Link2 className="w-4 h-4" />
              <span className="text-xs whitespace-nowrap">Non-identifying</span>
            </button>
            <button
              className={`p-2 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              onClick={() => {
                onSelectRelationshipType('sub-type');
                onSelectTool('relationship');
                setIsOpen(false);
              }}
            >
              <GitMerge className="w-4 h-4" />
              <span className="text-xs whitespace-nowrap">Sub-type</span>
            </button>
            <button
              className={`p-2 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              onClick={() => {
                onSelectRelationshipType('many-to-many');
                onSelectTool('relationship');
                setIsOpen(false);
              }}
            >
              <Network className="w-4 h-4" />
              <span className="text-xs whitespace-nowrap">Many to Many</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const ShapeDropdown = ({ isDark }: { isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        className={`p-2.5 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer ${
          isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
        }`}
        onMouseEnter={() => !isOpen && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        style={{ pointerEvents: 'auto', zIndex: 10000 }}
      >
        <Shapes className="w-4 h-4" />
      </button>
      {showTooltip && !isOpen && (
        <div className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg text-xs whitespace-nowrap z-50 ${
          isDark ? 'bg-zinc-700 text-white' : 'bg-gray-800 text-white'
        }`}>
          Shapes
        </div>
      )}
      {isOpen && (
        <div className={`absolute left-full ml-2 top-0 rounded-lg shadow-lg border p-1.5 flex flex-col gap-1 ${
          isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'
        }`} style={{ zIndex: 10001 }}>
          <button
            className={`p-2 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <Square className="w-4 h-4" />
            <span className="text-xs whitespace-nowrap">Rectangle</span>
          </button>
          <button
            className={`p-2 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <Circle className="w-4 h-4" />
            <span className="text-xs whitespace-nowrap">Ellipse</span>
          </button>
          <button
            className={`p-2 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <ArrowRight className="w-4 h-4" />
            <span className="text-xs whitespace-nowrap">Line</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Object Toolbar Component
const ObjectToolbar = ({
  isDark,
  isDrawingMode,
  onSelectTool,
  onSelectRelationshipType
}: {
  isDark: boolean;
  isDrawingMode: 'table' | 'annotation' | 'relationship' | null;
  onSelectTool: (mode: 'table' | 'annotation' | 'relationship' | null) => void;
  onSelectRelationshipType: (type: 'identifying' | 'non-identifying' | 'sub-type' | 'many-to-many') => void;
}) => {
  return (
    <div className={`absolute top-6 left-6 flex flex-col gap-1 p-1.5 rounded-xl shadow-lg backdrop-blur-sm border z-50 ${
      isDark ? 'bg-zinc-800/90 border-zinc-700' : 'bg-white/90 border-gray-200'
    }`} style={{ fontFamily: 'Inter, system-ui, sans-serif', zIndex: 9999, pointerEvents: 'auto' }}>
      <ToolbarButton
        icon={MousePointer}
        tooltip="Pointer/Select Tool"
        isDark={isDark}
        isActive={isDrawingMode === null}
        onClick={() => onSelectTool(null)}
      />
      <ToolbarButton
        icon={Database}
        tooltip="Add Entity/Table"
        isDark={isDark}
        isActive={isDrawingMode === 'table'}
        onClick={() => onSelectTool('table')}
      />
      <RelationshipDropdown
        isDark={isDark}
        isActive={isDrawingMode === 'relationship'}
        onSelectTool={onSelectTool}
        onSelectRelationshipType={onSelectRelationshipType}
      />
      <ToolbarButton
        icon={StickyNote}
        tooltip="Add Note/Annotation"
        isDark={isDark}
        isActive={isDrawingMode === 'annotation'}
        onClick={() => onSelectTool('annotation')}
      />
      <div className={`h-px w-6 my-1 ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />
      <ToolbarButton icon={Group} tooltip="Group Entities" isDark={isDark} />
      <ToolbarButton icon={Ungroup} tooltip="Ungroup Entities" isDark={isDark} />
      <div className={`h-px w-6 my-1 ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />
      <ShapeDropdown isDark={isDark} />
    </div>
  );
};

// View Toolbar Button Component
const ViewToolbarButton = ({
  icon: Icon,
  tooltip,
  isDark,
  onClick,
  isActive = false
}: {
  icon: any;
  tooltip: string;
  isDark: boolean;
  onClick?: () => void;
  isActive?: boolean
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        className={`p-2.5 rounded-lg hover:scale-105 transition-all duration-200 ${
          isActive
            ? isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
            : isDark ? 'hover:bg-zinc-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
        }`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={onClick}
      >
        <Icon className="w-4 h-4" />
      </button>
      {showTooltip && (
        <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-xs whitespace-nowrap z-50 ${
          isDark ? 'bg-zinc-700 text-white' : 'bg-gray-800 text-white'
        }`}>
          {tooltip}
        </div>
      )}
    </div>
  );
};

// View Controls Toolbar Component
const ViewControlsToolbar = ({
  isDark,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onAutoLayout,
  zoomLevel,
  showGrid,
  onToggleGrid,
  snapToGrid,
  onToggleSnap,
  showMinimap,
  onToggleMinimap,
  isPanMode,
  onTogglePan
}: {
  isDark: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onAutoLayout: () => void;
  zoomLevel: number;
  showGrid: boolean;
  onToggleGrid: () => void;
  snapToGrid: boolean;
  onToggleSnap: () => void;
  showMinimap: boolean;
  onToggleMinimap: () => void;
  isPanMode: boolean;
  onTogglePan: () => void;
}) => {
  return (
    <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-1 p-1.5 rounded-xl shadow-lg backdrop-blur-sm border z-50 ${
      isDark ? 'bg-zinc-800/95 border-zinc-700' : 'bg-white/95 border-gray-200'
    }`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <ViewToolbarButton icon={ZoomIn} tooltip={`Zoom In (${zoomLevel}%)`} isDark={isDark} onClick={onZoomIn} />
      <ViewToolbarButton icon={ZoomOut} tooltip={`Zoom Out (${zoomLevel}%)`} isDark={isDark} onClick={onZoomOut} />
      <ViewToolbarButton icon={Maximize2} tooltip="Fit to Screen" isDark={isDark} onClick={onFitToScreen} />
      <div className={`w-px h-6 mx-1 ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />
      <ViewToolbarButton icon={Hand} tooltip="Pan/Hand Tool" isDark={isDark} onClick={onTogglePan} isActive={isPanMode} />
      <div className={`w-px h-6 mx-1 ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />
      <ViewToolbarButton icon={Grid} tooltip="Toggle Grid" isDark={isDark} onClick={onToggleGrid} isActive={showGrid} />
      <ViewToolbarButton icon={Target} tooltip="Snap to Grid/Alignment" isDark={isDark} onClick={onToggleSnap} isActive={snapToGrid} />
      <div className={`w-px h-6 mx-1 ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />
      <ViewToolbarButton icon={Sparkles} tooltip="Auto-layout" isDark={isDark} onClick={onAutoLayout} />
      <ViewToolbarButton icon={Map} tooltip="Toggle Minimap" isDark={isDark} onClick={onToggleMinimap} isActive={showMinimap} />
    </div>
  );
};

// Left Panel Component with Model Explorer Tree
function LeftPanel({ isDark }: { isDark: boolean }) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set([]));
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

  const treeData = [
    {
      id: 'model',
      label: 'E-Commerce Model',
      icon: <Database className="w-4 h-4 text-blue-500" />,
      type: 'model',
      children: [
        {
          id: 'subject-areas',
          label: 'Subject Areas',
          icon: <Folder className="w-4 h-4 text-purple-500" />,
          type: 'folder',
          children: [
            {
              id: 'sa-1',
              label: 'Customer Management',
              icon: <Component className="w-4 h-4 text-purple-400" />,
              type: 'subject-area'
            },
            {
              id: 'sa-2',
              label: 'Order Processing',
              icon: <Component className="w-4 h-4 text-purple-400" />,
              type: 'subject-area'
            }
          ]
        },
        {
          id: 'domains',
          label: 'Domains',
          icon: <Globe className="w-4 h-4 text-blue-500" />,
          type: 'folder',
          children: [
            {
              id: 'domain-1',
              label: 'EmailAddress',
              icon: <Type className="w-4 h-4 text-blue-400" />,
              type: 'domain'
            },
            {
              id: 'domain-2',
              label: 'Currency',
              icon: <Type className="w-4 h-4 text-blue-400" />,
              type: 'domain'
            }
          ]
        },
        {
          id: 'tables',
          label: 'Tables (2)',
          icon: <Table2 className="w-4 h-4 text-purple-500" />,
          type: 'folder',
          children: [
            {
              id: 'table-users',
              label: 'Users',
              icon: <Users className="w-4 h-4 text-purple-500" />,
              type: 'table',
              children: [
                {
                  id: 'table-users-columns',
                  label: 'Columns',
                  icon: <Hash className="w-4 h-4 text-gray-500" />,
                  type: 'folder',
                  children: [
                    {
                      id: 'col-user-id',
                      label: 'user_id (PK)',
                      icon: <Key className="w-3.5 h-3.5 text-yellow-500" />,
                      type: 'column'
                    },
                    {
                      id: 'col-email',
                      label: 'email',
                      icon: <Type className="w-3.5 h-3.5 text-gray-500" />,
                      type: 'column'
                    },
                    {
                      id: 'col-name',
                      label: 'name',
                      icon: <Type className="w-3.5 h-3.5 text-gray-500" />,
                      type: 'column'
                    },
                    {
                      id: 'col-created-at',
                      label: 'created_at',
                      icon: <Type className="w-3.5 h-3.5 text-gray-500" />,
                      type: 'column'
                    }
                  ]
                },
                {
                  id: 'table-users-keys',
                  label: 'Keys',
                  icon: <KeyRound className="w-4 h-4 text-yellow-500" />,
                  type: 'folder',
                  children: [
                    {
                      id: 'key-users-pk',
                      label: 'PK_Users',
                      icon: <Key className="w-3.5 h-3.5 text-yellow-500" />,
                      type: 'key'
                    }
                  ]
                },
                {
                  id: 'table-users-indexes',
                  label: 'Indexes',
                  icon: <Zap className="w-4 h-4 text-orange-500" />,
                  type: 'folder',
                  children: [
                    {
                      id: 'idx-users-email',
                      label: 'IDX_Users_Email',
                      icon: <Zap className="w-3.5 h-3.5 text-orange-500" />,
                      type: 'index'
                    }
                  ]
                },
                {
                  id: 'table-users-triggers',
                  label: 'Triggers',
                  icon: <Zap className="w-4 h-4 text-red-500" />,
                  type: 'folder',
                  children: []
                },
                {
                  id: 'table-users-constraints',
                  label: 'Check Constraints',
                  icon: <Lock className="w-4 h-4 text-blue-500" />,
                  type: 'folder',
                  children: [
                    {
                      id: 'chk-users-email',
                      label: 'CHK_Users_Email',
                      icon: <Lock className="w-3.5 h-3.5 text-blue-500" />,
                      type: 'constraint'
                    }
                  ]
                }
              ]
            },
            {
              id: 'table-orders',
              label: 'Orders',
              icon: <Table2 className="w-4 h-4 text-purple-500" />,
              type: 'table',
              children: [
                {
                  id: 'table-orders-columns',
                  label: 'Columns',
                  icon: <Hash className="w-4 h-4 text-gray-500" />,
                  type: 'folder',
                  children: [
                    {
                      id: 'col-order-id',
                      label: 'order_id (PK)',
                      icon: <Key className="w-3.5 h-3.5 text-yellow-500" />,
                      type: 'column'
                    },
                    {
                      id: 'col-user-id-fk',
                      label: 'user_id (FK)',
                      icon: <LinkIcon className="w-3.5 h-3.5 text-blue-500" />,
                      type: 'column'
                    },
                    {
                      id: 'col-order-date',
                      label: 'order_date',
                      icon: <Type className="w-3.5 h-3.5 text-gray-500" />,
                      type: 'column'
                    },
                    {
                      id: 'col-total',
                      label: 'total_amount',
                      icon: <Type className="w-3.5 h-3.5 text-gray-500" />,
                      type: 'column'
                    }
                  ]
                },
                {
                  id: 'table-orders-keys',
                  label: 'Keys',
                  icon: <KeyRound className="w-4 h-4 text-yellow-500" />,
                  type: 'folder',
                  children: [
                    {
                      id: 'key-orders-pk',
                      label: 'PK_Orders',
                      icon: <Key className="w-3.5 h-3.5 text-yellow-500" />,
                      type: 'key'
                    },
                    {
                      id: 'key-orders-fk',
                      label: 'FK_Orders_Users',
                      icon: <LinkIcon className="w-3.5 h-3.5 text-blue-500" />,
                      type: 'key'
                    }
                  ]
                },
                {
                  id: 'table-orders-indexes',
                  label: 'Indexes',
                  icon: <Zap className="w-4 h-4 text-orange-500" />,
                  type: 'folder',
                  children: [
                    {
                      id: 'idx-orders-date',
                      label: 'IDX_Orders_Date',
                      icon: <Zap className="w-3.5 h-3.5 text-orange-500" />,
                      type: 'index'
                    }
                  ]
                },
                {
                  id: 'table-orders-triggers',
                  label: 'Triggers',
                  icon: <Zap className="w-4 h-4 text-red-500" />,
                  type: 'folder',
                  children: []
                },
                {
                  id: 'table-orders-constraints',
                  label: 'Check Constraints',
                  icon: <Lock className="w-4 h-4 text-blue-500" />,
                  type: 'folder',
                  children: []
                }
              ]
            }
          ]
        },
        {
          id: 'relationships',
          label: 'Relationships (2)',
          icon: <GitBranch className="w-4 h-4 text-green-500" />,
          type: 'folder',
          children: [
            {
              id: 'relationships-identifying',
              label: 'Identifying',
              icon: <GitBranch className="w-4 h-4 text-green-600" />,
              type: 'folder',
              children: []
            },
            {
              id: 'relationships-non-identifying',
              label: 'Non-identifying',
              icon: <GitMerge className="w-4 h-4 text-green-600" />,
              type: 'folder',
              children: [
                {
                  id: 'rel-users-orders',
                  label: 'Users → Orders',
                  icon: <GitMerge className="w-4 h-4 text-green-500" />,
                  type: 'relationship'
                }
              ]
            }
          ]
        },
        {
          id: 'views',
          label: 'Views (2)',
          icon: <Eye className="w-4 h-4 text-cyan-500" />,
          type: 'folder',
          children: [
            {
              id: 'views-logical',
              label: 'Logical Views',
              icon: <Eye className="w-4 h-4 text-cyan-600" />,
              type: 'folder',
              children: [
                {
                  id: 'view-customer-summary',
                  label: 'CustomerSummary',
                  icon: <Eye className="w-4 h-4 text-cyan-500" />,
                  type: 'view'
                }
              ]
            },
            {
              id: 'views-physical',
              label: 'Physical Views',
              icon: <FileCode className="w-4 h-4 text-cyan-600" />,
              type: 'folder',
              children: [
                {
                  id: 'view-order-details',
                  label: 'VW_OrderDetails',
                  icon: <FileCode className="w-4 h-4 text-cyan-500" />,
                  type: 'view'
                }
              ]
            }
          ]
        },
        {
          id: 'stored-procedures',
          label: 'Stored Procedures',
          icon: <Command className="w-4 h-4 text-red-600" />,
          type: 'folder',
          children: [
            {
              id: 'sp-get-user-orders',
              label: 'sp_GetUserOrders',
              icon: <Command className="w-4 h-4 text-red-500" />,
              type: 'procedure'
            }
          ]
        },
        {
          id: 'functions',
          label: 'Functions',
          icon: <Code className="w-4 h-4 text-orange-600" />,
          type: 'folder',
          children: [
            {
              id: 'fn-calculate-total',
              label: 'fn_CalculateTotal',
              icon: <Code className="w-4 h-4 text-orange-500" />,
              type: 'function'
            }
          ]
        },
        {
          id: 'sequences',
          label: 'Sequences',
          icon: <Hash className="w-4 h-4 text-purple-600" />,
          type: 'folder',
          children: [
            {
              id: 'seq-order-id',
              label: 'seq_OrderId',
              icon: <Hash className="w-4 h-4 text-purple-500" />,
              type: 'sequence'
            }
          ]
        },
        {
          id: 'user-types',
          label: 'User Defined Types',
          icon: <FileCode className="w-4 h-4 text-indigo-600" />,
          type: 'folder',
          children: [
            {
              id: 'udt-address',
              label: 'AddressType',
              icon: <FileCode className="w-4 h-4 text-indigo-500" />,
              type: 'udt'
            }
          ]
        }
      ]
    }
  ];

  const TreeItem = ({
    id,
    label,
    icon,
    children,
    level = 0
  }: {
    id: string;
    label: string;
    icon: React.ReactNode;
    children?: any[];
    level?: number;
  }) => {
    const isExpanded = expandedItems.has(id);
    const hasChildren = children && children.length > 0;

    return (
      <div>
        <div
          className={`group flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer transition-all duration-200 ${
            isDark
              ? 'text-gray-300 hover:text-gray-100 hover:bg-zinc-800/70'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => hasChildren && toggleExpanded(id)}
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
    <div className="p-3">
      <h3 className={`text-xs font-semibold mb-3 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Model Tree</h3>

      {/* Search Box */}
      <div className="mb-3">
        <div className="relative">
          <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
              isDark
                ? 'bg-zinc-800 border-zinc-700 text-gray-100 placeholder-gray-500 focus:border-indigo-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
            } focus:outline-none focus:ring-1 focus:ring-indigo-500/20`}
          />
        </div>
      </div>

      {/* Tree Items */}
      <div className="space-y-0.5">
        {treeData.map((item) => (
          <TreeItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

// Diagram View Component
function DiagramView({
  tables,
  relationships,
  zoom,
  selectedTable,
  onTableSelect,
  onAddTable,
  onTablesUpdate,
  isDark,
  showGrid,
  snapToGrid,
  isPanMode,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onAutoLayout,
  onToggleGrid,
  onToggleSnap,
  onToggleMinimap,
  onTogglePan,
  showMinimap,
  onRelationshipsUpdate
}: {
  tables: Table[];
  relationships: Relationship[];
  zoom: number;
  selectedTable: string | null;
  onTableSelect: (id: string | null) => void;
  onAddTable: () => void;
  onTablesUpdate: (tables: Table[]) => void;
  isDark: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  isPanMode: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onAutoLayout: () => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
  onToggleMinimap: () => void;
  onTogglePan: () => void;
  showMinimap: boolean;
  onRelationshipsUpdate: (relationships: Relationship[]) => void;
}) {
  const [draggingTable, setDraggingTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDrawingMode, setIsDrawingMode] = useState<'table' | 'annotation' | 'relationship' | null>(null);
  const [selectedRelationshipType, setSelectedRelationshipType] = useState<'identifying' | 'non-identifying' | 'sub-type' | 'many-to-many'>('identifying');
  const [pendingRelationship, setPendingRelationship] = useState<{
    fromTable: string;
    fromSide: 'top' | 'right' | 'bottom' | 'left';
  } | null>(null);

  const handleToolSelection = (mode: 'table' | 'annotation' | 'relationship' | null) => {
    setIsDrawingMode(mode);
    if (mode === 'table') {
      onAddTable();
      setIsDrawingMode(null); // Reset to select mode after adding
    }
  };

  const handleMouseDown = (e: React.MouseEvent, tableId: string, table: Table) => {
    e.stopPropagation();
    setDraggingTable(tableId);
    onTableSelect(tableId);

    // Calculate offset from mouse position to table position
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const parentRect = (e.currentTarget as HTMLElement).offsetParent?.getBoundingClientRect();

    if (parentRect) {
      setDragOffset({
        x: (e.clientX - parentRect.left) / (zoom / 100) - table.x,
        y: (e.clientY - parentRect.top) / (zoom / 100) - table.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingTable) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();

    // Calculate new position accounting for zoom
    let newX = (e.clientX - rect.left) / (zoom / 100) - dragOffset.x;
    let newY = (e.clientY - rect.top) / (zoom / 100) - dragOffset.y;

    // Snap to grid if enabled
    if (snapToGrid) {
      const gridSize = 20;
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    }

    // Update table position
    const updatedTables = tables.map(table =>
      table.id === draggingTable
        ? { ...table, x: Math.max(0, newX), y: Math.max(0, newY) }
        : table
    );
    onTablesUpdate(updatedTables);
  };

  const handleMouseUp = () => {
    setDraggingTable(null);
  };

  const handleRelationshipTypeSelection = (type: 'identifying' | 'non-identifying' | 'sub-type' | 'many-to-many') => {
    setSelectedRelationshipType(type);
  };

  const handleConnectionPointClick = (tableId: string, side: 'top' | 'right' | 'bottom' | 'left') => {
    if (!pendingRelationship) {
      // First click - set source
      setPendingRelationship({ fromTable: tableId, fromSide: side });
    } else {
      // Second click - create relationship
      const newRelationship: Relationship = {
        id: `rel-${Date.now()}`,
        fromTable: pendingRelationship.fromTable,
        toTable: tableId,
        type: selectedRelationshipType === 'many-to-many' ? 'N:M' : '1:N',
        relationshipType: selectedRelationshipType,
        fromSide: pendingRelationship.fromSide,
        toSide: side
      };

      onRelationshipsUpdate([...relationships, newRelationship]);
      setPendingRelationship(null);
    }
  };

  // Helper to get connection point coordinates
  const getConnectionPoint = (table: Table, side: 'top' | 'right' | 'bottom' | 'left') => {
    const tableWidth = 200; // minWidth from table style
    const tableHeight = 100; // approximate height

    switch (side) {
      case 'top':
        return { x: table.x + tableWidth / 2, y: table.y };
      case 'right':
        return { x: table.x + tableWidth, y: table.y + tableHeight / 2 };
      case 'bottom':
        return { x: table.x + tableWidth / 2, y: table.y + tableHeight };
      case 'left':
        return { x: table.x, y: table.y + tableHeight / 2 };
    }
  };

  return (
    <motion.div
      key="diagram"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex-1 overflow-auto relative ${isDark ? 'bg-zinc-950' : 'bg-gray-50'}`}
      style={{
        backgroundImage: showGrid
          ? isDark
            ? 'radial-gradient(circle, #3A3A3A 1px, transparent 1px)'
            : 'radial-gradient(circle, #D1D5DB 1px, transparent 1px)'
          : 'none',
        backgroundSize: '20px 20px',
        cursor: isPanMode ? 'grab' : 'default'
      }}
    >
      <div
        className="relative"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top left',
          width: `${(100 / zoom) * 100}%`,
          height: `${(100 / zoom) * 100}%`,
          minHeight: '100%',
          minWidth: '100%'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* SVG Layer for Relationships */}
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: '100%',
            height: '100%',
            zIndex: 0
          }}
        >
          {relationships.map(rel => {
            const fromTable = tables.find(t => t.id === rel.fromTable);
            const toTable = tables.find(t => t.id === rel.toTable);

            if (!fromTable || !toTable || !rel.fromSide || !rel.toSide) return null;

            const fromPoint = getConnectionPoint(fromTable, rel.fromSide);
            const toPoint = getConnectionPoint(toTable, rel.toSide);

            const strokeColor = isDark ? '#818cf8' : '#6366f1'; // indigo color

            // Calculate angle for proper marker orientation
            const angle = Math.atan2(toPoint.y - fromPoint.y, toPoint.x - fromPoint.x) * 180 / Math.PI;

            // Helper to render IDEF1X notation at connection point
            const renderParentNotation = (point: {x: number, y: number}, side: string) => {
              const offset = 15;
              let x = point.x;
              let y = point.y;

              // Position based on connection side
              if (side === 'right') { x += offset; }
              else if (side === 'left') { x -= offset; }
              else if (side === 'bottom') { y += offset; }
              else if (side === 'top') { y -= offset; }

              return { x, y };
            };

            const renderChildNotation = (point: {x: number, y: number}, side: string) => {
              const offset = 15;
              let x = point.x;
              let y = point.y;

              if (side === 'right') { x += offset; }
              else if (side === 'left') { x -= offset; }
              else if (side === 'bottom') { y += offset; }
              else if (side === 'top') { y -= offset; }

              return { x, y };
            };

            const isDashed = rel.relationshipType === 'non-identifying';

            return (
              <g key={rel.id}>
                {/* Main relationship line */}
                <line
                  x1={fromPoint.x}
                  y1={fromPoint.y}
                  x2={toPoint.x}
                  y2={toPoint.y}
                  stroke={strokeColor}
                  strokeWidth="2"
                  strokeDasharray={isDashed ? '8 4' : '0'}
                  className="pointer-events-auto"
                />

                {/* IDEF1X Notation based on relationship type */}

                {/* Identifying Relationship: Solid line with filled circle at child end */}
                {rel.relationshipType === 'identifying' && (
                  <>
                    {/* Parent end: Simple line end (already rendered) */}

                    {/* Child end: Filled circle (dot) notation */}
                    <circle
                      cx={toPoint.x}
                      cy={toPoint.y}
                      r="6"
                      fill={strokeColor}
                      stroke={strokeColor}
                      strokeWidth="1"
                    />

                    {/* Crow's foot for "many" side at child */}
                    {(() => {
                      const crowOffset = 12;
                      const crowSize = 8;
                      let cx = toPoint.x, cy = toPoint.y;

                      if (rel.toSide === 'left') {
                        cx -= crowOffset;
                        return (
                          <>
                            <line x1={cx} y1={cy} x2={cx - crowSize} y2={cy - crowSize} stroke={strokeColor} strokeWidth="2" />
                            <line x1={cx} y1={cy} x2={cx - crowSize} y2={cy + crowSize} stroke={strokeColor} strokeWidth="2" />
                          </>
                        );
                      } else if (rel.toSide === 'right') {
                        cx += crowOffset;
                        return (
                          <>
                            <line x1={cx} y1={cy} x2={cx + crowSize} y2={cy - crowSize} stroke={strokeColor} strokeWidth="2" />
                            <line x1={cx} y1={cy} x2={cx + crowSize} y2={cy + crowSize} stroke={strokeColor} strokeWidth="2" />
                          </>
                        );
                      } else if (rel.toSide === 'top') {
                        cy -= crowOffset;
                        return (
                          <>
                            <line x1={cx} y1={cy} x2={cx - crowSize} y2={cy - crowSize} stroke={strokeColor} strokeWidth="2" />
                            <line x1={cx} y1={cy} x2={cx + crowSize} y2={cy - crowSize} stroke={strokeColor} strokeWidth="2" />
                          </>
                        );
                      } else {
                        cy += crowOffset;
                        return (
                          <>
                            <line x1={cx} y1={cy} x2={cx - crowSize} y2={cy + crowSize} stroke={strokeColor} strokeWidth="2" />
                            <line x1={cx} y1={cy} x2={cx + crowSize} y2={cy + crowSize} stroke={strokeColor} strokeWidth="2" />
                          </>
                        );
                      }
                    })()}
                  </>
                )}

                {/* Non-Identifying Relationship: Dashed line with circle and crow's foot */}
                {rel.relationshipType === 'non-identifying' && (
                  <>
                    {/* Child end: Hollow circle notation */}
                    <circle
                      cx={toPoint.x}
                      cy={toPoint.y}
                      r="6"
                      fill={isDark ? '#0f172a' : 'white'}
                      stroke={strokeColor}
                      strokeWidth="2"
                    />

                    {/* Crow's foot for "many" side */}
                    {(() => {
                      const crowOffset = 12;
                      const crowSize = 8;
                      let cx = toPoint.x, cy = toPoint.y;

                      if (rel.toSide === 'left') {
                        cx -= crowOffset;
                        return (
                          <>
                            <line x1={cx} y1={cy} x2={cx - crowSize} y2={cy - crowSize} stroke={strokeColor} strokeWidth="2" />
                            <line x1={cx} y1={cy} x2={cx - crowSize} y2={cy + crowSize} stroke={strokeColor} strokeWidth="2" />
                          </>
                        );
                      } else if (rel.toSide === 'right') {
                        cx += crowOffset;
                        return (
                          <>
                            <line x1={cx} y1={cy} x2={cx + crowSize} y2={cy - crowSize} stroke={strokeColor} strokeWidth="2" />
                            <line x1={cx} y1={cy} x2={cx + crowSize} y2={cy + crowSize} stroke={strokeColor} strokeWidth="2" />
                          </>
                        );
                      } else if (rel.toSide === 'top') {
                        cy -= crowOffset;
                        return (
                          <>
                            <line x1={cx} y1={cy} x2={cx - crowSize} y2={cy - crowSize} stroke={strokeColor} strokeWidth="2" />
                            <line x1={cx} y1={cy} x2={cx + crowSize} y2={cy - crowSize} stroke={strokeColor} strokeWidth="2" />
                          </>
                        );
                      } else {
                        cy += crowOffset;
                        return (
                          <>
                            <line x1={cx} y1={cy} x2={cx - crowSize} y2={cy + crowSize} stroke={strokeColor} strokeWidth="2" />
                            <line x1={cx} y1={cy} x2={cx + crowSize} y2={cy + crowSize} stroke={strokeColor} strokeWidth="2" />
                          </>
                        );
                      }
                    })()}
                  </>
                )}

                {/* Sub-type (Categorization) Relationship: Line with category symbol */}
                {rel.relationshipType === 'sub-type' && (
                  <>
                    {/* Category symbol - circle with horizontal line through it */}
                    <circle
                      cx={fromPoint.x + (toPoint.x - fromPoint.x) / 2}
                      cy={fromPoint.y + (toPoint.y - fromPoint.y) / 2}
                      r="12"
                      fill={isDark ? '#0f172a' : 'white'}
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                    <line
                      x1={fromPoint.x + (toPoint.x - fromPoint.x) / 2 - 12}
                      y1={fromPoint.y + (toPoint.y - fromPoint.y) / 2}
                      x2={fromPoint.x + (toPoint.x - fromPoint.x) / 2 + 12}
                      y2={fromPoint.y + (toPoint.y - fromPoint.y) / 2}
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                  </>
                )}

                {/* Many-to-Many: Crow's feet on both ends */}
                {rel.relationshipType === 'many-to-many' && (
                  <>
                    {/* Crow's foot at parent (from) end */}
                    {(() => {
                      const crowOffset = 8;
                      const crowSize = 8;
                      let cx = fromPoint.x, cy = fromPoint.y;

                      if (rel.fromSide === 'left') {
                        cx -= crowOffset;
                        return (
                          <>
                            <line x1={cx} y1={cy} x2={cx - crowSize} y2={cy - crowSize} stroke={strokeColor} strokeWidth="2" />
                            <line x1={cx} y1={cy} x2={cx - crowSize} y2={cy + crowSize} stroke={strokeColor} strokeWidth="2" />
                          </>
                        );
                      } else if (rel.fromSide === 'right') {
                        cx += crowOffset;
                        return (
                          <>
                            <line x1={cx} y1={cy} x2={cx + crowSize} y2={cy - crowSize} stroke={strokeColor} strokeWidth="2" />
                            <line x1={cx} y1={cy} x2={cx + crowSize} y2={cy + crowSize} stroke={strokeColor} strokeWidth="2" />
                          </>
                        );
                      } else if (rel.fromSide === 'top') {
                        cy -= crowOffset;
                        return (
                          <>
                            <line x1={cx} y1={cy} x2={cx - crowSize} y2={cy - crowSize} stroke={strokeColor} strokeWidth="2" />
                            <line x1={cx} y1={cy} x2={cx + crowSize} y2={cy - crowSize} stroke={strokeColor} strokeWidth="2" />
                          </>
                        );
                      } else {
                        cy += crowOffset;
                        return (
                          <>
                            <line x1={cx} y1={cy} x2={cx - crowSize} y2={cy + crowSize} stroke={strokeColor} strokeWidth="2" />
                            <line x1={cx} y1={cy} x2={cx + crowSize} y2={cy + crowSize} stroke={strokeColor} strokeWidth="2" />
                          </>
                        );
                      }
                    })()}

                    {/* Crow's foot at child (to) end */}
                    {(() => {
                      const crowOffset = 8;
                      const crowSize = 8;
                      let cx = toPoint.x, cy = toPoint.y;

                      if (rel.toSide === 'left') {
                        cx -= crowOffset;
                        return (
                          <>
                            <line x1={cx} y1={cy} x2={cx - crowSize} y2={cy - crowSize} stroke={strokeColor} strokeWidth="2" />
                            <line x1={cx} y1={cy} x2={cx - crowSize} y2={cy + crowSize} stroke={strokeColor} strokeWidth="2" />
                          </>
                        );
                      } else if (rel.toSide === 'right') {
                        cx += crowOffset;
                        return (
                          <>
                            <line x1={cx} y1={cy} x2={cx + crowSize} y2={cy - crowSize} stroke={strokeColor} strokeWidth="2" />
                            <line x1={cx} y1={cy} x2={cx + crowSize} y2={cy + crowSize} stroke={strokeColor} strokeWidth="2" />
                          </>
                        );
                      } else if (rel.toSide === 'top') {
                        cy -= crowOffset;
                        return (
                          <>
                            <line x1={cx} y1={cy} x2={cx - crowSize} y2={cy - crowSize} stroke={strokeColor} strokeWidth="2" />
                            <line x1={cx} y1={cy} x2={cx + crowSize} y2={cy - crowSize} stroke={strokeColor} strokeWidth="2" />
                          </>
                        );
                      } else {
                        cy += crowOffset;
                        return (
                          <>
                            <line x1={cx} y1={cy} x2={cx - crowSize} y2={cy + crowSize} stroke={strokeColor} strokeWidth="2" />
                            <line x1={cx} y1={cy} x2={cx + crowSize} y2={cy + crowSize} stroke={strokeColor} strokeWidth="2" />
                          </>
                        );
                      }
                    })()}
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Render Tables */}
        {tables.map(table => (
          <div
            key={table.id}
            onMouseDown={(e) => handleMouseDown(e, table.id, table)}
            className={`absolute rounded-lg shadow-sm border-2 transition-colors select-none ${
              draggingTable === table.id ? 'cursor-grabbing' : 'cursor-grab'
            } ${
              selectedTable === table.id
                ? 'border-indigo-500 shadow-lg'
                : isDark
                  ? 'border-zinc-700 hover:border-zinc-600 bg-zinc-800'
                  : 'border-gray-300 hover:border-gray-400 bg-white'
            }`}
            style={{
              left: `${table.x}px`,
              top: `${table.y}px`,
              minWidth: '200px'
            }}
          >
            {/* Table Header */}
            <div className={`px-3 py-2 border-b rounded-t-lg ${
              isDark
                ? 'bg-zinc-900 border-zinc-700'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <Database className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-xs font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {table.name}
                </span>
              </div>
            </div>

            {/* Columns */}
            <div className="p-2">
              {table.columns.map(col => (
                <div
                  key={col.id}
                  className={`flex items-center gap-2 px-2 py-1 text-xs rounded ${
                    isDark ? 'hover:bg-zinc-700' : 'hover:bg-gray-100'
                  }`}
                >
                  {col.isPK && (
                    <span className="w-4 h-4 flex items-center justify-center bg-amber-500/20 text-amber-400 rounded text-xs font-bold">
                      PK
                    </span>
                  )}
                  <span className={`flex-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {col.name}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {col.dataType}
                  </span>
                </div>
              ))}
            </div>

            {/* Connection Points */}
            {isDrawingMode === 'relationship' && (
              <>
                {/* Top Connection Point */}
                <div
                  className={`absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 cursor-pointer transition-all hover:scale-125 ${
                    pendingRelationship?.fromTable === table.id && pendingRelationship?.fromSide === 'top'
                      ? 'bg-green-500 border-green-400 animate-pulse'
                      : isDark
                        ? 'bg-indigo-600 border-indigo-400 hover:bg-indigo-500'
                        : 'bg-indigo-500 border-indigo-300 hover:bg-indigo-600'
                  }`}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleConnectionPointClick(table.id, 'top');
                  }}
                />

                {/* Right Connection Point */}
                <div
                  className={`absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-3 rounded-full border-2 cursor-pointer transition-all hover:scale-125 ${
                    pendingRelationship?.fromTable === table.id && pendingRelationship?.fromSide === 'right'
                      ? 'bg-green-500 border-green-400 animate-pulse'
                      : isDark
                        ? 'bg-indigo-600 border-indigo-400 hover:bg-indigo-500'
                        : 'bg-indigo-500 border-indigo-300 hover:bg-indigo-600'
                  }`}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleConnectionPointClick(table.id, 'right');
                  }}
                />

                {/* Bottom Connection Point */}
                <div
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 cursor-pointer transition-all hover:scale-125 ${
                    pendingRelationship?.fromTable === table.id && pendingRelationship?.fromSide === 'bottom'
                      ? 'bg-green-500 border-green-400 animate-pulse'
                      : isDark
                        ? 'bg-indigo-600 border-indigo-400 hover:bg-indigo-500'
                        : 'bg-indigo-500 border-indigo-300 hover:bg-indigo-600'
                  }`}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleConnectionPointClick(table.id, 'bottom');
                  }}
                />

                {/* Left Connection Point */}
                <div
                  className={`absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-3 rounded-full border-2 cursor-pointer transition-all hover:scale-125 ${
                    pendingRelationship?.fromTable === table.id && pendingRelationship?.fromSide === 'left'
                      ? 'bg-green-500 border-green-400 animate-pulse'
                      : isDark
                        ? 'bg-indigo-600 border-indigo-400 hover:bg-indigo-500'
                        : 'bg-indigo-500 border-indigo-300 hover:bg-indigo-600'
                  }`}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleConnectionPointClick(table.id, 'left');
                  }}
                />
              </>
            )}
          </div>
        ))}

        {/* Empty State */}
        {tables.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Database className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                No Tables Yet
              </h3>
              <p className={`text-xs mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Start by adding your first table to the diagram
              </p>
              <button
                onClick={onAddTable}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Table
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Toolbars */}
      <ObjectToolbar
        isDark={isDark}
        isDrawingMode={isDrawingMode}
        onSelectTool={handleToolSelection}
        onSelectRelationshipType={handleRelationshipTypeSelection}
      />
      <ViewControlsToolbar
        isDark={isDark}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onFitToScreen={onFitToScreen}
        onAutoLayout={onAutoLayout}
        zoomLevel={zoom}
        showGrid={showGrid}
        onToggleGrid={onToggleGrid}
        snapToGrid={snapToGrid}
        onToggleSnap={onToggleSnap}
        showMinimap={showMinimap}
        onToggleMinimap={onToggleMinimap}
        isPanMode={isPanMode}
        onTogglePan={onTogglePan}
      />

      {/* Minimap */}
      {showMinimap && (
        <div className={`absolute bottom-6 right-6 w-48 h-32 rounded-lg border overflow-hidden z-50 shadow-lg ${
          isDark ? 'bg-zinc-800/95 border-zinc-700' : 'bg-white/95 border-gray-200'
        }`}>
          <div className="w-full h-full relative" style={{
            backgroundImage: showGrid
              ? isDark
                ? 'radial-gradient(circle, #3A3A3A 1px, transparent 1px)'
                : 'radial-gradient(circle, #D1D5DB 1px, transparent 1px)'
              : 'none',
            backgroundSize: '4px 4px'
          }}>
            {tables.map(table => (
              <div
                key={table.id}
                className={`absolute rounded ${
                  selectedTable === table.id
                    ? 'bg-indigo-500'
                    : isDark ? 'bg-zinc-600' : 'bg-gray-400'
                }`}
                style={{
                  left: `${(table.x / 2000) * 100}%`,
                  top: `${(table.y / 2000) * 100}%`,
                  width: '8px',
                  height: '8px'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Quick Editor Component is now imported from QuickEditorNew.tsx

// Properties View Component - Model Explorer + Context Properties
function PropertiesView({ selectedTable, isDark }: { selectedTable?: Table; isDark: boolean }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['model', 'tables', 'relationships', 'table-users', 'table-orders']));
  const [selectedItem, setSelectedItem] = useState<{type: 'model' | 'table' | 'relationship' | 'column' | 'index' | 'constraint' | 'view', id?: string} | null>({ type: 'model' });
  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');
  const [filterType, setFilterType] = useState<'all' | 'tables' | 'columns' | 'relationships'>('all');

  // Property values state - This makes properties editable and persistent
  const [properties, setProperties] = useState({
    modelName: 'E-Commerce Model',
    modelDescription: 'A comprehensive e-commerce data model supporting products, orders, and customers.',
    modelVersion: '1.0.0',
    modelAuthor: 'Data Team',
    modelSubjectArea: 'E-Commerce',
    modelDomain: 'Sales & Customer Management',
    modelOwner: 'Data Architecture Team',
    modelStatus: 'Active',
    tableName: 'Users',
    tableSchema: 'public',
    tableDescription: 'Stores user account information...',
  });

  // Columns state for the selected table
  const [columns, setColumns] = useState([
    { id: 'col-1', name: 'user_id', dataType: 'INTEGER', isPK: true, isFK: false, isNullable: false, defaultValue: '' },
    { id: 'col-2', name: 'username', dataType: 'VARCHAR(50)', isPK: false, isFK: false, isNullable: false, defaultValue: '' },
    { id: 'col-3', name: 'email', dataType: 'VARCHAR(100)', isPK: false, isFK: false, isNullable: false, defaultValue: '' },
    { id: 'col-4', name: 'created_at', dataType: 'TIMESTAMP', isPK: false, isFK: false, isNullable: false, defaultValue: 'CURRENT_TIMESTAMP' },
  ]);

  // Indexes state
  const [indexes, setIndexes] = useState([
    { id: 'idx-1', name: 'idx_users_email', table: 'Users', columns: ['email'], isUnique: true, type: 'BTREE' },
    { id: 'idx-2', name: 'idx_users_username', table: 'Users', columns: ['username'], isUnique: false, type: 'BTREE' },
  ]);

  // Constraints state
  const [constraints, setConstraints] = useState([
    { id: 'const-1', name: 'fk_orders_user', type: 'Foreign Key', table: 'Orders', referencedTable: 'Users', columns: 'user_id' },
    { id: 'const-2', name: 'chk_order_total', type: 'Check', table: 'Orders', condition: 'total_amount > 0', columns: 'total_amount' },
  ]);

  // Editing state
  const [editingColumn, setEditingColumn] = useState<any>(null);
  const [editingIndex, setEditingIndex] = useState<any>(null);
  const [editingConstraint, setEditingConstraint] = useState<any>(null);
  const [showColumnForm, setShowColumnForm] = useState(false);
  const [showIndexForm, setShowIndexForm] = useState(false);
  const [showConstraintForm, setShowConstraintForm] = useState(false);

  const handlePropertyChange = (key: string, value: string) => {
    setProperties(prev => ({ ...prev, [key]: value }));
    setSaveStatus('unsaved');
  };

  // Column CRUD operations
  const handleAddColumn = () => {
    setEditingColumn({
      id: `col-${Date.now()}`,
      name: '',
      dataType: 'VARCHAR(50)',
      isPK: false,
      isFK: false,
      isNullable: true,
      defaultValue: ''
    });
    setShowColumnForm(true);
  };

  const handleEditColumn = (column: any) => {
    setEditingColumn({ ...column });
    setShowColumnForm(true);
  };

  const handleSaveColumn = () => {
    if (editingColumn) {
      const existingIndex = columns.findIndex(c => c.id === editingColumn.id);
      if (existingIndex >= 0) {
        setColumns(prev => prev.map(c => c.id === editingColumn.id ? editingColumn : c));
      } else {
        setColumns(prev => [...prev, editingColumn]);
      }
      setShowColumnForm(false);
      setEditingColumn(null);
      setSaveStatus('unsaved');
    }
  };

  const handleDeleteColumn = (id: string) => {
    if (confirm('Are you sure you want to delete this column?')) {
      setColumns(prev => prev.filter(c => c.id !== id));
      setSaveStatus('unsaved');
    }
  };

  // Index CRUD operations
  const handleAddIndex = () => {
    setEditingIndex({
      id: `idx-${Date.now()}`,
      name: '',
      table: properties.tableName,
      columns: [],
      isUnique: false,
      type: 'BTREE'
    });
    setShowIndexForm(true);
  };

  const handleEditIndex = (index: any) => {
    setEditingIndex({ ...index });
    setShowIndexForm(true);
  };

  const handleSaveIndex = () => {
    if (editingIndex) {
      const existingIndex = indexes.findIndex(i => i.id === editingIndex.id);
      if (existingIndex >= 0) {
        setIndexes(prev => prev.map(i => i.id === editingIndex.id ? editingIndex : i));
      } else {
        setIndexes(prev => [...prev, editingIndex]);
      }
      setShowIndexForm(false);
      setEditingIndex(null);
      setSaveStatus('unsaved');
    }
  };

  const handleDeleteIndex = (id: string) => {
    if (confirm('Are you sure you want to delete this index?')) {
      setIndexes(prev => prev.filter(i => i.id !== id));
      setSaveStatus('unsaved');
    }
  };

  // Constraint CRUD operations
  const handleAddConstraint = () => {
    setEditingConstraint({
      id: `const-${Date.now()}`,
      name: '',
      type: 'Foreign Key',
      table: properties.tableName,
      referencedTable: '',
      columns: '',
      condition: ''
    });
    setShowConstraintForm(true);
  };

  const handleEditConstraint = (constraint: any) => {
    setEditingConstraint({ ...constraint });
    setShowConstraintForm(true);
  };

  const handleSaveConstraint = () => {
    if (editingConstraint) {
      const existingIndex = constraints.findIndex(c => c.id === editingConstraint.id);
      if (existingIndex >= 0) {
        setConstraints(prev => prev.map(c => c.id === editingConstraint.id ? editingConstraint : c));
      } else {
        setConstraints(prev => [...prev, editingConstraint]);
      }
      setShowConstraintForm(false);
      setEditingConstraint(null);
      setSaveStatus('unsaved');
    }
  };

  const handleDeleteConstraint = (id: string) => {
    if (confirm('Are you sure you want to delete this constraint?')) {
      setConstraints(prev => prev.filter(c => c.id !== id));
      setSaveStatus('unsaved');
    }
  };

  // Keyboard navigation and auto-save
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (saveStatus === 'unsaved') {
          setSaveStatus('saving');
          setTimeout(() => setSaveStatus('saved'), 1000);
        }
      }
      // Escape to cancel/close
      if (e.key === 'Escape') {
        // Could add cancel edit logic here
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveStatus]);

  // Auto-save with debounce
  React.useEffect(() => {
    if (saveStatus === 'unsaved') {
      const timer = setTimeout(() => {
        setSaveStatus('saving');
        setTimeout(() => setSaveStatus('saved'), 800);
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  // Dynamic tree data structure based on actual state
  const treeData = React.useMemo(() => [
    {
      id: 'model',
      label: properties.modelName,
      icon: Database,
      type: 'model' as const,
      children: [
        {
          id: 'subject-areas',
          label: 'Subject Areas',
          icon: Folder,
          children: [
            { id: 'sa-1', label: 'Customer Management', icon: Component, type: 'subject-area' as const },
            { id: 'sa-2', label: 'Order Processing', icon: Component, type: 'subject-area' as const }
          ]
        },
        {
          id: 'domains',
          label: 'Domains',
          icon: Globe,
          children: [
            { id: 'domain-1', label: 'EmailAddress', icon: Type, type: 'domain' as const },
            { id: 'domain-2', label: 'Currency', icon: Type, type: 'domain' as const }
          ]
        },
        {
          id: 'tables',
          label: `Tables (2)`,
          icon: Table2,
          children: [
            {
              id: 'table-users',
              label: properties.tableName,
              icon: Users,
              type: 'table' as const,
              children: [
                {
                  id: 'table-users-columns',
                  label: 'Columns',
                  icon: Hash,
                  children: columns.map(col => ({
                    id: col.id,
                    label: `${col.name}${col.isPK ? ' (PK)' : col.isFK ? ' (FK)' : ''}`,
                    icon: col.isPK ? Key : col.isFK ? LinkIcon : Type,
                    type: 'column' as const
                  }))
                },
                {
                  id: 'table-users-keys',
                  label: 'Keys',
                  icon: KeyRound,
                  children: [
                    { id: 'key-users-pk', label: 'PK_Users', icon: Key, type: 'key' as const }
                  ]
                },
                {
                  id: 'table-users-indexes',
                  label: 'Indexes',
                  icon: Zap,
                  children: indexes.map(idx => ({
                    id: `table-users-${idx.id}`,
                    label: idx.name,
                    icon: idx.isUnique ? KeyRound : Hash,
                    type: 'index' as const
                  }))
                },
                {
                  id: 'table-users-triggers',
                  label: 'Triggers',
                  icon: Zap,
                  children: []
                },
                {
                  id: 'table-users-constraints',
                  label: 'Check Constraints',
                  icon: Lock,
                  children: constraints.map(con => ({
                    id: `table-users-${con.id}`,
                    label: con.name,
                    icon: Lock,
                    type: 'constraint' as const
                  }))
                }
              ]
            },
            {
              id: 'table-orders',
              label: 'Orders',
              icon: Table2,
              type: 'table' as const,
              children: [
                {
                  id: 'table-orders-columns',
                  label: 'Columns',
                  icon: Hash,
                  children: [
                    { id: 'col-order-id', label: 'order_id (PK)', icon: Key, type: 'column' as const },
                    { id: 'col-user-id', label: 'user_id (FK)', icon: LinkIcon, type: 'column' as const },
                    { id: 'col-order-date', label: 'order_date', icon: Type, type: 'column' as const },
                    { id: 'col-total', label: 'total_amount', icon: Type, type: 'column' as const }
                  ]
                },
                {
                  id: 'table-orders-keys',
                  label: 'Keys',
                  icon: KeyRound,
                  children: [
                    { id: 'key-orders-pk', label: 'PK_Orders', icon: Key, type: 'key' as const },
                    { id: 'key-orders-fk', label: 'FK_Orders_Users', icon: LinkIcon, type: 'key' as const }
                  ]
                },
                {
                  id: 'table-orders-indexes',
                  label: 'Indexes',
                  icon: Zap,
                  children: [
                    { id: 'idx-orders-date', label: 'IDX_Orders_Date', icon: Hash, type: 'index' as const }
                  ]
                },
                {
                  id: 'table-orders-triggers',
                  label: 'Triggers',
                  icon: Zap,
                  children: []
                },
                {
                  id: 'table-orders-constraints',
                  label: 'Check Constraints',
                  icon: Lock,
                  children: []
                }
              ]
            }
          ]
        },
        {
          id: 'relationships',
          label: `Relationships (2)`,
          icon: GitBranch,
          children: [
            {
              id: 'relationships-identifying',
              label: 'Identifying',
              icon: GitBranch,
              children: [
                { id: 'rel-1', label: 'Users → Orders', icon: ArrowRight, type: 'relationship' as const }
              ]
            },
            {
              id: 'relationships-non-identifying',
              label: 'Non-identifying',
              icon: GitMerge,
              children: [
                { id: 'rel-2', label: 'Orders → Products', icon: ArrowRight, type: 'relationship' as const }
              ]
            }
          ]
        },
        {
          id: 'views',
          label: 'Views (2)',
          icon: Eye,
          children: [
            {
              id: 'views-logical',
              label: 'Logical Views',
              icon: Eye,
              children: [
                { id: 'view-1', label: 'vw_order_summary', icon: FileText, type: 'view' as const }
              ]
            },
            {
              id: 'views-physical',
              label: 'Physical Views',
              icon: FileCode,
              children: [
                { id: 'view-2', label: 'vw_user_stats', icon: FileText, type: 'view' as const }
              ]
            }
          ]
        },
        {
          id: 'stored-procedures',
          label: 'Stored Procedures',
          icon: Command,
          children: [
            { id: 'proc-1', label: 'sp_GetUserOrders', icon: Command, type: 'procedure' as const },
            { id: 'proc-2', label: 'sp_CreateOrder', icon: Command, type: 'procedure' as const }
          ]
        },
        {
          id: 'functions',
          label: 'Functions',
          icon: FileCode,
          children: [
            { id: 'func-1', label: 'fn_CalculateTotal', icon: FileCode, type: 'function' as const }
          ]
        },
        {
          id: 'sequences',
          label: 'Sequences',
          icon: Hash,
          children: [
            { id: 'seq-1', label: 'SEQ_ORDER_ID', icon: Hash, type: 'sequence' as const }
          ]
        },
        {
          id: 'user-types',
          label: 'User Defined Types',
          icon: Type,
          children: [
            { id: 'udt-1', label: 'Address', icon: Type, type: 'udt' as const }
          ]
        }
      ]
    }
  ], [properties.modelName, properties.tableName, columns, indexes, constraints]);

  const TreeItem = ({ item, level = 0 }: { item: any; level?: number }) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selectedItem?.type === item.type && (item.type === 'model' || selectedItem?.id === item.id);

    return (
      <div className="relative">
        {/* Active highlight line */}
        {isSelected && (
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500 rounded-r" />
        )}
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all duration-200 group ${
            isSelected
              ? isDark ? 'bg-indigo-500/20 text-indigo-400 shadow-sm' : 'bg-indigo-100 text-indigo-700 shadow-sm'
              : isDark ? 'hover:bg-zinc-800/80 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
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
              setSelectedItem({ type: item.type, id: item.id });
              setActiveTab('general');
            }
          }}
          title={item.label}
        >
          {hasChildren && (
            <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
              <ChevronDown className="w-3 h-3" />
            </div>
          )}
          {!hasChildren && <div className="w-3" />}
          <item.icon className={`w-3.5 h-3.5 transition-colors ${
            isSelected
              ? isDark ? 'text-indigo-400' : 'text-indigo-600'
              : isDark ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <span className="text-xs font-medium">{item.label}</span>
          {hasChildren && level === 0 && (
            <div className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <Plus className="w-3 h-3" />
            </div>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-0.5">
            {item.children.map((child: any) => (
              <TreeItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPropertiesContent = () => {
    if (!selectedItem) return null;

    // Tabs configuration - Context-sensitive
    const modelTabs = [
      { id: 'general', label: 'General', icon: FileText },
      { id: 'defaults', label: 'Defaults', icon: Sliders },
      { id: 'ri-defaults', label: 'RI Defaults', icon: Shield },
      { id: 'options', label: 'Options', icon: Settings },
      { id: 'definitions', label: 'Definitions', icon: BookOpen },
      { id: 'udp', label: 'UDP', icon: ClipboardList },
      { id: 'history', label: 'History', icon: History },
      { id: 'notes', label: 'Notes', icon: StickyNote },
      { id: 'extended-notes', label: 'Extended Notes', icon: FileStack }
    ];

    const tableTabs = [
      { id: 'general', label: 'General', icon: FileText },
      { id: 'columns', label: 'Columns', icon: Table2 },
      { id: 'keys', label: 'Keys', icon: KeyRound },
      { id: 'indexes', label: 'Indexes', icon: Zap },
      { id: 'defaults', label: 'Defaults', icon: Sliders },
      { id: 'ri-defaults', label: 'RI Defaults', icon: Shield },
      { id: 'udp', label: 'UDP', icon: ClipboardList },
      { id: 'notes', label: 'Notes', icon: StickyNote },
      { id: 'extended-notes', label: 'Extended Notes', icon: FileStack }
    ];

    const columnTabs = [
      { id: 'general', label: 'General', icon: FileText },
      { id: 'constraints', label: 'Constraints', icon: Lock },
      { id: 'defaults', label: 'Defaults', icon: Sliders },
      { id: 'udp', label: 'UDP', icon: ClipboardList },
      { id: 'notes', label: 'Notes', icon: StickyNote }
    ];

    const relationshipTabs = [
      { id: 'general', label: 'General', icon: FileText },
      { id: 'cardinality', label: 'Cardinality', icon: GitBranch },
      { id: 'udp', label: 'UDP', icon: ClipboardList },
      { id: 'notes', label: 'Notes', icon: StickyNote }
    ];

    const indexTabs = [
      { id: 'general', label: 'General', icon: FileText },
      { id: 'columns', label: 'Columns', icon: Table2 },
      { id: 'udp', label: 'UDP', icon: ClipboardList },
      { id: 'notes', label: 'Notes', icon: StickyNote }
    ];

    const viewTabs = [
      { id: 'general', label: 'General', icon: FileText },
      { id: 'sql', label: 'SQL', icon: FileCode },
      { id: 'udp', label: 'UDP', icon: ClipboardList },
      { id: 'notes', label: 'Notes', icon: StickyNote }
    ];

    const tabs = selectedItem.type === 'model' ? modelTabs
                : selectedItem.type === 'table' ? tableTabs
                : selectedItem.type === 'column' ? columnTabs
                : selectedItem.type === 'index' ? indexTabs
                : selectedItem.type === 'view' ? viewTabs
                : relationshipTabs;

    return (
      <div className="flex h-full flex-col">
        {/* Top Tab Bar */}
        <div className={`border-b transition-colors ${
          isDark ? 'border-zinc-800 bg-zinc-900' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? `${isDark ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-indigo-600 text-indigo-600 bg-indigo-50'}`
                    : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-100 hover:bg-zinc-800/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 overflow-y-auto transition-colors ${
          isDark ? 'bg-zinc-900' : 'bg-white'
        }`}>
            {/* Enhanced Context Header with Breadcrumb */}
            <div className={`p-3 border-b transition-colors ${
              isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-gray-50'
            }`}>
              {/* Breadcrumb Trail */}
              <div className="flex items-center gap-1.5 mb-2">
                <Database className={`w-3 h-3 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>E-Commerce Model</span>
                {selectedItem.type !== 'model' && (
                  <>
                    <ChevronRight className={`w-3 h-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedItem.type === 'table' ? 'Tables' : selectedItem.type === 'relationship' ? 'Relationships' : selectedItem.type === 'column' ? 'Columns' : selectedItem.type === 'index' ? 'Indexes' : selectedItem.type === 'constraint' ? 'Constraints' : 'Views'}
                    </span>
                    <ChevronRight className={`w-3 h-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      {selectedItem.type === 'table' ? 'Users' : selectedItem.type === 'column' ? 'user_id' : selectedItem.type === 'relationship' ? 'Users → Orders' : 'Properties'}
                    </span>
                  </>
                )}
              </div>

              {/* Title with inline editing and status */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  {React.createElement(tabs.find(tab => tab.id === activeTab)!.icon, {
                    className: `w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`
                  })}
                  <h2 className={`text-sm font-semibold ${
                    isDark ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {tabs.find(t => t.id === activeTab)?.label} Properties
                  </h2>
                </div>

                {/* Status Tag */}
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                  saveStatus === 'saved'
                    ? isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                    : saveStatus === 'saving'
                    ? isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                    : isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'
                }`}>
                  {saveStatus === 'saved' && '✓ Saved'}
                  {saveStatus === 'saving' && '↻ Saving...'}
                  {saveStatus === 'unsaved' && '• Unsaved'}
                </div>
              </div>
            </div>

            {/* Content with Section Cards */}
            <div className="p-4 space-y-4">
              {/* Model Properties */}
              {selectedItem.type === 'model' && activeTab === 'general' && (
                <div className="space-y-4">
                  {/* General Info Card */}
                  <div className={`rounded-lg border p-3 shadow-sm ${
                    isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'
                  }`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      <FileText className="w-3.5 h-3.5" />
                      General Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Model Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={properties.modelName}
                          onChange={(e) => handlePropertyChange('modelName', e.target.value)}
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500 focus:bg-zinc-800/80'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:bg-gray-50'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={properties.modelDescription}
                          onChange={(e) => handlePropertyChange('modelDescription', e.target.value)}
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all resize-none ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500 focus:bg-zinc-800/80'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:bg-gray-50'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                          placeholder="Describe your data model..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Metadata Card - Two Column Layout */}
                  <div className={`rounded-lg border p-3 shadow-sm ${
                    isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'
                  }`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      <FileCode className="w-3.5 h-3.5" />
                      Metadata
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Version
                        </label>
                        <input
                          type="text"
                          value={properties.modelVersion}
                          onChange={(e) => handlePropertyChange('modelVersion', e.target.value)}
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Author
                        </label>
                        <input
                          type="text"
                          value={properties.modelAuthor}
                          onChange={(e) => handlePropertyChange('modelAuthor', e.target.value)}
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Created Date
                        </label>
                        <input
                          type="date"
                          defaultValue="2024-01-15"
                          onChange={() => setSaveStatus('unsaved')}
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Last Modified
                        </label>
                        <input
                          type="date"
                          defaultValue="2024-02-10"
                          disabled
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all opacity-60 cursor-not-allowed ${
                            isDark ? 'bg-zinc-800/50 border-zinc-700 text-white'
                                   : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'model' && activeTab === 'settings' && (
                <div className="space-y-4">
                  <div className={`rounded-lg border p-3 shadow-sm ${
                    isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'
                  }`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      <Settings className="w-3.5 h-3.5" />
                      Display Settings
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="autoLayout" className="rounded w-4 h-4" />
                        <label htmlFor="autoLayout" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Enable Auto Layout
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="showGrid" defaultChecked className="rounded w-4 h-4" />
                        <label htmlFor="showGrid" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Show Grid Lines
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="snapToGrid" className="rounded w-4 h-4" />
                        <label htmlFor="snapToGrid" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Snap Elements to Grid
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="showRelLabels" defaultChecked className="rounded w-4 h-4" />
                        <label htmlFor="showRelLabels" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Show Relationship Labels
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'model' && activeTab === 'metadata' && (
                <div className="space-y-4">
                  <div className={`rounded-lg border p-3 shadow-sm ${
                    isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'
                  }`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      <FileCode className="w-3.5 h-3.5" />
                      Business Metadata
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Model Owner
                        </label>
                        <input
                          type="text"
                          value={properties.modelOwner}
                          onChange={(e) => handlePropertyChange('modelOwner', e.target.value)}
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Status
                        </label>
                        <select
                          value={properties.modelStatus}
                          onChange={(e) => handlePropertyChange('modelStatus', e.target.value)}
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                        >
                          <option>Active</option>
                          <option>Draft</option>
                          <option>Deprecated</option>
                          <option>Archived</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Tags
                        </label>
                        <input
                          type="text"
                          placeholder="production, customer-data, pii"
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'model' && activeTab === 'subject' && (
                <div className="space-y-4">
                  <div className={`rounded-lg border p-3 shadow-sm ${
                    isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'
                  }`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      <Folder className="w-3.5 h-3.5" />
                      Subject Area
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Subject Area <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={properties.modelSubjectArea}
                          onChange={(e) => handlePropertyChange('modelSubjectArea', e.target.value)}
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                        >
                          <option>E-Commerce</option>
                          <option>Finance</option>
                          <option>Healthcare</option>
                          <option>Marketing</option>
                          <option>Human Resources</option>
                          <option>Supply Chain</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Description
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Describe the subject area scope and purpose..."
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all resize-none ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                          defaultValue="Covers all aspects of online commerce including product catalog, order management, and customer transactions."
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Business Owner
                        </label>
                        <input
                          type="text"
                          placeholder="Enter business owner name"
                          defaultValue="Product Management Team"
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'model' && activeTab === 'domain' && (
                <div className="space-y-4">
                  <div className={`rounded-lg border p-3 shadow-sm ${
                    isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'
                  }`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      <Globe className="w-3.5 h-3.5" />
                      Domain
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Business Domain <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={properties.modelDomain}
                          onChange={(e) => handlePropertyChange('modelDomain', e.target.value)}
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Domain Category
                        </label>
                        <select
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                        >
                          <option>Operational</option>
                          <option>Analytical</option>
                          <option>Master Data</option>
                          <option>Reference Data</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Domain Description
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Describe the business domain..."
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all resize-none ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                          defaultValue="Manages all sales-related activities and customer relationship management within the e-commerce platform."
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Data Steward
                        </label>
                        <input
                          type="text"
                          placeholder="Enter data steward name"
                          defaultValue="John Doe"
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NEW TABS - Model Level */}
              {selectedItem.type === 'model' && activeTab === 'defaults' && (
                <div className="space-y-4">
                  <div className={`rounded-lg border p-3 shadow-sm ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      <Sliders className="w-3.5 h-3.5" />
                      Entity Defaults
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Default Schema</label>
                        <input type="text" defaultValue="dbo" className={`w-full px-3 py-2 text-xs rounded-md border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500/20`} />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Default Tablespace</label>
                        <input type="text" placeholder="PRIMARY" className={`w-full px-3 py-2 text-xs rounded-md border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500/20`} />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>PK Index Name Format</label>
                        <input type="text" defaultValue="PK_{table_name}" className={`w-full px-3 py-2 text-xs rounded-md border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500/20`} />
                      </div>
                    </div>
                  </div>
                  <div className={`rounded-lg border p-3 shadow-sm ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      <Hash className="w-3.5 h-3.5" />
                      Column Defaults
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Default Datatype</label>
                        <select className={`w-full px-3 py-2 text-xs rounded-md border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                          <option>VARCHAR(255)</option>
                          <option>INT</option>
                          <option>DATETIME</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="defaultNullable" className="rounded w-4 h-4" />
                        <label htmlFor="defaultNullable" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Allow NULL by default</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'model' && activeTab === 'ri-defaults' && (
                <div className="space-y-4">
                  <div className={`rounded-lg border p-3 shadow-sm ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      <Shield className="w-3.5 h-3.5" />
                      Referential Integrity Actions
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>On Update Action</label>
                        <select className={`w-full px-3 py-2 text-xs rounded-md border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                          <option>NO ACTION</option>
                          <option>CASCADE</option>
                          <option>SET NULL</option>
                          <option>SET DEFAULT</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>On Delete Action</label>
                        <select className={`w-full px-3 py-2 text-xs rounded-md border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                          <option>NO ACTION</option>
                          <option>CASCADE</option>
                          <option>SET NULL</option>
                          <option>SET DEFAULT</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="enforceFKConstraints" defaultChecked className="rounded w-4 h-4" />
                        <label htmlFor="enforceFKConstraints" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Enforce Foreign Key Constraints</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="genPhysicalConstraints" defaultChecked className="rounded w-4 h-4" />
                        <label htmlFor="genPhysicalConstraints" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Generate Physical Constraints</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'model' && activeTab === 'options' && (
                <div className="space-y-4">
                  <div className={`rounded-lg border p-3 shadow-sm ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      <Eye className="w-3.5 h-3.5" />
                      Display Settings
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="showDatatypes" defaultChecked className="rounded w-4 h-4" />
                        <label htmlFor="showDatatypes" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Show Datatypes in Diagram</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="showRelationships" defaultChecked className="rounded w-4 h-4" />
                        <label htmlFor="showRelationships" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Display FK Relationships</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="showIndexes" className="rounded w-4 h-4" />
                        <label htmlFor="showIndexes" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Display Indexes</label>
                      </div>
                    </div>
                  </div>
                  <div className={`rounded-lg border p-3 shadow-sm ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      <Settings className="w-3.5 h-3.5" />
                      Validation
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="realtimeValidation" defaultChecked className="rounded w-4 h-4" />
                        <label htmlFor="realtimeValidation" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Enable Real-time Validation</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="showWarnings" defaultChecked className="rounded w-4 h-4" />
                        <label htmlFor="showWarnings" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Show Non-standard Datatype Warnings</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'model' && activeTab === 'definitions' && (
                <div className="space-y-4">
                  <div className={`rounded-lg border p-3 shadow-sm ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      <BookOpen className="w-3.5 h-3.5" />
                      Definitions
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Business Definition</label>
                        <textarea rows={4} placeholder="Enter business definition..." className={`w-full px-3 py-2 text-xs rounded-md border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}></textarea>
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Technical Definition</label>
                        <textarea rows={4} placeholder="Enter technical definition..." className={`w-full px-3 py-2 text-xs rounded-md border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}></textarea>
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Source System</label>
                        <input type="text" placeholder="Enter source system" className={`w-full px-3 py-2 text-xs rounded-md border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500/20`} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'model' && activeTab === 'udp' && (
                <div className="space-y-4">
                  <div className={`rounded-lg border p-3 shadow-sm ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        <ClipboardList className="w-3.5 h-3.5" />
                        User Defined Properties
                      </h3>
                      <button className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded transition-colors">
                        <Plus className="w-3 h-3 inline mr-1" />
                        Add UDP
                      </button>
                    </div>
                    <div className={`text-xs text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No user-defined properties yet</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'model' && activeTab === 'history' && (
                <div className="space-y-4">
                  <div className={`rounded-lg border p-3 shadow-sm ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      <History className="w-3.5 h-3.5" />
                      Version History
                    </h3>
                    <div className="space-y-2">
                      <div className={`p-2 rounded border ${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>v2.1.0</span>
                          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>2025-01-10</span>
                        </div>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Added Order tables and relationships</p>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Modified by: John Doe</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'model' && activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className={`rounded-lg border p-3 shadow-sm ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      <StickyNote className="w-3.5 h-3.5" />
                      Model Notes
                    </h3>
                    <textarea rows={8} placeholder="Enter notes about this model..." className={`w-full px-3 py-2 text-xs rounded-md border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}></textarea>
                  </div>
                </div>
              )}

              {selectedItem.type === 'model' && activeTab === 'extended-notes' && (
                <div className="space-y-4">
                  <div className={`rounded-lg border p-3 shadow-sm ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      <FileStack className="w-3.5 h-3.5" />
                      Extended Documentation
                    </h3>
                    <div className="space-y-3">
                      <textarea rows={12} placeholder="Enter detailed documentation with formatting support..." className={`w-full px-3 py-2 text-xs rounded-md border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}></textarea>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>External References</label>
                        <input type="url" placeholder="https://wiki.example.com/model-docs" className={`w-full px-3 py-2 text-xs rounded-md border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500/20`} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Table Properties */}
              {selectedItem.type === 'table' && activeTab === 'general' && (
                <div className="space-y-4">
                  {/* Basic Info Card */}
                  <div className={`rounded-lg border p-3 shadow-sm ${
                    isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'
                  }`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      <Table2 className="w-3.5 h-3.5" />
                      Table Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Table Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={properties.tableName}
                          onChange={(e) => handlePropertyChange('tableName', e.target.value)}
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Schema
                        </label>
                        <input
                          type="text"
                          value={properties.tableSchema}
                          onChange={(e) => handlePropertyChange('tableSchema', e.target.value)}
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Type
                          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`} title="Table type">ℹ️</span>
                        </label>
                        <select
                          onChange={() => setSaveStatus('unsaved')}
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                        >
                          <option>Standard Table</option>
                          <option>View</option>
                          <option>Materialized View</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={properties.tableDescription}
                          onChange={(e) => handlePropertyChange('tableDescription', e.target.value)}
                          className={`w-full px-3 py-2 text-xs rounded-md border transition-all resize-none ${
                            isDark ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500'
                                   : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                          placeholder="Stores user account information..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'table' && activeTab === 'columns' && (
                <div className="space-y-4">
                  {/* Columns Table Card */}
                  <div className={`rounded-lg border shadow-sm ${
                    isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`p-3 border-b flex items-center justify-between ${
                      isDark ? 'border-zinc-800' : 'border-gray-200'
                    }`}>
                      <h3 className={`text-xs font-semibold flex items-center gap-1.5 ${
                        isDark ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        <Table2 className="w-3.5 h-3.5" />
                        Columns ({columns.length})
                      </h3>
                      <button
                        onClick={handleAddColumn}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                          isDark ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Column
                      </button>
                    </div>

                    {/* Columns Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className={isDark ? 'bg-zinc-800/50' : 'bg-gray-50'}>
                          <tr>
                            <th className={`px-3 py-2 text-left font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Name</th>
                            <th className={`px-3 py-2 text-left font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Data Type</th>
                            <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>PK</th>
                            <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>FK</th>
                            <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Nullable</th>
                            <th className={`px-3 py-2 text-left font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Default</th>
                            <th className={`px-3 py-2 text-right font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {columns.map((col, idx) => (
                            <tr key={col.id} className={`border-t transition-colors ${
                              isDark ? 'border-zinc-800 hover:bg-zinc-800/30' : 'border-gray-200 hover:bg-gray-50'
                            }`}>
                              <td className={`px-3 py-2.5 font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                                {col.name}
                              </td>
                              <td className={`px-3 py-2.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {col.dataType}
                              </td>
                              <td className="px-3 py-2.5 text-center">
                                {col.isPK && <Key className={`w-3.5 h-3.5 inline ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />}
                              </td>
                              <td className="px-3 py-2.5 text-center">
                                {col.isFK && <LinkIcon className={`w-3.5 h-3.5 inline ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />}
                              </td>
                              <td className="px-3 py-2.5 text-center">
                                {col.isNullable ? '✓' : ''}
                              </td>
                              <td className={`px-3 py-2.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {col.defaultValue || '-'}
                              </td>
                              <td className="px-3 py-2.5 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleEditColumn(col)}
                                    className={`p-1 rounded transition-colors ${
                                      isDark ? 'hover:bg-zinc-700 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                                    }`}
                                    title="Edit column"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteColumn(col.id)}
                                    className={`p-1 rounded transition-colors ${
                                      isDark ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-600 hover:text-red-600'
                                    }`}
                                    title="Delete column"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Column Edit Form Modal */}
                  <AnimatePresence>
                    {showColumnForm && editingColumn && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => setShowColumnForm(false)}
                      >
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.95, opacity: 0 }}
                          onClick={(e) => e.stopPropagation()}
                          className={`w-full max-w-md rounded-lg shadow-xl ${
                            isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className={`p-4 border-b ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
                            <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                              {columns.some(c => c.id === editingColumn.id) ? 'Edit Column' : 'Add New Column'}
                            </h3>
                          </div>
                          <div className="p-4 space-y-3">
                            <div>
                              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Column Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={editingColumn.name}
                                onChange={(e) => setEditingColumn({ ...editingColumn, name: e.target.value })}
                                className={`w-full px-3 py-2 text-xs rounded-md border ${
                                  isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                                placeholder="column_name"
                              />
                            </div>
                            <div>
                              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Data Type <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={editingColumn.dataType}
                                onChange={(e) => setEditingColumn({ ...editingColumn, dataType: e.target.value })}
                                className={`w-full px-3 py-2 text-xs rounded-md border ${
                                  isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                              >
                                <option>VARCHAR(50)</option>
                                <option>VARCHAR(100)</option>
                                <option>VARCHAR(255)</option>
                                <option>INTEGER</option>
                                <option>BIGINT</option>
                                <option>DECIMAL(10,2)</option>
                                <option>BOOLEAN</option>
                                <option>DATE</option>
                                <option>TIMESTAMP</option>
                                <option>TEXT</option>
                                <option>JSON</option>
                              </select>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="isPK"
                                  checked={editingColumn.isPK}
                                  onChange={(e) => setEditingColumn({ ...editingColumn, isPK: e.target.checked })}
                                  className="rounded w-4 h-4"
                                />
                                <label htmlFor="isPK" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                  Primary Key
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="isFK"
                                  checked={editingColumn.isFK}
                                  onChange={(e) => setEditingColumn({ ...editingColumn, isFK: e.target.checked })}
                                  className="rounded w-4 h-4"
                                />
                                <label htmlFor="isFK" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                  Foreign Key
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="isNullable"
                                  checked={editingColumn.isNullable}
                                  onChange={(e) => setEditingColumn({ ...editingColumn, isNullable: e.target.checked })}
                                  className="rounded w-4 h-4"
                                />
                                <label htmlFor="isNullable" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                  Nullable
                                </label>
                              </div>
                            </div>
                            <div>
                              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Default Value
                              </label>
                              <input
                                type="text"
                                value={editingColumn.defaultValue}
                                onChange={(e) => setEditingColumn({ ...editingColumn, defaultValue: e.target.value })}
                                className={`w-full px-3 py-2 text-xs rounded-md border ${
                                  isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                                placeholder="NULL, CURRENT_TIMESTAMP, etc."
                              />
                            </div>
                          </div>
                          <div className={`p-4 border-t flex justify-end gap-2 ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
                            <button
                              onClick={() => setShowColumnForm(false)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveColumn}
                              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                isDark ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              }`}
                            >
                              Save Column
                            </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {selectedItem.type === 'table' && activeTab === 'keys' && (
                <div className="space-y-4">
                  <div className={`rounded-lg border p-3 shadow-sm ${
                    isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'
                  }`}>
                    <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      <KeyRound className="w-3.5 h-3.5" />
                      Keys
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Primary Key
                        </label>
                        <div className={`px-3 py-2 rounded-md text-xs font-mono ${isDark ? 'bg-zinc-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          {columns.filter(c => c.isPK).map(c => c.name).join(', ') || 'No primary key defined'}
                        </div>
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Foreign Keys
                        </label>
                        <div className={`px-3 py-2 rounded-md text-xs font-mono ${isDark ? 'bg-zinc-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          {columns.filter(c => c.isFK).map(c => c.name).join(', ') || 'No foreign keys defined'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'table' && activeTab === 'indexes' && (
                <div className="space-y-4">
                  {/* Indexes Table Card */}
                  <div className={`rounded-lg border shadow-sm ${
                    isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`p-3 border-b flex items-center justify-between ${
                      isDark ? 'border-zinc-800' : 'border-gray-200'
                    }`}>
                      <h3 className={`text-xs font-semibold flex items-center gap-1.5 ${
                        isDark ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        <Zap className="w-3.5 h-3.5" />
                        Indexes ({indexes.length})
                      </h3>
                      <button
                        onClick={handleAddIndex}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                          isDark ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Index
                      </button>
                    </div>

                    {/* Indexes Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className={isDark ? 'bg-zinc-800/50' : 'bg-gray-50'}>
                          <tr>
                            <th className={`px-3 py-2 text-left font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Name</th>
                            <th className={`px-3 py-2 text-left font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Columns</th>
                            <th className={`px-3 py-2 text-center font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Unique</th>
                            <th className={`px-3 py-2 text-left font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Type</th>
                            <th className={`px-3 py-2 text-right font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {indexes.filter(idx => idx.table === properties.tableName).map((idx) => (
                            <tr key={idx.id} className={`border-t transition-colors ${
                              isDark ? 'border-zinc-800 hover:bg-zinc-800/30' : 'border-gray-200 hover:bg-gray-50'
                            }`}>
                              <td className={`px-3 py-2.5 font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                                {idx.name}
                              </td>
                              <td className={`px-3 py-2.5 font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {Array.isArray(idx.columns) ? idx.columns.join(', ') : idx.columns}
                              </td>
                              <td className="px-3 py-2.5 text-center">
                                {idx.isUnique ? '✓' : ''}
                              </td>
                              <td className={`px-3 py-2.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {idx.type}
                              </td>
                              <td className="px-3 py-2.5 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleEditIndex(idx)}
                                    className={`p-1 rounded transition-colors ${
                                      isDark ? 'hover:bg-zinc-700 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                                    }`}
                                    title="Edit index"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteIndex(idx.id)}
                                    className={`p-1 rounded transition-colors ${
                                      isDark ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-600 hover:text-red-600'
                                    }`}
                                    title="Delete index"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Index Edit Form Modal */}
                  <AnimatePresence>
                    {showIndexForm && editingIndex && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => setShowIndexForm(false)}
                      >
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.95, opacity: 0 }}
                          onClick={(e) => e.stopPropagation()}
                          className={`w-full max-w-md rounded-lg shadow-xl ${
                            isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className={`p-4 border-b ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
                            <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                              {indexes.some(i => i.id === editingIndex.id) ? 'Edit Index' : 'Add New Index'}
                            </h3>
                          </div>
                          <div className="p-4 space-y-3">
                            <div>
                              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Index Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={editingIndex.name}
                                onChange={(e) => setEditingIndex({ ...editingIndex, name: e.target.value })}
                                className={`w-full px-3 py-2 text-xs rounded-md border ${
                                  isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                                placeholder="idx_table_column"
                              />
                            </div>
                            <div>
                              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Columns <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={Array.isArray(editingIndex.columns) ? editingIndex.columns.join(', ') : editingIndex.columns}
                                onChange={(e) => setEditingIndex({ ...editingIndex, columns: e.target.value.split(',').map((s: string) => s.trim()) })}
                                className={`w-full px-3 py-2 text-xs rounded-md border ${
                                  isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                                placeholder="column1, column2"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Index Type
                                </label>
                                <select
                                  value={editingIndex.type}
                                  onChange={(e) => setEditingIndex({ ...editingIndex, type: e.target.value })}
                                  className={`w-full px-3 py-2 text-xs rounded-md border ${
                                    isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                                >
                                  <option>BTREE</option>
                                  <option>HASH</option>
                                  <option>GIST</option>
                                  <option>GIN</option>
                                </select>
                              </div>
                              <div className="flex items-end">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id="isUnique"
                                    checked={editingIndex.isUnique}
                                    onChange={(e) => setEditingIndex({ ...editingIndex, isUnique: e.target.checked })}
                                    className="rounded w-4 h-4"
                                  />
                                  <label htmlFor="isUnique" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Unique
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={`p-4 border-t flex justify-end gap-2 ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
                            <button
                              onClick={() => setShowIndexForm(false)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveIndex}
                              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                isDark ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              }`}
                            >
                              Save Index
                            </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {selectedItem.type === 'table' && activeTab === 'display' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="showInDiagram" defaultChecked className="rounded" />
                    <label htmlFor="showInDiagram" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Show in Diagram
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="expandColumns" className="rounded" />
                    <label htmlFor="expandColumns" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Expand Columns
                    </label>
                  </div>
                </div>
              )}

              {/* Relationship Properties */}
              {selectedItem.type === 'relationship' && activeTab === 'general' && (
                <div className="space-y-2">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Relationship Type
                    </label>
                    <select
                      className={`w-full px-2 py-1.5 text-xs rounded border ${
                        isDark ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="1:N">One to Many</option>
                      <option value="1:1">One to One</option>
                      <option value="N:M">Many to Many</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedItem.type === 'relationship' && activeTab === 'cardinality' && (
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <p>Cardinality: 1:N (One to Many)</p>
                  <p className="mt-2">Source: Users (1)</p>
                  <p>Target: Orders (N)</p>
                </div>
              )}
            </div>
          </div>
        </div>
    );
  };

  return (
    <motion.div
      key="properties"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex-1 flex overflow-hidden ${isDark ? 'bg-zinc-950' : 'bg-gray-100'}`}
    >
      {/* Left: Enhanced Model Explorer Tree */}
      <div className={`w-64 border-r overflow-hidden flex flex-col ${
        isDark ? 'border-zinc-800 bg-zinc-950' : 'border-gray-200 bg-white'
      }`}>
        {/* Header with title */}
        <div className={`px-3 py-2.5 border-b ${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-bold tracking-wide ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              MODEL EXPLORER
            </h3>
            <button
              className={`p-1 rounded transition-colors ${
                isDark ? 'hover:bg-zinc-800 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
              }`}
              title="Add New"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-3 space-y-2">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-md border transition-all duration-200 ${
                isDark ? 'bg-zinc-800 border-zinc-700 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:bg-zinc-800/80'
                       : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
            />
          </div>

          {/* Filter Dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className={`w-full px-2.5 py-1.5 text-xs rounded-md border transition-all ${
              isDark ? 'bg-zinc-800 border-zinc-700 text-gray-100 focus:border-indigo-500'
                     : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
          >
            <option value="all">Show: All</option>
            <option value="tables">Show: Tables Only</option>
            <option value="columns">Show: Columns Only</option>
            <option value="relationships">Show: Relationships Only</option>
          </select>
        </div>

        {/* Tree Items - Scrollable */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="space-y-0.5">
            {treeData.map((item) => (
              <TreeItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Right: Context-aware Properties */}
      <div className={`flex-1 overflow-hidden ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
        {renderPropertiesContent()}
      </div>
    </motion.div>
  );
}

// Right Properties Panel Component - Context-aware properties panel
function RightPropertiesPanel({ table, isDark }: { table?: Table; isDark: boolean }) {
  const [activeTab, setActiveTab] = useState('general');

  // Table tabs
  const tableTabs = [
    { id: 'general', label: 'General', icon: FileText },
    { id: 'columns', label: 'Columns', icon: Table2 },
    { id: 'keys', label: 'Keys', icon: KeyRound },
    { id: 'display', label: 'Display', icon: Eye }
  ];

  // Model tabs (when no table selected)
  const modelTabs = [
    { id: 'general', label: 'General', icon: FileText },
    { id: 'tables', label: 'Tables', icon: Table2 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const tabs = table ? tableTabs : modelTabs;

  if (!table) {
    // Model Properties
    return (
      <div className="flex h-full">
        {/* Left Icon Strip */}
        <div className={`w-6 border-r transition-colors flex flex-col ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
        }`}>
          {modelTabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-8 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                activeTab === tab.id
                  ? `${isDark ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white'} shadow-sm`
                  : `${isDark ? 'text-gray-400 hover:text-gray-100 hover:bg-zinc-800/50' : 'text-gray-600 hover:text-gray-900 hover:bg-indigo-50/50'}`
              }`}
              title={tab.label}
              style={{ marginBottom: '1px' }}
            >
              <tab.icon className="w-3.5 h-3.5" />
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 overflow-y-auto transition-colors ${
          isDark ? 'bg-zinc-900' : 'bg-white'
        }`}>
          {/* Context Header */}
          <div className={`p-2 border-b transition-colors ${
            isDark ? 'border-zinc-800 bg-zinc-900' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center gap-2">
              {React.createElement(modelTabs.find(tab => tab.id === activeTab)!.icon, {
                className: `w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`
              })}
              <h2 className={`text-xs font-semibold ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {modelTabs.find(t => t.id === activeTab)?.label} Properties
              </h2>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Data Model
            </p>
          </div>

          {/* Content */}
          <div className="p-2 space-y-2">
            {activeTab === 'general' && (
              <div className="space-y-2">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Model Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Data Model"
                    className={`w-full px-2 py-1 text-xs rounded border ${
                      isDark ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    rows={2}
                    className={`w-full px-2 py-1 text-xs rounded border ${
                      isDark ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Model description..."
                  />
                </div>
              </div>
            )}
            {activeTab === 'tables' && (
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <p>Total Tables: 2</p>
                <p className="mt-1">Add tables from the toolbar</p>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="autoLayout" className="rounded" />
                  <label htmlFor="autoLayout" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Auto Layout
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="showGrid" defaultChecked className="rounded" />
                  <label htmlFor="showGrid" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Show Grid
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Table Properties
  return (
    <div className="flex h-full">
      {/* Left Icon Strip */}
      <div className={`w-6 border-r transition-colors flex flex-col ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
      }`}>
        {tableTabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`h-8 flex items-center justify-center cursor-pointer transition-all duration-200 ${
              activeTab === tab.id
                ? `${isDark ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white'} shadow-sm`
                : `${isDark ? 'text-gray-400 hover:text-gray-100 hover:bg-zinc-800/50' : 'text-gray-600 hover:text-gray-900 hover:bg-indigo-50/50'}`
            }`}
            title={tab.label}
            style={{ marginBottom: '1px' }}
          >
            <tab.icon className="w-3.5 h-3.5" />
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 overflow-y-auto transition-colors ${
        isDark ? 'bg-zinc-900' : 'bg-white'
      }`}>
        {/* Context Header */}
        <div className={`p-2 border-b transition-colors ${
          isDark ? 'border-zinc-800 bg-zinc-900' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-2">
            {React.createElement(tableTabs.find(tab => tab.id === activeTab)!.icon, {
              className: `w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`
            })}
            <h2 className={`text-xs font-semibold ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {tableTabs.find(t => t.id === activeTab)?.label} Properties
            </h2>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {table.name}
          </p>
        </div>

        {/* Content */}
        <div className="p-2 space-y-2">
          {activeTab === 'general' && (
            <div className="space-y-2">
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Table Name
                </label>
                <input
                  type="text"
                  defaultValue={table.name}
                  className={`w-full px-2 py-1 text-xs rounded border ${
                    isDark ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Definition
                </label>
                <textarea
                  rows={2}
                  className={`w-full px-2 py-1 text-xs rounded border ${
                    isDark ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Table definition..."
                />
              </div>
            </div>
          )}

          {activeTab === 'columns' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Columns ({table.columns.length})
                </label>
                <button className={`text-xs ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
                  <Plus className="w-3 h-3 inline mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {table.columns.map(col => (
                  <div
                    key={col.id}
                    className={`px-2 py-1.5 rounded text-xs ${
                      isDark ? 'bg-zinc-800' : 'bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {col.isPK && (
                          <span className="px-1 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-bold">PK</span>
                        )}
                        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{col.name}</span>
                      </div>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{col.dataType}</span>
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {!col.isNullable && 'NOT NULL'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="space-y-2">
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Primary Key
                </label>
                <div className={`px-2 py-1.5 rounded text-xs ${isDark ? 'bg-zinc-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  {table.columns.filter(c => c.isPK).map(c => c.name).join(', ') || 'None'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="showInDiagram" defaultChecked className="rounded" />
                <label htmlFor="showInDiagram" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Show in Diagram
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="expandColumns" className="rounded" />
                <label htmlFor="expandColumns" className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Expand Columns
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
