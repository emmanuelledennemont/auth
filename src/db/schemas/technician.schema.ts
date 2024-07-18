import { Schema } from "mongoose";
import { AddressSchema } from "./address.schema";

export const TechnicianSchema: Schema = new Schema({
  bio: { type: String },
  address: { type: AddressSchema },
  openingHours: { type: Array },
  repairingCategories: { type: Array },
  rating: { type: Object },
});
