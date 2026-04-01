
export interface CreateNodeData {
    name: string;
    parentId: string | null;
}

export interface NodeData {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: Date;
}