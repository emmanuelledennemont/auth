import {
  getAllTechnicians,
  getTechnician,
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

// Recherche de technicien selon la latitude et la longitude de l'utilisateur depuis les paramètres de requête

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

    const technicians = await getTechnicianByCoordinates(
      Number(latitude),
      Number(longitude)
    );

    return res.status(200).json(technicians);
  } catch (error) {
    console.error("Error retrieving technicians by coordinates:", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve technicians by coordinates." });
  }
};
