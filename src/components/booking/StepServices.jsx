"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { useServices } from "@/contexts/ServicesContext";
import StepTitle from "./StepTitle";
import ServiceStepCard from "./ServiceStepCard";

export default function StepServices({ selected, setSelected }) {
  const { services, loading } = useServices();

  function toggleService(service) {
    setSelected((prev) => (prev?._id === service._id ? null : service));
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <StepTitle
        title={"Choisissez votre prestation"}
        subTitle={"Sélectionnez une prestation"}
      />
      <div className="mx-auto mt-6 flex max-w-5xl flex-col gap-3">
        {!loading &&
          services.map((service, i) => (
            <div key={service._id} onClick={() => toggleService(service)}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <ServiceStepCard
                  service={service}
                  isSelected={selected?._id === service._id}
                />
              </motion.div>
            </div>
          ))}
      </div>
    </motion.div>
  );
}
