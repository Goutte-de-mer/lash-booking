"use client";
import { motion } from "motion/react";
import StepTitle from "./StepTitle";
import { useState, useMemo } from "react";
import { Calendar } from "../ui/calendar";
import { fr } from "react-day-picker/locale";
import { toDateKey } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

export default function StepSlot({
  selectedService,
  workingHours,
  selectedSlot,
  setSelectedSlot,
}) {
  const [date, setDate] = useState(undefined);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  const handleSelect = async (selectedDate) => {
    setDate(selectedDate);
    setSelectedSlot(null);
    setSlots([]);
    setSlotsError(null);

    if (!selectedDate || !selectedService?.duration) return;

    setLoadingSlots(true);
    try {
      const dateKey = toDateKey(selectedDate);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `/api/availability?date=${dateKey}&duration=${selectedService.duration}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) {
        throw new Error("Erreur lors de la récupération des créneaux");
      }

      const data = await res.json();
      setSlots(data);
    } catch (err) {
      setSlotsError(err.message);
    } finally {
      setLoadingSlots(false);
    }
  };

  const inactiveDays = useMemo(
    () =>
      new Set(
        workingHours.filter((wh) => !wh.isActive).map((wh) => wh.dayOfWeek),
      ),
    [workingHours],
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <StepTitle
        title={"Choisissez un créneau"}
        subTitle={`${selectedService?.name || "Prestation"} - ${selectedService?.duration || "X"} min`}
      />
      <Calendar
        mode="single"
        selected={date}
        showOutsideDays={false}
        onSelect={handleSelect}
        locale={fr}
        disabled={[(d) => inactiveDays.has(d.getDay()), { before: new Date() }]}
        className="mx-auto rounded-lg border bg-white"
      />
      {loadingSlots && (
        <div className="flex justify-center pt-2">
          <Spinner className="text-primary size-5" />
        </div>
      )}

      {slotsError && (
        <p className="text-destructive pt-2 text-center text-sm">
          {slotsError}
        </p>
      )}

      {!loadingSlots && !slotsError && date && slots.length === 0 && (
        <p className="text-muted-foreground pt-2 text-center text-sm">
          Aucun créneau disponible ce jour-là.
        </p>
      )}

      {slots.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="mx-auto mt-4 grid max-w-3xl grid-cols-3 flex-wrap gap-2 px-4 md:grid-cols-4 lg:grid-cols-6"
        >
          {slots.map((slot) => (
            <button
              key={slot.slotStart}
              type="button"
              onClick={() => setSelectedSlot({ ...slot, date })}
              className={`cursor-pointer rounded-md border px-3 py-2 text-sm transition-colors ${
                selectedSlot?.slotStart === slot.slotStart
                  ? "bg-primary border-primary text-white shadow-md"
                  : "hover:bg-secondary-bis hover:border-primary"
              }`}
            >
              {slot.slotStart} - {slot.slotEnd}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
