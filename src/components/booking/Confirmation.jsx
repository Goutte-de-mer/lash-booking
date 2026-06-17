import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle04Icon,
  Calendar03Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import Link from "next/link";

export default function Confirmation() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      //   exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="mx-auto flex max-w-md flex-col items-center justify-center gap-y-4 px-3"
    >
      <div className="flex h-18 w-18 items-center justify-center rounded-full bg-green-100">
        <HugeiconsIcon
          icon={CheckmarkCircle04Icon}
          size={40}
          absoluteStrokeWidth
          className="text-green-500"
        />
      </div>
      <h1>Réservation confirmée !</h1>
      <p className="text-muted-foreground text-center">
        Votre rendez-vous a bien été enregistré. Vous pouvez le retrouver dans
        votre espace personnel.
      </p>
      <div className="flex items-center gap-4">
        <Button asChild size="lg" className={"border-0 shadow"}>
          <Link href="/dashboard">
            <HugeiconsIcon icon={Calendar03Icon} size={18} />
            Mes rendez-vous
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">
            Retour à l'accueil
            <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
