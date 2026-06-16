"use client";
import { useServices } from "@/contexts/ServicesContext";
import ServiceCard from "./ServiceCard";

export default function Services() {
  const { services, loading } = useServices();

  return (
    <section className="px-6 py-14" id="services">
      <div className="mb-16 text-center">
        <p className="text-primary mb-3 text-sm font-medium tracking-widest uppercase">
          Nos prestations
        </p>
        <h2 className="font-heading text-4xl font-bold md:text-5xl">
          Des soins <span className="text-primary italic">d'exception</span>
        </h2>
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? null
          : services.map((service, i) => (
              <ServiceCard
                key={service._id}
                title={service.name}
                description={service.description}
                duration={service.duration}
                price={service.price}
                deposit={service.depositAmount}
                delay={i * 250}
              />
            ))}
      </div>
    </section>
  );
}
