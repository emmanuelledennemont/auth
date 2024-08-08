import { Upload } from "@/helpers";
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
    const updateData: Record<string, any> = req.body;

    console.log("Update request received for user:", id);
    console.log("Update data:", updateData);
    console.log("File:", req.file);

    if (req.file) {
      const uploadResult = await Upload.uploadImage(req.file, id);
      console.log("Upload result:", uploadResult);
      if (uploadResult.success && uploadResult.url) {
        updateData.profileImage = uploadResult.url;
      } else {
        return res
          .status(500)
          .json({ error: "Failed to upload profile image" });
      }
    }

    const updatedUser = await User.updateUserById(id, updateData);
    console.log("Updated user:", updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
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
