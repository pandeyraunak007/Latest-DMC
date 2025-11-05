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
  Circle
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
    <div className="h-full flex flex-col bg-white">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 bg-white">
        <div className="flex items-center gap-4">
          {/* View Mode Tabs */}
          <div className="flex items-center gap-1 bg-zinc-50 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('diagram')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'diagram'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1.5" />
              Diagram View
            </button>
            <button
              onClick={() => setViewMode('quick-editor')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'quick-editor'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Table2 className="w-3.5 h-3.5 inline mr-1.5" />
              Quick Editor
            </button>
            <button
              onClick={() => setViewMode('properties')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'properties'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5 inline mr-1.5" />
              Properties
            </button>
          </div>

          <div className="w-px h-6 bg-zinc-200" />

          {/* Tools */}
          {viewMode === 'diagram' && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTool('select')}
                className={`p-1.5 rounded transition-colors ${
                  activeTool === 'select' ? 'bg-blue-50 text-blue-600' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
                title="Select"
              >
                <MousePointer2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTool('table')}
                className={`p-1.5 rounded transition-colors ${
                  activeTool === 'table' ? 'bg-blue-50 text-blue-600' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
                title="Add Table"
              >
                <Box className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTool('relationship')}
                className={`p-1.5 rounded transition-colors ${
                  activeTool === 'relationship' ? 'bg-blue-50 text-blue-600' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
                title="Add Relationship"
              >
                <Link2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTool('note')}
                className={`p-1.5 rounded transition-colors ${
                  activeTool === 'note' ? 'bg-blue-50 text-blue-600' : 'text-zinc-600 hover:bg-zinc-100'
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
              <div className="flex items-center gap-1 bg-zinc-50 rounded-lg px-2 py-1">
                <button onClick={handleZoomOut} className="p-1 hover:bg-zinc-200 rounded" title="Zoom Out">
                  <ZoomOut className="w-3.5 h-3.5 text-zinc-600" />
                </button>
                <span className="text-xs font-medium text-zinc-600 min-w-[3rem] text-center">{zoom}%</span>
                <button onClick={handleZoomIn} className="p-1 hover:bg-zinc-200 rounded" title="Zoom In">
                  <ZoomIn className="w-3.5 h-3.5 text-zinc-600" />
                </button>
              </div>
              <div className="w-px h-6 bg-zinc-200" />
            </>
          )}

          {/* Actions */}
          <button className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded" title="Undo">
            <Undo2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded" title="Redo">
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-zinc-200" />

          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isLocked
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            {isLocked ? 'Locked' : 'Unlocked'}
          </button>

          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors">
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
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-zinc-200 bg-white overflow-auto"
            >
              <LeftPanel />
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
              />
            )}
            {viewMode === 'quick-editor' && (
              <QuickEditor tables={tables} onTablesUpdate={setTables} />
            )}
            {viewMode === 'properties' && (
              <PropertiesView selectedTable={tables.find(t => t.id === selectedTable)} />
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
              className="border-l border-zinc-200 bg-white overflow-auto"
            >
              <RightPropertiesPanel table={tables.find(t => t.id === selectedTable)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Left Panel Component
function LeftPanel() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['models']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  return (
    <div className="p-3">
      <h3 className="text-xs font-semibold text-zinc-900 mb-3">Diagrammer</h3>

      {/* Models Section */}
      <div className="mb-3">
        <button
          onClick={() => toggleSection('models')}
          className="flex items-center justify-between w-full text-xs font-medium text-zinc-700 hover:text-zinc-900 mb-2"
        >
          <span className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5" />
            Models
          </span>
          {expandedSections.includes('models') ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
        {expandedSections.includes('models') && (
          <div className="ml-5 space-y-1">
            <button className="text-xs text-zinc-600 hover:text-zinc-900 w-full text-left py-1">
              E-Commerce Model
            </button>
            <button className="text-xs text-zinc-600 hover:text-zinc-900 w-full text-left py-1">
              Customer 360
            </button>
            <button className="text-xs text-zinc-600 hover:text-zinc-900 w-full text-left py-1">
              Financial DW
            </button>
          </div>
        )}
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
  onAddTable
}: {
  tables: Table[];
  relationships: Relationship[];
  zoom: number;
  selectedTable: string | null;
  onTableSelect: (id: string | null) => void;
  onAddTable: () => void;
}) {
  return (
    <motion.div
      key="diagram"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 bg-zinc-50 overflow-auto relative"
      style={{
        backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    >
      <div
        className="relative"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top left',
          width: `${(100 / zoom) * 100}%`,
          height: `${(100 / zoom) * 100}%`
        }}
      >
        {/* Render Tables */}
        {tables.map(table => (
          <div
            key={table.id}
            onClick={() => onTableSelect(table.id)}
            className={`absolute bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer ${
              selectedTable === table.id ? 'border-blue-500 shadow-lg' : 'border-zinc-200 hover:border-zinc-300'
            }`}
            style={{
              left: `${table.x}px`,
              top: `${table.y}px`,
              minWidth: '200px'
            }}
          >
            {/* Table Header */}
            <div className="px-3 py-2 bg-zinc-50 border-b border-zinc-200 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-xs font-semibold text-zinc-900">{table.name}</span>
              </div>
            </div>

            {/* Columns */}
            <div className="p-2">
              {table.columns.map(col => (
                <div
                  key={col.id}
                  className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-zinc-50 rounded"
                >
                  {col.isPK && (
                    <span className="w-4 h-4 flex items-center justify-center bg-amber-100 text-amber-700 rounded text-xs font-bold">
                      PK
                    </span>
                  )}
                  <span className="flex-1 text-zinc-700">{col.name}</span>
                  <span className="text-zinc-400 text-xs">{col.dataType}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {tables.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Database className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-zinc-700 mb-2">No Tables Yet</h3>
              <p className="text-xs text-zinc-500 mb-4">Start by adding your first table to the diagram</p>
              <button
                onClick={onAddTable}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Table
              </button>
            </div>
          </div>
        )}
      </div>
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
      className="flex-1 bg-white overflow-auto p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Quick Editor</h2>
            <p className="text-xs text-zinc-500 mt-1">Add and edit tables in spreadsheet mode</p>
          </div>
          <button
            onClick={addNewTable}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Table
          </button>
        </div>

        <div className="space-y-6">
          {tables.map(table => (
            <div key={table.id} className="border border-zinc-200 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-zinc-50 px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
                <input
                  type="text"
                  defaultValue={table.name}
                  className="text-sm font-semibold text-zinc-900 bg-transparent border-none focus:outline-none focus:ring-0"
                  placeholder="Table Name"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addColumn(table.id)}
                    className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Plus className="w-3 h-3 inline mr-1" />
                    Add Column
                  </button>
                  <button className="p-1 text-zinc-400 hover:text-red-600 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Columns Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-zinc-700">Column Name</th>
                      <th className="px-4 py-2 text-left font-medium text-zinc-700">Data Type</th>
                      <th className="px-4 py-2 text-center font-medium text-zinc-700">PK</th>
                      <th className="px-4 py-2 text-center font-medium text-zinc-700">Nullable</th>
                      <th className="px-4 py-2 text-left font-medium text-zinc-700">Default</th>
                      <th className="px-4 py-2 text-center font-medium text-zinc-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs">No columns yet. Click "Add Column" to start.</p>
                        </td>
                      </tr>
                    ) : (
                      table.columns.map(col => (
                        <tr key={col.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              defaultValue={col.name}
                              className="w-full bg-transparent border border-zinc-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              defaultValue={col.dataType}
                              className="w-full bg-transparent border border-zinc-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={col.isPK}
                              className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={col.isNullable}
                              className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              defaultValue={col.defaultValue || ''}
                              placeholder="NULL"
                              className="w-full bg-transparent border border-zinc-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button className="p-1 text-zinc-400 hover:text-red-600">
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
            <div className="text-center py-12 border-2 border-dashed border-zinc-200 rounded-lg">
              <Table2 className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-zinc-700 mb-2">No Tables Yet</h3>
              <p className="text-xs text-zinc-500 mb-4">Start adding tables to build your data model</p>
              <button
                onClick={addNewTable}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add First Table
              </button>
            </div>
          )}
        </div>

        {/* Action Bar */}
        {tables.length > 0 && (
          <div className="mt-6 flex items-center justify-between pt-6 border-t border-zinc-200">
            <button className="px-4 py-2 text-xs text-zinc-600 hover:text-zinc-900 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh from Diagram
            </button>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-md text-xs font-medium transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors inline-flex items-center gap-2">
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
      className="flex-1 bg-white overflow-auto p-6"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-zinc-900 mb-6">Model Properties</h2>

        <div className="space-y-6">
          {/* General Information */}
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">General Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-600 mb-1">Model Name</label>
                <input
                  type="text"
                  defaultValue="E-Commerce Model"
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-600 mb-1">Version</label>
                <input
                  type="text"
                  defaultValue="1.0.0"
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-zinc-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  defaultValue="Complete e-commerce data model with products, orders, and customer management"
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-zinc-600 mb-1">Total Tables</p>
                <p className="text-lg font-semibold text-zinc-900">12</p>
              </div>
              <div>
                <p className="text-xs text-zinc-600 mb-1">Total Columns</p>
                <p className="text-lg font-semibold text-zinc-900">84</p>
              </div>
              <div>
                <p className="text-xs text-zinc-600 mb-1">Relationships</p>
                <p className="text-lg font-semibold text-zinc-900">15</p>
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
      <h3 className="text-sm font-semibold text-zinc-900 mb-4">Table Properties</h3>

      {/* Table Name */}
      <div className="mb-4">
        <label className="block text-xs text-zinc-600 mb-1">Table Name</label>
        <input
          type="text"
          defaultValue={table.name}
          className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Columns List */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-medium text-zinc-700">Columns ({table.columns.length})</label>
          <button className="text-xs text-blue-600 hover:text-blue-700">
            <Plus className="w-3 h-3 inline mr-1" />
            Add
          </button>
        </div>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {table.columns.map(col => (
            <div key={col.id} className="px-2 py-1.5 bg-zinc-50 rounded text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                {col.isPK && (
                  <span className="px-1 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-bold">PK</span>
                )}
                <span className="text-zinc-700">{col.name}</span>
              </div>
              <span className="text-zinc-400 text-xs">{col.dataType}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-zinc-200 space-y-2">
        <button className="w-full px-3 py-2 text-xs text-left text-zinc-700 hover:bg-zinc-50 rounded flex items-center gap-2">
          <Edit3 className="w-3 h-3" />
          Edit Table
        </button>
        <button className="w-full px-3 py-2 text-xs text-left text-zinc-700 hover:bg-zinc-50 rounded flex items-center gap-2">
          <Copy className="w-3 h-3" />
          Duplicate
        </button>
        <button className="w-full px-3 py-2 text-xs text-left text-red-600 hover:bg-red-50 rounded flex items-center gap-2">
          <Trash2 className="w-3 h-3" />
          Delete Table
        </button>
      </div>
    </div>
  );
}
