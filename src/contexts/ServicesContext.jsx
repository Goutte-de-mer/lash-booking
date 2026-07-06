"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ServicesContext = createContext(null);

export function ServicesProvider({ children }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) {
          setError("Une erreur est survenue, réessayez plus tard");
          return;
        }
        const data = await res.json();
        setServices(data);
      } catch {
        setError("Impossible de contacter le serveur");
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <ServicesContext.Provider value={{ services, loading, error }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  return useContext(ServicesContext);
}
