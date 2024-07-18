import {
  getAllTechniciansController,
  getTechnicianByCategoryController,
  getTechnicianByCoordinatesController,
  getTechnicianController,
  updateTechnicianController,
} from "@/controllers/technicians.controller";
import express from "express";

export default (router: express.Router) => {
  router.get("/technicians", getAllTechniciansController);
  // Recherche de technicien selon la latitude et la longitude de l'utilisateur depuis les paramètres de requête
  router.get("/technicians/coordinates", getTechnicianByCoordinatesController);
  router.get("/technicians/category", getTechnicianByCategoryController);
  router.get("/technicians/:id", getTechnicianController);
  router.patch("/technicians/:id", updateTechnicianController);
};