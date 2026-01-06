'use client';

import { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Minimize2,
  Maximize2,
  Trash2,
  Copy,
  Check,
  Play,
  CheckCircle,
  Database,
  Table2,
  Link2,
  Columns,
  AlertCircle
} from 'lucide-react';
import { DiagramContext, AIAction } from '@/types/aiActions';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: AIAction[];
  actionsExecuted?: boolean;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  diagramContext?: DiagramContext;
  onExecuteAction?: (action: AIAction) => Promise<boolean>;
}

export default function AIChat({
  isOpen,
  onClose,
  initialMessage,
  diagramContext,
  onExecuteAction
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [executingAction, setExecutingAction] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Handle initial message from AI Insights panel
  useEffect(() => {
    if (initialMessage && isOpen && messages.length === 0) {
      setInput(initialMessage);
    }
  }, [initialMessage, isOpen, messages.length]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          context: diagramContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        actions: data.actions,
        actionsExecuted: false,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const executeActions = async (messageId: string, actions: AIAction[]) => {
    if (!onExecuteAction) return;

    setExecutingAction(messageId);

    try {
      for (const action of actions) {
        const success = await onExecuteAction(action);
        if (!success) {
          console.error('Action failed:', action);
        }
      }

      // Mark actions as executed
      setMessages(prev => prev.map(m =>
        m.id === messageId ? { ...m, actionsExecuted: true } : m
      ));

      // Add confirmation message
      const confirmMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `✓ Done! I've applied ${actions.length} change${actions.length > 1 ? 's' : ''} to your diagram. You can see the updates in the canvas.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, confirmMessage]);
    } catch (error) {
      console.error('Error executing actions:', error);
    } finally {
      setExecutingAction(null);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'addTable':
      case 'updateTable':
      case 'deleteTable':
        return <Table2 className="w-3 h-3" />;
      case 'addColumn':
      case 'updateColumn':
      case 'deleteColumn':
        return <Columns className="w-3 h-3" />;
      case 'addRelationship':
      case 'deleteRelationship':
        return <Link2 className="w-3 h-3" />;
      default:
        return <Database className="w-3 h-3" />;
    }
  };

  const getActionColor = (type: string) => {
    if (type.startsWith('add')) return 'text-emerald-500 bg-emerald-500/10';
    if (type.startsWith('update')) return 'text-blue-500 bg-blue-500/10';
    if (type.startsWith('delete')) return 'text-red-500 bg-red-500/10';
    return 'text-violet-500 bg-violet-500/10';
  };

  // Format message content, hiding action blocks but showing action UI
  const formatMessage = (content: string, actions?: AIAction[], messageId?: string, actionsExecuted?: boolean) => {
    // Remove action blocks from display
    const cleanContent = content.replace(/```action[\s\S]*?```/g, '').trim();

    // Split by code blocks
    const parts = cleanContent.split(/(```[\s\S]*?```)/g);
    const formattedParts = parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3);
        const firstNewline = code.indexOf('\n');
        const language = firstNewline > 0 ? code.slice(0, firstNewline).trim() : '';
        const codeContent = firstNewline > 0 ? code.slice(firstNewline + 1) : code;
        return (
          <pre key={index} className="bg-zinc-800 rounded-lg p-3 my-2 overflow-x-auto">
            {language && (
              <div className="text-xs text-zinc-500 mb-2">{language}</div>
            )}
            <code className="text-sm text-emerald-400 font-mono">{codeContent}</code>
          </pre>
        );
      }
      // Handle inline code
      const inlineParts = part.split(/(`[^`]+`)/g);
      return (
        <span key={index}>
          {inlineParts.map((inline, i) => {
            if (inline.startsWith('`') && inline.endsWith('`')) {
              return (
                <code key={i} className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm text-violet-400 font-mono">
                  {inline.slice(1, -1)}
                </code>
              );
            }
            return inline;
          })}
        </span>
      );
    });

    return (
      <>
        <div className="whitespace-pre-wrap break-words">{formattedParts}</div>

        {/* Action Cards */}
        {actions && actions.length > 0 && messageId && (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
              Proposed Changes:
            </div>
            {actions.map((action, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 p-2 rounded-lg border ${
                  actionsExecuted
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50'
                }`}
              >
                <div className={`p-1 rounded ${getActionColor(action.type)}`}>
                  {actionsExecuted ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : getActionIcon(action.type)}
                </div>
                <span className="text-xs text-gray-700 dark:text-zinc-300 flex-1">
                  {action.description}
                </span>
                {actionsExecuted && (
                  <span className="text-xs text-emerald-500">Applied</span>
                )}
              </div>
            ))}

            {/* Apply Button */}
            {!actionsExecuted && onExecuteAction && (
              <button
                onClick={() => executeActions(messageId, actions)}
                disabled={executingAction === messageId}
                className="w-full mt-2 py-2 px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
              >
                {executingAction === messageId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Apply {actions.length} Change{actions.length > 1 ? 's' : ''}
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </>
    );
  };

  // Context-aware suggestions
  const getSuggestions = () => {
    if (diagramContext && diagramContext.tables.length > 0) {
      return [
        'Add a Users table with id, email, and password',
        `Add a created_at column to ${diagramContext.tables[0]?.name || 'a table'}`,
        'Create a relationship between two tables',
        'Suggest indexes for better performance',
      ];
    }
    return [
      'Create a Users table with common fields',
      'Design an e-commerce database schema',
      'What are best practices for primary keys?',
      'Explain database normalization',
    ];
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-2xl flex flex-col transition-all duration-200 ${
        isMinimized
          ? 'bottom-4 right-4 w-72 h-14'
          : 'bottom-4 right-4 w-[440px] h-[650px] max-h-[85vh]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-zinc-700 bg-gradient-to-r from-violet-600/10 to-purple-600/10 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-violet-600 rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-zinc-100">DMPro AI Copilot</h3>
            {!isMinimized && (
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {diagramContext ? `${diagramContext.totalTables} tables • ${diagramContext.totalRelationships} relationships` : 'Powered by Llama 3.3'}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!isMinimized && messages.length > 0 && (
            <button
              onClick={clearChat}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="p-4 bg-violet-500/10 rounded-full mb-4">
                  <Bot className="w-8 h-8 text-violet-500" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-zinc-100 mb-2">
                  {diagramContext ? 'Ready to help with your model!' : 'How can I help you?'}
                </h4>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
                  {diagramContext
                    ? 'I can see your diagram. Ask me to add tables, columns, or relationships.'
                    : 'Ask me about data modeling, or tell me to create tables and relationships.'}
                </p>
                <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                  {getSuggestions().map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(suggestion)}
                      className="text-xs text-left p-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg text-gray-700 dark:text-zinc-300 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-blue-600'
                        : 'bg-violet-600'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`flex-1 max-w-[85%] ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-xl text-sm ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-bl-sm'
                      }`}
                    >
                      {message.role === 'assistant'
                        ? formatMessage(message.content, message.actions, message.id, message.actionsExecuted)
                        : message.content}
                    </div>
                    {message.role === 'assistant' && !message.actions && (
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="mt-1 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
                        title="Copy message"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl rounded-bl-sm">
                  <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-zinc-700">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={diagramContext ? "Ask me to modify your diagram..." : "Ask about data modeling..."}
                rows={1}
                className="flex-1 resize-none bg-gray-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 max-h-32"
                style={{ minHeight: '42px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// Floating Chat Button Component
export function FloatingChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-40 p-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
      title="Open AI Copilot"
    >
      <Bot className="w-6 h-6" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse" />
    </button>
  );
}
