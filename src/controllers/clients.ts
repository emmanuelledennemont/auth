import {
  getAllClients,
  getClient,
  updateClient,
} from "@/services/client.service";
import express from "express";
import mongoose from "mongoose";

export const getAllClientsController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const clients = await getAllClients();
    return res.status(200).json(clients);
  } catch (error) {
    console.error("Error retrieving clients:", error);
    return res.status(400).json({ error: "Failed to retrieve clients." });
  }
};

export const getClientController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const clientId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      console.error("Invalid Client ID:", clientId);
      return res.status(400).json({ error: "Invalid Client ID." });
    }

    const client = await getClient(clientId);
    if (!client) {
      console.error("Client not found:", clientId);
      return res.status(404).json({ error: "Client not found." });
    }
    return res.status(200).json(client);
  } catch (error) {
    console.error("Error retrieving client:", error);
    return res.status(500).json({ error: "Failed to retrieve client." });
  }
};

export const updateClientController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const clientId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      console.error("Invalid Client ID:", clientId);
      return res.status(400).json({ error: "Invalid Client ID." });
    }

    const client = await updateClient(clientId, req.body);
    if (!client) {
      console.error("Client not found:", clientId);
      return res.status(404).json({ error: "Client not found." });
    }
    return res.status(200).json(client);
  } catch (error) {
    console.error("Error updating client:", error);
    return res.status(500).json({ error: "Failed to update client." });
  }
};
