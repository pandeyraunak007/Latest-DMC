// Quick Editor Component - Redesigned with Progressive Workflow
// Step 1: Add Tables (Table List View)
// Step 2: Edit Table Details (Table Editor View with Tabs)

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Save,
  Trash2,
  Table2,
  Search,
  ArrowLeft,
  Key,
  Link2,
  CheckCircle,
  FileText,
  Zap,
  Settings as SettingsIcon,
  Edit3,
  Database,
  Hash,
  ChevronRight,
  MoreHorizontal,
  LayoutGrid,
  List,
  ArrowUpDown,
  Copy,
  Clock
} from 'lucide-react';

// Import types from parent component
export interface Column {
  id: string;
  name: string;
  dataType: string;
  isPK: boolean;
  isNullable: boolean;
  defaultValue?: string;
  isFK?: boolean;
  description?: string;
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

export interface TableIndex {
  id: string;
  name: string;
  columns: string[];
  isUnique: boolean;
  type: 'CLUSTERED' | 'NONCLUSTERED' | 'HASH';
}

export interface ForeignKey {
  id: string;
  name: string;
  column: string;
  referencedTable: string;
  referencedColumn: string;
  onDelete: 'CASCADE' | 'SET NULL' | 'NO ACTION' | 'RESTRICT';
  onUpdate: 'CASCADE' | 'SET NULL' | 'NO ACTION' | 'RESTRICT';
}

export interface TableConstraint {
  id: string;
  name: string;
  type: 'CHECK' | 'UNIQUE' | 'DEFAULT';
  expression: string;
  columns?: string[];
}

export interface Table {
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

type EditorViewMode = 'table-list' | 'table-editor';
type TableEditorTab = 'columns' | 'indexes' | 'foreignKeys' | 'constraints' | 'businessTerms' | 'triggers';
type TableViewMode = 'card' | 'list';
type SortOption = 'name-asc' | 'name-desc' | 'columns-asc' | 'columns-desc' | 'recent';

interface QuickEditorProps {
  tables: Table[];
  onTablesUpdate: (tables: Table[]) => void;
  isDark: boolean;
}

export function QuickEditor({ tables, onTablesUpdate, isDark }: QuickEditorProps) {
  const [editorMode, setEditorMode] = useState<EditorViewMode>('table-list');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [localTables, setLocalTables] = useState<Table[]>(tables);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TableEditorTab>('columns');
  const [viewMode, setViewMode] = useState<TableViewMode>('list');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');

  // Sync external tables to local state
  useEffect(() => {
    setLocalTables(tables);
  }, [tables]);

  // Get selected table
  const selectedTable = selectedTableId ? localTables.find(t => t.id === selectedTableId) : null;

  // SQL Server data types
  const sqlServerDataTypes = [
    'INT', 'BIGINT', 'SMALLINT', 'TINYINT', 'BIT',
    'DECIMAL', 'NUMERIC', 'MONEY', 'SMALLMONEY', 'FLOAT', 'REAL',
    'DATE', 'TIME', 'DATETIME', 'DATETIME2', 'SMALLDATETIME', 'DATETIMEOFFSET',
    'CHAR', 'VARCHAR', 'TEXT', 'NCHAR', 'NVARCHAR', 'NTEXT',
    'BINARY', 'VARBINARY', 'IMAGE',
    'UNIQUEIDENTIFIER', 'XML', 'JSON'
  ];

  // Generate auto-incrementing table name (E1, E2, E3, etc.)
  const generateTableName = () => {
    let counter = 1;
    let name = `E${counter}`;

    // Find the next available E{n} name
    while (localTables.some(t => t.name === name)) {
      counter++;
      name = `E${counter}`;
    }

    return name;
  };

  // Add new table
  const handleAddTable = () => {
    const newTable: Table = {
      id: `table-${Date.now()}`,
      name: generateTableName(),
      x: 100 + (localTables.length * 50),
      y: 100 + (localTables.length * 50),
      columns: [],
      schema: 'dbo',
      tableType: 'Disk Based',
      description: '',
      indexes: [],
      foreignKeys: [],
      constraints: [],
      businessTerms: [],
      triggers: []
    };

    setLocalTables([...localTables, newTable]);
    setHasUnsavedChanges(true);
  };

  // Update table name inline (for list view)
  const handleUpdateTableName = (tableId: string, newName: string) => {
    const updatedTables = localTables.map(t =>
      t.id === tableId ? { ...t, name: newName } : t
    );
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  // Delete table
  const handleDeleteTable = (tableId: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return;

    const updatedTables = localTables.filter(t => t.id !== tableId);
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);

    if (selectedTableId === tableId) {
      setSelectedTableId(null);
      setEditorMode('table-list');
    }
  };

  // Edit table - switch to editor view
  const handleEditTable = (tableId: string) => {
    setSelectedTableId(tableId);
    setEditorMode('table-editor');
    setActiveTab('columns');
  };

  // Back to table list
  const handleBackToList = () => {
    setEditorMode('table-list');
    setSelectedTableId(null);
  };

  // Update table property
  const updateTableProperty = (field: string, value: any) => {
    if (!selectedTableId) return;

    const updatedTables = localTables.map(table =>
      table.id === selectedTableId ? { ...table, [field]: value } : table
    );
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  // Column operations
  const addColumn = () => {
    if (!selectedTableId) return;

    const updatedTables = localTables.map(table => {
      if (table.id === selectedTableId) {
        return {
          ...table,
          columns: [
            ...table.columns,
            {
              id: `col-${Date.now()}`,
              name: 'new_column',
              dataType: 'VARCHAR',
              isPK: false,
              isNullable: true,
              isFK: false,
              description: ''
            }
          ]
        };
      }
      return table;
    });
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  const addPrimaryKeyColumn = () => {
    if (!selectedTableId) return;

    const updatedTables = localTables.map(table => {
      if (table.id === selectedTableId) {
        // Generate a smart PK name based on table name
        const pkName = `${table.name}_id`;
        return {
          ...table,
          columns: [
            {
              id: `col-${Date.now()}`,
              name: pkName,
              dataType: 'INT',
              isPK: true,
              isNullable: false,
              isFK: false,
              description: 'Primary key'
            },
            ...table.columns
          ]
        };
      }
      return table;
    });
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  const addForeignKeyColumn = () => {
    if (!selectedTableId) return;

    const updatedTables = localTables.map(table => {
      if (table.id === selectedTableId) {
        return {
          ...table,
          columns: [
            ...table.columns,
            {
              id: `col-${Date.now()}`,
              name: 'foreign_key_id',
              dataType: 'INT',
              isPK: false,
              isNullable: true,
              isFK: true,
              description: 'Foreign key reference'
            }
          ]
        };
      }
      return table;
    });
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  const addTimestampColumns = () => {
    if (!selectedTableId) return;

    const updatedTables = localTables.map(table => {
      if (table.id === selectedTableId) {
        return {
          ...table,
          columns: [
            ...table.columns,
            {
              id: `col-created-${Date.now()}`,
              name: 'created_at',
              dataType: 'DATETIME2',
              isPK: false,
              isNullable: false,
              isFK: false,
              defaultValue: 'GETDATE()',
              description: 'Record creation timestamp'
            },
            {
              id: `col-updated-${Date.now()}`,
              name: 'updated_at',
              dataType: 'DATETIME2',
              isPK: false,
              isNullable: false,
              isFK: false,
              defaultValue: 'GETDATE()',
              description: 'Record last update timestamp'
            }
          ]
        };
      }
      return table;
    });
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  const duplicateColumn = (columnId: string) => {
    if (!selectedTableId) return;

    const updatedTables = localTables.map(table => {
      if (table.id === selectedTableId) {
        const columnToDuplicate = table.columns.find(c => c.id === columnId);
        if (!columnToDuplicate) return table;

        const duplicatedColumn = {
          ...columnToDuplicate,
          id: `col-${Date.now()}`,
          name: `${columnToDuplicate.name}_copy`,
          isPK: false // Don't duplicate PK
        };

        const columnIndex = table.columns.findIndex(c => c.id === columnId);
        const newColumns = [...table.columns];
        newColumns.splice(columnIndex + 1, 0, duplicatedColumn);

        return {
          ...table,
          columns: newColumns
        };
      }
      return table;
    });
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  const updateColumn = (columnId: string, field: string, value: any) => {
    if (!selectedTableId) return;

    const updatedTables = localTables.map(table => {
      if (table.id === selectedTableId) {
        return {
          ...table,
          columns: table.columns.map(col =>
            col.id === columnId ? { ...col, [field]: value } : col
          )
        };
      }
      return table;
    });
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  const deleteColumn = (columnId: string) => {
    if (!selectedTableId || !confirm('Delete this column?')) return;

    const updatedTables = localTables.map(table => {
      if (table.id === selectedTableId) {
        return {
          ...table,
          columns: table.columns.filter(col => col.id !== columnId)
        };
      }
      return table;
    });
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  // Index operations
  const addIndex = () => {
    if (!selectedTableId) return;

    const updatedTables = localTables.map(table => {
      if (table.id === selectedTableId) {
        const indexes = table.indexes || [];
        return {
          ...table,
          indexes: [
            ...indexes,
            {
              id: `idx-${Date.now()}`,
              name: `idx_${table.name}_new`,
              columns: [],
              isUnique: false,
              type: 'NONCLUSTERED' as const
            }
          ]
        };
      }
      return table;
    });
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  const updateIndex = (indexId: string, field: string, value: any) => {
    if (!selectedTableId) return;

    const updatedTables = localTables.map(table => {
      if (table.id === selectedTableId) {
        return {
          ...table,
          indexes: (table.indexes || []).map(idx =>
            idx.id === indexId ? { ...idx, [field]: value } : idx
          )
        };
      }
      return table;
    });
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  const deleteIndex = (indexId: string) => {
    if (!selectedTableId || !confirm('Delete this index?')) return;

    const updatedTables = localTables.map(table => {
      if (table.id === selectedTableId) {
        return {
          ...table,
          indexes: (table.indexes || []).filter(idx => idx.id !== indexId)
        };
      }
      return table;
    });
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  // Foreign Key operations
  const addForeignKey = () => {
    if (!selectedTableId) return;

    const updatedTables = localTables.map(table => {
      if (table.id === selectedTableId) {
        const foreignKeys = table.foreignKeys || [];
        return {
          ...table,
          foreignKeys: [
            ...foreignKeys,
            {
              id: `fk-${Date.now()}`,
              name: `fk_${table.name}_new`,
              column: '',
              referencedTable: '',
              referencedColumn: '',
              onDelete: 'NO ACTION' as const,
              onUpdate: 'NO ACTION' as const
            }
          ]
        };
      }
      return table;
    });
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  const updateForeignKey = (fkId: string, field: string, value: any) => {
    if (!selectedTableId) return;

    const updatedTables = localTables.map(table => {
      if (table.id === selectedTableId) {
        return {
          ...table,
          foreignKeys: (table.foreignKeys || []).map(fk =>
            fk.id === fkId ? { ...fk, [field]: value } : fk
          )
        };
      }
      return table;
    });
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  const deleteForeignKey = (fkId: string) => {
    if (!selectedTableId || !confirm('Delete this foreign key?')) return;

    const updatedTables = localTables.map(table => {
      if (table.id === selectedTableId) {
        return {
          ...table,
          foreignKeys: (table.foreignKeys || []).filter(fk => fk.id !== fkId)
        };
      }
      return table;
    });
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  // Constraint operations
  const addConstraint = () => {
    if (!selectedTableId) return;

    const updatedTables = localTables.map(table => {
      if (table.id === selectedTableId) {
        const constraints = table.constraints || [];
        return {
          ...table,
          constraints: [
            ...constraints,
            {
              id: `const-${Date.now()}`,
              name: `chk_${table.name}_new`,
              type: 'CHECK' as const,
              expression: '',
              columns: []
            }
          ]
        };
      }
      return table;
    });
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  const updateConstraint = (constId: string, field: string, value: any) => {
    if (!selectedTableId) return;

    const updatedTables = localTables.map(table => {
      if (table.id === selectedTableId) {
        return {
          ...table,
          constraints: (table.constraints || []).map(c =>
            c.id === constId ? { ...c, [field]: value } : c
          )
        };
      }
      return table;
    });
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  const deleteConstraint = (constId: string) => {
    if (!selectedTableId || !confirm('Delete this constraint?')) return;

    const updatedTables = localTables.map(table => {
      if (table.id === selectedTableId) {
        return {
          ...table,
          constraints: (table.constraints || []).filter(c => c.id !== constId)
        };
      }
      return table;
    });
    setLocalTables(updatedTables);
    setHasUnsavedChanges(true);
  };

  // Save changes
  const handleSave = () => {
    onTablesUpdate(localTables);
    setHasUnsavedChanges(false);
  };

  // Cancel changes
  const handleCancel = () => {
    setLocalTables(tables);
    setHasUnsavedChanges(false);
  };

  // Filter and sort tables
  const filteredTables = localTables
    .filter(table =>
      table.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'columns-asc':
          return a.columns.length - b.columns.length;
        case 'columns-desc':
          return b.columns.length - a.columns.length;
        case 'recent':
          // Assuming newer tables have higher IDs (based on timestamp)
          return b.id.localeCompare(a.id);
        default:
          return 0;
      }
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 bg-zinc-950 overflow-auto"
    >
      <div className="h-full flex flex-col">
        {/* Dynamic Toolbar */}
        <div className={`border-b ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-gray-200 bg-white'}`}>
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {editorMode === 'table-editor' && (
                <button
                  onClick={handleBackToList}
                  className={`p-2 rounded-md transition-colors ${
                    isDark ? 'hover:bg-zinc-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}

              <div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {editorMode === 'table-list' ? 'Quick Editor - Tables' : `Editing: ${selectedTable?.name || ''}`}
                </h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                  {editorMode === 'table-list'
                    ? `${localTables.length} ${localTables.length === 1 ? 'table' : 'tables'} in model`
                    : 'Configure table properties and structure'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {editorMode === 'table-list' && (
                <button
                  onClick={handleAddTable}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Table
                </button>
              )}

              {hasUnsavedChanges && (
                <>
                  <div className={`h-6 w-px ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />
                  <button
                    onClick={handleCancel}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isDark
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save & Update Diagram
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            {editorMode === 'table-list' ? (
              <TableListView
                tables={filteredTables}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onEditTable={handleEditTable}
                onDeleteTable={handleDeleteTable}
                onUpdateTableName={handleUpdateTableName}
                isDark={isDark}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortOption={sortOption}
                onSortChange={setSortOption}
              />
            ) : selectedTable ? (
              <TableEditorView
                table={selectedTable}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onUpdateProperty={updateTableProperty}
                onAddColumn={addColumn}
                onAddPrimaryKeyColumn={addPrimaryKeyColumn}
                onAddForeignKeyColumn={addForeignKeyColumn}
                onAddTimestampColumns={addTimestampColumns}
                onDuplicateColumn={duplicateColumn}
                onUpdateColumn={updateColumn}
                onDeleteColumn={deleteColumn}
                onAddIndex={addIndex}
                onUpdateIndex={updateIndex}
                onDeleteIndex={deleteIndex}
                onAddForeignKey={addForeignKey}
                onUpdateForeignKey={updateForeignKey}
                onDeleteForeignKey={deleteForeignKey}
                onAddConstraint={addConstraint}
                onUpdateConstraint={updateConstraint}
                onDeleteConstraint={deleteConstraint}
                isDark={isDark}
                sqlServerDataTypes={sqlServerDataTypes}
                allTables={localTables}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// Table List View Component
interface TableListViewProps {
  tables: Table[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEditTable: (tableId: string) => void;
  onDeleteTable: (tableId: string) => void;
  onUpdateTableName: (tableId: string, newName: string) => void;
  isDark: boolean;
  viewMode: TableViewMode;
  onViewModeChange: (mode: TableViewMode) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

function TableListView({
  tables,
  searchTerm,
  onSearchChange,
  onEditTable,
  onDeleteTable,
  onUpdateTableName,
  isDark,
  viewMode,
  onViewModeChange,
  sortOption,
  onSortChange
}: TableListViewProps) {
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  return (
    <motion.div
      key="table-list"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="max-w-7xl mx-auto"
    >
      {/* Search Bar & Controls */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tables..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border ${
              isDark
                ? 'bg-zinc-800 border-zinc-700 text-gray-100 placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              View:
            </span>
            <div className={`inline-flex rounded-md border ${isDark ? 'border-zinc-700' : 'border-gray-300'}`}>
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
                  viewMode === 'list'
                    ? isDark
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-600 text-white'
                    : isDark
                    ? 'bg-zinc-800 text-gray-400 hover:text-gray-200'
                    : 'bg-white text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                List
              </button>
              <button
                onClick={() => onViewModeChange('card')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors inline-flex items-center gap-1.5 border-l ${
                  isDark ? 'border-zinc-700' : 'border-gray-300'
                } ${
                  viewMode === 'card'
                    ? isDark
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-600 text-white'
                    : isDark
                    ? 'bg-zinc-800 text-gray-400 hover:text-gray-200'
                    : 'bg-white text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Cards
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                isDark
                  ? 'bg-zinc-800 border-zinc-700 text-gray-300'
                  : 'bg-white border-gray-300 text-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="columns-asc">Columns (Low-High)</option>
              <option value="columns-desc">Columns (High-Low)</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tables Display */}
      {tables.length === 0 ? (
        <div className={`text-center py-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No tables yet</p>
          <p className="text-sm">Click "Add Table" to create your first table</p>
        </div>
      ) : viewMode === 'list' ? (
        /* List View - Compact */
        <div className={`border rounded-lg overflow-hidden ${
          isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-white'
        }`}>
          <table className="w-full">
            <thead className={`${isDark ? 'bg-zinc-900 border-b border-zinc-800' : 'bg-gray-50 border-b border-gray-200'}`}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Table Name
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Schema
                </th>
                <th className={`px-4 py-3 text-center text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Columns
                </th>
                <th className={`px-4 py-3 text-center text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  PKs
                </th>
                <th className={`px-4 py-3 text-center text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  FKs
                </th>
                <th className={`px-4 py-3 text-center text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Indexes
                </th>
                <th className={`px-4 py-3 text-right text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table, index) => {
                const pkCount = table.columns.filter(c => c.isPK).length;
                const fkCount = table.foreignKeys?.length || 0;
                const indexCount = table.indexes?.length || 0;

                return (
                  <motion.tr
                    key={table.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`border-b transition-colors cursor-pointer ${
                      isDark
                        ? 'border-zinc-800 hover:bg-zinc-800/50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={(e) => {
                      // Only trigger onEditTable if not clicking on the input
                      if ((e.target as HTMLElement).tagName !== 'INPUT') {
                        onEditTable(table.id);
                      }
                    }}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <Table2 className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        {editingTableId === table.id ? (
                          <input
                            type="text"
                            defaultValue={table.name}
                            autoFocus
                            onBlur={(e) => {
                              onUpdateTableName(table.id, e.target.value);
                              setEditingTableId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                onUpdateTableName(table.id, e.currentTarget.value);
                                setEditingTableId(null);
                              } else if (e.key === 'Escape') {
                                setEditingTableId(null);
                              }
                            }}
                            className={`px-2 py-1 text-sm font-medium rounded border ${
                              isDark
                                ? 'bg-zinc-800 border-zinc-700 text-gray-200'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                          />
                        ) : (
                          <span
                            className={`text-sm font-medium cursor-text ${isDark ? 'text-gray-200' : 'text-gray-900'}`}
                            onDoubleClick={() => setEditingTableId(table.id)}
                          >
                            {table.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {table.schema || 'dbo'}
                    </td>
                    <td className={`px-4 py-3 text-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {table.columns.length}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        pkCount > 0
                          ? isDark
                            ? 'bg-indigo-500/20 text-indigo-400'
                            : 'bg-indigo-100 text-indigo-700'
                          : isDark
                          ? 'bg-zinc-800 text-gray-500'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {pkCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        fkCount > 0
                          ? isDark
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-purple-100 text-purple-700'
                          : isDark
                          ? 'bg-zinc-800 text-gray-500'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {fkCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        indexCount > 0
                          ? isDark
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-green-100 text-green-700'
                          : isDark
                          ? 'bg-zinc-800 text-gray-500'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {indexCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTable(table.id);
                        }}
                        className={`p-1.5 rounded transition-colors ${
                          isDark
                            ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Card View - Original */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`border rounded-lg p-4 transition-all hover:shadow-lg cursor-pointer ${
                isDark
                  ? 'border-zinc-800 bg-zinc-900/50 hover:border-indigo-500/50'
                  : 'border-gray-200 bg-white hover:border-indigo-500/50'
              }`}
              onClick={(e) => {
                // Only trigger onEditTable if not clicking on the input
                if ((e.target as HTMLElement).tagName !== 'INPUT') {
                  onEditTable(table.id);
                }
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-indigo-600/20' : 'bg-indigo-100'}`}>
                    <Table2 className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingTableId === table.id ? (
                      <input
                        type="text"
                        defaultValue={table.name}
                        autoFocus
                        onBlur={(e) => {
                          onUpdateTableName(table.id, e.target.value);
                          setEditingTableId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onUpdateTableName(table.id, e.currentTarget.value);
                            setEditingTableId(null);
                          } else if (e.key === 'Escape') {
                            setEditingTableId(null);
                          }
                        }}
                        className={`w-full px-2 py-1 text-sm font-semibold rounded border ${
                          isDark
                            ? 'bg-zinc-800 border-zinc-700 text-gray-100'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                    ) : (
                      <h3
                        className={`text-sm font-semibold truncate cursor-text ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
                        onDoubleClick={() => setEditingTableId(table.id)}
                      >
                        {table.name}
                      </h3>
                    )}
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {table.schema || 'dbo'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTable(table.id);
                  }}
                  className={`p-1.5 rounded-md transition-colors ${
                    isDark ? 'hover:bg-red-500/10 text-gray-500 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className={`space-y-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" />
                    Columns
                  </span>
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {table.columns.length}
                  </span>
                </div>

                {table.indexes && table.indexes.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5" />
                      Indexes
                    </span>
                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {table.indexes.length}
                    </span>
                  </div>
                )}

                {table.foreignKeys && table.foreignKeys.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5" />
                      Foreign Keys
                    </span>
                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {table.foreignKeys.length}
                    </span>
                  </div>
                )}

                {table.description && (
                  <p className={`mt-2 pt-2 border-t ${isDark ? 'border-zinc-800 text-gray-500' : 'border-gray-200 text-gray-600'} line-clamp-2`}>
                    {table.description}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: isDark ? '#27272a' : '#e5e7eb' }}>
                <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-zinc-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                  {table.tableType || 'Disk Based'}
                </span>
                <ChevronRight className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Table Editor View Component
interface TableEditorViewProps {
  table: Table;
  activeTab: TableEditorTab;
  onTabChange: (tab: TableEditorTab) => void;
  onUpdateProperty: (field: string, value: any) => void;
  onAddColumn: () => void;
  onAddPrimaryKeyColumn: () => void;
  onAddForeignKeyColumn: () => void;
  onAddTimestampColumns: () => void;
  onDuplicateColumn: (columnId: string) => void;
  onUpdateColumn: (columnId: string, field: string, value: any) => void;
  onDeleteColumn: (columnId: string) => void;
  onAddIndex: () => void;
  onUpdateIndex: (indexId: string, field: string, value: any) => void;
  onDeleteIndex: (indexId: string) => void;
  onAddForeignKey: () => void;
  onUpdateForeignKey: (fkId: string, field: string, value: any) => void;
  onDeleteForeignKey: (fkId: string) => void;
  onAddConstraint: () => void;
  onUpdateConstraint: (constId: string, field: string, value: any) => void;
  onDeleteConstraint: (constId: string) => void;
  isDark: boolean;
  sqlServerDataTypes: string[];
  allTables: Table[];
}

function TableEditorView({
  table,
  activeTab,
  onTabChange,
  onUpdateProperty,
  onAddColumn,
  onAddPrimaryKeyColumn,
  onAddForeignKeyColumn,
  onAddTimestampColumns,
  onDuplicateColumn,
  onUpdateColumn,
  onDeleteColumn,
  onAddIndex,
  onUpdateIndex,
  onDeleteIndex,
  onAddForeignKey,
  onUpdateForeignKey,
  onDeleteForeignKey,
  onAddConstraint,
  onUpdateConstraint,
  onDeleteConstraint,
  isDark,
  sqlServerDataTypes,
  allTables
}: TableEditorViewProps) {
  const tabs: { id: TableEditorTab; label: string; icon: any }[] = [
    { id: 'columns', label: 'Columns', icon: Hash },
    { id: 'indexes', label: 'Indexes', icon: Key },
    { id: 'foreignKeys', label: 'Foreign Keys', icon: Link2 },
    { id: 'constraints', label: 'Constraints', icon: CheckCircle },
    { id: 'businessTerms', label: 'Business Terms', icon: FileText },
    { id: 'triggers', label: 'Triggers', icon: Zap }
  ];

  return (
    <motion.div
      key="table-editor"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Table Properties Card - Compact */}
      <div className={`border rounded-lg ${
        isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-white'
      }`}>
        <div className="p-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <SettingsIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Properties:</span>
          </div>
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Name:
              </label>
              <input
                type="text"
                value={table.name}
                onChange={(e) => onUpdateProperty('name', e.target.value)}
                className={`px-2 py-1 rounded text-sm border ${
                  isDark
                    ? 'bg-zinc-800 border-zinc-700 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Schema:
              </label>
              <input
                type="text"
                value={table.schema || 'dbo'}
                onChange={(e) => onUpdateProperty('schema', e.target.value)}
                className={`w-24 px-2 py-1 rounded text-sm border ${
                  isDark
                    ? 'bg-zinc-800 border-zinc-700 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Type:
              </label>
              <select
                value={table.tableType || 'Disk Based'}
                onChange={(e) => onUpdateProperty('tableType', e.target.value)}
                className={`px-2 py-1 rounded text-sm border ${
                  isDark
                    ? 'bg-zinc-800 border-zinc-700 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              >
                <option>Disk Based</option>
                <option>Memory Optimized</option>
                <option>File Table</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`border-b ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors inline-flex items-center gap-2 border-b-2 ${
                  activeTab === tab.id
                    ? isDark
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                      : 'border-indigo-600 text-indigo-600 bg-indigo-50'
                    : isDark
                    ? 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-zinc-800/50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'columns' && ` (${table.columns.length})`}
                {tab.id === 'indexes' && table.indexes && ` (${table.indexes.length})`}
                {tab.id === 'foreignKeys' && table.foreignKeys && ` (${table.foreignKeys.length})`}
                {tab.id === 'constraints' && table.constraints && ` (${table.constraints.length})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'columns' && (
          <ColumnsTab
            table={table}
            onAddColumn={onAddColumn}
            onAddPrimaryKeyColumn={onAddPrimaryKeyColumn}
            onAddForeignKeyColumn={onAddForeignKeyColumn}
            onAddTimestampColumns={onAddTimestampColumns}
            onAddIndex={onAddIndex}
            onDuplicateColumn={onDuplicateColumn}
            onUpdateColumn={onUpdateColumn}
            onDeleteColumn={onDeleteColumn}
            isDark={isDark}
            sqlServerDataTypes={sqlServerDataTypes}
          />
        )}
        {activeTab === 'indexes' && (
          <IndexesTab
            table={table}
            onAddIndex={onAddIndex}
            onUpdateIndex={onUpdateIndex}
            onDeleteIndex={onDeleteIndex}
            isDark={isDark}
          />
        )}
        {activeTab === 'foreignKeys' && (
          <ForeignKeysTab
            table={table}
            allTables={allTables}
            onAddForeignKey={onAddForeignKey}
            onUpdateForeignKey={onUpdateForeignKey}
            onDeleteForeignKey={onDeleteForeignKey}
            isDark={isDark}
          />
        )}
        {activeTab === 'constraints' && (
          <ConstraintsTab
            table={table}
            onAddConstraint={onAddConstraint}
            onUpdateConstraint={onUpdateConstraint}
            onDeleteConstraint={onDeleteConstraint}
            isDark={isDark}
          />
        )}
        {activeTab === 'businessTerms' && (
          <BusinessTermsTab table={table} onUpdateProperty={onUpdateProperty} isDark={isDark} />
        )}
        {activeTab === 'triggers' && (
          <TriggersTab table={table} onUpdateProperty={onUpdateProperty} isDark={isDark} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Columns Tab
function ColumnsTab({
  table,
  onAddColumn,
  onAddPrimaryKeyColumn,
  onAddForeignKeyColumn,
  onAddTimestampColumns,
  onAddIndex,
  onDuplicateColumn,
  onUpdateColumn,
  onDeleteColumn,
  isDark,
  sqlServerDataTypes
}: {
  table: Table;
  onAddColumn: () => void;
  onAddPrimaryKeyColumn: () => void;
  onAddForeignKeyColumn: () => void;
  onAddTimestampColumns: () => void;
  onAddIndex: () => void;
  onDuplicateColumn: (columnId: string) => void;
  onUpdateColumn: (columnId: string, field: string, value: any) => void;
  onDeleteColumn: (columnId: string) => void;
  isDark: boolean;
  sqlServerDataTypes: string[];
}) {
  return (
    <motion.div
      key="columns-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
          Table Columns ({table.columns.length})
        </h4>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddColumn}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Column
          </button>
          <button
            onClick={onAddPrimaryKeyColumn}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
              isDark
                ? 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-600/30'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
            }`}
            title="Add a primary key column"
          >
            <Key className="w-3.5 h-3.5" />
            Add PK
          </button>
          <button
            onClick={onAddForeignKeyColumn}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
              isDark
                ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-600/30'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
            }`}
            title="Add a foreign key column"
          >
            <Link2 className="w-3.5 h-3.5" />
            Add FK
          </button>
          <button
            onClick={onAddIndex}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
              isDark
                ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30'
                : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
            }`}
            title="Add an index to this table"
          >
            <Zap className="w-3.5 h-3.5" />
            Add Index
          </button>
          <button
            onClick={onAddTimestampColumns}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
              isDark
                ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
            }`}
            title="Add created_at and updated_at timestamp columns"
          >
            <Clock className="w-3.5 h-3.5" />
            Add Timestamps
          </button>
        </div>
      </div>

      {/* Columns Table */}
      <div className={`border rounded-lg overflow-hidden ${
        isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-white'
      }`}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className={isDark ? 'bg-zinc-900 border-b border-zinc-800' : 'bg-gray-50 border-b border-gray-200'}>
            <tr>
              <th className={`px-3 py-3 text-left font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Name</th>
              <th className={`px-3 py-3 text-left font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Data Type</th>
              <th className={`px-3 py-3 text-center font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>PK</th>
              <th className={`px-3 py-3 text-center font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>FK</th>
              <th className={`px-3 py-3 text-center font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Nullable</th>
              <th className={`px-3 py-3 text-left font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Default</th>
              <th className={`px-3 py-3 text-left font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description</th>
              <th className={`px-3 py-3 text-center font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {table.columns.length === 0 ? (
              <tr>
                <td colSpan={8} className={`px-4 py-8 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No columns yet. Click "Add Column" to start.</p>
                </td>
              </tr>
            ) : (
              table.columns.map((col) => (
                <tr
                  key={col.id}
                  className={`border-b transition-colors ${
                    isDark ? 'border-zinc-800 hover:bg-zinc-800/50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={col.name}
                      onChange={(e) => onUpdateColumn(col.id, 'name', e.target.value)}
                      className={`w-full min-w-[120px] bg-transparent border rounded px-2 py-1.5 text-xs focus:outline-none ${
                        isDark ? 'border-zinc-700 text-gray-100 focus:border-indigo-500' : 'border-gray-300 text-gray-900 focus:border-indigo-500'
                      }`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={col.dataType}
                      onChange={(e) => onUpdateColumn(col.id, 'dataType', e.target.value)}
                      className={`w-full min-w-[130px] bg-transparent border rounded px-2 py-1.5 text-xs focus:outline-none ${
                        isDark ? 'border-zinc-700 text-gray-100 focus:border-indigo-500' : 'border-gray-300 text-gray-900 focus:border-indigo-500'
                      }`}
                    >
                      {sqlServerDataTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={col.isPK}
                      onChange={(e) => onUpdateColumn(col.id, 'isPK', e.target.checked)}
                      className={`rounded text-indigo-600 focus:ring-indigo-500 ${isDark ? 'border-zinc-600 bg-zinc-800' : 'border-gray-300 bg-white'}`}
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={col.isFK || false}
                      onChange={(e) => onUpdateColumn(col.id, 'isFK', e.target.checked)}
                      className={`rounded text-indigo-600 focus:ring-indigo-500 ${isDark ? 'border-zinc-600 bg-zinc-800' : 'border-gray-300 bg-white'}`}
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={col.isNullable}
                      onChange={(e) => onUpdateColumn(col.id, 'isNullable', e.target.checked)}
                      className={`rounded text-indigo-600 focus:ring-indigo-500 ${isDark ? 'border-zinc-600 bg-zinc-800' : 'border-gray-300 bg-white'}`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={col.defaultValue || ''}
                      onChange={(e) => onUpdateColumn(col.id, 'defaultValue', e.target.value)}
                      placeholder="NULL"
                      className={`w-full min-w-[100px] bg-transparent border rounded px-2 py-1.5 text-xs focus:outline-none ${
                        isDark ? 'border-zinc-700 text-gray-100 focus:border-indigo-500 placeholder-gray-600' : 'border-gray-300 text-gray-900 focus:border-indigo-500 placeholder-gray-400'
                      }`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={col.description || ''}
                      onChange={(e) => onUpdateColumn(col.id, 'description', e.target.value)}
                      placeholder="Description..."
                      className={`w-full min-w-[150px] bg-transparent border rounded px-2 py-1.5 text-xs focus:outline-none ${
                        isDark ? 'border-zinc-700 text-gray-100 focus:border-indigo-500 placeholder-gray-600' : 'border-gray-300 text-gray-900 focus:border-indigo-500 placeholder-gray-400'
                      }`}
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onDuplicateColumn(col.id)}
                        className={`p-1.5 rounded transition-colors ${
                          isDark ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        title="Duplicate column"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteColumn(col.id)}
                        className={`p-1.5 rounded transition-colors ${
                          isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                        }`}
                        title="Delete column"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </motion.div>
  );
}

// Indexes Tab
function IndexesTab({
  table,
  onAddIndex,
  onUpdateIndex,
  onDeleteIndex,
  isDark
}: {
  table: Table;
  onAddIndex: () => void;
  onUpdateIndex: (indexId: string, field: string, value: any) => void;
  onDeleteIndex: (indexId: string) => void;
  isDark: boolean;
}) {
  const indexes = table.indexes || [];

  return (
    <motion.div
      key="indexes-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
          Table Indexes ({indexes.length})
        </h4>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddIndex}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Index
          </button>
        </div>
      </div>

      {indexes.length === 0 ? (
        <div className={`border rounded-lg p-8 text-center ${isDark ? 'border-zinc-800 bg-zinc-900/50 text-gray-500' : 'border-gray-200 bg-white text-gray-400'}`}>
          <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No indexes defined yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {indexes.map((index) => (
            <div
              key={index.id}
              className={`border rounded-lg p-4 ${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-white'}`}
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Index Name
                  </label>
                  <input
                    type="text"
                    value={index.name}
                    onChange={(e) => onUpdateIndex(index.id, 'name', e.target.value)}
                    className={`w-full px-3 py-2 rounded-md text-sm border ${
                      isDark ? 'bg-zinc-800 border-zinc-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Type
                  </label>
                  <select
                    value={index.type}
                    onChange={(e) => onUpdateIndex(index.id, 'type', e.target.value)}
                    className={`w-full px-3 py-2 rounded-md text-sm border ${
                      isDark ? 'bg-zinc-800 border-zinc-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="CLUSTERED">CLUSTERED</option>
                    <option value="NONCLUSTERED">NONCLUSTERED</option>
                    <option value="HASH">HASH</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={index.isUnique}
                      onChange={(e) => onUpdateIndex(index.id, 'isUnique', e.target.checked)}
                      className={`rounded text-indigo-600 focus:ring-indigo-500 ${isDark ? 'border-zinc-600 bg-zinc-800' : 'border-gray-300 bg-white'}`}
                    />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Unique</span>
                  </label>
                  <button
                    onClick={() => onDeleteIndex(index.id)}
                    className={`ml-auto p-2 rounded transition-colors ${
                      isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Foreign Keys Tab
function ForeignKeysTab({
  table,
  allTables,
  onAddForeignKey,
  onUpdateForeignKey,
  onDeleteForeignKey,
  isDark
}: {
  table: Table;
  allTables: Table[];
  onAddForeignKey: () => void;
  onUpdateForeignKey: (fkId: string, field: string, value: any) => void;
  onDeleteForeignKey: (fkId: string) => void;
  isDark: boolean;
}) {
  const foreignKeys = table.foreignKeys || [];

  return (
    <motion.div
      key="fk-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
          Foreign Keys ({foreignKeys.length})
        </h4>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddForeignKey}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Foreign Key
          </button>
        </div>
      </div>

      {foreignKeys.length === 0 ? (
        <div className={`border rounded-lg p-8 text-center ${isDark ? 'border-zinc-800 bg-zinc-900/50 text-gray-500' : 'border-gray-200 bg-white text-gray-400'}`}>
          <Link2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No foreign keys defined yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {foreignKeys.map((fk) => (
            <div
              key={fk.id}
              className={`border rounded-lg p-4 ${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-white'}`}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Foreign Key Name
                  </label>
                  <input
                    type="text"
                    value={fk.name}
                    onChange={(e) => onUpdateForeignKey(fk.id, 'name', e.target.value)}
                    className={`w-full px-3 py-2 rounded-md text-sm border ${
                      isDark ? 'bg-zinc-800 border-zinc-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Column
                  </label>
                  <select
                    value={fk.column}
                    onChange={(e) => onUpdateForeignKey(fk.id, 'column', e.target.value)}
                    className={`w-full px-3 py-2 rounded-md text-sm border ${
                      isDark ? 'bg-zinc-800 border-zinc-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="">Select column...</option>
                    {table.columns.map((col) => (
                      <option key={col.id} value={col.name}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Referenced Table
                  </label>
                  <select
                    value={fk.referencedTable}
                    onChange={(e) => onUpdateForeignKey(fk.id, 'referencedTable', e.target.value)}
                    className={`w-full px-3 py-2 rounded-md text-sm border ${
                      isDark ? 'bg-zinc-800 border-zinc-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="">Select table...</option>
                    {allTables.filter(t => t.id !== table.id).map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    On Delete
                  </label>
                  <select
                    value={fk.onDelete}
                    onChange={(e) => onUpdateForeignKey(fk.id, 'onDelete', e.target.value)}
                    className={`w-full px-3 py-2 rounded-md text-sm border ${
                      isDark ? 'bg-zinc-800 border-zinc-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="CASCADE">CASCADE</option>
                    <option value="SET NULL">SET NULL</option>
                    <option value="NO ACTION">NO ACTION</option>
                    <option value="RESTRICT">RESTRICT</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => onDeleteForeignKey(fk.id)}
                    className={`ml-auto p-2 rounded transition-colors ${
                      isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Constraints Tab
function ConstraintsTab({
  table,
  onAddConstraint,
  onUpdateConstraint,
  onDeleteConstraint,
  isDark
}: {
  table: Table;
  onAddConstraint: () => void;
  onUpdateConstraint: (constId: string, field: string, value: any) => void;
  onDeleteConstraint: (constId: string) => void;
  isDark: boolean;
}) {
  const constraints = table.constraints || [];

  return (
    <motion.div
      key="constraints-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
          Constraints ({constraints.length})
        </h4>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddConstraint}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Constraint
          </button>
        </div>
      </div>

      {constraints.length === 0 ? (
        <div className={`border rounded-lg p-8 text-center ${isDark ? 'border-zinc-800 bg-zinc-900/50 text-gray-500' : 'border-gray-200 bg-white text-gray-400'}`}>
          <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No constraints defined yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {constraints.map((constraint) => (
            <div
              key={constraint.id}
              className={`border rounded-lg p-4 ${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-white'}`}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Constraint Name
                  </label>
                  <input
                    type="text"
                    value={constraint.name}
                    onChange={(e) => onUpdateConstraint(constraint.id, 'name', e.target.value)}
                    className={`w-full px-3 py-2 rounded-md text-sm border ${
                      isDark ? 'bg-zinc-800 border-zinc-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Type
                  </label>
                  <select
                    value={constraint.type}
                    onChange={(e) => onUpdateConstraint(constraint.id, 'type', e.target.value)}
                    className={`w-full px-3 py-2 rounded-md text-sm border ${
                      isDark ? 'bg-zinc-800 border-zinc-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="CHECK">CHECK</option>
                    <option value="UNIQUE">UNIQUE</option>
                    <option value="DEFAULT">DEFAULT</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Expression
                  </label>
                  <textarea
                    value={constraint.expression}
                    onChange={(e) => onUpdateConstraint(constraint.id, 'expression', e.target.value)}
                    rows={2}
                    placeholder="e.g., price > 0"
                    className={`w-full px-3 py-2 rounded-md text-sm border font-mono ${
                      isDark ? 'bg-zinc-800 border-zinc-700 text-gray-100 placeholder-gray-600' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <button
                    onClick={() => onDeleteConstraint(constraint.id)}
                    className={`p-2 rounded transition-colors ${
                      isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Business Terms Tab
function BusinessTermsTab({
  table,
  onUpdateProperty,
  isDark
}: {
  table: Table;
  onUpdateProperty: (field: string, value: any) => void;
  isDark: boolean;
}) {
  const [newTerm, setNewTerm] = useState('');
  const businessTerms = table.businessTerms || [];

  const addTerm = () => {
    if (!newTerm.trim()) return;
    onUpdateProperty('businessTerms', [...businessTerms, newTerm.trim()]);
    setNewTerm('');
  };

  const removeTerm = (index: number) => {
    onUpdateProperty('businessTerms', businessTerms.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      key="business-terms-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`border rounded-lg p-6 ${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-white'}`}
    >
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Add Business Term
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTerm()}
              placeholder="Enter business term..."
              className={`flex-1 px-3 py-2 rounded-md text-sm border ${
                isDark ? 'bg-zinc-800 border-zinc-700 text-gray-100 placeholder-gray-600' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            <button
              onClick={addTerm}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {businessTerms.length > 0 && (
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Business Terms ({businessTerms.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {businessTerms.map((term, index) => (
                <div
                  key={index}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                    isDark ? 'bg-zinc-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>{term}</span>
                  <button
                    onClick={() => removeTerm(index)}
                    className={`hover:text-red-500 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Triggers Tab
function TriggersTab({
  table,
  onUpdateProperty,
  isDark
}: {
  table: Table;
  onUpdateProperty: (field: string, value: any) => void;
  isDark: boolean;
}) {
  return (
    <motion.div
      key="triggers-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`border rounded-lg p-6 ${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-white'}`}
    >
      <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm font-medium mb-2">Triggers</p>
        <p className="text-xs">Trigger configuration coming soon</p>
      </div>
    </motion.div>
  );
}
