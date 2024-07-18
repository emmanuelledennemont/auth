import { getUserByEmail, updateUserById } from "@/services/user.service";
import { createRole } from "@/utils/createRole";
import express from "express";
import { authentication, random } from "../helpers";
import { User } from "../types/user.type";

/*
  Example:
  {
    "email": "example@mail.com",
    "password": "pass"
  }
*/

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = (await getUserByEmail(email)) as User | null;

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.status(403).json({ error: "Invalid password." });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    // Update the user with the new session token
    await updateUserById(user._id.toString(), {
      "authentication.sessionToken": user.authentication.sessionToken,
    });

    // Set the authentication cookie
    res.cookie("EMMANUELLE-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/*
  Example:
  {
    "email": "example@mail.com",
    "password": "pass",
    "username": "example",
    "role": "Technician"
  }
 */

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username, role } = req.body;

    if (!email || !password || !username || !role) {
      return res
        .status(400)
        .json({ error: "Email, password, username, and role are required." });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ error: "Email is already in use." });
    }

    const salt = random();
    const user = {
      email,
      username,
      role,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    } as User;

    const createRoles = await createRole(user);

    if (!createRoles) {
      return res.status(500).json({ error: "Failed to create user role." });
    }

    return res.status(201).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
