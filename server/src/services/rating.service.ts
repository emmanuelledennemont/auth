import { ClientModel } from "@/db/models/client.model";
import { RatingModel } from "@/db/models/rating.model";
import { TechnicianModel } from "@/db/models/technician.model";

const add = async (
  rating: number,
  comment: string,
  clientId: string,
  technicianId: string
) => {
  // Vérifiez si le technicien existe
  const technician = await TechnicianModel.findById(technicianId);
  if (!technician) {
    throw new Error("Technician not found.");
  }

  // Vérifiez si le client existe
  const client = await ClientModel.findById(clientId);
  if (!client) {
    throw new Error("Client not found.");
  }

  // Créez l'évaluation
  const newRating = new RatingModel({
    rating,
    comment,
    client: clientId,
    technician: technicianId,
  });

  await newRating.save();

  // Recalculez la moyenne des notes et le nombre de reviews
  const ratings = await RatingModel.find({ technician: technicianId }).select(
    "-__v"
  );

  const totalRatings = ratings.length;
  const averageRating =
    ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings;

  // Mettre à jour la note moyenne et le nombre de reviews du technicien
  technician.rating = {
    score: parseFloat(averageRating.toFixed(2)), // Arrondir à deux décimales
    reviews: totalRatings,
  };

  await technician.save();

  return newRating;
};

const getTechnicianRatings = async (technicianId: string) => {
  // Vérifier si le technicien existe
  const technician = await TechnicianModel.findById(technicianId);
  if (!technician) {
    throw new Error("Technician not found.");
  }

  // Obtenir les évaluations du technicien
  const ratings = await RatingModel.find({
    technician: technicianId,
  })
    .populate("client", "firstname lastname username -__t")
    .select("-__v");

  // Calculer la moyenne des notes et le nombre de reviews
  const totalRatings = ratings.length;
  const averageRating =
    ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings;

  return {
    ratings,
    averageRating: parseFloat(averageRating.toFixed(2)), // Arrondir à deux décimales
    totalRatings,
  };
};

export default {
  add,
  getTechnicianRatings,
};
