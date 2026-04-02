import React, { useState } from 'react';
import { TreeNode } from './TreeNode';
import { NodeSkeleton } from '../components/NodeSkeleton';
import { Input } from '../components/Input';
import { useNodeTree } from '../hooks/useNodeTree';

export const NodeTreeApp: React.FC = () => {
  const { nodes, isLoading, addRootNode, addChildNode, removeNode } = useNodeTree();
  
  const [newRootName, setNewRootName] = useState('');
  const [isAddingRoot, setIsAddingRoot] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddRoot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRootName.trim()) {
      setError('Root node name is required');
      return;
    }

    setError(null);
    setIsAddingRoot(true);
    try {
      await addRootNode(newRootName.trim());
      setNewRootName('');
    } catch (err) {
      console.error('Failed to create root node', err);
    } finally {
      setIsAddingRoot(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Node Tree Manager</h1>

      <div className="mb-8 p-5 bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] border border-slate-100">
        <h2 className="text-lg font-semibold mb-3 text-slate-700">Create Root Node</h2>
        <form onSubmit={handleAddRoot} className="flex gap-3">
          <Input
            type="text"
            inputSize="md"
            variant="blue"
            hasError={!!error}
            placeholder="Root node name..."
            value={newRootName}
            onChange={(e) => {
              setNewRootName(e.target.value);
              if (error) setError(null);
            }}
          />
          <button
            type="submit"
            disabled={isAddingRoot}
            className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm shadow-blue-200 ${isAddingRoot ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isAddingRoot && <SpinnerIcon sizeClass="h-5 w-5" />}
            {isAddingRoot ? 'Adding...' : 'Add Root'}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2 ml-1">{error}</p>}
      </div>

      <div className="bg-white border text-slate-800 border-slate-200 rounded-xl p-6 shadow-sm min-h-[400px]">
        {isLoading ? (
          <div className="space-y-1">
            <NodeSkeleton />
            <NodeSkeleton depth={1} />
            <NodeSkeleton depth={2} />
            <NodeSkeleton depth={1} />
            <NodeSkeleton />
          </div>
        ) : nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
            <EmptyStateIcon />
            <p>No nodes available. Add a root node to start!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {nodes.map(node => (
              <TreeNode
                key={node._id}
                node={node}
                onAdd={addChildNode}
                onDelete={removeNode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyStateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
  </svg>
);

const SpinnerIcon = ({ sizeClass = "h-3.5 w-3.5", colorClass = "text-white" }: { sizeClass?: string, colorClass?: string }) => (
  <svg className={`animate-spin ${sizeClass} ${colorClass}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
