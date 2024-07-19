import { Schema } from "mongoose";

export const ClientSchema: Schema = new Schema({
  favorites: [{ type: Schema.Types.ObjectId, ref: "Technician" }],
  repairList: { type: Array },
  saving: { type: Array },
});
