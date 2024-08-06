import express from "express";

import { Auth } from "@/controllers";

export default (router: express.Router) => {
  router.post("/auth/register", Auth.register);
  router.post("/auth/login", Auth.login);
};
