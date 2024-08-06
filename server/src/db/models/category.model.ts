import { ICategory } from "@/types/category.type";
import { Model, model } from "mongoose";
import { CategorySchema } from "../schemas/category.schema";

export const CategoryModel: Model<ICategory> = model<ICategory>(
  "Categories",
  CategorySchema
);
