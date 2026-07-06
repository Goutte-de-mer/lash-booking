"use client";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, Calendar03Icon } from "@hugeicons/core-free-icons";
import { getEndTime, formatTime, formatDay, formatMonth } from "@/lib/booking";
import AppointmentStatusBadge from "@/components/dashboard/AppointmentStatusBadge";
import ClientAvatar from "./ClientAvatar";
import { Button } from "../ui/button";

export default function ClientDetail({ clientId, onBack }) {
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchClient() {
      const res = await fetch(`/api/admin/clients/${clientId}`);
      if (res.ok) setClient(await res.json());
      setIsLoading(false);
    }
    fetchClient();
  }, [clientId]);

  if (isLoading) return <Spinner className="text-primary mt-8 size-6" />;
  if (!client)
    return (
      <p className="text-destructive mt-8">Impossible de charger la cliente</p>
    );

  const now = new Date();
  const upcoming = client.bookings.filter(
    (b) => b.status !== "cancelled" && getEndTime(b) >= now,
  );
  const totalPaid = client.bookings.reduce(
    (sum, b) => sum + (b.amountPaid ?? 0),
    0,
  );

  return (
    <div className="my-8 space-y-5">
      <Button onClick={onBack} variant="ghost">
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
        Retour à la liste
      </Button>

      <div className="flex items-center gap-4 rounded-2xl bg-white px-8 py-6 shadow">
        <ClientAvatar name={client.name} />
        <div>
          <p className="text-xl font-semibold">{client.name}</p>
          <p className="text-muted-foreground text-sm">{client.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total RDV", value: client.bookings.length },
          { label: "À venir", value: upcoming.length, colored: true },
          { label: "Total payé", value: `${totalPaid}€` },
        ].map(({ label, value, colored }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center rounded-2xl bg-white px-4 py-6 shadow"
          >
            <span
              className={`font-heading text-3xl font-bold ${colored ? "text-primary" : ""}`}
            >
              {value}
            </span>
            <span className="text-muted-foreground mt-1 text-sm">{label}</span>
          </div>
        ))}
      </div>

      {upcoming.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={18}
              className="text-primary"
            />
            Prochains rendez-vous
          </h3>
          <div className="space-y-2">
            {upcoming.map((b) => {
              const start = new Date(b.slotStart);
              return (
                <div
                  key={b._id}
                  className="flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary flex h-12 w-12 flex-col items-center justify-center rounded-xl text-xs font-semibold uppercase">
                      <span>{formatMonth(start)}</span>
                      <span className="font-heading text-lg leading-tight">
                        {formatDay(start)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {formatTime(start)} — {b.serviceId?.name}
                      </p>
                      <AppointmentStatusBadge status={b.status} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
