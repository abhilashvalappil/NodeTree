
import { Document, Types } from "mongoose";

export interface INode extends Document {
    name: string;
    parentId: Types.ObjectId | null;
    createdAt: Date;
}