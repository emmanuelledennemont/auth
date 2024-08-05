import { Schema } from "mongoose";

export const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  image: { type: String, required: true },
  slug: { type: String, required: true },
  sub_categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});
