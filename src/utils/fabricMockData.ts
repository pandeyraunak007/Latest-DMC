// Microsoft Fabric Mock Data

export interface Workspace {
  id: string;
  name: string;
  type: 'workspace' | 'lakehouse' | 'warehouse';
  region: string;
}

export interface ModelItem {
  id: string;
  name: string;
  type: 'logical' | 'physical' | 'semantic';
  workspace: string;
  entityCount: number;
  lastModified: string;
}

export interface FabricObject {
  id: string;
  name: string;
  schema: string;
  type: 'table' | 'view' | 'relationship' | 'index';
  selected: boolean;
}

export const mockWorkspaces: Workspace[] = [
  { id: 'ws-1', name: 'Finance', type: 'workspace', region: 'East US' },
  { id: 'ws-2', name: 'Sales', type: 'workspace', region: 'West US' },
  { id: 'ws-3', name: 'R&D', type: 'workspace', region: 'Central US' },
  { id: 'ws-4', name: 'Marketing', type: 'workspace', region: 'North Europe' },
  { id: 'ws-5', name: 'Operations', type: 'workspace', region: 'Southeast Asia' }
];

export const mockModels: ModelItem[] = [
  {
    id: 'model-1',
    name: 'Enterprise Data Model v3.2',
    type: 'physical',
    workspace: 'Finance',
    entityCount: 45,
    lastModified: '2 hours ago'
  },
  {
    id: 'model-2',
    name: 'Sales Analytics Model',
    type: 'semantic',
    workspace: 'Sales',
    entityCount: 28,
    lastModified: '1 day ago'
  },
  {
    id: 'model-3',
    name: 'Customer 360 Logical Model',
    type: 'logical',
    workspace: 'Marketing',
    entityCount: 32,
    lastModified: '3 days ago'
  },
  {
    id: 'model-4',
    name: 'Supply Chain Physical Model',
    type: 'physical',
    workspace: 'Operations',
    entityCount: 52,
    lastModified: '1 week ago'
  }
];

export const mockFabricObjects: Record<string, FabricObject[]> = {
  dbo: [
    { id: 'obj-1', name: 'Customers', schema: 'dbo', type: 'table', selected: true },
    { id: 'obj-2', name: 'Orders', schema: 'dbo', type: 'table', selected: true },
    { id: 'obj-3', name: 'Products', schema: 'dbo', type: 'table', selected: true },
    { id: 'obj-4', name: 'CustomerOrders_vw', schema: 'dbo', type: 'view', selected: false },
    { id: 'obj-5', name: 'IX_Customers_Email', schema: 'dbo', type: 'index', selected: false }
  ],
  sales: [
    { id: 'obj-6', name: 'Transactions', schema: 'sales', type: 'table', selected: true },
    { id: 'obj-7', name: 'Regions', schema: 'sales', type: 'table', selected: true },
    { id: 'obj-8', name: 'SalesRepresentatives', schema: 'sales', type: 'table', selected: false },
    { id: 'obj-9', name: 'TransactionSummary_vw', schema: 'sales', type: 'view', selected: false }
  ],
  inventory: [
    { id: 'obj-10', name: 'Stock', schema: 'inventory', type: 'table', selected: false },
    { id: 'obj-11', name: 'Warehouses', schema: 'inventory', type: 'table', selected: false },
    { id: 'obj-12', name: 'StockLevels_vw', schema: 'inventory', type: 'view', selected: false }
  ]
};

export const mockValidationResults = {
  errors: [
    { type: 'error', message: 'Table "Orders" has no primary key defined', object: 'Orders' },
    { type: 'error', message: 'Foreign key constraint missing between Orders and Customers', object: 'Orders' }
  ],
  warnings: [
    { type: 'warning', message: 'Index IX_Customers_Email may cause performance issues', object: 'Customers' },
    { type: 'warning', message: 'View CustomerOrders_vw references deprecated columns', object: 'CustomerOrders_vw' }
  ],
  info: [
    { type: 'info', message: '5 tables ready for deployment', object: 'All' },
    { type: 'info', message: '2 views will be created', object: 'All' }
  ]
};

// Simulation functions
export const simulateSSOConnection = (workspace: string): Promise<{ success: boolean; user: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        user: 'user@company.com'
      });
    }, 2000);
  });
};

export const simulateValidation = (
  onProgress: (progress: number, message: string) => void
): Promise<typeof mockValidationResults> => {
  return new Promise((resolve) => {
    const steps = [
      { progress: 20, message: 'Checking schema definitions...', delay: 500 },
      { progress: 40, message: 'Validating relationships...', delay: 600 },
      { progress: 60, message: 'Checking constraints...', delay: 500 },
      { progress: 80, message: 'Analyzing indexes...', delay: 400 },
      { progress: 100, message: 'Validation complete', delay: 300 }
    ];

    let currentStep = 0;
    const processStep = () => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        onProgress(step.progress, step.message);
        currentStep++;
        setTimeout(processStep, step.delay);
      } else {
        resolve(mockValidationResults);
      }
    };

    processStep();
  });
};

export const simulateDeployment = (
  mode: 'ddl' | 'deploy',
  onProgress: (progress: number, message: string) => void
): Promise<{ success: boolean; details: string }> => {
  return new Promise((resolve) => {
    const steps = mode === 'deploy'
      ? [
          { progress: 15, message: 'Connecting to Fabric workspace...', delay: 600 },
          { progress: 30, message: 'Creating database schema...', delay: 700 },
          { progress: 50, message: 'Creating tables...', delay: 800 },
          { progress: 70, message: 'Applying constraints...', delay: 600 },
          { progress: 85, message: 'Creating indexes...', delay: 500 },
          { progress: 100, message: 'Deployment complete!', delay: 300 }
        ]
      : [
          { progress: 25, message: 'Generating CREATE statements...', delay: 500 },
          { progress: 50, message: 'Generating ALTER statements...', delay: 600 },
          { progress: 75, message: 'Generating INDEX statements...', delay: 500 },
          { progress: 100, message: 'DDL script generated!', delay: 300 }
        ];

    let currentStep = 0;
    const processStep = () => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        onProgress(step.progress, step.message);
        currentStep++;
        setTimeout(processStep, step.delay);
      } else {
        resolve({
          success: true,
          details: mode === 'deploy'
            ? '5 tables and 2 views deployed successfully to Fabric Warehouse'
            : 'DDL script (2,456 lines) generated successfully'
        });
      }
    };

    processStep();
  });
};
