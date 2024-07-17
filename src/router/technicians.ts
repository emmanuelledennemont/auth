import {
  getAllTechniciansController,
  getTechnicianController,
  updateTechnicianController,
} from "@/controllers/technicians";
import express from "express";

export default (router: express.Router) => {
  router.get("/technicians", getAllTechniciansController);
  router.get("/technicians/:id", getTechnicianController);
  router.patch("/technicians/:id", updateTechnicianController);
};
