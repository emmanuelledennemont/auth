import {
  getAllTechniciansController,
  getTechnicianByCategoryController,
  getTechnicianByCoordinatesController,
  getTechnicianByFiltersController,
  getTechnicianController,
  getTechnicianRatingsController,
  updateTechnicianController,
} from "@/controllers/technicians.controller";

import express from "express";

export default (router: express.Router) => {
  router.get("/technicians", getAllTechniciansController);
  // Recherche de technicien selon la latitude et la longitude de l'utilisateur depuis les paramètres de requête
  router.get("/technicians/coordinates", getTechnicianByCoordinatesController);
  router.get("/technicians/category", getTechnicianByCategoryController);
  router.get("/technicians/filters", getTechnicianByFiltersController);
  router.get(
    "/technicians/:technicianId/ratings",
    getTechnicianRatingsController
  );
  // LAISSER LES ID A LA FIN
  router.get("/technicians/:id", getTechnicianController);
  router.patch("/technicians/:id", updateTechnicianController);
};
