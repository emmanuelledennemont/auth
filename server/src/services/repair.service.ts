import { ClientModel } from "@/db/models/client.model";
import { RepairModel} from "@/db/models/repair.model";
import { TechnicianModel } from "@/db/models/technician.model";


export const addRepair = async ( values: Record<string, any>) => {
    // Vérifiez si le technicien existe
    console.log(values.technician)
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

    return  new RepairModel(values)
    .save()
    .then((repair) => repair.toObject());
}