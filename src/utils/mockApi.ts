// Mock Data for Reverse Engineering and Forward Engineering Wizards

export interface DatabaseSource {
  id: string;
  name: string;
  icon: string;
  status: 'supported' | 'coming-soon';
  description: string;
  category: 'relational' | 'nosql' | 'cloud';
}

export interface Schema {
  id: string;
  name: string;
  tableCount: number;
  viewCount: number;
}

export interface DatabaseObject {
  id: string;
  name: string;
  type: 'table' | 'view' | 'procedure' | 'function';
  schema: string;
  columnCount: number;
  rowCount: string;
  size: string;
  hasIndexes: boolean;
  hasForeignKeys: boolean;
}

export interface TargetOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: 'database' | 'file' | 'cloud';
}

export interface OutputFormat {
  id: string;
  name: string;
  extension: string;
  description: string;
}

// Mock Database Sources
export const mockDatabaseSources: DatabaseSource[] = [
  {
    id: 'fabric',
    name: 'MS Fabric',
    icon: '🟦',
    status: 'supported',
    description: 'Microsoft Fabric Data Warehouse',
    category: 'cloud'
  },
  {
    id: 'mysql',
    name: 'MySQL',
    icon: '🐬',
    status: 'supported',
    description: 'MySQL Database Server',
    category: 'relational'
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: '🐘',
    status: 'supported',
    description: 'PostgreSQL Database Server',
    category: 'relational'
  },
  {
    id: 'sqlserver',
    name: 'SQL Server',
    icon: '🟪',
    status: 'supported',
    description: 'Microsoft SQL Server',
    category: 'relational'
  },
  {
    id: 'oracle',
    name: 'Oracle',
    icon: '🅾️',
    status: 'coming-soon',
    description: 'Oracle Database',
    category: 'relational'
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    icon: '🍃',
    status: 'coming-soon',
    description: 'MongoDB NoSQL Database',
    category: 'nosql'
  }
];

// Mock Schemas
export const mockSchemas: Schema[] = [
  { id: 'dbo', name: 'dbo', tableCount: 24, viewCount: 8 },
  { id: 'sales', name: 'sales', tableCount: 12, viewCount: 5 },
  { id: 'inventory', name: 'inventory', tableCount: 18, viewCount: 3 },
  { id: 'hr', name: 'hr', tableCount: 9, viewCount: 2 },
  { id: 'analytics', name: 'analytics', tableCount: 6, viewCount: 12 }
];

// Mock Database Objects
export const mockDatabaseObjects: DatabaseObject[] = [
  {
    id: 'users-1',
    name: 'Users',
    type: 'table',
    schema: 'dbo',
    columnCount: 12,
    rowCount: '2,345',
    size: '1.2 MB',
    hasIndexes: true,
    hasForeignKeys: true
  },
  {
    id: 'products-1',
    name: 'Products',
    type: 'table',
    schema: 'dbo',
    columnCount: 18,
    rowCount: '850',
    size: '2.8 MB',
    hasIndexes: true,
    hasForeignKeys: false
  },
  {
    id: 'orders-1',
    name: 'Orders',
    type: 'table',
    schema: 'sales',
    columnCount: 15,
    rowCount: '15,234',
    size: '5.4 MB',
    hasIndexes: true,
    hasForeignKeys: true
  },
  {
    id: 'orderitems-1',
    name: 'OrderItems',
    type: 'table',
    schema: 'sales',
    columnCount: 6,
    rowCount: '48,756',
    size: '8.1 MB',
    hasIndexes: true,
    hasForeignKeys: true
  },
  {
    id: 'categories-1',
    name: 'Categories',
    type: 'table',
    schema: 'dbo',
    columnCount: 4,
    rowCount: '25',
    size: '16 KB',
    hasIndexes: false,
    hasForeignKeys: false
  },
  {
    id: 'customers-1',
    name: 'Customers',
    type: 'table',
    schema: 'sales',
    columnCount: 14,
    rowCount: '3,421',
    size: '3.2 MB',
    hasIndexes: true,
    hasForeignKeys: false
  },
  {
    id: 'inventory-1',
    name: 'Inventory',
    type: 'table',
    schema: 'inventory',
    columnCount: 8,
    rowCount: '1,234',
    size: '890 KB',
    hasIndexes: true,
    hasForeignKeys: true
  },
  {
    id: 'v-userorders-1',
    name: 'v_UserOrders',
    type: 'view',
    schema: 'sales',
    columnCount: 20,
    rowCount: '15,234',
    size: 'N/A',
    hasIndexes: false,
    hasForeignKeys: false
  },
  {
    id: 'v-productsummary-1',
    name: 'v_ProductSummary',
    type: 'view',
    schema: 'dbo',
    columnCount: 8,
    rowCount: '850',
    size: 'N/A',
    hasIndexes: false,
    hasForeignKeys: false
  },
  {
    id: 'sp-getuserorders-1',
    name: 'sp_GetUserOrders',
    type: 'procedure',
    schema: 'sales',
    columnCount: 0,
    rowCount: 'N/A',
    size: 'N/A',
    hasIndexes: false,
    hasForeignKeys: false
  }
];

