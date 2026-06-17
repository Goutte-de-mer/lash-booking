export function getEndTime(booking) {
  const end = new Date(booking.slotStart);
  end.setMinutes(end.getMinutes() + booking.duration);
  return end;
}

export function formatTime(date) {
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function formatDay(date) {
  return date.toLocaleDateString("fr-FR", { day: "numeric" });
}

export function formatMonth(date) {
  return date.toLocaleDateString("fr-FR", { month: "short" });
}
