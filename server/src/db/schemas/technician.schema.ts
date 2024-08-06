import { Schema } from "mongoose";
import { AddressSchema } from "./address.schema";

// Générer les créneaux horaires valides
const DayScheduleSchema = new Schema({
  day: { type: String, required: true },
  slots: [
    {
      start: { type: Date },
      end: { type: Date },
    },
  ],
});

// Schéma pour le technicien
export const TechnicianSchema: Schema = new Schema({
  bio: { type: String },
  sirene: { type: String, required: false },
  address: { type: AddressSchema },
  categories: [
    {
      category: { type: Schema.Types.ObjectId, ref: "Categories" },
      subCategories: [{ type: Schema.Types.ObjectId, ref: "SubCategories" }],
    },
  ],
  openingHours: [DayScheduleSchema],
  slotDuration: { type: Number, default: 15 },
  rating: {
    score: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
  },
});
