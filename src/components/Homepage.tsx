'use client';

import { useState } from 'react';
import {
  Database,
  Clock,
  Star,
  Play,
  MessageSquare,
  GitBranch,
  AlertTriangle,
  FileText,
  Plus,
  Upload,
  Download,
  Scale,
  Sparkles,
  Search,
  Brain,
  Bot,
  Lightbulb,
  Activity,
  RefreshCw,
  Eye,
  BookOpen,
  AlertCircle,
  MoreHorizontal,
  ArrowRight,
  AtSign,
  Pin,
  Folder,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Zap
} from 'lucide-react';

// Types
type ModelStatus = 'draft' | 'in-review' | 'approved' | 'active';
type ActivityType = 'change' | 'comment' | 'review' | 'mention' | 'conflict';

interface Model {
  id: string;
  name: string;
  path: string;
  lastModified: string;
  editor: string;
  entityCount: number;
  status: ModelStatus;
  thumbnail?: string;
  pinned?: boolean;
}

interface ActivityItem {
  id: string;
  type: ActivityType;
  user: string;
  avatar?: string;
  action: string;
  model: string;
  timestamp: string;
  read: boolean;
  mentionsMe?: boolean;
}

interface AISuggestion {
  id: string;
  type: 'normalization' | 'indexing' | 'naming' | 'documentation';
  title: string;
  description: string;
  model: string;
  priority: 'high' | 'medium' | 'low';
}

// ============== ZONE 1: My Work Section ==============
const MyWorkSection = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'recent' | 'drafts' | 'pinned'>('recent');
  const [pinnedModels, setPinnedModels] = useState<string[]>(['model-1', 'model-3']);

  const models: Model[] = [
    { id: 'model-1', name: 'E-Commerce Platform v2.1', path: '/projects/ecommerce', lastModified: '2 hours ago', editor: 'You', entityCount: 42, status: 'active', pinned: true },
    { id: 'model-2', name: 'Customer Analytics Schema', path: '/projects/analytics', lastModified: '5 hours ago', editor: 'Sarah M.', entityCount: 28, status: 'in-review' },
    { id: 'model-3', name: 'User Management System', path: '/projects/auth', lastModified: '1 day ago', editor: 'You', entityCount: 12, status: 'draft', pinned: true },
    { id: 'model-4', name: 'Inventory Tracking DB', path: '/projects/inventory', lastModified: '2 days ago', editor: 'Mike R.', entityCount: 35, status: 'approved' },
    { id: 'model-5', name: 'Payment Processing Model', path: '/projects/payments', lastModified: '3 days ago', editor: 'You', entityCount: 18, status: 'active' },
    { id: 'model-6', name: 'Reporting Data Warehouse', path: '/projects/reports', lastModified: '1 week ago', editor: 'Lisa K.', entityCount: 56, status: 'in-review' },
  ];

  const lastActiveModel = models[0];

  const getStatusBadge = (status: ModelStatus) => {
    const styles = {
      'draft': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'in-review': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'approved': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'active': 'bg-violet-500/20 text-violet-400 border-violet-500/30'
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full border ${styles[status]}`}>
        {status.replace('-', ' ')}
      </span>
    );
  };

  const togglePin = (modelId: string) => {
    setPinnedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : prev.length < 10 ? [...prev, modelId] : prev
    );
  };

  const filteredModels = () => {
    switch (activeTab) {
      case 'pinned':
        return models.filter(m => pinnedModels.includes(m.id));
      case 'drafts':
        return models.filter(m => m.status === 'draft' || m.status === 'in-review');
      default:
        return models.slice(0, 10);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
      {/* Continue Editing Banner */}
      <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-b border-violet-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-600 rounded-lg">
              <Play className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Continue where you left off</p>
              <p className="font-medium text-gray-900 dark:text-zinc-100">{lastActiveModel.name}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('diagrammer')}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            Continue Editing
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-3 border-b border-gray-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab('recent')}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2 ${
            activeTab === 'recent'
              ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100'
              : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          Recent
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2 ${
            activeTab === 'drafts'
              ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100'
              : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Drafts & Reviews
        </button>
        <button
          onClick={() => setActiveTab('pinned')}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2 ${
            activeTab === 'pinned'
              ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100'
              : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Star className="w-4 h-4" />
          Pinned ({pinnedModels.length}/10)
        </button>
      </div>

      {/* Model List */}
      <div className="divide-y divide-gray-100 dark:divide-zinc-800">
        {filteredModels().map((model) => (
          <div
            key={model.id}
            className="p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
            onClick={() => onNavigate('diagrammer')}
          >
            <div className="flex items-center gap-3">
              {/* Thumbnail placeholder */}
              <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-gray-500 dark:text-zinc-500" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-zinc-100 truncate">{model.name}</span>
                  {getStatusBadge(model.status)}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-zinc-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Folder className="w-3 h-3" />
                    {model.path}
                  </span>
                  <span>{model.entityCount} entities</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {model.lastModified}
                  </span>
                  <span>by {model.editor}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePin(model.id);
                  }}
                  className={`p-1.5 rounded-md transition-colors ${
                    pinnedModels.includes(model.id)
                      ? 'text-amber-500 bg-amber-500/10'
                      : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Pin className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredModels().length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-zinc-500">
          <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No pinned models yet</p>
          <p className="text-xs mt-1">Click the pin icon on any model to add it here</p>
        </div>
      )}
    </div>
  );
};

