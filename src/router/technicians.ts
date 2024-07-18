import {
  getAllTechniciansController,
  getTechnicianByCoordinatesController,
  getTechnicianController,
  updateTechnicianController,
} from "@/controllers/technicians";
import express from "express";

export default (router: express.Router) => {
  router.get("/technicians", getAllTechniciansController);
  router.get("/technicians/:id", getTechnicianController);
  // Recherche de technicien selon la latitude et la longitude de l'utilisateur depuis les paramètres de l'URL
  router.get(
    "/technicians/coordinates/:latitude/:longitude",
    getTechnicianByCoordinatesController
  );
  router.patch("/technicians/:id", updateTechnicianController);
};
