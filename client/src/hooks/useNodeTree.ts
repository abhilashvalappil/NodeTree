import { useState, useEffect, useCallback } from 'react';
import type { NodeData } from '../types/nodeTypes';
import { createNode, fetchNodes, deleteNode as deleteNodeApi } from '../api/nodeService';
import { buildTree, addNodeRecursive, deleteNodeRecursive } from '../utils/treeUtils';

export const useNodeTree = () => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNodes = useCallback(async () => {
    setIsLoading(true);
    try {
      const flatNodes = await fetchNodes();
      if (flatNodes && Array.isArray(flatNodes)) {
        setNodes(buildTree(flatNodes));
      }
    } catch (err) {
      console.error("Failed to fetch nodes", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNodes();
  }, [loadNodes]);

  const addRootNode = async (name: string) => {
    const newNode = await createNode({ name, parentId: null });
    const newNodeWithChildren: NodeData = { ...newNode, children: [] };
    setNodes(prev => [...prev, newNodeWithChildren]);
  };

  const addChildNode = async (parentId: string, name: string) => {
    const newNode = await createNode({ name, parentId });
    const newNodeWithChildren: NodeData = { ...newNode, children: [] };
    setNodes(prev => addNodeRecursive(prev, parentId, newNodeWithChildren));
  };

  const removeNode = async (id: string) => {
    await deleteNodeApi(id);
    setNodes(prev => deleteNodeRecursive(prev, id));
  };

  return {
    nodes,
    isLoading,
    addRootNode,
    addChildNode,
    removeNode
  };
};
