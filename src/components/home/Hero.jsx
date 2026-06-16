"use client";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex h-[90vh] items-center overflow-hidden">
      <div className="via-background from-accent/15 to-secondary-bis/50 absolute inset-0 bg-linear-to-br" />
      <div className="bg-primary/10 absolute top-20 right-10 h-72 w-72 rounded-full blur-3xl" />
      <div className="bg-accent/20 absolute bottom-20 left-10 h-96 w-96 rounded-full blur-3xl" />
      <div className="relative mx-auto grid h-full w-full max-w-7xl items-center gap-16 px-6 pt-10 pb-20 lg:grid-cols-2">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
            <HugeiconsIcon
              icon={SparklesIcon}
              size={24}
              absoluteStrokeWidth={true}
            />
            Extensions de cils sur mesure
          </div>

          <h1 className="font-heading text-5xl leading-[1.1] font-bold tracking-tight md:text-6xl lg:text-7xl">
            Sublimez
            <br />
            <span className="text-primary italic">votre regard</span>
          </h1>

          <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
            Un service d'exception pour des cils sur mesure. Réservez votre
            rendez-vous en quelques clics et découvrez un regard magnifié.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/booking">
              <Button
                size="lg"
                className="shadow-primary/25 hover:shadow-primary/40 border-primary gap-2 px-8 py-6 text-base shadow-lg transition-shadow"
              >
                Réserver maintenant
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={24}
                  absoluteStrokeWidth={true}
                />
              </Button>
            </Link>
            <Link href="#services">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-base"
              >
                Voir les prestations
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="relative hidden h-full lg:block">
          <motion.div
            className="relative h-full w-full overflow-hidden rounded-3xl shadow-xl"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <Image
              src="https://plus.unsplash.com/premium_photo-1661501523837-083813c782d2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Extensions de cils"
              className="h-full w-full object-cover"
              fill
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          </motion.div>
          {/* Floating card */}

          <motion.div
            className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl border bg-white p-5 shadow-lg"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.9 }}
          >
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <HugeiconsIcon
                icon={SparklesIcon}
                size={24}
                absoluteStrokeWidth={true}
                className="text-primary"
              />
            </div>
            <div>
              <p className="font-heading text-lg font-semibold">+500</p>
              <p className="text-muted-foreground text-sm">
                Clientes satisfaites
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
