import { UserModel } from "@/db/models/user.model";

// Fonctions de base de données pour le modèle User
export const getUsers = () => UserModel.find().exec();
export const getUserByEmail = (email: string) =>
  UserModel.findOne({ email })
    .select("+authentication.salt +authentication.password")
    .exec();

export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken }).exec();

export const getUserById = (id: string) =>
  UserModel.findById(id)
    .select("-authentification")

    .exec();

export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  UserModel.findByIdAndDelete(id).exec();
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values, { new: true }).exec();
