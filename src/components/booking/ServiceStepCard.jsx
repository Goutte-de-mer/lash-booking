"use client";
// import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick01Icon, Clock03Icon } from "@hugeicons/core-free-icons";
import { Badge } from "../ui/badge";

export default function ServiceStepCard({ isSelected, service }) {
  return (
    <div
      className={`cursor-pointer shadow-sm transition duration-300 hover:shadow-md ${
        isSelected
          ? "ring-primary/70 bg-primary/5 border-primary/30 ring-2"
          : "bg-white"
      } flex items-center justify-between rounded-lg p-6`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
            isSelected
              ? "bg-primary/70 text-primary-foreground"
              : "bg-secondary-bis"
          }`}
        >
          {isSelected ? (
            <HugeiconsIcon
              icon={Tick01Icon}
              size={20}
              className="text-white"
              strokeWidth={2}
            />
          ) : (
            <span className="text-lg">✨</span>
          )}
        </div>
        <div>
          <h3 className="font-semibold">{service.name}</h3>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {service.description}
          </p>
          <Badge variant="secondary" className="mt-2 gap-1 text-xs">
            <HugeiconsIcon icon={Clock03Icon} size={15} />
            {service.duration} min
          </Badge>
        </div>
      </div>
      <div className="ml-4 shrink-0 text-right">
        <p className="font-heading text-primary text-2xl font-bold">
          {service.price}€
        </p>
        <p className="text-muted-foreground text-xs">
          Acompte {service.depositAmount}€
        </p>
      </div>
    </div>
  );
}
