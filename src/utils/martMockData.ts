// Mock Data for Mart Catalog

export type ModelStatus = 'active' | 'locked' | 'checked-out' | 'archived';

export interface MartModel {
  id: string;
  name: string;
  path: string;
  folder: string;
  description: string;
  entityCount: number;
  lastModified: string;
  lastOpened?: string;
  status: ModelStatus;
  version: string;
  author: string;
  size: string;
  tags: string[];
  isFavorite: boolean;
}

export interface FolderStructure {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'model';
  children?: FolderStructure[];
  modelData?: MartModel;
}

// Mock Mart Models Repository
export const mockMartModels: MartModel[] = [
  {
    id: 'mart-1',
    name: 'E-Commerce Platform',
    path: '/mart/retail/ecommerce',
    folder: 'Retail',
    description: 'Complete e-commerce data model with products, orders, and customer management',
    entityCount: 42,
    lastModified: '2 hours ago',
    lastOpened: '1 hour ago',
    status: 'active',
    version: 'v2.1.0',
    author: 'John Doe',
    size: '2.4 MB',
    tags: ['retail', 'ecommerce', 'production'],
    isFavorite: true
  },
  {
    id: 'mart-2',
    name: 'Customer 360 View',
    path: '/mart/crm/customer360',
    folder: 'CRM',
    description: 'Unified customer data model integrating multiple touchpoints',
    entityCount: 28,
    lastModified: '1 day ago',
    lastOpened: '3 hours ago',
    status: 'active',
    version: 'v1.5.2',
    author: 'Jane Smith',
    size: '1.8 MB',
    tags: ['crm', 'customer', 'analytics'],
    isFavorite: true
  },
  {
    id: 'mart-3',
    name: 'Financial Data Warehouse',
    path: '/mart/finance/datawarehouse',
    folder: 'Finance',
    description: 'Enterprise financial reporting and analytics model',
    entityCount: 56,
    lastModified: '3 days ago',
    lastOpened: '2 days ago',
    status: 'checked-out',
    version: 'v3.0.1',
    author: 'Mike Johnson',
    size: '4.2 MB',
    tags: ['finance', 'reporting', 'warehouse'],
    isFavorite: false
  },
  {
    id: 'mart-4',
    name: 'Inventory Management System',
    path: '/mart/operations/inventory',
    folder: 'Operations',
    description: 'Multi-warehouse inventory tracking and management',
    entityCount: 32,
    lastModified: '5 days ago',
    lastOpened: '4 days ago',
    status: 'active',
    version: 'v2.3.0',
    author: 'Sarah Williams',
    size: '2.1 MB',
    tags: ['inventory', 'operations', 'warehouse'],
    isFavorite: true
  },
  {
    id: 'mart-5',
    name: 'Healthcare Patient Records',
    path: '/mart/healthcare/patients',
    folder: 'Healthcare',
    description: 'HIPAA-compliant patient information management system',
    entityCount: 48,
    lastModified: '1 week ago',
    lastOpened: '5 days ago',
    status: 'locked',
    version: 'v1.8.0',
    author: 'Dr. Emily Brown',
    size: '3.5 MB',
    tags: ['healthcare', 'hipaa', 'patient'],
    isFavorite: false
  },
  {
    id: 'mart-6',
    name: 'Supply Chain Logistics',
    path: '/mart/operations/supply-chain',
    folder: 'Operations',
    description: 'End-to-end supply chain tracking and optimization',
    entityCount: 38,
    lastModified: '1 week ago',
    lastOpened: '6 days ago',
    status: 'active',
    version: 'v2.0.5',
    author: 'David Lee',
    size: '2.7 MB',
    tags: ['logistics', 'supply-chain', 'operations'],
    isFavorite: true
  },
  {
    id: 'mart-7',
    name: 'Marketing Campaign Analytics',
    path: '/mart/marketing/campaigns',
    folder: 'Marketing',
    description: 'Multi-channel marketing campaign tracking and ROI analysis',
    entityCount: 24,
    lastModified: '2 weeks ago',
    lastOpened: '1 week ago',
    status: 'active',
    version: 'v1.3.0',
    author: 'Lisa Anderson',
    size: '1.5 MB',
    tags: ['marketing', 'analytics', 'campaigns'],
    isFavorite: false
  },
  {
    id: 'mart-8',
    name: 'HR Employee Management',
    path: '/mart/hr/employees',
    folder: 'Human Resources',
    description: 'Comprehensive employee data and performance tracking',
    entityCount: 18,
    lastModified: '2 weeks ago',
    lastOpened: '10 days ago',
    status: 'active',
    version: 'v1.6.0',
    author: 'Robert Taylor',
    size: '1.2 MB',
    tags: ['hr', 'employees', 'performance'],
    isFavorite: true
  },
  {
    id: 'mart-9',
    name: 'IoT Sensor Data Platform',
    path: '/mart/iot/sensors',
    folder: 'IoT',
    description: 'Real-time IoT sensor data collection and analysis',
    entityCount: 35,
    lastModified: '3 weeks ago',
    status: 'archived',
    version: 'v0.9.0',
    author: 'Alex Chen',
    size: '2.9 MB',
    tags: ['iot', 'sensors', 'real-time'],
    isFavorite: false
  },
  {
    id: 'mart-10',
    name: 'Social Media Analytics',
    path: '/mart/marketing/social-media',
    folder: 'Marketing',
    description: 'Social media engagement and sentiment analysis',
    entityCount: 22,
    lastModified: '1 month ago',
    status: 'active',
    version: 'v1.1.0',
    author: 'Maria Garcia',
    size: '1.6 MB',
    tags: ['social-media', 'analytics', 'marketing'],
    isFavorite: false
  }
];

