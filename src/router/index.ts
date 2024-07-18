import express from "express";
import authentication from "./authentication.router";
import clients from "./clients.router";
import technicians from "./technicians.router";
import users from "./users.router";
const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router); // Remove the argument when calling the authentication function
  clients(router);
  technicians(router);
  return router;
};
