import { INodeService } from "../interfaces/serviceInterfaces/INodeService";
import { CreateNodeData, NodeDTO } from "../types/nodeTypes";
import Node from "../models/nodeModel";
import { mapToNodeDTO } from "../mappers/nodeMapper";

export class NodeService implements INodeService {
    
    async createNode(nodeData: CreateNodeData): Promise<NodeDTO> {
        const node = await Node.create(nodeData);
        return mapToNodeDTO(node);
    }

    async getAllNodes(): Promise<NodeDTO[]> {
        const nodes = await Node.find();
        return nodes.map(mapToNodeDTO);
    }

    async deleteNode(id: string): Promise<void> {
        const findDescendants = async (parentId: string): Promise<string[]> => {
            const children = await Node.find({ parentId });
            let descendantIds: string[] = [];
            
            for (const child of children) {
                descendantIds.push(child._id.toString());
                const subDescendants = await findDescendants(child._id.toString());
                descendantIds = descendantIds.concat(subDescendants);
            }
            
            return descendantIds;
        };

        const idsToDelete = await findDescendants(id);
        idsToDelete.push(id);
        await Node.deleteMany({ _id: { $in: idsToDelete } });
    }
}