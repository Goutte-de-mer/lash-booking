"use client";
import { motion } from "motion/react";
import StepTitle from "./StepTitle";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function StepPayment({
  slot,
  service,
  paymentType,
  setPaymentType,
}) {
  const appointmentDay = slot?.date?.toLocaleDateString("fr-FR", {
    weekday: "long",
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
        title={"Paiement"}
        subTitle={"Choisissez votre mode de règlement"}
      />
      <div className="border-secondary-bis border-0.5 mx-auto w-full max-w-3xl space-y-6 rounded-xl border bg-white px-8 py-6 shadow">
        <div className="flex justify-between">
          <div>
            <p className="text-lg font-semibold">{service.name}</p>
            <p className="text-muted-foreground text-sm">
              {appointmentDay} à {slot?.slotStart}
            </p>
          </div>

          <p className="font-heading text-secondary-foreground bg-secondary-bis h-fit w-fit rounded-md px-4 py-1 text-base">
            {service.price}€
          </p>
        </div>

        <RadioGroup
          value={paymentType}
          onValueChange={setPaymentType}
          className="grid grid-cols-2 gap-4"
        >
          <FieldLabel htmlFor="deposit">
            <Field
              orientation="horizontal"
              className="cursor-pointer rounded-xl p-4 py-5 transition-all"
            >
              <FieldContent className="w-full text-center">
                <FieldTitle className="font-heading text-primary self-center text-xl">
                  {service.depositAmount}€
                </FieldTitle>
                <p className="text-muted-foreground text-sm">Acompte</p>
              </FieldContent>
              <RadioGroupItem
                value="deposit"
                id="deposit"
                className="sr-only"
              />
            </Field>
          </FieldLabel>

          <FieldLabel htmlFor="full">
            <Field
              orientation="horizontal"
              className="cursor-pointer rounded-xl p-4 py-5 transition-all"
            >
              <FieldContent className="w-full text-center">
                <FieldTitle className="font-heading text-primary self-center text-xl">
                  {service.price}€
                </FieldTitle>
                <p className="text-muted-foreground text-sm">Totalité</p>
              </FieldContent>
              <RadioGroupItem value="full" id="full" className="sr-only" />
            </Field>
          </FieldLabel>
        </RadioGroup>
      </div>
    </motion.div>
  );
}
