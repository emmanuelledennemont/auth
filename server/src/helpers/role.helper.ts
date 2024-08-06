import { Client, Technician } from "@/services";

const create = async (values: Record<string, any>) => {
  switch (values.role) {
    case "Client":
      return Client.createUserWithClientRole(values);
    case "Technician":
      return Technician.createUserWithTechnicianRole(values);
    default:
      return null;
  }
};

export default {
  create,
};
