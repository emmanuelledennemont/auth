import { createUserWithClientRole } from "@/services/client.service";
import { createUserWithTechnicianRole } from "@/services/technician.service";

export const createRole = async (values: Record<string, any>) => {
  switch (values.role) {
    case "Client":
      return createUserWithClientRole(values);
    case "Technician":
      return createUserWithTechnicianRole(values);
    default:
      return null;
  }
};
