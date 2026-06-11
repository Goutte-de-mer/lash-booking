import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Booking() {
  return (
    <section className="px-6 py-14">
      <div className="from-primary/10 via-primary/5 to-accent/10 border-primary/10 mx-auto max-w-3xl rounded-3xl border bg-linear-to-br p-12 text-center md:p-16">
        <div className="bg-primary/15 mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full">
          <HugeiconsIcon
            icon={SparklesIcon}
            className="text-primary"
            size={26}
          />
        </div>
        <h2 className="font-heading mb-4 text-3xl font-bold md:text-4xl">
          Prête à sublimer{" "}
          <span className="text-primary italic">votre regard</span> ?
        </h2>
        <p className="text-muted-foreground mx-auto mb-8 max-w-md">
          Réservez votre créneau en quelques clics et offrez-vous le regard dont
          vous rêvez.
        </p>
        <Link href="/booking">
          <Button
            size="lg"
            className={
              "shadow-primary/25 border-0 text-base font-medium shadow-lg"
            }
          >
            Prendre rendez-vous
            <HugeiconsIcon icon={ArrowRight01Icon} />
          </Button>
        </Link>
      </div>
    </section>
  );
}
