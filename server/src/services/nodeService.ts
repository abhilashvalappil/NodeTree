import { INodeService } from "../interfaces/serviceInterfaces/INodeService";
import { CreateNodeData, NodeData } from "../types/nodeTypes";
import Node from "../models/nodeModel";

export class NodeService implements INodeService {
    
    async createNode(nodeData: CreateNodeData): Promise<NodeData> {
        return await Node.create(nodeData);
    }

    async getAllNodes(): Promise<NodeData[]> {
        return await Node.find();
    }
}