import type { NodeData } from '../types/nodeTypes';

export const buildTree = (flatNodes: NodeData[]): NodeData[] => {
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

export const addNodeRecursive = (currentNodes: NodeData[], parentId: string, newNode: NodeData): NodeData[] => {
  return currentNodes.map(node => {
    if (node._id === parentId) {
      const currentChildren = node.children || [];
      return { ...node, children: [...currentChildren, newNode] };
    } else if (node.children && node.children.length > 0) {
      return { ...node, children: addNodeRecursive(node.children, parentId, newNode) };
    }
    return node;
  });
};

export const deleteNodeRecursive = (currentNodes: NodeData[], idToDelete: string): NodeData[] => {
  return currentNodes
    .filter(node => node._id !== idToDelete)
    .map(node => ({
      ...node,
      children: node.children ? deleteNodeRecursive(node.children, idToDelete) : []
    }));
};
