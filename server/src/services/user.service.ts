import { UserModel } from "@/db/models/user.model";

// Fonctions de base de données pour le modèle User
const getUsers = () => UserModel.find().exec();
const getUserByEmail = (email: string) =>
  UserModel.findOne({ email })
    .select("+authentication.salt +authentication.password")
    .exec();

const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken }).exec();

const getUserById = (id: string) =>
  UserModel.findById(id)
    .select("-authentification")

    .exec();

const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id).exec();
const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values, { new: true }).exec();

export default {
  getUsers,
  getUserByEmail,
  getUserBySessionToken,
  getUserById,
  createUser,
  deleteUserById,
  updateUserById,
};
