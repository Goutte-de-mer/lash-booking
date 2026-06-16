"use client";
// import { useState } from "react";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";

const steps = ["Prestations", "Créneau", "Paiement", "Confirmation"];

export default function Steps({
  children,
  currentStep,
  setCurrentStep,
  service,
  selectedSlot,
  paymentType,
}) {
  return (
    <>
      <div className="mx-auto mt-8 mb-4 flex w-full max-w-3xl gap-4 px-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full ${currentStep >= i ? "bg-primary" : "bg-border"} flex-1 transition-colors duration-200`}
          />
        ))}
      </div>
      <p className="text-muted-foreground mt-2 text-center text-sm">
        Étape {currentStep + 1} / {steps.length} - {steps[currentStep]}
      </p>
      <div className="mb-8">{children}</div>

      <div className="border-border mx-auto mt-auto flex w-full max-w-3xl items-center justify-between border-t px-3 pt-5 sm:px-0">
        {currentStep > 0 && (
          <Button
            variant="ghost"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            size="lg"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={18} /> Précédent
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button
            onClick={() => setCurrentStep((prev) => prev + 1)}
            className={"ml-auto"}
            size="lg"
            disabled={
              (currentStep === 0 && !service) ||
              (currentStep === 1 && !selectedSlot) ||
              (currentStep == 2 && !paymentType)
            }
          >
            Continuer <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
          </Button>
        )}
        {currentStep == steps.length - 1 && (
          <Button
            // onClick={() => setCurrentStep((prev) => prev + 1)}
            className={"ml-auto"}
            size="lg"
          >
            Confirmer la réservation
          </Button>
        )}
      </div>
    </>
  );
}
