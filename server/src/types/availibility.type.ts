interface Slot {
  start: string;
  end: string;
}
interface Slots {
  day: String;
  date: String;
  slots: Slot[];
}

export { Slot, Slots };
