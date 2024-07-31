import { ClientModel } from "@/db/models/client.model";
import { RepairModel } from "@/db/models/repair.model";
import { TechnicianModel } from "@/db/models/technician.model";

export const addRepair = async (values: Record<string, any>) => {
  // Vérifiez si le technicien existe
  console.log(values.technician);
  const technician = await TechnicianModel.findById(values.technician);
  if (!technician) {
    throw new Error("Technician not found.");
  }

  // Vérifiez si le client existe
  const client = await ClientModel.findById(values.client);
  if (!client) {
    throw new Error("Client not found.");
  }
  values.statusRepair = "En attente";

  return new RepairModel(values).save().then((repair) => repair.toObject());
};

export const getTechnicianRepair = async (technicianId: string) => {
  // Vérifier si le technicien existe
  const technician = await TechnicianModel.findById(technicianId);
  if (!technician) {
    throw new Error("Technician not found.");
  }

  // Obtenir les réparation du technicien
  const repair = await RepairModel.find({
    technician: technicianId,
  })
    .populate("client", "firstname lastname")
    .select("-__v");

  const totalRepair = repair.length;

  return {
    repair,
    totalRepair,
  };
};

export const getClientRepair = async (clientId: string) => {
  // Vérifier si le technicien existe
  console.log(clientId);
  const client = await ClientModel.findById(clientId);
  if (!client) {
    throw new Error("Client not found.");
  }

  // Obtenir les réparation du client
  const repair = await RepairModel.find({
    client: clientId,
  })
    .populate("technician", "firstname lastname")
    .select("-__v");

  const totalRepair = repair.length;

  return {
    repair,
    totalRepair,
  };
};
