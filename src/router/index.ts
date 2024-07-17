import express from "express";
import authentication from "../router/authentication";
import clients from "./clients";
import technicians from "./technicians";
import users from "./users";
const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router); // Remove the argument when calling the authentication function
  clients(router);
  technicians(router);
  return router;
};
