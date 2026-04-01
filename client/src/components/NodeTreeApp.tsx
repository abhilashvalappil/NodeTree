import React, { useState, useEffect } from 'react';
import { TreeNode } from './TreeNode';
import type { NodeData } from '../types/nodeTypes';
import { createNode, fetchNodes } from '../api/nodeService';

const buildTree = (flatNodes: NodeData[]): NodeData[] => {
  const nodeMap = new Map<string, NodeData>();
  const roots: NodeData[] = [];

  flatNodes.forEach(node => {
    nodeMap.set(node._id, { ...node, children: [] });
  });

  flatNodes.forEach(node => {
    const nodeWithChildren = nodeMap.get(node._id)!;
    if (node.parentId) {
      const parent = nodeMap.get(node.parentId);
      if (parent && parent.children) {
        parent.children.push(nodeWithChildren);
      }
    } else {
      roots.push(nodeWithChildren);
    }
  });

  return roots;
};

export const NodeTreeApp: React.FC = () => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [newRootName, setNewRootName] = useState('');

  useEffect(() => {
    const loadNodes = async () => {
      try {
        const flatNodes = await fetchNodes();
        if(flatNodes && Array.isArray(flatNodes)) {
          setNodes(buildTree(flatNodes));
        }
      } catch (err) {
        console.error("Failed to fetch nodes", err);
      }
    };
    loadNodes();
  }, []);

  const handleAddRoot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRootName.trim()) return;

    try {
      const newNode = await createNode({
        name: newRootName.trim(),
        parentId: null
      });
      
      // Ensure the new node has a children array for the frontend
      const newNodeWithChildren: NodeData = {
        ...newNode,
        children: []
      };

      setNodes([...nodes, newNodeWithChildren]);
      setNewRootName('');
    } catch (error) {
      console.error('Failed to create root node', error);
      // Fallback or error handling can go here
    }
  };

  const addNode = async (parentId: string, name: string) => {
    try {
      const newNode = await createNode({
        name: name,
        parentId: parentId
      });

      const newNodeWithChildren: NodeData = {
        ...newNode,
        children: []
      };

      const addRecursive = (currentNodes: NodeData[]): NodeData[] => {
        return currentNodes.map(node => {
          if (node._id === parentId) {
            const currentChildren = node.children || [];
            return { ...node, children: [...currentChildren, newNodeWithChildren] };
          } else if (node.children && node.children.length > 0) {
            return { ...node, children: addRecursive(node.children) };
          }
          return node;
        });
      };

      setNodes(addRecursive(nodes));
    } catch (error) {
      console.error('Failed to create child node', error);
    }
  };

  const deleteNode = (id: string) => {
    // Note: To persist deletion, a call to a delete API would navigate here.
      const deleteRecursive = (currentNodes: NodeData[]): NodeData[] => {
        return currentNodes
          .filter(node => node._id !== id)
          .map(node => ({
            ...node,
            children: node.children ? deleteRecursive(node.children) : []
          }));
      };

      setNodes(deleteRecursive(nodes));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Recursive Node Tree</h1>
      
      <div className="mb-8 p-5 bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] border border-slate-100">
        <h2 className="text-lg font-semibold mb-3 text-slate-700">Add Root Node</h2>
        <form onSubmit={handleAddRoot} className="flex gap-3">
          <input
            type="text"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700"
            placeholder="Root node name..."
            value={newRootName}
            onChange={(e) => setNewRootName(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm shadow-blue-200"
          >
            Add Root
          </button>
        </form>
      </div>

      <div className="bg-white border text-slate-800 border-slate-200 rounded-xl p-6 shadow-sm min-h-[400px]">
        {nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
            <p>No nodes available. Add a root node to start!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {nodes.map(node => (
              <TreeNode 
                key={node._id} 
                node={node} 
                onAdd={addNode} 
                onDelete={deleteNode} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
