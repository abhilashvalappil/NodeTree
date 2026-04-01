
import express from "express";
import { NodeController } from "../controllers/nodeController";
import { NodeService } from "../services/nodeService";

const nodeRouter = express.Router();

const nodeService = new NodeService();
const nodeController = new NodeController(nodeService);

nodeRouter.post("/nodes", nodeController.createNode.bind(nodeController));
nodeRouter.get("/nodes", nodeController.getAllNodes.bind(nodeController));

export default nodeRouter;