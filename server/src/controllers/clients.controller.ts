import { ClientModel } from "@/db/models/client.model";
import { TechnicianModel } from "@/db/models/technician.model";
import {
  getAllClients,
  getClient,
  updateClient,
} from "@/services/client.service";
import { addRating } from "@/services/rating.service";
import { addRepair, getClientRepair } from "@/services/repair.service";

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

// Controller pour ajouter un technicien aux favoris d'un client
// Exemple: POST /clients/612f1f7f4f3b1e001f2e3b1f/favorites/612f1f7f4f3b1e001f2e3b1f

export const addFavoriteTechnicianController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const clientId = req.params.clientId;
    const technicianId = req.params.technicianId;

    // Vérifiez si le technicien existe
    const technician = await TechnicianModel.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ error: "Technician not found." });
    }

    // Ajoutez le technicien aux favoris du client
    const client = await ClientModel.findByIdAndUpdate(
      clientId,
      { $addToSet: { favorites: technicianId } },
      { new: true }
    ).populate("favorites", "-authentication -__v -__t");

    if (!client) {
      return res.status(404).json({ error: "Client not found." });
    }

    return res.status(200).json(client);
  } catch (error) {
    console.error("Error adding favorite technician:", error);
    return res
      .status(500)
      .json({ error: "Failed to add favorite technician." });
  }
};

// Controller pour supprimer un technicien des favoris d'un client
// Exemple: DELETE /clients/612f1f7f4f3b1e001f2e3b1f/favorites/612f1f7f4f3b1e001f2e3b1f

export const removeFavoriteTechnicianController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const clientId = req.params.clientId;
    const technicianId = req.params.technicianId;

    // Supprimez le technicien des favoris du client
    const client = await ClientModel.findByIdAndUpdate(
      clientId,
      { $pull: { favorites: technicianId } },
      { new: true }
    ).populate("favorites", "-authentication -__v -__t");

    if (!client) {
      return res.status(404).json({ error: "Client not found." });
    }

    return res.status(200).json(client);
  } catch (error) {
    console.error("Error removing favorite technician:", error);
    return res
      .status(500)
      .json({ error: "Failed to remove favorite technician." });
  }
};

// Controller pour ajouter une évaluation à un technicien
// Exemple: POST /ratings
// {
//   "rating": 5,
//   "comment": "Great service!",
//   "clientId": "612f1f7f4f3b1e001f2e3b1f",
//   "technicianId": "612f1f7f4f3b1e001f2e3b1f"
// }

export const addRatingController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { rating, comment, clientId, technicianId } = req.body;

    const newRating = await addRating(rating, comment, clientId, technicianId);

    return res.status(201).json(newRating);
  } catch (error: any) {
    console.error("Error adding rating:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to add rating." });
  }
};

export const addNewReparation = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { marque, model, description, categories, date, client, technician } =
      req.body;
    const reparation = {
      marque,
      model,
      description,
      categories,
      date,
      client,
      technician,
    };

    const newReparation = await addRepair(reparation);

    return res.status(201).json(newReparation);
  } catch (error: any) {
    console.error("Error adding repartion:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to add reparation." });
  }
};

export const getClientRepairController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { clientId } = req.params;
    console.log(clientId);

    const { repair, totalRepair } = await getClientRepair(clientId);

    return res.status(200).json({
      repair,
      totalRepair,
    });
  } catch (error) {
    console.error("Error retrieving repair:", error);
    return res.status(500).json({
      error: (error as Error).message || "Failed to retrieve rapairs.",
    });
  }
};
