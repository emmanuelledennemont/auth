import { TechnicianModel } from "../db/models/technician.model";

export const getAllTechnicians = () => {
  return TechnicianModel.find()
    .select("-authentication -__v -__t")
    .then((technicians) =>
      technicians.map((technician) => technician.toObject())
    );
};

export const getTechnician = (id: string) => {
  return TechnicianModel.findById(id)
    .select("-authentication -__v -__t") 
    .then((technician) => technician?.toObject());
};

export const createUserWithTechnicianRole = (values: Record<string, any>) => {
  return new TechnicianModel(values)
    .save()
    .then((technician) => technician.toObject());
};

export const updateTechnician = (id: string, values: Record<string, any>) => {
  return TechnicianModel.findByIdAndUpdate(id, values, { new: true })
    .select("-authentication -__v -__t")
    .then((technician) => technician?.toObject());
};
