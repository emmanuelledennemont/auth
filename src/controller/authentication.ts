import express from 'express';
import { getUserByEmail, createUser, updateUserById } from '../db/users';
import { random, authentication } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = (await getUserByEmail(email)).isSelected(
      '+authentication.salt +authentication.password'
    ) as unknown as {
      _id: any;
      authentication: { sessionToken: string; salt: string; password: string };
    };

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

    // Mise à jour de l'utilisateur avec le nouveau jeton de session
    await updateUserById(user._id, {
      'authentication.sessionToken': user.authentication.sessionToken,
    });

    // Définition du cookie d'authentification
    res.cookie('EMMANUELLE-AUTH', user.authentication.sessionToken, {
      domain: 'localhost',
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
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
