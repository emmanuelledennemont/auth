import { days, generateTimeSlots } from "@/utils/time";
import { Schema } from "mongoose";
import { AddressSchema } from "./address.schema";
import { CategorySchema } from "./category.schema";

// Générer les créneaux horaires valides
const hours = generateTimeSlots();

// Schéma pour un créneau horaire
const TimeSlotSchema: Schema = new Schema({
  start: { type: String, enum: hours, required: true },
  end: { type: String, enum: hours, required: true },
});

// Schéma pour l'horaire d'un jour spécifique
const DayScheduleSchema: Schema = new Schema({
  day: { type: String, enum: days, required: true },
  slots: [TimeSlotSchema],
});

// Schéma pour le technicien
export const TechnicianSchema: Schema = new Schema({
  bio: { type: String },
  sirene: { type: String, required: false },
  address: { type: AddressSchema },
  categories: [{ type: CategorySchema }],
  openingHours: [DayScheduleSchema],
  rating: {
    score: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
  },
});
