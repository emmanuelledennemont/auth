import { ICategory } from "@/types/cateogry.type";
import { Model } from "mongoose";
import { CategorySchema } from "../schemas/category.schema";
import { TechnicianModel } from "./technician.model";

export const CategoryModel: Model<ICategory> =
  TechnicianModel.discriminator<ICategory>("Category", CategorySchema);
