
import { Schema } from "mongoose";
import { AddressSchema } from "./address.schema";
import { CategorySchema } from "./category.schema";

// Générer les créneaux horaires valides
const DayScheduleSchema = new Schema({
  day: { type: String, required: true },
  slots: [{ start: { type: String }, end: { type: String } }]
});

// Schéma pour le technicien
export const TechnicianSchema: Schema = new Schema({
  bio: { type: String },
  sirene: { type: String, required: false },
  address: { type: AddressSchema },
  categories: [{ type: CategorySchema }],
  openingHours: [DayScheduleSchema],
  slotDuration: { type: Number, default: 15},
  rating: {
    score: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
  },
});

