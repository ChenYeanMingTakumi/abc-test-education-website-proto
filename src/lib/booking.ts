export const PROGRAMS = [
  "English",
  "Math",
  "Phonics",
  "Science",
  "Bahasa Malaysia",
  "Mandarin",
] as const;

export const TIME_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "01:00 PM",
  "02:30 PM",
  "04:00 PM",
  "05:30 PM",
] as const;

export type Program = (typeof PROGRAMS)[number];
export type TimeSlot = (typeof TIME_SLOTS)[number];
