"use client";
import { useEffect, useState } from "react";
import { getEndTime } from "@/lib/booking";
import { Spinner } from "@/components/ui/spinner";

export default function NextAppointment() {
  const [bookings, setBookings] = useState([]);
  const [now, setNow] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      const res = await fetch("/api/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setBookings(await res.json());
      setIsLoading(false);
    }
    fetchBookings();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 50_000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <Spinner className="text-primary size-6" />;

  const next = bookings
    .filter((b) => b.userId && getEndTime(b) >= now)
    .sort((a, b) => new Date(a.slotStart) - new Date(b.slotStart))[0];

  if (!next) return <p>Aucun rendez-vous à venir</p>;

  const start = new Date(next.slotStart);

  const date = start.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const time = start.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      <p>{next.userId.name}</p>
      <p>{next.serviceId.name}</p>
      <p>{date}</p>
      <p>{time}</p>
    </div>
  );
}
