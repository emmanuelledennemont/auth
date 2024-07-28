import { Schema } from "mongoose";

export const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["Client", "Technician", "Admin"],
    },
    profileImage: {
      type: String,
      default: "https://api.dicebear.com/9.x/adventurer/svg?seed=Buddy",
    },
    authentication: {
      salt: { type: String, required: true },
      password: { type: String, required: true },
      sessionToken: { type: String },
    },
  },
  {
    timestamps: true,
  }
);
