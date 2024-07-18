import { Document } from "mongoose";
import { IAddress } from "./address.type";
import { ICategory } from "./cateogry.type";
import { Role } from "./role.type";

// Définir une interface pour le modèle User
export interface IUser extends Document {
  email: string;
  username: string;
  role: Role;
  authentication: {
    salt: string;
    password: string;
    sessionToken?: string;
  };
}

export interface User extends IUser {
  _id: string;
  email: string;
  username: string;
  role: Role;
  authentication: {
    salt: string;
    password: string;
    sessionToken?: string;
  };
}

export interface IClient extends IUser {
  favorites: Array<any>;
  repairList: Array<any>;
  saving: Array<any>;
}

export interface ITechnician extends IUser {
  bio: string;
  address: IAddress;
  categories: Array<ICategory>;
  openingHours: Array<any>;
  rating: any;
}
