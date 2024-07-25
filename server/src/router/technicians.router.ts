import {
  getAllTechniciansController,
  getTechnicianByCategoryController,
  getTechnicianByCoordinatesController,
  getTechnicianByFiltersController,
  getTechnicianController,
  getTechnicianRatingsController,
  getTechniciansByCityController,
  updateTechnicianController,
} from "@/controllers/technicians.controller";

import express from "express";

export default (router: express.Router) => {
  router.get("/technicians", getAllTechniciansController);
  router.get("/technicians/coordinates", getTechnicianByCoordinatesController);
  router.get("/technicians/category", getTechnicianByCategoryController);
  router.get("/technicians/filters", getTechnicianByFiltersController);
  router.get(
    "/technicians/:technicianId/ratings",
    getTechnicianRatingsController
  );
  router.get("/technicians/byCity", getTechniciansByCityController);
  router.get("/technicians/:id", getTechnicianController);
  router.patch("/technicians/:id", updateTechnicianController);
};
