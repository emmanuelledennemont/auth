// technician.controller.ts

import { Rating, Repair, Technician } from "@/services";
import express from "express";
import mongoose from "mongoose";

const getTechniciansController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id, latitude, longitude, city, categories, week, categoryId, subCategoryId } = req.query;

    let filterOptions: any = {};

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id as string)) {
        return res.status(400).json({ error: "Invalid Technician ID." });
      }
      filterOptions.id = id;
    }

    if (latitude && longitude) {
      filterOptions.longitude = parseFloat(latitude as string);
      filterOptions.latitude = parseFloat(longitude as string);
      if (isNaN(filterOptions.latitude) || isNaN(filterOptions.longitude)) {
        return res
          .status(400)
          .json({ error: "Invalid latitude or longitude." });
      }
      if (
        filterOptions.latitude < -90 ||
        filterOptions.latitude > 90 ||
        filterOptions.longitude < -180 ||
        filterOptions.longitude > 180
      ) {
        return res
          .status(400)
          .json({ error: "Latitude or longitude out of bounds." });
      }
      console.log(
        `Filtering by coordinates: ${filterOptions.latitude}, ${filterOptions.longitude}`
      );
    } else if (city) {
      console.log(`Searching coordinates for city: ${city}`);
      try {
        const coordinates = await Technician.findCoordinates(city as string);
        if (!coordinates) {
          console.error(`Coordinates not found for city: ${city}`);
          return res
            .status(404)
            .json({ error: "Coordinates not found for the city." });
        }
        filterOptions.latitude = coordinates.latitude;
        filterOptions.longitude = coordinates.longitude;
        console.log(
          `City coordinates found: ${filterOptions.latitude}, ${filterOptions.longitude}`
        );
      } catch (error) {
        console.error("Error finding coordinates for city:", error);
        return res.status(500).json({
          error: "Failed to find coordinates for the city.",
          details: (error as Error).message,
        });
      }
    }
    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId as string)) {
        return res.status(400).json({ error: "Invalid category ID." });
      }
      filterOptions.categoryId = categoryId;
    }

    if (subCategoryId) {
      if (!mongoose.Types.ObjectId.isValid(subCategoryId as string)) {
        return res.status(400).json({ error: "Invalid subCategory ID." });
      }
      filterOptions.subCategoryId = subCategoryId;
    }
    

    if (categories) {
      filterOptions.categories = (categories as string).split(",");
      console.log(`Filtering by categories: ${filterOptions.categories}`);
    }

    if (week) {
      filterOptions.week = parseInt(week as string);
      console.log(`Filtering by week: ${filterOptions.week}`);
    }

    console.log("Filter options:", filterOptions);

    const technicians = await Technician.filterTechnicians(filterOptions);

    if (id && technicians.length === 0) {
      return res.status(404).json({ error: "Technician not found." });
    }

    console.log(`Found ${technicians.length} technicians`);
    return res.status(200).json(technicians);
  } catch (error) {
    console.error("Error retrieving technicians:", error);
    return res.status(500).json({
      error: "Failed to retrieve technicians.",
      details: (error as Error).message,
    });
  }
};
const updateTechnicianController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const technicianId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(technicianId)) {
      return res.status(400).json({ error: "Invalid Technician ID." });
    }

    if (req.body.address) {
      const coordinates = await Technician.findCoordinates(
        `${req.body.address.addressLine},${req.body.address.city},${req.body.address.zip}`
      );

      if (coordinates) {
        req.body.address.coordinates.coordinates = [
          coordinates.longitude,
          coordinates.latitude,
        ];
      }
    }

    const technician = await Technician.update(technicianId, req.body);
    if (!technician) {
      return res.status(404).json({ error: "Technician not found." });
    }
    return res.status(200).json(technician);
  } catch (error) {
    console.error("Error updating technician:", error);
    return res.status(500).json({ error: "Failed to update technician." });
  }
};

const getTechnicianDetailsController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { technicianId } = req.params;

    const [ratings, repairs, availability] = await Promise.all([
      Rating.getTechnicianRatings(technicianId),
      Repair.getTechnicianRepair(technicianId),
      Technician.getAvailableSlots(technicianId, { week: 0 }),
    ]);

    return res.status(200).json({
      ratings: ratings.ratings,
      averageRating: ratings.averageRating,
      totalRatings: ratings.totalRatings,
      repairs: repairs.repair,
      totalRepairs: repairs.totalRepair,
      availability,
    });
  } catch (error) {
    console.error("Error retrieving technician details:", error);
    return res.status(500).json({
      error:
        (error as Error).message || "Failed to retrieve technician details.",
    });
  }
};

export const getTechnicianAvailabilityController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { technicianId } = req.params;
    const week = req.query.week ? parseInt(req.query.week as string) : 0;
    const dayQuery = req.query.day as string;

    let options: { week: number; dayRange?: { start: number; end: number } } = {
      week,
    };

    if (dayQuery) {
      if (dayQuery.includes("-")) {
        const [start, end] = dayQuery.split("-").map((d) => parseInt(d));
        if (isNaN(start) || isNaN(end) || start < 0 || end > 6 || start > end) {
          return res.status(400).json({
            error:
              "Invalid day range. Format should be 'start-end' where both are between 0 and 6, and start <= end.",
          });
        }
        options.dayRange = { start, end };
      } else {
        const day = parseInt(dayQuery);
        if (isNaN(day) || day < 0 || day > 6) {
          return res.status(400).json({
            error: "Invalid day. Should be a number between 0 and 6.",
          });
        }
        options.dayRange = { start: day, end: day };
      }
    }

    console.log(
      `Getting availability for technician: ${technicianId}`,
      options
    );

    const slots = await Technician.getAvailableSlots(technicianId, options);
    return res.status(200).json(slots);
  } catch (error) {
    console.error("Error retrieving technician availability:", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve technician availability." });
  }
};

export default {
  getTechniciansController,
  updateTechnicianController,
  getTechnicianDetailsController,
  getTechnicianAvailabilityController,
};
