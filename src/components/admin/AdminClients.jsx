"use client";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import ClientList from "./ClientList";
import ClientDetail from "./ClientDetail";

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    async function fetchClients() {
      const res = await fetch("/api/admin/clients");
      if (res.ok) setClients(await res.json());
      setIsLoading(false);
    }
    fetchClients();
  }, []);

  if (isLoading) return <Spinner className="text-primary mt-8 size-6" />;

  if (!clients.length)
    return (
      <p className="text-muted-foreground mt-8">Aucune cliente enregistrée</p>
    );

  if (selectedId)
    return (
      <ClientDetail clientId={selectedId} onBack={() => setSelectedId(null)} />
    );

  return <ClientList clients={clients} onSelect={setSelectedId} />;
}