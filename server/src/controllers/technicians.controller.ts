import {
  getAllTechnicians,
  getTechnician,
  getTechnicianByCategories,
  getTechnicianByCoordinates,
  getTechnicianByFilters,
  updateTechnician,
} from "@/services/technician.service";

import { getTechnicianRatings } from "@/services/rating.service";

import express from "express";
import mongoose from "mongoose";

export const getAllTechniciansController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const technicians = await getAllTechnicians();
    return res.status(200).json(technicians);
  } catch (error) {
    console.error("Error retrieving technicians:", error);
    return res.status(400).json({ error: "Failed to retrieve technicians." });
  }
};

export const getTechnicianController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const technicianId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(technicianId)) {
      console.error("Invalid Technician ID:", technicianId);
      return res.status(400).json({ error: "Invalid Technician ID." });
    }

    const technician = await getTechnician(technicianId);
    if (!technician) {
      console.error("Technician not found:", technicianId);
      return res.status(404).json({ error: "Technician not found." });
    }
    return res.status(200).json(technician);
  } catch (error) {
    console.error("Error retrieving technician:", error);
    return res.status(500).json({ error: "Failed to retrieve technician." });
  }
};

export const updateTechnicianController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const technicianId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(technicianId)) {
      console.error("Invalid Technician ID:", technicianId);
      return res.status(400).json({ error: "Invalid Technician ID." });
    }

    const technician = await updateTechnician(technicianId, req.body);
    if (!technician) {
      console.error("Technician not found:", technicianId);
      return res.status(404).json({ error: "Technician not found." });
    }
    return res.status(200).json(technician);
  } catch (error) {
    console.error("Error updating technician:", error);
    return res.status(500).json({ error: "Failed to update technician." });
  }
};

export const getTechnicianByCoordinatesController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      console.error("Missing latitude or longitude query parameter.");
      return res
        .status(400)
        .json({ error: "Missing latitude or longitude query parameter." });
    }

    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);

    if (isNaN(lat) || isNaN(lon)) {
      console.error("Invalid latitude or longitude.");
      return res.status(400).json({ error: "Invalid latitude or longitude." });
    }

    const technicians = await getTechnicianByCoordinates(lat, lon);
    return res.status(200).json(technicians);
  } catch (error) {
    console.error("Error retrieving technicians by coordinates:", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve technicians by coordinates." });
  }
};

export const getTechnicianByCategoryController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { categories } = req.query;
    if (!categories) {
      console.error("Missing categories query parameter.");
      return res
        .status(400)
        .json({ error: "Missing categories query parameter." });
    }

    const categoryList = (categories as string).split(",");

    const technicians = await getTechnicianByCategories(categoryList);

    return res.status(200).json(technicians);
  } catch (error) {
    console.error("Error retrieving technicians by categories:", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve technicians by categories." });
  }
};

// Recherche de technicien selon les catégories et les coordonnées de l'utilisateur depuis les paramètres de requête
// Les coordonnées sont restrictives, mais les catégories sont cumulatives
// Exemple: /technicians/filters?categories=petit-electromenager,devices&latitude=-71.7058&longitude=43.1925
export const getTechnicianByFiltersController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { categories, latitude, longitude } = req.query;

    if (!categories || !latitude || !longitude) {
      console.error("Missing required query parameters.");
      return res
        .status(400)
        .json({ error: "Missing required query parameters." });
    }

    const categoryList = (categories as string).split(",");
    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);

    if (isNaN(lat) || isNaN(lon)) {
      console.error("Invalid latitude or longitude.");
      return res.status(400).json({ error: "Invalid latitude or longitude." });
    }

    const technicians = await getTechnicianByFilters(categoryList, lat, lon);
    return res.status(200).json(technicians);
  } catch (error) {
    console.error(
      "Error retrieving technicians by category and coordinates:",
      error
    );
    return res.status(500).json({
      error: "Failed to retrieve technicians by category and coordinates.",
    });
  }
};

// Contrôleur pour obtenir les évaluations d'un technicien avec la moyenne des notes et le nombre de reviews
// Exemple: GET /technicians/612f1f7f4f3b1e001f2e3b1f/ratings
export const getTechnicianRatingsController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const technicianId = req.params.technicianId;

    const { ratings, averageRating, totalRatings } = await getTechnicianRatings(
      technicianId
    );

    return res.status(200).json({
      ratings,
      averageRating,
      totalRatings,
    });
  } catch (error) {
    console.error("Error retrieving ratings:", error);
    return res.status(500).json({
      error: (error as Error).message || "Failed to retrieve ratings.",
    });
  }
};
