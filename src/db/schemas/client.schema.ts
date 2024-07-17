import { Schema } from "mongoose";

export const ClientSchema: Schema = new Schema({
  favorites: { type: Array },
  repairList: { type: Array },
  saving: { type: Array },
});
