"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Clock02Icon } from "@hugeicons/core-free-icons";
import { getEndTime } from "@/lib/booking";
import AppointmentCard from "./AppointmentCard";

export default function Appointments() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const now = new Date();

  const upcoming = bookings.filter(
    (b) => ["pending", "confirmed"].includes(b.status) && getEndTime(b) >= now,
  );
  const history = bookings.filter(
    (b) => b.status === "cancelled" || getEndTime(b) < now,
  );

  useEffect(() => {
    async function fetchBookings() {
      let res;
      try {
        res = await fetch("/api/bookings");
      } catch {
        setError("Impossible de contacter le serveur");
        return;
      }

      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        setError("Une erreur est survenue, réessayez plus tard");
        return;
      }

      const data = await res.json();
      setBookings(data);
    }
    fetchBookings();
  }, [router]);

  if (error) {
    return <p className="text-destructive my-8 text-center">{error}</p>;
  }

  return (
    <div className="my-8 space-y-8">
      {/* Next */}
      <div>
        <h2 className="mb-5 flex items-center gap-3 text-2xl">
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={24}
            absoluteStrokeWidth
            className="text-primary"
          />
          Prochain{upcoming?.length > 0 ? "s" : null} rendez-vous
        </h2>
        <div className="space-y-4">
          {upcoming.length === 0 && (
            <p className="text-muted-foreground">
              Vous n'avez aucun rendez-vous à venir
            </p>
          )}
          {upcoming.map((appointment, i) => (
            <AppointmentCard
              key={i}
              appointment={appointment}
              isUpcoming={true}
              onCancelled={(id) =>
                setBookings((prev) =>
                  prev.map((b) =>
                    b._id === id ? { ...b, status: "cancelled" } : b,
                  ),
                )
              }
              delay={i * 0.4}
            />
          ))}
        </div>
      </div>
      {/* History */}
      {history.length > 0 && (
        <div>
          <h2 className="text-muted-foreground mb-5 flex items-center gap-3 text-2xl">
            <HugeiconsIcon
              icon={Clock02Icon}
              size={24}
              absoluteStrokeWidth
              className="text-primary"
            />
            Historique
          </h2>
          <div className="space-y-4">
            {history.map((appointment, i) => (
              <AppointmentCard
                key={i}
                appointment={appointment}
                delay={i * 0.4}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
