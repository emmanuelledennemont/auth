import { ITechnician } from "@/types/user.type";
import { Model } from "mongoose";
import { TechnicianSchema } from "../schemas/technician.schema";
import { UserModel } from "./user.model";

export const TechnicianModel: Model<ITechnician> =
  UserModel.discriminator<ITechnician>("Technician", TechnicianSchema);
