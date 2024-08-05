import { Document } from "mongoose";

export interface ISubCategory extends Document {
  _id: string;
  name: string;
  slug: string;
}
