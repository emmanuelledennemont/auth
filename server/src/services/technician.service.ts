import { RepairModel } from "@/db/models/repair.model";
import { ITechnician } from "@/types/user.type";
import axios from "axios";
import dotenv from "dotenv";
import moment from "moment-timezone";

import { TechnicianModel } from "../db/models/technician.model";
dotenv.config();

export const getAllTechnicians = () => {
  return TechnicianModel.find()
    .select("-authentication -__v -__t")
    .populate("categories")
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
        $centerSphere: [[longitude, latitude], 10 / 3963.2], // 10 miles radius
      },
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
  start: string;
  end: string;
}
const calculateAvailableSlots = (
  technician: ITechnician,
  day: Number,
  week: Number
) => {
  const availability: Slot[] = [];

  const now = moment()
    .tz("Europe/Paris")
    .add(day.valueOf(), "day")
    .add(week.valueOf(), "week");
  const slotDuration = technician.slotDuration || 30;

  // Définir une date de départ à aujourd'hui
  let currentDay = now.clone().startOf("day");
  const endSearchDay = currentDay.clone().add(1, "week").endOf("week"); // Rechercher sur une semaine complète

  // Parcourir les jours jusqu'à ce que des créneaux de disponibilité soient trouvés
  while (availability.length === 0 && currentDay.isSameOrBefore(endSearchDay)) {
    const dayOfWeek = currentDay.format("dddd");
    const daySchedule = technician.openingHours.find(
      (schedule) => schedule.day === dayOfWeek
    );

    if (daySchedule) {
      daySchedule.slots.forEach((slot: { start: Date; end: Date }) => {
        let start = moment(slot.start).tz("Europe/Paris");
        let end = moment(slot.end).tz("Europe/Paris");

        // Ajuster la date pour correspondre au jour de la semaine en cours
        start
          .year(currentDay.year())
          .month(currentDay.month())
          .date(currentDay.date());
        end
          .year(currentDay.year())
          .month(currentDay.month())
          .date(currentDay.date());

        // Ne pas inclure les créneaux passés
        if (end.isAfter(now)) {
          while (start.isBefore(end)) {
            if (start.isAfter(now)) {
              availability.push({
                start: start.clone().format(), // Convertir en chaîne de caractères
                end: start.clone().add(slotDuration, "minutes").format(), // Convertir en chaîne de caractères
              });
            }
            start.add(slotDuration, "minutes");
          }
        }
      });
    }

    // Passer au jour suivant
    currentDay.add(1, "day");
  }

  return availability;
};

interface Slots {
  day: String;
  slots: Slot[];
}
export const getTechnicianAvailableSlots = async (
  technicianId: string,
  week: number
) => {
  const we = week || 0;

  const technician = await TechnicianModel.findById(technicianId).lean();
  if (!technician) throw new Error("Technician not found.");

  const now = moment().tz("Europe/Paris").startOf("day");
  const endOfWeek = now.clone().endOf("isoWeek");

  const bookedSlots = await RepairModel.find({
    technician: technicianId,
    date: { $gte: now.toDate(), $lte: endOfWeek.toDate() },
  }).select("date");

  const bookedDates = bookedSlots.map((repair) =>
    moment(repair.date).tz("Europe/Paris").format()
  );

  const getAvailabilityForDays = (days: number) => {
    const allAvailableSlots: Slots[] = [];
    let searchDate = now.clone();

    for (let i = 0; i < days; i++) {
      const dailyAvailableSlots = calculateAvailableSlots(
        technician,
        i,
        week
      ).filter(
        (slot) =>
          !bookedDates.some((date) =>
            moment(date).isBetween(
              moment(slot.start),
              moment(slot.end),
              null,
              "[)"
            )
          )
      );
      allAvailableSlots.push({
        day: moment(dailyAvailableSlots[0].start)
          .tz("Europe/Paris")
          .format("dddd"),
        slots: dailyAvailableSlots,
      });
      //allAvailableSlots.slots.push(...dailyAvailableSlots);
      searchDate.add(1, "day");
    }

    return allAvailableSlots;
  };

  const availableSlots = getAvailabilityForDays(6); // Pour obtenir les disponibilités sur 5 jours

  return availableSlots;
};
