import mongoose, { Document, Model, Schema } from 'mongoose';

// Définir une interface pour le modèle User
interface IUser extends Document {
  username: string;
  email: string;
  authentication: {
    password: string;
    salt?: string;
    sessionToken?: string;
  };
}

// Définir le schéma User
const UserSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

// Créer le modèle User
export const UserModel: Model<IUser> = mongoose.model<IUser>(
  'User',
  UserSchema
);

// Fonctions de base de données pour le modèle User
export const getUsers = () => UserModel.find().exec();
export const getUserByEmail = (email: string) =>
  UserModel.findOne({ email })
    .select('+authentication.salt +authentication.password')
    .exec();
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ 'authentication.sessionToken': sessionToken }).exec();
export const getUserById = (id: string) => UserModel.findById(id).exec();
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  UserModel.findByIdAndDelete(id).exec();
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values, { new: true }).exec();
