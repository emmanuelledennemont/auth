import { Schema } from "mongoose";
import { AddressSchema } from "./address.schema";
import { CategorySchema } from "./category.schema";

export const TechnicianSchema: Schema = new Schema({
  bio: { type: String },
  sirene: { type: String, required: false },
  address: { type: AddressSchema },
  categories: [{ type: CategorySchema }],
  openingHours: { type: Array },
  rating: {
    score: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
  },
});
