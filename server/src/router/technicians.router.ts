import { Technicians } from "@/controllers";
import express from "express";

export default (router: express.Router) => {
  router.get("/technicians", Technicians.getTechniciansController);
  router.patch("/technicians/:id", Technicians.updateTechnicianController);
  router.get(
    "/technicians/:technicianId/details",
    Technicians.getTechnicianDetailsController
  );
  router.get(
    "/technicians/:technicianId/availability",
    Technicians.getTechnicianAvailabilityController
  );
};
