
export interface CreateNodeData {
    name: string;
    parentId: string | null;
}

export interface NodeData {
    _id: string;
    name: string;
    parentId: string | null;
    createdAt?: Date | string;
    children?: NodeData[];
}