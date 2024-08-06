import { Slot } from "@/types/availibility.type";
import { ITechnician } from "@/types/user.type";

import moment from "moment-timezone";

const calculateAvailableSlots = (
  technician: ITechnician,
  targetDay: moment.Moment
): Slot[] => {
  const availability: Slot[] = [];
  const currentDate = moment().tz("Europe/Paris");
  const slotDuration = technician.slotDuration || 30;
  const startOfDay = targetDay.clone().startOf("day");
  const endOfDay = targetDay.clone().endOf("day");

  const dayOfWeek = targetDay.format("dddd");
  const daySchedule = technician.openingHours.find(
    (schedule) => schedule.day === dayOfWeek
  );

  if (daySchedule) {
    daySchedule.slots.forEach((slot: { start: Date; end: Date }) => {
      let start = moment(slot.start)
        .tz("Europe/Paris")
        .year(targetDay.year())
        .month(targetDay.month())
        .date(targetDay.date());
      let end = moment(slot.end)
        .tz("Europe/Paris")
        .year(targetDay.year())
        .month(targetDay.month())
        .date(targetDay.date());

      while (start.isBefore(end) && start.isSameOrBefore(endOfDay)) {
        if (start.isAfter(currentDate)) {
          availability.push({
            start: start.clone().format(),
            end: start.clone().add(slotDuration, "minutes").format(),
          });
        }
        start.add(slotDuration, "minutes");
      }
    });
  }

  return availability;
};

export default { calculateAvailableSlots };
