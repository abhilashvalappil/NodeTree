import { CreateNodeData, NodeData, NodeDTO } from "../../types/nodeTypes";

export interface INodeService {
    createNode(nodeData: CreateNodeData): Promise<NodeDTO>;
    getAllNodes(): Promise<NodeDTO[]>;
    deleteNode(id: string): Promise<void>;
}