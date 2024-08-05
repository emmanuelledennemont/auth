import express from "express";
import authentication from "./authentication.router";
import categories from "./category.router";
import clients from "./clients.router";
import technicians from "./technicians.router";
import users from "./users.router";
const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  clients(router);
  categories(router);
  technicians(router);
  return router;
};
