import { Schema } from "mongoose";

export const SubCategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: { type: String, required: true },
});
