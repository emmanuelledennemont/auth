import axios from "axios";
import dotenv from "dotenv";
import { TechnicianModel } from "../db/models/technician.model";
import moment from 'moment';
import { RepairModel } from "@/db/models/repair.model";
import { ITechnician } from "@/types/user.type";
dotenv.config();

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
    "address.coordinates.coordinates": {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], 10 / 3963.2] // 10 miles radius
      }
    },
  })
    .select("-authentication -__v -__t")
    .then((technicians) =>
      technicians.map((technician) => technician.toObject())
    );
};

export const findCoordinates = async (
  city: string
): Promise<{ latitude: number; longitude: number }> => {
  try {
    const apiKey = process.env.OPENCAGE_API_KEY;

    const response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          q: city,
          key: apiKey,
          limit: 1,
        },
      }
    );

    console.log("Response from OpenCage:", response.data);
    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;

      return { latitude: lat, longitude: lng };
    } else {
      throw new Error(`No results found for city: ${city}`);
    }
  } catch (error) {
    console.error("Error finding coordinates:", error);
    throw new Error("Failed to retrieve coordinates.");
  }
};

export const getTechniciansByCoordinates = async (
  latitude: number,
  longitude: number
) => {
  try {
    const technicians = await TechnicianModel.find({
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
      .exec();
    return technicians.map((technician) => technician.toObject());
  } catch (error) {
    console.error("Error retrieving technicians by coordinates:", error);
    throw new Error("Failed to retrieve technicians by coordinates.");
  }
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
interface Slot {
  start: Date;
  end: Date;
}
const calculateAvailableSlots = (technician: ITechnician) => {
  const availability: Slot[] = [];
  const now = moment().startOf('day'); // Début de la journée en UTC
  console.log(now.toDate())
  const slotDuration = technician.slotDuration || 30; // Valeur par défaut de 30 minutes si non spécifiée
  const openingHours = technician.openingHours;

  openingHours.forEach(daySchedule => {
    const day = moment().day(daySchedule.day).startOf('day'); // Début de la journée en UTC
    if (day.isBefore(now, 'day')) {
      day.add(1, 'weeks'); // Ajoute une semaine si le jour est passé
    }

    daySchedule.slots.forEach((slot: { start: string; end: string }) => {
      let start = moment(day.format('YYYY-MM-DD') + ' ' + slot.start, 'YYYY-MM-DD HH:mm'); // Ajouter 1 heure
      const end = moment(day.format('YYYY-MM-DD') + ' ' + slot.end, 'YYYY-MM-DD HH:mm'); // Ajouter 1 heure
  console.log("start : " + start.toDate())
  console.log("end : " + end.toDate())
      while (start.isSameOrBefore(end)) {
        availability.push({
          start: start.toDate(), // Convertir en objet Date
          end: start.clone().add(slotDuration, 'minutes').toDate() // Convertir en objet Date
        });
       start.add(slotDuration, 'minutes'); // Ajouter la durée du créneau
      }
    });
  });

  return availability;
};

export const getTechnicianAvailableSlots = async (technicianId: string) => {
  const technician = await TechnicianModel.findById(technicianId).lean();
  if (!technician) throw new Error("Technician not found.");

  const bookedSlots = await RepairModel.find({ technician: technicianId }).select('date');
  const bookedDates = bookedSlots.map(repair => moment(repair.date)); 

  const availableSlots = calculateAvailableSlots(technician).filter(slot =>
    !bookedDates.some(date => date.isSame(moment(slot.start)))
  );

  // Convertir les créneaux horaires pour l'affichage 
  const localAvailableSlots = availableSlots.map(slot => ({
    start: moment(slot.start).format('YYYY-MM-DD HH:mm:ss'),
    end: moment(slot.end).format('YYYY-MM-DD HH:mm:ss')
  }));

  return localAvailableSlots;
};


