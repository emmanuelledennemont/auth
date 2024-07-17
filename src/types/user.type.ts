import { Document } from "mongoose";
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
  address: any;
  openingHours: Array<any>;
  repairingCategories: Array<any>;
  rating: any;
}