// Mock Target Options for Forward Engineering
export const mockTargets: TargetOption[] = [
  {
    id: 'sqlserver-target',
    name: 'SQL Server',
    icon: '🟪',
    description: 'Deploy to SQL Server Database',
    type: 'database'
  },
  {
    id: 'mysql-target',
    name: 'MySQL',
    icon: '🐬',
    description: 'Deploy to MySQL Database',
    type: 'database'
  },
  {
    id: 'postgresql-target',
    name: 'PostgreSQL',
    icon: '🐘',
    description: 'Deploy to PostgreSQL Database',
    type: 'database'
  },
  {
    id: 'ddl-script',
    name: 'DDL Script',
    icon: '📄',
    description: 'Generate SQL DDL Script File',
    type: 'file'
  },
  {
    id: 'json-export',
    name: 'JSON Export',
    icon: '📋',
    description: 'Export as JSON Schema',
    type: 'file'
  },
  {
    id: 'azure-sql',
    name: 'Azure SQL',
    icon: '☁️',
    description: 'Deploy to Azure SQL Database',
    type: 'cloud'
  },
  {
    id: 'aws-rds',
    name: 'AWS RDS',
    icon: '🔶',
    description: 'Deploy to AWS RDS',
    type: 'cloud'
  }
];

// Mock Output Formats
export const mockOutputFormats: OutputFormat[] = [
  { id: 'ddl', name: 'DDL Script', extension: '.sql', description: 'Standard SQL DDL statements' },
  { id: 'json', name: 'JSON Schema', extension: '.json', description: 'JSON schema definition' },
  { id: 'xml', name: 'XML Schema', extension: '.xml', description: 'XML schema definition' },
  { id: 'yaml', name: 'YAML', extension: '.yaml', description: 'YAML configuration file' },
  { id: 'markdown', name: 'Markdown Docs', extension: '.md', description: 'Documentation in Markdown format' }
];

// Mock Models
export interface Model {
  id: string;
  name: string;
  entityCount: number;
  lastModified: string;
  version: string;
}

export const mockModels: Model[] = [
  { id: '1', name: 'E-Commerce Platform', entityCount: 42, lastModified: '2 hours ago', version: 'v2.1' },
  { id: '2', name: 'CRM Database', entityCount: 28, lastModified: '1 day ago', version: 'v1.5' },
  { id: '3', name: 'Inventory System', entityCount: 18, lastModified: '3 days ago', version: 'v3.0' },
  { id: '4', name: 'User Management', entityCount: 12, lastModified: '1 week ago', version: 'v1.2' }
];

// Utility Functions for Simulations

export const simulateConnection = (delay: number = 2000): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Connection successful! Database schema retrieved.'
      });
    }, delay);
  });
};

export const simulateSchemaFetch = (sourceId: string, delay: number = 1500): Promise<Schema[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSchemas);
    }, delay);
  });
};

export const simulateObjectFetch = (schemaId: string, delay: number = 1000): Promise<DatabaseObject[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = mockDatabaseObjects.filter(obj => obj.schema === schemaId || schemaId === 'all');
      resolve(filtered);
    }, delay);
  });
};

export const simulateReverseEngineering = (
  onProgress: (progress: number, message: string) => void
): Promise<{ success: boolean; entitiesCreated: number }> => {
  return new Promise((resolve) => {
    const steps = [
      { progress: 10, message: 'Connecting to database...', delay: 500 },
      { progress: 25, message: 'Reading schema information...', delay: 700 },
      { progress: 45, message: 'Analyzing table structures...', delay: 800 },
      { progress: 60, message: 'Detecting relationships...', delay: 900 },
      { progress: 80, message: 'Generating entity models...', delay: 700 },
      { progress: 95, message: 'Finalizing model...', delay: 500 },
      { progress: 100, message: 'Complete!', delay: 300 }
    ];

    let currentStep = 0;
    const processStep = () => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        onProgress(step.progress, step.message);
        currentStep++;
        setTimeout(processStep, step.delay);
      } else {
        resolve({ success: true, entitiesCreated: 24 });
      }
    };

    processStep();
  });
};

export const simulateForwardEngineering = (
  outputType: string,
  onProgress: (progress: number, message: string) => void
): Promise<{ success: boolean; fileName: string; size: string }> => {
  return new Promise((resolve) => {
    const steps = [
      { progress: 15, message: 'Loading model data...', delay: 400 },
      { progress: 35, message: 'Generating schema definitions...', delay: 600 },
      { progress: 55, message: 'Creating table structures...', delay: 700 },
      { progress: 75, message: 'Adding constraints and indexes...', delay: 600 },
      { progress: 90, message: 'Formatting output...', delay: 500 },
      { progress: 100, message: 'Generation complete!', delay: 300 }
    ];

    let currentStep = 0;
    const processStep = () => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        onProgress(step.progress, step.message);
        currentStep++;
        setTimeout(processStep, step.delay);
      } else {
        const format = mockOutputFormats.find(f => f.id === outputType) || mockOutputFormats[0];
        resolve({
          success: true,
          fileName: `model_export_${Date.now()}${format.extension}`,
          size: '245 KB'
        });
      }
    };

    processStep();
  });
};

export const simulateSSO = (provider: string, delay: number = 2000): Promise<{ success: boolean; user: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        user: 'user@company.com'
      });
    }, delay);
  });
};
