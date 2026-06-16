"use client";
import { motion } from "motion/react";
import StepTitle from "./StepTitle";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  EuroIcon,
  Calendar03Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";

export default function StepConfirm({ slot, service, paymentType }) {
  const appointmentDate = new Date(slot.date).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="mx-3"
    >
      <StepTitle
        title={"Récapitulatif"}
        subTitle={"Vérifiez vos informations avant de confirmer"}
      />

      {/* Recap */}
      <div className="border-t-primary mx-auto w-full max-w-3xl space-y-4 rounded-lg border border-t-4 bg-white px-8 py-6 shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">{service.name}</h2>
          <span className="text-primary bg-primary/10 h-full rounded-full px-3 py-1 text-sm font-semibold">
            {service.price}€
          </span>
        </div>

        <div className="grid grid-cols-2 border-b pb-3">
          <p className="text-muted-foreground flex items-center gap-3 text-base">
            <HugeiconsIcon icon={Calendar03Icon} size={20} /> {appointmentDate}
          </p>
          <p className="text-muted-foreground flex items-center gap-3 text-base">
            <HugeiconsIcon icon={Clock01Icon} size={20} />
            {slot.slotStart} - {slot.slotEnd}
          </p>
        </div>
        <p className="flex items-center gap-3">
          <HugeiconsIcon
            strokeWidth={2}
            icon={EuroIcon}
            size={20}
            className="text-primary"
          />
          {paymentType == "full" ? (
            <>
              Paiement intégral :
              <span className="font-semibold">{service.price}€</span>
            </>
          ) : (
            <>
              Acompte :
              <span className="font-semibold">{service.depositAmount}€</span>
            </>
          )}
        </p>
      </div>

      {/* Total à régler */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="bg-primary/5 border-primary/20 mx-auto mt-10 w-full max-w-3xl space-y-3 rounded-lg border py-6"
      >
        <p className="text-muted-foreground text-center">
          Total à régler aujourd'hui
        </p>
        <p className="font-heading text-primary text-center text-2xl font-semibold">
          {paymentType == "full"
            ? `${service.price}€`
            : `${service.depositAmount}€`}
        </p>
      </motion.div>
    </motion.div>
  );
}
