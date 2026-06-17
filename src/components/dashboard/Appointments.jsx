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
  const now = new Date();

  const upcoming = bookings.filter(
    (b) => ["pending", "confirmed"].includes(b.status) && getEndTime(b) >= now,
  );
  const history = bookings.filter(
    (b) => b.status === "cancelled" || getEndTime(b) < now,
  );

  useEffect(() => {
    async function fetchBookings() {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setBookings(data);
    }
    fetchBookings();
  }, [router]);

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
          {upcoming.map((appointment, i) => (
            <AppointmentCard
              key={i}
              appointment={appointment}
              isUpcoming={true}
            />
          ))}
        </div>
      </div>
      {/* History */}
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
            <AppointmentCard key={i} appointment={appointment} />
          ))}
        </div>
      </div>
    </div>
  );
}
