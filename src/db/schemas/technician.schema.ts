import { Schema } from "mongoose";

export const TechnicianSchema: Schema = new Schema({
  bio: { type: String },
  address: { type: Object },
  openingHours: { type: Array },
  repairingCategories: { type: Array },
  rating: { type: Object },
});