// ============== ZONE 2: Activity & Collaboration Feed ==============
const ActivityFeed = () => {
  const [filter, setFilter] = useState<'all' | 'mentions' | 'reviews' | 'comments' | 'changes'>('all');
  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: '1', type: 'mention', user: 'Sarah M.', action: 'mentioned you in a comment on', model: 'E-Commerce Platform', timestamp: '10 min ago', read: false, mentionsMe: true },
    { id: '2', type: 'review', user: 'Mike R.', action: 'requested your review on', model: 'Payment Processing Model', timestamp: '1 hour ago', read: false },
    { id: '3', type: 'conflict', user: 'System', action: 'detected version conflict in', model: 'User Management System', timestamp: '2 hours ago', read: false },
    { id: '4', type: 'change', user: 'Lisa K.', action: 'added 3 new entities to', model: 'Inventory Tracking DB', timestamp: '3 hours ago', read: true },
    { id: '5', type: 'comment', user: 'John D.', action: 'commented on your changes in', model: 'Customer Analytics Schema', timestamp: '5 hours ago', read: true },
    { id: '6', type: 'change', user: 'Sarah M.', action: 'modified relationships in', model: 'E-Commerce Platform', timestamp: '1 day ago', read: true },
  ]);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'mention': return <AtSign className="w-4 h-4 text-violet-500" />;
      case 'review': return <Eye className="w-4 h-4 text-blue-500" />;
      case 'conflict': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'change': return <GitBranch className="w-4 h-4 text-emerald-500" />;
      case 'comment': return <MessageSquare className="w-4 h-4 text-amber-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const filteredActivities = activities.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'mentions') return a.type === 'mention';
    if (filter === 'reviews') return a.type === 'review';
    if (filter === 'comments') return a.type === 'comment';
    if (filter === 'changes') return a.type === 'change';
    return true;
  });

  const unreadCount = activities.filter(a => !a.read).length;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
      <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-violet-500" />
            Activity Feed
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{unreadCount}</span>
            )}
          </h3>
          <button className="text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200">
            Mark all read
          </button>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {(['all', 'mentions', 'reviews', 'comments', 'changes'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              {f === 'mentions' ? '@Mentions' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-zinc-800 max-h-80 overflow-y-auto">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className={`p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer ${
              !activity.read ? 'bg-violet-50/50 dark:bg-violet-900/10' : ''
            }`}
            onClick={() => markAsRead(activity.id)}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-zinc-100">
                  <span className="font-medium">{activity.user}</span>
                  {' '}{activity.action}{' '}
                  <span className="font-medium text-violet-600 dark:text-violet-400">{activity.model}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">{activity.timestamp}</p>
              </div>
              {!activity.read && (
                <div className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0 mt-2" />
              )}
              {activity.type === 'conflict' && (
                <button className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
                  Resolve
                </button>
              )}
              {activity.type === 'review' && (
                <button className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                  Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// ============== ZONE 4: Quick Actions Bar ==============
const QuickActionsBar = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const actions = [
    { icon: <Plus className="w-5 h-5" />, label: 'New Model', description: 'Create Logical/Physical/Conceptual', color: 'violet', onClick: () => onNavigate('model-explorer') },
    { icon: <Database className="w-5 h-5" />, label: 'Import from DB', description: 'Reverse engineer database', color: 'blue', onClick: () => onNavigate('reverse-engineering') },
    { icon: <Upload className="w-5 h-5" />, label: 'Import DDL', description: 'Upload SQL script', color: 'emerald', onClick: () => {} },
    { icon: <Download className="w-5 h-5" />, label: 'Generate DDL', description: 'Forward engineering', color: 'amber', onClick: () => onNavigate('forward-engineering') },
    { icon: <Scale className="w-5 h-5" />, label: 'Compare', description: 'Side-by-side diff', color: 'purple', onClick: () => onNavigate('complete-compare-2') },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      violet: 'bg-violet-500/10 hover:bg-violet-500/20 text-violet-500 border-violet-500/30',
      blue: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border-blue-500/30',
      emerald: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
      amber: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/30',
      purple: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 border-purple-500/30',
    };
    return colors[color] || colors.violet;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4">
      <h3 className="font-semibold text-gray-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-violet-500" />
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className={`p-4 rounded-xl border transition-all duration-200 text-left group ${getColorClasses(action.color)}`}
          >
            <div className="mb-2">{action.icon}</div>
            <p className="font-medium text-sm text-gray-900 dark:text-zinc-100">{action.label}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============== ZONE 5: AI-Powered Insights ==============
const AIInsightsPanel = ({ onOpenChat }: { onOpenChat?: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([
    { id: '1', type: 'normalization', title: 'Normalize Customer Address', description: 'Split address fields into separate table for better data integrity', model: 'E-Commerce Platform', priority: 'high' },
    { id: '2', type: 'indexing', title: 'Add Index on OrderDate', description: 'Queries frequently filter by OrderDate - index would improve performance', model: 'E-Commerce Platform', priority: 'medium' },
    { id: '3', type: 'naming', title: 'Rename tbl_usr to Users', description: 'Follow naming convention: use PascalCase without prefixes', model: 'User Management', priority: 'low' },
    { id: '4', type: 'documentation', title: 'Add description to Payment table', description: 'Missing documentation for 5 columns in Payment entity', model: 'Payment Model', priority: 'medium' },
  ]);

  const handleSuggestionAction = (id: string, action: 'accept' | 'dismiss' | 'defer') => {
    if (action === 'accept' || action === 'dismiss') {
      setSuggestions(prev => prev.filter(s => s.id !== id));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-amber-500 bg-amber-500/10';
      case 'low': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'normalization': return <Database className="w-4 h-4 text-violet-500" />;
      case 'indexing': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'naming': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'documentation': return <BookOpen className="w-4 h-4 text-emerald-500" />;
      default: return <Lightbulb className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
      <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            AI Insights
          </h3>
          <span className="text-xs bg-violet-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
            <Brain className="w-3 h-3" />
            Powered by AI
          </span>
        </div>

        {/* Natural Language Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Ask AI: 'Find all tables with customer data' or 'Show relationships for Orders'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-zinc-100"
          />
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="divide-y divide-gray-100 dark:divide-zinc-800 max-h-80 overflow-y-auto">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg">
                {getTypeIcon(suggestion.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-900 dark:text-zinc-100">{suggestion.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(suggestion.priority)}`}>
                    {suggestion.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2">{suggestion.description}</p>
                <p className="text-xs text-violet-500">in {suggestion.model}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pl-11">
              <button
                onClick={() => handleSuggestionAction(suggestion.id, 'accept')}
                className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors flex items-center gap-1"
              >
                <ThumbsUp className="w-3 h-3" />
                Accept
              </button>
              <button
                onClick={() => handleSuggestionAction(suggestion.id, 'dismiss')}
                className="px-3 py-1 text-xs bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-gray-700 dark:text-zinc-300 rounded transition-colors flex items-center gap-1"
              >
                <ThumbsDown className="w-3 h-3" />
                Dismiss
              </button>
              <button
                onClick={() => handleSuggestionAction(suggestion.id, 'defer')}
                className="px-3 py-1 text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors"
              >
                Defer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ask AI Button */}
      <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
        <button
          onClick={onOpenChat}
          className="w-full py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Bot className="w-4 h-4" />
          Open AI Chat
        </button>
      </div>
    </div>
  );
};


// ============== MAIN HOMEPAGE COMPONENT ==============
interface HomepageProps {
  onNavigate: (page: string) => void;
  onOpenChat?: () => void;
}

export default function Homepage({ onNavigate, onOpenChat }: HomepageProps) {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{greeting}, Data Architect</h1>
        <p className="text-gray-600 dark:text-zinc-400">Welcome to your data modeling command center</p>
      </div>

      {/* Zone 4: Quick Actions - Full Width */}
      <div className="mb-6">
        <QuickActionsBar onNavigate={onNavigate} />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="xl:col-span-2 space-y-6">
          {/* Zone 1: My Work */}
          <MyWorkSection onNavigate={onNavigate} />

          {/* Zone 2: Activity Feed */}
          <ActivityFeed />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Zone 5: AI Insights */}
          <AIInsightsPanel onOpenChat={onOpenChat} />
        </div>
      </div>
    </div>
  );
}
