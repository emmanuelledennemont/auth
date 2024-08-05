import { Document } from "mongoose";
import { ISubCategory } from "./sub-category.type";

export interface ICategory extends Document {
  _id: string;
  name: string;
  image: string;
  slug: string;
  sub_categories: [ISubCategory];
}
