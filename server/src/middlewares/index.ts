import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "@/services/user.service";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = get(req, "cookies.EMMANUELLE-AUTH");

    if (!sessionToken) {
      console.log("Authentication token is missing.");
      return res
        .status(403)
        .json({ error: "Authentication token is missing." });
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      console.log("Invalid authentication token.");
      return res.status(403).json({ error: "Invalid authentication token." });
    }

    console.log("Authenticated user:", existingUser);

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log("Error in isAuthenticated middleware:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as unknown as string;

    if (!currentUserId) {
      console.log("Current user ID is missing.");
      return res.sendStatus(403);
    }

    console.log("Current user ID:", currentUserId);
    console.log("Resource ID:", id);

    if (currentUserId.toString() !== id.toString()) {
      console.log("Current user is not the owner.");
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log("Error in isOwner middleware:", error);
    return res.sendStatus(400);
  }
};
