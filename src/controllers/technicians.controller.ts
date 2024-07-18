import {
  getAllTechnicians,
  getTechnician,
  getTechnicianByCategories,
  getTechnicianByCoordinates,
  updateTechnician,
} from "@/services/technician.service";
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
