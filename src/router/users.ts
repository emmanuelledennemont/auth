import express from "express";

import {
  deleteUser,
  findUserByEmail,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
  router.use(isAuthenticated);

  router.get("/users", getAllUsers);
  router.get("/users/:id", isOwner, getUser);
  router.get("/users/email/:email", findUserByEmail);
  router.delete("/users/:id", isOwner, deleteUser);
  router.patch("/users/:id", isOwner, updateUser);

  return router;
};
