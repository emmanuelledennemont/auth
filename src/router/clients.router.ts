import express from "express";

import {
  getAllClientsController,
  getClientController,
  updateClientController,
} from "../controllers/clients.controller";

import {
  addFavoriteTechnician,
  removeFavoriteTechnician,
} from "@/controllers/clients.controller";

import { isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.use(isAuthenticated);

  router.get("/clients", getAllClientsController);
  router.get("/clients/:id", getClientController);
  router.patch("/clients/:id", updateClientController);
  router.post(
    "/clients/:clientId/favorites/:technicianId",
    addFavoriteTechnician
  );
  router.delete(
    "/clients/:clientId/favorites/:technicianId",
    removeFavoriteTechnician
  );

  return router;
};
