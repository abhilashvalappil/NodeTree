import { CreateNodeData, NodeData } from "../../types/nodeTypes";

export interface INodeService {
    createNode(nodeData: CreateNodeData): Promise<NodeData>;
    getAllNodes(): Promise<NodeData[]>;
}