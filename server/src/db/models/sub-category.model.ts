import { ISubCategory } from "@/types/sub-category.type";
import { Model, model } from "mongoose";
import { SubCategorySchema } from "../schemas/sub-category.schema";

export const SubCategoryModel: Model<ISubCategory> = model<ISubCategory>(
  "SubCategories",
  SubCategorySchema
);
