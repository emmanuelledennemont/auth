import { Model } from "mongoose";
import { ITechnician } from "@/types/user.type";
import { UserModel } from "./user.model";
import { TechnicianSchema } from "../schemas/technician.schema";

export const TechnicianModel: Model<ITechnician> =
  UserModel.discriminator<ITechnician>("Technician", TechnicianSchema);
