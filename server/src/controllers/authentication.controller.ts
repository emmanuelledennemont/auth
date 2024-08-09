import { Crypto } from "@/helpers";
import { User } from "@/services";
import express from "express";
import { User as UserType } from "../types/user.type";

/*
  Example:
  {
    "email": "example@mail.com",
    "password": "pass"
  }
*/

const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = (await User.getUserByEmail(email)) as UserType | null;

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const expectedHash = Crypto.authentication(
      user.authentication.salt,
      password
    );

    if (user.authentication.password !== expectedHash) {
      return res.status(403).json({ error: "Invalid password." });
    }

    const salt = Crypto.random();
    user.authentication.sessionToken = Crypto.authentication(
      salt,
      user._id.toString()
    );

    // Update the user with the new session token
    await User.updateUserById(user._id.toString(), {
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
    "role": "Technician",
    "firstname": "First",
    "lastname": "Last",
    "phone": "1234567890"
  }
 */

const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username, role, firstname, lastname, phone } =
      req.body;

    if (
      !email ||
      !password ||
      !username ||
      !role ||
      !firstname ||
      !lastname ||
      !phone
    ) {
      return res.status(400).json({
        error:
          "Email, password, username, role, firstname, lastname, and phone are required.",
      });
    }

    const existingUser = await User.getUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ error: "Email is already in use." });
    }

    const salt = Crypto.random();
    const user = {
      email,
      username,
      firstname,
      lastname,
      phone,
      role,
      authentication: {
        salt,
        password: Crypto.authentication(salt, password),
      },
    } as unknown as UserType;

    const createRoles = await role.create(user);

    if (!createRoles) {
      return res.status(500).json({ error: "Failed to create user role." });
    }

    return res.status(201).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default {
  login,
  register,
};
