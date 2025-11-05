'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Grid3x3,
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
  Minimize2
} from 'lucide-react';

// Types
type ViewMode = 'diagram' | 'quick-editor' | 'properties';
type Tool = 'select' | 'table' | 'relationship' | 'note' | 'move';

interface Table {
  id: string;
  name: string;
  x: number;
  y: number;
  columns: Column[];
}

interface Column {
  id: string;
  name: string;
  dataType: string;
  isPK: boolean;
  isNullable: boolean;
  defaultValue?: string;
}

interface Relationship {
  id: string;
  fromTable: string;
  toTable: string;
  type: '1:1' | '1:N' | 'N:M';
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
  { id: 'rel-1', fromTable: 'table-1', toTable: 'table-2', type: '1:N' }
];

export default function Diagrammer() {
  const [viewMode, setViewMode] = useState<ViewMode>('diagram');
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [isLocked, setIsLocked] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [relationships] = useState<Relationship[]>(mockRelationships);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  const [isDark, setIsDark] = useState(true);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleResetZoom = () => setZoom(100);

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

          {/* Tools */}
          {viewMode === 'diagram' && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTool('select')}
                className={`p-1.5 rounded transition-colors ${
                  activeTool === 'select'
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : isDark ? 'text-gray-400 hover:bg-zinc-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Select"
              >
                <MousePointer2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTool('table')}
                className={`p-1.5 rounded transition-colors ${
                  activeTool === 'table'
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : isDark ? 'text-gray-400 hover:bg-zinc-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Add Table"
              >
                <Box className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTool('relationship')}
                className={`p-1.5 rounded transition-colors ${
                  activeTool === 'relationship'
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : isDark ? 'text-gray-400 hover:bg-zinc-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Add Relationship"
              >
                <Link2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTool('note')}
                className={`p-1.5 rounded transition-colors ${
                  activeTool === 'note'
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : isDark ? 'text-gray-400 hover:bg-zinc-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Add Note"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          {viewMode === 'diagram' && (
            <>
              <div className={`flex items-center gap-1 rounded-lg px-2 py-1 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                <button
                  onClick={handleZoomOut}
                  className={`p-1 rounded ${isDark ? 'hover:bg-zinc-700' : 'hover:bg-gray-200'}`}
                  title="Zoom Out"
                >
                  <ZoomOut className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
                <span className={`text-xs font-medium min-w-[3rem] text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className={`p-1 rounded ${isDark ? 'hover:bg-zinc-700' : 'hover:bg-gray-200'}`}
                  title="Zoom In"
                >
                  <ZoomIn className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>
              <div className={`w-px h-6 ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />
            </>
          )}

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

          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isLocked
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : isDark ? 'bg-zinc-800 text-gray-400 hover:bg-zinc-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            {isLocked ? 'Locked' : 'Unlocked'}
          </button>

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
          {showLeftPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
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
                isDark={isDark}
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
          {showPropertiesPanel && selectedTable && viewMode === 'diagram' && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
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
  onSelectTool
}: {
  isDark: boolean;
  isDrawingMode: 'table' | 'annotation' | 'relationship' | null;
  onSelectTool: (mode: 'table' | 'annotation' | 'relationship' | null) => void;
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
      <ToolbarButton
        icon={GitBranch}
        tooltip="Add Relationship"
        isDark={isDark}
        isActive={isDrawingMode === 'relationship'}
        onClick={() => onSelectTool('relationship')}
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
  zoomLevel
}: {
  isDark: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoomLevel: number;
}) => {
  return (
    <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-1 p-1.5 rounded-xl shadow-lg backdrop-blur-sm border z-50 ${
      isDark ? 'bg-zinc-800/95 border-zinc-700' : 'bg-white/95 border-gray-200'
    }`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <ViewToolbarButton icon={ZoomIn} tooltip="Zoom In" isDark={isDark} onClick={onZoomIn} />
      <ViewToolbarButton icon={ZoomOut} tooltip="Zoom Out" isDark={isDark} onClick={onZoomOut} />
      <ViewToolbarButton icon={Maximize2} tooltip="Fit to Screen" isDark={isDark} />
      <div className={`w-px h-6 mx-1 ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />
      <ViewToolbarButton icon={Hand} tooltip="Pan/Hand Tool" isDark={isDark} />
      <div className={`w-px h-6 mx-1 ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />
      <ViewToolbarButton icon={Grid} tooltip="Toggle Grid" isDark={isDark} />
      <ViewToolbarButton icon={Target} tooltip="Snap to Grid/Alignment" isDark={isDark} />
      <div className={`w-px h-6 mx-1 ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />
      <ViewToolbarButton icon={Sparkles} tooltip="Auto-layout" isDark={isDark} />
      <ViewToolbarButton icon={Map} tooltip="Toggle Minimap" isDark={isDark} />
    </div>
  );
};

// Left Panel Component with Model Explorer Tree
function LeftPanel({ isDark }: { isDark: boolean }) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['model-root', 'entities-tables', 'relationships']));
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
      id: 'model-root',
      label: 'E-Commerce Platform',
      icon: <Database className="w-4 h-4 text-blue-500" />,
      type: 'model',
      children: [
        {
          id: 'model-properties',
          label: 'Model Properties',
          icon: <Settings className="w-4 h-4 text-gray-500" />,
          type: 'folder'
        },
        {
          id: 'subject-areas',
          label: 'Subject Areas',
          icon: <Component className="w-4 h-4 text-purple-500" />,
          type: 'folder',
          children: [
            {
              id: 'sa-customer-mgmt',
              label: 'Customer Management',
              icon: <Box className="w-4 h-4 text-purple-400" />,
              type: 'subject-area'
            },
            {
              id: 'sa-order-processing',
              label: 'Order Processing',
              icon: <Box className="w-4 h-4 text-purple-400" />,
              type: 'subject-area'
            }
          ]
        },
        {
          id: 'diagrams-root',
          label: 'Diagrams',
          icon: <Workflow className="w-4 h-4 text-blue-500" />,
          type: 'folder',
          children: [
            {
              id: 'logical-diagrams',
              label: 'Logical Diagram(s)',
              icon: <FileText className="w-4 h-4 text-green-500" />,
              type: 'folder',
              children: [
                {
                  id: 'diagram-logical-main',
                  label: 'Main Logical Model',
                  icon: <FileText className="w-4 h-4 text-green-400" />,
                  type: 'diagram'
                }
              ]
            },
            {
              id: 'physical-diagrams',
              label: 'Physical Diagram(s)',
              icon: <FileText className="w-4 h-4 text-orange-500" />,
              type: 'folder',
              children: [
                {
                  id: 'diagram-physical-main',
                  label: 'Main Physical Model',
                  icon: <FileText className="w-4 h-4 text-orange-400" />,
                  type: 'diagram'
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
          children: [
            {
              id: 'domain-email',
              label: 'EmailAddress',
              icon: <Type className="w-4 h-4 text-blue-400" />,
              type: 'domain'
            },
            {
              id: 'domain-currency',
              label: 'Currency',
              icon: <Type className="w-4 h-4 text-blue-400" />,
              type: 'domain'
            }
          ]
        },
        {
          id: 'entities-tables',
          label: 'Tables',
          icon: <Database className="w-4 h-4 text-purple-500" />,
          type: 'folder',
          children: [
            {
              id: 'entity-customer',
              label: 'Customer',
              icon: <Box className="w-4 h-4 text-purple-500" />,
              type: 'entity',
              children: [
                {
                  id: 'customer-attributes',
                  label: 'Columns',
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
                          type: 'attribute'
                        }
                      ]
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
                          type: 'attribute'
                        },
                        {
                          id: 'attr-email',
                          label: 'email',
                          icon: <Hash className="w-3.5 h-3.5 text-gray-500" />,
                          type: 'attribute'
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
              children: [
                {
                  id: 'order-attributes',
                  label: 'Columns',
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
                          type: 'attribute'
                        }
                      ]
                    },
                    {
                      id: 'order-fk',
                      label: 'Foreign Keys (FK)',
                      icon: <LinkIcon className="w-4 h-4 text-blue-500" />,
                      type: 'folder',
                      children: [
                        {
                          id: 'attr-customer-fk',
                          label: 'customer_id',
                          icon: <LinkIcon className="w-3.5 h-3.5 text-blue-500" />,
                          type: 'attribute'
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
                          type: 'attribute'
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
          children: [
            {
              id: 'identifying-rel',
              label: 'Identifying',
              icon: <GitBranch className="w-4 h-4 text-green-600" />,
              type: 'folder',
              children: [
                {
                  id: 'rel-customer-order',
                  label: 'Customer_Order',
                  icon: <GitBranch className="w-4 h-4 text-green-500" />,
                  type: 'relationship'
                }
              ]
            },
            {
              id: 'non-identifying-rel',
              label: 'Non-identifying',
              icon: <GitMerge className="w-4 h-4 text-green-600" />,
              type: 'folder',
              children: [
                {
                  id: 'rel-order-product',
                  label: 'Order_Product',
                  icon: <GitMerge className="w-4 h-4 text-green-500" />,
                  type: 'relationship'
                }
              ]
            },
            {
              id: 'many-to-many-rel',
              label: 'Many-to-Many',
              icon: <Network className="w-4 h-4 text-green-600" />,
              type: 'folder',
              children: [
                {
                  id: 'rel-product-category',
                  label: 'Product_Category',
                  icon: <Network className="w-4 h-4 text-green-500" />,
                  type: 'relationship'
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
          children: [
            {
              id: 'logical-views',
              label: 'Logical views',
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
              id: 'physical-views',
              label: 'Physical views (SQL)',
              icon: <FileCode className="w-4 h-4 text-cyan-600" />,
              type: 'folder',
              children: [
                {
                  id: 'view-customer-orders',
                  label: 'VW_CUSTOMER_ORDERS',
                  icon: <FileCode className="w-4 h-4 text-cyan-500" />,
                  type: 'view'
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
          children: [
            {
              id: 'sequences',
              label: 'Sequences',
              icon: <Hash className="w-4 h-4 text-purple-600" />,
              type: 'folder',
              children: [
                {
                  id: 'seq-customer-id',
                  label: 'SEQ_CUSTOMER_ID',
                  icon: <Hash className="w-4 h-4 text-purple-500" />,
                  type: 'sequence'
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
                  id: 'proc-get-orders',
                  label: 'SP_GET_CUSTOMER_ORDERS',
                  icon: <Command className="w-4 h-4 text-red-500" />,
                  type: 'procedure'
                }
              ]
            },
            {
              id: 'triggers',
              label: 'Triggers',
              icon: <Zap className="w-4 h-4 text-yellow-600" />,
              type: 'folder',
              children: [
                {
                  id: 'trigger-audit',
                  label: 'TRG_CUSTOMER_AUDIT',
                  icon: <Zap className="w-4 h-4 text-yellow-500" />,
                  type: 'trigger'
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
          children: [
            {
              id: 'users',
              label: 'Users',
              icon: <User className="w-4 h-4 text-indigo-600" />,
              type: 'folder',
              children: [
                {
                  id: 'user-admin',
                  label: 'db_admin',
                  icon: <Crown className="w-4 h-4 text-indigo-500" />,
                  type: 'user'
                }
              ]
            },
            {
              id: 'roles',
              label: 'Roles',
              icon: <UserPlus className="w-4 h-4 text-indigo-600" />,
              type: 'folder',
              children: [
                {
                  id: 'role-admin',
                  label: 'ADMIN_ROLE',
                  icon: <Crown className="w-4 h-4 text-indigo-500" />,
                  type: 'role'
                }
              ]
            },
            {
              id: 'permissions',
              label: 'Permissions',
              icon: <KeyRound className="w-4 h-4 text-indigo-600" />,
              type: 'folder',
              children: [
                {
                  id: 'perm-select',
                  label: 'SELECT_PERMISSION',
                  icon: <Eye className="w-4 h-4 text-indigo-500" />,
                  type: 'permission'
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
          children: [
            {
              id: 'indexes',
              label: 'Indexes',
              icon: <Search className="w-4 h-4 text-yellow-600" />,
              type: 'folder',
              children: [
                {
                  id: 'idx-customer-email',
                  label: 'IDX_CUSTOMER_EMAIL',
                  icon: <Search className="w-4 h-4 text-yellow-500" />,
                  type: 'index'
                }
              ]
            },
            {
              id: 'constraints',
              label: 'Constraints',
              icon: <Lock className="w-4 h-4 text-red-600" />,
              type: 'folder',
              children: [
                {
                  id: 'chk-email-format',
                  label: 'CHK_EMAIL_FORMAT',
                  icon: <Lock className="w-4 h-4 text-red-500" />,
                  type: 'constraint'
                }
              ]
            },
            {
              id: 'synonyms',
              label: 'Synonyms',
              icon: <Link2 className="w-4 h-4 text-purple-600" />,
              type: 'folder',
              children: [
                {
                  id: 'syn-customer',
                  label: 'SYN_CUSTOMER',
                  icon: <Link2 className="w-4 h-4 text-purple-500" />,
                  type: 'synonym'
                }
              ]
            },
            {
              id: 'schemas',
              label: 'Schemas',
              icon: <Folder className="w-4 h-4 text-blue-600" />,
              type: 'folder',
              children: [
                {
                  id: 'schema-public',
                  label: 'PUBLIC',
                  icon: <Globe className="w-4 h-4 text-blue-500" />,
                  type: 'schema'
                },
                {
                  id: 'schema-app',
                  label: 'APP_SCHEMA',
                  icon: <Folder className="w-4 h-4 text-blue-500" />,
                  type: 'schema'
                }
              ]
            },
            {
              id: 'tablespaces-storage',
              label: 'Tablespaces / Storage',
              icon: <Server className="w-4 h-4 text-gray-600" />,
              type: 'folder',
              children: [
                {
                  id: 'ts-data',
                  label: 'DATA_TABLESPACE',
                  icon: <Server className="w-4 h-4 text-gray-500" />,
                  type: 'tablespace'
                },
                {
                  id: 'ts-index',
                  label: 'INDEX_TABLESPACE',
                  icon: <Archive className="w-4 h-4 text-gray-500" />,
                  type: 'tablespace'
                }
              ]
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
    <div className="p-4">
      <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Model Tree</h3>

      {/* Search Box */}
      <div className="mb-4">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder="Search tree..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg border transition-all duration-200 ${
              isDark
                ? 'bg-zinc-800 border-zinc-700 text-gray-100 placeholder-gray-500 focus:border-indigo-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
          />
        </div>
      </div>

      {/* Tree Items */}
      <div className="space-y-1">
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
  isDark
}: {
  tables: Table[];
  relationships: Relationship[];
  zoom: number;
  selectedTable: string | null;
  onTableSelect: (id: string | null) => void;
  onAddTable: () => void;
  onTablesUpdate: (tables: Table[]) => void;
  isDark: boolean;
}) {
  const [draggingTable, setDraggingTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDrawingMode, setIsDrawingMode] = useState<'table' | 'annotation' | 'relationship' | null>(null);

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
    const newX = (e.clientX - rect.left) / (zoom / 100) - dragOffset.x;
    const newY = (e.clientY - rect.top) / (zoom / 100) - dragOffset.y;

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

  return (
    <motion.div
      key="diagram"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex-1 overflow-auto relative ${isDark ? 'bg-zinc-950' : 'bg-gray-50'}`}
      style={{
        backgroundImage: isDark
          ? 'radial-gradient(circle, #3A3A3A 1px, transparent 1px)'
          : 'radial-gradient(circle, #D1D5DB 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    >
      <div
        className="relative min-h-full"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top left',
          width: `${(100 / zoom) * 100}%`,
          height: `${(100 / zoom) * 100}%`,
          minHeight: '2000px',
          minWidth: '2000px'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
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
      />
      <ViewControlsToolbar
        isDark={isDark}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        zoomLevel={zoom}
      />
    </motion.div>
  );
}

// Quick Editor Component
function QuickEditor({ tables, onTablesUpdate }: { tables: Table[]; onTablesUpdate: (tables: Table[]) => void }) {
  const [editingTable, setEditingTable] = useState<string | null>(null);

  const addNewTable = () => {
    const newTable: Table = {
      id: `table-${Date.now()}`,
      name: 'NewTable',
      x: 100,
      y: 100,
      columns: []
    };
    onTablesUpdate([...tables, newTable]);
    setEditingTable(newTable.id);
  };

  const addColumn = (tableId: string) => {
    const updatedTables = tables.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          columns: [
            ...table.columns,
            {
              id: `col-${Date.now()}`,
              name: 'new_column',
              dataType: 'VARCHAR(50)',
              isPK: false,
              isNullable: true
            }
          ]
        };
      }
      return table;
    });
    onTablesUpdate(updatedTables);
  };

  return (
    <motion.div
      key="quick-editor"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 bg-zinc-950 overflow-auto p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-100">Quick Editor</h2>
            <p className="text-xs text-gray-500 mt-1">Add and edit tables in spreadsheet mode</p>
          </div>
          <button
            onClick={addNewTable}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Table
          </button>
        </div>

        <div className="space-y-6">
          {tables.map(table => (
            <div key={table.id} className="border border-zinc-800 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                <input
                  type="text"
                  defaultValue={table.name}
                  className="text-sm font-semibold text-gray-100 bg-transparent border-none focus:outline-none focus:ring-0"
                  placeholder="Table Name"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addColumn(table.id)}
                    className="px-2 py-1 text-xs text-indigo-400 hover:bg-indigo-500/20 rounded"
                  >
                    <Plus className="w-3 h-3 inline mr-1" />
                    Add Column
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-400 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Columns Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-zinc-900 border-b border-zinc-800">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-300">Column Name</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-300">Data Type</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-300">PK</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-300">Nullable</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-300">Default</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs">No columns yet. Click "Add Column" to start.</p>
                        </td>
                      </tr>
                    ) : (
                      table.columns.map(col => (
                        <tr key={col.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              defaultValue={col.name}
                              className="w-full bg-transparent border border-zinc-700 text-gray-100 rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              defaultValue={col.dataType}
                              className="w-full bg-transparent border border-zinc-700 text-gray-100 rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={col.isPK}
                              className="rounded border-zinc-600 text-indigo-600 focus:ring-indigo-500 bg-zinc-800"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={col.isNullable}
                              className="rounded border-zinc-600 text-indigo-600 focus:ring-indigo-500 bg-zinc-800"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              defaultValue={col.defaultValue || ''}
                              placeholder="NULL"
                              className="w-full bg-transparent border border-zinc-700 text-gray-100 rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button className="p-1 text-gray-400 hover:text-red-400">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {tables.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-zinc-700 rounded-lg">
              <Table2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-300 mb-2">No Tables Yet</h3>
              <p className="text-xs text-gray-500 mb-4">Start adding tables to build your data model</p>
              <button
                onClick={addNewTable}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add First Table
              </button>
            </div>
          )}
        </div>

        {/* Action Bar */}
        {tables.length > 0 && (
          <div className="mt-6 flex items-center justify-between pt-6 border-t border-zinc-800">
            <button className="px-4 py-2 text-xs text-gray-400 hover:text-gray-100 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh from Diagram
            </button>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-md text-xs font-medium transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-medium transition-colors inline-flex items-center gap-2">
                <Save className="w-3.5 h-3.5" />
                Save & Update Diagram
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Properties View Component
function PropertiesView({ selectedTable }: { selectedTable?: Table }) {
  return (
    <motion.div
      key="properties"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 bg-zinc-950 overflow-auto p-6"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-100 mb-6">Model Properties</h2>

        <div className="space-y-6">
          {/* General Information */}
          <div className="border border-zinc-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-100 mb-4">General Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Model Name</label>
                <input
                  type="text"
                  defaultValue="E-Commerce Model"
                  className="w-full px-3 py-2 text-xs border border-zinc-700 bg-zinc-800 text-gray-100 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Version</label>
                <input
                  type="text"
                  defaultValue="1.0.0"
                  className="w-full px-3 py-2 text-xs border border-zinc-700 bg-zinc-800 text-gray-100 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  defaultValue="Complete e-commerce data model with products, orders, and customer management"
                  className="w-full px-3 py-2 text-xs border border-zinc-700 bg-zinc-800 text-gray-100 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="border border-zinc-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-100 mb-4">Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Total Tables</p>
                <p className="text-lg font-semibold text-gray-100">12</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Total Columns</p>
                <p className="text-lg font-semibold text-gray-100">84</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Relationships</p>
                <p className="text-lg font-semibold text-gray-100">15</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Right Properties Panel Component
function RightPropertiesPanel({ table }: { table?: Table }) {
  if (!table) return null;

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-100 mb-4">Table Properties</h3>

      {/* Table Name */}
      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-1">Table Name</label>
        <input
          type="text"
          defaultValue={table.name}
          className="w-full px-3 py-2 text-xs border border-zinc-700 bg-zinc-800 text-gray-100 rounded-md focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Columns List */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-medium text-gray-300">Columns ({table.columns.length})</label>
          <button className="text-xs text-indigo-400 hover:text-indigo-300">
            <Plus className="w-3 h-3 inline mr-1" />
            Add
          </button>
        </div>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {table.columns.map(col => (
            <div key={col.id} className="px-2 py-1.5 bg-zinc-800 rounded text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                {col.isPK && (
                  <span className="px-1 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-bold">PK</span>
                )}
                <span className="text-gray-300">{col.name}</span>
              </div>
              <span className="text-gray-500 text-xs">{col.dataType}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-zinc-800 space-y-2">
        <button className="w-full px-3 py-2 text-xs text-left text-gray-300 hover:bg-zinc-800 rounded flex items-center gap-2">
          <Edit3 className="w-3 h-3" />
          Edit Table
        </button>
        <button className="w-full px-3 py-2 text-xs text-left text-gray-300 hover:bg-zinc-800 rounded flex items-center gap-2">
          <Copy className="w-3 h-3" />
          Duplicate
        </button>
        <button className="w-full px-3 py-2 text-xs text-left text-red-400 hover:bg-red-500/20 rounded flex items-center gap-2">
          <Trash2 className="w-3 h-3" />
          Delete Table
        </button>
      </div>
    </div>
  );
}
