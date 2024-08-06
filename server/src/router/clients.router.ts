import express from "express";

import { Clients } from "@/controllers";

import { isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.use(isAuthenticated);

  router.get("/clients", Clients.getAllClientsController);
  router.get("/clients/:id", Clients.getClientController);
  router.patch("/clients/:id", Clients.updateClientController);
  router.post(
    "/clients/:clientId/favorites/:technicianId",
    Clients.addFavoriteTechnicianController
  );
  router.post("/ratings", Clients.addRatingController);
  router.get("/clients/:clientId/repair", Clients.getClientRepairController);
  router.post("/reparation", Clients.addNewReparation);
  router.delete(
    "/clients/:clientId/favorites/:technicianId",
    Clients.removeFavoriteTechnicianController
  );

  return router;
};
