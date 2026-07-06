"use client";

import { Button } from "@/components/ui/button";

export default function BookingError({ error, unstable_retry }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20 text-center">
      <h2 className="text-xl font-semibold">Une erreur est survenue</h2>
      <p className="text-muted-foreground">
        Le service de réservation est momentanément indisponible, réessayez
        plus tard.
      </p>
      <Button onClick={() => unstable_retry()}>Réessayer</Button>
    </div>
  );
}
