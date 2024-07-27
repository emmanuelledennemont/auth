import { Document, model, Model, Schema } from "mongoose";
import { RepairSchema } from "../schemas/repair.schema";

export interface IRepair extends Document {

    client: Schema.Types.ObjectId;
    technician: Schema.Types.ObjectId;
  }

export const RepairModel: Model<IRepair> = model<IRepair>("Repair", RepairSchema );
