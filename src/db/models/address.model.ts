import { IAddress } from "@/types/address.type";
import { Model } from "mongoose";
import { AddressSchema } from "../schemas/address.schema";
import { TechnicianModel } from "./technician.model";

export const AddressModel: Model<IAddress> =
  TechnicianModel.discriminator<IAddress>("Address", AddressSchema);
