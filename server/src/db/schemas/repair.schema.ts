import { Schema } from "mongoose";
import { CategorySchema } from "./category.schema";

export const RepairSchema = new Schema({
  marque: { type: String },
  model: { type: String },
  description: { type: String },
  dianostic: { type: String },
  categories: [{ type: CategorySchema }],
  date: { type: Date, timeZone: "Europe/Paris" },
  documentUrl: { type: String },
  statusRepair: {
    type: String,
    required: true,
    enum: [
      "En attente",
      "Produit receptionné",
      "Diagnostique en cours",
      "En attente de décision",
      "En Attente des pièces",
      "Répartion en Cours",
      "Produit disponible",
      "Réparation terminée",
    ],
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  technician: {
    type: Schema.Types.ObjectId,
    ref: "Technician",
    required: true,
  },
});
