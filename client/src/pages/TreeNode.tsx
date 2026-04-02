import React, { useState } from 'react';
import type { NodeData } from '../types/nodeTypes';
import { Input } from '../components/Input';

interface TreeNodeProps {
  node: NodeData;
  onAdd: (parentId: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ node, onAdd, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nodeChildren = node.children || [];
  const hasChildren = nodeChildren.length > 0;

  const handleToggle = () => setIsExpanded(!isExpanded);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) {
      setError('Child node name is required');
      return;
    }
    
    setError(null);
    setIsSaving(true);
    try {
      await onAdd(node._id, newNodeName.trim());
      setNewNodeName('');
      setIsAdding(false);
      setIsExpanded(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(node._id);
    } catch (err) {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col ml-6 relative">
      <div className="flex items-center group py-1.5">
        <button
          onClick={handleToggle}
          disabled={!hasChildren}
          className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${
            hasChildren 
              ? 'text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer' 
              : 'text-transparent cursor-default'
          }`}
        >
          {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </button>
        
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md px-4 py-2 ml-1 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] transition-all group-hover:bg-blue-50/50 group-hover:border-blue-200 group-hover:shadow-sm">
          <span className="font-medium mr-6 text-slate-700">{node.name}</span>
          
          <div className="flex items-center gap-2 opacity-30 md:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded transition-colors"
              title="Add Child"
            >
              <AddChildIcon />
              Child
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`flex items-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Delete Node"
            >
              {isDeleting ? <SpinnerIcon colorClass="text-red-700" /> : <DeleteIcon />}
              {isDeleting ? '...' : 'Del'}
            </button>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="ml-9 mt-1 mb-2">
          <form onSubmit={handleAddSubmit} className="flex gap-2 items-center bg-slate-50 p-2 rounded-md border border-slate-200 shadow-sm inline-flex">
            <Input
              type="text"
              autoFocus
              inputSize="sm"
              variant="emerald"
              hasError={!!error}
              placeholder="Child node name..."
              value={newNodeName}
              onChange={(e) => {
                setNewNodeName(e.target.value);
                if (error) setError(null);
              }}
            />
            <button 
              type="submit"
              disabled={isSaving}
              className={`flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-1.5 rounded transition-colors shadow-sm shadow-emerald-200 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving ? <SpinnerIcon /> : 'Save'}
            </button>
            <button 
              type="button"
              onClick={() => {
                setIsAdding(false);
                setError(null);
                setNewNodeName('');
              }}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs px-4 py-1.5 rounded transition-colors"
            >
              Cancel
            </button>
          </form>
          {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
        </div>
      )}

      {isExpanded && hasChildren && (
        <div className="ml-3.5 border-l-2 border-slate-200/70 pl-3 mt-1 space-y-0.5">
          {nodeChildren.map(child => (
            <TreeNode
              key={child._id}
              node={child}
              onAdd={onAdd}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const AddChildIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SpinnerIcon = ({ sizeClass = "h-3.5 w-3.5", colorClass = "text-white" }: { sizeClass?: string; colorClass?: string }) => (
  <svg className={`animate-spin ${sizeClass} ${colorClass}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
