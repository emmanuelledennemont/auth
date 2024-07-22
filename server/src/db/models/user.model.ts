import { IUser } from "@/types/user.type";
import mongoose, { Model } from "mongoose";
import { UserSchema } from "../schemas/user.schema";

export const UserModel: Model<IUser> = mongoose.model<IUser>(
  "User",
  UserSchema
);
