"use client";
import { useState } from "react";
import Steps from "@/components/booking/Steps";
import StepServices from "@/components/booking/StepServices";
import StepSlot from "@/components/booking/StepSlot";
import StepPayment from "@/components/booking/StepPayment";
import StepConfirm from "@/components/booking/StepConfirm";
import { AnimatePresence } from "motion/react";

export default function BookingTunnel({ workingHours }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [serviceSelected, setServiceSelected] = useState(null);
  const [slotSelected, setSlotSelected] = useState(null);
  const [paymentType, setPaymentType] = useState(null);

  const stepComponents = [
    <StepServices
      key="services"
      selected={serviceSelected}
      setSelected={setServiceSelected}
    />,
    <StepSlot
      key="slot"
      selectedService={serviceSelected}
      workingHours={workingHours}
      selectedSlot={slotSelected}
      setSelectedSlot={setSlotSelected}
    />,
    <StepPayment
      key="payment"
      slot={slotSelected}
      service={serviceSelected}
      paymentType={paymentType}
      setPaymentType={setPaymentType}
    />,
    <StepConfirm
      key="confirm"
      slot={slotSelected}
      service={serviceSelected}
      paymentType={paymentType}
    />,
  ];

  return (
    <div className="flex flex-1 flex-col pb-8">
      <Steps
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        service={serviceSelected}
        selectedSlot={slotSelected}
        paymentType={paymentType}
      >
        <AnimatePresence mode="wait">
          {stepComponents[currentStep]}
        </AnimatePresence>
      </Steps>
    </div>
  );
}
