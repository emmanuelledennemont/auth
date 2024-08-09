import { RepairModel } from "@/db/models/repair.model";
import { Avaibility } from "@/helpers";
import { ITechnician } from "@/types/user.type";
import axios from "axios";
import dotenv from "dotenv";
import moment from "moment-timezone";
import { TechnicianModel } from "../db/models/technician.model";
import { Slots } from "../types/availibility.type";

dotenv.config();

interface FilterOptions {
  id?: string;
  categoryId?: string;
  subCategoryId?: string;
  latitude?: number;
  longitude?: number;
  categories?: string[];
  city?: string;
  availability?: {
    startDate: Date;
    endDate: Date;
  };
  week?: number;
  day?: number;
}

interface AvailabilityOptions {
  week: number;

  dayRange?: {
    start: number;
    end: number;
  };
}

// Services de base
const getAll = () => {
  return TechnicianModel.find()
    .select("-authentication -__v -__t")
    .then((technicians) =>
      technicians.map((technician) => technician.toObject())
    );
};

const get = (id: string) => {
  return TechnicianModel.findById(id)
    .select("-authentication -__v -__t")
    .then((technician) => {
      if (!technician) {
        throw new Error("Technician not found");
      }
      return technician.toObject();
    })
    .catch((error) => {
      console.error("Error fetching technician:", error);
      throw error;
    });
};

const createUserWithTechnicianRole = (values: Record<string, any>) => {
  return new TechnicianModel(values)
    .save()
    .then((technician) => technician.toObject());
};

const update = (id: string, values: Record<string, any>) => {
  return TechnicianModel.findByIdAndUpdate(id, values, { new: true })
    .select("-authentication -__v -__t")
    .populate("categories")
    .then((technician) => technician?.toObject());
};

const updateCategories = (technicianId: string, categoriesData: any) => {
  return TechnicianModel.findByIdAndUpdate(
    technicianId,
    { $set: { categories: categoriesData.categories } },
    { new: true }
  )
    .populate({
      path: "categories",
      populate: {
        path: "subCategories",
        model: "SubCategories",
      },
    })
    .then((technician) => technician?.toObject());
};

// Service de filtrage unifié
const filterTechnicians = async (options: FilterOptions) => {
  let query: any = {};

  if (options.id) {
    query._id = options.id;
  }

  if (options.categoryId) {
    query["categories._id"] = options.categoryId;
    console.log(query)
  }

  if (options.subCategoryId) {
    query["categories.subCategories._id"] = options.subCategoryId;
  }

  if (options.latitude !== undefined && options.longitude !== undefined) {
    query["address.coordinates.coordinates"] = {
      $geoWithin: {
        $centerSphere: [[options.longitude, options.latitude], 10 / 3963.2], // 10 miles radius
      },
    };
  }

  if (options.categories && options.categories.length > 0) {
    query["categories.slug"] = { $in: options.categories };
  }

  if (options.city) {
    const coordinates = await findCoordinates(options.city);
    query["address.coordinates.coordinates"] = {
      $geoWithin: {
        $centerSphere: [
          [coordinates.longitude, coordinates.latitude],
          10 / 3963.2,
        ], // 10 miles radius
      },
    };
  }

  let technicians = await TechnicianModel.find(query)
    .select("-authentication -__v -__t")
    .populate({
      path: "categories.category",
      populate: { path: "sub_categories" },
      options: { strictPopulate: false },
    })
    .populate({
      path: "categories.subCategories",
      options: { strictPopulate: false },
    })
    .lean();

  if (
    options.availability ||
    options.week !== undefined ||
    options.day !== undefined
  ) {
    technicians = await Promise.all(
      technicians.map(async (technician) => {
        const availableSlots = await getAvailableSlots(
          technician._id.toString(),
          {
            week: options.week || 0,
            dayRange:
              options.day !== undefined
                ? { start: options.day, end: options.day }
                : undefined,
          }
        );
        return { ...technician, availableSlots };
      })
    );

    technicians = technicians.filter((technician) =>
      (technician as any).availableSlots.some(
        (slot: Slots) => slot.slots.length > 0
      )
    );
  }

  return technicians;
};

const findCoordinates = async (
  city: string
): Promise<{ latitude: number; longitude: number }> => {
  try {
    const apiKey = process.env.OPENCAGE_API_KEY;
    if (!apiKey) {
      throw new Error("OpenCage API key is not set");
    }

    console.log(`Requesting coordinates for city: ${city}`);
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

    console.log(
      "OpenCage API Response:",
      JSON.stringify(response.data, null, 2)
    );

    if (response.data.results && response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      console.log(`Coordinates found: ${lat}, ${lng}`);
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error(`No results found for city: ${city}`);
    }
  } catch (error) {
    console.error("Error in findCoordinates:", error);
    throw new Error("Failed to retrieve coordinates.");
  }
};

const getAvailableSlots = async (
  technicianId: string,
  options: AvailabilityOptions
) => {
  const { week, dayRange } = options;
  const technician = await TechnicianModel.findById(technicianId).lean();
  if (!technician) throw new Error("Technician not found.");

  const currentDate = moment().tz("Europe/Paris");
  const startOfRequestedWeek = currentDate
    .clone()
    .startOf("isoWeek")
    .add(week, "weeks");
  const endOfRequestedWeek = startOfRequestedWeek.clone().endOf("isoWeek");

  if (endOfRequestedWeek.isBefore(currentDate)) {
    return [];
  }

  const bookedSlots = await RepairModel.find({
    technician: technicianId,
    date: {
      $gte: startOfRequestedWeek.toDate(),
      $lte: endOfRequestedWeek.toDate(),
    },
  }).select("date");

  const bookedDates = bookedSlots.map((repair) =>
    moment(repair.date).tz("Europe/Paris").format()
  );

  const getAvailabilityForDay = (targetDay: moment.Moment) => {
    if (targetDay.isBefore(currentDate, "day")) {
      return null;
    }

    const dayOfWeek = targetDay.format("dddd");
    const daySchedule = technician.openingHours.find(
      (schedule) => schedule.day === dayOfWeek
    );

    if (!daySchedule) return null;

    const dailyAvailableSlots = Avaibility.calculateAvailableSlots(
      technician as ITechnician,
      targetDay
    ).filter(
      (slot) =>
        moment(slot.start).isAfter(currentDate) &&
        !bookedDates.some((date) =>
          moment(date).isBetween(
            moment(slot.start),
            moment(slot.end),
            null,
            "[)"
          )
        )
    );

    if (dailyAvailableSlots.length === 0) return null;

    return {
      day: dayOfWeek,
      date: targetDay.format("DD-MM-YYYY"),
      slots: dailyAvailableSlots,
    };
  };

  const weekAvailability = [];
  const start = dayRange ? dayRange.start : 0;
  const end = dayRange ? dayRange.end : 6;

  for (let i = start; i <= end; i++) {
    const dayAvailability = getAvailabilityForDay(
      startOfRequestedWeek.clone().add(i, "days")
    );
    if (dayAvailability) {
      weekAvailability.push(dayAvailability);
    }
  }

  return weekAvailability;
};

export default {
  getAll,
  get,
  createUserWithTechnicianRole,
  update,
  updateCategories,
  filterTechnicians,
  findCoordinates,
  getAvailableSlots,
};
