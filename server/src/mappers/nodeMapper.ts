
import { NodeDTO } from "../types/nodeTypes";  

export const mapToNodeDTO = (node: any): NodeDTO => ({
  _id: node._id.toString(),
  name: node.name,
  parentId: node.parentId ? node.parentId.toString() : null,
  createdAt: node.createdAt,
});