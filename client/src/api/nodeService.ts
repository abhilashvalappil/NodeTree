 
import API from "./axiosInstance";
import type { CreateNodeData, NodeData } from "../types/nodeTypes";   
import { nodeENDPOINTS } from "../constants/endPointUrl";
 
export const createNode = async (nodeData: CreateNodeData): Promise<NodeData> => {
    const response = await API.post(nodeENDPOINTS.CREATE_NODE, nodeData)
    return response.data;
}

export const fetchNodes = async (): Promise<NodeData[]> => {
    const response = await API.get(nodeENDPOINTS.GET_NODE)
    return response.data;
}