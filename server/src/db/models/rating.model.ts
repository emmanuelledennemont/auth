import { Document, model, Model, Schema } from "mongoose";
import { RatingSchema } from "../schemas/rating.schema";

export interface IRating extends Document {
  rating: number;
  comment?: string;
  client: Schema.Types.ObjectId;
  technician: Schema.Types.ObjectId;
}

export const RatingModel: Model<IRating> = model<IRating>(
  "Rating",
  RatingSchema
);
