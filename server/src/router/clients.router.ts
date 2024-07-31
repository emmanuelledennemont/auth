import express from "express";

import {
  getAllClientsController,
  getClientController,
  updateClientController,
  addNewReparation,
  addFavoriteTechnicianController,
  addRatingController,
  removeFavoriteTechnicianController,
  getClientRepairController,


} from "@/controllers/clients.controller";

import { isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.use(isAuthenticated);

  router.get("/clients", getAllClientsController);
  router.get("/clients/:id", getClientController);
  router.patch("/clients/:id", updateClientController);
  router.post(
    "/clients/:clientId/favorites/:technicianId",
    addFavoriteTechnicianController
  );
  router.post("/ratings", addRatingController);
  router.get(
    "/clients/:clientId/repair",
    getClientRepairController
  );
  router.post("/reparation", addNewReparation);
  router.delete(
    "/clients/:clientId/favorites/:technicianId",
    removeFavoriteTechnicianController
  );
  
  return router;
};
