import { Schema } from "mongoose";
import { AddressSchema } from "./address.schema";
import { CategorySchema } from "./category.schema";

export const TechnicianSchema: Schema = new Schema({
  bio: { type: String },
  address: { type: AddressSchema },
  categories: [{ type: CategorySchema }],
  openingHours: { type: Array },
  rating: { type: Object },
});