// Folder Structure
export const mockFolderStructure: FolderStructure[] = [
  {
    id: 'folder-retail',
    name: 'Retail',
    path: '/mart/retail',
    type: 'folder',
    children: [
      {
        id: 'mart-1',
        name: 'E-Commerce Platform',
        path: '/mart/retail/ecommerce',
        type: 'model',
        modelData: mockMartModels[0]
      }
    ]
  },
  {
    id: 'folder-crm',
    name: 'CRM',
    path: '/mart/crm',
    type: 'folder',
    children: [
      {
        id: 'mart-2',
        name: 'Customer 360 View',
        path: '/mart/crm/customer360',
        type: 'model',
        modelData: mockMartModels[1]
      }
    ]
  },
  {
    id: 'folder-finance',
    name: 'Finance',
    path: '/mart/finance',
    type: 'folder',
    children: [
      {
        id: 'mart-3',
        name: 'Financial Data Warehouse',
        path: '/mart/finance/datawarehouse',
        type: 'model',
        modelData: mockMartModels[2]
      }
    ]
  },
  {
    id: 'folder-operations',
    name: 'Operations',
    path: '/mart/operations',
    type: 'folder',
    children: [
      {
        id: 'mart-4',
        name: 'Inventory Management System',
        path: '/mart/operations/inventory',
        type: 'model',
        modelData: mockMartModels[3]
      },
      {
        id: 'mart-6',
        name: 'Supply Chain Logistics',
        path: '/mart/operations/supply-chain',
        type: 'model',
        modelData: mockMartModels[5]
      }
    ]
  },
  {
    id: 'folder-healthcare',
    name: 'Healthcare',
    path: '/mart/healthcare',
    type: 'folder',
    children: [
      {
        id: 'mart-5',
        name: 'Healthcare Patient Records',
        path: '/mart/healthcare/patients',
        type: 'model',
        modelData: mockMartModels[4]
      }
    ]
  },
  {
    id: 'folder-marketing',
    name: 'Marketing',
    path: '/mart/marketing',
    type: 'folder',
    children: [
      {
        id: 'mart-7',
        name: 'Marketing Campaign Analytics',
        path: '/mart/marketing/campaigns',
        type: 'model',
        modelData: mockMartModels[6]
      },
      {
        id: 'mart-10',
        name: 'Social Media Analytics',
        path: '/mart/marketing/social-media',
        type: 'model',
        modelData: mockMartModels[9]
      }
    ]
  },
  {
    id: 'folder-hr',
    name: 'Human Resources',
    path: '/mart/hr',
    type: 'folder',
    children: [
      {
        id: 'mart-8',
        name: 'HR Employee Management',
        path: '/mart/hr/employees',
        type: 'model',
        modelData: mockMartModels[7]
      }
    ]
  },
  {
    id: 'folder-iot',
    name: 'IoT',
    path: '/mart/iot',
    type: 'folder',
    children: [
      {
        id: 'mart-9',
        name: 'IoT Sensor Data Platform',
        path: '/mart/iot/sensors',
        type: 'model',
        modelData: mockMartModels[8]
      }
    ]
  }
];

// Get favorite models
export const getFavoriteModels = (): MartModel[] => {
  return mockMartModels.filter(model => model.isFavorite);
};

// Get recently opened models
export const getRecentlyOpenedModels = (): MartModel[] => {
  return mockMartModels
    .filter(model => model.lastOpened)
    .sort((a, b) => {
      // Sort by last opened (most recent first)
      const timeA = parseTimeAgo(a.lastOpened || '');
      const timeB = parseTimeAgo(b.lastOpened || '');
      return timeA - timeB;
    });
};

// Helper to parse "time ago" strings for sorting
const parseTimeAgo = (timeAgo: string): number => {
  const match = timeAgo.match(/(\d+)\s+(hour|day|week|month)/);
  if (!match) return Infinity;

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers: { [key: string]: number } = {
    hour: 1,
    day: 24,
    week: 24 * 7,
    month: 24 * 30
  };

  return value * (multipliers[unit] || 1);
};
