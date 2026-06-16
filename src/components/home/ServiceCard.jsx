"use client";
import { motion } from "motion/react";
import DurationBadge from "./DurationBadge";

export default function ServiceCard({
  title,
  description,
  duration,
  price,
  deposit,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: "easeOut" }}
      className="text-card-foreground border-border/50 bg-card/80 mx-auto h-full w-full max-w-md overflow-hidden rounded-xl border shadow backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="flex h-full flex-col p-8">
        <div className="bg-primary/10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl">
          <span className="text-2xl">✨</span>
        </div>
        <h3 className="font-heading mb-3 text-xl">{title}</h3>
        <p className="text-muted-foreground mb-10 flex-1 text-sm leading-relaxed">
          {description}
        </p>
        <div className="border-border/50 flex items-center justify-between border-t pt-4">
          <DurationBadge duration={duration} />
          <div className="text-right">
            <p className="font-heading text-primary text-2xl font-bold">
              {price}€
            </p>
            <p className="text-muted-foreground text-xs">Acompte {deposit}€</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
