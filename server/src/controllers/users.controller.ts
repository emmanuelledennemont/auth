import { User } from "@/services";
import express from "express";

const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await User.getUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const getUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const user = await User.getUserById(id);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.deleteUserById(id);
    return res.status(200).json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.sendStatus(400);
    }

    const user = await User.getUserById(id);

    if (!user) {
      return res.sendStatus(404);
    }

    user.username = username;
    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const findUserByEmail = async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.params;
    const user = await User.getUserByEmail(email);

    return res.status(200).json({ exists: user !== null });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export default {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  findUserByEmail,
};
