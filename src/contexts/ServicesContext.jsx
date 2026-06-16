"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ServicesContext = createContext(null);

export function ServicesProvider({ children }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
      setLoading(false);
    }
    fetchServices();
  }, []);

  return (
    <ServicesContext.Provider value={{ services, loading }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  return useContext(ServicesContext);
}
