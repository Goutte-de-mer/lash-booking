import { getEndTime, formatTime, formatDay, formatMonth } from "@/lib/booking";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";
import PaymentStatusBadge from "./PaymentStatusBadge";
import AppointmentStatusBadge from "./AppointmentStatusBadge";
import { motion } from "motion/react";

export default function AppointmentCard({
  appointment,
  isUpcoming = false,
  onCancelled,
  delay,
}) {
  const start = new Date(appointment.slotStart);
  const end = getEndTime(appointment);

  const day = formatDay(start);
  const month = formatMonth(start);
  const time = `${formatTime(start)} - ${formatTime(end)}`; // "11:00 - 12:00"

  async function handleCancel() {
    const res = await fetch(`/api/bookings/${appointment._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    if (res.ok) onCancelled(appointment._id);
    else alert("Erreur lors de l'annulation, réessaie plus tard.");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: isUpcoming ? 1 : 0.75, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: delay }}
      className={`flex w-full items-center justify-between rounded-2xl bg-white px-8 py-6 shadow`}
    >
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 text-primary flex h-14 w-14 flex-col items-center justify-center rounded-xl">
          <span className="leading-tight font-semibold uppercase">{month}</span>
          <span className="font-heading leading-tight">{day}</span>
        </div>
        <div>
          <p className="font-semibold">{appointment.serviceId.name}</p>
          <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={Clock01Icon} size={18} />
              {time}
            </span>
            <AppointmentStatusBadge status={appointment.status} />
          </div>
          <div className="text-muted-foreground mt-1.5 flex items-center gap-2 text-xs">
            <span>
              {appointment.amountPaid}€ / {appointment.serviceId.price}€
            </span>
            <PaymentStatusBadge status={appointment.paymentStatus} />
          </div>
        </div>
      </div>
      {isUpcoming && (
        <Button
          onClick={handleCancel}
          className={"rounded-md"}
          variant="destructive"
        >
          Annuler
        </Button>
      )}
    </motion.div>
  );
}
