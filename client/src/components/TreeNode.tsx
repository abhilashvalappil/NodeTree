import React, { useState } from 'react';
import type { NodeData } from '../types/nodeTypes';

interface TreeNodeProps {
  node: NodeData;
  onAdd: (parentId: string, name: string) => void;
  onDelete: (id: string) => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ node, onAdd, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');

  const nodeChildren = node.children || [];
  const hasChildren = nodeChildren.length > 0;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;
    
    onAdd(node._id, newNodeName.trim());
    setNewNodeName('');
    setIsAdding(false);
    setIsExpanded(true); // Auto-expand when a new child is added
  };

  return (
    <div className="flex flex-col ml-6 relative">
      {/* Visual connector lines could go here if needed */}
      
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
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
        
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md px-4 py-2 ml-1 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] transition-all group-hover:bg-blue-50/50 group-hover:border-blue-200 group-hover:shadow-sm">
          <span className="font-medium mr-6 text-slate-700">{node.name}</span>
          
          <div className="flex items-center gap-2 opacity-30 md:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded transition-colors"
              title="Add Child"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Child
            </button>
            <button
              onClick={() => onDelete(node._id)}
              className="flex items-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded transition-colors"
              title="Delete Node"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Del
            </button>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="ml-9 mt-1 mb-2">
          <form onSubmit={handleAddSubmit} className="flex gap-2 items-center bg-slate-50 p-2 rounded-md border border-slate-200 shadow-sm inline-flex">
            <input
              type="text"
              autoFocus
              className="border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all text-slate-700 w-48"
              placeholder="Child node name..."
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-1.5 rounded transition-colors shadow-sm shadow-emerald-200"
            >
              Save
            </button>
            <button 
              type="button"
              onClick={() => setIsAdding(false)}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs px-4 py-1.5 rounded transition-colors"
            >
              Cancel
            </button>
          </form>
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
