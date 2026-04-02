import React from 'react';

interface NodeSkeletonProps {
  depth?: number;
}

export const NodeSkeleton: React.FC<NodeSkeletonProps> = ({ depth = 0 }) => {
  const indent = Math.max(0, depth) * 1.5; 
  
  return (
    <div className="flex items-center py-1.5 animate-pulse" style={{ marginLeft: `${indent}rem` }}>
      <div className="w-7 h-7 rounded-md bg-slate-200 flex-shrink-0" />
      
      <div className="flex items-center bg-slate-100 border border-slate-200 rounded-md px-4 py-2 h-[38px] w-64 ml-1 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] opacity-70">
        <div className="h-2 bg-slate-300 rounded w-1/2"></div>
      </div>
    </div>
  );
};
