import express from "express";

import { Users } from "@/controllers";

import { isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
  router.use(isAuthenticated);

  router.get("/users", Users.getAllUsers);
  router.get("/users/:id", isOwner, Users.getUser);
  router.get("/users/email/:email", Users.findUserByEmail);
  router.delete("/users/:id", isOwner, Users.deleteUser);
  router.patch("/users/:id", isOwner, Users.updateUser);

  return router;
};
