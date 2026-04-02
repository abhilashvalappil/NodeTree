import { Request, Response, NextFunction } from "express";
import { INodeService } from "../interfaces/serviceInterfaces/INodeService";
import { HttpStatus } from "../constants/statusConstants";
import { Messages } from "../constants/messageConstants";

export class NodeController {
    private nodeService : INodeService

    constructor(nodeService: INodeService){
        this.nodeService = nodeService;
    }

    async createNode (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {name,parentId} = req.body;
            if(!name || !name.trim()){
                res.status(HttpStatus.BAD_REQUEST).json({message: Messages.NAME_REQUIRED})
                return;
            }
            const node = await this.nodeService.createNode({name,parentId});
            res.status(HttpStatus.CREATED).json(node);
        } catch (error) {
            next(error);
        }
    }

    async getAllNodes (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const nodes = await this.nodeService.getAllNodes();
            res.status(HttpStatus.OK).json(nodes);
        } catch (error) {
            next(error);
        }
    }

    async deleteNode (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            if(!id){
                res.status(HttpStatus.BAD_REQUEST).json({message: Messages.ID_REQUIRED})
                return;
            }
            await this.nodeService.deleteNode(id);
            res.status(HttpStatus.OK).json({ message: Messages.NODE_DELETED });
        } catch (error) {
            next(error);
        }
    }

}