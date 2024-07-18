import express from "express";

import {
  getAllClientsController,
  getClientController,
  updateClientController,
} from "../controllers/clients.controller";

import { isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.use(isAuthenticated);

  router.get("/clients", getAllClientsController);
  router.get("/clients/:id", getClientController);
  router.patch("/clients/:id", updateClientController);

  return router;
};
