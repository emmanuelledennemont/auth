import { Schema } from "mongoose";
export const AddressSchema: Schema = new Schema(
  {
    addressLine: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
    postalCode: { type: String },
    coordinates: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
  },
  { _id: false }
);
