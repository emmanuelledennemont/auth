import { IClient } from "@/types/user.type";
import { Model } from "mongoose";
import { ClientSchema } from "../schemas/client.schema";
import { UserModel } from "./user.model";

export const ClientModel: Model<IClient> = UserModel.discriminator<IClient>(
  "Client",
  ClientSchema
);
