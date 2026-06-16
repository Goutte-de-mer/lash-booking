import connect from "./mongodb";
import WorkingHours from "@/models/WorkingHours";
import Booking from "@/models/Booking";

const BUFFER_MINUTES = 5; // Battement de 5 min entre les créneau
const STEP_MINUTES = 15; // Pas d'incrémentation pour tester les créneaux libres lors de leur génération

function parseTimeOnDate(dateStr, timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const d = new Date(`${dateStr}T00:00:00`);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function formatTime(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

export async function getAvailability({ date, duration, excludeBookingId }) {
  await connect();

  const dayOfWeek = new Date(`${date}T00:00:00`).getDay();
  const wh = await WorkingHours.findOne({ dayOfWeek, isActive: true });
  if (!wh) return [];

  const dayStart = parseTimeOnDate(date, wh.startTime);
  const dayEnd = parseTimeOnDate(date, wh.endTime);

  const dayBoundStart = new Date(`${date}T00:00:00`);
  const dayBoundEnd = new Date(`${date}T23:59:59`);

  const bookings = await Booking.find({
    slotStart: { $gte: dayBoundStart, $lte: dayBoundEnd },
    status: { $ne: "cancelled" },
    ...(excludeBookingId && { _id: { $ne: excludeBookingId } }),
  });

  const blocks = bookings.map((b) => ({
    start: b.slotStart,
    end: new Date(
      b.slotStart.getTime() + (b.duration + BUFFER_MINUTES) * 60000,
    ),
  }));

  const slots = [];
  const now = new Date();
  const clampedStart = Math.max(dayStart.getTime(), now.getTime());
  const stepMs = STEP_MINUTES * 60000;
  const remainder = clampedStart % stepMs;
  const roundedStart = remainder === 0 ? clampedStart : clampedStart + (stepMs - remainder);
  let candidate = new Date(roundedStart);

  while (candidate < dayEnd) {
    const windowEnd = new Date(
      candidate.getTime() + (duration + BUFFER_MINUTES) * 60000,
    );

    const overlaps = blocks.some(
      (block) => candidate < block.end && windowEnd > block.start,
    );
    const fitsBeforeClose = windowEnd <= dayEnd;

    if (!overlaps && fitsBeforeClose) {
      const slotEnd = new Date(candidate.getTime() + duration * 60000);
      slots.push({
        slotStart: formatTime(candidate),
        slotEnd: formatTime(slotEnd),
      });
    }

    candidate = new Date(candidate.getTime() + STEP_MINUTES * 60000);
  }

  return slots;
}
