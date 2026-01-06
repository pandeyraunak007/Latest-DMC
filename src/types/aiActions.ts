// AI Copilot Action Types and Interfaces

export type AIActionType =
  | 'addTable'
  | 'updateTable'
  | 'deleteTable'
  | 'addColumn'
  | 'updateColumn'
  | 'deleteColumn'
  | 'addRelationship'
  | 'deleteRelationship'
  | 'addIndex'
  | 'deleteIndex';

export interface AIAction {
  type: AIActionType;
  payload: any;
  description: string;
}

// Column structure for AI actions
export interface AIColumnPayload {
  name: string;
  dataType: string;
  isPK?: boolean;
  isNullable?: boolean;
  isFK?: boolean;
  defaultValue?: string;
  description?: string;
}

// Payloads for each action type
export interface AddTablePayload {
  name: string;
  columns: AIColumnPayload[];
  schema?: string;
  description?: string;
}

export interface UpdateTablePayload {
  tableName: string;
  updates: {
    name?: string;
    schema?: string;
    description?: string;
  };
}

export interface DeleteTablePayload {
  tableName: string;
}

export interface AddColumnPayload {
  tableName: string;
  column: AIColumnPayload;
}

export interface UpdateColumnPayload {
  tableName: string;
  columnName: string;
  updates: Partial<AIColumnPayload>;
}

export interface DeleteColumnPayload {
  tableName: string;
  columnName: string;
}

export interface AddRelationshipPayload {
  fromTable: string;
  toTable: string;
  type: '1:1' | '1:N' | 'N:M';
  relationshipType: 'identifying' | 'non-identifying' | 'sub-type' | 'many-to-many';
}

export interface DeleteRelationshipPayload {
  fromTable: string;
  toTable: string;
}

export interface AddIndexPayload {
  tableName: string;
  indexName: string;
  columns: string[];
  isUnique?: boolean;
  type?: 'CLUSTERED' | 'NONCLUSTERED' | 'HASH';
}

export interface DeleteIndexPayload {
  tableName: string;
  indexName: string;
}

// Simplified table/relationship types for context (avoid circular deps)
export interface ContextTable {
  id: string;
  name: string;
  columns: {
    name: string;
    dataType: string;
    isPK: boolean;
    isNullable: boolean;
    isFK?: boolean;
  }[];
  schema?: string;
}

export interface ContextRelationship {
  fromTable: string;
  toTable: string;
  type: '1:1' | '1:N' | 'N:M';
  relationshipType: string;
}

// Diagram context passed to AI
export interface DiagramContext {
  tables: ContextTable[];
  relationships: ContextRelationship[];
  selectedTableId: string | null;
  selectedTableName: string | null;
  modelType: 'physical' | 'logical';
  totalTables: number;
  totalRelationships: number;
}

// API request/response types
export interface ChatRequest {
  messages: { role: 'user' | 'assistant'; content: string }[];
  context?: DiagramContext;
}

export interface ChatResponse {
  message: string;
  actions?: AIAction[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
