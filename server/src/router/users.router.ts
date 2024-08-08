import { Users } from "@/controllers";
import express from "express";
import multer from "multer";
import { isAuthenticated, isOwner } from "../middlewares";

const upload = multer({ storage: multer.memoryStorage() });

export default (router: express.Router) => {
  router.use(isAuthenticated);

  router.get("/users", Users.getAllUsers);
  router.get("/users/:id", isOwner, Users.getUser);
  router.get("/users/email/:email", Users.findUserByEmail);
  router.delete("/users/:id", isOwner, Users.deleteUser);
  router.patch("/users/:id", upload.single("profileImage"), Users.updateUser);

  return router;
};
