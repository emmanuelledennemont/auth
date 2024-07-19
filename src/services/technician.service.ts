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

// Recherche de technicien selon la latitude et la longitude de l'utilisateur
// Il serait possible d'ajouter un rayon de recherche en paramètre

export const getTechnicianByCoordinates = (
  latitude: number,
  longitude: number
) => {
  return TechnicianModel.find({
    "address.coordinates": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: 10000, // recherche dans un rayon de 10 km
      },
    },
  })
    .select("-authentication -__v -__t")
    .then((technicians) =>
      technicians.map((technician) => technician.toObject())
    );
};

export const getTechnicianByCategories = (categories: string[]) => {
  return TechnicianModel.find({
    "categories.slug": { $in: categories },
  })
    .select("-authentication -__v -__t")
    .then((technicians) =>
      technicians.map((technician) => technician.toObject())
    );
};

// Recherche de technicien selon les catégories et les coordonnées de l'utilisateur
export const getTechnicianByFilters = (
  categories: string[],
  latitude: number,
  longitude: number
) => {
  const query: any = {
    "address.coordinates": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: 10000, // recherche dans un rayon de 10 km
      },
    },
  };

  if (categories.length > 0) {
    query["categories.slug"] = { $in: categories };
  }

  return TechnicianModel.find(query)
    .select("-authentication -__v -__t")
    .then((technicians) =>
      technicians.map((technician) => technician.toObject())
    );
};
