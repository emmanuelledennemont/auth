import { Schema } from "mongoose";
import { SubCategorySchema } from "./sub-category.schema";

export const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  image: { type: String, required: true },
  slug: { type: String, required: true },
  sub_categories: [{ type: SubCategorySchema, ref: "Categories" }],
});
