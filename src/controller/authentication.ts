import express from "express";
import { createUser, getUserByEmail, updateUserById } from "../db/users";
import { authentication, random } from "../helpers";
import { User } from "../types/user.type";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = (await getUserByEmail(email)) as User | null;

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403);
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
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = (await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    })) as User;

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
