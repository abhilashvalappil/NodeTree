import { Request, Response, NextFunction } from "express";
import { INodeService } from "../interfaces/serviceInterfaces/INodeService";

export class NodeController {
    private nodeService : INodeService

    constructor(nodeService: INodeService){
        this.nodeService = nodeService;
    }

    async createNode (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const nodeData = req.body;
            const node = await this.nodeService.createNode(nodeData);
            res.status(201).json(node);
        } catch (error) {
            next(error);
        }
    }

    async getAllNodes (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const nodes = await this.nodeService.getAllNodes();
            res.status(200).json(nodes);
        } catch (error) {
            next(error);
        }
    }

}