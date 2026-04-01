import mongoose, { Schema } from "mongoose";
import { INode } from "../interfaces/entities/nodeInterface";

const NodeSchema: Schema<INode> = new Schema({
    name: {
        type: String,
        required: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: "Node",
        default: null
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<INode>("Node", NodeSchema);
